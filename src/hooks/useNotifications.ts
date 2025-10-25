import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';

export interface UseNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isEnabled: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  enableNotifications: () => Promise<void>;
  disableNotifications: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user, updateUserProfile } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);

  // Check if we're on the client side
  const isClient = typeof window !== 'undefined';
  const isSupported = isClient && notificationService.isSupported();

  // Update permission status
  const updatePermissionStatus = useCallback(() => {
    if (isClient) {
      const currentPermission = notificationService.getPermissionStatus();
      setPermission(currentPermission);
    }
  }, [isClient]);

  // Initialize notifications on mount
  useEffect(() => {
    if (isClient && isSupported) {
      updatePermissionStatus();

      // Listen for permission changes
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' }).then((status) => {
          status.addEventListener('change', updatePermissionStatus);
          return () => status.removeEventListener('change', updatePermissionStatus);
        });
      }
    }
  }, [isClient, isSupported, updatePermissionStatus]);

  // Update enabled status based on user preferences
  useEffect(() => {
    if (user?.preferences?.notifications) {
      setIsEnabled(user.preferences.notifications.push && permission === 'granted');
    }
  }, [user, permission]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    try {
      const result = await notificationService.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, []);

  const enableNotifications = useCallback(async (): Promise<void> => {
    try {
      // Request permission first
      const perm = await requestPermission();
      if (perm !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get FCM token
      const token = await notificationService.getFCMToken();
      if (!token) {
        throw new Error('Failed to get FCM token');
      }

      // Save token to user profile
      if (user?.id) {
        await notificationService.saveTokenToUser(user.id, token);
      }

      // Update user preferences
      await updateUserProfile({
        preferences: {
          theme: user?.preferences?.theme ?? 'light',
          language: user?.preferences?.language ?? 'en',
          notifications: {
            email: user?.preferences?.notifications?.email ?? true,
            push: true,
            projectUpdates: user?.preferences?.notifications?.projectUpdates ?? true,
            careerMilestones: user?.preferences?.notifications?.careerMilestones ?? true,
            familyAnnouncements: user?.preferences?.notifications?.familyAnnouncements ?? true,
          },
          dashboardLayout: user?.preferences?.dashboardLayout ?? [],
          gamificationEnabled: user?.preferences?.gamificationEnabled ?? true,
        },
      });

      // Initialize foreground message handling
      notificationService.initializeForegroundMessages();

      setIsEnabled(true);
    } catch (error) {
      console.error('Error enabling notifications:', error);
      throw error;
    }
  }, [user, requestPermission, updateUserProfile]);

  const disableNotifications = useCallback(async (): Promise<void> => {
    try {
      // Remove token from user profile
      if (user?.id) {
        await notificationService.removeTokenFromUser(user.id);
      }

      // Update user preferences
      await updateUserProfile({
        preferences: {
          theme: user?.preferences?.theme ?? 'light',
          language: user?.preferences?.language ?? 'en',
          notifications: {
            email: user?.preferences?.notifications?.email ?? true,
            push: false,
            projectUpdates: user?.preferences?.notifications?.projectUpdates ?? true,
            careerMilestones: user?.preferences?.notifications?.careerMilestones ?? true,
            familyAnnouncements: user?.preferences?.notifications?.familyAnnouncements ?? true,
          },
          dashboardLayout: user?.preferences?.dashboardLayout ?? [],
          gamificationEnabled: user?.preferences?.gamificationEnabled ?? true,
        },
      });

      setIsEnabled(false);
    } catch (error) {
      console.error('Error disabling notifications:', error);
      throw error;
    }
  }, [user, updateUserProfile]);

  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      await notificationService.sendTestNotification(user.id);
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }, [user]);

  const initialize = useCallback(async (): Promise<void> => {
    if (!isSupported || !user?.preferences?.notifications?.push) {
      return;
    }

    try {
      // Check if we already have permission
      if (permission === 'granted') {
        // Try to get token and ensure it's saved
        const token = await notificationService.getFCMToken();
        if (token && user.id) {
          await notificationService.saveTokenToUser(user.id, token);
        }

        // Initialize foreground message handling
        notificationService.initializeForegroundMessages();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }, [isSupported, user, permission]);

  return {
    isSupported,
    permission,
    isEnabled,
    requestPermission,
    enableNotifications,
    disableNotifications,
    sendTestNotification,
    initialize,
  };
};

export default useNotifications;