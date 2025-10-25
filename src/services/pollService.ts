/**
 * 📊 POLLING SERVICE - Firebase Backend
 * 
 * Handles all poll creation, voting, results calculation, and lifecycle management
 * Fully integrated with Firestore and Firebase Auth
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  Timestamp,
  FieldValue,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import {
  Poll,
  PollType,
  PollStatus,
  Vote,
  VoteChoice,
  PollResults,
  OptionVoteCount,
  RankingResults,
  CreatePollRequest,
  UpdatePollRequest,
  SubmitVoteRequest,
  CreatePollResponse,
  SubmitVoteResponse,
  GetPollResponse,
  GetPollsResponse,
  ClosePollResponse,
  PollOption,
  PollConfig,
  PollAuditEntry,
  VoteStatus,
} from '@/types/polling';

// ============================================================================
// HELPERS & UTILITIES
// ============================================================================

/**
 * Get current user ID with error handling
 */
const getCurrentUserId = (): string => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('User must be authenticated to perform this action');
  }
  return userId;
};

/**
 * Get current user email
 */
const getCurrentUserEmail = (): string => {
  return auth.currentUser?.email || 'unknown@example.com';
};

/**
 * Create audit entry for poll action
 */
const createAuditEntry = (
  action: 'created' | 'opened' | 'voted' | 'updated' | 'closed' | 'archived',
  details?: Record<string, any>
): PollAuditEntry => {
  return {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    userId: getCurrentUserId(),
    timestamp: new Date(),
    details,
  };
};

/**
 * Validate poll configuration
 */
const validatePollConfig = (config: Partial<PollConfig>): PollConfig => {
  return {
    anonymous: config.anonymous ?? true,
    allowChangeVote: config.allowChangeVote ?? true,
    allowWithdrawVote: config.allowWithdrawVote ?? true,
    showResultsBeforeClose: config.showResultsBeforeClose ?? true,
    showVoterNames: config.showVoterNames ?? false,
    multipleVotesPerUser: config.multipleVotesPerUser ?? false,
    requireComment: config.requireComment ?? false,
    notifyOnVote: config.notifyOnVote ?? false,
    notifyOnClose: config.notifyOnClose ?? true,
  };
};

/**
 * Generate unique option IDs
 */
const generateOptionId = (): string => {
  return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// POLL CREATION
// ============================================================================

/**
 * Create a new poll attached to an event
 */
export const createPoll = async (request: CreatePollRequest): Promise<CreatePollResponse> => {
  try {
    const userId = getCurrentUserId();
    const userEmail = getCurrentUserEmail();

    // Validate request
    if (!request.question || request.question.trim().length === 0) {
      return { success: false, error: 'Poll question is required' };
    }

    if (request.options.length < 2) {
      return { success: false, error: 'Poll must have at least 2 options' };
    }

    if (request.deadline <= new Date()) {
      return { success: false, error: 'Poll deadline must be in the future' };
    }

    // Create poll object
    const poll: Omit<Poll, 'id'> = {
      eventId: request.eventId,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: request.title || request.question,
      question: request.question,
      description: request.description,
      type: request.type,
      options: request.options.map((text, index) => ({
        id: generateOptionId(),
        text,
        order: index,
        createdAt: new Date(),
      })),
      createdTime: new Date(),
      startTime: new Date(),
      deadline: request.deadline,
      status: 'open' as PollStatus,
      config: validatePollConfig(request.config),
      votes: [],
      totalVotes: 0,
      totalParticipants: 0,
      participantIds: request.participantIds,
      auditTrail: [createAuditEntry('created')],
      context: request.context || 'individual',
      tags: [],
      notificationsSent: [],
    };

    // Add to Firestore
    const pollsRef = collection(db, 'polls');
    const docRef = await addDoc(pollsRef, {
      ...poll,
      createdAt: Timestamp.fromDate(poll.createdAt),
      updatedAt: Timestamp.fromDate(poll.updatedAt),
      createdTime: Timestamp.fromDate(poll.createdTime),
      startTime: Timestamp.fromDate(poll.startTime),
      deadline: Timestamp.fromDate(poll.deadline),
      options: poll.options.map(opt => ({
        ...opt,
        createdAt: Timestamp.fromDate(opt.createdAt),
      })),
    });

    // Fetch and return the created poll
    const createdPoll = await getPollById(docRef.id);
    if (!createdPoll) {
      return { success: false, error: 'Failed to retrieve created poll' };
    }

    return {
      success: true,
      poll: createdPoll,
      message: `Poll "${poll.title}" created successfully`,
    };
  } catch (error) {
    console.error('Error creating poll:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create poll',
    };
  }
};

// ============================================================================
// POLL RETRIEVAL
// ============================================================================

/**
 * Get poll by ID
 */
export const getPollById = async (pollId: string): Promise<Poll | null> => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    const pollSnap = await getDoc(pollRef);

    if (!pollSnap.exists()) {
      return null;
    }

    const data = pollSnap.data();
    return {
      id: pollSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      createdTime: data.createdTime?.toDate() || new Date(),
      startTime: data.startTime?.toDate() || new Date(),
      deadline: data.deadline?.toDate() || new Date(),
      closedAt: data.closedAt?.toDate(),
      options: data.options.map((opt: any) => ({
        ...opt,
        createdAt: opt.createdAt?.toDate() || new Date(),
      })),
      auditTrail: data.auditTrail?.map((entry: any) => ({
        ...entry,
        timestamp: entry.timestamp?.toDate() || new Date(),
      })) || [],
      notificationsSent: data.notificationsSent?.map((notif: any) => ({
        ...notif,
        sentAt: notif.sentAt?.toDate() || new Date(),
        readAt: notif.readAt?.toDate(),
      })) || [],
    } as Poll;
  } catch (error) {
    console.error('Error getting poll:', error);
    return null;
  }
};

