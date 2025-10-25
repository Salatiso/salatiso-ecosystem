/**
 * 📊 usePolling HOOK - Real-time poll state management
 * 
 * Manages poll subscription, vote tracking, results, and lifecycle
 * Handles real-time updates via Firebase Firestore listeners
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import {
  Poll,
  PollResults,
  Vote,
  OptionVoteCount,
  RankingResults,
  VoteStatus,
  PollStatus,
} from '@/types/polling';
import {
  onPollUpdates,
  onPollResults,
  onUserVotes,
  calculatePollResults,
  getPollResults,
} from '@/services/pollService';

interface UsePollingOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
  includeResults?: boolean;
  includeUserVote?: boolean;
}

interface UsePollingState {
  // Poll data
  poll: Poll | null;
  loading: boolean;
  error: string | null;

  // Results
  results: PollResults | null;
  resultsLoading: boolean;
  resultsError: string | null;

  // User's vote
  userVote: Vote | null;
  userHasVoted: boolean;
  userVoteStatus: VoteStatus | null;

  // Computed values
  isOpen: boolean;
  isClosed: boolean;
  timeUntilDeadline: number; // ms
  isDeadlinePassed: boolean;
  winningOption: OptionVoteCount | null;
  totalVotes: number;
  participationRate: number; // 0-100
  canVote: boolean;
  canChangeVote: boolean;
  canWithdrawVote: boolean;

  // Statistics
  mostVotedOption: OptionVoteCount | null;
  votesByOption: Map<string, number>;
  percentagesByOption: Map<string, number>;

  // Ranking stats (for ranking polls)
  rankingStats: Map<string, RankingResults>;
}

/**
 * Hook for managing poll state and real-time updates
 */
