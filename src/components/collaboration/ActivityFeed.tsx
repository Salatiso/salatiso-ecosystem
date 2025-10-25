/**
 * ActivityFeed Component - Phase 4.7 Collaboration
 * Real-time activity stream showing team actions and escalation updates
 * Filterable by action type, user, or time
 */

'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  MessageSquare,
  User,
  Clock,
  Filter,
  Heart,
  GitBranch,
  Eye,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'escalation' | 'resolution' | 'assignment' | 'comment' | 'status_change' | 'reaction';
  title: string;
  description: string;
  user: { name: string; avatar?: string };
  timestamp: Date;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  onFilterChange?: (filter: string) => void;
  onActivityClick?: (activityId: string) => void;
}

/**
 * Get activity icon based on type
 */
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'escalation':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case 'resolution':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'assignment':
      return <User className="w-5 h-5 text-blue-600" />;
    case 'comment':
      return <MessageSquare className="w-5 h-5 text-purple-600" />;
    case 'status_change':
      return <GitBranch className="w-5 h-5 text-amber-600" />;
    case 'reaction':
      return <Heart className="w-5 h-5 text-pink-600" />;
    default:
      return <Eye className="w-5 h-5 text-gray-600" />;
  }
};

/**
 * Get background color based on activity type
 */
const getActivityBg = (type: string) => {
  switch (type) {
    case 'escalation':
      return 'bg-red-50 border-l-4 border-l-red-600';
    case 'resolution':
      return 'bg-green-50 border-l-4 border-l-green-600';
    case 'assignment':
      return 'bg-blue-50 border-l-4 border-l-blue-600';
    case 'comment':
      return 'bg-purple-50 border-l-4 border-l-purple-600';
    case 'status_change':
      return 'bg-amber-50 border-l-4 border-l-amber-600';
    case 'reaction':
      return 'bg-pink-50 border-l-4 border-l-pink-600';
    default:
      return 'bg-gray-50 border-l-4 border-l-gray-600';
  }
};

/**
 * Format relative time
 */
const formatTime = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

/**
 * Activity Item Component
 */
const ActivityItem: React.FC<{
  activity: Activity;
  onClick: () => void;
}> = ({ activity, onClick }) => {
  const userInitial = activity.user.name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg mb-3 transition-all hover:shadow-md hover:scale-105 ${getActivityBg(activity.type)}`}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {userInitial}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{activity.description}</p>

              {/* Metadata */}
              {activity.metadata && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {activity.metadata.escalationId && (
                    <span className="inline-block px-2 py-1 bg-white bg-opacity-60 rounded text-xs font-medium text-gray-700">
                      #{activity.metadata.escalationId}
                    </span>
                  )}
                  {activity.metadata.priority && (
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      activity.metadata.priority === 'critical' ? 'bg-red-200 text-red-800' :
                      activity.metadata.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {activity.metadata.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
            <span>{activity.user.name}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(activity.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  onFilterChange,
  onActivityClick,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [activities] = useState<Activity[]>([
    {
      id: 'activity-1',
      type: 'escalation',
      title: 'Critical Escalation Created',
      description: 'High priority issue reported in the payment processing system',
      user: { name: 'Sarah Johnson' },
      timestamp: new Date(Date.now() - 5 * 60000),
      metadata: { escalationId: 'ESC-2847', priority: 'critical' },
    },
    {
      id: 'activity-2',
      type: 'assignment',
      title: 'Escalation Assigned',
      description: 'Mike Chen was assigned to handle the payment issue',
      user: { name: 'Team Lead' },
      timestamp: new Date(Date.now() - 3 * 60000),
      metadata: { escalationId: 'ESC-2847', assignee: 'Mike Chen' },
    },
    {
      id: 'activity-3',
      type: 'comment',
      title: 'Comment Added',
      description: 'Found the root cause! Database connection timeout during peak hours',
      user: { name: 'Mike Chen' },
      timestamp: new Date(Date.now() - 2 * 60000),
      metadata: { escalationId: 'ESC-2847' },
    },
    {
      id: 'activity-4',
      type: 'status_change',
      title: 'Status Updated to In Progress',
      description: 'Escalation ESC-2847 moved to in progress by Mike Chen',
      user: { name: 'Mike Chen' },
      timestamp: new Date(Date.now() - 60000),
      metadata: { escalationId: 'ESC-2847', newStatus: 'in_progress' },
    },
    {
      id: 'activity-5',
      type: 'comment',
      title: 'Comment Added',
      description: 'Implemented connection pooling and redeployed to production',
      user: { name: 'Emma Rodriguez' },
      timestamp: new Date(Date.now() - 30000),
      metadata: { escalationId: 'ESC-2847' },
    },
    {
      id: 'activity-6',
      type: 'reaction',
      title: 'Reaction Added',
      description: 'Sarah Johnson reacted with 👍 to the fix',
      user: { name: 'Sarah Johnson' },
      timestamp: new Date(Date.now() - 10000),
      metadata: { escalationId: 'ESC-2847', reaction: '👍' },
    },
    {
      id: 'activity-7',
      type: 'resolution',
      title: 'Escalation Resolved',
      description: 'Issue has been resolved and verified by the team',
      user: { name: 'Emma Rodriguez' },
      timestamp: new Date(Date.now() - 5000),
      metadata: { escalationId: 'ESC-2847', resolution: 'fixed' },
    },
  ]);

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'escalation', label: '🚨 Escalations' },
    { value: 'resolution', label: '✅ Resolutions' },
    { value: 'assignment', label: '👤 Assignments' },
    { value: 'comment', label: '💬 Comments' },
    { value: 'status_change', label: '🔄 Status Changes' },
  ];

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity Feed</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
              filter === option.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-2">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onClick={() => onActivityClick?.(activity.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No activities found</p>
            <p className="text-sm text-gray-500 mt-1">Try changing the filter</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <button className="w-full mt-6 px-4 py-2 text-center text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors">
          Load More Activities
        </button>
      )}
    </div>
  );
};