/**
 * Get polls by event ID
 */
export const getPollsByEventId = async (
  eventId: string,
  status?: PollStatus
): Promise<Poll[]> => {
  try {
    let q = query(collection(db, 'polls'), where('eventId', '==', eventId));

    if (status) {
      q = query(q, where('status', '==', status));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const polls: Poll[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      polls.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        deadline: data.deadline?.toDate() || new Date(),
        closedAt: data.closedAt?.toDate(),
        options: data.options.map((opt: any) => ({
          ...opt,
          createdAt: opt.createdAt?.toDate() || new Date(),
        })),
        auditTrail: data.auditTrail?.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp?.toDate() || new Date(),
        })) || [],
      } as Poll);
    });

    return polls;
  } catch (error) {
    console.error('Error getting polls by event:', error);
    return [];
  }
};

/**
 * Get polls created by user
 */
export const getPollsByCreator = async (createdBy: string): Promise<Poll[]> => {
  try {
    const q = query(
      collection(db, 'polls'),
      where('createdBy', '==', createdBy),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const polls: Poll[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      polls.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        deadline: data.deadline?.toDate() || new Date(),
        options: data.options.map((opt: any) => ({
          ...opt,
          createdAt: opt.createdAt?.toDate() || new Date(),
        })),
        auditTrail: data.auditTrail?.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp?.toDate() || new Date(),
        })) || [],
      } as Poll);
    });

    return polls;
  } catch (error) {
    console.error('Error getting creator polls:', error);
    return [];
  }
};

// ============================================================================
// VOTING
// ============================================================================

/**
 * Submit a vote to a poll
 */
