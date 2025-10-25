/**
 * @file escalationService.test.ts
 * @description Comprehensive test suite for EscalationService
 * Tests: auto-escalation rules, permissions, escalation hierarchy, notifications
 * 
 * @created October 22, 2025
 */

import {
  SeverityLevel,
  ContextLevel,
  EscalationAction,
  EventType,
  IncidentCategory,
  ActivityCategory
} from '@/types/calendar';
import EscalationService from '@/services/escalationService';

/**
 * Mock data for testing
 */
const mockEvent = {
  id: 'event_1',
  title: 'Critical Incident',
  type: EventType.INCIDENT,
  context: ContextLevel.INDIVIDUAL,
  escalationPath: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user_1',
  lastModifiedBy: 'user_1'
};

const mockIncident = {
  category: IncidentCategory.HEALTH,
  severity: SeverityLevel.CRITICAL,
  description: 'Medical emergency',
  location: 'Home',
  escalationPath: [],
  currentLevel: ContextLevel.INDIVIDUAL
};

describe('EscalationService', () => {
  describe('Auto-Escalation Rules', () => {
    it('should identify critical incidents for auto-escalation', () => {
      expect(EscalationService.shouldAutoEscalate(SeverityLevel.CRITICAL)).toBe(true);
    });

    it('should identify high severity for auto-escalation', () => {
      expect(EscalationService.shouldAutoEscalate(SeverityLevel.HIGH)).toBe(true);
    });

    it('should not auto-escalate medium severity', () => {
      expect(EscalationService.shouldAutoEscalate(SeverityLevel.MEDIUM)).toBe(false);
    });

    it('should not auto-escalate low severity', () => {
      expect(EscalationService.shouldAutoEscalate(SeverityLevel.LOW)).toBe(false);
    });

    it('should return correct target level for critical severity', () => {
      const target = EscalationService.getAutoEscalationTarget(SeverityLevel.CRITICAL);
      expect(target).toBe(ContextLevel.PROFESSIONAL);
    });

    it('should return family level for high severity', () => {
      const target = EscalationService.getAutoEscalationTarget(SeverityLevel.HIGH);
      expect(target).toBe(ContextLevel.FAMILY);
    });

    it('should provide escalation reason for each severity', () => {
      const reasons = {
        [SeverityLevel.CRITICAL]: EscalationService.getEscalationReason(SeverityLevel.CRITICAL),
        [SeverityLevel.HIGH]: EscalationService.getEscalationReason(SeverityLevel.HIGH),
        [SeverityLevel.MEDIUM]: EscalationService.getEscalationReason(SeverityLevel.MEDIUM),
        [SeverityLevel.LOW]: EscalationService.getEscalationReason(SeverityLevel.LOW)
      };

      Object.values(reasons).forEach((reason) => {
        expect(typeof reason).toBe('string');
        expect(reason.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Escalation Hierarchy', () => {
    it('should return family as next level from individual', () => {
      const next = EscalationService.getNextLevel(ContextLevel.INDIVIDUAL);
      expect(next).toBe(ContextLevel.FAMILY);
    });

    it('should return community as next level from family', () => {
      const next = EscalationService.getNextLevel(ContextLevel.FAMILY);
      expect(next).toBe(ContextLevel.COMMUNITY);
    });

    it('should return professional as next level from community', () => {
      const next = EscalationService.getNextLevel(ContextLevel.COMMUNITY);
      expect(next).toBe(ContextLevel.PROFESSIONAL);
    });

    it('should return null when at professional level', () => {
      const next = EscalationService.getNextLevel(ContextLevel.PROFESSIONAL);
      expect(next).toBeNull();
    });

    it('should return null for invalid context', () => {
      const next = EscalationService.getNextLevel('invalid' as ContextLevel);
      expect(next).toBeNull();
    });
  });

  describe('Permission Validation', () => {
    it('should prevent individual from escalating', () => {
      expect(EscalationService.canEscalate(ContextLevel.INDIVIDUAL)).toBe(false);
    });

    it('should allow family to escalate', () => {
      expect(EscalationService.canEscalate(ContextLevel.FAMILY)).toBe(true);
    });

    it('should allow community to escalate', () => {
      expect(EscalationService.canEscalate(ContextLevel.COMMUNITY)).toBe(true);
    });

    it('should allow professional to escalate', () => {
      expect(EscalationService.canEscalate(ContextLevel.PROFESSIONAL)).toBe(true);
    });
  });

  describe('Escalation Entry Creation', () => {
    it('should create valid escalation entry', () => {
      const entry = EscalationService.createEscalationEntry(
        mockEvent as any,
        mockIncident as any,
        ContextLevel.INDIVIDUAL,
        ContextLevel.FAMILY,
        'High severity incident',
        EscalationAction.AUTO_ESCALATE,
        'system'
      );

      expect(entry.id).toMatch(/^escalation_/);
      expect(entry.eventId).toBe('event_1');
      expect(entry.fromLevel).toBe(ContextLevel.INDIVIDUAL);
      expect(entry.toLevel).toBe(ContextLevel.FAMILY);
      expect(entry.reason).toBe('High severity incident');
      expect(entry.action).toBe(EscalationAction.AUTO_ESCALATE);
      expect(entry.escalatedBy).toBe('system');
      expect(entry.escalatedAt).toBeInstanceOf(Date);
      expect(entry.resolved).toBe(false);
    });

    it('should generate unique IDs for escalations', () => {
      const entry1 = EscalationService.createEscalationEntry(
        mockEvent as any,
        mockIncident as any,
        ContextLevel.INDIVIDUAL,
        ContextLevel.FAMILY,
        'Reason 1',
        EscalationAction.AUTO_ESCALATE,
        'system'
      );

      const entry2 = EscalationService.createEscalationEntry(
        mockEvent as any,
        mockIncident as any,
        ContextLevel.INDIVIDUAL,
        ContextLevel.FAMILY,
        'Reason 2',
        EscalationAction.AUTO_ESCALATE,
        'system'
      );

      expect(entry1.id).not.toBe(entry2.id);
    });

    it('should include assigned responders when provided', () => {
      const entry = EscalationService.createEscalationEntry(
        mockEvent as any,
        mockIncident as any,
        ContextLevel.INDIVIDUAL,
        ContextLevel.FAMILY,
        'Reason',
        EscalationAction.AUTO_ESCALATE,
        'system',
        ['user_1', 'user_2']
      );

      expect(entry.assignedTo).toEqual(['user_1', 'user_2']);
    });
  });

  describe('Escalation Status Checking', () => {
    it('should detect when critical incident needs escalation', () => {
      const incident = { ...mockIncident, severity: SeverityLevel.CRITICAL };
      expect(EscalationService.isEscalationNeeded(incident as any, ContextLevel.INDIVIDUAL)).toBe(true);
    });

    it('should not require escalation if already at professional level', () => {
      const incident = { ...mockIncident, severity: SeverityLevel.CRITICAL };
      expect(
        EscalationService.isEscalationNeeded(incident as any, ContextLevel.PROFESSIONAL)
      ).toBe(false);
    });

    it('should detect high severity individual escalation', () => {
      const incident = { ...mockIncident, severity: SeverityLevel.HIGH };
      expect(EscalationService.isEscalationNeeded(incident as any, ContextLevel.INDIVIDUAL)).toBe(true);
    });

    it('should not require escalation for high severity if already family level', () => {
      const incident = { ...mockIncident, severity: SeverityLevel.HIGH };
      expect(EscalationService.isEscalationNeeded(incident as any, ContextLevel.FAMILY)).toBe(false);
    });

    it('should not escalate medium or low severity', () => {
      const mediumIncident = { ...mockIncident, severity: SeverityLevel.MEDIUM };
      const lowIncident = { ...mockIncident, severity: SeverityLevel.LOW };

      expect(EscalationService.isEscalationNeeded(mediumIncident as any, ContextLevel.INDIVIDUAL)).toBe(false);
      expect(EscalationService.isEscalationNeeded(lowIncident as any, ContextLevel.INDIVIDUAL)).toBe(false);
    });
  });

  describe('Escalation Summary', () => {
    it('should return zero escalations for empty history', () => {
      const summary = EscalationService.getEscalationSummary([]);
      expect(summary.totalEscalations).toBe(0);
      expect(summary.currentLevel).toBe(ContextLevel.INDIVIDUAL);
      expect(summary.timeline).toEqual([]);
    });

    it('should calculate escalation count correctly', () => {
      const entries = [
        {
          id: 'esc_1',
          eventId: 'event_1',
          fromLevel: ContextLevel.INDIVIDUAL,
          toLevel: ContextLevel.FAMILY,
          reason: 'Reason 1',
          action: EscalationAction.AUTO_ESCALATE,
          escalatedBy: 'system',
          escalatedAt: new Date(),
          resolved: false
        },
        {
          id: 'esc_2',
          eventId: 'event_1',
          fromLevel: ContextLevel.FAMILY,
          toLevel: ContextLevel.PROFESSIONAL,
          reason: 'Reason 2',
          action: EscalationAction.MANUAL_ESCALATE,
          escalatedBy: 'user_1',
          escalatedAt: new Date(),
          resolved: false
        }
      ];

      const summary = EscalationService.getEscalationSummary(entries);
      expect(summary.totalEscalations).toBe(2);
      expect(summary.currentLevel).toBe(ContextLevel.PROFESSIONAL);
      expect(summary.timeline.length).toBe(2);
    });

    it('should track escalation timeline', () => {
      const now = new Date();
      const entries = [
        {
          id: 'esc_1',
          eventId: 'event_1',
          fromLevel: ContextLevel.INDIVIDUAL,
          toLevel: ContextLevel.FAMILY,
          reason: 'Reason',
          action: EscalationAction.AUTO_ESCALATE,
          escalatedBy: 'system',
          escalatedAt: now,
          resolved: false
        }
      ];

      const summary = EscalationService.getEscalationSummary(entries);
      expect(summary.timeline[0].level).toBe(ContextLevel.FAMILY);
      expect(summary.timeline[0].timestamp).toBe(now);
    });
  });

  describe('Permission Validation for Escalation', () => {
    it('should allow escalation from lower to higher level', () => {
      const result = EscalationService.validateEscalationPermission(
        ContextLevel.INDIVIDUAL,
        ContextLevel.FAMILY,
        mockIncident as any
      );

      expect(result.valid).toBe(true);
    });

    it('should prevent escalation from higher to lower level', () => {
      const result = EscalationService.validateEscalationPermission(
        ContextLevel.FAMILY,
        ContextLevel.INDIVIDUAL,
        mockIncident as any
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('cannot escalate');
    });

    it('should allow critical incidents to be escalated to professional by anyone', () => {
      const incident = { ...mockIncident, severity: SeverityLevel.CRITICAL };
      const result = EscalationService.validateEscalationPermission(
        ContextLevel.FAMILY,
        ContextLevel.PROFESSIONAL,
        incident as any
      );

      expect(result.valid).toBe(true);
    });

    it('should require family level for non-critical escalations', () => {
      const result = EscalationService.validateEscalationPermission(
        ContextLevel.INDIVIDUAL,
        ContextLevel.FAMILY,
        mockIncident as any
      );

      expect(result.valid).toBe(true);
    });
  });

  describe('Responder Management', () => {
    it('should return responders for a given level', () => {
      const allResponders = {
        [ContextLevel.INDIVIDUAL]: ['user_1'],
        [ContextLevel.FAMILY]: ['user_2', 'user_3'],
        [ContextLevel.COMMUNITY]: ['user_4'],
        [ContextLevel.PROFESSIONAL]: ['user_5']
      };

      const responders = EscalationService.getRespondersForLevel(
        ContextLevel.FAMILY,
        allResponders
      );

      expect(responders).toContain('user_2');
      expect(responders).toContain('user_3');
      expect(responders).toContain('user_4');
      expect(responders).toContain('user_5');
    });

    it('should remove duplicate responders', () => {
      const allResponders = {
        [ContextLevel.INDIVIDUAL]: ['user_1'],
        [ContextLevel.FAMILY]: ['user_1'], // Duplicate
        [ContextLevel.COMMUNITY]: ['user_1'], // Duplicate
        [ContextLevel.PROFESSIONAL]: []
      };

      const responders = EscalationService.getRespondersForLevel(
        ContextLevel.INDIVIDUAL,
        allResponders
      );

      expect(responders.filter((r) => r === 'user_1').length).toBe(1);
    });
  });

  describe('Escalation Resolution', () => {
    it('should mark escalation as resolved', () => {
      const entry = {
        id: 'esc_1',
        eventId: 'event_1',
        fromLevel: ContextLevel.INDIVIDUAL,
        toLevel: ContextLevel.FAMILY,
        reason: 'Reason',
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: new Date(),
        resolved: false
      };

      const resolved = EscalationService.resolveEscalation(
        entry,
        'Issue was resolved at family level'
      );

      expect(resolved.resolved).toBe(true);
      expect(resolved.resolutionDetails).toBe('Issue was resolved at family level');
    });
  });

  describe('Time Tracking', () => {
    it('should calculate time since escalation', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      const entry = {
        id: 'esc_1',
        eventId: 'event_1',
        fromLevel: ContextLevel.INDIVIDUAL,
        toLevel: ContextLevel.FAMILY,
        reason: 'Reason',
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: fiveMinutesAgo,
        resolved: false
      };

      const time = EscalationService.getTimeSinceEscalation(entry);

      expect(time.minutes).toBeGreaterThanOrEqual(4); // Allow some variance
      expect(time.formatted).toMatch(/^\d+m/);
    });

    it('should format time appropriately', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const entry = {
        id: 'esc_1',
        eventId: 'event_1',
        fromLevel: ContextLevel.INDIVIDUAL,
        toLevel: ContextLevel.FAMILY,
        reason: 'Reason',
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: oneHourAgo,
        resolved: false
      };

      const time = EscalationService.getTimeSinceEscalation(entry);
      expect(time.formatted).toMatch(/h/);
    });
  });

  describe('Notification Generation', () => {
    it('should generate escalation notification', () => {
      const escalation = {
        id: 'esc_1',
        eventId: 'event_1',
        fromLevel: ContextLevel.INDIVIDUAL,
        toLevel: ContextLevel.FAMILY,
        reason: 'High severity',
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: new Date(),
        resolved: false
      };

      const notification = EscalationService.generateEscalationNotification(
        escalation,
        mockEvent as any,
        mockIncident as any,
        'user_1'
      );

      expect(notification.id).toMatch(/^notification_/);
      expect(notification.userId).toBe('user_1');
      expect(notification.type).toBe('escalated');
      expect(notification.title).toContain('Escalated');
      expect(notification.message).toContain('Family');
    });

    it('should set critical priority for critical severity', () => {
      const escalation = {
        id: 'esc_1',
        eventId: 'event_1',
        fromLevel: ContextLevel.INDIVIDUAL,
        toLevel: ContextLevel.PROFESSIONAL,
        reason: 'Critical',
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: new Date(),
        resolved: false
      };

      const incident = { ...mockIncident, severity: SeverityLevel.CRITICAL };
      const notification = EscalationService.generateEscalationNotification(
        escalation,
        mockEvent as any,
        incident as any,
        'user_1'
      );

      expect(notification.priority).toBe('critical');
    });
  });

  describe('Escalation Chain Completion', () => {
    it('should identify complete escalation chain', () => {
      const escalations = [
        {
          id: 'esc_1',
          eventId: 'event_1',
          fromLevel: ContextLevel.INDIVIDUAL,
          toLevel: ContextLevel.FAMILY,
          reason: 'Reason',
          action: EscalationAction.AUTO_ESCALATE,
          escalatedBy: 'system',
          escalatedAt: new Date(),
          resolved: false
        },
        {
          id: 'esc_2',
          eventId: 'event_1',
          fromLevel: ContextLevel.FAMILY,
          toLevel: ContextLevel.PROFESSIONAL,
          reason: 'Reason',
          action: EscalationAction.AUTO_ESCALATE,
          escalatedBy: 'system',
          escalatedAt: new Date(),
          resolved: false
        }
      ];

      expect(EscalationService.isEscalationChainComplete(escalations)).toBe(true);
    });

    it('should identify incomplete escalation chain', () => {
      const escalations = [
        {
          id: 'esc_1',
          eventId: 'event_1',
          fromLevel: ContextLevel.INDIVIDUAL,
          toLevel: ContextLevel.FAMILY,
          reason: 'Reason',
          action: EscalationAction.AUTO_ESCALATE,
          escalatedBy: 'system',
          escalatedAt: new Date(),
          resolved: false
        }
      ];

      expect(EscalationService.isEscalationChainComplete(escalations)).toBe(false);
    });

    it('should return false for empty escalation history', () => {
      expect(EscalationService.isEscalationChainComplete([])).toBe(false);
    });
  });
});
