// Export toast utilities from component
export { ToastNotificationContainer, showToast, notifyListeners } from '@/components/ToastNotificationContainer';
// Import for use in this service
import { showToast } from '@/components/ToastNotificationContainer';

interface PushNotificationServiceConfig {
  vapidKey?: string;
  serviceWorkerPath?: string;
  onPermissionDenied?: () => void;
  onPermissionGranted?: () => void;
}

/**
 * Initialize Push Notification Service
 */
export class PushNotificationService {
  private config: Required<PushNotificationServiceConfig>;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor(config: PushNotificationServiceConfig = {}) {
    this.config = {
      vapidKey: config.vapidKey || '',
      serviceWorkerPath: config.serviceWorkerPath || '/sw.js',
      onPermissionDenied: config.onPermissionDenied || (() => {}),
      onPermissionGranted: config.onPermissionGranted || (() => {}),
    };
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        this.config.serviceWorkerPath,
        { scope: '/' }
      );
      console.log('[PushNotifications] Service Worker registered:', registration);
      this.serviceWorkerRegistration = registration;

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showToast({
                type: 'info',
                title: 'App Update Available',
                message: 'A new version is ready. Refresh to update.',
                action: {
                  label: 'Refresh',
                  onClick: () => window.location.reload(),
                },
              });
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('[PushNotifications] Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      console.log('[PushNotifications] Permission already granted');
      this.config.onPermissionGranted();
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      console.log('[PushNotifications] Permission already denied');
      this.config.onPermissionDenied();
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('[PushNotifications] Permission:', permission);

      if (permission === 'granted') {
        this.config.onPermissionGranted();
      } else {
        this.config.onPermissionDenied();
      }

      return permission;
    } catch (error) {
      console.error('[PushNotifications] Permission request failed:', error);
      this.config.onPermissionDenied();
      return 'denied';
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) {
      await this.registerServiceWorker();
    }

    if (!this.serviceWorkerRegistration) {
      console.error('[PushNotifications] Service Worker not available');
      return null;
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.warn('[PushNotifications] Permission not granted');
      return null;
    }

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.config.vapidKey || undefined,
      });

      console.log('[PushNotifications] Subscribed:', subscription);
      showToast({
        type: 'success',
        title: 'Notifications Enabled',
        message: 'You will now receive push notifications',
      });

      return subscription;
    } catch (error) {
      console.error('[PushNotifications] Subscription failed:', error);
      showToast({
        type: 'error',
        title: 'Notification Setup Failed',
        message: 'Could not enable notifications. Try again later.',
      });
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.serviceWorkerRegistration) {
      return false;
    }

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('[PushNotifications] Unsubscribed');
        showToast({
          type: 'info',
          title: 'Notifications Disabled',
          message: 'Push notifications have been turned off',
        });
        return true;
      }
    } catch (error) {
      console.error('[PushNotifications] Unsubscription failed:', error);
    }

    return false;
  }

  /**
   * Get current push subscription
   */
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) {
      return null;
    }

    try {
      return await this.serviceWorkerRegistration.pushManager.getSubscription();
    } catch (error) {
      console.error('[PushNotifications] Failed to get subscription:', error);
      return null;
    }
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'Notification' in window;
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Enable background sync
   */
  async enableBackgroundSync(tag: string): Promise<boolean> {
    if (!this.serviceWorkerRegistration) {
      await this.registerServiceWorker();
    }

    if (!this.serviceWorkerRegistration || !('sync' in this.serviceWorkerRegistration)) {
      console.warn('[PushNotifications] Background Sync not supported');
      return false;
    }

    try {
      await (this.serviceWorkerRegistration.sync as any).register(tag);
      console.log('[PushNotifications] Background sync enabled:', tag);
      return true;
    } catch (error) {
      console.error('[PushNotifications] Background sync registration failed:', error);
      return false;
    }
  }

  /**
   * Show local notification
   */
  showNotification(title: string, options: NotificationOptions = {}): Notification | null {
    if (!('Notification' in window)) {
      console.warn('[PushNotifications] Notifications not supported');
      return null;
    }

    if (Notification.permission !== 'granted') {
      showToast({
        type: 'info',
        title: 'Enable Notifications',
        message: 'Please enable notifications to receive alerts',
      });
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('[PushNotifications] Failed to show notification:', error);
      return null;
    }
  }
}

// Create singleton instance
export const pushNotificationService = new PushNotificationService();

export default PushNotificationService;
