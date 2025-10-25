/**
 * @file useIncidentEscalation.ts
 * @description Custom React hook for managing incident escalation
 * Handles escalation logic, auto-escalation rules, and notification tracking
 * 
 * FEATURES:
 * - Auto-escalation based on severity
 * - Permission-based escalation control
 * - Escalation history tracking
 * - Multi-level context escalation (Individual → Family → Community → Professional)
 * - Firebase integration ready
 * 
 * @created October 22, 2025
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  EnhancedCalendarEvent,
  IncidentData,
  EscalationEntry,
  SeverityLevel,
  ContextLevel,
  EscalationAction,
  Permission
} from '@/types/calendar';

/**
 * Return type for useIncidentEscalation hook
 */
interface UseIncidentEscalationReturn {
  /** Current escalation level */
  currentLevel: ContextLevel;
  /** Escalation history */
  history: EscalationEntry[];
  /** Whether escalation is in progress */
  isEscalating: boolean;
  /** Error if any */
  error: Error | null;
  /** Whether current user can escalate */
  canEscalate: boolean;
  /** Check if auto-escalation should occur */
  shouldAutoEscalate: (severity: SeverityLevel) => boolean;
  /** Get escalation reason message */
  getEscalationReason: (severity: SeverityLevel) => string;
  /** Manual escalation */
  escalate: (reason: string, assignedTo?: string[]) => Promise<void>;
  /** Get next escalation level */
  getNextLevel: (current: ContextLevel) => ContextLevel | null;
}

/**
 * Auto-escalation rules by severity
 * Critical incidents escalate immediately, others escalate to family level
 */
const AUTO_ESCALATION_RULES: Record<
  SeverityLevel,
  { escalate: boolean; toLevel: ContextLevel; reason: string }
> = {
  [SeverityLevel.CRITICAL]: {
    escalate: true,
    toLevel: ContextLevel.PROFESSIONAL,
    reason: 'Critical severity - immediate professional response required'
  },
  [SeverityLevel.HIGH]: {
    escalate: true,
    toLevel: ContextLevel.FAMILY,
    reason: 'High severity - family escalation required'
  },
  [SeverityLevel.MEDIUM]: {
    escalate: false,
    toLevel: ContextLevel.FAMILY,
    reason: 'Medium severity - notify family'
  },
  [SeverityLevel.LOW]: {
    escalate: false,
    toLevel: ContextLevel.INDIVIDUAL,
    reason: 'Low severity - informational only'
  }
};

/**
 * Escalation level hierarchy
 */
const ESCALATION_HIERARCHY: ContextLevel[] = [
  ContextLevel.INDIVIDUAL,
  ContextLevel.FAMILY,
  ContextLevel.COMMUNITY,
  ContextLevel.PROFESSIONAL
];

/**
 * Hook for managing incident escalation
 * @param event - The calendar event containing incident data
 * @param incident - The incident being escalated
 * @param currentUserId - Current user's ID
 * @param currentContext - Current context level
 * @param onEscalate - Optional callback when escalation occurs
 * @returns Escalation management utilities and state
 */
export function useIncidentEscalation(
  event: EnhancedCalendarEvent | null,
  incident: IncidentData | null,
  currentUserId: string,
  currentContext: ContextLevel = ContextLevel.INDIVIDUAL,
  onEscalate?: (entry: EscalationEntry) => Promise<void>
): UseIncidentEscalationReturn {
  const [currentLevel, setCurrentLevel] = useState<ContextLevel>(currentContext);
  const [history, setHistory] = useState<EscalationEntry[]>([]);
  const [isEscalating, setIsEscalating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Check if current user can escalate
   * Only family members (family level+) can escalate incidents
   */
  const canEscalate = useCallback((): boolean => {
    return currentContext !== ContextLevel.INDIVIDUAL;
  }, [currentContext]);

  /**
   * Check if auto-escalation should occur
   */
  const shouldAutoEscalate = useCallback((severity: SeverityLevel): boolean => {
    return AUTO_ESCALATION_RULES[severity].escalate;
  }, []);

  /**
   * Get escalation reason message
   */
  const getEscalationReason = useCallback((severity: SeverityLevel): string => {
    return AUTO_ESCALATION_RULES[severity].reason;
  }, []);

  /**
   * Get next escalation level in hierarchy
   */
  const getNextLevel = useCallback((current: ContextLevel): ContextLevel | null => {
    const currentIndex = ESCALATION_HIERARCHY.indexOf(current);
    if (currentIndex === -1 || currentIndex >= ESCALATION_HIERARCHY.length - 1) {
      return null;
    }
    return ESCALATION_HIERARCHY[currentIndex + 1];
  }, []);

  /**
   * Perform escalation
   */
  const escalate = useCallback(
    async (reason: string, assignedTo?: string[]) => {
      if (!event || !incident) {
        throw new Error('Event and incident not loaded');
      }

      const nextLevel = getNextLevel(currentLevel);
      if (!nextLevel) {
        throw new Error('Incident already at highest escalation level');
      }

      try {
        setIsEscalating(true);

        // Create escalation entry
        const entry: EscalationEntry = {
          id: `escalation_${Date.now()}`,
          eventId: event.id,
          fromLevel: currentLevel,
          toLevel: nextLevel,
          reason,
          action: EscalationAction.MANUAL_ESCALATE,
          escalatedBy: currentUserId,
          escalatedAt: new Date(),
          assignedTo,
          resolved: false
        };

        // Update local state
        setHistory((prev) => [...prev, entry]);
        setCurrentLevel(nextLevel);
        setError(null);

        // Notify parent
        if (onEscalate) {
          await onEscalate(entry);
        }

        // TODO: Firebase update when backend is ready
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Escalation failed');
        setError(error);
        throw error;
      } finally {
        setIsEscalating(false);
      }
    },
    [event, incident, currentLevel, currentUserId, getNextLevel, onEscalate]
  );

  /**
   * Handle auto-escalation based on incident severity
   */
  useEffect(() => {
    if (!incident || !event) return;

    const rule = AUTO_ESCALATION_RULES[incident.severity];

    if (rule.escalate && currentLevel !== rule.toLevel) {
      // Auto-escalate
      const entry: EscalationEntry = {
        id: `escalation_${Date.now()}`,
        eventId: event.id,
        fromLevel: currentLevel,
        toLevel: rule.toLevel,
        reason: rule.reason,
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: new Date(),
        resolved: false
      };

      setHistory((prev) => [...prev, entry]);
      setCurrentLevel(rule.toLevel);

      // Notify parent if provided
      if (onEscalate) {
        onEscalate(entry).catch((err) => {
          console.error('Failed to notify parent of auto-escalation:', err);
        });
      }
    }
  }, [incident?.severity, event, currentLevel, onEscalate]);

  /**
   * Load escalation history from event
   */
  useEffect(() => {
    if (!event?.escalationPath) {
      setHistory([]);
      return;
    }

    setHistory(event.escalationPath);
    
    // Determine current level based on latest escalation
    if (event.escalationPath.length > 0) {
      const latest = event.escalationPath[event.escalationPath.length - 1];
      setCurrentLevel(latest.toLevel);
    } else {
      setCurrentLevel(currentContext);
    }

    setError(null);
  }, [event, currentContext]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    currentLevel,
    history,
    isEscalating,
    error,
    canEscalate: canEscalate(),
    shouldAutoEscalate,
    getEscalationReason,
    escalate,
    getNextLevel
  };
}

export default useIncidentEscalation;
