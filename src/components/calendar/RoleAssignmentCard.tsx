/**
 * @file RoleAssignmentCard.tsx
 * @description Component for displaying and managing event roles
 * Supports role assignment, permission-based editing, and status tracking
 * 
 * FEATURES:
 * - Display all roles assigned to an event
 * - Show role status (Assigned, Accepted, Declined, Completed)
 * - Organizer can edit/remove roles
 * - Mobile-responsive design
 * - Compact and expanded views
 * 
 * @created October 22, 2025
 */

'use client';

import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  EnhancedCalendarEvent,
  EventRole,
  RoleType,
  RoleStatus,
  Permission,
  ROLE_PERMISSIONS,
  userHasPermission
} from '@/types/calendar';

/**
 * Props for RoleAssignmentCard component
 */
interface RoleAssignmentCardProps {
  /** The event containing the roles */
  event: EnhancedCalendarEvent;
  /** Current user ID for permission checking */
  currentUserId: string;
  /** Callback when role is updated */
  onRoleUpdate?: (userId: string, newRole: RoleType) => Promise<void>;
  /** Callback when role is removed */
  onRoleRemove?: (userId: string) => Promise<void>;
  /** Whether current user can edit roles */
  editable?: boolean;
  /** Show compact or expanded view */
  compact?: boolean;
  /** Callback to open role assignment modal */
  onAddRole?: () => void;
  /** CSS className for custom styling */
  className?: string;
}

/**
 * Role metadata including icon and description
 */
const ROLE_METADATA: Record<
  RoleType,
  { icon: string; title: string; description: string; color: string }
> = {
  [RoleType.ORGANIZER]: {
    icon: '📋',
    title: 'Organizer',
    description: 'Plans event, assigns roles, makes decisions',
    color: 'bg-blue-50 border-blue-200'
  },
  [RoleType.PARTICIPANT]: {
    icon: '👥',
    title: 'Participant',
    description: 'Attends and contributes to event',
    color: 'bg-green-50 border-green-200'
  },
  [RoleType.SUPPORTER]: {
    icon: '🤝',
    title: 'Supporter',
    description: 'Provides assistance or resources',
    color: 'bg-yellow-50 border-yellow-200'
  },
  [RoleType.STEWARD]: {
    icon: '⭐',
    title: 'Steward',
    description: 'Oversees execution and outcomes',
    color: 'bg-purple-50 border-purple-200'
  }
};

/**
 * Status badge styling
 */
