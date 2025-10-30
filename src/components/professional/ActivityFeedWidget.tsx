/**
 * Activity Feed Widget
 * 
 * Displays real-time cross-app activities from MNI and BizHelp
 * with filtering, sorting, and search capabilities
 * 
 * @component ActivityFeedWidget
 */

import React, { useMemo, useState } from 'react';
import {
  Filter,
  Search,
  Clock,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  User,
  X,
} from 'lucide-react';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import { BusinessActivity } from '@/services/bizHelpIntegration';
import { AccessibleButton } from '@/components/accessibility';

interface ActivityFeedWidgetProps {
  companyId: string;
  maxItems?: number;
  filterByType?: string[];
  filterBySource?: ('MNI' | 'BizHelp' | 'Hub')[];
  compact?: boolean;
  onActivityClick?: (activity: BusinessActivity) => void;
}

/**
 * Activity type icon mapping
 */
const getActivityIcon = (type: string) => {
  if (type.includes('created') || type.includes('added')) return <Zap className="w-4 h-4 text-blue-600" />;
  if (type.includes('completed') || type.includes('success')) return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (type.includes('error') || type.includes('overdue')) return <AlertCircle className="w-4 h-4 text-red-600" />;
  if (type.includes('updated') || type.includes('changed')) return <TrendingUp className="w-4 h-4 text-orange-600" />;
  return <Clock className="w-4 h-4 text-gray-600" />;
};

/**
 * Format activity type for display
 */
const formatActivityType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format timestamp
 */
const formatTime = (timestamp: any): string => {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) return 'Just now';
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Less than 1 week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // Format as date
  return date.toLocaleDateString();
};

/**
 * Source badge component
 */
const SourceBadge: React.FC<{ source: string }> = ({ source }) => {
  const sourceColor: Record<string, string> = {
    MNI: 'bg-blue-100 text-blue-800',
    BizHelp: 'bg-indigo-100 text-indigo-800',
    Hub: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${sourceColor[source] || 'bg-gray-100 text-gray-800'}`}>
      {source}
    </span>
  );
};

/**
 * Activity Feed Widget - Main Component
 */
export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({
  companyId,
  maxItems = 50,
  filterByType,
  filterBySource = ['MNI', 'BizHelp', 'Hub'],
  compact = false,
  onActivityClick,
}) => {
  const { activities, loading, error } = useBizHelpIntegration(companyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    return activities
      .filter(activity => {
        // Type filter
        if (selectedType && activity.type !== selectedType) return false;
        if (filterByType && !filterByType.includes(activity.type)) return false;

        // Source filter
        if (selectedSource && activity.source !== selectedSource) return false;
        if (!filterBySource.includes(activity.source)) return false;

        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            activity.type.toLowerCase().includes(searchLower) ||
            activity.source.toLowerCase().includes(searchLower) ||
            JSON.stringify(activity.data).toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .slice(0, maxItems);
  }, [activities, searchTerm, selectedType, selectedSource, filterByType, filterBySource, maxItems]);

  // Get unique activity types for filter
  const activityTypes = useMemo(() => {
    return [...new Set(activities.map(a => a.type))];
  }, [activities]);

  // Get statistics
  const stats = useMemo(() => {
    return {
      total: activities.length,
      mni: activities.filter(a => a.source === 'MNI').length,
      bizhelp: activities.filter(a => a.source === 'BizHelp').length,
      hub: activities.filter(a => a.source === 'Hub').length,
    };
  }, [activities]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Failed to Load Activity Feed</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No activities yet</p>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {formatActivityType(activity.type)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <SourceBadge source={activity.source} />
                    <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Activities</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">From MNI</p>
          <p className="text-3xl font-bold text-blue-900">{stats.mni}</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <p className="text-sm text-indigo-600 mb-1">From BizHelp</p>
          <p className="text-3xl font-bold text-indigo-900">{stats.bizhelp}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 mb-1">From Hub</p>
          <p className="text-3xl font-bold text-purple-900">{stats.hub}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <AccessibleButton
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            ariaLabel="Toggle filters"
          >
            <Filter className="w-4 h-4" />
            Filters
          </AccessibleButton>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {/* Activity Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <AccessibleButton
                  onClick={() => setSelectedType(null)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedType === null
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                  ariaLabel="Clear type filter"
                >
                  All Types ({activityTypes.length})
                </AccessibleButton>
                {activityTypes.map(type => (
                  <AccessibleButton
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-3 py-2 rounded text-sm capitalize ${
                      selectedType === type
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    ariaLabel={`Filter by ${type}`}
                  >
                    {formatActivityType(type)}
                  </AccessibleButton>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <div className="space-y-2">
                <AccessibleButton
                  onClick={() => setSelectedSource(null)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedSource === null
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                  ariaLabel="Clear source filter"
                >
                  All Sources
                </AccessibleButton>
                {['MNI', 'BizHelp', 'Hub'].map(source => (
                  <AccessibleButton
                    key={source}
                    onClick={() => setSelectedSource(source)}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      selectedSource === source
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    ariaLabel={`Filter by ${source}`}
                  >
                    <SourceBadge source={source} />
                    <span className="ml-2">{source}</span>
                  </AccessibleButton>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No activities found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Activities will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity, index) => (
              <AccessibleButton
                key={activity.id || index}
                onClick={() => onActivityClick?.(activity)}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
                ariaLabel={`Activity: ${formatActivityType(activity.type)}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {formatActivityType(activity.type)}
                      </p>
                      {activity.data && Object.keys(activity.data).length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {Object.entries(activity.data)
                            .slice(0, 2)
                            .map(([key, value]) => `${key}: ${String(value).substring(0, 20)}`)
                            .join(' • ')}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <SourceBadge source={activity.source} />
                      <p className="text-xs text-gray-500 mt-2">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>

                  {activity.userId && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>By {activity.userId}</span>
                    </div>
                  )}
                </div>
              </AccessibleButton>
            ))}
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <p className="text-sm text-blue-900">
          <strong>Showing:</strong> {filteredActivities.length} of {stats.total} activities
        </p>
        <p className="text-xs text-blue-700 mt-2">
          Activities are synced in real-time between MNI, BizHelp, and Hub platforms.
        </p>
      </div>
    </div>
  );
};

export default ActivityFeedWidget;
