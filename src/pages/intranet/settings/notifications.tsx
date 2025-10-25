/**
 * Notification Settings Page
 * 
 * User interface for managing notification preferences:
 * - Channel preferences (web, push, email, SMS)
 * - Notification type toggles
 * - Quiet hours configuration
 * - Do-not-disturb settings
 * - Sound & vibration settings
 */

import { Metadata } from 'next';
import { NotificationPreferencesComponent } from '@/components/notifications/NotificationPreferencesComponent';

export const metadata: Metadata = {
  title: 'Notification Settings | Salatiso',
  description: 'Manage your notification preferences and alerts',
};

export default function NotificationSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationPreferencesComponent />
    </div>
  );
}
