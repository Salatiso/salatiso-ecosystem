/**
 * Notification Delivery Service
 * 
 * Handles sending notifications through various channels respecting user preferences,
 * quiet hours, and delivery rules.
 */

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  NotificationPayload,
  NotificationRecord,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
} from '@/types/notifications';
import { notificationPreferencesService } from './notificationPreferencesService';
import { notificationService } from './notificationService';

class NotificationDeliveryService {
  /**
   * Send a notification to a user, respecting their preferences
   */
  async sendNotification(payload: NotificationPayload): Promise<string> {
    try {
      // Check user preferences
      const preferences = await notificationPreferencesService.getUserPreferences(payload.userId);

      // Check do not disturb
      const isInDND = await notificationPreferencesService.isInDoNotDisturb(payload.userId);
      if (isInDND && payload.priority !== NotificationPriority.CRITICAL) {
        // Skip sending, but still record it
        return this.recordNotificationSkipped(payload, 'user_in_dnd');
      }

      // Check notification type enabled
      if (!this.isNotificationTypeEnabled(payload.type, preferences)) {
        return this.recordNotificationSkipped(payload, 'type_disabled');
      }

      // Determine which channels to use
      const channels = await this.determineChannels(payload, preferences);

      if (channels.length === 0) {
        return this.recordNotificationSkipped(payload, 'no_channels_enabled');
      }

      // Create notification record
      const recordId = await this.createNotificationRecord(payload, channels);

      // Send through each channel
      const deliveryResults = await Promise.allSettled(
        channels.map(channel => this.sendViaChannel(channel, payload, recordId, preferences))
      );

      // Update record with delivery status
      await this.updateDeliveryStatus(recordId, deliveryResults);

      return recordId;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendToMultipleUsers(
    userIds: string[],
    payload: Omit<NotificationPayload, 'userId'>
  ): Promise<Map<string, string | Error>> {
    const results = new Map<string, string | Error>();

    for (const userId of userIds) {
      try {
        const recordId = await this.sendNotification({
          ...payload,
          userId,
        });
        results.set(userId, recordId);
      } catch (error) {
        results.set(userId, error instanceof Error ? error : new Error(String(error)));
      }
    }

    return results;
  }

  /**
   * Send notifications by role/criteria
   */
  async sendNotificationsByRole(
    role: string,
    payload: Omit<NotificationPayload, 'userId'>
  ): Promise<Map<string, string | Error>> {
    try {
      // Query users with specified role
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', role)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const userIds = usersSnapshot.docs.map(doc => doc.id);

      return this.sendToMultipleUsers(userIds, payload);
    } catch (error) {
      console.error('Error sending notifications by role:', error);
      throw error;
    }
  }

  /**
   * Get user's notification history
   */
  async getNotificationHistory(
    userId: string,
    options?: {
      limit?: number;
      unreadOnly?: boolean;
      type?: NotificationType;
      archived?: boolean;
    }
  ): Promise<NotificationRecord[]> {
    try {
      let q = query(
        collection(db, 'users', userId, 'notifications'),
        where('archived', '==', options?.archived ?? false),
        orderBy('createdAt', 'desc'),
        limit(options?.limit ?? 50)
      );

      if (options?.unreadOnly) {
        q = query(
          collection(db, 'users', userId, 'notifications'),
          where('read', '==', false),
          where('archived', '==', options.archived ?? false),
          orderBy('createdAt', 'desc'),
          limit(options?.limit ?? 50)
        );
      }

      if (options?.type) {
        q = query(
          collection(db, 'users', userId, 'notifications'),
          where('type', '==', options.type),
          where('archived', '==', options.archived ?? false),
          orderBy('createdAt', 'desc'),
          limit(options?.limit ?? 50)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as NotificationRecord));
    } catch (error) {
      console.error('Error getting notification history:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
      await updateDoc(notifRef, {
        read: true,
        readAt: new Date(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      const unreadQuery = query(
        collection(db, 'users', userId, 'notifications'),
        where('read', '==', false)
      );

      const snapshot = await getDocs(unreadQuery);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          readAt: new Date(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Archive notification
   */
  async archiveNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
      await updateDoc(notifRef, {
        archived: true,
        archivedAt: new Date(),
      });
    } catch (error) {
      console.error('Error archiving notification:', error);
      throw error;
    }
  }

  /**
   * Delete notification (soft delete)
   */
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
      await updateDoc(notifRef, {
        archived: true,
        archivedAt: new Date(),
        deletedAt: new Date(),
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Record action taken on notification
   */
  async recordNotificationAction(
    userId: string,
    notificationId: string,
    actionType: string
  ): Promise<void> {
    try {
      const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
      await updateDoc(notifRef, {
        actionTaken: true,
        actionTakenAt: new Date(),
        actionType,
      });
    } catch (error) {
      console.error('Error recording notification action:', error);
      throw error;
    }
  }

  /**
   * Get notification count
   */
  async getNotificationCounts(userId: string): Promise<{
    total: number;
    unread: number;
    urgent: number;
  }> {
    try {
      const totalQuery = query(
        collection(db, 'users', userId, 'notifications'),
        where('archived', '==', false)
      );
      const totalSnapshot = await getDocs(totalQuery);

      const unreadQuery = query(
        collection(db, 'users', userId, 'notifications'),
        where('read', '==', false),
        where('archived', '==', false)
      );
      const unreadSnapshot = await getDocs(unreadQuery);

      const urgentQuery = query(
        collection(db, 'users', userId, 'notifications'),
        where('priority', '==', NotificationPriority.CRITICAL),
        where('archived', '==', false)
      );
      const urgentSnapshot = await getDocs(urgentQuery);

      return {
        total: totalSnapshot.size,
        unread: unreadSnapshot.size,
        urgent: urgentSnapshot.size,
      };
    } catch (error) {
      console.error('Error getting notification counts:', error);
      return { total: 0, unread: 0, urgent: 0 };
    }
  }

  /**
   * Clean up old notifications
   */
  async cleanupOldNotifications(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);

      let deletedCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        const notificationsQuery = query(
          collection(db, 'users', userDoc.id, 'notifications'),
          where('createdAt', '<', cutoffDate),
          where('archived', '==', true)
        );

        const notificationsSnapshot = await getDocs(notificationsQuery);
        const batch = writeBatch(db);

        notificationsSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
          deletedCount++;
        });

        if (notificationsSnapshot.docs.length > 0) {
          await batch.commit();
        }
      }

      console.log(`Cleaned up ${deletedCount} old notifications`);
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Check if notification type is enabled for user
   */
  private isNotificationTypeEnabled(
    type: NotificationType,
    preferences: any
  ): boolean {
    const typeMap: { [key in NotificationType]: keyof typeof preferences.types } = {
      [NotificationType.ESCALATION_CREATED]: 'escalationCreated',
      [NotificationType.ESCALATION_ASSIGNED]: 'escalationAssigned',
      [NotificationType.ESCALATION_ESCALATED]: 'escalationEscalated',
      [NotificationType.ESCALATION_RESOLVED]: 'escalationResolved',
      [NotificationType.ESCALATION_URGENT]: 'escalationUrgent',
      [NotificationType.RESPONSE_DUE]: 'responseDue',
      [NotificationType.ASSIGNMENT_ACKNOWLEDGED]: 'assignmentAcknowledged',
      [NotificationType.COMMENT_ADDED]: 'commentAdded',
      [NotificationType.STATUS_CHANGED]: 'statusChanged',
      [NotificationType.CUSTOM]: 'escalationCreated',
    };

    const key = typeMap[type];
    return preferences.types?.[key] ?? true;
  }

  /**
   * Determine which channels to use for notification
   */
  private async determineChannels(
    payload: NotificationPayload,
    preferences: any
  ): Promise<NotificationChannel[]> {
    const channels: NotificationChannel[] = [];

    for (const channel of payload.channels) {
      if (!preferences.channels?.[channel]?.enabled) {
        continue;
      }

      // Check quiet hours for this channel
      const inQuietHours = await notificationPreferencesService.isInQuietHours(
        payload.userId,
        channel,
        payload.type
      );

      if (inQuietHours && payload.priority !== NotificationPriority.CRITICAL) {
        continue;
      }

      channels.push(channel);
    }

    return channels;
  }

  /**
   * Send notification via specific channel
   */
  private async sendViaChannel(
    channel: NotificationChannel,
    payload: NotificationPayload,
    recordId: string,
    preferences: any
  ): Promise<{ status: string; error?: string }> {
    try {
      switch (channel) {
        case NotificationChannel.WEB:
          // Display in-app notification via toast or notification center
          return this.sendWebNotification(payload);

        case NotificationChannel.PUSH:
          // Send browser push notification
          return this.sendPushNotification(payload);

        case NotificationChannel.EMAIL:
          // Send email (would integrate with email service like SendGrid)
          return { status: 'pending' }; // Placeholder

        case NotificationChannel.SMS:
          // Send SMS (would integrate with SMS service like Twilio)
          return { status: 'pending' }; // Placeholder

        default:
          return { status: 'failed', error: 'Unknown channel' };
      }
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send web notification via toast
   */
  private sendWebNotification(payload: NotificationPayload): { status: string; error?: string } {
    try {
      // Use existing toast system
      const { toastManager } = require('@/utils/toast');

      const toastType = payload.priority === NotificationPriority.CRITICAL ? 'error' : 'info';
      toastManager[toastType](payload.message, {
        duration: payload.priority === NotificationPriority.CRITICAL ? 10000 : 5000,
      });

      return { status: 'sent' };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to send web notification',
      };
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(payload: NotificationPayload): Promise<{ status: string; error?: string }> {
    try {
      notificationService.showNotification({
        title: payload.title,
        body: payload.body || payload.message,
        icon: payload.icon,
        data: payload.data,
        requireInteraction: payload.priority === NotificationPriority.CRITICAL,
      });

      return { status: 'sent' };
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to send push notification',
      };
    }
  }

  /**
   * Create notification record in Firestore
   */
  private async createNotificationRecord(
    payload: NotificationPayload,
    channels: NotificationChannel[]
  ): Promise<string> {
    const record: NotificationRecord = {
      id: '', // Will be set by Firestore
      userId: payload.userId,
      type: payload.type,
      priority: payload.priority,
      title: payload.title,
      message: payload.message,
      body: payload.body,
      data: payload.data,
      channels,
      deliveryStatus: {},
      read: false,
      actionTaken: false,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(
      collection(db, 'users', payload.userId, 'notifications'),
      {
        ...record,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
    );

    return docRef.id;
  }

  /**
   * Update delivery status after sending
   */
  private async updateDeliveryStatus(
    recordId: string,
    deliveryResults: PromiseSettledResult<{ status: string; error?: string }>[]
  ): Promise<void> {
    // Implementation would update the notification record with delivery status
    console.log('Delivery results:', deliveryResults);
  }

  /**
   * Record skipped notification
   */
  private async recordNotificationSkipped(
    payload: NotificationPayload,
    reason: string
  ): Promise<string> {
    console.log(`Notification skipped for ${payload.userId}: ${reason}`);
    return `skipped-${reason}`;
  }
}

export const notificationDeliveryService = new NotificationDeliveryService();
export default notificationDeliveryService;
