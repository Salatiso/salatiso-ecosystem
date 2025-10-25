/**
 * TeamPerformanceScorecard Component - Phase 4.6 Analytics
 * Shows team metrics: response time, resolution rate, satisfaction, workload
 * Comparative view of team members with KPI tracking
 */

'use client';

import React, { useMemo } from 'react';
import { Users, TrendingUp, Trophy, Clock } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  responseTime: number; // minutes
  resolutionRate: number; // percentage
  satisfaction: number; // 1-5 stars
  escalations: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Generate mock team performance data
 */
const generateTeamData = (): TeamMember[] => {
  const teams: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Lead Coordinator',
      responseTime: 8,
      resolutionRate: 94,
      satisfaction: 4.8,
      escalations: 3,
      trend: 'up',
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Escalation Manager',
      responseTime: 12,
      resolutionRate: 87,
      satisfaction: 4.5,
      escalations: 8,
      trend: 'stable',
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      role: 'Operations Specialist',
      responseTime: 6,
      resolutionRate: 91,
      satisfaction: 4.7,
      escalations: 2,
      trend: 'up',
    },
    {
      id: '4',
      name: 'James Park',
      role: 'Support Technician',
      responseTime: 15,
      resolutionRate: 82,
      satisfaction: 4.2,
      escalations: 12,
      trend: 'down',
    },
    {
      id: '5',
      name: 'Lisa Ahmed',
      role: 'Quality Analyst',
      responseTime: 10,
      resolutionRate: 96,
      satisfaction: 4.9,
      escalations: 1,
      trend: 'up',
    },
  ];
  
  return teams;
};

/**
 * Get performance rating color
 */
const getRatingColor = (value: number, type: 'time' | 'rate' | 'satisfaction'): string => {
  if (type === 'time') {
    if (value <= 8) return 'text-green-600';
    if (value <= 12) return 'text-yellow-600';
    return 'text-red-600';
  }
  if (type === 'rate') {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-yellow-600';
    return 'text-red-600';
  }
  if (type === 'satisfaction') {
    if (value >= 4.7) return 'text-green-600';
    if (value >= 4.3) return 'text-yellow-600';
    return 'text-red-600';
  }
  return 'text-gray-600';
};

/**
 * Get background color for rating
 */
const getRatingBg = (value: number, type: 'time' | 'rate' | 'satisfaction'): string => {
  if (type === 'time') {
    if (value <= 8) return 'bg-green-50';
    if (value <= 12) return 'bg-yellow-50';
    return 'bg-red-50';
  }
  if (type === 'rate') {
    if (value >= 90) return 'bg-green-50';
    if (value >= 80) return 'bg-yellow-50';
    return 'bg-red-50';
  }
  if (type === 'satisfaction') {
    if (value >= 4.7) return 'bg-green-50';
    if (value >= 4.3) return 'bg-yellow-50';
    return 'bg-red-50';
  }
  return 'bg-gray-50';
};

/**
 * Star rating display
 */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-lg ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export const TeamPerformanceScorecard: React.FC = () => {
  const team = useMemo(() => generateTeamData(), []);
  
  const stats = useMemo(() => {
    const avgResponseTime = Math.round(team.reduce((sum, t) => sum + t.responseTime, 0) / team.length);
    const avgResolutionRate = Math.round(team.reduce((sum, t) => sum + t.resolutionRate, 0) / team.length);
    const avgSatisfaction = (team.reduce((sum, t) => sum + t.satisfaction, 0) / team.length).toFixed(1);
    const topPerformer = team.reduce((top, curr) => curr.resolutionRate > top.resolutionRate ? curr : top);
    
    return {
      avgResponseTime,
      avgResolutionRate,
      avgSatisfaction,
      topPerformer: topPerformer.name,
    };
  }, [team]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
        </div>
        <span className="text-sm font-medium text-gray-600">{team.length} Members</span>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Avg Response</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.avgResponseTime}m</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Resolution Rate</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgResolutionRate}%</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Satisfaction</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.avgSatisfaction}⭐</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Top Performer</p>
          <p className="text-sm font-bold text-green-600 mt-1">{stats.topPerformer}</p>
        </div>
      </div>
      
      {/* Team Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Member</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Response Time</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Resolution</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Satisfaction</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Escalations</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Trend</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member, idx) => (
              <tr key={member.id} className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className={`inline-block px-3 py-1 rounded font-semibold ${getRatingBg(member.responseTime, 'time')} ${getRatingColor(member.responseTime, 'time')}`}>
                    {member.responseTime}m
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className={`inline-block px-3 py-1 rounded font-semibold ${getRatingBg(member.resolutionRate, 'rate')} ${getRatingColor(member.resolutionRate, 'rate')}`}>
                    {member.resolutionRate}%
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex justify-center">
                    <StarRating rating={member.satisfaction} />
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm font-semibold text-gray-700">{member.escalations}</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex justify-center">
                    {member.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                    {member.trend === 'down' && <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />}
                    {member.trend === 'stable' && <div className="w-5 h-5 text-gray-400">─</div>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg flex gap-3">
        <Trophy className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-900">Performance Insights</p>
          <p className="text-sm text-purple-700 mt-1">
            {stats.topPerformer} is leading the team with the highest resolution rate. 
            Consider reviewing best practices with other team members.
          </p>
        </div>
      </div>
    </div>
  );
};
