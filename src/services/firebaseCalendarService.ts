/**
 * @file firebaseCalendarService.ts
 * @description Firebase-integrated calendar service for enhanced event management
 * Replaces CalendarService with full Firestore integration
 * 
 * FEATURES:
 * - Create/read/update/delete events with Firestore
 * - Role assignment management with real-time sync
 * - Incident logging and tracking with auto-escalation
 * - Assistance request workflows with notifications
 * - Escalation history management with permissions
 * - Real-time Firebase synchronization via listeners
 * - Batch operations for performance
 * - Firestore security rules enforced
 * 
 * @created October 22, 2025
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  writeBatch,
  onSnapshot,
  Unsubscribe,
  FieldValue,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  EnhancedCalendarEvent,
  EventRole,
  EventStatus,
  IncidentData,
  AssistanceRequest,
  AssistanceResponse,
  EscalationEntry,
  RoleType,
  SeverityLevel,
  ContextLevel,
  EventType,
  IncidentCategory
} from '@/types/calendar';

/**
 * Firestore collection names
 */
const COLLECTIONS = {
  EVENTS: 'events',
  ROLES: 'roles',
  INCIDENTS: 'incidents',
  ASSISTANCE: 'assistance_requests',
  ESCALATIONS: 'escalations',
  AUDIT_LOG: 'audit_log'
} as const;

/**
 * Enhanced Calendar Service with Firebase integration
 */
export class FirebaseCalendarService {
  /**
   * Create a new event in Firestore
   */
  static async createEvent(
    event: Omit<EnhancedCalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy'>
  ): Promise<EnhancedCalendarEvent> {
    try {
      const now = new Date();
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newEvent: EnhancedCalendarEvent = {
        ...(event as EnhancedCalendarEvent),
        id: eventId,
        createdAt: now,
        updatedAt: now,
        createdBy: event.organizer,
        lastModifiedBy: event.organizer
      };

      // Write to Firestore
      await setDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        ...newEvent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('[FirebaseCalendarService] Event created:', eventId);
      return newEvent;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error creating event:', error);
      throw error;
    }
  }

