/**
 * @file useRoleAssignment.ts
 * @description Custom React hook for managing event role assignments
 * Handles subscription to roles, permission checking, and role updates
 * 
 * FEATURES:
 * - Real-time role subscription
 * - Permission checking (can user edit roles?)
 * - Add/remove role utilities
 * - Loading and error states
 * - Firebase integration ready
 * 
 * @created October 22, 2025
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  EnhancedCalendarEvent,
  EventRole,
  RoleType,
  RoleStatus,
  Permission
} from '@/types/calendar';

/**
 * Return type for useRoleAssignment hook
 */
interface UseRoleAssignmentReturn {
  /** Current roles for the event */
  roles: EventRole[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Check if current user can edit roles */
  canEditRoles: boolean;
  /** Check if current user has specific permission */
  hasPermission: (permission: Permission) => boolean;
  /** Get user's role for this event */
  getUserRole: (userId: string) => EventRole | undefined;
  /** Add a new role */
  addRole: (role: Omit<EventRole, 'id' | 'assignedAt'>) => Promise<void>;
  /** Remove a role */
  removeRole: (roleId: string) => Promise<void>;
  /** Update role status */
  updateRoleStatus: (
    roleId: string,
    status: RoleStatus
  ) => Promise<void>;
  /** Accept role invitation */
  acceptRole: (roleId: string) => Promise<void>;
  /** Decline role invitation */
  declineRole: (roleId: string) => Promise<void>;
}

/**
 * Hook for managing event role assignments
 * @param event - The calendar event
 * @param currentUserId - Current user's ID
 * @param onUpdate - Optional callback when roles update
 * @returns Role management utilities and state
 */
export function useRoleAssignment(
  event: EnhancedCalendarEvent | null,
  currentUserId: string,
  onUpdate?: (roles: EventRole[]) => Promise<void>
): UseRoleAssignmentReturn {
  const [roles, setRoles] = useState<EventRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Get current user's role for this event
   */
  const getCurrentUserRole = useCallback((): EventRole | undefined => {
    return roles.find((r) => r.userId === currentUserId);
  }, [roles, currentUserId]);

  /**
   * Check if current user can edit roles
   * Organizers can always edit. Others can only manage their own roles.
   */
  const canEditRoles = useCallback((): boolean => {
    const userRole = getCurrentUserRole();
    if (!userRole) return false;
    return userRole.role === RoleType.ORGANIZER;
  }, [getCurrentUserRole]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      const userRole = getCurrentUserRole();
      if (!userRole) return false;
      return userRole.permissions.includes(permission);
    },
    [getCurrentUserRole]
  );

  /**
   * Get user's role for this event
   */
  const getUserRole = useCallback(
    (userId: string): EventRole | undefined => {
      return roles.find((r) => r.userId === userId);
    },
    [roles]
  );

  /**
   * Load roles from event
   */
  useEffect(() => {
    if (!event?.roles) {
      setRoles([]);
      return;
    }

    // For now, directly set roles from event
    // TODO: Replace with Firebase real-time listener when backend is ready
    setRoles(event.roles);
    setError(null);
  }, [event]);

  /**
   * Add a new role
   */
  const addRole = useCallback(
    async (role: Omit<EventRole, 'id' | 'assignedAt'>) => {
      if (!canEditRoles()) {
        throw new Error('Only organizers can assign roles');
      }

      if (!event) {
        throw new Error('Event not loaded');
      }

      try {
        setIsLoading(true);

        // Generate ID and timestamp
        const newRole: EventRole = {
          ...(role as EventRole),
          id: `role_${Date.now()}`,
          assignedAt: new Date()
        };

        const updatedRoles = [...roles, newRole];
        setRoles(updatedRoles);

        // Notify parent
        if (onUpdate) {
          await onUpdate(updatedRoles);
        }

        // TODO: Firebase update when backend is ready
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to add role');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [canEditRoles, event, roles, onUpdate]
  );

  /**
   * Remove a role
   */
  const removeRole = useCallback(
    async (roleId: string) => {
      if (!canEditRoles()) {
        throw new Error('Only organizers can remove roles');
      }

      try {
        setIsLoading(true);

        const updatedRoles = roles.filter((r) => r.id !== roleId);
        setRoles(updatedRoles);

        // Notify parent
        if (onUpdate) {
          await onUpdate(updatedRoles);
        }

        // TODO: Firebase update when backend is ready
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to remove role');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [canEditRoles, roles, onUpdate]
  );

  /**
   * Update role status
   */
  const updateRoleStatus = useCallback(
    async (roleId: string, status: EventRole['status']) => {
      try {
        setIsLoading(true);

        const updatedRoles = roles.map((r) =>
          r.id === roleId ? { ...r, status, updatedAt: new Date().toISOString() } : r
        );
        setRoles(updatedRoles);

        // Notify parent
        if (onUpdate) {
          await onUpdate(updatedRoles);
        }

        // TODO: Firebase update when backend is ready
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update role status');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [roles, onUpdate]
  );

  /**
   * Accept role invitation
   */
  const acceptRole = useCallback(
    async (roleId: string) => {
      const role = roles.find((r) => r.id === roleId);
      if (!role) {
        throw new Error('Role not found');
      }

      if (role.userId !== currentUserId) {
        throw new Error('Can only accept roles assigned to you');
      }

      await updateRoleStatus(roleId, RoleStatus.ACCEPTED);
    },
    [roles, currentUserId, updateRoleStatus]
  );

  /**
   * Decline role invitation
   */
  const declineRole = useCallback(
    async (roleId: string) => {
      const role = roles.find((r) => r.id === roleId);
      if (!role) {
        throw new Error('Role not found');
      }

      if (role.userId !== currentUserId) {
        throw new Error('Can only decline roles assigned to you');
      }

      await updateRoleStatus(roleId, RoleStatus.DECLINED);
    },
    [roles, currentUserId, updateRoleStatus]
  );

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
    roles,
    isLoading,
    error,
    canEditRoles: canEditRoles(),
    hasPermission,
    getUserRole,
    addRole,
    removeRole,
    updateRoleStatus,
    acceptRole,
    declineRole
  };
}

export default useRoleAssignment;
