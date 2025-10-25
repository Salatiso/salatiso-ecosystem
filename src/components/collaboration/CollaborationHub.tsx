/**
 * CollaborationHub Component - Phase 4.7 Collaboration
 * Master component integrating messaging, activity feed, and team presence
 * Unified collaboration interface for the dashboard
 */

'use client';

import React, { useState } from 'react';
import { Users, MessageCircle, Activity, Send } from 'lucide-react';
import { InAppMessagingSystem } from './InAppMessagingSystem';
import { ActivityFeed } from './ActivityFeed';
import { TeamPresenceIndicator } from './TeamPresenceIndicator';

type CollaborationTab = 'messaging' | 'activity' | 'presence';

interface CollaborationHubProps {
  currentUserId?: string;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  currentUserId = 'user-123',
}) => {
  const [activeTab, setActiveTab] = useState<CollaborationTab>('messaging');
  const [notificationCount, setNotificationCount] = useState({
    messaging: 4,
    activity: 3,
    presence: 0,
  });

  const handleSendMessage = (conversationId: string, message: string) => {
    console.log(`Message sent to ${conversationId}:`, message);
    // Update notification count
    if (notificationCount.messaging > 0) {
      setNotificationCount(prev => ({
        ...prev,
        messaging: prev.messaging - 1,
      }));
    }
  };

  const handleActivityClick = (activityId: string) => {
    console.log('Activity clicked:', activityId);
  };

  const handleMemberMessage = (memberId: string) => {
    console.log('Message member:', memberId);
  };

  const handleMemberCall = (memberId: string) => {
    console.log('Call member:', memberId);
  };

  const tabConfig = [
    {
      id: 'messaging' as const,
      icon: MessageCircle,
      label: 'Messages',
      count: notificationCount.messaging,
    },
    {
      id: 'activity' as const,
      icon: Activity,
      label: 'Activity',
      count: notificationCount.activity,
    },
    {
      id: 'presence' as const,
      icon: Users,
      label: 'Team',
      count: notificationCount.presence,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center border-b border-gray-200">
        {tabConfig.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-medium border-b-2 transition-colors flex items-center justify-center gap-2 relative ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {tab.count > 9 ? '9+' : tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'messaging' && (
          <div>
            <InAppMessagingSystem
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <ActivityFeed
              onActivityClick={handleActivityClick}
            />
          </div>
        )}

        {activeTab === 'presence' && (
          <div>
            <TeamPresenceIndicator
              onMemberClick={(id) => console.log('Member clicked:', id)}
              onMessageClick={handleMemberMessage}
              onCallClick={handleMemberCall}
            />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 border-t border-gray-200 p-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Unread Messages</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{notificationCount.messaging}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">New Activities</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{notificationCount.activity}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Online Members</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">4</p>
        </div>
      </div>
    </div>
  );
};
