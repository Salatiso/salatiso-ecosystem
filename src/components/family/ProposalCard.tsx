import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  category: 'foundation' | 'financial' | 'family' | 'legal' | 'business' | 'education';
  familyMembers?: string[];
  ubuntuLesson?: string;
  impact: 'low' | 'medium' | 'high';
}

interface TimelineProposal {
  id: string;
  eventId?: string; // null for new events
  originalEvent?: TimelineEvent;
  proposedEvent: TimelineEvent;
  proposedBy: {
    id: string;
    name: string;
    email: string;
  };
  proposedAt: Date;
  votes: Record<string, 'approve' | 'reject'>;
  status: 'pending' | 'approved' | 'rejected';
  requiredApprovals: number;
}

interface ProposalCardProps {
  proposal: TimelineProposal;
  currentUserId: string;
  onVote: (proposalId: string, vote: 'approve' | 'reject') => Promise<void>;
  isVoting?: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  currentUserId,
  onVote,
  isVoting = false
}) => {
  const hasVoted = proposal.votes[currentUserId];
  const approveCount = Object.values(proposal.votes).filter(v => v === 'approve').length;
  const rejectCount = Object.values(proposal.votes).filter(v => v === 'reject').length;
  const totalVotes = approveCount + rejectCount;
  const approvalPercentage = Math.round((approveCount / proposal.requiredApprovals) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      foundation: 'bg-purple-100 text-purple-700',
      financial: 'bg-green-100 text-green-700',
      family: 'bg-blue-100 text-blue-700',
      legal: 'bg-red-100 text-red-700',
      business: 'bg-yellow-100 text-yellow-700',
      education: 'bg-indigo-100 text-indigo-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(proposal.status)}`}>
                {getStatusIcon(proposal.status)}
                <span className="ml-1 capitalize">{proposal.status}</span>
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(proposal.proposedEvent.category)}`}>
                {proposal.proposedEvent.category}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {proposal.eventId ? 'Edit' : 'Add'} Timeline Event
            </h3>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Proposed by {proposal.proposedBy.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(proposal.proposedAt)}</span>
              </div>
            </div>
          </div>

          {/* Voting Progress */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {approveCount}/{proposal.requiredApprovals} approvals
            </div>
            <div className="text-xs text-gray-500">
              {approvalPercentage}% required
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, approvalPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">
              {proposal.proposedEvent.year}
              {proposal.proposedEvent.month && `-${String(proposal.proposedEvent.month).padStart(2, '0')}`}
              : {proposal.proposedEvent.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {proposal.proposedEvent.description}
            </p>

            {proposal.proposedEvent.familyMembers && proposal.proposedEvent.familyMembers.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {proposal.proposedEvent.familyMembers.map(member => (
                  <span
                    key={member}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {member}
                  </span>
                ))}
              </div>
            )}

            {proposal.proposedEvent.ubuntuLesson && (
              <blockquote className="text-sm text-gray-700 italic border-l-4 border-primary-200 pl-3">
                &ldquo;{proposal.proposedEvent.ubuntuLesson}&rdquo;
              </blockquote>
            )}
          </div>
        </div>
      </div>

      {/* Voting Section */}
      {proposal.status === 'pending' && !hasVoted && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Cast your vote on this proposal:
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onVote(proposal.id, 'reject')}
                disabled={isVoting}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => onVote(proposal.id, 'approve')}
                disabled={isVoting}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vote Status */}
      {hasVoted && (
        <div className="px-4 pb-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Your vote:</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              hasVoted === 'approve'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {hasVoted === 'approve' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approved
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Rejected
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Vote Summary */}
      {totalVotes > 0 && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex space-x-4">
              <span className="text-green-600">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                {approveCount} approve
              </span>
              <span className="text-red-600">
                <XCircle className="w-4 h-4 inline mr-1" />
                {rejectCount} reject
              </span>
            </div>
            {proposal.status === 'pending' && (
              <span className="text-gray-500">
                {proposal.requiredApprovals - approveCount} more approvals needed
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProposalCard;