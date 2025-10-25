'use client';

import React, { useEffect, useState } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Clock,
  Volume2,
  Vibrate,
  Settings,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import notificationPreferencesService from '@/services/notificationPreferencesService';
import { NotificationPreferences, NotificationChannel, NotificationType, QuietHours } from '@/types/notifications';
import { useToast } from '@/utils/toast';

/**
 * NotificationPreferences Component
 * 
 * Allows users to manage their notification settings including:
 * - Channel preferences (web, email, SMS, push)
 * - Notification type toggles
 * - Quiet hours configuration
 * - Do not disturb mode
 * - Sound and vibration settings
 */
export const NotificationPreferencesComponent: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Load preferences on mount
  useEffect(() => {
    if (!user?.id) return;

    const loadPreferences = async () => {
      try {
        setLoading(true);
        const prefs = await notificationPreferencesService.getUserPreferences(user.id);
        setPreferences(prefs);
        setErrors([]);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to load preferences';
        setErrors([errorMsg]);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return <div className="text-red-600">Failed to load preferences</div>;
  }

  const handleChannelToggle = (channel: NotificationChannel, enabled: boolean) => {
    setPreferences({
      ...preferences,
      channels: {
        ...preferences.channels,
        [channel]: {
          ...preferences.channels[channel],
          enabled,
        },
      },
    });
  };

  const handleNotificationTypeToggle = (key: string, enabled: boolean) => {
    setPreferences({
      ...preferences,
      types: {
        ...preferences.types,
        [key]: enabled,
      },
    });
  };

  const handleEscalationContextToggle = (context: string, enabled: boolean) => {
    setPreferences({
      ...preferences,
      escalationContextNotifications: {
        ...preferences.escalationContextNotifications,
        [context]: enabled,
      },
    });
  };

  const handleEscalationLevelToggle = (level: string, enabled: boolean) => {
    setPreferences({
      ...preferences,
      escalationLevelNotifications: {
        ...preferences.escalationLevelNotifications,
        [level]: enabled,
      },
    });
  };

  const handleQuietHoursChange = (field: keyof QuietHours, value: any) => {
    setPreferences({
      ...preferences,
      globalQuietHours: {
        ...preferences.globalQuietHours,
        [field]: value,
      },
    } as NotificationPreferences);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setPreferences({
      ...preferences,
      soundEnabled: enabled,
    });
  };

  const handleVibrationToggle = (enabled: boolean) => {
    setPreferences({
      ...preferences,
      vibrationEnabled: enabled,
    });
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      
      // Validate
      const validationErrors = notificationPreferencesService.validatePreferences(preferences);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (!user?.id) throw new Error('User not authenticated');

      await notificationPreferencesService.updateUserPreferences(user.id, preferences);
      setErrors([]);
      toast.success('Notification preferences saved successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save preferences';
      setErrors([errorMsg]);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all notification preferences to defaults?')) return;

    try {
      setSaving(true);
      if (!user?.id) throw new Error('User not authenticated');

      await notificationPreferencesService.resetToDefaults(user.id);
      const prefs = await notificationPreferencesService.getUserPreferences(user.id);
      setPreferences(prefs);
      setErrors([]);
      toast.success('Preferences reset to defaults');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to reset preferences';
      setErrors([errorMsg]);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-8 h-8 text-primary-600" />
          Notification Preferences
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleResetDefaults}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg disabled:opacity-50 transition"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          {errors.map((error, idx) => (
            <p key={idx} className="text-red-700 text-sm">
              • {error}
            </p>
          ))}
        </div>
      )}

      {/* Notification Channels */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Notification Channels
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Choose which communication channels you'd like to receive notifications through.
        </p>

        <div className="space-y-4">
          {/* Web */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Web Notifications</p>
                <p className="text-sm text-gray-600">In-app notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.channels.web.enabled}
                onChange={(e) => handleChannelToggle(NotificationChannel.WEB, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>

          {/* Push */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Browser Push</p>
                <p className="text-sm text-gray-600">Desktop/browser notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.channels.push.enabled}
                onChange={(e) => handleChannelToggle(NotificationChannel.PUSH, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Coming soon</div>
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">SMS</p>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">Coming soon</div>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Types</h2>
        <p className="text-gray-600 text-sm mb-6">
          Select which types of escalation notifications you want to receive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'escalationCreated', label: 'New Escalation', desc: 'When a new escalation is created' },
            { key: 'escalationAssigned', label: 'Assignment', desc: 'When you are assigned to handle an escalation' },
            { key: 'escalationEscalated', label: 'Escalated', desc: 'When an escalation moves to a higher level' },
            { key: 'escalationResolved', label: 'Resolved', desc: 'When an escalation is resolved' },
            { key: 'escalationUrgent', label: 'Urgent', desc: 'Urgent escalations requiring immediate action' },
            { key: 'responseDue', label: 'Response Due', desc: 'When response deadline is approaching' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={preferences.types[key as keyof typeof preferences.types]}
                  onChange={(e) => handleNotificationTypeToggle(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded peer peer-checked:after:content-['✓'] after:absolute after:top-[2px] after:left-[6px] after:text-white after:font-bold after:transition-all peer-checked:bg-primary-600" />
              </label>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Context & Level Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contexts */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalation Contexts</h3>
          <div className="space-y-3">
            {['health', 'safety', 'property', 'emotional', 'financial', 'legal', 'other'].map(context => (
              <div key={context} className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.escalationContextNotifications[context as keyof typeof preferences.escalationContextNotifications]}
                    onChange={(e) => handleEscalationContextToggle(context, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded peer peer-checked:bg-primary-600" />
                </label>
                <span className="text-gray-700 capitalize">{context}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Levels */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalation Levels</h3>
          <div className="space-y-3">
            {['individual', 'family', 'community', 'professional'].map(level => (
              <div key={level} className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.escalationLevelNotifications[level as keyof typeof preferences.escalationLevelNotifications]}
                    onChange={(e) => handleEscalationLevelToggle(level, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded peer peer-checked:bg-primary-600" />
                </label>
                <span className="text-gray-700 capitalize">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sound & Vibration */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Audio & Vibration</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Sound</p>
                <p className="text-sm text-gray-600">Play sound on notification</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.soundEnabled ?? true}
                onChange={(e) => handleSoundToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Vibrate className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Vibration</p>
                <p className="text-sm text-gray-600">Vibrate on notification (mobile)</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.vibrationEnabled ?? true}
                onChange={(e) => handleVibrationToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleResetDefaults}
          disabled={saving}
          className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg disabled:opacity-50 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferencesComponent;
