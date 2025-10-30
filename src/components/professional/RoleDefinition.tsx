import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  Users,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useHumanCapital } from '@/hooks/useHumanCapital';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { Role } from '@/contexts/professional/ProfessionalContext';

interface RoleDefinitionProps {
  className?: string;
}

export const RoleDefinition: React.FC<RoleDefinitionProps> = ({ className }) => {
  const {
    humanCapital,
    loading,
    error,
    loadRoles,
    createRole,
    updateRole,
    deleteRole
  } = useHumanCapital();

  const { activityLogger } = useBizHelpIntegration('');

  const roles = humanCapital?.roles || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    title: '',
    description: '',
    department: '',
    level: 'entry',
    salaryRange: { min: 0, max: 0, currency: 'ZAR' },
    responsibilities: [],
    requirements: [],
    permissions: [],
    status: 'active'
  });

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleInputChange = (field: keyof Role, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.description || !formData.department) {
      return;
    }

    try {
      await createRole({
        title: formData.title,
        description: formData.description,
        department: formData.department,
        level: formData.level || 'entry',
        salaryRange: formData.salaryRange || { min: 0, max: 0, currency: 'ZAR' },
        responsibilities: formData.responsibilities || [],
        requirements: formData.requirements || [],
        permissions: formData.permissions || [],
        status: formData.status || 'active'
      });

      // Log activity: role created
      await activityLogger?.log('role_created', {
        roleTitle: formData.title,
        department: formData.department,
        level: formData.level || 'entry',
        salaryMin: formData.salaryRange?.min || 0,
        salaryMax: formData.salaryRange?.max || 0,
        status: formData.status || 'active'
      });

      resetForm();
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleEdit = (role: Role) => {
    setFormData(role);
    setEditingId(role.id);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.title || !formData.description || !formData.department) {
      return;
    }

    try {
      await updateRole(editingId, {
        title: formData.title,
        description: formData.description,
        department: formData.department,
        level: formData.level || 'entry',
        salaryRange: formData.salaryRange || { min: 0, max: 0, currency: 'ZAR' },
        responsibilities: formData.responsibilities || [],
        requirements: formData.requirements || [],
        permissions: formData.permissions || [],
        status: formData.status || 'active'
      });

      // Log activity: role updated
      await activityLogger?.log('role_updated', {
        roleTitle: formData.title,
        department: formData.department,
        level: formData.level || 'entry',
        salaryMin: formData.salaryRange?.min || 0,
        salaryMax: formData.salaryRange?.max || 0,
        status: formData.status || 'active'
      });

      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteRole(roleId);
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department: '',
      level: 'entry',
      salaryRange: { min: 0, max: 0, currency: 'ZAR' },
      responsibilities: [],
      requirements: [],
      permissions: [],
      status: 'active'
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-lg shadow p-6 ${className}`}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading roles...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-lg shadow p-6 ${className}`}
      >
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Roles</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Role Definitions</h2>
              <p className="text-sm text-gray-600">Define organizational roles, responsibilities, and requirements</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Role
          </button>
        </div>

        {/* Add/Edit Role Modal */}
        <AnimatePresence>
          {(isAdding || editingId) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {isAdding ? 'Add New Role' : 'Edit Role'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <AccessibleInput
                      label="Role Title"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <AccessibleSelect
                      label="Department"
                      value={formData.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      options={[
                        { value: 'engineering', label: 'Engineering' },
                        { value: 'design', label: 'Design' },
                        { value: 'product', label: 'Product' },
                        { value: 'marketing', label: 'Marketing' },
                        { value: 'sales', label: 'Sales' },
                        { value: 'hr', label: 'Human Resources' },
                        { value: 'finance', label: 'Finance' },
                        { value: 'operations', label: 'Operations' },
                        { value: 'executive', label: 'Executive' }
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <AccessibleInput
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of the role and its purpose"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <AccessibleSelect
                      label="Level"
                      value={formData.level || 'entry'}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      options={[
                        { value: 'entry', label: 'Entry Level' },
                        { value: 'junior', label: 'Junior' },
                        { value: 'mid', label: 'Mid Level' },
                        { value: 'senior', label: 'Senior' },
                        { value: 'lead', label: 'Lead' },
                        { value: 'principal', label: 'Principal' },
                        { value: 'executive', label: 'Executive' }
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <AccessibleInput
                      label="Min Salary"
                      type="number"
                      value={formData.salaryRange?.min?.toString() || ''}
                      onChange={(e) => handleInputChange('salaryRange', {
                        ...formData.salaryRange,
                        min: parseFloat(e.target.value) || 0
                      })}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <AccessibleInput
                      label="Max Salary"
                      type="number"
                      value={formData.salaryRange?.max?.toString() || ''}
                      onChange={(e) => handleInputChange('salaryRange', {
                        ...formData.salaryRange,
                        max: parseFloat(e.target.value) || 0
                      })}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isAdding ? handleAdd : handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isAdding ? 'Add Role' : 'Update Role'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roles List */}
        <div className="space-y-4">
          {roles.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Roles Defined</h3>
              <p className="text-gray-500 mb-4">Start building your organizational structure by defining roles</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add First Role
              </button>
            </div>
          ) : (
            roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        role.level === 'executive' ? 'bg-purple-100 text-purple-800' :
                        role.level === 'senior' ? 'bg-blue-100 text-blue-800' :
                        role.level === 'mid' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {role.level}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {role.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{role.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {role.department}
                      </span>
                      {role.salaryRange && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {role.salaryRange.currency} {role.salaryRange.min?.toLocaleString()} - {role.salaryRange.max?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(role)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit role"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};