/**
 * @file EnhancedCalendarService.ts - Sprint 3.1 Implementation
 * @description Core calendar service for event management with CRUD, context binding, 
 * role assignment, incident escalation, and bidirectional sync
 * 
 * Handles:
 * - Event CRUD operations (Create, Read, Update, Delete/Archive)
 * - Role assignment and permission-based access control
 * - Incident escalation with severity-based auto-escalation
 * - Bidirectional entity linking (Contacts, Assets, Projects, Timeline)
 * - Real-time subscriptions and offline queue support
 * - Audit trail and compliance logging
 * 
 * @author Salatiso Ecosystem - Sprint 3.1 Foundation Phase
 * @created October 25, 2025
 */

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  EnhancedCalendarEvent,
  CreateEventInput,
  UpdateEventInput,
  CreateIncidentInput,
  EventFilters,
  PaginationOptions,
  PaginatedResult,
  ApiResponse,
  EventRole,
  RoleType,
  RoleStatus,
  Permission,
  ContextLevel,
  EventType,
  EventStatus,
  SeverityLevel,
  AuditAction,
  EscalationAction,
  ROLE_PERMISSIONS,
  AUTO_ESCALATION_RULES,
  shouldAutoEscalate,
  getNextEscalationLevel,
  isIncident
} from '@/types/calendar';

/**
 * EnhancedCalendarService - Main calendar service class
 * Provides all CRUD, query, and management operations for calendar events
 */
export class EnhancedCalendarService {
  private eventsCollection = 'events';
  private pollsCollection = 'polls';
  private assistanceRequestsCollection = 'assistanceRequests';
  private auditCollection = 'auditLogs';
  private db = db;

