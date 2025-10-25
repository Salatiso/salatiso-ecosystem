'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationManagementService, Notification } from '@/services/NotificationManagementService';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, Eye, EyeOff, AlertCircle, Clock, Activity, MessageSquare, Star } from 'lucide-react';

interface NotificationCenterProps {
  userId?: string;
  onNotificationClick?: (notification: Notification) => void;
  maxItems?: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId: propUserId,
  onNotificationClick,
  maxItems = 10,
}) => {
  const { user } = useAuth();
  const userId = propUserId || user?.id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = notificationManagementService.subscribeToNotifications(
      userId,
      (notifs) => {
        setNotifications(notifs);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = notificationManagementService.subscribeToUnreadCount(userId, setUnreadCount);
    return unsubscribe;
  }, [userId]);

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (userId) await notificationManagementService.markAsRead(userId, id);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (userId) await notificationManagementService.deleteNotification(userId, id);
  };

  const handleMarkAllAsRead = async () => {
    if (userId) await notificationManagementService.markAllAsRead(userId);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      critical: <AlertCircle className="w-5 h-5 text-red-600" />,
      reminder: <Clock className="w-5 h-5 text-blue-600" />,
      mention: <MessageSquare className="w-5 h-5 text-purple-600" />,
      activity: <Activity className="w-5 h-5 text-green-600" />,
    };
    return icons[type] || <Star className="w-5 h-5 text-gray-600" />;
  };

  const formatTime = (timestamp: any): string => {
    const date = timestamp.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const displayNotifications = notifications.slice(0, maxItems);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          {unreadCount > 0 && <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">{unreadCount}</span>}
        </div>
        <button onClick={handleMarkAllAsRead} className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">Mark All Read</button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayNotifications.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No notifications</p>
            </motion.div>
          ) : (
            displayNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg cursor-pointer transition-all"
                onClick={() => {
                  setSelectedNotification(notification);
                  if (!notification.read && userId) notificationManagementService.markAsRead(userId, notification.id);
                  if (onNotificationClick) onNotificationClick(notification);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getTypeIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {notification.title}
                        {!notification.read && <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                        {notification.actionLabel && notification.actionUrl && (
                          <a href={notification.actionUrl} className="text-xs font-semibold text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                            {notification.actionLabel} →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => handleMarkAsRead(e, notification.id)} className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Mark as read">
                      {notification.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={(e) => handleDelete(e, notification.id)} className="p-2 text-gray-600 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotification(null)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                {getTypeIcon(selectedNotification.type)}
                <h3 className="text-lg font-bold text-gray-800">{selectedNotification.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{selectedNotification.message}</p>
              {selectedNotification.data && (
                <div className="bg-gray-50 p-3 rounded text-sm mb-4">
                  <pre className="overflow-auto max-h-40">{JSON.stringify(selectedNotification.data, null, 2)}</pre>
                </div>
              )}
              <div className="flex gap-2">
                {selectedNotification.actionUrl && (
                  <a href={selectedNotification.actionUrl} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors">
                    {selectedNotification.actionLabel || 'Go to'}
                  </a>
                )}
                <button onClick={() => setSelectedNotification(null)} className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
