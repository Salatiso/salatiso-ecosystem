import ReactGA from 'react-ga4';

// Analytics Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Analytics Events
export const ANALYTICS_EVENTS = {
  // User Authentication
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',

  // Navigation
  PAGE_VIEW: 'page_view',
  NAVIGATION: 'navigation',

  // Family & Social
  FAMILY_MEMBER_VIEW: 'family_member_view',
  FAMILY_UPDATE_POST: 'family_update_post',
  FAMILY_ANNOUNCEMENT_READ: 'family_announcement_read',

  // Learning & Education
  COURSE_START: 'course_start',
  COURSE_COMPLETE: 'course_complete',
  LESSON_VIEW: 'lesson_view',
  QUIZ_ATTEMPT: 'quiz_attempt',
  QUIZ_COMPLETE: 'quiz_complete',

  // Business & Projects
  PROJECT_VIEW: 'project_view',
  PROJECT_UPDATE: 'project_update',
  BUSINESS_PLAN_VIEW: 'business_plan_view',
  CAREER_PATH_VIEW: 'career_path_view',

  // Templates & Tools
  TEMPLATE_DOWNLOAD: 'template_download',
  TEMPLATE_USE: 'template_use',
  TOOL_USAGE: 'tool_usage',

  // Gamification
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  BADGE_EARN: 'badge_earn',
  LEVEL_UP: 'level_up',
  LEADERBOARD_VIEW: 'leaderboard_view',

  // Communication
  MESSAGE_SEND: 'message_send',
  NOTIFICATION_CLICK: 'notification_click',
  CONTACT_VIEW: 'contact_view',

  // Testing & Beta
  BETA_TEST_START: 'beta_test_start',
  BETA_TEST_COMPLETE: 'beta_test_complete',
  FEEDBACK_SUBMIT: 'feedback_submit',

  // Search & Discovery
  SEARCH_PERFORM: 'search_perform',
  CONTENT_SHARE: 'content_share',
  BOOK_DOWNLOAD: 'book_download',

  // Technical
  ERROR_OCCURRED: 'error_occurred',
  PERFORMANCE_METRIC: 'performance_metric',
  FEATURE_USAGE: 'feature_usage',
} as const;

// Custom Dimensions
export const CUSTOM_DIMENSIONS = {
  USER_ROLE: 'user_role',
  LANGUAGE: 'language',
  FAMILY_BRANCH: 'family_branch',
  USER_LEVEL: 'user_level',
  SESSION_DURATION: 'session_duration',
} as const;

// Custom Metrics
export const CUSTOM_METRICS = {
  PAGES_PER_SESSION: 'pages_per_session',
  TIME_ON_PAGE: 'time_on_page',
  FEATURES_USED: 'features_used',
  INTERACTIONS_COUNT: 'interactions_count',
} as const;

// Initialize Google Analytics
export const initializeAnalytics = () => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gtagOptions: {
        custom_map: {
          // Map custom dimensions
          [CUSTOM_DIMENSIONS.USER_ROLE]: 'dimension1',
          [CUSTOM_DIMENSIONS.LANGUAGE]: 'dimension2',
          [CUSTOM_DIMENSIONS.FAMILY_BRANCH]: 'dimension3',
          [CUSTOM_DIMENSIONS.USER_LEVEL]: 'dimension4',
          [CUSTOM_DIMENSIONS.SESSION_DURATION]: 'dimension5',
        },
      },
    });

    // Set initial user properties if available
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        ReactGA.set({
          user_id: user.id,
          [CUSTOM_DIMENSIONS.USER_ROLE]: user.role,
          [CUSTOM_DIMENSIONS.LANGUAGE]: user.preferences?.language || 'en',
          [CUSTOM_DIMENSIONS.USER_LEVEL]: user.gamification?.level || 1,
        });
      } catch (error) {
        console.warn('Error setting initial user properties:', error);
      }
    }
  }
};

// Track Page Views
export const trackPageView = (page: string, title?: string) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.send({
      hitType: 'pageview',
      page,
      title: title || document.title,
    });
  }
};

// Track Events
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.event(action, {
      category,
      label,
      value,
      ...customParameters,
    });
  }
};

// Track User Properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.set(properties);
  }
};

// Track Timing
export const trackTiming = (
  name: string,
  value: number,
  category: string = 'performance',
  label?: string
) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.event('timing_complete', {
      name,
      value,
      event_category: category,
      event_label: label,
    });
  }
};

// Track Exceptions
export const trackException = (
  description: string,
  fatal: boolean = false
) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.event('exception', {
      description,
      fatal,
    });
  }
};

// E-commerce Tracking (for future business features)
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string = 'ZAR',
  items?: any[]
) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.event('purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items,
    });
  }
};

// Social Interactions
export const trackSocial = (
  network: string,
  action: string,
  target: string
) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.event('social', {
      socialNetwork: network,
      socialAction: action,
      socialTarget: target,
    });
  }
};

export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  setUserProperties,
  trackTiming,
  trackException,
  trackPurchase,
  trackSocial,
};