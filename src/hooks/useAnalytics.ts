import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  setUserProperties,
  trackTiming,
  trackException,
  ANALYTICS_EVENTS,
  CUSTOM_DIMENSIONS,
} from '@/config/analytics';

interface UseAnalyticsReturn {
  // Page tracking
  trackPageView: (page: string, title?: string) => void;

  // User events
  trackLogin: (method: string) => void;
  trackLogout: () => void;
  trackRegistration: (method: string) => void;

  // Navigation
  trackNavigation: (from: string, to: string) => void;

  // Family & Social
  trackFamilyMemberView: (memberId: string, memberName: string) => void;
  trackFamilyUpdate: (updateType: string, updateId: string) => void;
  trackAnnouncementRead: (announcementId: string, title: string) => void;

  // Learning
  trackCourseStart: (courseId: string, courseName: string) => void;
  trackCourseComplete: (courseId: string, courseName: string, score?: number) => void;
  trackLessonView: (lessonId: string, lessonName: string, courseId: string) => void;
  trackQuizAttempt: (quizId: string, quizName: string) => void;
  trackQuizComplete: (quizId: string, quizName: string, score: number, passed: boolean) => void;

  // Business
  trackProjectView: (projectId: string, projectName: string) => void;
  trackProjectUpdate: (projectId: string, updateType: string) => void;
  trackBusinessPlanView: (planId: string, planName: string) => void;
  trackCareerPathView: (pathId: string, pathName: string) => void;

  // Templates & Tools
  trackTemplateDownload: (templateId: string, templateName: string, category: string) => void;
  trackTemplateUse: (templateId: string, templateName: string) => void;
  trackToolUsage: (toolName: string, action: string) => void;

  // Gamification
  trackAchievementUnlock: (achievementId: string, achievementName: string) => void;
  trackBadgeEarn: (badgeId: string, badgeName: string) => void;
  trackLevelUp: (newLevel: number, xpGained: number) => void;
  trackLeaderboardView: () => void;

  // Communication
  trackMessageSend: (recipientId: string, messageType: string) => void;
  trackNotificationClick: (notificationId: string, notificationType: string) => void;
  trackContactView: (contactId: string, contactName: string) => void;

  // Testing
  trackBetaTestStart: (testId: string, testName: string) => void;
  trackBetaTestComplete: (testId: string, testName: string, rating: number) => void;
  trackFeedbackSubmit: (feedbackType: string, rating: number) => void;

  // Search & Content
  trackSearch: (query: string, resultsCount: number, category?: string) => void;
  trackContentShare: (contentId: string, contentType: string, platform: string) => void;
  trackBookDownload: (bookId: string, bookName: string) => void;

  // Technical
  trackError: (error: Error, context?: string) => void;
  trackPerformance: (metric: string, value: number, category?: string) => void;
  trackFeatureUsage: (featureName: string, action: string, metadata?: Record<string, any>) => void;

  // Session tracking
  trackSessionStart: () => void;
  trackSessionEnd: (duration: number) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { user } = useAuth();

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Update user properties when user changes
  useEffect(() => {
    if (user) {
      setUserProperties({
        user_id: user.id,
        [CUSTOM_DIMENSIONS.USER_ROLE]: user.role,
        [CUSTOM_DIMENSIONS.LANGUAGE]: user.preferences?.language || 'en',
        [CUSTOM_DIMENSIONS.USER_LEVEL]: user.gamification?.level || 1,
      });
    }
  }, [user]);

  // Page tracking
  const handleTrackPageView = useCallback((page: string, title?: string) => {
    trackPageView(page, title);
  }, []);

  // User events
  const trackLogin = useCallback((method: string) => {
    trackEvent(ANALYTICS_EVENTS.USER_LOGIN, 'authentication', method);
  }, []);

