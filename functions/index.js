const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/https");
const {onDocumentCreated} = require("firebase-functions/firestore");
const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// ===================================================================
// CUSTOM CLOUD FUNCTIONS
// ==================================================================

// Cloud Function to submit test results
exports.submitTestResults = onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
    );
  }

  const {testType, appTested, overallRating, sections, deviceInfo, feedback} =
    data;

  try {
    const testResult = {
      userId: context.auth.uid,
      testType,
      appTested,
      overallRating,
      sections,
      deviceInfo,
      feedback,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      lifecvProofId: null, // Will be set if LifeCV integration is enabled
    };

    const docRef = await admin.firestore()
        .collection("testResults")
        .add(testResult);

    // Update analytics
    const analyticsRef = admin.firestore()
        .collection("analytics")
        .doc("testing");
    await analyticsRef.set({
      totalTests: admin.firestore.FieldValue.increment(1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    logger.info("Test results submitted", {
      userId: context.auth.uid,
      testType,
      docId: docRef.id,
    });

    return {success: true, docId: docRef.id};
  } catch (error) {
    logger.error("Error submitting test results", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to submit test results",
    );
  }
});

// Cloud Function to track template downloads
exports.trackTemplateDownload = onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
    );
  }

  const {templateId, templateName, category} = data;

  try {
    // Record the download
    await admin.firestore().collection("templateUsage").add({
      userId: context.auth.uid,
      templateId,
      templateName,
      category,
      action: "download",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update template analytics
    const templateRef = admin.firestore()
        .collection("templateAnalytics")
        .doc(templateId);
    await templateRef.set({
      templateId,
      templateName,
      category,
      downloadCount: admin.firestore.FieldValue.increment(1),
      lastDownloaded: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    logger.info("Template download tracked", {
      userId: context.auth.uid,
      templateId,
    });

    return {success: true};
  } catch (error) {
    logger.error("Error tracking template download", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to track download",
    );
  }
});

// Cloud Function to get template analytics
exports.getTemplateAnalytics = onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
    );
  }

  try {
    const analyticsSnapshot = await admin.firestore()
        .collection("templateAnalytics")
        .orderBy("downloadCount", "desc")
        .limit(20)
        .get();

    const analytics = [];
    analyticsSnapshot.forEach((doc) => {
      analytics.push(doc.data());
    });

    return {success: true, analytics};
  } catch (error) {
    logger.error("Error getting template analytics", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to get analytics",
    );
  }
});

// Cloud Function to get testing analytics
exports.getTestingAnalytics = onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
    );
  }

  try {
    const analyticsDoc = await admin.firestore()
        .collection("analytics")
        .doc("testing")
        .get();

    if (analyticsDoc.exists) {
      return {success: true, analytics: analyticsDoc.data()};
    } else {
      return {
        success: true,
        analytics: {totalTests: 0, lastUpdated: null},
      };
    }
  } catch (error) {
    logger.error("Error getting testing analytics", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to get analytics",
    );
  }
});

// Firestore trigger to update template ratings when reviews are added
exports.onTemplateReviewCreated = onDocumentCreated(
    "templateReviews/{reviewId}",
    async (event) => {
      const reviewData = event.data.data();
      const templateId = reviewData.templateId;

      try {
        // Get all reviews for this template
        const reviewsSnapshot = await admin.firestore()
            .collection("templateReviews")
            .where("templateId", "==", templateId)
            .get();

        let totalRating = 0;
        let reviewCount = 0;

        reviewsSnapshot.forEach((doc) => {
          const review = doc.data();
          totalRating += review.rating;
          reviewCount++;
        });

        const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

        // Update template analytics
        await admin.firestore()
            .collection("templateAnalytics")
            .doc(templateId)
            .set({
              averageRating,
              reviewCount,
              lastReviewed: admin.firestore.FieldValue.serverTimestamp(),
            }, {merge: true});

        logger.info("Template rating updated", {
          templateId,
          averageRating,
          reviewCount,
        });
      } catch (error) {
        logger.error("Error updating template rating", error);
      }
    },
);

// NOTIFICATION FUNCTIONS

// Send push notification to a specific user
exports.sendNotificationToUser = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, title, body, data: notificationData = {} } = data;

  if (!userId || !title || !body) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  try {
    // Get user document to retrieve FCM token
    const userDoc = await admin.firestore().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    if (!fcmToken) {
      throw new functions.https.HttpsError('failed-precondition', 'User has no FCM token');
    }

    // Check if user has push notifications enabled
    if (!userData.notificationsEnabled) {
      return { success: false, message: 'Push notifications disabled for user' };
    }

    // Send notification
    const message = {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
      data: {
        ...notificationData,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);

    return {
      success: true,
      messageId: response,
      message: 'Notification sent successfully'
    };

  } catch (error) {
    logger.error('Error sending notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification');
  }
});

