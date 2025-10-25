import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Shield, Eye, Edit3, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Collaborator {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  role: 'viewer' | 'editor' | 'manager' | 'owner';
  grantedAt: Date;
  avatar?: string;
}

interface PermissionManagerProps {
  eventId: string;
  collaborators?: Collaborator[];
  onAddCollaborator?: (userId: string, role: string) => Promise<void>;
  onRemoveCollaborator?: (userId: string) => Promise<void>;
  onChangeRole?: (userId: string, newRole: string) => Promise<void>;
  currentUserRole?: string;
  readOnly?: boolean;
}

/**
 * PermissionManager
 * Manage collaborator permissions and access control
 */
export const PermissionManager: React.FC<PermissionManagerProps> = ({
  eventId,
  collaborators = [],
  onAddCollaborator,
  onRemoveCollaborator,
  onChangeRole,
  currentUserRole = 'owner',
  readOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'owner' | 'manager' | 'editor' | 'viewer'>('all');

  const canManagePermissions = currentUserRole === 'owner' || currentUserRole === 'manager';
  const canEditRoles = currentUserRole === 'owner';

  // Role configuration
  const roleConfig = {
    owner: {
      label: 'Owner',
      description: 'Full control, can manage permissions',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    manager: {
      label: 'Manager',
      description: 'Can edit event and manage collaborators',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    editor: {
      label: 'Editor',
      description: 'Can edit event details and add comments',
      icon: Edit3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    viewer: {
      label: 'Viewer',
      description: 'Can view event and comments only',
      icon: Eye,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  };

  // Handle adding new collaborator
  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // In production, you'd resolve email to userId via Firestore
      // For now, we'll use email as userId (demo)
      await onAddCollaborator?.(newCollaboratorEmail, newCollaboratorRole);
      setNewCollaboratorEmail('');
      setNewCollaboratorRole('editor');
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  // Handle removing collaborator
  const handleRemoveCollaborator = async (userId: string, userName?: string) => {
    if (!confirm(`Remove ${userName || 'this collaborator'}?`)) return;

    setError(null);
    setLoading(true);

    try {
      await onRemoveCollaborator?.(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove collaborator');
    } finally {
      setLoading(false);
    }
  };

  // Handle changing role
  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!confirm(`Change role to ${roleConfig[newRole as keyof typeof roleConfig]?.label}?`))
      return;

    setError(null);
    setLoading(true);

    try {
      await onChangeRole?.(userId, newRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change role');
    } finally {
      setLoading(false);
    }
  };

  // Filter collaborators
  const filteredCollaborators =
    filter === 'all'
      ? collaborators
      : collaborators.filter((c) => c.role === filter);

  // Group by role
  const groupedByRole = {
    owner: collaborators.filter((c) => c.role === 'owner'),
    manager: collaborators.filter((c) => c.role === 'manager'),
    editor: collaborators.filter((c) => c.role === 'editor'),
    viewer: collaborators.filter((c) => c.role === 'viewer'),
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users size={20} />
          Permissions
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {collaborators.length}
          </span>
        </h3>
      </div>

      {/* Add Collaborator Button */}
      {!readOnly && canManagePermissions && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={18} />
          Add Collaborator
        </button>
      )}

      {/* Add Collaborator Form */}
      <AnimatePresence>
        {isOpen && !readOnly && canManagePermissions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={newCollaboratorEmail}
                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={newCollaboratorRole}
                onChange={(e) => setNewCollaboratorRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={loading}
              >
                <option value="viewer">Viewer - Can view only</option>
                <option value="editor">Editor - Can edit and comment</option>
                <option value="manager">Manager - Can manage collaborators</option>
              </select>
            </div>

            {error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAddCollaborator}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                }}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      {collaborators.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'owner', 'manager', 'editor', 'viewer'].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                filter === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {r === 'all' ? 'All' : roleConfig[r as keyof typeof roleConfig]?.label}
            </button>
          ))}
        </div>
      )}

      {/* Collaborators List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredCollaborators.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-gray-400"
            >
              <Users size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No collaborators with this role</p>
            </motion.div>
          ) : (
            filteredCollaborators.map((collab) => {
              const roleInfo = roleConfig[collab.role as keyof typeof roleConfig];
              const Icon = roleInfo?.icon || Users;

              return (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-lg border transition-all hover:shadow-md group ${roleInfo?.bgColor} border-gray-200`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        collab.role === 'owner'
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                          : collab.role === 'manager'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : collab.role === 'editor'
                          ? 'bg-gradient-to-br from-green-500 to-green-600'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}
                    >
                      {collab.name?.charAt(0) || collab.email?.charAt(0) || 'U'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">
                        {collab.name || collab.email || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Icon size={14} className={roleInfo?.color} />
                        <span className="text-xs text-gray-600">
                          {roleInfo?.label}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {!readOnly && canEditRoles && collab.role !== 'owner' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Role Dropdown */}
                        <select
                          value={collab.role}
                          onChange={(e) => handleChangeRole(collab.userId, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="manager">Manager</option>
                        </select>

                        {/* Remove Button */}
                        <button
                          onClick={() =>
                            handleRemoveCollaborator(collab.userId, collab.name)
                          }
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                          title="Remove collaborator"
                          disabled={loading}
                        >
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Granted Info */}
                  <div className="text-xs text-gray-500 mt-2 ml-13">
                    Added {new Date(collab.grantedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Role Legend */}
      <div className="pt-3 border-t border-gray-200 space-y-2">
        <h4 className="text-xs font-semibold text-gray-700 uppercase">Roles</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(roleConfig).map(([role, config]) => (
            <div key={role} className="text-xs">
              <div className="flex items-center gap-1.5 mb-0.5">
                <config.icon size={14} className={config.color} />
                <span className="font-medium text-gray-900">{config.label}</span>
              </div>
              <p className="text-gray-600 text-xs">{config.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Access Control Info */}
      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        <strong>Your role:</strong> {roleConfig[currentUserRole as keyof typeof roleConfig]?.label || currentUserRole}
        {!canManagePermissions && (
          <p className="mt-1 text-blue-600">
            You don't have permission to manage collaborators.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * RoleSelector
 * Standalone role selector component
 */
export const RoleSelector: React.FC<{
  value: 'viewer' | 'editor' | 'manager' | 'owner';
  onChange: (role: string) => void;
  disabled?: boolean;
  showDescription?: boolean;
}> = ({ value, onChange, disabled = false, showDescription = false }) => {
  const roleConfig = {
    owner: { label: 'Owner', description: 'Full control' },
    manager: { label: 'Manager', description: 'Can manage collaborators' },
    editor: { label: 'Editor', description: 'Can edit content' },
    viewer: { label: 'Viewer', description: 'Read-only access' },
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Role</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(roleConfig).map(([role, config]) => (
          <option key={role} value={role}>
            {config.label}
            {showDescription ? ` - ${config.description}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PermissionManager;
