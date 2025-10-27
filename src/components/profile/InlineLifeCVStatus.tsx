/**
 * Inline LifeCV Status Component
 * Displays LifeCV sync status and progress within profile page
 * Date: October 26, 2025
 */

import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, ExternalLink, Zap } from 'lucide-react';

interface LifeCVStatusData {
  syncStatus: 'synced' | 'syncing' | 'out-of-sync' | 'not-started';
  lastSyncTime?: string;
  completionPercentage: number;
  profileSections: {
    name: string;
    completed: boolean;
    percentage: number;
  }[];
  trustScore?: number;
  nextSyncSchedule?: string;
}

interface InlineLifeCVStatusProps {
  data?: LifeCVStatusData;
  onOpenLifeSync?: () => void;
  compact?: boolean;
}

// Mock LifeCV data
const mockLifeCVData: LifeCVStatusData = {
  syncStatus: 'synced',
  lastSyncTime: new Date(Date.now() - 2 * 60000).toLocaleTimeString(),
  completionPercentage: 65,
  profileSections: [
    { name: 'Personal Information', completed: true, percentage: 100 },
    { name: 'Professional Background', completed: true, percentage: 100 },
    { name: 'Education', completed: false, percentage: 0 },
    { name: 'Certifications', completed: false, percentage: 40 },
    { name: 'Skills & Expertise', completed: true, percentage: 85 },
    { name: 'Work Experience', completed: true, percentage: 100 },
    { name: 'References', completed: false, percentage: 0 },
  ],
  trustScore: 78,
  nextSyncSchedule: 'Continuous',
};

export const InlineLifeCVStatus: React.FC<InlineLifeCVStatusProps> = ({
  data = mockLifeCVData,
  onOpenLifeSync,
  compact = false,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'syncing':
        return <Zap className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'out-of-sync':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSyncStatusText = (status: string): string => {
    switch (status) {
      case 'synced':
        return 'Synced with LifeSync';
      case 'syncing':
        return 'Syncing...';
      case 'out-of-sync':
        return 'Out of sync';
      default:
        return 'Not synced';
    }
  };

  const getSyncStatusColor = (status: string): string => {
    switch (status) {
      case 'synced':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'syncing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'out-of-sync':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (compact) {
    return (
      <div className={`border rounded-lg p-4 ${getSyncStatusColor(data.syncStatus)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSyncStatusIcon(data.syncStatus)}
            <div>
              <p className="font-semibold text-sm">{getSyncStatusText(data.syncStatus)}</p>
              <p className="text-xs">{data.completionPercentage}% Complete</p>
            </div>
          </div>
          {onOpenLifeSync && (
            <button
              onClick={onOpenLifeSync}
              className="px-3 py-1 text-sm font-medium rounded hover:opacity-80 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">LifeCV Status</h3>
          <p className="text-sm text-gray-600 mt-1">
            Your profile is automatically synced with LifeSync
          </p>
        </div>
        {onOpenLifeSync && (
          <button
            onClick={onOpenLifeSync}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open LifeSync
          </button>
        )}
      </div>

      {/* Sync Status & Trust Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sync Status */}
        <div className={`border rounded-lg p-4 ${getSyncStatusColor(data.syncStatus)}`}>
          <div className="flex items-center gap-2 mb-2">
            {getSyncStatusIcon(data.syncStatus)}
            <span className="font-semibold text-sm">{getSyncStatusText(data.syncStatus)}</span>
          </div>
          {data.lastSyncTime && (
            <p className="text-xs">
              Last sync: {data.lastSyncTime}
            </p>
          )}
        </div>

        {/* Completion */}
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <p className="font-semibold text-sm text-blue-900">Profile Completion</p>
          <div className="mt-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-blue-600">{data.completionPercentage}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${data.completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Trust Score */}
        {data.trustScore && (
          <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
            <p className="font-semibold text-sm text-purple-900">Trust Score</p>
            <div className="mt-2">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-purple-600">{data.trustScore}</span>
                <span className="text-sm text-purple-700">/100</span>
              </div>
              <p className="text-xs text-purple-700 mt-1">✓ Verified Profile</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Sections */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Profile Sections</h4>
        <div className="space-y-2">
          {data.profileSections.map((section, index) => (
            <div key={index}>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === section.name ? null : section.name
                  )
                }
                className="w-full text-left flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {section.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={`font-medium ${
                      section.completed ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {section.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    section.percentage === 100
                      ? 'text-green-600'
                      : section.percentage > 0
                      ? 'text-amber-600'
                      : 'text-gray-500'
                  }`}
                >
                  {section.percentage}%
                </span>
              </button>

              {/* Progress Bar */}
              <div className="px-3 pb-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      section.percentage === 100
                        ? 'bg-green-600'
                        : section.percentage > 0
                        ? 'bg-amber-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: `${section.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">Synced Across Ecosystem</p>
            <p className="text-blue-800">
              Your profile is synchronized with LifeSync in real-time. Fill out sections here or on LifeSync - updates appear everywhere instantly.
            </p>
            {data.nextSyncSchedule && (
              <p className="text-xs text-blue-700 mt-2">
                Next sync: {data.nextSyncSchedule}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineLifeCVStatus;
