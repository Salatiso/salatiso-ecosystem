'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, TrendingUp, Clock } from 'lucide-react';
import { AssignmentStrategy, MemberWorkload, Team } from '@/types/teamAssignment';
import { teamWorkloadService } from '@/services/teamWorkloadService';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'available' | 'busy' | 'offline';
  currentWorkload: number;
  maxCapacity: number;
  skillTags?: string[];
}

interface AssignmentOption {
  memberId: string;
  memberName: string;
  workload: number;
  capacity: number;
  utilization: number;
  recommendedScore: number;
}

interface TeamAssignmentComponentProps {
  teamId: string;
  escalationId: string;
  escalationPriority?: 'low' | 'medium' | 'high' | 'critical';
  assignmentStrategy?: AssignmentStrategy;
  onAssignmentComplete?: (memberId: string, memberName: string) => void;
}

export const TeamAssignmentComponent: React.FC<TeamAssignmentComponentProps> = ({
  teamId,
  escalationId,
  escalationPriority = 'medium',
  assignmentStrategy = AssignmentStrategy.LOAD_BALANCED,
  onAssignmentComplete,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignmentOptions, setAssignmentOptions] = useState<AssignmentOption[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [strategy, setStrategy] = useState<AssignmentStrategy>(assignmentStrategy);
  const [workloadBalance, setWorkloadBalance] = useState<number>(0);

  // Load team members and calculate workload
  useEffect(() => {
    loadTeamData();
  }, [teamId]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      
      // Mock team members data - in production, fetch from Firestore
      const mockMembers: TeamMember[] = [
        {
          id: 'member-1',
          name: 'Alice Johnson',
          role: 'Senior Support Engineer',
          status: 'available',
          currentWorkload: 2,
          maxCapacity: 5,
          skillTags: ['technical', 'escalations', 'vip'],
        },
        {
          id: 'member-2',
          name: 'Bob Smith',
          role: 'Support Engineer',
          status: 'busy',
          currentWorkload: 4,
          maxCapacity: 5,
          skillTags: ['technical', 'billing'],
        },
        {
          id: 'member-3',
          name: 'Carol Martinez',
          role: 'Support Specialist',
          status: 'available',
          currentWorkload: 1,
          maxCapacity: 5,
          skillTags: ['general', 'billing', 'refunds'],
        },
        {
          id: 'member-4',
          name: 'David Lee',
          role: 'Support Engineer',
          status: 'available',
          currentWorkload: 3,
          maxCapacity: 5,
          skillTags: ['technical', 'api', 'integrations'],
        },
      ];

      setTeamMembers(mockMembers);

      // Calculate assignment options
      const options = calculateAssignmentOptions(mockMembers);
      setAssignmentOptions(options);

      // Calculate workload balance
      const workloads = mockMembers.map(m => m.currentWorkload);
      const avgWorkload = workloads.reduce((a, b) => a + b, 0) / workloads.length;
      const variance = workloads.reduce((sum, w) => sum + Math.pow(w - avgWorkload, 2), 0) / workloads.length;
      const balance = Math.sqrt(variance);
      setWorkloadBalance(balance);

      // Pre-select least busy member
      if (options.length > 0) {
        setSelectedMemberId(options[0].memberId);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAssignmentOptions = (members: TeamMember[]): AssignmentOption[] => {
    return members
      .filter(member => member.status !== 'offline')
      .map(member => {
        const utilization = (member.currentWorkload / member.maxCapacity) * 100;
        
        // Recommendation score: lower is better
        let recommendedScore = utilization;
        
        // Adjust based on priority
        if (escalationPriority === 'critical' && member.skillTags?.includes('technical')) {
          recommendedScore -= 20; // Boost technical experts for critical issues
        }
        
        // Penalize if approaching capacity
        if (utilization > 80) {
          recommendedScore += 50;
        }

        return {
          memberId: member.id,
          memberName: member.name,
          workload: member.currentWorkload,
          capacity: member.maxCapacity,
          utilization,
          recommendedScore: Math.max(0, recommendedScore),
        };
      })
      .sort((a, b) => a.recommendedScore - b.recommendedScore);
  };

  const getMemberStatus = (member: TeamMember): string => {
    const utilization = (member.currentWorkload / member.maxCapacity) * 100;
    if (member.status === 'offline') return 'Offline';
    if (utilization >= 80) return 'Overloaded';
    if (utilization >= 60) return 'Busy';
    if (member.status === 'busy') return 'Busy';
    return 'Available';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Offline':
        return 'bg-gray-200';
      case 'Overloaded':
        return 'bg-red-200';
      case 'Busy':
        return 'bg-yellow-200';
      default:
        return 'bg-green-200';
    }
  };

  const handleStrategyChange = (newStrategy: AssignmentStrategy) => {
    setStrategy(newStrategy);
    
    // Re-sort options based on new strategy
    let sortedOptions = [...assignmentOptions];
    
    switch (newStrategy) {
      case AssignmentStrategy.LOAD_BALANCED:
        sortedOptions.sort((a, b) => a.utilization - b.utilization);
        break;
      case AssignmentStrategy.ROUND_ROBIN:
        // In a real app, track last assigned and rotate
        sortedOptions.sort((a, b) => a.workload - b.workload);
        break;
      case AssignmentStrategy.SKILL_BASED:
        // In a real app, match skills to escalation category
        sortedOptions.sort((a, b) => b.recommendedScore - a.recommendedScore);
        break;
    }
    
    setAssignmentOptions(sortedOptions);
    if (sortedOptions.length > 0) {
      setSelectedMemberId(sortedOptions[0].memberId);
    }
  };

  const handleAssign = async () => {
    if (!selectedMemberId) {
      toast.error('Please select a team member');
      return;
    }

    try {
      setAssigning(true);
      
      const selectedMember = teamMembers.find(m => m.id === selectedMemberId);
      if (!selectedMember) {
        toast.error('Member not found');
        return;
      }

      // Record assignment in service
      await teamWorkloadService.recordAssignment(teamId, selectedMemberId, escalationId);

      toast.success(`Assigned to ${selectedMember.name}`);
      
      if (onAssignmentComplete) {
        onAssignmentComplete(selectedMemberId, selectedMember.name);
      }

      // Reload data to reflect changes
      await loadTeamData();
    } catch (error) {
      console.error('Error assigning escalation:', error);
      toast.error('Failed to assign escalation');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Team Assignment</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{teamMembers.length}</div>
            <div className="text-sm text-gray-600">team members</div>
          </div>
        </div>

        {/* Workload Balance Indicator */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Workload Balance Score:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
                  style={{ width: `${Math.min(workloadBalance * 20, 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">{workloadBalance.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Lower score indicates better team balance</p>
        </div>
      </div>

      {/* Assignment Strategy Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">Assignment Strategy</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: AssignmentStrategy.LOAD_BALANCED, label: 'Load Balanced', desc: 'Lowest workload' },
            { value: AssignmentStrategy.ROUND_ROBIN, label: 'Round Robin', desc: 'Fair distribution' },
            { value: AssignmentStrategy.SKILL_BASED, label: 'Skill-Based', desc: 'Best match' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => handleStrategyChange(option.value as AssignmentStrategy)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                strategy === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-xs text-gray-600">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Recommended Assignment Order</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
          {assignmentOptions.map((option, index) => {
            const member = teamMembers.find(m => m.id === option.memberId);
            if (!member) return null;

            const status = getMemberStatus(member);
            const statusColor = getStatusColor(status);

            return (
              <button
                key={option.memberId}
                onClick={() => setSelectedMemberId(option.memberId)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMemberId === option.memberId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                        {member.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor} text-gray-700`}>
                          {status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{member.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-900">Rank #{index + 1}</div>
                  </div>
                </div>

                {/* Workload Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Workload</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {option.workload}/{option.capacity} ({Math.round(option.utilization)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        option.utilization >= 80
                          ? 'bg-red-500'
                          : option.utilization >= 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${option.utilization}%` }}
                    />
                  </div>
                </div>

                {/* Skills */}
                {member.skillTags && member.skillTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {member.skillTags.slice(0, 3).map(skill => (
                      <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {member.skillTags.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{member.skillTags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Score */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-600">Recommendation Score</span>
                  <span className="text-sm font-bold text-blue-600">{option.recommendedScore.toFixed(1)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overload Warning */}
      {selectedMemberId && (() => {
        const selectedOption = assignmentOptions.find(o => o.memberId === selectedMemberId);
        return selectedOption && selectedOption.utilization >= 80 ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Workload Warning</h4>
                <p className="text-sm text-red-700 mt-1">
                  This team member is approaching capacity ({selectedOption.utilization.toFixed(0)}%). Consider distributing work
                  or assigning to a less busy member.
                </p>
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6 flex gap-3">
        <button
          onClick={handleAssign}
          disabled={!selectedMemberId || assigning}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {assigning ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Assigning...
            </span>
          ) : (
            'Assign Escalation'
          )}
        </button>
        <button
          onClick={() => loadTeamData()}
          disabled={loading || assigning}
          className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 flex items-start gap-2">
        <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p>
          Assignments are tracked in real-time. Workload updates automatically as escalations are resolved. SLAs are enforced based on team capacity
          and priority.
        </p>
      </div>
    </div>
  );
};

export default TeamAssignmentComponent;
