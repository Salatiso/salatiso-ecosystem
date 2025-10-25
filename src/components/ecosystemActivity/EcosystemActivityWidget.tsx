/**
 * EcosystemActivityWidget.tsx
 * 
 * React component for displaying real-time ecosystem activities.
 * Shows activities from all apps with filtering, deep linking, and status indicators.
 * 
 * Can run in two modes:
 * - Compact: Shows 4 recent activities in a dashboard card
 * - Full: Shows all activities with filters and detailed view
 * 
 * @version 1.0.0
 * @author Ecosystem Architecture Team
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  activityService,
  Activity,
  ActivityFilters,
  ActivityStats,
  SourceApp,
  ActivityCategory,
  ActivityPriority,
} from '@/services/EcosystemActivityService';
import {
  ArrowRight,
  RefreshCw,
  Filter,
  Check,
  Trash2,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
} from 'lucide-react';

/**
 * Component props
 */
interface EcosystemActivityWidgetProps {
  /** User ID (optional - uses auth context if not provided) */
  userId?: string;
  /** Maximum number of activities to display */
  limit?: number;
  /** Display mode: compact (4 items) or full (all items) */
  mode?: 'compact' | 'full';
  /** Show filter UI */
  showFilters?: boolean;
  /** Initial filters */
  initialFilters?: ActivityFilters;
  /** Show statistics at top */
  showStats?: boolean;
  /** Callback when activity is clicked */
  onActivityClick?: (activity: Activity) => void;
  /** Custom CSS class */
  className?: string;
}

/**
 * App metadata for display
 */
const APP_METADATA: Record<
  SourceApp,
  { color: string; icon: string; displayName: string }
> = {
  LifeSync: { color: '#6366F1', icon: '👤', displayName: 'LifeSync' },
  Hub: { color: '#3B82F6', icon: '🏠', displayName: 'Hub' },
  BizHelp: { color: '#EC4899', icon: '💼', displayName: 'BizHelp' },
  FinHelp: { color: '#10B981', icon: '💰', displayName: 'FinHelp' },
  SafetyHelp: { color: '#EF4444', icon: '🛡️', displayName: 'SafetyHelp' },
  PigeeBack: { color: '#F59E0B', icon: '🚗', displayName: 'PigeeBack' },
  Ekhaya: { color: '#8B5CF6', icon: '🤝', displayName: 'Ekhaya' },
  DocHelp: { color: '#06B6D4', icon: '📄', displayName: 'DocHelp' },
  SaziAcademy: { color: '#14B8A6', icon: '🎓', displayName: 'Sazi Academy' },
};

/**
 * Priority color mapping
 */
const PRIORITY_COLORS: Record<ActivityPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
};

/**
 * Main component
 */
export const EcosystemActivityWidget: React.FC<
  EcosystemActivityWidgetProps
