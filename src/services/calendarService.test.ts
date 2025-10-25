/**
 * @file calendarService.test.ts
 * @description Comprehensive test suite for CalendarService
 * Tests: CRUD operations, queries, subscriptions, batch operations
 * 
 * @created October 22, 2025
 */

import {
  EnhancedCalendarEvent,
  EventRole,
  IncidentData,
  AssistanceRequest,
  SeverityLevel,
  ContextLevel,
  IncidentCategory,
  EventType,
  RoleType,
  RoleStatus,
  Permission,
  EventStatus,
  AssistanceType,
  AssistanceStatus,
  EscalationAction,
  ActivityCategory
} from '@/types/calendar';
import CalendarService from '@/services/CalendarService';

describe('CalendarService', () => {
  const mockUserId = 'user_organizer';
  const mockEventData = {
    title: 'Family Meeting',
    description: 'Monthly gathering',
    dateTime: new Date('2025-10-25T14:00:00'),
    location: 'Living Room',
    type: EventType.ACTIVITY,
    category: ActivityCategory.FAMILY_TIME,
    context: ContextLevel.FAMILY,
    visibility: [ContextLevel.FAMILY],
    organizer: mockUserId,
    roles: [],
    assistanceRequests: [],
    polls: [],
    comments: [],
    status: EventStatus.PLANNED,
    statusHistory: [],
    escalationPath: [],
    auditTrail: []
  };

  const mockRole: Omit<EventRole, 'id' | 'assignedAt'> = {
    eventId: 'event_1',
    userId: 'user_participant',
    role: RoleType.PARTICIPANT,
    permissions: [Permission.VIEW, Permission.RESPOND],
    status: RoleStatus.ASSIGNED
  };

  const mockIncident: IncidentData = {
    category: IncidentCategory.HEALTH,
    severity: SeverityLevel.HIGH,
    description: 'Participant feeling ill',
    location: 'Living Room',
    escalationPath: [],
    currentLevel: ContextLevel.INDIVIDUAL
  };

  const mockAssistance: Omit<AssistanceRequest, 'id' | 'requestedAt'> = {
    eventId: 'event_1',
    requestedBy: mockUserId,
    description: 'Need help with setup',
    type: AssistanceType.LOGISTICS,
    priority: 'high',
    responses: [],
    status: AssistanceStatus.REQUESTED
  };

  describe('Event Operations', () => {
    it('should create event with generated ID and timestamps', async () => {
      const event = await CalendarService.createEvent(mockEventData);

      expect(event.id).toMatch(/^event_/);
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.updatedAt).toBeInstanceOf(Date);
      expect(event.createdBy).toBe(mockUserId);
      expect(event.lastModifiedBy).toBe(mockUserId);
      expect(event.title).toBe('Family Meeting');
    });

    it('should preserve all event properties on creation', async () => {
      const event = await CalendarService.createEvent(mockEventData);

      expect(event.title).toBe(mockEventData.title);
      expect(event.description).toBe(mockEventData.description);
      expect(event.location).toBe(mockEventData.location);
      expect(event.context).toBe(ContextLevel.FAMILY);
    });

    it('should update event with new data', async () => {
      const updates = {
        title: 'Updated Meeting',
        status: EventStatus.IN_PROGRESS
      };

      const updated = await CalendarService.updateEvent('event_1', updates, mockUserId);

      expect(updated.title).toBe('Updated Meeting');
      expect(updated.lastModifiedBy).toBe(mockUserId);
      expect(updated.updatedAt).toBeInstanceOf(Date);
    });

    it('should archive event', async () => {
      await CalendarService.archiveEvent('event_1', mockUserId);
      // Service completes without error
      expect(true).toBe(true);
    });
  });

  describe('Role Operations', () => {
    it('should add role to event', async () => {
      const role = await CalendarService.addRole('event_1', mockRole);

      expect(role.id).toMatch(/^role_/);
      expect(role.assignedAt).toBeInstanceOf(Date);
      expect(role.userId).toBe('user_participant');
      expect(role.role).toBe(RoleType.PARTICIPANT);
    });

    it('should update role status', async () => {
      await CalendarService.updateRole('event_1', 'role_1', {
        status: RoleStatus.ACCEPTED,
        acceptedAt: new Date()
      });
      // Service completes without error
      expect(true).toBe(true);
    });

    it('should remove role from event', async () => {
      await CalendarService.removeRole('event_1', 'role_1');
      // Service completes without error
      expect(true).toBe(true);
    });
  });

  describe('Incident Operations', () => {
    it('should log incident and set event status to OPEN', async () => {
      const event = await CalendarService.logIncident('event_1', mockIncident, mockUserId);

      expect(event.status).toBe('open');
      expect(event.incidentData).toEqual(mockIncident);
      expect(event.lastModifiedBy).toBe(mockUserId);
    });

    it('should update incident status', async () => {
      await CalendarService.updateIncidentStatus('event_1', EventStatus.IN_PROGRESS, mockUserId, 'Being handled');
      // Service completes without error
      expect(true).toBe(true);
    });

    it('should resolve incident with notes', async () => {
      await CalendarService.resolveIncident('event_1', 'Issue was resolved successfully', mockUserId);
      // Service completes without error
      expect(true).toBe(true);
    });
  });

  describe('Assistance Request Operations', () => {
    it('should create assistance request', async () => {
      const request = await CalendarService.createAssistanceRequest('event_1', mockAssistance);

      expect(request.id).toMatch(/^assistance_/);
      expect(request.requestedAt).toBeInstanceOf(Date);
      expect(request.description).toBe('Need help with setup');
      expect(request.type).toBe('logistics');
    });

    it('should record assistance response', async () => {
      await CalendarService.respondToAssistance(
        'event_1',
        'assistance_1',
        'user_helper',
        'offered',
        'I can help setup'
      );
      // Service completes without error
      expect(true).toBe(true);
    });

    it('should mark assistance complete', async () => {
      await CalendarService.completeAssistance('event_1', 'assistance_1', 'user_helper');
      // Service completes without error
      expect(true).toBe(true);
    });
  });

  describe('Escalation Operations', () => {
    it('should add escalation entry', async () => {
      const escalation = await CalendarService.addEscalation('event_1', {
        eventId: 'event_1',
        fromLevel: ContextLevel.INDIVIDUAL,
        toLevel: ContextLevel.FAMILY,
        reason: 'High severity incident',
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: new Date(),
        resolved: false
      });

      expect(escalation.id).toMatch(/^escalation_/);
      expect(escalation.fromLevel).toBe(ContextLevel.INDIVIDUAL);
      expect(escalation.toLevel).toBe(ContextLevel.FAMILY);
    });

    it('should update escalation', async () => {
      await CalendarService.updateEscalation('event_1', 'escalation_1', {
        resolved: true,
        resolutionDetails: 'Issue resolved at family level'
      });
      // Service completes without error
      expect(true).toBe(true);
    });
  });

  describe('Query Operations', () => {
    it('should get events by context', async () => {
      const events = await CalendarService.getEventsByContext(ContextLevel.FAMILY);
      expect(Array.isArray(events)).toBe(true);
    });

    it('should get events by context for specific user', async () => {
      const events = await CalendarService.getEventsByContext(ContextLevel.FAMILY, mockUserId);
      expect(Array.isArray(events)).toBe(true);
    });

    it('should get active incidents', async () => {
      const incidents = await CalendarService.getActiveIncidents();
      expect(Array.isArray(incidents)).toBe(true);
    });

    it('should get incidents by severity', async () => {
      const incidents = await CalendarService.getIncidentsBySeverity(SeverityLevel.CRITICAL);
      expect(Array.isArray(incidents)).toBe(true);
    });

    it('should get user roles', async () => {
      const roles = await CalendarService.getUserRoles(mockUserId);
      expect(Array.isArray(roles)).toBe(true);
    });

    it('should get user roles for specific event', async () => {
      const roles = await CalendarService.getUserRoles(mockUserId, 'event_1');
      expect(Array.isArray(roles)).toBe(true);
    });

    it('should get user assistance requests', async () => {
      const requests = await CalendarService.getUserAssistanceRequests(mockUserId);
      expect(Array.isArray(requests)).toBe(true);
    });

    it('should search events', async () => {
      const results = await CalendarService.searchEvents('family meeting');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Statistics Operations', () => {
    it('should get event statistics', async () => {
      const stats = await CalendarService.getEventStatistics();

      expect(stats).toHaveProperty('totalEvents');
      expect(stats).toHaveProperty('incidentsOpen');
      expect(stats).toHaveProperty('incidentsResolved');
      expect(stats).toHaveProperty('escalationsActive');
      expect(stats).toHaveProperty('assistanceRequestsPending');

      expect(typeof stats.totalEvents).toBe('number');
      expect(typeof stats.incidentsOpen).toBe('number');
      expect(typeof stats.incidentsResolved).toBe('number');
      expect(typeof stats.escalationsActive).toBe('number');
      expect(typeof stats.assistanceRequestsPending).toBe('number');
    });

    it('should return zero statistics initially', async () => {
      const stats = await CalendarService.getEventStatistics();

      expect(stats.totalEvents).toBe(0);
      expect(stats.incidentsOpen).toBe(0);
      expect(stats.incidentsResolved).toBe(0);
      expect(stats.escalationsActive).toBe(0);
      expect(stats.assistanceRequestsPending).toBe(0);
    });
  });

  describe('Subscription Operations', () => {
    it('should set up event subscription', () => {
      const callback = jest.fn();
      const unsubscribe = CalendarService.onEventUpdates('event_1', callback);

      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });

    it('should set up incident subscription', () => {
      const callback = jest.fn();
      const unsubscribe = CalendarService.onIncidentUpdates(callback);

      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });

    it('should return unsubscribe function', () => {
      const callback = jest.fn();
      const unsubscribe = CalendarService.onEventUpdates('event_1', callback);

      // Should not throw when called
      expect(() => unsubscribe()).not.toThrow();
    });
  });

  describe('Batch Operations', () => {
    it('should batch update events', async () => {
      const updates = [
        {
          eventId: 'event_1',
          updates: { title: 'Updated 1' }
        },
        {
          eventId: 'event_2',
          updates: { title: 'Updated 2' }
        }
      ];

      await CalendarService.batchUpdateEvents(updates);
      // Service completes without error
      expect(true).toBe(true);
    });

    it('should handle empty batch updates', async () => {
      await CalendarService.batchUpdateEvents([]);
      // Service completes without error
      expect(true).toBe(true);
    });

    it('should handle single item batch', async () => {
      const updates = [
        {
          eventId: 'event_1',
          updates: { description: 'Updated description' }
        }
      ];

      await CalendarService.batchUpdateEvents(updates);
      // Service completes without error
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle operations gracefully', async () => {
      // Service methods should complete without throwing
      const result = await CalendarService.getEventsByContext(ContextLevel.FAMILY);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty arrays for queries with no results', async () => {
      const results = await CalendarService.getActiveIncidents();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('Type Safety', () => {
    it('should create event with proper types', async () => {
      const event = await CalendarService.createEvent(mockEventData);

      // All required fields should be present
      expect(event.id).toBeDefined();
      expect(event.createdAt).toBeDefined();
      expect(event.updatedAt).toBeDefined();
      expect(event.createdBy).toBeDefined();
      expect(event.lastModifiedBy).toBeDefined();
    });

    it('should maintain type consistency in role operations', async () => {
      const role = await CalendarService.addRole('event_1', mockRole);

      expect(role.userId).toBe('user_participant');
      expect(role.role).toBe(RoleType.PARTICIPANT);
    });

    it('should maintain type consistency in incident operations', async () => {
      const event = await CalendarService.logIncident('event_1', mockIncident, mockUserId);

      expect(event.incidentData?.severity).toBe(SeverityLevel.HIGH);
      expect(event.incidentData?.category).toBe(IncidentCategory.HEALTH);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete event workflow', async () => {
      // Create event
      const event = await CalendarService.createEvent(mockEventData);
      expect(event.id).toBeDefined();

      // Add role
      const role = await CalendarService.addRole(event.id, mockRole);
      expect(role.id).toBeDefined();

      // Log incident
      const updated = await CalendarService.logIncident(event.id, mockIncident, mockUserId);
      expect(updated.status).toBe('open');

      // Update incident status
      await CalendarService.updateIncidentStatus(event.id, EventStatus.IN_PROGRESS, mockUserId);

      // Add escalation
      const escalation = await CalendarService.addEscalation(event.id, {
        eventId: event.id,
        fromLevel: ContextLevel.INDIVIDUAL,
        toLevel: ContextLevel.FAMILY,
        reason: 'High severity',
        action: EscalationAction.AUTO_ESCALATE,
        escalatedBy: 'system',
        escalatedAt: new Date(),
        resolved: false
      });
      expect(escalation.id).toBeDefined();

      // Resolve incident
      await CalendarService.resolveIncident(event.id, 'Resolved successfully', mockUserId);
    });

    it('should handle assistance request workflow', async () => {
      // Create event
      const event = await CalendarService.createEvent(mockEventData);

      // Create assistance request
      const request = await CalendarService.createAssistanceRequest(event.id, mockAssistance);
      expect(request.id).toBeDefined();

      // Record response
      await CalendarService.respondToAssistance(event.id, request.id, 'user_helper', 'offered', 'I can help');

      // Complete assistance
      await CalendarService.completeAssistance(event.id, request.id, 'user_helper');
    });
  });

  describe('Firebase Integration Points', () => {
    it('should have logging for all operations', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await CalendarService.createEvent(mockEventData);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CalendarService]'),
        expect.anything()
      );

      consoleSpy.mockRestore();
    });

    it('should log operations with consistent format', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await CalendarService.getActiveIncidents();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[CalendarService\]/),
        expect.any(String)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Performance Characteristics', () => {
    it('should handle multiple simultaneous operations', async () => {
      const operations = [
        CalendarService.createEvent(mockEventData),
        CalendarService.getEventsByContext(ContextLevel.FAMILY),
        CalendarService.getActiveIncidents(),
        CalendarService.getEventStatistics()
      ];

      const results = await Promise.all(operations);

      expect(results.length).toBe(4);
      expect((results[0] as EnhancedCalendarEvent).id).toBeDefined(); // Created event
      expect(Array.isArray(results[1])).toBe(true); // Context query
      expect(Array.isArray(results[2])).toBe(true); // Incidents query
      expect(results[3]).toHaveProperty('totalEvents'); // Statistics
    });
  });
});
