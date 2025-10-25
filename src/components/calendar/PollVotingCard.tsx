/**
 * 📊 POLL VOTING CARD
 * 
 * Display poll and handle user voting with real-time updates
 * Supports single-choice, multiple-choice, and ranking polls
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PollType, Poll, VoteChoice, Vote } from '@/types/polling';
import { submitVote, withdrawVote } from '@/services/pollService';
import { usePolling } from '@/hooks/usePolling';
import { getAuth } from 'firebase/auth';

interface PollVotingCardProps {
  poll: Poll;
  currentUserId: string;
  onVoteSubmitted?: (vote: Vote) => void;
  onError?: (error: string) => void;
  compact?: boolean;
}

/**
 * Poll Voting Card Component
 */
export const PollVotingCard: React.FC<PollVotingCardProps> = ({
  poll,
  currentUserId,
  onVoteSubmitted,
  onError,
  compact = false,
}) => {
  // State
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedRanking, setSelectedRanking] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Get polling data
  const { userVote, userHasVoted, canVote, timeUntilDeadline, isDeadlinePassed } = usePolling(
    poll.id,
    { includeResults: false, includeUserVote: true }
  );

  // Initialize from existing vote
  useEffect(() => {
    if (userVote && userVote.choices) {
      if (Array.isArray(userVote.choices)) {
        setSelectedOptions(userVote.choices.map(c => c.optionId));
        if (poll.type === PollType.RANKING) {
          const rankMap = new Map<string, number>();
          userVote.choices.forEach(c => {
            if (c.rank !== undefined) {
              rankMap.set(c.optionId, c.rank);
            }
          });
          setSelectedRanking(rankMap);
        }
      } else {
        setSelectedOptions([userVote.choices.optionId]);
      }
      setSubmitted(true);
    }
  }, [userVote, poll.type]);

  // Format time remaining
  const timeRemaining = useMemo(() => {
    const hours = Math.floor(timeUntilDeadline / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilDeadline % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, [timeUntilDeadline]);

  // Handle option selection (single choice)
  const handleSelectOption = (optionId: string) => {
    if (poll.type === PollType.SINGLE_CHOICE) {
      setSelectedOptions([optionId]);
    }
  };

  // Handle option toggle (multiple choice)
  const handleToggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  // Handle ranking
  const handleRankOption = (optionId: string, rank: number) => {
    const newRanking = new Map(selectedRanking);
    if (rank === 0) {
      newRanking.delete(optionId);
    } else {
      newRanking.set(optionId, rank);
    }
    setSelectedRanking(newRanking);
  };

  // Handle vote submission
  const handleSubmitVote = async () => {
    setError(null);

    if (selectedOptions.length === 0 && selectedRanking.size === 0) {
      setError('Please select at least one option');
      onError?.('Please select at least one option');
      return;
    }

    try {
      setLoading(true);

      let choices: VoteChoice | VoteChoice[];

      if (poll.type === PollType.RANKING) {
        choices = Array.from(selectedRanking.entries()).map(([optionId, rank]) => ({
          optionId,
          rank,
        }));
      } else if (poll.type === PollType.MULTIPLE_CHOICE) {
        choices = selectedOptions.map(optionId => ({ optionId }));
      } else {
        choices = { optionId: selectedOptions[0] };
      }

      const response = await submitVote({
        pollId: poll.id,
        userId: currentUserId,
        choices,
      });

      if (!response.success) {
        setError(response.error || 'Failed to submit vote');
        onError?.(response.error || 'Failed to submit vote');
        return;
      }

      setSubmitted(true);
      onVoteSubmitted?.(response.vote!);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit vote';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle vote withdrawal
  const handleWithdrawVote = async () => {
    if (!userVote) return;

    try {
      setLoading(true);
      const success = await withdrawVote(poll.id, userVote.id);

      if (success) {
        setSubmitted(false);
        setSelectedOptions([]);
        setSelectedRanking(new Map());
      } else {
        setError('Failed to withdraw vote');
        onError?.('Failed to withdraw vote');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to withdraw vote';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Render single choice options
  const renderSingleChoice = () => (
    <div className="space-y-2">
      {poll.options.map(option => (
        <button
          key={option.id}
          onClick={() => handleSelectOption(option.id)}
          disabled={!canVote || loading}
          className={`w-full p-3 rounded-lg border-2 transition text-left ${
            selectedOptions.includes(option.id)
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOptions.includes(option.id)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400 dark:border-gray-500'
              }`}
            >
              {selectedOptions.includes(option.id) && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
            </div>
            <span className="text-gray-900 dark:text-white font-medium">{option.text}</span>
          </div>
        </button>
      ))}
    </div>
  );

  // Render multiple choice options
  const renderMultipleChoice = () => (
    <div className="space-y-2">
      {poll.options.map(option => (
        <button
          key={option.id}
          onClick={() => handleToggleOption(option.id)}
          disabled={!canVote || loading}
          className={`w-full p-3 rounded-lg border-2 transition text-left ${
            selectedOptions.includes(option.id)
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                selectedOptions.includes(option.id)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400 dark:border-gray-500'
              }`}
            >
              {selectedOptions.includes(option.id) && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
            </div>
            <span className="text-gray-900 dark:text-white font-medium">{option.text}</span>
          </div>
        </button>
      ))}
    </div>
  );

  // Render ranking options
  const renderRanking = () => (
    <div className="space-y-3">
      {poll.options.map((option, index) => (
        <div
          key={option.id}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-900 dark:text-white font-medium flex-1">{option.text}</span>
            <select
              value={selectedRanking.get(option.id) || 0}
              onChange={(e) => handleRankOption(option.id, parseInt(e.target.value))}
              disabled={!canVote || loading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value={0}>Not ranked</option>
              {[1, 2, 3, 4, 5].map(rank => (
                <option key={rank} value={rank}>
                  #{rank}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );

  const isCompactView = compact || false;

  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${
      isCompactView ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-800 shadow-md'
    }`}>
      {/* Poll Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{poll.question}</h3>
            {poll.description && (
              <p className="text-blue-100 text-sm mt-1">{poll.description}</p>
            )}
          </div>
          {isDeadlinePassed && (
            <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              CLOSED
            </div>
          )}
          {!isDeadlinePassed && (
            <div className="px-2 py-1 bg-blue-700 text-white text-xs font-bold rounded">
              {timeRemaining}
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="p-4">
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">✓</div>
            <div className="text-green-600 dark:text-green-400 font-medium mb-3">
              Your vote has been submitted!
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {poll.config.showResultsBeforeClose
                ? 'Results will be shown in real-time.'
                : 'Results will be revealed when the poll closes.'}
            </div>
            {poll.config.allowChangeVote && !isDeadlinePassed && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                You can change your vote until the deadline.
              </div>
            )}
            <div className="space-y-2">
              {poll.config.allowChangeVote && !isDeadlinePassed && (
                <button
                  onClick={() => setSubmitted(false)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg font-medium text-sm transition disabled:opacity-50"
                >
                  Change Vote
                </button>
              )}
              {poll.config.allowWithdrawVote && !isDeadlinePassed && (
                <button
                  onClick={handleWithdrawVote}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg font-medium text-sm transition disabled:opacity-50"
                >
                  Withdraw Vote
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {isDeadlinePassed ? (
              <div className="text-center py-6 text-gray-600 dark:text-gray-400">
                <div className="text-2xl mb-2">🔒</div>
                <div>This poll is now closed. Voting has ended.</div>
              </div>
            ) : !canVote ? (
              <div className="text-center py-6 text-gray-600 dark:text-gray-400">
                <div className="text-2xl mb-2">🚫</div>
                <div>You are not authorized to vote on this poll.</div>
              </div>
            ) : (
              <>
                {poll.type === PollType.SINGLE_CHOICE && renderSingleChoice()}
                {poll.type === PollType.MULTIPLE_CHOICE && renderMultipleChoice()}
                {poll.type === PollType.RANKING && renderRanking()}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border border-red-200 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitVote}
                  disabled={
                    loading || selectedOptions.length === 0 && selectedRanking.size === 0
                  }
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      ✓ Submit Vote
                    </>
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PollVotingCard;