> = ({
  userId,
  limit = 10,
  mode = 'full',
  showFilters = true,
  initialFilters,
  showStats = true,
  onActivityClick,
  className = '',
}) => {
  // Context and auth
  const { user } = useAuth();
  const actualUserId = userId || user?.id;

  // State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<ActivityFilters>(initialFilters || {});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Real-time listener cleanup
  const unsubscribeRef = React.useRef<(() => void) | null>(null);

  /**
   * Setup real-time listener
   */
  useEffect(() => {
    if (!actualUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time updates
    unsubscribeRef.current = activityService.subscribeToActivities(
      actualUserId,
      (newActivities) => {
        setActivities(newActivities);
        setLoading(false);
      },
      filters
    );

    // Fetch stats
    const fetchStats = async () => {
      const statsData = await activityService.getActivityStats(actualUserId);
      setStats(statsData);
    };

    if (showStats) {
      fetchStats();
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [actualUserId, showStats, filters]);

  /**
   * Handle manual sync
   */
  const handleSync = useCallback(async () => {
    if (!actualUserId) return;

    setSyncing(true);
    try {
      const result = await activityService.triggerSync(actualUserId);
      if (!result.success) {
        setError(result.error || 'Sync failed');
      }
    } catch (err) {
      setError('Failed to sync activities');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  }, [actualUserId]);

  /**
   * Handle activity click (deep link)
   */
  const handleActivityClick = useCallback(
    (activity: Activity) => {
      onActivityClick?.(activity);

      // Navigate to deep link
      if (activity.deepLink) {
        // Add referrer parameter
        const url = new URL(activity.deepLink, window.location.origin);
        url.searchParams.append('referrer', 'ecosystem-activity');
        url.searchParams.append('returnUrl', window.location.href);
        window.location.href = url.toString();
      }
    },
    [onActivityClick]
  );

  /**
   * Handle mark as read
   */
  const handleMarkRead = useCallback(
    async (e: React.MouseEvent, activity: Activity) => {
      e.stopPropagation();
      if (!actualUserId) return;

      await activityService.updateActivityRead(actualUserId, activity.id);
    },
    [actualUserId]
  );

  /**
   * Handle delete activity
   */
  const handleDelete = useCallback(
    async (e: React.MouseEvent, activity: Activity) => {
      e.stopPropagation();
      if (!actualUserId) return;

      await activityService.deleteActivity(actualUserId, activity.id);
    },
    [actualUserId]
  );

  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback(
    (newFilters: ActivityFilters) => {
      setFilters(newFilters);
    },
    []
  );

  /**
   * Get app metadata
   */
  const getAppMetadata = (sourceApp: SourceApp) => {
    return APP_METADATA[sourceApp] || APP_METADATA.Hub;
  };

  /**
   * Format date
   */
  const formatDate = (timestamp: any): string => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  // Limit activities for compact mode
  const displayActivities =
    mode === 'compact' ? activities.slice(0, 4) : activities.slice(0, limit);

  const isReadBy = (activity: Activity): boolean => {
    return !!activity.metadata?.readBy?.[actualUserId!];
  };

  return (
    <div
      className={`ecosystem-activity-widget space-y-4 ${className}`}
      data-testid="ecosystem-activity-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Ecosystem Activity
          </h2>
          <p className="text-sm text-gray-500">
            Real-time updates from all your apps
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sync button */}
          <button
            onClick={handleSync}
            disabled={syncing || loading}
            className={`p-2 rounded-lg transition-colors ${
              syncing || loading
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Refresh activities"
          >
            <RefreshCw
              size={18}
              className={syncing ? 'animate-spin' : ''}
            />
          </button>

          {/* Filter button */}
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-2 rounded-lg transition-colors ${
                showFilterPanel
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Toggle filters"
            >
              <Filter size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Activities"
            value={stats.totalActivities}
            icon="📊"
          />
          <StatCard
            label="Most Active App"
            value={stats.mostActiveApp}
            icon="🏆"
          />
          <StatCard
            label="This Week"
            value={stats.activitiesByDay ? Object.keys(stats.activitiesByDay).length : 0}
            icon="📅"
          />
          <StatCard
            label="Unread"
            value={stats.unreadCount}
            icon="🔔"
          />
        </div>
      )}

      {/* Filters Panel */}
      {showFilterPanel && showFilters && (
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-700 hover:text-red-900 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && activities.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="mx-auto mb-2 text-gray-400 animate-spin" size={32} />
            <p className="text-sm text-gray-500">Loading activities...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && activities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No activities yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Activities from all your apps will appear here
          </p>
        </div>
      )}

      {/* Activities list */}
      {displayActivities.length > 0 && (
        <div className="space-y-2">
          {displayActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isRead={isReadBy(activity)}
              appMetadata={getAppMetadata(activity.sourceApp)}
              formatDate={formatDate}
              onActivityClick={handleActivityClick}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              mode={mode}
            />
          ))}
        </div>
      )}

      {/* View all button */}
      {mode === 'compact' && activities.length > 4 && (
        <button className="w-full px-4 py-2 text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
          View all activities
          <ArrowRight size={16} />
        </button>
      )}

      {/* Syncing indicator */}
      {syncing && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader size={14} className="animate-spin" />
          Syncing...
        </div>
      )}
    </div>
  );
};

/**
 * Statistic card component
 */
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
}> = ({ label, value, icon }) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center">
    <div className="text-2xl mb-1">{icon}</div>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

/**
 * Activity item component
 */
const ActivityItem: React.FC<{
  activity: Activity;
  isRead: boolean;
  appMetadata: (typeof APP_METADATA)[SourceApp];
  formatDate: (timestamp: any) => string;
  onActivityClick: (activity: Activity) => void;
  onMarkRead: (e: React.MouseEvent, activity: Activity) => void;
  onDelete: (e: React.MouseEvent, activity: Activity) => void;
  mode: 'compact' | 'full';
}> = ({
  activity,
  isRead,
  appMetadata,
  formatDate,
  onActivityClick,
  onMarkRead,
  onDelete,
  mode,
}) => (
  <div
    onClick={() => onActivityClick(activity)}
    className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
      isRead
        ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
        : 'bg-blue-50 border-blue-200 hover:border-blue-300'
    }`}
  >
    <div className="flex items-start gap-3">
      {/* App icon */}
      <div
        className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: `${appMetadata.color}20` }}
      >
        {appMetadata.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900">
                {activity.activityTitle}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${appMetadata.color}20`,
                  color: appMetadata.color,
                }}
              >
                {appMetadata.displayName}
              </span>
              {activity.priority !== 'medium' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    PRIORITY_COLORS[activity.priority]
                  }`}
                >
                  {activity.priority}
                </span>
              )}
            </div>
            {activity.activityDescription && mode === 'full' && (
              <p className="text-sm text-gray-600 mt-1">
                {activity.activityDescription}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(activity.timestamp)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {!isRead && (
              <button
                onClick={(e) => onMarkRead(e, activity)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Mark as read"
              >
                <Eye size={16} />
              </button>
            )}
            <button
              onClick={(e) => onDelete(e, activity)}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Deep link button */}
        {activity.deepLink && mode === 'full' && (
          <button
            onClick={() => onActivityClick(activity)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
          >
            View in {appMetadata.displayName}
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Filter panel component
 */
const FilterPanel: React.FC<{
  filters: ActivityFilters;
  onFilterChange: (filters: ActivityFilters) => void;
}> = ({ filters, onFilterChange }) => {
  const apps: SourceApp[] = [
    'LifeSync',
    'Hub',
    'BizHelp',
    'FinHelp',
    'SafetyHelp',
    'PigeeBack',
    'Ekhaya',
    'DocHelp',
    'SaziAcademy',
  ];

  const categories: ActivityCategory[] = [
    'profile',
    'business',
    'finance',
    'safety',
    'community',
    'learning',
    'document',
  ];

  const priorities: ActivityPriority[] = ['low', 'medium', 'high', 'critical'];

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Apps filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Apps
          </label>
          <select
            multiple
            value={filters.sourceApps || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) =>
                option.value
              );
              onFilterChange({
                ...filters,
                sourceApps: selected.length > 0 ? (selected as SourceApp[]) : undefined,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            size={3}
          >
            {apps.map((app) => (
              <option key={app} value={app}>
                {APP_METADATA[app].displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Categories filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Categories
          </label>
          <select
            multiple
            value={filters.categories || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) =>
                option.value
              );
              onFilterChange({
                ...filters,
                categories: selected.length > 0 ? (selected as ActivityCategory[]) : undefined,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            size={3}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Priority filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Priority
          </label>
          <select
            multiple
            value={filters.priorities || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) =>
                option.value
              );
              onFilterChange({
                ...filters,
                priorities: selected.length > 0 ? (selected as ActivityPriority[]) : undefined,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            size={3}
          >
            {priorities.map((pri) => (
              <option key={pri} value={pri}>
                {pri.charAt(0).toUpperCase() + pri.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear filters button */}
      <button
        onClick={() => {
          onFilterChange({});
        }}
        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default EcosystemActivityWidget;