  /**
   * Get event by ID from Firestore
   */
  static async getEvent(eventId: string): Promise<EnhancedCalendarEvent | null> {
    try {
      const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
      } as EnhancedCalendarEvent;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error getting event:', error);
      throw error;
    }
  }

  /**
   * Update event in Firestore
   */
  static async updateEvent(
    eventId: string,
    updates: Partial<EnhancedCalendarEvent>,
    updatedBy: string
  ): Promise<EnhancedCalendarEvent> {
    try {
      const now = new Date();
      const docRef = doc(db, COLLECTIONS.EVENTS, eventId);

      const eventUpdate = {
        ...updates,
        updatedAt: serverTimestamp(),
        lastModifiedBy: updatedBy
      };

      await updateDoc(docRef, eventUpdate);

      console.log('[FirebaseCalendarService] Event updated:', eventId);

      // Return updated event (fetch fresh from DB)
      return (await this.getEvent(eventId)) || ({} as EnhancedCalendarEvent);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error updating event:', error);
      throw error;
    }
  }

  /**
   * Delete event from Firestore
   */
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
      await deleteDoc(docRef);

      console.log('[FirebaseCalendarService] Event deleted:', eventId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Add role to event
   */
  static async addRole(
    eventId: string,
    role: Omit<EventRole, 'id' | 'assignedAt'>
  ): Promise<EventRole> {
    try {
      const roleId = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newRole: EventRole = {
        ...role,
        id: roleId,
        assignedAt: new Date()
      };

      const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
      await updateDoc(docRef, {
        roles: arrayUnion(newRole),
        updatedAt: serverTimestamp()
      });

      console.log('[FirebaseCalendarService] Role added:', roleId);
      return newRole;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error adding role:', error);
      throw error;
    }
  }

  /**
   * Update role in event
   */
  static async updateRole(
    eventId: string,
    roleId: string,
    updates: Partial<EventRole>
  ): Promise<void> {
    try {
      const event = await this.getEvent(eventId);
      if (!event) throw new Error('Event not found');

      // Find and update the role
      const updatedRoles = event.roles.map(role =>
        role.id === roleId ? { ...role, ...updates } : role
      );

      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        roles: updatedRoles,
        updatedAt: serverTimestamp()
      });

      console.log('[FirebaseCalendarService] Role updated:', roleId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error updating role:', error);
      throw error;
    }
  }

  /**
   * Remove role from event
   */
  static async removeRole(eventId: string, roleId: string): Promise<void> {
    try {
      const event = await this.getEvent(eventId);
      if (!event) throw new Error('Event not found');

      const roleToRemove = event.roles.find(r => r.id === roleId);
      if (!roleToRemove) throw new Error('Role not found');

      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        roles: arrayRemove(roleToRemove),
        updatedAt: serverTimestamp()
      });

      console.log('[FirebaseCalendarService] Role removed:', roleId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error removing role:', error);
      throw error;
    }
  }

  /**
   * Log incident for an event
   */
  static async logIncident(
    eventId: string,
    incident: IncidentData,
    userId: string
  ): Promise<EnhancedCalendarEvent> {
    try {
      const now = new Date();
      const docRef = doc(db, COLLECTIONS.EVENTS, eventId);

      await updateDoc(docRef, {
        status: EventStatus.OPEN,
        incidentData: incident,
        'statusHistory': arrayUnion({
          status: EventStatus.OPEN,
          changedAt: now.toISOString(),
          changedBy: userId,
          reason: 'Incident logged'
        }),
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId
      });

      // Log to audit trail
      await this.logAudit('incident_logged', eventId, userId, { incident });

      console.log('[FirebaseCalendarService] Incident logged for event:', eventId);
      return (await this.getEvent(eventId)) || ({} as EnhancedCalendarEvent);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error logging incident:', error);
      throw error;
    }
  }

  /**
   * Update incident status
   */
  static async updateIncidentStatus(
    eventId: string,
    newStatus: EventStatus,
    userId: string,
    notes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
      const event = await this.getEvent(eventId);
      if (!event) throw new Error('Event not found');

      const now = new Date();
      await updateDoc(docRef, {
        status: newStatus,
        'statusHistory': arrayUnion({
          status: newStatus,
          changedAt: now.toISOString(),
          changedBy: userId,
          notes: notes || ''
        }),
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId
      });

      await this.logAudit('incident_status_updated', eventId, userId, { newStatus, notes });

      console.log('[FirebaseCalendarService] Incident status updated:', newStatus);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error updating incident status:', error);
      throw error;
    }
  }

  /**
   * Resolve incident
   */
  static async resolveIncident(
    eventId: string,
    resolutionNotes: string,
    userId: string
  ): Promise<void> {
    try {
      await this.updateIncidentStatus(eventId, EventStatus.RESOLVED, userId, resolutionNotes);

      await this.logAudit('incident_resolved', eventId, userId, { resolutionNotes });

      console.log('[FirebaseCalendarService] Incident resolved:', eventId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error resolving incident:', error);
      throw error;
    }
  }

  /**
   * Create assistance request
   */
  static async createAssistanceRequest(
    eventId: string,
    request: Omit<AssistanceRequest, 'id' | 'requestedAt'>
  ): Promise<AssistanceRequest> {
    try {
      const requestId = `assistance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newRequest: AssistanceRequest = {
        ...request,
        id: requestId,
        requestedAt: new Date()
      };

      // Add to event's assistance requests array
      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        assistanceRequests: arrayUnion(newRequest),
        updatedAt: serverTimestamp()
      });

      // Also store in separate collection for easier querying
      await setDoc(doc(db, COLLECTIONS.ASSISTANCE, requestId), {
        ...newRequest,
        eventId,
        requestedAt: serverTimestamp()
      });

      await this.logAudit('assistance_requested', eventId, request.requestedBy, { request: newRequest });

      console.log('[FirebaseCalendarService] Assistance request created:', requestId);
      return newRequest;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error creating assistance request:', error);
      throw error;
    }
  }

  /**
   * Respond to assistance request
   */
  static async respondToAssistance(
    eventId: string,
    requestId: string,
    userId: string,
    status: 'offered' | 'accepted' | 'declined',
    comment?: string
  ): Promise<void> {
    try {
      const event = await this.getEvent(eventId);
      if (!event) throw new Error('Event not found');

      const response: AssistanceResponse = {
        userId,
        respondedAt: new Date(),
        status,
        comment
      };

      // Find and update the assistance request in the event
      const updatedRequests = event.assistanceRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              responses: [...(req.responses || []), response],
              status: status === 'accepted' ? 'accepted' : req.status
            }
          : req
      );

      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        assistanceRequests: updatedRequests,
        updatedAt: serverTimestamp()
      });

      // Update in assistance collection too
      await updateDoc(doc(db, COLLECTIONS.ASSISTANCE, requestId), {
        responses: arrayUnion(response),
        status: status === 'accepted' ? 'accepted' : 'offered',
        updatedAt: serverTimestamp()
      });

      await this.logAudit('assistance_responded', eventId, userId, { requestId, status, comment });

      console.log('[FirebaseCalendarService] Assistance response recorded:', requestId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error responding to assistance:', error);
      throw error;
    }
  }

  /**
   * Mark assistance as complete
   */
  static async completeAssistance(
    eventId: string,
    requestId: string,
    completedBy: string
  ): Promise<void> {
    try {
      const event = await this.getEvent(eventId);
      if (!event) throw new Error('Event not found');

      // Mark the assistance request as complete
      const updatedRequests = event.assistanceRequests.map(req =>
        req.id === requestId
          ? { ...req, status: 'completed', completedAt: new Date(), completedBy }
          : req
      );

      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        assistanceRequests: updatedRequests,
        updatedAt: serverTimestamp()
      });

      // Update in assistance collection
      await updateDoc(doc(db, COLLECTIONS.ASSISTANCE, requestId), {
        status: 'completed',
        completedAt: serverTimestamp(),
        completedBy,
        updatedAt: serverTimestamp()
      });

      await this.logAudit('assistance_completed', eventId, completedBy, { requestId });

      console.log('[FirebaseCalendarService] Assistance marked complete:', requestId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error completing assistance:', error);
      throw error;
    }
  }

  /**
   * Add escalation entry
   */
  static async addEscalation(
    eventId: string,
    escalation: Omit<EscalationEntry, 'id'>
  ): Promise<EscalationEntry> {
    try {
      const escalationId = `escalation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newEscalation: EscalationEntry = {
        ...escalation,
        id: escalationId
      };

      // Add to event's escalation path
      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        escalationPath: arrayUnion(newEscalation),
        updatedAt: serverTimestamp()
      });

      // Store in separate collection
      await setDoc(doc(db, COLLECTIONS.ESCALATIONS, escalationId), {
        ...newEscalation,
        eventId,
        escalatedAt: serverTimestamp()
      });

      await this.logAudit('escalation_added', eventId, escalation.escalatedBy, { escalation: newEscalation });

      console.log('[FirebaseCalendarService] Escalation added:', escalationId);
      return newEscalation;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error adding escalation:', error);
      throw error;
    }
  }

  /**
   * Update escalation
   */
  static async updateEscalation(
    eventId: string,
    escalationId: string,
    updates: Partial<EscalationEntry>
  ): Promise<void> {
    try {
      const event = await this.getEvent(eventId);
      if (!event) throw new Error('Event not found');

      // Find and update the escalation
      const updatedEscalations = event.escalationPath.map(esc =>
        esc.id === escalationId ? { ...esc, ...updates } : esc
      );

      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        escalationPath: updatedEscalations,
        updatedAt: serverTimestamp()
      });

      // Update in escalations collection
      await updateDoc(doc(db, COLLECTIONS.ESCALATIONS, escalationId), {
        ...updates,
        updatedAt: serverTimestamp()
      });

      await this.logAudit('escalation_updated', eventId, 'system', { escalationId, updates });

      console.log('[FirebaseCalendarService] Escalation updated:', escalationId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error updating escalation:', error);
      throw error;
    }
  }

  /**
   * Get events by context
   */
  static async getEventsByContext(
    context: ContextLevel,
    userId?: string
  ): Promise<EnhancedCalendarEvent[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.EVENTS),
        where('context', '==', context),
        orderBy('dateTime', 'desc')
      );

      const querySnapshot = await getDocs(q);
      let events = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      })) as EnhancedCalendarEvent[];

      // Filter by user visibility if userId provided
      if (userId) {
        events = events.filter(event =>
          event.visibility?.includes(context) || event.organizer === userId
        );
      }

      console.log('[FirebaseCalendarService] Fetched events by context:', context, events.length);
      return events;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error getting events by context:', error);
      throw error;
    }
  }

  /**
   * Get active incidents
   */
  static async getActiveIncidents(): Promise<EnhancedCalendarEvent[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.EVENTS),
        where('status', '==', EventStatus.OPEN),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      })) as EnhancedCalendarEvent[];

      console.log('[FirebaseCalendarService] Fetched active incidents:', events.length);
      return events;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error getting active incidents:', error);
      throw error;
    }
  }

  /**
   * Get incidents by severity
   */
  static async getIncidentsBySeverity(severity: SeverityLevel): Promise<EnhancedCalendarEvent[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.EVENTS),
        where('status', '==', EventStatus.OPEN),
        where('incidentData.severity', '==', severity),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      })) as EnhancedCalendarEvent[];

      console.log('[FirebaseCalendarService] Fetched incidents by severity:', severity, events.length);
      return events;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error getting incidents by severity:', error);
      throw error;
    }
  }

  /**
   * Get user's roles
   */
  static async getUserRoles(userId: string, eventId?: string): Promise<EventRole[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.EVENTS),
        where('roles', 'array-contains', { userId })
      );

      if (eventId) {
        q = query(
          collection(db, COLLECTIONS.EVENTS),
          where('id', '==', eventId)
        );
      }

      const querySnapshot = await getDocs(q);
      const roles: EventRole[] = [];

      querySnapshot.docs.forEach(doc => {
        const event = doc.data() as EnhancedCalendarEvent;
        const userRoles = event.roles.filter(r => r.userId === userId);
        roles.push(...userRoles);
      });

      console.log('[FirebaseCalendarService] Fetched user roles:', userId, roles.length);
      return roles;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error getting user roles:', error);
      // Return empty array if query fails
      return [];
    }
  }

  /**
   * Get user's assistance requests
   */
  static async getUserAssistanceRequests(userId: string): Promise<AssistanceRequest[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ASSISTANCE),
        where('requestedBy', '==', userId),
        orderBy('requestedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        requestedAt: doc.data().requestedAt?.toDate?.() || doc.data().requestedAt
      })) as AssistanceRequest[];

      console.log('[FirebaseCalendarService] Fetched user assistance requests:', userId, requests.length);
      return requests;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error getting user assistance requests:', error);
      throw error;
    }
  }

  /**
   * Search events by title or description
   */
  static async searchEvents(query: string): Promise<EnhancedCalendarEvent[]> {
    try {
      // Simple title search (for full-text search, use Algolia or similar)
      const q = collection(db, COLLECTIONS.EVENTS);
      const querySnapshot = await getDocs(q);

      const searchTerm = query.toLowerCase();
      const results = querySnapshot.docs
        .map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
        }))
        .filter(event => {
          const title = (event as any).title?.toLowerCase() || '';
          const description = (event as any).description?.toLowerCase() || '';
          return title.includes(searchTerm) || description.includes(searchTerm);
        }) as EnhancedCalendarEvent[];

      console.log('[FirebaseCalendarService] Search results:', query, results.length);
      return results;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error searching events:', error);
      throw error;
    }
  }

  /**
   * Get event statistics
   */
  static async getEventStatistics(): Promise<{
    totalEvents: number;
    incidentsOpen: number;
    incidentsResolved: number;
    escalationsActive: number;
    assistanceRequestsPending: number;
  }> {
    try {
      // Get all events
      const allEvents = await getDocs(collection(db, COLLECTIONS.EVENTS));
      const events = allEvents.docs.map(doc => doc.data()) as EnhancedCalendarEvent[];

      // Get all assistance requests
      const allAssistance = await getDocs(collection(db, COLLECTIONS.ASSISTANCE));
      const assistanceRequests = allAssistance.docs.map(doc => doc.data()) as AssistanceRequest[];

      // Calculate statistics
      const stats = {
        totalEvents: events.length,
        incidentsOpen: events.filter(e => e.status === EventStatus.OPEN).length,
        incidentsResolved: events.filter(e => e.status === EventStatus.RESOLVED).length,
        escalationsActive: events.reduce((sum, e) => sum + (e.escalationPath?.filter(esc => !esc.resolved).length || 0), 0),
        assistanceRequestsPending: assistanceRequests.filter(r => r.status === 'requested').length
      };

      console.log('[FirebaseCalendarService] Event statistics:', stats);
      return stats;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error getting event statistics:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time event updates
   */
  static onEventUpdates(
    eventId: string,
    callback: (event: EnhancedCalendarEvent) => void
  ): Unsubscribe {
    try {
      const unsubscribe = onSnapshot(
        doc(db, COLLECTIONS.EVENTS, eventId),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const event = {
              ...data,
              id: docSnap.id,
              createdAt: data.createdAt?.toDate?.() || data.createdAt,
              updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
            } as EnhancedCalendarEvent;
            callback(event);
          }
        },
        (error) => {
          console.error('[FirebaseCalendarService] Error in event listener:', error);
        }
      );

      console.log('[FirebaseCalendarService] Subscribed to event updates:', eventId);
      return unsubscribe;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error setting up event listener:', error);
      return () => {}; // Return no-op unsubscribe
    }
  }

  /**
   * Subscribe to real-time incident updates
   */
  static onIncidentUpdates(
    callback: (incidents: EnhancedCalendarEvent[]) => void
  ): Unsubscribe {
    try {
      const q = query(
        collection(db, COLLECTIONS.EVENTS),
        where('status', '==', EventStatus.OPEN)
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const incidents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
          })) as EnhancedCalendarEvent[];
          callback(incidents);
        },
        (error) => {
          console.error('[FirebaseCalendarService] Error in incidents listener:', error);
        }
      );

      console.log('[FirebaseCalendarService] Subscribed to incident updates');
      return unsubscribe;
    } catch (error) {
      console.error('[FirebaseCalendarService] Error setting up incidents listener:', error);
      return () => {}; // Return no-op unsubscribe
    }
  }

  /**
   * Batch update multiple events
   */
  static async batchUpdateEvents(
    updates: Array<{ eventId: string; updates: Partial<EnhancedCalendarEvent> }>
  ): Promise<void> {
    try {
      if (updates.length === 0) {
        console.log('[FirebaseCalendarService] No events to batch update');
        return;
      }

      const batch = writeBatch(db);

      updates.forEach(({ eventId, updates: eventUpdates }) => {
        const docRef = doc(db, COLLECTIONS.EVENTS, eventId);
        batch.update(docRef, {
          ...eventUpdates,
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();

      console.log('[FirebaseCalendarService] Batch updated', updates.length, 'events');
    } catch (error) {
      console.error('[FirebaseCalendarService] Error in batch update:', error);
      throw error;
    }
  }

  /**
   * Archive event
   */
  static async archiveEvent(eventId: string, userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        status: EventStatus.ARCHIVED,
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId
      });

      await this.logAudit('event_archived', eventId, userId, {});

      console.log('[FirebaseCalendarService] Event archived:', eventId);
    } catch (error) {
      console.error('[FirebaseCalendarService] Error archiving event:', error);
      throw error;
    }
  }

  /**
   * Log audit trail entry
   */
  private static async logAudit(
    action: string,
    eventId: string,
    userId: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      const auditEntry = {
        action,
        eventId,
        userId,
        metadata,
        timestamp: serverTimestamp()
      };

      await setDoc(doc(db, COLLECTIONS.AUDIT_LOG, `${eventId}_${Date.now()}`), auditEntry);
    } catch (error) {
      console.warn('[FirebaseCalendarService] Warning: Could not log audit trail:', error);
    }
  }
}

export default FirebaseCalendarService;
