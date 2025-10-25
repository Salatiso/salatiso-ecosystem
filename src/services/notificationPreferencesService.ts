/**
 * Notification Preferences Service
 * 
 * Manages user notification preferences, quiet hours, and notification settings.
 * Integrates with Firestore and user profile management.
 */

import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  NotificationPreferences,
  NotificationChannel,
  NotificationType,
  QuietHours,
} from '@/types/notifications';

class NotificationPreferencesService {
  /**
   * Get user's notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const preferences = userData.preferences?.notifications as NotificationPreferences | undefined;

      // Return default preferences if none exist
      if (!preferences) {
        return this.getDefaultPreferences();
      }

      return preferences;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update user's notification preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        'preferences.notifications': {
          ...this.getDefaultPreferences(),
          ...preferences,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Enable/disable a specific notification channel
   */
  async setChannelEnabled(
    userId: string,
    channel: NotificationChannel,
    enabled: boolean
  ): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId);
      const updatedPreferences = {
        ...preferences,
        channels: {
          ...preferences.channels,
          [channel]: {
            ...preferences.channels[channel],
            enabled,
          },
        },
      };

      await this.updateUserPreferences(userId, updatedPreferences);
    } catch (error) {
      console.error(`Error setting ${channel} channel:`, error);
      throw error;
    }
  }

  /**
   * Enable/disable a specific notification type
   */
  async setNotificationTypeEnabled(
    userId: string,
    type: NotificationType,
    enabled: boolean
  ): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId);
      
      // Map notification type to preference field
      const typeKeyMap: { [key in NotificationType]: keyof NotificationPreferences['types'] } = {
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

      const typeKey = typeKeyMap[type];
      const updatedPreferences = {
        ...preferences,
        types: {
          ...preferences.types,
          [typeKey]: enabled,
        },
      };

      await this.updateUserPreferences(userId, updatedPreferences);
    } catch (error) {
      console.error(`Error setting ${type} notification:`, error);
      throw error;
    }
  }

  /**
   * Update quiet hours configuration
   */
  async setQuietHours(
    userId: string,
    quietHours: QuietHours,
    isGlobal: boolean = false
  ): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId);

      if (isGlobal) {
        const updatedPreferences = {
          ...preferences,
          globalQuietHours: quietHours,
        };
        await this.updateUserPreferences(userId, updatedPreferences);
      } else {
        // Update quiet hours for all channels
        const updatedPreferences = {
          ...preferences,
          channels: {
            web: {
              ...preferences.channels.web,
              quietHours,
            },
            email: {
              ...preferences.channels.email,
              quietHours,
            },
            sms: {
              ...preferences.channels.sms,
              quietHours,
            },
            push: {
              ...preferences.channels.push,
              quietHours,
            },
          },
        };
        await this.updateUserPreferences(userId, updatedPreferences);
      }
    } catch (error) {
      console.error('Error setting quiet hours:', error);
      throw error;
    }
  }

  /**
   * Check if user is in quiet hours for a channel
   */
  async isInQuietHours(
    userId: string,
    channel: NotificationChannel,
    notificationType?: NotificationType
  ): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);

      // Check global quiet hours first
      if (preferences.globalQuietHours?.enabled) {
        if (
          this.isCurrentTimeInQuietHours(preferences.globalQuietHours) &&
          (!notificationType || !preferences.globalQuietHours.exceptions?.includes(notificationType))
        ) {
          return true;
        }
      }

      // Check channel-specific quiet hours
      const channelPrefs = preferences.channels[channel];
      if (channelPrefs?.quietHours?.enabled) {
        if (
          this.isCurrentTimeInQuietHours(channelPrefs.quietHours) &&
          (!notificationType || !channelPrefs.quietHours.exceptions?.includes(notificationType))
        ) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking quiet hours:', error);
      return false; // Safe default: allow notifications if check fails
    }
  }

  /**
   * Check if current time is within quiet hours
   */
  private isCurrentTimeInQuietHours(quietHours: QuietHours): boolean {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDayOfWeek = now.getDay();

    // Check if today is in the excluded days
    if (!quietHours.daysOfWeek.includes(currentDayOfWeek)) {
      return false;
    }

    // Check if current time is within quiet hours
    const startTime = quietHours.startTime;
    const endTime = quietHours.endTime;

    // Handle case where quiet hours span midnight
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Spans midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Enable do not disturb mode
   */
  async setDoNotDisturb(userId: string, durationMinutes: number): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId);
      const now = new Date();
      const until = new Date(now.getTime() + durationMinutes * 60000);

      const updatedPreferences = {
        ...preferences,
        doNotDisturbEnabled: true,
        doNotDisturbUntil: until,
      };

      await this.updateUserPreferences(userId, updatedPreferences);
    } catch (error) {
      console.error('Error setting do not disturb:', error);
      throw error;
    }
  }

  /**
   * Disable do not disturb mode
   */
  async disableDoNotDisturb(userId: string): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId);
      const updatedPreferences = {
        ...preferences,
        doNotDisturbEnabled: false,
        doNotDisturbUntil: undefined,
      };

      await this.updateUserPreferences(userId, updatedPreferences);
    } catch (error) {
      console.error('Error disabling do not disturb:', error);
      throw error;
    }
  }

  /**
   * Check if user is in do not disturb mode
   */
  async isInDoNotDisturb(userId: string): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);

      if (!preferences.doNotDisturbEnabled) {
        return false;
      }

      if (preferences.doNotDisturbUntil) {
        const until = preferences.doNotDisturbUntil instanceof Timestamp
          ? preferences.doNotDisturbUntil.toDate()
          : new Date(preferences.doNotDisturbUntil);

        return new Date() < until;
      }

      return false;
    } catch (error) {
      console.error('Error checking do not disturb:', error);
      return false;
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      channels: {
        web: { enabled: true },
        email: { enabled: false },
        sms: { enabled: false },
        push: { enabled: true },
      },
      types: {
        escalationCreated: true,
        escalationAssigned: true,
        escalationEscalated: true,
        escalationResolved: true,
        escalationUrgent: true,
        responseDue: true,
        assignmentAcknowledged: false,
        commentAdded: true,
        statusChanged: false,
      },
      escalationContextNotifications: {
        health: true,
        safety: true,
        property: true,
        emotional: true,
        financial: true,
        legal: true,
        other: true,
      },
      escalationLevelNotifications: {
        individual: true,
        family: true,
        community: true,
        professional: true,
      },
      digestFrequency: 'immediate',
      digestEnabled: false,
      doNotDisturbEnabled: false,
      soundEnabled: true,
      vibrationEnabled: true,
      updatedAt: new Date(),
    };
  }

  /**
   * Reset preferences to defaults
   */
  async resetToDefaults(userId: string): Promise<void> {
    try {
      await this.updateUserPreferences(userId, this.getDefaultPreferences());
    } catch (error) {
      console.error('Error resetting preferences to defaults:', error);
      throw error;
    }
  }

  /**
   * Validate notification preferences
   */
  validatePreferences(preferences: NotificationPreferences): string[] {
    const errors: string[] = [];

    // Validate quiet hours if enabled
    if (preferences.globalQuietHours?.enabled) {
      if (!this.validateQuietHours(preferences.globalQuietHours)) {
        errors.push('Invalid global quiet hours configuration');
      }
    }

    // Validate channel quiet hours
    Object.entries(preferences.channels).forEach(([channel, prefs]) => {
      if (prefs.quietHours?.enabled) {
        if (!this.validateQuietHours(prefs.quietHours)) {
          errors.push(`Invalid quiet hours for ${channel} channel`);
        }
      }
    });

    // Validate do not disturb
    if (preferences.doNotDisturbUntil) {
      const until = preferences.doNotDisturbUntil instanceof Timestamp
        ? preferences.doNotDisturbUntil.toDate()
        : new Date(preferences.doNotDisturbUntil);

      if (until < new Date()) {
        errors.push('Do not disturb expiration time must be in the future');
      }
    }

    return errors;
  }

  /**
   * Validate quiet hours configuration
   */
  private validateQuietHours(quietHours: QuietHours): boolean {
    // Validate time format HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(quietHours.startTime) || !timeRegex.test(quietHours.endTime)) {
      return false;
    }

    // Validate days of week (0-6)
    if (!quietHours.daysOfWeek.every(day => day >= 0 && day <= 6)) {
      return false;
    }

    return true;
  }
}

export const notificationPreferencesService = new NotificationPreferencesService();
export default notificationPreferencesService;
