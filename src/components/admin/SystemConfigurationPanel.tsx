/**
 * SystemConfigurationPanel Component - Phase 4.8 Admin Panel
 * System-wide settings and configuration options
 * API settings, features, security options
 */

'use client';

import React, { useState } from 'react';
import { Settings, Save, RotateCw, AlertCircle, Zap, Mail, Lock, Database } from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  settings: ConfigSetting[];
}

interface ConfigSetting {
  id: string;
  label: string;
  type: 'toggle' | 'text' | 'select' | 'number';
  value: any;
  options?: Array<{ label: string; value: string }>;
  description?: string;
}

export const SystemConfigurationPanel: React.FC = () => {
  const [config, setConfig] = useState<Record<string, any>>({
    // General
    app_name: 'Salatiso Dashboard',
    app_version: '4.8.0',
    timezone: 'UTC',
    
    // Email
    email_enabled: true,
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'notifications@salatiso.com',
    
    // Security
    two_factor_auth: true,
    password_min_length: 12,
    session_timeout: 30,
    enable_api_keys: true,
    
    // Database
    db_max_connections: 100,
    db_query_timeout: 30,
    backup_enabled: true,
    backup_frequency: 'daily',
    
    // Features
    enable_notifications: true,
    enable_collaboration: true,
    enable_analytics: true,
    enable_offline_mode: true,
    
    // Performance
    cache_enabled: true,
    cache_ttl: 3600,
    enable_compression: true,
    enable_cdn: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const configSections: ConfigSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <Settings className="w-5 h-5" />,
      settings: [
        { id: 'app_name', label: 'Application Name', type: 'text', value: config.app_name },
        { id: 'app_version', label: 'Version', type: 'text', value: config.app_version },
        {
          id: 'timezone',
          label: 'Time Zone',
          type: 'select',
          value: config.timezone,
          options: [
            { label: 'UTC', value: 'UTC' },
            { label: 'EST', value: 'EST' },
            { label: 'CST', value: 'CST' },
            { label: 'PST', value: 'PST' },
          ],
        },
      ],
    },
    {
      id: 'email',
      title: 'Email Configuration',
      icon: <Mail className="w-5 h-5" />,
      settings: [
        { id: 'email_enabled', label: 'Enable Email Notifications', type: 'toggle', value: config.email_enabled },
        { id: 'smtp_host', label: 'SMTP Host', type: 'text', value: config.smtp_host },
        { id: 'smtp_port', label: 'SMTP Port', type: 'number', value: config.smtp_port },
        { id: 'smtp_user', label: 'SMTP Username', type: 'text', value: config.smtp_user },
      ],
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: <Lock className="w-5 h-5" />,
      settings: [
        { id: 'two_factor_auth', label: 'Require Two-Factor Authentication', type: 'toggle', value: config.two_factor_auth },
        { id: 'password_min_length', label: 'Minimum Password Length', type: 'number', value: config.password_min_length },
        { id: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', value: config.session_timeout },
        { id: 'enable_api_keys', label: 'Enable API Keys', type: 'toggle', value: config.enable_api_keys },
      ],
    },
    {
      id: 'database',
      title: 'Database Settings',
      icon: <Database className="w-5 h-5" />,
      settings: [
        { id: 'db_max_connections', label: 'Max Connections', type: 'number', value: config.db_max_connections },
        { id: 'db_query_timeout', label: 'Query Timeout (seconds)', type: 'number', value: config.db_query_timeout },
        { id: 'backup_enabled', label: 'Enable Automatic Backups', type: 'toggle', value: config.backup_enabled },
        {
          id: 'backup_frequency',
          label: 'Backup Frequency',
          type: 'select',
          value: config.backup_frequency,
          options: [
            { label: 'Hourly', value: 'hourly' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
          ],
        },
      ],
    },
    {
      id: 'features',
      title: 'Feature Toggles',
      icon: <Zap className="w-5 h-5" />,
      settings: [
        { id: 'enable_notifications', label: 'Enable Notifications', type: 'toggle', value: config.enable_notifications },
        { id: 'enable_collaboration', label: 'Enable Collaboration Features', type: 'toggle', value: config.enable_collaboration },
        { id: 'enable_analytics', label: 'Enable Analytics', type: 'toggle', value: config.enable_analytics },
        { id: 'enable_offline_mode', label: 'Enable Offline Mode', type: 'toggle', value: config.enable_offline_mode },
      ],
    },
  ];

  const handleConfigChange = (settingId: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [settingId]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setShowNotification(true);
    setHasChanges(false);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">Manage system settings and configuration options</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            <RotateCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {showNotification && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">Configuration saved successfully!</p>
        </div>
      )}

      {/* Configuration Sections */}
      <div className="space-y-6">
        {configSections.map(section => (
          <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6 flex items-center gap-3">
              <div className="text-gray-600">{section.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>

            {/* Settings */}
            <div className="p-6 space-y-6">
              {section.settings.map(setting => (
                <div key={setting.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="font-medium text-gray-900">{setting.label}</label>
                    {setting.description && (
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex-shrink-0">
                    {setting.type === 'toggle' && (
                      <button
                        onClick={() => handleConfigChange(setting.id, !setting.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.value ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}

                    {setting.type === 'text' && (
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleConfigChange(setting.id, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 w-48"
                      />
                    )}

                    {setting.type === 'number' && (
                      <input
                        type="number"
                        value={setting.value}
                        onChange={(e) => handleConfigChange(setting.id, parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 w-32"
                      />
                    )}

                    {setting.type === 'select' && (
                      <select
                        value={setting.value}
                        onChange={(e) => handleConfigChange(setting.id, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 w-48"
                      >
                        {setting.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Warning Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-orange-900">System Configuration Notice</h3>
          <p className="text-sm text-orange-800 mt-2">
            Changes to system configuration take effect immediately. Some changes may require server restart.
            Critical settings like database configuration should only be modified by experienced administrators.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper component for CheckCircle if not already imported
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
