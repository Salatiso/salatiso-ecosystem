/**
 * useEscalation Hook - Phase 3
 * 
 * Real-time escalation state management for React components.
 * Handles subscriptions, status updates, responder management,
 * and computed properties for UI consumption.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import {
  EscalationEvent,
  EscalationStatus,
  EscalationLevel,
  ResponderRole,
  UpdateEscalationStatusRequest,
  AssignResponderRequest,
  RespondActionRequest,
  EscalationWorkflowState,
  EscalationFilterOptions,
  PaginatedEscalations,
} from '@/types/escalation';
import * as escalationService from '@/services/escalationServiceV3';

export interface UseEscalationReturn {
  // State
  escalation: EscalationEvent | null;
  isLoading: boolean;
  error: string | null;

  // User Info
  userRole: ResponderRole | null;
  canEscalate: boolean;
  canResolve: boolean;

  // Actions
  updateStatus: (request: UpdateEscalationStatusRequest) => Promise<void>;
  escalateToNext: (reason: string, assignToUserId?: string) => Promise<void>;
  assignResponder: (request: AssignResponderRequest) => Promise<void>;
  acknowledgeAssignment: (assignmentId: string) => Promise<void>;
  handoffEscalation: (assignmentId: string, nextUserId: string, reason: string) => Promise<void>;
  logAction: (assignmentId: string, request: RespondActionRequest) => Promise<void>;

  // Computed
  isResolved: boolean;
  isCritical: boolean;
  canAutoEscalate: boolean;
  nextLevel: EscalationLevel | null;
  primaryResponder: string | null;
  timeInCurrentLevel: number; // milliseconds
}

/**
 * Hook for managing a single escalation
 */
export function useEscalation(escalationId: string): UseEscalationReturn {
  const auth = getAuth();
  const user = auth.currentUser;
  const [escalation, setEscalation] = useState<EscalationEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fetch and subscribe to escalation
  useEffect(() => {
    if (!escalationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Initial fetch
    escalationService
      .getEscalationById(escalationId)
      .then((data) => {
        setEscalation(data);
      })
      .catch((err) => {
        setError(err.message);
      });

    // Subscribe to real-time updates
    unsubscribeRef.current = escalationService.subscribeToEscalation(escalationId, (data) => {
      setEscalation(data);
      setIsLoading(false);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [escalationId]);

  // Get user's role in this escalation
  const userRole = useCallback((): ResponderRole | null => {
    if (!escalation || !user) return null;

    const assignment = escalation.responders.find((r) => r.userId === user.uid);
    return assignment?.role || null;
  }, [escalation, user]);

  // Check permissions
  const canEscalate = useCallback((): boolean => {
    if (!escalation || !user) return false;
    return escalation.createdBy === user.uid || escalation.currentOwner === user.uid;
  }, [escalation, user]);

  const canResolve = useCallback((): boolean => {
    if (!escalation || !user) return false;
    return escalation.createdBy === user.uid || escalation.currentOwner === user.uid;
  }, [escalation, user]);

  // Actions
  const updateStatus = useCallback(
    async (request: UpdateEscalationStatusRequest) => {
      if (!user) throw new Error('User not authenticated');
      setIsLoading(true);
      try {
        await escalationService.updateEscalationStatus(escalationId, request, user.uid);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update status');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [escalationId, user]
  );

  const escalateToNext = useCallback(
    async (reason: string, assignToUserId?: string) => {
      if (!user) throw new Error('User not authenticated');
      if (!canEscalate()) throw new Error('Permission denied');

      setIsLoading(true);
      try {
        await escalationService.escalateToNextLevel(
          escalationId,
          { escalationId, toLevel: EscalationLevel.FAMILY, reason, assignToUserId },
          user.uid
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to escalate');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [escalationId, user, canEscalate]
  );

  const assignResponder = useCallback(
    async (request: AssignResponderRequest) => {
      if (!user) throw new Error('User not authenticated');
      if (!canEscalate()) throw new Error('Permission denied');

      setIsLoading(true);
      try {
        await escalationService.assignResponder(escalationId, request, user.uid);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to assign responder');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [escalationId, user, canEscalate]
  );

  const acknowledgeAssignment = useCallback(
    async (assignmentId: string) => {
      if (!user) throw new Error('User not authenticated');

      setIsLoading(true);
      try {
        await escalationService.acknowledgeAssignment(escalationId, assignmentId, user.uid);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to acknowledge');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [escalationId, user]
  );

  const handoffEscalation = useCallback(
    async (assignmentId: string, nextUserId: string, reason: string) => {
      if (!user) throw new Error('User not authenticated');

      setIsLoading(true);
      try {
        await escalationService.handoffEscalation(
          escalationId,
          assignmentId,
          nextUserId,
          reason,
          user.uid
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to handoff');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [escalationId, user]
  );

  const logAction = useCallback(
    async (assignmentId: string, request: RespondActionRequest) => {
      if (!user) throw new Error('User not authenticated');

      setIsLoading(true);
      try {
        await escalationService.logResponderAction(escalationId, assignmentId, request, user.uid);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to log action');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [escalationId, user]
  );

  // Computed properties
  const isResolved = escalation?.status === EscalationStatus.RESOLVED;
  const isCritical = escalation?.severity === 'critical';
  const canAutoEscalate =
    escalation && escalation.currentLevel !== EscalationLevel.PROFESSIONAL
      ? true
      : false;
  const nextLevel =
    escalation?.currentLevel === EscalationLevel.INDIVIDUAL
      ? EscalationLevel.FAMILY
      : escalation?.currentLevel === EscalationLevel.FAMILY
        ? EscalationLevel.COMMUNITY
        : escalation?.currentLevel === EscalationLevel.COMMUNITY
          ? EscalationLevel.PROFESSIONAL
          : null;
  const primaryResponder = escalation?.responders[0]?.userId || null;
  const timeInCurrentLevel = escalation
    ? Date.now() - (escalation.escalatedAt?.getTime() || escalation.createdAt.getTime())
    : 0;

  return {
    escalation,
    isLoading,
    error,
    userRole: userRole(),
    canEscalate: canEscalate(),
    canResolve: canResolve(),
    updateStatus,
    escalateToNext,
    assignResponder,
    acknowledgeAssignment,
    handoffEscalation,
    logAction,
    isResolved,
    isCritical,
    canAutoEscalate,
    nextLevel,
    primaryResponder,
    timeInCurrentLevel,
  };
}

/**
 * Hook for managing user's assigned escalations
 */
export interface UseUserEscalationsReturn {
  escalations: EscalationEvent[];
  isLoading: boolean;
  error: string | null;
  openCount: number;
  criticalCount: number;
  refresh: () => Promise<void>;
}

export function useUserEscalations(): UseUserEscalationsReturn {
  const auth = getAuth();
  const user = auth.currentUser;
  const [escalations, setEscalations] = useState<EscalationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    unsubscribeRef.current = escalationService.subscribeToUserEscalations(
      user.uid,
      (data) => {
        setEscalations(data);
        setIsLoading(false);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user]);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const data = await escalationService.getUserAssignedEscalations(user.uid);
      setEscalations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    }
  }, [user]);

  const openCount = escalations.filter((e) => e.status !== EscalationStatus.RESOLVED).length;
  const criticalCount = escalations.filter((e) => e.severity === 'critical').length;

  return {
    escalations,
    isLoading,
    error,
    openCount,
    criticalCount,
    refresh,
  };
}

export default { useEscalation, useUserEscalations };
