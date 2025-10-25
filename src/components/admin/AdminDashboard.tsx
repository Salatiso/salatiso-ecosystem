/**
 * AdminDashboard Component - Phase 4.8 Admin Panel
 * System-wide admin dashboard with key metrics and shortcuts
 * Overview of system health, users, and operations
 */

'use client';

import React, { useState } from 'react';
import { Shield, Users, AlertTriangle, Activity, TrendingUp, Settings, Eye, Lock } from 'lucide-react';

interface AdminMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' | 'stable' };
  backgroundColor: string;
}

interface AdminAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

export const AdminDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const metrics: AdminMetric[] = [
    {
      label: 'Total Users',
      value: '1,284',
      icon: <Users className="w-6 h-6" />,
      trend: { value: 12, direction: 'up' },
      backgroundColor: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'System Uptime',
      value: '99.98%',
      icon: <Activity className="w-6 h-6" />,
      trend: { value: 0, direction: 'stable' },
      backgroundColor: 'bg-green-50 border-green-200',
    },
    {
      label: 'Active Sessions',
      value: '487',
      icon: <Eye className="w-6 h-6" />,
      trend: { value: 23, direction: 'up' },
      backgroundColor: 'bg-purple-50 border-purple-200',
    },
    {
      label: 'Security Events',
      value: '4',
      icon: <Lock className="w-6 h-6" />,
      trend: { value: 2, direction: 'down' },
      backgroundColor: 'bg-orange-50 border-orange-200',
    },
  ];

  const quickActions: AdminAction[] = [
    {
      id: 'manage-users',
      label: 'Manage Users',
      description: 'Create, edit, or remove user accounts',
      icon: <Users className="w-5 h-5" />,
      action: () => console.log('Manage users'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      description: 'Configure system-wide settings',
      icon: <Settings className="w-5 h-5" />,
      action: () => console.log('System settings'),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'security-audit',
      label: 'Security Audit',
      description: 'View security events and logs',
      icon: <Lock className="w-5 h-5" />,
      action: () => console.log('Security audit'),
      color: 'bg-red-600 hover:bg-red-700',
    },
    {
      id: 'system-health',
      label: 'System Health',
      description: 'Monitor system performance',
      icon: <TrendingUp className="w-5 h-5" />,
      action: () => console.log('System health'),
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  const recentActivity = [
    { time: '2 hours ago', action: 'User Sarah Johnson reset password', severity: 'info' },
    { time: '4 hours ago', action: 'Failed login attempt from IP 192.168.1.100', severity: 'warning' },
    { time: '6 hours ago', action: 'System maintenance completed', severity: 'success' },
    { time: '8 hours ago', action: 'New user registration: Mike Chen', severity: 'info' },
    { time: '10 hours ago', action: 'Database backup completed', severity: 'success' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">System overview and administration controls</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTimeRange === range
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`rounded-lg border ${metric.backgroundColor} p-6`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                {metric.trend && (
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <TrendingUp
                      className={`w-4 h-4 ${
                        metric.trend.direction === 'up'
                          ? 'text-green-600'
                          : metric.trend.direction === 'down'
                          ? 'text-red-600 rotate-180'
                          : 'text-gray-600'
                      }`}
                    />
                    <span className={metric.trend.direction === 'up' ? 'text-green-600' : 'text-gray-600'}>
                      {metric.trend.direction === 'up' ? '+' : ''}
                      {metric.trend.value}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white bg-opacity-50 rounded-lg">
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              className={`p-6 rounded-lg text-white font-medium transition-all hover:shadow-lg hover:scale-105 flex flex-col items-center gap-3 text-center ${action.color}`}
            >
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                {action.icon}
              </div>
              <div>
                <p className="font-semibold">{action.label}</p>
                <p className="text-xs text-white text-opacity-80 mt-1">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            {[
              { label: 'API Response Time', value: '145ms', status: 'good' },
              { label: 'Database Performance', value: '98.5%', status: 'good' },
              { label: 'Cache Hit Rate', value: '87.2%', status: 'good' },
              { label: 'Error Rate', value: '0.02%', status: 'good' },
              { label: 'CPU Usage', value: '34%', status: 'good' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.status === 'good' ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: item.value }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  item.severity === 'success' ? 'bg-green-600' :
                  item.severity === 'warning' ? 'bg-yellow-600' :
                  'bg-blue-600'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-yellow-900">Security Notice</h3>
          <p className="text-sm text-yellow-800 mt-1">
            4 security events detected in the last 24 hours. Review audit logs for details.
            Consider enabling two-factor authentication for all admin accounts.
          </p>
        </div>
      </div>
    </div>
  );
};
