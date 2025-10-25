import { messaging } from '../config/firebase';
import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: Record<string, any>;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Get FCM registration token
   */
  async getFCMToken(): Promise<string | null> {
    try {
      if (!messaging) {
        console.warn('Firebase messaging not available');
        return null;
      }

      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: this.vapidKey,
      });

      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Save FCM token to user profile
   */
  async saveTokenToUser(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: token,
        notificationsEnabled: true,
        lastTokenUpdate: new Date(),
      });
    } catch (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    }
  }

  /**
   * Remove FCM token from user profile
   */
  async removeTokenFromUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: null,
        notificationsEnabled: false,
        lastTokenUpdate: new Date(),
      });
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  }

  /**
   * Initialize foreground message handling
   */
  initializeForegroundMessages(): void {
    if (!messaging) {
      console.warn('Firebase messaging not available for foreground messages');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);

      const notification = payload.notification;
      if (notification) {
        this.showNotification({
          title: notification.title || 'Salatiso Notification',
          body: notification.body || '',
          icon: notification.icon,
          data: payload.data,
        });
      }
    });
  }

  /**
   * Show a browser notification
   */
  showNotification(payload: PushNotificationPayload): void {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const options: NotificationOptions & { actions?: NotificationAction[] } = {
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction,
      data: payload.data,
    };

    if (payload.actions && payload.actions.length > 0) {
      options.actions = payload.actions;
    }

    const notification = new Notification(payload.title, options);

    // Auto-close after 5 seconds unless interaction is required
    if (!payload.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();

      // Handle custom actions based on data
      if (payload.data?.action) {
        this.handleNotificationAction(payload.data.action, payload.data);
      }
    };

    // Handle notification action clicks
    if (payload.actions) {
      notification.onshow = () => {
        // Actions are handled by the browser
      };
    }
  }

  /**
   * Handle notification action clicks
   */
  private handleNotificationAction(action: string, data: Record<string, any>): void {
    switch (action) {
      case 'view_family_update':
        window.location.href = `/intranet/family?update=${data.updateId}`;
        break;
      case 'view_project':
        window.location.href = `/intranet/projects?id=${data.projectId}`;
        break;
      case 'view_achievement':
        window.location.href = `/intranet/profile?tab=achievements`;
        break;
      case 'view_announcement':
        window.location.href = `/intranet/announcements?id=${data.announcementId}`;
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  }

  /**
   * Send a test notification (for development)
   */
  async sendTestNotification(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      if (!userData.fcmToken) {
        throw new Error('User has no FCM token');
      }

      // In a real implementation, this would call a Firebase Cloud Function
      // For now, we'll just show a local notification
      this.showNotification({
        title: 'Test Notification',
        body: 'This is a test push notification from Salatiso!',
        tag: 'test-notification',
      });

    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }

  /**
   * Check if notifications are supported and enabled
   */
  isSupported(): boolean {
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }
}

export const notificationService = new NotificationService();
export default notificationService;