export const usePolling = (
  pollId: string | null,
  options: UsePollingOptions = {}
): UsePollingState => {
  const {
    autoRefresh = true,
    refreshInterval = 5000,
    includeResults = true,
    includeUserVote = true,
  } = options;

  // State
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<PollResults | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState(0);

  // Refs for cleanup
  const unsubscribePollRef = useRef<(() => void) | null>(null);
  const unsubscribeResultsRef = useRef<(() => void) | null>(null);
  const unsubscribeUserVotesRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate time until deadline
  const calculateTimeUntilDeadline = useCallback((deadline: Date): number => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    return Math.max(0, deadlineTime - now);
  }, []);

  // Load poll data
  useEffect(() => {
    if (!pollId) {
      setLoading(false);
      setPoll(null);
      return;
    }

    try {
      // Subscribe to poll updates
      unsubscribePollRef.current = onPollUpdates(pollId, (updatedPoll) => {
        setPoll(updatedPoll);
        setLoading(false);

        if (updatedPoll && updatedPoll.deadline) {
          const timeLeft = calculateTimeUntilDeadline(updatedPoll.deadline);
          setTimeUntilDeadline(timeLeft);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load poll');
      setLoading(false);
    }

    return () => {
      if (unsubscribePollRef.current) {
        unsubscribePollRef.current();
      }
    };
  }, [pollId, calculateTimeUntilDeadline]);

  // Load results
  useEffect(() => {
    if (!pollId || !includeResults) {
      return;
    }

    const loadResults = async () => {
      try {
        setResultsLoading(true);
        const pollResults = await getPollResults(pollId);
        setResults(pollResults);
        setResultsError(null);
      } catch (err) {
        setResultsError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setResultsLoading(false);
      }
    };

    loadResults();

    // Subscribe to real-time results
    try {
      unsubscribeResultsRef.current = onPollResults(pollId, (updatedResults) => {
        setResults(updatedResults);
      });
    } catch (err) {
      console.error('Error subscribing to results:', err);
    }

    return () => {
      if (unsubscribeResultsRef.current) {
        unsubscribeResultsRef.current();
      }
    };
  }, [pollId, includeResults]);

  // Load user vote
  useEffect(() => {
    if (!pollId || !includeUserVote) {
      return;
    }

    try {
      unsubscribeUserVotesRef.current = onUserVotes(pollId, (votes) => {
        setUserVote(votes[0] || null);
      });
    } catch (err) {
      console.error('Error loading user vote:', err);
    }

    return () => {
      if (unsubscribeUserVotesRef.current) {
        unsubscribeUserVotesRef.current();
      }
    };
  }, [pollId, includeUserVote]);

  // Update countdown timer
  useEffect(() => {
    if (!poll || !poll.deadline) {
      return;
    }

    // Initial update
    const timeLeft = calculateTimeUntilDeadline(poll.deadline);
    setTimeUntilDeadline(timeLeft);

    // Update every second
    timerRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeUntilDeadline(poll.deadline);
      setTimeUntilDeadline(newTimeLeft);

      // Close poll if deadline passed
      if (newTimeLeft === 0 && poll.status === 'open') {
        // Poll would be automatically closed server-side
        const currentUser = getAuth().currentUser;
        if (currentUser) {
          setPoll(prev =>
            prev ? { ...prev, status: 'closed' as PollStatus } : null
          );
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [poll, calculateTimeUntilDeadline]);

  // Auto-refresh results
  useEffect(() => {
    if (!autoRefresh || !pollId || !poll) {
      return;
    }

    refreshTimerRef.current = setInterval(async () => {
      try {
        const updatedResults = await calculatePollResults(pollId);
        if (updatedResults) {
          setResults(updatedResults);
        }
      } catch (err) {
        console.error('Error refreshing results:', err);
      }
    }, refreshInterval);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, pollId, poll, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribePollRef.current) unsubscribePollRef.current();
      if (unsubscribeResultsRef.current) unsubscribeResultsRef.current();
      if (unsubscribeUserVotesRef.current) unsubscribeUserVotesRef.current();
      if (timerRef.current) clearInterval(timerRef.current);
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, []);

  // Computed values
  const isOpen = poll?.status === 'open' && timeUntilDeadline > 0;
  const isClosed = poll?.status === 'closed';
  const isDeadlinePassed = timeUntilDeadline === 0 && poll?.status === 'open';
  const userHasVoted = !!userVote && !userVote.withdrawn;
  const userVoteStatus = userVote?.status || null;

  const canVote =
    isOpen &&
    getAuth().currentUser &&
    poll?.participantIds.includes(getAuth().currentUser!.uid) &&
    (!userHasVoted || poll?.config.allowChangeVote);

  const canChangeVote = poll?.config.allowChangeVote && isOpen && userHasVoted;
  const canWithdrawVote = poll?.config.allowWithdrawVote && userHasVoted;

  // Calculate vote statistics
  const totalVotes = results?.totalVotes || 0;
  const totalParticipants = results?.totalParticipants || 0;
  const participationRate =
    poll && poll.participantIds.length > 0
      ? (totalParticipants / poll.participantIds.length) * 100
      : 0;

  const winningOption = results?.winningOption || null;
  const mostVotedOption = results?.optionResults?.[0] || null;

  // Vote counts by option
  const votesByOption = new Map<string, number>();
  const percentagesByOption = new Map<string, number>();

  results?.optionResults?.forEach((optionResult) => {
    votesByOption.set(optionResult.optionId, optionResult.voteCount);
    percentagesByOption.set(optionResult.optionId, optionResult.percentage);
  });

  // Ranking stats
  const rankingStats = new Map<string, RankingResults>();
  results?.optionResults?.forEach((optionResult, index) => {
    if (optionResult.averageRank !== undefined) {
      rankingStats.set(optionResult.optionId, {
        pollId: pollId || '',
        optionId: optionResult.optionId,
        optionText: optionResult.optionText,
        averageRank: optionResult.averageRank,
        votes: optionResult.voteCount,
        standardDeviation: 0, // Would calculate from raw votes in production
        ranking: index + 1,
      });
    }
  });

  return {
    // Poll data
    poll,
    loading,
    error,

    // Results
    results,
    resultsLoading,
    resultsError,

    // User's vote
    userVote,
    userHasVoted,
    userVoteStatus,

    // Computed values
    isOpen,
    isClosed,
    timeUntilDeadline,
    isDeadlinePassed,
    winningOption,
    totalVotes,
    participationRate,
    canVote,
    canChangeVote,
    canWithdrawVote,

    // Statistics
    mostVotedOption,
    votesByOption,
    percentagesByOption,

    // Ranking stats
    rankingStats,
  };
};

export default usePolling;
