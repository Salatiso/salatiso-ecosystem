/**
 * TeamPresenceIndicator Component - Phase 4.7 Collaboration
 * Shows real-time team member status and availability
 * Online/offline status, last seen, working on escalation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Users, MoreVertical, MessageCircle, Video, Phone, Radio } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'idle' | 'offline' | 'in-call';
  currentEscalation?: string;
  lastSeen?: Date;
  timeZone?: string;
}

interface TeamPresenceIndicatorProps {
  onMemberClick?: (memberId: string) => void;
  onMessageClick?: (memberId: string) => void;
  onCallClick?: (memberId: string) => void;
}

/**
 * Status badge
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    online: { bg: 'bg-green-500', label: 'Online' },
    idle: { bg: 'bg-yellow-500', label: 'Idle' },
    offline: { bg: 'bg-gray-400', label: 'Offline' },
    'in-call': { bg: 'bg-red-500', label: 'In Call' },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${config.bg} animate-pulse`}></div>
      <span className="text-xs font-medium text-gray-700">{config.label}</span>
    </div>
  );
};

/**
 * Team member card
 */
const TeamMemberCard: React.FC<{
  member: TeamMember;
  onMemberClick: () => void;
  onMessageClick: () => void;
  onCallClick: () => void;
}> = ({ member, onMemberClick, onMessageClick, onCallClick }) => {
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {initial}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              member.status === 'online' ? 'bg-green-500' :
              member.status === 'idle' ? 'bg-yellow-500' :
              member.status === 'in-call' ? 'bg-red-500' :
              'bg-gray-400'
            }`}></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <p className="text-xs text-gray-600">{member.role}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Status */}
      <div className="mb-3">
        <StatusBadge status={member.status} />
      </div>

      {/* Current Activity */}
      {member.currentEscalation && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-900">Working on</p>
          <p className="text-xs text-blue-700 truncate">{member.currentEscalation}</p>
        </div>
      )}

      {/* Last Seen */}
      {member.lastSeen && member.status === 'offline' && (
        <p className="text-xs text-gray-500 mb-3">
          Last seen {member.lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      {/* Time Zone */}
      {member.timeZone && (
        <p className="text-xs text-gray-600 mb-3">{member.timeZone}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onMessageClick}
          className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-3 h-3" />
          Message
        </button>
        <button
          onClick={onCallClick}
          disabled={member.status === 'offline'}
          className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className="w-3 h-3" />
          Call
        </button>
      </div>
    </div>
  );
};

export const TeamPresenceIndicator: React.FC<TeamPresenceIndicatorProps> = ({
  onMemberClick,
  onMessageClick,
  onCallClick,
}) => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'member-1',
      name: 'Sarah Johnson',
      role: 'Lead Coordinator',
      status: 'online',
      currentEscalation: 'ESC-2847 - Payment Processing',
      timeZone: 'EST',
    },
    {
      id: 'member-2',
      name: 'Mike Chen',
      role: 'Escalation Manager',
      status: 'in-call',
      currentEscalation: 'ESC-2846 - API Issue',
      timeZone: 'PST',
    },
    {
      id: 'member-3',
      name: 'Emma Rodriguez',
      role: 'Operations Specialist',
      status: 'online',
      currentEscalation: 'ESC-2845 - Database Connection',
      timeZone: 'CST',
    },
    {
      id: 'member-4',
      name: 'James Park',
      role: 'Support Technician',
      status: 'idle',
      lastSeen: new Date(Date.now() - 15 * 60000),
      timeZone: 'EST',
    },
    {
      id: 'member-5',
      name: 'Lisa Ahmed',
      role: 'Quality Analyst',
      status: 'offline',
      lastSeen: new Date(Date.now() - 2 * 3600000),
      timeZone: 'CET',
    },
    {
      id: 'member-6',
      name: 'David Kim',
      role: 'Tech Lead',
      status: 'online',
      currentEscalation: 'ESC-2844 - Infrastructure',
      timeZone: 'JST',
    },
  ]);

  const [sortBy, setSortBy] = useState<'status' | 'name' | 'role'>('status');

  // Sort members
  const sortedMembers = [...members].sort((a, b) => {
    if (sortBy === 'status') {
      const statusOrder = { online: 0, 'in-call': 1, idle: 2, offline: 3 };
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.role.localeCompare(b.role);
  });

  // Status counts
  const statusCounts = {
    online: members.filter(m => m.status === 'online').length,
    'in-call': members.filter(m => m.status === 'in-call').length,
    idle: members.filter(m => m.status === 'idle').length,
    offline: members.filter(m => m.status === 'offline').length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Team Status</h2>
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
            {members.filter(m => m.status === 'online').length} Online
          </span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-900 font-medium">Online</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.online}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-xs text-red-900 font-medium">In Call</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts['in-call']}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <p className="text-xs text-yellow-900 font-medium">Idle</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.idle}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-900 font-medium">Offline</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{statusCounts.offline}</p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6">
        {['status', 'name', 'role'].map(option => (
          <button
            key={option}
            onClick={() => setSortBy(option as any)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === option
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sort by {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedMembers.map(member => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onMemberClick={() => onMemberClick?.(member.id)}
            onMessageClick={() => onMessageClick?.(member.id)}
            onCallClick={() => onCallClick?.(member.id)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-900 mb-3">Status Legend</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-700">In Call</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-700">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
