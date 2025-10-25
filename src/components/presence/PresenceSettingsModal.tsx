import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Users,
  UserCheck,
  Settings,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { AccessibleModal } from '@/components/accessibility';
import presenceService, { PresenceSettings as IPresenceSettings, PresenceStatus } from '@/services/PresenceService';
import { useAuth } from '@/contexts/AuthContext';

interface PresenceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PresenceSettingsModal: React.FC<PresenceSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<IPresenceSettings>({
    defaultStatus: 'online',
    showOnlineStatus: true,
    allowFamilyToSee: true,
    allowContactsToSee: true
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadSettings();
    }
  }, [isOpen, user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userSettings = await presenceService.getPresenceSettings(user.id);
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error('Error loading presence settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await presenceService.updatePresenceSettings(user.id, settings);
      setSaved(true);

      // Auto-close after 1 second
      setTimeout(() => {
        onClose();
        setSaved(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving presence settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions: { value: PresenceStatus; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'online',
      label: 'Online',
      description: 'Show when you are active',
      icon: <div className="w-3 h-3 bg-green-500 rounded-full" />
    },
    {
      value: 'offline',
      label: 'Appear Offline',
      description: 'Always show as offline',
      icon: <div className="w-3 h-3 bg-gray-400 rounded-full" />
    },
    {
      value: 'invisible',
      label: 'Invisible',
      description: 'Hide your online status completely',
      icon: <EyeOff className="w-4 h-4 text-gray-500" />
    }
  ];

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Presence & Privacy Settings"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-ubuntu-orange animate-spin" />
          </div>
        ) : (
          <>
            {/* Default Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Default Status
              </h3>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, defaultStatus: option.value })}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      settings.defaultStatus === option.value
                        ? 'border-ubuntu-orange bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{option.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      {settings.defaultStatus === option.value && (
                        <CheckCircle className="w-5 h-5 text-ubuntu-orange flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility Controls */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Who Can See Your Status
              </h3>
              <div className="space-y-3">
                {/* Show Online Status */}
                <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showOnlineStatus}
                    onChange={(e) => setSettings({ ...settings, showOnlineStatus: e.target.checked })}
                    className="mt-1 w-4 h-4 text-ubuntu-orange border-gray-300 rounded focus:ring-ubuntu-orange"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Show my online status</div>
                    <div className="text-sm text-gray-600">
                      Display when you are active on the platform
                    </div>
                  </div>
                </label>

                {/* Family Visibility */}
                <label className={`flex items-start gap-3 p-3 rounded-lg border ${
                  settings.showOnlineStatus 
                    ? 'border-gray-200 hover:bg-gray-50 cursor-pointer' 
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}>
                  <input
                    type="checkbox"
                    checked={settings.allowFamilyToSee}
                    onChange={(e) => setSettings({ ...settings, allowFamilyToSee: e.target.checked })}
                    disabled={!settings.showOnlineStatus}
                    className="mt-1 w-4 h-4 text-ubuntu-orange border-gray-300 rounded focus:ring-ubuntu-orange disabled:opacity-50"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Family Members
                    </div>
                    <div className="text-sm text-gray-600">
                      Allow family members to see when you are online
                    </div>
                  </div>
                </label>

                {/* Contacts Visibility */}
                <label className={`flex items-start gap-3 p-3 rounded-lg border ${
                  settings.showOnlineStatus 
                    ? 'border-gray-200 hover:bg-gray-50 cursor-pointer' 
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}>
                  <input
                    type="checkbox"
                    checked={settings.allowContactsToSee}
                    onChange={(e) => setSettings({ ...settings, allowContactsToSee: e.target.checked })}
                    disabled={!settings.showOnlineStatus}
                    className="mt-1 w-4 h-4 text-ubuntu-orange border-gray-300 rounded focus:ring-ubuntu-orange disabled:opacity-50"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      My Contacts
                    </div>
                    <div className="text-sm text-gray-600">
                      Allow your contacts to see when you are online
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Privacy Note:</strong> Even when invisible, your last seen time will be hidden. 
                Family members and contacts will only see you as offline.
              </p>
            </div>

            {/* Success Message */}
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800 font-medium">Settings saved successfully!</p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="flex-1 px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </AccessibleModal>
  );
};

export default PresenceSettingsModal;