const STATUS_STYLES: Record<RoleStatus, { badge: string; icon: string }> = {
  [RoleStatus.ASSIGNED]: { badge: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  [RoleStatus.ACCEPTED]: { badge: 'bg-green-100 text-green-800', icon: '✓' },
  [RoleStatus.DECLINED]: { badge: 'bg-red-100 text-red-800', icon: '✗' },
  [RoleStatus.COMPLETED]: { badge: 'bg-blue-100 text-blue-800', icon: '✓' }
};

/**
 * RoleAssignmentCard Component
 * Displays and manages role assignments for an event
 */
export const RoleAssignmentCard: React.FC<RoleAssignmentCardProps> = ({
  event,
  currentUserId,
  onRoleUpdate,
  onRoleRemove,
  editable = false,
  compact = false,
  onAddRole,
  className = ''
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user can edit roles
  const canEditRoles =
    editable && userHasPermission(event, currentUserId, Permission.EDIT);

  /**
   * Handle role update
   */
  const handleRoleUpdate = useCallback(
    async (userId: string, newRole: RoleType) => {
      if (!onRoleUpdate) return;

      try {
        setIsUpdating(true);
        setError(null);
        await onRoleUpdate(userId, newRole);
        toast.success('Role updated successfully');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update role';
        setError(message);
        toast.error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [onRoleUpdate]
  );

  /**
   * Handle role removal
   */
  const handleRoleRemove = useCallback(
    async (userId: string) => {
      if (!onRoleRemove) return;

      try {
        setIsUpdating(true);
        setError(null);
        await onRoleRemove(userId);
        toast.success('Role removed');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to remove role';
        setError(message);
        toast.error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [onRoleRemove]
  );

  // Render compact view
  if (compact) {
    return (
      <div className={`role-assignment-card-compact ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm text-gray-700">
            Roles: {event.roles.length} assigned
          </h4>
        </div>

        <div className="space-y-2">
          {event.roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{ROLE_METADATA[role.role].icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {ROLE_METADATA[role.role].title}
                  </p>
                </div>
              </div>
              {role.status === RoleStatus.ACCEPTED && (
                <span className="text-green-600 text-sm font-medium">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render full view
  return (
    <div className={`role-assignment-card ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">👥</span>
          Event Roles & Responsibilities
        </h3>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-600 font-bold text-lg">⚠️</span>
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 font-bold"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Roles list */}
      <div className="space-y-4 mb-6">
        {event.roles.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No roles assigned yet</p>
          </div>
        ) : (
          event.roles.map((role) => (
            <RoleItem
              key={role.id}
              role={role}
              canEdit={canEditRoles}
              isUpdating={isUpdating}
              onUpdate={handleRoleUpdate}
              onRemove={handleRoleRemove}
            />
          ))
        )}
      </div>

      {/* Add role button */}
      {canEditRoles && (
        <button
          onClick={onAddRole}
          disabled={isUpdating}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          aria-label="Add another role"
        >
          + Add Role
        </button>
      )}
    </div>
  );
};

/**
 * Individual role item component
 */
interface RoleItemProps {
  role: EventRole;
  canEdit: boolean;
  isUpdating: boolean;
  onUpdate: (userId: string, newRole: RoleType) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
}

const RoleItem: React.FC<RoleItemProps> = ({
  role,
  canEdit,
  isUpdating,
  onUpdate,
  onRemove
}) => {
  const metadata = ROLE_METADATA[role.role];
  const statusStyle = STATUS_STYLES[role.status];

  return (
    <div
      className={`p-4 border-2 rounded-lg transition-colors ${metadata.color}`}
    >
      {/* Role header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{metadata.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-900">
              {metadata.title}
            </h4>
            <p className="text-sm text-gray-600">{getUserDisplayName(role.userId)}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}
        >
          {statusStyle.icon} {role.status}
        </span>
      </div>

      {/* Role description */}
      <p className="text-sm text-gray-700 mb-4">{metadata.description}</p>

      {/* Permissions display (optional) */}
      {role.permissions.length > 0 && (
        <div className="mb-4 pb-4 border-t border-gray-300 border-opacity-50">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
            Permissions
          </p>
          <div className="flex flex-wrap gap-2">
            {role.permissions.map((perm) => (
              <span
                key={perm}
                className="text-xs bg-white px-2 py-1 rounded border border-gray-300"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {canEdit && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onUpdate(role.userId, role.role)}
            disabled={isUpdating}
            className="flex-1 px-3 py-2 text-sm font-medium bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(role.userId)}
            disabled={isUpdating}
            className="flex-1 px-3 py-2 text-sm font-medium bg-red-50 hover:bg-red-100 disabled:bg-gray-200 text-red-700 border border-red-300 rounded-lg transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Show accepted/completed timestamp */}
      {(role.status === RoleStatus.ACCEPTED || role.status === RoleStatus.COMPLETED) && role.acceptedAt && (
        <p className="text-xs text-gray-600 mt-3">
          {role.status === RoleStatus.ACCEPTED ? 'Accepted' : 'Completed'} on{' '}
          {new Date(role.acceptedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

/**
 * Helper function to get user display name
 * TODO: Replace with actual user lookup from database
 */
function getUserDisplayName(userId: string): string {
  // Temporary mapping - replace with actual user lookup
  const userMap: Record<string, string> = {
    'user_mukurwe': 'Mukurwe',
    'user_solo': 'Solo',
    'user_flamea': 'Flamea'
  };
  return userMap[userId] || userId;
}

export default RoleAssignmentCard;
