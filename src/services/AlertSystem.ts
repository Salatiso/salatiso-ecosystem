/**
 * @file AlertSystem.ts - Sprint 4B Implementation
 * @description Intelligent alert generation based on events and system rules
 * 
 * Features:
 * - Critical incident alerts (immediate)
 * - Reminder notifications (scheduled)
 * - Activity digest notifications
 * - Escalation alerts (high priority)
 * - User mention alerts
 * - System-wide announcements
 * 
 * @author Salatiso Ecosystem - Sprint 4B Notifications Hub
 * @created October 25, 2025
 */

import { notificationManagementService, Notification, NotificationPriority, NotificationType } from './NotificationManagementService';
import { Timestamp } from 'firebase/firestore';

// ============================================================================
// TYPES
// ============================================================================

export interface IncidentData {
  incidentId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas?: string[];
}

export interface ActivityData {
  activityType: string;
  actor: string;
  description: string;
  timestamp: Timestamp;
}

export interface EscalationEntry {
  escalationLevel: number;
  previousResponsible?: string;
  newResponsible: string;
  reason: string;
  timestamp: Timestamp;
}

export interface DigestNotification {
  userId: string;
  notificationCount: number;
  criticalCount: number;
  summaryText: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

// ============================================================================
// ALERT SYSTEM SERVICE
// ============================================================================

class AlertSystem {
  private readonly alertDelay = 500; // ms delay before batch sending

  /**
   * Generate a critical incident alert (immediate)
   */
  async generateCriticalAlert(
    userId: string,
    eventId: string,
    incident: IncidentData
  ): Promise<void> {
    try {
      const priority = this.getSeverityPriority(incident.severity);

      await notificationManagementService.createNotification(userId, {
        type: 'critical',
        priority,
        title: `🚨 CRITICAL: ${incident.title}`,
        message: incident.description,
        data: {
          incidentId: incident.incidentId,
          severity: incident.severity,
          affectedAreas: incident.affectedAreas,
        },
        actionUrl: `/intranet/incidents/${incident.incidentId}`,
        actionLabel: 'View Incident',
        relatedEventId: eventId,
        expiresIn: 24, // 24 hours
      });

      console.log(`[AlertSystem] Critical alert sent to ${userId}`);
    } catch (error: any) {
      console.error('[AlertSystem] Critical alert error:', error);
    }
  }

  /**
   * Generate reminder notification for upcoming event
   */
  async generateReminderAlert(
    userId: string,
    eventId: string,
    reminderData: {
      eventTitle: string;
      eventTime: Date;
      minutesBefore: number;
    }
  ): Promise<void> {
    try {
      const timeStr = this.formatTimeUntil(reminderData.minutesBefore);

      await notificationManagementService.createNotification(userId, {
        type: 'reminder',
        priority: NotificationPriority.MEDIUM,
        title: `⏰ Reminder: ${reminderData.eventTitle}`,
        message: `Your event starts in ${timeStr}`,
        data: {
          eventTime: reminderData.eventTime.toISOString(),
          minutesBefore: reminderData.minutesBefore,
        },
        actionUrl: `/intranet/calendar-v2?event=${eventId}`,
        actionLabel: 'View Event',
        relatedEventId: eventId,
        expiresIn: reminderData.minutesBefore + 30, // Expire after event starts
      });

      console.log(`[AlertSystem] Reminder alert sent to ${userId}`);
    } catch (error: any) {
      console.error('[AlertSystem] Reminder alert error:', error);
    }
  }

  /**
   * Generate activity notification
   */
  async generateActivityNotification(
    userId: string,
    eventId: string,
    activity: ActivityData
  ): Promise<void> {
    try {
      const title = this.formatActivityTitle(activity.activityType, activity.actor);

      await notificationManagementService.createNotification(userId, {
        type: 'activity',
        priority: NotificationPriority.LOW,
        title,
        message: activity.description,
        data: {
          activityType: activity.activityType,
          actor: activity.actor,
        },
        actionUrl: `/intranet/calendar-v2?event=${eventId}`,
        actionLabel: 'View Event',
        relatedEventId: eventId,
        relatedUserId: activity.actor,
        expiresIn: 72, // 3 days
      });

      console.log(`[AlertSystem] Activity notification sent to ${userId}`);
    } catch (error: any) {
      console.error('[AlertSystem] Activity notification error:', error);
    }
  }

