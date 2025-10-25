/**
 * @file escalationService.ts
 * @description Service for managing incident escalation logic and notifications
 * Handles auto-escalation rules, escalation workflows, and cross-context communication
 * 
 * FEATURES:
 * - Auto-escalation based on severity rules
 * - Multi-level escalation with history
 * - Notification generation for each level
 * - Permission validation for escalation
 * - Firebase integration ready
 * 
 * @created October 22, 2025
 */

import {
  EnhancedCalendarEvent,
  IncidentData,
  EscalationEntry,
  SeverityLevel,
  ContextLevel,
  EscalationAction,
  CalendarNotification
} from '@/types/calendar';

/**
 * Auto-escalation rules by severity level
 */
const AUTO_ESCALATION_RULES: Record<
  SeverityLevel,
  { escalate: boolean; toLevel: ContextLevel; action: EscalationAction }
> = {
  [SeverityLevel.CRITICAL]: {
    escalate: true,
    toLevel: ContextLevel.PROFESSIONAL,
    action: EscalationAction.AUTO_ESCALATE
  },
  [SeverityLevel.HIGH]: {
    escalate: true,
    toLevel: ContextLevel.FAMILY,
    action: EscalationAction.AUTO_ESCALATE
  },
  [SeverityLevel.MEDIUM]: {
    escalate: false,
    toLevel: ContextLevel.FAMILY,
    action: EscalationAction.LOG
  },
  [SeverityLevel.LOW]: {
    escalate: false,
    toLevel: ContextLevel.INDIVIDUAL,
    action: EscalationAction.LOG
  }
};

/**
 * Escalation level hierarchy
 */
const ESCALATION_HIERARCHY = [
  ContextLevel.INDIVIDUAL,
  ContextLevel.FAMILY,
  ContextLevel.COMMUNITY,
  ContextLevel.PROFESSIONAL
];

/**
 * Escalation Service
 * Manages all escalation logic for incidents
 */
export class EscalationService {
  /**
   * Determine if incident should auto-escalate
   */
  static shouldAutoEscalate(severity: SeverityLevel): boolean {
    return AUTO_ESCALATION_RULES[severity].escalate;
  }

  /**
   * Get target level for auto-escalation
   */
  static getAutoEscalationTarget(severity: SeverityLevel): ContextLevel {
    return AUTO_ESCALATION_RULES[severity].toLevel;
  }

  /**
   * Get next escalation level in hierarchy
   */
  static getNextLevel(current: ContextLevel): ContextLevel | null {
    const index = ESCALATION_HIERARCHY.indexOf(current);
    if (index === -1 || index >= ESCALATION_HIERARCHY.length - 1) {
      return null;
    }
    return ESCALATION_HIERARCHY[index + 1];
  }

  /**
   * Check if user can escalate at current level
   */
  static canEscalate(userContext: ContextLevel): boolean {
    // Only Family and above can escalate
    return (
      userContext === ContextLevel.FAMILY ||
      userContext === ContextLevel.COMMUNITY ||
      userContext === ContextLevel.PROFESSIONAL
    );
  }