export const submitVote = async (request: SubmitVoteRequest): Promise<SubmitVoteResponse> => {
  try {
    const userId = getCurrentUserId();
    const userEmail = getCurrentUserEmail();

    // Get poll to validate
    const poll = await getPollById(request.pollId);
    if (!poll) {
      return { success: false, error: 'Poll not found' };
    }

    // Validate poll is open
    if (poll.status !== 'open') {
      return { success: false, error: 'Poll is not open for voting' };
    }

    // Validate deadline
    if (new Date() > poll.deadline) {
      return { success: false, error: 'Poll deadline has passed' };
    }

    // Validate user is participant
    if (!poll.participantIds.includes(userId)) {
      return { success: false, error: 'You are not authorized to vote on this poll' };
    }

    // Check for existing vote
    const voteRef = collection(db, 'polls', request.pollId, 'votes');
    const existingVoteQuery = query(voteRef, where('userId', '==', userId));
    const existingVotes = await getDocs(existingVoteQuery);

    if (existingVotes.size > 0) {
      if (!poll.config.allowChangeVote) {
        return {
          success: false,
          error: 'You have already voted on this poll and cannot change your vote',
        };
      }

      // Update existing vote
      const existingVoteDoc = existingVotes.docs[0];
      const updatedVote: Vote = {
        id: existingVoteDoc.id,
        pollId: request.pollId,
        userId,
        userEmail,
        choices: request.choices,
        status: 'changed' as VoteStatus,
        timestamp: new Date(),
      };

      await updateDoc(existingVoteDoc.ref, {
        ...updatedVote,
        timestamp: Timestamp.fromDate(updatedVote.timestamp),
      });

      // Recalculate results
      const results = await calculatePollResults(request.pollId);

      return {
        success: true,
        vote: updatedVote,
        results,
        message: 'Vote updated successfully',
      };
    }

    // Create new vote
    const newVote: Omit<Vote, 'id'> = {
      pollId: request.pollId,
      userId,
      userEmail,
      choices: request.choices,
      status: 'submitted' as VoteStatus,
      timestamp: new Date(),
    };

    const voteDocRef = await addDoc(voteRef, {
      ...newVote,
      timestamp: Timestamp.fromDate(newVote.timestamp),
    });

    const completeVote: Vote = {
      id: voteDocRef.id,
      ...newVote,
    };

    // Add audit trail to poll
    const pollRef = doc(db, 'polls', request.pollId);
    const auditEntry = createAuditEntry('voted', {
      voteId: voteDocRef.id,
      optionCount: Array.isArray(request.choices) ? request.choices.length : 1,
    });

    await updateDoc(pollRef, {
      auditTrail: arrayUnion(auditEntry),
      totalVotes: increment(1),
    });

    // Recalculate results
    const results = await calculatePollResults(request.pollId);

    return {
      success: true,
      vote: completeVote,
      results,
      message: 'Vote submitted successfully',
    };
  } catch (error) {
    console.error('Error submitting vote:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit vote',
    };
  }
};

/**
 * Get current user's vote for a poll
 */