  /**
   * Generate daily digest notification
   */
  async generateDailyDigest(userId: string): Promise<void> {
    try {
      // Get all unread notifications from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await notificationManagementService.getNotifications(userId, { read: false });

      if (!result.success || result.data!.total === 0) {
        console.log('[AlertSystem] No notifications for daily digest');
        return;
      }

      const notifications = result.data!.items.filter(
        (n) => new Date(n.createdAt.toDate()).getTime() > today.getTime()
      );

      if (notifications.length === 0) return;

      const criticalCount = notifications.filter((n) => n.type === 'critical').length;

      await notificationManagementService.createNotification(userId, {
        type: 'digest',
        priority: NotificationPriority.MEDIUM,
        title: `📋 Daily Digest - ${notifications.length} Updates`,
        message: `You have ${notifications.length} new notifications${
          criticalCount > 0 ? ` including ${criticalCount} critical alerts` : ''
        }`,
        data: {
          notificationCount: notifications.length,
          criticalCount,
          summary: this.generateDigestSummary(notifications),
        },
        actionUrl: '/intranet/notifications',
        actionLabel: 'View All',
        expiresIn: 24,
      });

      console.log(`[AlertSystem] Daily digest sent to ${userId}`);
    } catch (error: any) {
      console.error('[AlertSystem] Daily digest error:', error);
    }
  }

  /**
   * Generate weekly digest notification
   */
  async generateWeeklyDigest(userId: string): Promise<void> {
    try {
      // Get all unread notifications from this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const result = await notificationManagementService.getNotifications(userId, { read: false });

      if (!result.success || result.data!.total === 0) {
        return;
      }

      const weekNotifications = result.data!.items.filter(
        (n) => new Date(n.createdAt.toDate()).getTime() > oneWeekAgo.getTime()
      );

      if (weekNotifications.length === 0) return;

      const typeCounts = this.countByType(weekNotifications);
      const criticalCount = typeCounts['critical'] || 0;

      await notificationManagementService.createNotification(userId, {
        type: 'digest',
        priority: NotificationPriority.LOW,
        title: `📊 Weekly Digest - ${weekNotifications.length} Total Updates`,
        message: `This week: ${weekNotifications.length} notifications${
          criticalCount > 0 ? `, ${criticalCount} critical` : ''
        }`,
        data: {
          notificationCount: weekNotifications.length,
          criticalCount,
          typeCounts,
          summary: this.generateDigestSummary(weekNotifications),
        },
        actionUrl: '/intranet/notifications',
        actionLabel: 'View All',
        expiresIn: 168, // 1 week
      });

      console.log(`[AlertSystem] Weekly digest sent to ${userId}`);
    } catch (error: any) {
      console.error('[AlertSystem] Weekly digest error:', error);
    }
  }

  /**
   * Generate escalation alert
   */
  async generateEscalationAlert(
    userId: string,
    eventId: string,
    escalation: EscalationEntry
  ): Promise<void> {
    try {
      await notificationManagementService.createNotification(userId, {
        type: 'critical',
        priority: NotificationPriority.HIGH,
        title: `⬆️ Escalation Alert - Level ${escalation.escalationLevel}`,
        message: `${escalation.reason}. Now assigned to: ${escalation.newResponsible}`,
        data: {
          escalationLevel: escalation.escalationLevel,
          previousResponsible: escalation.previousResponsible,
          newResponsible: escalation.newResponsible,
          reason: escalation.reason,
        },
        actionUrl: `/intranet/calendar-v2?event=${eventId}`,
        actionLabel: 'View Event',
        relatedEventId: eventId,
        relatedUserId: escalation.newResponsible,
        expiresIn: 48, // 2 days
      });

      console.log(`[AlertSystem] Escalation alert sent to ${userId}`);
    } catch (error: any) {
      console.error('[AlertSystem] Escalation alert error:', error);
    }
  }

