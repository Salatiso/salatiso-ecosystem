/**
 * Phase 4.2: Smart Notifications
 * 
 * Type definitions for intelligent notification system with:
 * - User notification preferences
 * - Quiet hours management
 * - Multi-channel support (web, email, SMS)
 * - Notification history and tracking
 * - Escalation-specific notifications
 */

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATION TYPES & CHANNELS
// ─────────────────────────────────────────────────────────────────────────

export enum NotificationChannel {
  WEB = 'web',                    // In-app web notifications
  EMAIL = 'email',                // Email notifications
  SMS = 'sms',                    // SMS/text messages
  PUSH = 'push',                  // Browser push notifications
}

export enum NotificationType {
  ESCALATION_CREATED = 'escalation_created',           // New escalation logged
  ESCALATION_ASSIGNED = 'escalation_assigned',         // Assigned to responder
  ESCALATION_ESCALATED = 'escalation_escalated',       // Moved to higher level
  ESCALATION_RESOLVED = 'escalation_resolved',         // Issue resolved
  ESCALATION_URGENT = 'escalation_urgent',             // Urgent action needed
  RESPONSE_DUE = 'response_due',                       // Response deadline approaching
  ASSIGNMENT_ACKNOWLEDGED = 'assignment_acknowledged', // Responder acknowledged
  COMMENT_ADDED = 'comment_added',                     // New comment on escalation
  STATUS_CHANGED = 'status_changed',                   // Status update
  CUSTOM = 'custom',                                   // Custom notification
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATION PREFERENCES
// ─────────────────────────────────────────────────────────────────────────

/**
 * Quiet hours configuration - no notifications during these times
 */
export interface QuietHours {
  enabled: boolean;
  startTime: string;              // Format: "HH:MM" (24-hour)
  endTime: string;                // Format: "HH:MM" (24-hour)
  daysOfWeek: number[];           // 0=Sunday, 6=Saturday
  exceptions?: NotificationType[]; // Notification types that bypass quiet hours
}

/**
 * Channel-specific preferences
 */
export interface ChannelPreferences {
  enabled: boolean;
  priority?: NotificationPriority;
  quietHours?: QuietHours;
  rateLimit?: {
    maxPerHour: number;
    enabled: boolean;
  };
}

/**
 * User notification preferences - stored in user profile
 */
export interface NotificationPreferences {
  // Channel enablement
  channels: {
    web: ChannelPreferences;
    email: ChannelPreferences;
    sms: ChannelPreferences;
    push: ChannelPreferences;
  };

  // Notification type preferences
  types: {
    escalationCreated: boolean;
    escalationAssigned: boolean;
    escalationEscalated: boolean;
    escalationResolved: boolean;
    escalationUrgent: boolean;
    responseDue: boolean;
    assignmentAcknowledged: boolean;
    commentAdded: boolean;
    statusChanged: boolean;
  };

  // Global quiet hours
  globalQuietHours?: QuietHours;

  // Escalation context-specific settings
  escalationContextNotifications: {
    health: boolean;
    safety: boolean;
    property: boolean;
    emotional: boolean;
    financial: boolean;
    legal: boolean;
    other: boolean;
  };

  // Escalation level-specific settings
  escalationLevelNotifications: {
    individual: boolean;
    family: boolean;
    community: boolean;
    professional: boolean;
  };

  // Notification frequency
  digestFrequency?: 'immediate' | 'hourly' | 'daily' | 'weekly';
  digestEnabled?: boolean;

  // Do not disturb
  doNotDisturbEnabled?: boolean;
  doNotDisturbUntil?: Date;

  // Sound and vibration
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;

  // Updated at
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATION PAYLOAD & HISTORY
// ─────────────────────────────────────────────────────────────────────────

/**
 * Notification payload - what gets sent to users
 */
export interface NotificationPayload {
  id?: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  body?: string;
  icon?: string;
  data: {
    escalationId?: string;
    assignmentId?: string;
    responderUserId?: string;
    actionUrl?: string;
    [key: string]: any;
  };
  channels: NotificationChannel[];
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  actionTaken?: boolean;
  actionTakenAt?: Date;
  createdAt: Date;
}

/**
 * Notification record - stored in Firestore for history and tracking
 */
export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  body?: string;
  data: {
    escalationId?: string;
    assignmentId?: string;
    responderUserId?: string;
    [key: string]: any;
  };
  
  // Delivery tracking
  channels: NotificationChannel[];
  deliveryStatus: {
    [key in NotificationChannel]?: {
      status: 'pending' | 'sent' | 'failed' | 'bounced';
      sentAt?: Date;
      error?: string;
    };
  };

  // User interaction
  read: boolean;
  readAt?: Date;
  actionTaken: boolean;
  actionTakenAt?: Date;
  actionType?: string;
  archived: boolean;
  archivedAt?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // For cleanup
}

/**
 * Notification subscription - for push/email subscriptions
 */
export interface NotificationSubscription {
  id: string;
  userId: string;
  channel: NotificationChannel;
  endpoint: string; // Email, phone number, push endpoint, etc.
  verified: boolean;
  verifiedAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATION RULES & TEMPLATES
// ─────────────────────────────────────────────────────────────────────────

/**
 * Notification rule - determines when and how to notify users
 */
export interface NotificationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  
  // Trigger conditions
  trigger: {
    type: NotificationType;
    escalationContext?: string;
    escalationLevel?: string;
    escalationStatus?: string;
    severity?: string;
  };

  // Actions
  actions: {
    channels: NotificationChannel[];
    priority: NotificationPriority;
    template: string;
    bypassQuietHours: boolean;
  };

  // Recipients
  recipients: {
    roles?: string[];
    userIds?: string[];
    allManagers?: boolean;
    allFirstResponders?: boolean;
  };

  // Timing
  delay?: number; // milliseconds before sending
  repeatInterval?: number; // ms between repeats
  maxRepeats?: number;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Notification template - pre-built message templates
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  
  // Template content (supports variables like {userName}, {escalationId}, etc.)
  channels: {
    web?: {
      title: string;
      message: string;
      body?: string;
    };
    email?: {
      subject: string;
      template: string; // HTML template
    };
    sms?: {
      message: string; // Max 160 chars
    };
    push?: {
      title: string;
      body: string;
    };
  };

  variables: string[]; // Supported variables
  description?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATION STATISTICS & ANALYTICS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Notification statistics for analytics
 */
export interface NotificationStats {
  userId?: string; // If undefined, global stats
  period: 'day' | 'week' | 'month';
  
  // Counts by channel
  totalSent: number;
  sentByChannel: {
    [key in NotificationChannel]?: number;
  };

  // Counts by type
  sentByType: {
    [key in NotificationType]?: number;
  };

  // Engagement metrics
  totalRead: number;
  readRate: number; // percentage
  totalActionTaken: number;
  actionRate: number; // percentage
  totalFailed: number;
  failureRate: number; // percentage

  // Timing metrics
  avgReadTime?: number; // milliseconds
  avgActionTime?: number; // milliseconds

  // Device/platform stats
  deviceBreakdown?: {
    [key: string]: number;
  };

  calculatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────
// BATCHING & DIGESTS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Notification digest - batched notifications sent at specific intervals
 */
export interface NotificationDigest {
  id: string;
  userId: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  
  notifications: NotificationRecord[];
  
  // Summary
  totalCount: number;
  unreadCount: number;
  urgentCount: number;
  
  // Timing
  periodStart: Date;
  periodEnd: Date;
  sentAt?: Date;

  createdAt: Date;
}
