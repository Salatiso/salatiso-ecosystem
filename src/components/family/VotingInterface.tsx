import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Vote,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Filter
} from 'lucide-react';
import ProposalCard from './ProposalCard';

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

interface VotingInterfaceProps {
  proposals: TimelineProposal[];
  currentUserId: string;
  currentUserEmail: string;
  onVote: (proposalId: string, vote: 'approve' | 'reject') => Promise<void>;
  isLoading?: boolean;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({
  proposals,
  currentUserId,
  currentUserEmail,
  onVote,
  isLoading = false
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'voted' | 'my-proposals'>('all');
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});

  const filteredProposals = proposals.filter(proposal => {
    switch (filter) {
      case 'pending':
        return proposal.status === 'pending';
      case 'voted':
        return proposal.votes[currentUserId];
      case 'my-proposals':
        return proposal.proposedBy.email === currentUserEmail;
      default:
        return true;
    }
  });

  const handleVote = async (proposalId: string, vote: 'approve' | 'reject') => {
    setVotingStates(prev => ({ ...prev, [proposalId]: true }));
    try {
      await onVote(proposalId, vote);
    } finally {
      setVotingStates(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  const getStats = () => {
    const total = proposals.length;
    const pending = proposals.filter(p => p.status === 'pending').length;
    const approved = proposals.filter(p => p.status === 'approved').length;
    const rejected = proposals.filter(p => p.status === 'rejected').length;
    const myVotes = proposals.filter(p => p.votes[currentUserId]).length;
    const myProposals = proposals.filter(p => p.proposedBy.email === currentUserEmail).length;

    return { total, pending, approved, rejected, myVotes, myProposals };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading proposals...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Vote className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Timeline Proposals</h2>
            <p className="text-gray-600">Review and vote on proposed timeline changes</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Vote className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.myVotes}</div>
                <div className="text-sm text-gray-600">My Votes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.myProposals}</div>
                <div className="text-sm text-gray-600">My Proposals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Proposals ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('voted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'voted'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Vote className="w-4 h-4 inline mr-1" />
            I&apos;ve Voted ({stats.myVotes})
          </button>
          <button
            onClick={() => setFilter('my-proposals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'my-proposals'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            My Proposals ({stats.myProposals})
          </button>
        </div>
      </div>

      {/* Proposals List */}
      {filteredProposals.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? "There are no timeline proposals at the moment."
              : `No proposals match the "${filter}" filter.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map(proposal => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              currentUserId={currentUserId}
              onVote={handleVote}
              isVoting={votingStates[proposal.id]}
            />
          ))}
        </div>
      )}

      {/* Voting Guidelines */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Voting Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Proposals require 60% family approval to be implemented</li>
              <li>• You can change your vote until the proposal is finalized</li>
              <li>• All family members have equal voting rights</li>
              <li>• Approved proposals are automatically added to the timeline</li>
              <li>• The proposer cannot vote on their own proposals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingInterface;