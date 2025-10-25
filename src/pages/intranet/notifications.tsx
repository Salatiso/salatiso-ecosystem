/**
 * Notification Center Page
 * 
 * Real-time notification management interface showing:
 * - Notification history
 * - Notification statistics
 * - Mark as read/unread
 * - Archive and delete
 * - Filter by status
 */

import { Metadata } from 'next';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export const metadata: Metadata = {
  title: 'Notifications | Salatiso',
  description: 'View and manage your notifications',
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationCenter />
    </div>
  );
}
