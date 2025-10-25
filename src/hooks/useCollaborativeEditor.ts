/**
 * useCollaborativeEditor Hook
 * 
 * React hook for managing collaborative editing sessions
 * 
 * Features:
 * - Auto-connect/disconnect
 * - Connection state management
 * - User presence tracking
 * - Version history
 * - Error handling
 * 
 * @module useCollaborativeEditor
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CollaborativeEditingService,
  getCollaborativeEditingService,
  CollaborativeSession,
  UserPresence,
  VersionSnapshot
} from '@/services/CollaborativeEditingService';

interface UseCollaborativeEditorOptions {
  /** Document ID */
  documentId: string;
  /** User ID */
  userId: string;
  /** User name */
  userName: string;
  /** User role */
  userRole?: 'elder' | 'member' | 'guest';
  /** Auto-connect on mount */
  autoConnect?: boolean;
}

interface UseCollaborativeEditorReturn {
  /** Current session */
  session: CollaborativeSession | null;
  /** Connection status */
  isConnected: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Connected users */
  connectedUsers: UserPresence[];
  /** Version snapshots */
  snapshots: VersionSnapshot[];
  /** Connect to document */
  connect: () => Promise<void>;
  /** Disconnect from document */
  disconnect: () => Promise<void>;
  /** Update cursor position */
  updateCursor: (cursor: { anchor: number; head: number } | null) => void;
  /** Update selection */
  updateSelection: (selection: { from: number; to: number } | null) => void;
  /** Create version snapshot */
  createSnapshot: (description: string) => VersionSnapshot;
  /** Restore version snapshot */
  restoreSnapshot: (snapshotId: string) => Promise<void>;
  /** Check if user is editing */
  isUserEditing: (userId: string) => boolean;
}

/**
 * Hook for collaborative editing
 */
export function useCollaborativeEditor({
  documentId,
  userId,
  userName,
  userRole = 'member',
  autoConnect = true
}: UseCollaborativeEditorOptions): UseCollaborativeEditorReturn {
  const [service] = useState<CollaborativeEditingService>(
    () => getCollaborativeEditingService()
  );
  const [session, setSession] = useState<CollaborativeSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<UserPresence[]>([]);
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([]);

  // Connect to document
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newSession = await service.connectToDocument(
        documentId,
        userId,
        userName,
        userRole
      );

      setSession(newSession);
      setIsConnected(newSession.isConnected);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Connection failed');
      setError(error);
      console.error('Failed to connect to document:', error);
    } finally {
      setIsLoading(false);
    }
  }, [documentId, userId, userName, userRole, service]);

  // Disconnect from document
  const disconnect = useCallback(async () => {
    try {
      await service.disconnectFromDocument(documentId);
      setSession(null);
      setIsConnected(false);
      setConnectedUsers([]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Disconnect failed');
      setError(error);
      console.error('Failed to disconnect from document:', error);
    }
  }, [documentId, service]);

  // Update cursor position
  const updateCursor = useCallback((cursor: { anchor: number; head: number } | null) => {
    if (!isConnected) return;
    service.updateCursor(documentId, cursor);
  }, [documentId, isConnected, service]);

  // Update selection
  const updateSelection = useCallback((selection: { from: number; to: number } | null) => {
    if (!isConnected) return;
    service.updateSelection(documentId, selection);
  }, [documentId, isConnected, service]);

  // Create version snapshot
  const createSnapshot = useCallback((description: string): VersionSnapshot => {
    return service.createSnapshot(documentId, userId, description);
  }, [documentId, userId, service]);

  // Restore version snapshot
  const restoreSnapshot = useCallback(async (snapshotId: string): Promise<void> => {
    try {
      await service.restoreSnapshot(documentId, snapshotId);
      
      // Reload snapshots
      // TODO: Implement getSnapshots() in service
      // setSnapshots(await service.getSnapshots(documentId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Restore failed');
      setError(error);
      console.error('Failed to restore snapshot:', error);
      throw error;
    }
  }, [documentId, service]);

  // Check if user is editing
  const isUserEditing = useCallback((checkUserId: string): boolean => {
    return service.isUserEditing(documentId, checkUserId);
  }, [documentId, service]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  // Update connected users periodically
  useEffect(() => {
    if (!isConnected) return;

    const updateUsers = () => {
      const users = service.getConnectedUsers(documentId);
      setConnectedUsers(users);
    };

    // Initial update
    updateUsers();

    // Set up interval
    const interval = setInterval(updateUsers, 1000);

    return () => clearInterval(interval);
  }, [documentId, isConnected, service]);

  // Monitor connection status
  useEffect(() => {
    if (!session) return;

    const checkConnection = () => {
      setIsConnected(session.isConnected);
    };

    // Check every 2 seconds
    const interval = setInterval(checkConnection, 2000);

    return () => clearInterval(interval);
  }, [session]);

  return {
    session,
    isConnected,
    isLoading,
    error,
    connectedUsers,
    snapshots,
    connect,
    disconnect,
    updateCursor,
    updateSelection,
    createSnapshot,
    restoreSnapshot,
    isUserEditing
  };
}