export const getUserVote = async (pollId: string): Promise<Vote | null> => {
  try {
    const userId = getCurrentUserId();
    const voteRef = collection(db, 'polls', pollId, 'votes');
    const q = query(voteRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const voteDoc = querySnapshot.docs[0];
    const data = voteDoc.data();

    return {
      id: voteDoc.id,
      ...data,
      timestamp: data.timestamp?.toDate() || new Date(),
      withdrawnAt: data.withdrawnAt?.toDate(),
    } as Vote;
  } catch (error) {
    console.error('Error getting user vote:', error);
    return null;
  }
};

/**
 * Withdraw a vote
 */
export const withdrawVote = async (pollId: string, voteId: string): Promise<boolean> => {
  try {
    const userId = getCurrentUserId();

    // Get vote to verify ownership
    const voteRef = doc(db, 'polls', pollId, 'votes', voteId);
    const voteSnap = await getDoc(voteRef);

    if (!voteSnap.exists()) {
      throw new Error('Vote not found');
    }

    const voteData = voteSnap.data();
    if (voteData.userId !== userId) {
      throw new Error('Cannot withdraw vote you did not submit');
    }

    // Update vote status
    await updateDoc(voteRef, {
      withdrawn: true,
      withdrawnAt: Timestamp.now(),
      withdrawnBy: userId,
    });

    // Recalculate results
    await calculatePollResults(pollId);

    return true;
  } catch (error) {
    console.error('Error withdrawing vote:', error);
    return false;
  }
};

// ============================================================================
// RESULTS CALCULATION
// ============================================================================

/**
 * Calculate poll results
 */
export const calculatePollResults = async (pollId: string): Promise<PollResults | null> => {
  try {
    const poll = await getPollById(pollId);
    if (!poll) {
      return null;
    }

    const votesRef = collection(db, 'polls', pollId, 'votes');
    const votesSnap = await getDocs(votesRef);

    const votes: Vote[] = [];
    votesSnap.forEach((doc) => {
      const data = doc.data();
      votes.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as Vote);
    });

    // Count votes per option
    const votesByOption = new Map<string, VoteChoice[]>();
    const activeVotes = votes.filter(v => !v.withdrawn);

    activeVotes.forEach((vote) => {
      const choices = Array.isArray(vote.choices) ? vote.choices : [vote.choices];
      choices.forEach((choice) => {
        if (!votesByOption.has(choice.optionId)) {
          votesByOption.set(choice.optionId, []);
        }
        votesByOption.get(choice.optionId)!.push(choice);
      });
    });

    // Calculate option results
    const optionResults: OptionVoteCount[] = poll.options.map((option) => {
      const votes = votesByOption.get(option.id) || [];
      const voters = new Set<string>();

      activeVotes.forEach((vote) => {
        const choices = Array.isArray(vote.choices) ? vote.choices : [vote.choices];
        if (choices.some(c => c.optionId === option.id)) {
          voters.add(vote.userId);
        }
      });

      return {
        optionId: option.id,
        optionText: option.text,
        voteCount: votes.length,
        percentage: activeVotes.length > 0 ? (votes.length / activeVotes.length) * 100 : 0,
        voters: poll.config.showVoterNames
          ? Array.from(voters)
          : undefined,
        averageRank: poll.type === 'ranking'
          ? votes.reduce((sum, v) => sum + (v.rank || 0), 0) / (votes.length || 1)
          : undefined,
      };
    });

    // Sort by vote count
    optionResults.sort((a, b) => b.voteCount - a.voteCount);

    const results: PollResults = {
      pollId,
      totalVotes: activeVotes.length,
      totalParticipants: new Set(activeVotes.map(v => v.userId)).size,
      optionResults,
      winningOption: optionResults[0],
      status: poll.status,
      calculatedAt: new Date(),
      isFinalized: poll.status === 'closed',
    };

    // Save results to poll_results collection
    const resultsRef = doc(db, 'poll_results', pollId);
    await setDoc(resultsRef, {
      ...results,
      calculatedAt: Timestamp.fromDate(results.calculatedAt),
    });

    return results;
  } catch (error) {
    console.error('Error calculating poll results:', error);
    return null;
  }
};

/**
 * Get poll results
 */
export const getPollResults = async (pollId: string): Promise<PollResults | null> => {
  try {
    const resultsRef = doc(db, 'poll_results', pollId);
    const resultsSnap = await getDoc(resultsRef);

    if (!resultsSnap.exists()) {
      return calculatePollResults(pollId);
    }

    const data = resultsSnap.data();
    return {
      ...data,
      calculatedAt: data.calculatedAt?.toDate() || new Date(),
    } as PollResults;
  } catch (error) {
    console.error('Error getting poll results:', error);
    return null;
  }
};

// ============================================================================
// POLL MANAGEMENT
// ============================================================================

/**
 * Close a poll
 */
export const closePoll = async (pollId: string): Promise<ClosePollResponse> => {
  try {
    const userId = getCurrentUserId();
    const poll = await getPollById(pollId);

    if (!poll) {
      return { success: false, error: 'Poll not found' };
    }

    if (poll.createdBy !== userId) {
      return { success: false, error: 'Only poll creator can close the poll' };
    }

    const pollRef = doc(db, 'polls', pollId);
    const auditEntry = createAuditEntry('closed');

    await updateDoc(pollRef, {
      status: 'closed',
      closedAt: Timestamp.now(),
      auditTrail: arrayUnion(auditEntry),
    });

    // Calculate final results
    const results = await calculatePollResults(pollId);
    const closedPoll = await getPollById(pollId);

    return {
      success: true,
      poll: closedPoll || undefined,
      results: results || undefined,
    };
  } catch (error) {
    console.error('Error closing poll:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to close poll',
    };
  }
};

/**
 * Update poll
 */
