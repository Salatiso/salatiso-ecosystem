/**
 * AdminPanel Component - Phase 4.8 Admin Panel
 * Master admin dashboard container integrating all admin components
 * Dashboard, user management, system configuration, audit logs
 */

'use client';

import React, { useState } from 'react';
import { Shield, Users, Settings, FileText, Bell } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { UserManagementPanel } from './UserManagementPanel';
import { SystemConfigurationPanel } from './SystemConfigurationPanel';
import { AuditLogViewer } from './AuditLogViewer';

type AdminTabType = 'dashboard' | 'users' | 'config' | 'audit';

interface AdminTab {
  id: AdminTabType;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
  const [notifications, setNotifications] = useState(4); // From AdminDashboard

  const adminTabs: AdminTab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      badge: 1, // 1 inactive user
    },
    {
      id: 'config',
      label: 'System Config',
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Panel Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Administration Panel</h1>
            <p className="text-slate-300 mt-1">System management and configuration</p>
          </div>
        </div>
      </div>

      {/* Notification Alert if there are security events */}
      {notifications > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <Bell className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900">System Notifications</h3>
            <p className="text-sm text-orange-800 mt-1">
              {notifications} system events require attention. Check the dashboard for more details.
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {adminTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'users' && <UserManagementPanel />}
          {activeTab === 'config' && <SystemConfigurationPanel />}
          {activeTab === 'audit' && <AuditLogViewer />}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600 border border-gray-200">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p className="mt-1">All changes are logged in the Audit Logs for security and compliance</p>
      </div>
    </div>
  );
};