  /**
   * Generate mention alert
   */
  async generateMentionAlert(
    userId: string,
    mentionedBy: string,
    context: string,
    eventId?: string
  ): Promise<void> {
    try {
      await notificationManagementService.createNotification(userId, {
        type: 'mention',
        priority: NotificationPriority.HIGH,
        title: `👤 You were mentioned by ${mentionedBy}`,
        message: context,
        data: {
          mentionedBy,
          context,
        },
        actionUrl: eventId ? `/intranet/calendar-v2?event=${eventId}` : '/intranet/notifications',
        actionLabel: eventId ? 'View Event' : 'View Mention',
        relatedEventId: eventId,
        relatedUserId: mentionedBy,
        expiresIn: 48,
      });

      console.log(`[AlertSystem] Mention alert sent to ${userId}`);
    } catch (error: any) {
      console.error('[AlertSystem] Mention alert error:', error);
    }
  }

  /**
   * Generate system-wide alert
   */
  async generateSystemAlert(
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ): Promise<void> {
    try {
      // Note: In production, this should broadcast to all users or specific groups
      // For now, it's a placeholder for system-wide announcements
      console.log(`[AlertSystem] System alert generated: ${title}`);
    } catch (error: any) {
      console.error('[AlertSystem] System alert error:', error);
    }
  }

  /**
   * Schedule a digest notification for a specific time
   */
  async scheduleDigest(
    userId: string,
    digestType: 'daily' | 'weekly',
    scheduledTime: Date
  ): Promise<void> {
    try {
      const now = new Date();
      const delay = scheduledTime.getTime() - now.getTime();

      if (delay > 0) {
        setTimeout(async () => {
          if (digestType === 'daily') {
            await this.generateDailyDigest(userId);
          } else {
            await this.generateWeeklyDigest(userId);
          }
        }, delay);

        console.log(`[AlertSystem] ${digestType} digest scheduled for ${userId}`);
      }
    } catch (error: any) {
      console.error('[AlertSystem] Schedule digest error:', error);
    }
  }

  /**
   * Helper: Map severity to notification priority
   */
  private getSeverityPriority(severity: string): NotificationPriority {
    switch (severity) {
      case 'critical':
        return NotificationPriority.CRITICAL;
      case 'high':
        return NotificationPriority.HIGH;
      case 'medium':
        return NotificationPriority.MEDIUM;
      default:
        return NotificationPriority.LOW;
    }
  }

  /**
   * Helper: Format time remaining
   */
  private formatTimeUntil(minutes: number): string {
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    return `${Math.floor(minutes / 1440)} days`;
  }

  /**
   * Helper: Format activity title
   */
  private formatActivityTitle(type: string, actor: string): string {
    const actions: Record<string, string> = {
      created: 'created',
      updated: 'updated',
      commented: 'commented on',
      assigned: 'assigned',
      completed: 'completed',
      cancelled: 'cancelled',
      shared: 'shared',
    };

    const action = actions[type] || type;
    return `✏️ ${actor} ${action} an event`;
  }

  /**
   * Helper: Count notifications by type
   */
  private countByType(notifications: Notification[]): Record<string, number> {
    return notifications.reduce(
      (acc, notif) => {
        acc[notif.type] = (acc[notif.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Helper: Generate digest summary
   */
  private generateDigestSummary(notifications: Notification[]): string {
    const types = this.countByType(notifications);
    const parts: string[] = [];

    if (types['critical']) parts.push(`${types['critical']} critical`);
    if (types['reminder']) parts.push(`${types['reminder']} reminders`);
    if (types['mention']) parts.push(`${types['mention']} mentions`);
    if (types['activity']) parts.push(`${types['activity']} activities`);

    return parts.join(', ');
  }
}

export const alertSystem = new AlertSystem();
export default alertSystem;
