/**
 * Hook: useRelationshipSync
 * 
 * React hook for consuming relationship sync events in components
 * Automatically handles subscription cleanup
 * 
 * Usage:
 * const { addListener, initialized } = useRelationshipSync();
 * 
 * useEffect(() => {
 *   const id = addListener((event) => {
 *     console.log('Relationship changed:', event);
 *   });
 *   return () => removeListener(id);
 * }, []);
 */

'use client';

import { useEffect, useCallback, useState } from 'react';
import {
  relationshipSyncService,
  RelationshipEvent,
  RelationshipEventType,
  RelationshipEventListener
} from '@/services/RelationshipSyncService';
import { useAuth } from '@/contexts/AuthContext';

export interface UseRelationshipSyncReturn {
  /** Add a listener for relationship events */
  addListener: (
    callback: RelationshipEventListener,
    eventTypes?: RelationshipEventType[]
  ) => string;

  /** Remove a listener by ID */
  removeListener: (listenerId: string) => void;

  /** Whether the sync service is initialized */
  initialized: boolean;

  /** Number of active listeners */
  listenerCount: number;

  /** Manually trigger a contact update broadcast */
  broadcastContactUpdate: (contact: any) => void;

  /** Manually trigger a relationship change broadcast */
  broadcastRelationshipChange: (relationship: any) => void;

  /** Manually trigger a batch update broadcast */
  broadcastBatchUpdate: (contacts: any[], relationships: any[]) => void;
}

/**
 * Hook for using RelationshipSyncService in React components
 */
export const useRelationshipSync = (): UseRelationshipSyncReturn => {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);

  // Initialize sync service on mount
  useEffect(() => {
    if (user?.id) {
      relationshipSyncService
        .initialize(user.id)
        .then(() => {
          setInitialized(true);
        })
        .catch((error) => {
          console.error('Failed to initialize RelationshipSyncService:', error);
        });
    }

    return () => {
      // Cleanup on unmount
      relationshipSyncService.cleanup();
      setInitialized(false);
    };
  }, [user?.id]);

  // Add listener callback
  const addListener = useCallback(
    (
      callback: RelationshipEventListener,
      eventTypes?: RelationshipEventType[]
    ) => {
      const id = relationshipSyncService.subscribe(callback, eventTypes);
      setListenerCount((prev) => prev + 1);
      return id;
    },
    []
  );

  // Remove listener callback
  const removeListener = useCallback((listenerId: string) => {
    relationshipSyncService.unsubscribe(listenerId);
    setListenerCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Broadcast callbacks
  const broadcastContactUpdate = useCallback((contact: any) => {
    relationshipSyncService.broadcastContactUpdate(contact);
  }, []);

  const broadcastRelationshipChange = useCallback((relationship: any) => {
    relationshipSyncService.broadcastRelationshipChange(relationship);
  }, []);

  const broadcastBatchUpdate = useCallback(
    (contacts: any[], relationships: any[]) => {
      relationshipSyncService.broadcastBatchUpdate(contacts, relationships);
    },
    []
  );

  return {
    addListener,
    removeListener,
    initialized,
    listenerCount,
    broadcastContactUpdate,
    broadcastRelationshipChange,
    broadcastBatchUpdate
  };
};

export default useRelationshipSync;

/**
 * USAGE EXAMPLES:
 * 
 * ========== BASIC USAGE ==========
 * 
 * function MyComponent() {
 *   const { addListener, removeListener } = useRelationshipSync();
 * 
 *   useEffect(() => {
 *     const listenerId = addListener((event) => {
 *       console.log('Event:', event);
 *     });
 * 
 *     return () => removeListener(listenerId);
 *   }, [addListener, removeListener]);
 * 
 *   return <div>...</div>;
 * }
 * 
 * 
 * ========== WITH SPECIFIC EVENT TYPES ==========
 * 
 * function FamilyTreeComponent() {
 *   const [members, setMembers] = useState<Contact[]>([]);
 *   const { addListener, removeListener } = useRelationshipSync();
 * 
 *   useEffect(() => {
 *     // Only listen for contact changes
 *     const listenerId = addListener(
 *       (event) => {
 *         if (event.type === 'contact_updated') {
 *           setMembers(prev =>
 *             prev.map(m =>
 *               m.id === event.data.contact?.id ? event.data.contact : m
 *             )
 *           );
 *         }
 *       },
 *       ['contact_updated', 'contact_added', 'contact_deleted']
 *     );
 * 
 *     return () => removeListener(listenerId);
 *   }, [addListener, removeListener]);
 * 
 *   return <div>...</div>;
 * }
 * 
 * 
 * ========== WITH ERROR HANDLING ==========
 * 
 * function CalendarComponent() {
 *   const [events, setEvents] = useState<CalendarEvent[]>([]);
 *   const { addListener, removeListener, initialized } = useRelationshipSync();
 *   const [error, setError] = useState<string | null>(null);
 * 
 *   useEffect(() => {
 *     if (!initialized) return;
 * 
 *     try {
 *       const listenerId = addListener((event) => {
 *         // Handle event
 *         updateEventsFromContact(event.data.contact);
 *       });
 * 
 *       return () => removeListener(listenerId);
 *     } catch (err) {
 *       setError('Failed to setup sync');
 *     }
 *   }, [initialized, addListener, removeListener]);
 * 
 *   if (error) return <div>Error: {error}</div>;
 *   if (!initialized) return <div>Loading...</div>;
 * 
 *   return <div>...</div>;
 * }
 * 
 * 
 * ========== MULTIPLE LISTENERS ==========
 * 
 * function DashboardComponent() {
 *   const { addListener, removeListener } = useRelationshipSync();
 *   const listenerIds = useRef<string[]>([]);
 * 
 *   useEffect(() => {
 *     // Family tree listener
 *     const familyId = addListener((event) => {
 *       updateFamilyTree(event);
 *     }, ['contact_added', 'contact_updated', 'relationship_added']);
 * 
 *     // Calendar listener
 *     const calendarId = addListener((event) => {
 *       updateCalendar(event);
 *     }, ['contact_updated', 'relationship_added']);
 * 
 *     // Assets listener
 *     const assetsId = addListener((event) => {
 *       updateAssets(event);
 *     }, ['contact_updated']);
 * 
 *     listenerIds.current = [familyId, calendarId, assetsId];
 * 
 *     return () => {
 *       listenerIds.current.forEach(id => removeListener(id));
 *     };
 *   }, [addListener, removeListener]);
 * 
 *   return <div>...</div>;
 * }
 */