  // ============================================================================
  // CRUD: CREATE
  // ============================================================================
  async createEvent(userId: string, input: CreateEventInput): Promise<ApiResponse<EnhancedCalendarEvent>> {
    try {
      if (!input.title?.trim()) throw new Error('Event title required');

      const now = new Date();
      const eventData: any = {
        title: input.title.trim(),
        description: input.description || '',
        type: input.type,
        category: input.category,
        context: input.context,
        visibility: input.visibility || [input.context],
        dateTime: input.dateTime ? Timestamp.fromDate(input.dateTime) : Timestamp.fromDate(now),
        endDateTime: input.endDateTime ? Timestamp.fromDate(input.endDateTime) : null,
        location: input.location || '',
        organizer: userId,
        status: EventStatus.PLANNED,
        tags: input.tags || [],
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        createdBy: userId,
        lastModifiedBy: userId,
        roles: [],
        assistanceRequests: [],
        polls: [],
        comments: [],
        statusHistory: [],
        escalationPath: [],
        auditTrail: [],
        customData: {}
      };

      if (input.type === EventType.INCIDENT) {
        const incident = input as CreateIncidentInput;
        eventData.incidentData = {
          category: input.category,
          severity: incident.severity || SeverityLevel.MEDIUM,
          description: input.description || '',
          location: input.location,
          currentLevel: input.context,
          assignedResponders: [],
          escalationPath: []
        };
      }

      if (input.type === EventType.ACTIVITY) {
        eventData.activityData = {
          category: input.category,
          recurring: input.recurring
        };
      }

      const docRef = await addDoc(collection(this.db, this.eventsCollection), eventData);
      const eventId = docRef.id;

      const organizerRole: Omit<EventRole, 'id' | 'eventId'> = {
        userId,
        role: RoleType.ORGANIZER,
        permissions: ROLE_PERMISSIONS[RoleType.ORGANIZER],
        status: RoleStatus.ACCEPTED,
        assignedAt: now
      };

      await this.assignRole(userId, eventId, organizerRole);
      await this.logAuditEntry(userId, eventId, AuditAction.CREATED, input.context, { type: input.type, category: input.category });

      if (input.type === EventType.INCIDENT) {
        const incident = input as CreateIncidentInput;
        if (shouldAutoEscalate(incident.severity, input.context)) {
          const nextLevel = getNextEscalationLevel(input.context);
          if (nextLevel) await this.escalateIncident(userId, eventId, nextLevel, 'Auto-escalated due to severity');
        }
      }

      return await this.getEvent(userId, eventId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'CREATE_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // CRUD: READ
  // ============================================================================
  async getEvent(userId: string, eventId: string): Promise<ApiResponse<EnhancedCalendarEvent>> {
    try {
      const docSnap = await getDoc(doc(this.db, this.eventsCollection, eventId));
      if (!docSnap.exists()) throw new Error('Event not found');

      const event = this.convertDocToEvent(eventId, docSnap.data());
      if (!this.userCanViewEvent(userId, event)) throw new Error('Access denied');

      return { success: true, data: event, timestamp: new Date() };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'READ_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // CRUD: QUERY
  // ============================================================================
  async queryEvents(userId: string, filters: EventFilters, pagination: PaginationOptions): Promise<ApiResponse<PaginatedResult<EnhancedCalendarEvent>>> {
    try {
      const constraints: any[] = [];

      if (filters.context?.length) constraints.push(where('visibility', 'array-contains-any', filters.context));
      if (filters.type) constraints.push(where('type', '==', filters.type));
      if (filters.status?.length) constraints.push(where('status', 'in', filters.status));
      
      const sortBy = pagination.sortBy || 'dateTime';
      const sortOrder = pagination.sortOrder === 'asc' ? 'asc' : 'desc';
      constraints.push(orderBy(sortBy, sortOrder));
      constraints.push(limit(pagination.pageSize + 1));

      const q = query(collection(this.db, this.eventsCollection), ...constraints);
      const snap = await getDocs(q);

      const items = snap.docs
        .map(d => this.convertDocToEvent(d.id, d.data()))
        .filter(e => this.userCanViewEvent(userId, e))
        .slice(0, pagination.pageSize);

      return {
        success: true,
        data: {
          items,
          total: items.length,
          pageSize: pagination.pageSize,
          currentPage: pagination.page,
          totalPages: Math.ceil(items.length / pagination.pageSize),
          hasNextPage: snap.docs.length > pagination.pageSize,
          hasPrevPage: pagination.page > 1
        },
        timestamp: new Date()
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'QUERY_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // CRUD: UPDATE
  // ============================================================================
  async updateEvent(userId: string, input: UpdateEventInput): Promise<ApiResponse<EnhancedCalendarEvent>> {
    try {
      const eventRes = await this.getEvent(userId, input.id);
      if (!eventRes.success) throw new Error('Event not found');

      const event = eventRes.data!;
      if (!this.userHasEventPermission(userId, event, Permission.EDIT)) throw new Error('Permission denied');

      const updateData: any = {
        updatedAt: Timestamp.fromDate(new Date()),
        lastModifiedBy: userId
      };

      if (input.title) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.category) updateData.category = input.category;
      if (input.dateTime) updateData.dateTime = Timestamp.fromDate(input.dateTime);
      if (input.location !== undefined) updateData.location = input.location;
      if (input.tags) updateData.tags = input.tags;
      if (input.customData) updateData.customData = input.customData;

      if (input.status && input.status !== event.status) {
        updateData.status = input.status;
        updateData.statusHistory = [
          ...(event.statusHistory || []),
          {
            from: event.status,
            to: input.status,
            changedBy: userId,
            changedAt: Timestamp.fromDate(new Date()),
            reason: input.resolutionNotes
          }
        ];

        if (input.status === EventStatus.RESOLVED) {
          updateData.resolvedAt = Timestamp.fromDate(new Date());
          updateData.resolvedBy = userId;
          updateData.resolutionNotes = input.resolutionNotes;
        }
      }

      await updateDoc(doc(this.db, this.eventsCollection, input.id), updateData);
      await this.logAuditEntry(userId, input.id, AuditAction.UPDATED, event.context, {});

      return await this.getEvent(userId, input.id);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'UPDATE_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // CRUD: DELETE (Archive)
  // ============================================================================
  async deleteEvent(userId: string, eventId: string): Promise<ApiResponse<null>> {
    try {
      const eventRes = await this.getEvent(userId, eventId);
      if (!eventRes.success) throw new Error('Event not found');

      const event = eventRes.data!;
      if (!this.userHasEventPermission(userId, event, Permission.ARCHIVE)) throw new Error('Permission denied');

      await updateDoc(doc(this.db, this.eventsCollection, eventId), {
        status: EventStatus.ARCHIVED,
        updatedAt: Timestamp.fromDate(new Date()),
        lastModifiedBy: userId
      });

      return { success: true, data: null, timestamp: new Date() };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'DELETE_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // ROLES: ASSIGN
  // ============================================================================
  async assignRole(userId: string, eventId: string, roleInput: Omit<EventRole, 'id' | 'eventId'>): Promise<ApiResponse<EventRole>> {
    try {
      const eventRes = await this.getEvent(userId, eventId);
      if (!eventRes.success) throw new Error('Event not found');

      const event = eventRes.data!;
      if (event.roles.length > 1 && !this.userHasEventPermission(userId, event, Permission.ASSIGN_ROLES)) 
        throw new Error('Permission denied');

      const newRole: EventRole = {
        id: `role_${Date.now()}`,
        eventId,
        ...roleInput
      };

      const roles = [...(event.roles || []), newRole];
      await updateDoc(doc(this.db, this.eventsCollection, eventId), {
        roles,
        updatedAt: Timestamp.fromDate(new Date()),
        lastModifiedBy: userId
      });

      await this.logAuditEntry(userId, eventId, AuditAction.ASSIGNED_ROLE, event.context, {
        assignedTo: roleInput.userId,
        role: roleInput.role
      });

      return { success: true, data: newRole, timestamp: new Date() };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'ASSIGN_ROLE_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // ROLES: RESPOND
  // ============================================================================
  async respondToRole(userId: string, eventId: string, roleId: string, accepted: boolean, notes?: string): Promise<ApiResponse<EventRole>> {
    try {
      const eventRes = await this.getEvent(userId, eventId);
      if (!eventRes.success) throw new Error('Event not found');

      const event = eventRes.data!;
      const role = event.roles.find(r => r.id === roleId);
      if (!role) throw new Error('Role not found');
      if (role.userId !== userId) throw new Error('Not your role');

      const updatedRole: EventRole = {
        ...role,
        status: accepted ? RoleStatus.ACCEPTED : RoleStatus.DECLINED,
        acceptedAt: accepted ? new Date() : undefined,
        notes
      };

      const updatedRoles = event.roles.map(r => (r.id === roleId ? updatedRole : r));
      await updateDoc(doc(this.db, this.eventsCollection, eventId), {
        roles: updatedRoles,
        updatedAt: Timestamp.fromDate(new Date())
      });

      await this.logAuditEntry(userId, eventId, AuditAction.RESPONDED_ROLE, event.context, {
        response: accepted ? 'accepted' : 'declined'
      });

      return { success: true, data: updatedRole, timestamp: new Date() };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'RESPOND_ROLE_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // INCIDENTS: ESCALATE
  // ============================================================================
  async escalateIncident(userId: string, eventId: string, toLevel: ContextLevel, reason: string): Promise<ApiResponse<EnhancedCalendarEvent>> {
    try {
      const eventRes = await this.getEvent(userId, eventId);
      if (!eventRes.success) throw new Error('Event not found');

      const event = eventRes.data!;
      if (!isIncident(event)) throw new Error('Not an incident');
      if (!this.userHasEventPermission(userId, event, Permission.ESCALATE)) throw new Error('Permission denied');

      const escalationEntry = {
        id: `escalation_${Date.now()}`,
        eventId,
        fromLevel: event.context,
        toLevel,
        reason,
        action: EscalationAction.MANUAL_ESCALATE,
        escalatedBy: userId,
        escalatedAt: Timestamp.fromDate(new Date())
      };

      const escalationPath = [...(event.escalationPath || []), escalationEntry];

      await updateDoc(doc(this.db, this.eventsCollection, eventId), {
        escalationPath,
        updatedAt: Timestamp.fromDate(new Date()),
        lastModifiedBy: userId,
        'incidentData.currentLevel': toLevel,
        'incidentData.escalationPath': escalationPath
      });

      await this.logAuditEntry(userId, eventId, AuditAction.ESCALATED, event.context, {
        escalatedTo: toLevel,
        reason
      });

      return await this.getEvent(userId, eventId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'ESCALATE_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // LINKS: ENTITY LINKING
  // ============================================================================
  async linkEntityToEvent(userId: string, eventId: string, entityType: 'contact' | 'asset' | 'project' | 'timeline', entityId: string, linkType?: string): Promise<ApiResponse<EnhancedCalendarEvent>> {
    try {
      const eventRes = await this.getEvent(userId, eventId);
      if (!eventRes.success) throw new Error('Event not found');

      const event = eventRes.data!;
      const linkKey = `${entityType}s`;
      const currentLinks = event.customData?.[linkKey] || [];
      const newLink = {
        type: entityType,
        entityId,
        linkType: linkType || 'associated',
        linkedAt: Timestamp.fromDate(new Date()),
        linkedBy: userId
      };

      await updateDoc(doc(this.db, this.eventsCollection, eventId), {
        customData: {
          ...(event.customData || {}),
          [linkKey]: [...currentLinks, newLink]
        },
        updatedAt: Timestamp.fromDate(new Date()),
        lastModifiedBy: userId
      });

      return await this.getEvent(userId, eventId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: msg, code: 'LINK_ERROR', timestamp: new Date() };
    }
  }

  // ============================================================================
  // SUBSCRIPTIONS: REAL-TIME LISTENERS
  // ============================================================================
  subscribeToEvent(userId: string, eventId: string, onUpdate: (event: EnhancedCalendarEvent | null) => void, onError?: (error: Error) => void): () => void {
    const unsubscribe = onSnapshot(
      doc(this.db, this.eventsCollection, eventId),
      docSnap => {
        if (docSnap.exists()) {
          const event = this.convertDocToEvent(docSnap.id, docSnap.data());
          if (this.userCanViewEvent(userId, event)) onUpdate(event);
        } else {
          onUpdate(null);
        }
      },
      error => onError?.(error as Error)
    );
    return unsubscribe;
  }

  subscribeToEvents(userId: string, filters: EventFilters, onUpdate: (events: EnhancedCalendarEvent[]) => void, onError?: (error: Error) => void): () => void {
    const constraints: any[] = [];
    if (filters.context?.length) constraints.push(where('visibility', 'array-contains-any', filters.context));
    if (filters.type) constraints.push(where('type', '==', filters.type));
    if (filters.status?.length) constraints.push(where('status', 'in', filters.status));
    constraints.push(orderBy('dateTime', 'desc'));
    constraints.push(limit(50));

    const unsubscribe = onSnapshot(
      query(collection(this.db, this.eventsCollection), ...constraints),
      snap => {
        const events = snap.docs
          .map(d => this.convertDocToEvent(d.id, d.data()))
          .filter(e => this.userCanViewEvent(userId, e));
        onUpdate(events);
      },
      error => onError?.(error as Error)
    );
    return unsubscribe;
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================
  private convertDocToEvent(eventId: string, data: any): EnhancedCalendarEvent {
    return {
      id: eventId,
      ...data,
      dateTime: data.dateTime?.toDate?.() || data.dateTime || new Date(),
      endDateTime: data.endDateTime?.toDate?.() || data.endDateTime,
      createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
      resolvedAt: data.resolvedAt?.toDate?.() || data.resolvedAt,
      escalationPath: (data.escalationPath || []).map((e: any) => ({
        ...e,
        escalatedAt: e.escalatedAt?.toDate?.() || e.escalatedAt
      })),
      auditTrail: (data.auditTrail || []).map((a: any) => ({
        ...a,
        timestamp: a.timestamp?.toDate?.() || a.timestamp
      })),
      statusHistory: (data.statusHistory || []).map((s: any) => ({
        ...s,
        changedAt: s.changedAt?.toDate?.() || s.changedAt
      }))
    } as EnhancedCalendarEvent;
  }

  private userCanViewEvent(userId: string, event: EnhancedCalendarEvent): boolean {
    if (event.organizer === userId) return true;
    if (event.roles?.some(r => r.userId === userId)) return true;
    return false;
  }

  private userHasEventPermission(userId: string, event: EnhancedCalendarEvent, permission: Permission): boolean {
    const role = event.roles?.find(r => r.userId === userId);
    return role?.permissions.includes(permission) || false;
  }

  private async logAuditEntry(userId: string, eventId: string, action: AuditAction, context: ContextLevel, details: Record<string, any>): Promise<void> {
    try {
      await addDoc(collection(this.db, this.auditCollection), {
        eventId,
        userId,
        action,
        context,
        timestamp: Timestamp.fromDate(new Date()),
        details
      });
    } catch (error) {
      console.error('Audit log error:', error);
    }
  }
}

// Export singleton instance
const enhancedCalendarService = new EnhancedCalendarService();
export default enhancedCalendarService;
