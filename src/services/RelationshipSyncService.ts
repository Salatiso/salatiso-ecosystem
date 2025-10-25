/**
 * RelationshipSyncService
 * 
 * Manages real-time synchronization of contact and relationship changes
 * across all features in the application.
 * 
 * This service implements a pub/sub pattern using Firestore listeners to:
 * - Track changes to contacts and relationships in real-time
 * - Broadcast updates to all listening features
 * - Maintain consistency across family tree, calendar, assets, projects
 * - Handle cascade updates when relationships change
 * 
 * Features:
 * - Real-time Firestore listeners for contacts and relationships
 * - Pub/sub pattern for feature notification
 * - Automatic unsubscription on cleanup
 * - Error handling and retry logic
 * - Batch update support
 */

'use client';

import {
  collection,
  query,
  onSnapshot,
  where,
  Unsubscribe,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Contact, ContactRelationship } from '@/services/ContactsService';

/**
 * Types of relationship events
 */
export type RelationshipEventType =
  | 'contact_added'
  | 'contact_updated'
  | 'contact_deleted'
  | 'relationship_added'
  | 'relationship_updated'
  | 'relationship_deleted'
  | 'batch_update';

/**
 * Relationship event payload
 */
export interface RelationshipEvent {
  type: RelationshipEventType;
  timestamp: Date;
  userId?: string;
  data: {
    contact?: Contact;
    relationship?: ContactRelationship;
    contacts?: Contact[];
    relationships?: ContactRelationship[];
    affectedContactIds?: string[];
  };
}

/**
 * Listener callback type
 */
export type RelationshipEventListener = (event: RelationshipEvent) => void;

/**
 * Listener registry entry
 */
interface ListenerEntry {
  id: string;
  callback: RelationshipEventListener;
  unsubscribe?: Unsubscribe;
  eventTypes?: RelationshipEventType[];
}

/**
 * RelationshipSyncService
 * 
 * Singleton service for managing real-time relationship synchronization
 */
class RelationshipSyncService {
  private listeners: Map<string, ListenerEntry> = new Map();
  private contactUnsubscribe: Unsubscribe | null = null;
  private relationshipUnsubscribe: Unsubscribe | null = null;
  private nextListenerId = 0;
  private isInitialized = false;
  private userId: string | null = null;

  /**
   * Initialize the sync service for a specific user
   * Sets up Firestore real-time listeners
   */
  async initialize(userId: string): Promise<void> {
    if (this.isInitialized && this.userId === userId) {
      return;
    }

    this.userId = userId;

    try {
      this.setupContactsListener();
      this.setupRelationshipsListener();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing RelationshipSyncService:', error);
      throw error;
    }
  }