  const trackLogout = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.USER_LOGOUT, 'authentication');
  }, []);

  const trackRegistration = useCallback((method: string) => {
    trackEvent(ANALYTICS_EVENTS.USER_REGISTER, 'authentication', method);
  }, []);

  // Navigation
  const trackNavigation = useCallback((from: string, to: string) => {
    trackEvent(ANALYTICS_EVENTS.NAVIGATION, 'navigation', `${from} -> ${to}`);
  }, []);

  // Family & Social
  const trackFamilyMemberView = useCallback((memberId: string, memberName: string) => {
    trackEvent(ANALYTICS_EVENTS.FAMILY_MEMBER_VIEW, 'family', memberName, undefined, {
      member_id: memberId,
    });
  }, []);

  const trackFamilyUpdate = useCallback((updateType: string, updateId: string) => {
    trackEvent(ANALYTICS_EVENTS.FAMILY_UPDATE_POST, 'family', updateType, undefined, {
      update_id: updateId,
    });
  }, []);

  const trackAnnouncementRead = useCallback((announcementId: string, title: string) => {
    trackEvent(ANALYTICS_EVENTS.FAMILY_ANNOUNCEMENT_READ, 'announcements', title, undefined, {
      announcement_id: announcementId,
    });
  }, []);

  // Learning
  const trackCourseStart = useCallback((courseId: string, courseName: string) => {
    trackEvent(ANALYTICS_EVENTS.COURSE_START, 'learning', courseName, undefined, {
      course_id: courseId,
    });
  }, []);

  const trackCourseComplete = useCallback((courseId: string, courseName: string, score?: number) => {
    trackEvent(ANALYTICS_EVENTS.COURSE_COMPLETE, 'learning', courseName, score, {
      course_id: courseId,
    });
  }, []);

  const trackLessonView = useCallback((lessonId: string, lessonName: string, courseId: string) => {
    trackEvent(ANALYTICS_EVENTS.LESSON_VIEW, 'learning', lessonName, undefined, {
      lesson_id: lessonId,
      course_id: courseId,
    });
  }, []);

  const trackQuizAttempt = useCallback((quizId: string, quizName: string) => {
    trackEvent(ANALYTICS_EVENTS.QUIZ_ATTEMPT, 'learning', quizName, undefined, {
      quiz_id: quizId,
    });
  }, []);

  const trackQuizComplete = useCallback((quizId: string, quizName: string, score: number, passed: boolean) => {
    trackEvent(ANALYTICS_EVENTS.QUIZ_COMPLETE, 'learning', quizName, score, {
      quiz_id: quizId,
      passed: passed ? 1 : 0,
    });
  }, []);

  // Business
  const trackProjectView = useCallback((projectId: string, projectName: string) => {
    trackEvent(ANALYTICS_EVENTS.PROJECT_VIEW, 'business', projectName, undefined, {
      project_id: projectId,
    });
  }, []);

  const trackProjectUpdate = useCallback((projectId: string, updateType: string) => {
    trackEvent(ANALYTICS_EVENTS.PROJECT_UPDATE, 'business', updateType, undefined, {
      project_id: projectId,
    });
  }, []);

  const trackBusinessPlanView = useCallback((planId: string, planName: string) => {
    trackEvent(ANALYTICS_EVENTS.BUSINESS_PLAN_VIEW, 'business', planName, undefined, {
      plan_id: planId,
    });
  }, []);

  const trackCareerPathView = useCallback((pathId: string, pathName: string) => {
    trackEvent(ANALYTICS_EVENTS.CAREER_PATH_VIEW, 'business', pathName, undefined, {
      path_id: pathId,
    });
  }, []);

  // Templates & Tools
  const trackTemplateDownload = useCallback((templateId: string, templateName: string, category: string) => {
    trackEvent(ANALYTICS_EVENTS.TEMPLATE_DOWNLOAD, 'templates', templateName, undefined, {
      template_id: templateId,
      category,
    });
  }, []);

  const trackTemplateUse = useCallback((templateId: string, templateName: string) => {
    trackEvent(ANALYTICS_EVENTS.TEMPLATE_USE, 'templates', templateName, undefined, {
      template_id: templateId,
    });
  }, []);

  const trackToolUsage = useCallback((toolName: string, action: string) => {
    trackEvent(ANALYTICS_EVENTS.TOOL_USAGE, 'tools', toolName, undefined, {
      action,
    });
  }, []);

  // Gamification
  const trackAchievementUnlock = useCallback((achievementId: string, achievementName: string) => {
    trackEvent(ANALYTICS_EVENTS.ACHIEVEMENT_UNLOCK, 'gamification', achievementName, undefined, {
      achievement_id: achievementId,
    });
  }, []);

  const trackBadgeEarn = useCallback((badgeId: string, badgeName: string) => {
    trackEvent(ANALYTICS_EVENTS.BADGE_EARN, 'gamification', badgeName, undefined, {
      badge_id: badgeId,
    });
  }, []);

  const trackLevelUp = useCallback((newLevel: number, xpGained: number) => {
    trackEvent(ANALYTICS_EVENTS.LEVEL_UP, 'gamification', `Level ${newLevel}`, xpGained, {
      new_level: newLevel,
      xp_gained: xpGained,
    });
  }, []);

  const trackLeaderboardView = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.LEADERBOARD_VIEW, 'gamification');
  }, []);

  // Communication
  const trackMessageSend = useCallback((recipientId: string, messageType: string) => {
    trackEvent(ANALYTICS_EVENTS.MESSAGE_SEND, 'communication', messageType, undefined, {
      recipient_id: recipientId,
    });
  }, []);

  const trackNotificationClick = useCallback((notificationId: string, notificationType: string) => {
    trackEvent(ANALYTICS_EVENTS.NOTIFICATION_CLICK, 'communication', notificationType, undefined, {
      notification_id: notificationId,
    });
  }, []);

  const trackContactView = useCallback((contactId: string, contactName: string) => {
    trackEvent(ANALYTICS_EVENTS.CONTACT_VIEW, 'communication', contactName, undefined, {
      contact_id: contactId,
    });
  }, []);

  // Testing
  const trackBetaTestStart = useCallback((testId: string, testName: string) => {
    trackEvent(ANALYTICS_EVENTS.BETA_TEST_START, 'testing', testName, undefined, {
      test_id: testId,
    });
  }, []);

  const trackBetaTestComplete = useCallback((testId: string, testName: string, rating: number) => {
    trackEvent(ANALYTICS_EVENTS.BETA_TEST_COMPLETE, 'testing', testName, rating, {
      test_id: testId,
    });
  }, []);

  const trackFeedbackSubmit = useCallback((feedbackType: string, rating: number) => {
    trackEvent(ANALYTICS_EVENTS.FEEDBACK_SUBMIT, 'testing', feedbackType, rating);
  }, []);

  // Search & Content
  const trackSearch = useCallback((query: string, resultsCount: number, category?: string) => {
    trackEvent(ANALYTICS_EVENTS.SEARCH_PERFORM, 'search', query, resultsCount, {
      category,
    });
  }, []);

  const trackContentShare = useCallback((contentId: string, contentType: string, platform: string) => {
    trackEvent(ANALYTICS_EVENTS.CONTENT_SHARE, 'content', contentType, undefined, {
      content_id: contentId,
      platform,
    });
  }, []);

  const trackBookDownload = useCallback((bookId: string, bookName: string) => {
    trackEvent(ANALYTICS_EVENTS.BOOK_DOWNLOAD, 'content', bookName, undefined, {
      book_id: bookId,
    });
  }, []);

  // Technical
  const trackError = useCallback((error: Error, context?: string) => {
    trackException(`${context ? `${context}: ` : ''}${error.message}`);
  }, []);

  const trackPerformance = useCallback((metric: string, value: number, category: string = 'performance') => {
    trackTiming(metric, value, category);
  }, []);

  const trackFeatureUsage = useCallback((featureName: string, action: string, metadata?: Record<string, any>) => {
    trackEvent(ANALYTICS_EVENTS.FEATURE_USAGE, 'features', featureName, undefined, {
      action,
      ...metadata,
    });
  }, []);

  // Session tracking
  const trackSessionStart = useCallback(() => {
    trackEvent('session_start', 'session');
  }, []);

  const trackSessionEnd = useCallback((duration: number) => {
    trackEvent('session_end', 'session', undefined, duration);
  }, []);

  return {
    // Page tracking
    trackPageView: handleTrackPageView,

    // User events
    trackLogin,
    trackLogout,
    trackRegistration,

    // Navigation
    trackNavigation,

    // Family & Social
    trackFamilyMemberView,
    trackFamilyUpdate,
    trackAnnouncementRead,

    // Learning
    trackCourseStart,
    trackCourseComplete,
    trackLessonView,
    trackQuizAttempt,
    trackQuizComplete,

    // Business
    trackProjectView,
    trackProjectUpdate,
    trackBusinessPlanView,
    trackCareerPathView,

    // Templates & Tools
    trackTemplateDownload,
    trackTemplateUse,
    trackToolUsage,

    // Gamification
    trackAchievementUnlock,
    trackBadgeEarn,
    trackLevelUp,
    trackLeaderboardView,

    // Communication
    trackMessageSend,
    trackNotificationClick,
    trackContactView,

    // Testing
    trackBetaTestStart,
    trackBetaTestComplete,
    trackFeedbackSubmit,

    // Search & Content
    trackSearch,
    trackContentShare,
    trackBookDownload,

    // Technical
    trackError,
    trackPerformance,
    trackFeatureUsage,

    // Session tracking
    trackSessionStart,
    trackSessionEnd,
  };
};

export default useAnalytics;