export const updatePoll = async (
  pollId: string,
  updates: UpdatePollRequest
): Promise<CreatePollResponse> => {
  try {
    const userId = getCurrentUserId();
    const poll = await getPollById(pollId);

    if (!poll) {
      return { success: false, error: 'Poll not found' };
    }

    if (poll.createdBy !== userId) {
      return { success: false, error: 'Only poll creator can update the poll' };
    }

    if (poll.status !== 'draft' && poll.status !== 'open') {
      return { success: false, error: 'Cannot update a closed poll' };
    }

    const pollRef = doc(db, 'polls', pollId);
    const auditEntry = createAuditEntry('updated', updates);

    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
      lastModifiedBy: userId,
      auditTrail: arrayUnion(auditEntry),
    };

    if (updates.deadline) {
      updateData.deadline = Timestamp.fromDate(updates.deadline);
    }

    await updateDoc(pollRef, updateData);

    const updatedPoll = await getPollById(pollId);
    return {
      success: true,
      poll: updatedPoll || undefined,
      message: 'Poll updated successfully',
    };
  } catch (error) {
    console.error('Error updating poll:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update poll',
    };
  }
};

/**
 * Delete poll (draft only)
 */
export const deletePoll = async (pollId: string): Promise<boolean> => {
  try {
    const userId = getCurrentUserId();
    const poll = await getPollById(pollId);

    if (!poll) {
      throw new Error('Poll not found');
    }

    if (poll.createdBy !== userId) {
      throw new Error('Only poll creator can delete the poll');
    }

    if (poll.status !== 'draft') {
      throw new Error('Can only delete draft polls');
    }

    // Delete votes
    const votesRef = collection(db, 'polls', pollId, 'votes');
    const votesSnap = await getDocs(votesRef);
    const batch = writeBatch(db);

    votesSnap.forEach((voteDoc) => {
      batch.delete(voteDoc.ref);
    });

    // Delete poll
    batch.delete(doc(db, 'polls', pollId));
    batch.delete(doc(db, 'poll_results', pollId));

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error deleting poll:', error);
    return false;
  }
};

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

/**
 * Subscribe to poll updates in real-time
 */
export const onPollUpdates = (
  pollId: string,
  callback: (poll: Poll | null) => void
): (() => void) => {
  try {
    const pollRef = doc(db, 'polls', pollId);

    const unsubscribe = onSnapshot(pollRef, (doc) => {
      if (!doc.exists()) {
        callback(null);
        return;
      }

      const data = doc.data();
      // @ts-ignore - Type mismatch due to Firestore data structure
      const poll: Poll = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        deadline: data.deadline?.toDate() || new Date(),
        closedAt: data.closedAt?.toDate(),
        options: data.options.map((opt: any) => ({
          ...opt,
          createdAt: opt.createdAt?.toDate() || new Date(),
        })),
        auditTrail: data.auditTrail?.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp?.toDate() || new Date(),
        })) || [],
      };

      callback(poll);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to poll updates:', error);
    return () => {};
  }
};

/**
 * Subscribe to poll results in real-time
 */
export const onPollResults = (
  pollId: string,
  callback: (results: PollResults | null) => void
): (() => void) => {
  try {
    const resultsRef = doc(db, 'poll_results', pollId);

    const unsubscribe = onSnapshot(resultsRef, (doc) => {
      if (!doc.exists()) {
        callback(null);
        return;
      }

      const data = doc.data();
      // @ts-ignore - Type mismatch due to Firestore data structure
      const results: PollResults = {
        ...data,
        calculatedAt: data.calculatedAt?.toDate() || new Date(),
      };

      callback(results);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to results:', error);
    return () => {};
  }
};

/**
 * Subscribe to user votes in real-time
 */
export const onUserVotes = (
  pollId: string,
  callback: (votes: Vote[]) => void
): (() => void) => {
  try {
    const userId = getCurrentUserId();
    const votesRef = collection(db, 'polls', pollId, 'votes');
    const q = query(votesRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const votes: Vote[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        votes.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as Vote);
      });

      callback(votes);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to user votes:', error);
    return () => {};
  }
};

export default {
  createPoll,
  getPollById,
  getPollsByEventId,
  getPollsByCreator,
  submitVote,
  getUserVote,
  withdrawVote,
  calculatePollResults,
  getPollResults,
  closePoll,
  updatePoll,
  deletePoll,
  onPollUpdates,
  onPollResults,
  onUserVotes,
};