  /**
   * Create escalation entry for an incident
   */
  static createEscalationEntry(
    event: EnhancedCalendarEvent,
    incident: IncidentData,
    fromLevel: ContextLevel,
    toLevel: ContextLevel,
    reason: string,
    action: EscalationAction,
    escalatedBy: string,
    assignedTo?: string[]
  ): EscalationEntry {
    return {
      id: `escalation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId: event.id,
      fromLevel,
      toLevel,
      reason,
      action,
      escalatedBy,
      escalatedAt: new Date(),
      assignedTo,
      resolved: false
    };
  }

  /**
   * Get escalation reason message
   */
  static getEscalationReason(severity: SeverityLevel): string {
    const reasons: Record<SeverityLevel, string> = {
      [SeverityLevel.CRITICAL]: 'Critical severity - immediate professional response required',
      [SeverityLevel.HIGH]: 'High severity - family escalation required',
      [SeverityLevel.MEDIUM]: 'Medium severity - family notification',
      [SeverityLevel.LOW]: 'Low severity - informational'
    };
    return reasons[severity];
  }

  /**
   * Check if escalation is needed based on incident history
   */
  static isEscalationNeeded(
    incident: IncidentData,
    currentLevel: ContextLevel
  ): boolean {
    // Auto-escalate for critical severity
    if (incident.severity === SeverityLevel.CRITICAL) {
      return currentLevel !== ContextLevel.PROFESSIONAL;
    }

    // Escalate to family for high severity
    if (incident.severity === SeverityLevel.HIGH) {
      return currentLevel === ContextLevel.INDIVIDUAL;
    }

    return false;
  }

  /**
   * Get escalation history summary
   */
  static getEscalationSummary(escalations: EscalationEntry[]): {
    totalEscalations: number;
    currentLevel: ContextLevel;
    timeline: { level: ContextLevel; timestamp: Date }[];
  } {
    if (escalations.length === 0) {
      return {
        totalEscalations: 0,
        currentLevel: ContextLevel.INDIVIDUAL,
        timeline: []
      };
    }

    const timeline = escalations.map((e) => ({
      level: e.toLevel,
      timestamp: e.escalatedAt
    }));

    return {
      totalEscalations: escalations.length,
      currentLevel: escalations[escalations.length - 1].toLevel,
      timeline
    };
  }

  /**
   * Validate escalation permission
   */
  static validateEscalationPermission(
    userContext: ContextLevel,
    targetLevel: ContextLevel,
    incident: IncidentData
  ): { valid: boolean; reason?: string } {
    // User must be at same or higher level than target
    const userIndex = ESCALATION_HIERARCHY.indexOf(userContext);
    const targetIndex = ESCALATION_HIERARCHY.indexOf(targetLevel);

    if (userIndex < targetIndex) {
      return {
        valid: false,
        reason: `User at ${userContext} cannot escalate to ${targetLevel}`
      };
    }

    // For critical incidents, anyone can escalate to professional
    if (incident.severity === SeverityLevel.CRITICAL && targetLevel === ContextLevel.PROFESSIONAL) {
      return { valid: true };
    }

    // For other escalations, require family level or higher
    if (!this.canEscalate(userContext)) {
      return {
        valid: false,
        reason: 'Only family members and above can escalate incidents'
      };
    }

    return { valid: true };
  }

  /**
   * Get responders for a given context level
   */
  static getRespondersForLevel(
    level: ContextLevel,
    allResponders: Record<ContextLevel, string[]>
  ): string[] {
    // Get responders for this level and all higher levels
    const index = ESCALATION_HIERARCHY.indexOf(level);
    const responders: string[] = [];

    for (let i = index; i < ESCALATION_HIERARCHY.length; i++) {
      const levelResponders = allResponders[ESCALATION_HIERARCHY[i]];
      if (levelResponders) {
        responders.push(...levelResponders);
      }
    }

    return [...new Set(responders)]; // Remove duplicates
  }

  /**
   * Mark escalation as resolved
   */
  static resolveEscalation(
    escalation: EscalationEntry,
    resolutionDetails: string
  ): EscalationEntry {
    return {
      ...escalation,
      resolved: true,
      resolutionDetails
    };
  }

  /**
   * Get time since escalation
   */
  static getTimeSinceEscalation(escalation: EscalationEntry): {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    formatted: string;
  } {
    const now = new Date();
    const then = new Date(escalation.escalatedAt);
    const ms = now.getTime() - then.getTime();

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let formatted = '';
    if (days > 0) {
      formatted = `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      formatted = `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      formatted = `${minutes}m`;
    } else {
      formatted = `${seconds}s`;
    }

    return {
      milliseconds: ms,
      seconds,
      minutes,
      hours,
      days,
      formatted
    };
  }

  /**
   * Generate notification for escalation
   */
  static generateEscalationNotification(
    escalation: EscalationEntry,
    event: EnhancedCalendarEvent,
    incident: IncidentData,
    recipientUserId: string
  ): CalendarNotification {
    const levelNames: Record<ContextLevel, string> = {
      [ContextLevel.INDIVIDUAL]: 'Individual',
      [ContextLevel.FAMILY]: 'Family',
      [ContextLevel.COMMUNITY]: 'Community',
      [ContextLevel.PROFESSIONAL]: 'Professional'
    };

    const severity = incident.severity;
    const priorityMap: Record<SeverityLevel, CalendarNotification['priority']> = {
      [SeverityLevel.CRITICAL]: 'critical',
      [SeverityLevel.HIGH]: 'high',
      [SeverityLevel.MEDIUM]: 'medium',
      [SeverityLevel.LOW]: 'low'
    };

    return {
      id: `notification_${Date.now()}`,
      eventId: event.id,
      userId: recipientUserId,
      type: 'escalated',
      title: `Incident Escalated to ${levelNames[escalation.toLevel]}`,
      message: `${event.title} has been escalated from ${levelNames[escalation.fromLevel]} to ${levelNames[escalation.toLevel]}: ${escalation.reason}`,
      context: escalation.toLevel,
      priority: priorityMap[severity],
      channels: this.getNotificationChannels(severity),
      createdAt: new Date()
    };
  }

  /**
   * Determine notification channels based on severity
   */
  private static getNotificationChannels(
    severity: SeverityLevel
  ): ('push' | 'email' | 'mesh')[] {
    switch (severity) {
      case SeverityLevel.CRITICAL:
        return ['push', 'email', 'mesh']; // All channels for critical
      case SeverityLevel.HIGH:
        return ['push', 'email'];
      case SeverityLevel.MEDIUM:
        return ['push'];
      case SeverityLevel.LOW:
        return ['push']; // Optional for low
      default:
        return ['push'];
    }
  }

  /**
   * Check if escalation chain is complete
   */
  static isEscalationChainComplete(
    escalations: EscalationEntry[]
  ): boolean {
    if (escalations.length === 0) return false;

    const latestEscalation = escalations[escalations.length - 1];
    return latestEscalation.toLevel === ContextLevel.PROFESSIONAL;
  }
}

export default EscalationService;