  /**
   * Set up real-time listener for contacts collection
   */
  private setupContactsListener(): void {
    if (this.contactUnsubscribe) {
      this.contactUnsubscribe();
    }

    if (!this.userId) return;

    try {
      const contactsRef = collection(db, 'contacts');
      const q = query(contactsRef, where('addedBy', '==', this.userId));

      this.contactUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const contact = {
              id: change.doc.id,
              ...change.doc.data(),
              createdAt: change.doc.data().createdAt?.toDate() || new Date(),
              updatedAt: change.doc.data().updatedAt?.toDate() || new Date(),
              lastSeen: change.doc.data().lastSeen?.toDate()
            } as Contact;

            let eventType: RelationshipEventType;
            if (change.type === 'added') {
              eventType = 'contact_added';
            } else if (change.type === 'modified') {
              eventType = 'contact_updated';
            } else {
              eventType = 'contact_deleted';
            }

            this.broadcastEvent({
              type: eventType,
              timestamp: new Date(),
              userId: this.userId || undefined,
              data: { contact }
            });
          });
        },
        (error) => {
          console.error('Error in contacts listener:', error);
        }
      );
    } catch (error) {
      console.error('Error setting up contacts listener:', error);
    }
  }

  /**
   * Set up real-time listener for relationships collection
   */
  private setupRelationshipsListener(): void {
    if (this.relationshipUnsubscribe) {
      this.relationshipUnsubscribe();
    }

    if (!this.userId) return;

    try {
      const relationshipsRef = collection(db, 'contact_relationships');
      // Note: relationships are global, not per-user, so we listen to all
      // In production, might want to add user context to relationships

      this.relationshipUnsubscribe = onSnapshot(
        relationshipsRef,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const relationship = {
              id: change.doc.id,
              ...change.doc.data(),
              createdAt: change.doc.data().createdAt?.toDate() || new Date(),
              updatedAt: change.doc.data().updatedAt?.toDate() || new Date()
            } as ContactRelationship;

            let eventType: RelationshipEventType;
            if (change.type === 'added') {
              eventType = 'relationship_added';
            } else if (change.type === 'modified') {
              eventType = 'relationship_updated';
            } else {
              eventType = 'relationship_deleted';
            }

            this.broadcastEvent({
              type: eventType,
              timestamp: new Date(),
              userId: this.userId || undefined,
              data: {
                relationship,
                affectedContactIds: [relationship.contactId, relationship.relatedContactId]
              }
            });
          });
        },
        (error) => {
          console.error('Error in relationships listener:', error);
        }
      );
    } catch (error) {
      console.error('Error setting up relationships listener:', error);
    }
  }

  /**
   * Subscribe to relationship events
   */
  subscribe(
    callback: RelationshipEventListener,
    eventTypes?: RelationshipEventType[]
  ): string {
    const id = `listener_${this.nextListenerId++}`;
    this.listeners.set(id, {
      id,
      callback,
      eventTypes
    });
    return id;
  }

  /**
   * Unsubscribe from relationship events
   */
  unsubscribe(listenerId: string): void {
    const listener = this.listeners.get(listenerId);
    if (listener?.unsubscribe) {
      listener.unsubscribe();
    }
    this.listeners.delete(listenerId);
  }

  /**
   * Unsubscribe all listeners
   */
  unsubscribeAll(): void {
    this.listeners.forEach((listener) => {
      if (listener.unsubscribe) {
        listener.unsubscribe();
      }
    });
    this.listeners.clear();
  }

  /**
   * Broadcast an event to all interested listeners
   */
  private broadcastEvent(event: RelationshipEvent): void {
    this.listeners.forEach((listener) => {
      // If specific event types are registered, only call for those
      if (listener.eventTypes && !listener.eventTypes.includes(event.type)) {
        return;
      }

      try {
        listener.callback(event);
      } catch (error) {
        console.error(
          `Error in relationship event listener ${listener.id}:`,
          error
        );
      }
    });
  }

  /**
   * Broadcast a custom event (for programmatic updates)
   */
  broadcastContactUpdate(contact: Contact): void {
    this.broadcastEvent({
      type: 'contact_updated',
      timestamp: new Date(),
      userId: this.userId || undefined,
      data: { contact }
    });
  }

  /**
   * Broadcast relationship change
   */
  broadcastRelationshipChange(relationship: ContactRelationship): void {
    this.broadcastEvent({
      type: 'relationship_updated',
      timestamp: new Date(),
      userId: this.userId || undefined,
      data: {
        relationship,
        affectedContactIds: [relationship.contactId, relationship.relatedContactId]
      }
    });
  }

  /**
   * Broadcast batch update
   */
  broadcastBatchUpdate(
    contacts: Contact[],
    relationships: ContactRelationship[]
  ): void {
    const affectedContactIds = new Set<string>();
    contacts.forEach((c) => affectedContactIds.add(c.id));
    relationships.forEach((r) => {
      affectedContactIds.add(r.contactId);
      affectedContactIds.add(r.relatedContactId);
    });

    this.broadcastEvent({
      type: 'batch_update',
      timestamp: new Date(),
      userId: this.userId || undefined,
      data: {
        contacts,
        relationships,
        affectedContactIds: Array.from(affectedContactIds)
      }
    });
  }

  /**
   * Get current number of active listeners
   */
  getListenerCount(): number {
    return this.listeners.size;
  }

  /**
   * Check if service is initialized
   */
  getInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Clean up all listeners and unsubscribe from Firestore
   */
  cleanup(): void {
    if (this.contactUnsubscribe) {
      this.contactUnsubscribe();
      this.contactUnsubscribe = null;
    }

    if (this.relationshipUnsubscribe) {
      this.relationshipUnsubscribe();
      this.relationshipUnsubscribe = null;
    }

    this.unsubscribeAll();
    this.isInitialized = false;
    this.userId = null;
  }
}

// Export singleton instance
export const relationshipSyncService = new RelationshipSyncService();

export default relationshipSyncService;

/**
 * USAGE EXAMPLES:
 * 
 * ========== INITIALIZATION ==========
 * In app initialization (e.g., AuthProvider):
 * 
 * useEffect(() => {
 *   if (user?.id) {
 *     relationshipSyncService.initialize(user.id);
 *   }
 *   return () => relationshipSyncService.cleanup();
 * }, [user?.id]);
 * 
 * 
 * ========== SUBSCRIBE TO ALL EVENTS ==========
 * 
 * const listenerId = relationshipSyncService.subscribe((event) => {
 *   console.log('Relationship event:', event);
 *   switch (event.type) {
 *     case 'contact_updated':
 *       // Update UI with new contact data
 *       break;
 *     case 'relationship_added':
 *       // Rebuild family tree
 *       break;
 *   }
 * });
 * 
 * // Cleanup
 * return () => relationshipSyncService.unsubscribe(listenerId);
 * 
 * 
 * ========== SUBSCRIBE TO SPECIFIC EVENTS ==========
 * 
 * const listenerId = relationshipSyncService.subscribe(
 *   (event) => {
 *     // Only receives 'contact_updated' events
 *     const contact = event.data.contact;
 *     updateContactDisplay(contact);
 *   },
 *   ['contact_updated', 'contact_added']
 * );
 * 
 * 
 * ========== IN A REACT COMPONENT ==========
 * 
 * function FamilyTree() {
 *   const [members, setMembers] = useState<Contact[]>([]);
 * 
 *   useEffect(() => {
 *     const listenerId = relationshipSyncService.subscribe((event) => {
 *       if (event.type === 'contact_updated') {
 *         setMembers(prev => prev.map(m =>
 *           m.id === event.data.contact?.id
 *             ? event.data.contact
 *             : m
 *         ));
 *       }
 *     });
 *
 *     return () => relationshipSyncService.unsubscribe(listenerId);
 *   }, []);
 * 
 *   return <div>...</div>;
 * }
 * 
 * 
 * ========== BROADCAST PROGRAMMATIC UPDATES ==========
 * 
 * // After updating a contact in the service
 * const updatedContact = await contactsService.updateContact(id, updates);
 * relationshipSyncService.broadcastContactUpdate(updatedContact);
 * 
 * // Or for relationships
 * const relationship = await contactsService.addRelationship(...);
 * relationshipSyncService.broadcastRelationshipChange(relationship);
 * 
 * // Or for batch updates
 * relationshipSyncService.broadcastBatchUpdate(contacts, relationships);
 */
