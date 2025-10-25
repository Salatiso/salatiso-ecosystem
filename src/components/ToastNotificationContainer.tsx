'use client';

import React, { useEffect, useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

// Global toast state
let toastNotifications: ToastNotification[] = [];
let toastListeners: ((notifications: ToastNotification[]) => void)[] = [];

/**
 * Helper to notify all listeners
 */
export function notifyListeners() {
  toastListeners.forEach(listener => listener([...toastNotifications]));
}

/**
 * Show toast notification
 */
export function showToast(notification: Omit<ToastNotification, 'id'>) {
  const id = `toast-${Date.now()}-${Math.random()}`;
  const toast: ToastNotification = {
    ...notification,
    id,
    duration: notification.duration || 5000,
  };

  toastNotifications.push(toast);
  notifyListeners();

  // Auto-remove after duration
  if (toast.duration && toast.duration > 0) {
    setTimeout(() => {
      toastNotifications = toastNotifications.filter(n => n.id !== id);
      notifyListeners();
    }, toast.duration);
  }

  return id;
}

/**
 * Toast Notification Component
 */
export const ToastNotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  useEffect(() => {
    // Subscribe to toast updates
    const listener = (notifs: ToastNotification[]) => {
      setNotifications(notifs);
    };
    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const removeNotification = (id: string) => {
    toastNotifications = toastNotifications.filter(n => n.id !== id);
    notifyListeners();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    const baseClasses = 'rounded-lg shadow-lg border p-4 flex items-start gap-3';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getStyles(notification.type)} animate-in slide-in-from-top-2 fade-in`}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{notification.title}</p>
            <p className="text-sm opacity-90">{notification.message}</p>
            {notification.action && (
              <button
                onClick={() => {
                  notification.action?.onClick();
                  removeNotification(notification.id);
                }}
                className="mt-2 text-sm font-medium underline hover:no-underline"
              >
                {notification.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
