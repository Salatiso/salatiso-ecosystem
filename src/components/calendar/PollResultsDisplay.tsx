/**
 * 📊 POLL RESULTS DISPLAY
 * 
 * Display real-time poll results with visualizations and voter information
 * Supports all poll types with appropriate result displays
 */

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Poll, PollResults, Vote, OptionVoteCount, PollType } from '@/types/polling';
import { getPollResults } from '@/services/pollService';

interface PollResultsDisplayProps {
  poll: Poll;
  results: PollResults;
  currentUserId?: string;
  userVote?: Vote;
  onRefresh?: () => void;
  showVoterNames?: boolean;
  isLive?: boolean;
}

/**
 * Poll Results Display Component
 */
export const PollResultsDisplay: React.FC<PollResultsDisplayProps> = ({
  poll,
  results,
  currentUserId,
  userVote,
  onRefresh,
  showVoterNames = false,
  isLive = true,
}) => {
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Setup auto-refresh
  useEffect(() => {
    if (!isLive || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, 3000);

    setAutoRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, onRefresh]);

  // Get bar percentage
  const getBarPercentage = (voteCount: number): number => {
    return results.totalVotes > 0 ? (voteCount / results.totalVotes) * 100 : 0;
  };

  // Render single/multiple choice results
  const renderChoiceResults = () => (
    <div className="space-y-4">
      {results.optionResults.map((option, index) => {
        const percentage = option.percentage || 0;
        const isWinning = index === 0 && results.totalVotes > 0;
        const userSelectedThis =
          userVote &&
          (Array.isArray(userVote.choices)
            ? userVote.choices.some(c => c.optionId === option.optionId)
            : userVote.choices.optionId === option.optionId);

        return (
          <div key={option.optionId} className="space-y-1">
            {/* Option Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white flex-1">
                  {option.optionText}
                </span>
                {isWinning && results.totalVotes > 0 && (
                  <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-bold rounded">
                    🏆 Winning
                  </span>
                )}
                {userSelectedThis && (
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold rounded">
                    ✓ You voted
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {option.voteCount}
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div
                className={`h-full transition-all duration-300 flex items-center justify-end pr-2 ${
                  isWinning
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}
                style={{ width: `${Math.max(percentage, 5)}%` }}
              >
                {percentage > 10 && (
                  <span className="text-white text-xs font-bold">{percentage.toFixed(0)}%</span>
                )}
              </div>
            </div>

            {/* Voters List (if applicable) */}
            {showVoterNames && option.voters && option.voters.length > 0 && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium">Voters:</span> {option.voters.join(', ')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Render ranking results
  const renderRankingResults = () => (
    <div className="space-y-3">
      {results.optionResults
        .filter(opt => opt.averageRank !== undefined)
        .sort((a, b) => (a.averageRank || 0) - (b.averageRank || 0))
        .map((option, index) => {
          const avgRank = option.averageRank || 0;
          const userSelectedThis =
            userVote &&
            (Array.isArray(userVote.choices)
              ? userVote.choices.some(c => c.optionId === option.optionId)
              : false);

          return (
            <div key={option.optionId} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.optionText}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {option.voteCount} {option.voteCount === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {userSelectedThis && (
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold rounded mb-1">
                      ✓ You ranked
                    </span>
                  )}
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    Avg: {avgRank.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Ranking visualization */}
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
                  style={{ width: `${Math.max((avgRank / 5) * 100, 5)}%` }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const leading = results.optionResults?.[0];
    const secondPlace = results.optionResults?.[1];

    return {
      leadingVotes: leading?.voteCount || 0,
      secondPlaceVotes: secondPlace?.voteCount || 0,
      voteDifference: (leading?.voteCount || 0) - (secondPlace?.voteCount || 0),
      participationRate: ((results.totalParticipants / (poll.participantIds?.length || 1)) * 100) || 0,
    };
  }, [results, poll.participantIds]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg flex items-center gap-2">
              📊 Results
              {isLive && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white bg-opacity-20 rounded text-xs font-bold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
            </h3>
            <p className="text-green-100 text-sm mt-1">
              {results.totalVotes} {results.totalVotes === 1 ? 'vote' : 'votes'} from{' '}
              {results.totalParticipants} {results.totalParticipants === 1 ? 'participant' : 'participants'}
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white text-sm font-medium transition"
            >
              🔄 Refresh
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {results.totalVotes === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <div>No votes yet. Be the first to vote!</div>
          </div>
        ) : (
          <>
            {/* Results Display */}
            {poll.type === PollType.RANKING
              ? renderRankingResults()
              : renderChoiceResults()}

            {/* Statistics */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.leadingVotes}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Leading votes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.voteDifference}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Vote difference</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.participationRate.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Participation</div>
              </div>
            </div>

            {/* Poll Status */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 border border-blue-200 dark:border-blue-700 rounded-lg">
              {poll.status === 'closed' ? (
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-bold">Poll Closed</span> - Final results are shown above.
                </div>
              ) : (
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-bold">Poll Open</span> - Results are updating in real-time as votes come in.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PollResultsDisplay;