// Send notification to multiple users
exports.sendNotificationToUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userIds, title, body, data: notificationData = {} } = data;

  if (!Array.isArray(userIds) || userIds.length === 0 || !title || !body) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid parameters');
  }

  const results = [];
  const errors = [];

  for (const userId of userIds) {
    try {
      const result = await admin.firestore().runTransaction(async (transaction) => {
        const userRef = admin.firestore().collection('users').doc(userId);
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          throw new Error('User not found');
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken || !userData.notificationsEnabled) {
          return { userId, skipped: true, reason: 'No token or notifications disabled' };
        }

        const message = {
          token: fcmToken,
          notification: {
            title: title,
            body: body,
          },
          data: {
            ...notificationData,
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
          },
        };

        const response = await admin.messaging().send(message);
        return { userId, success: true, messageId: response };
      });

      results.push(result);
    } catch (error) {
      logger.error(`Error sending to user ${userId}:`, error);
      errors.push({ userId, error: error.message });
    }
  }

  return {
    results,
    errors,
    summary: {
      total: userIds.length,
      successful: results.filter(r => r.success).length,
      skipped: results.filter(r => r.skipped).length,
      failed: errors.length,
    }
  };
});

// ===================================================================
// FIRESTORE TRIGGER FUNCTIONS - TEMPORARILY DISABLED
// These use v1 API and need to be converted to v2
// ===================================================================

// Handle family announcements (triggered by Firestore writes)
// TODO: Convert to v2 API
/*
exports.onFamilyAnnouncementCreate = functions.firestore
  .document('announcements/{announcementId}')
  .onCreate(async (snap, context) => {
    const announcement = snap.data();
    const announcementId = context.params.announcementId;

    try {
      // Get all users who should receive family announcements
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('preferences.notifications.familyAnnouncements', '==', true)
        .where('notificationsEnabled', '==', true)
        .get();

      const tokens = [];
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.fcmToken) {
          tokens.push(userData.fcmToken);
        }
      });

      if (tokens.length === 0) {
        logger.log('No users to notify');
        return;
      }

      // Send multicast message
      const message = {
        tokens: tokens,
        notification: {
          title: 'Family Announcement',
          body: announcement.title || 'New family announcement',
        },
        data: {
          type: 'announcement',
          announcementId: announcementId,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
      };

      const response = await admin.messaging().sendMulticast(message);

      logger.log(`Sent announcement to ${response.successCount} users`);

      return response;
    } catch (error) {
      logger.error('Error sending announcement notifications:', error);
      throw error;
    }
  });
*/

// Handle project updates - DISABLED (v1 API)
/*
exports.onProjectUpdate = functions.firestore
  .document('projects/{projectId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const projectId = context.params.projectId;

    // Only notify if there are significant changes
    if (JSON.stringify(newData) === JSON.stringify(oldData)) {
      return;
    }

    try {
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('preferences.notifications.projectUpdates', '==', true)
        .where('notificationsEnabled', '==', true)
        .get();

      const tokens = [];
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.fcmToken) {
          tokens.push(userData.fcmToken);
        }
      });

      if (tokens.length === 0) {
        return;
      }

      const message = {
        tokens: tokens,
        notification: {
          title: 'Project Update',
          body: `Updates to ${newData.name || 'project'}`,
        },
        data: {
          type: 'project',
          projectId: projectId,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
      };

      const response = await admin.messaging().sendMulticast(message);
      logger.log(`Sent project update to ${response.successCount} users`);

      return response;
    } catch (error) {
      logger.error('Error sending project notifications:', error);
      throw error;
    }
  });
*/

// Handle achievement notifications - DISABLED (v1 API)
/*
exports.onAchievementEarned = functions.firestore
  .document('users/{userId}/achievements/{achievementId}')
  .onCreate(async (snap, context) => {
    const achievement = snap.data();
    const userId = context.params.userId;
    const achievementId = context.params.achievementId;

    try {
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (!userData.fcmToken || !userData.notificationsEnabled ||
          !userData.preferences?.notifications?.careerMilestones) {
        return;
      }

      const message = {
        token: userData.fcmToken,
        notification: {
          title: 'Achievement Unlocked! 🎉',
          body: `Congratulations! You earned: ${achievement.name || 'an achievement'}`,
        },
        data: {
          type: 'achievement',
          userId: userId,
          achievementId: achievementId,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
      };

      const response = await admin.messaging().send(message);
      logger.log(`Sent achievement notification to user ${userId}`);

      return response;
    } catch (error) {
      logger.error('Error sending achievement notification:', error);
      throw error;
    }
  });
*/
