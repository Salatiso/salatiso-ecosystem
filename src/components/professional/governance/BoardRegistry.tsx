import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Edit3,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Phone,
  Crown
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useGovernance } from '@/hooks/useGovernance';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { BoardMember } from '@/contexts/professional/ProfessionalContext';

interface BoardRegistryProps {
  className?: string;
}

export const BoardRegistry: React.FC<BoardRegistryProps> = ({ className }) => {
  const {
    governance,
    loading,
    error,
    loadBoardMembers,
    addBoardMember,
    updateBoardMember
  } = useGovernance();

  // Get activity logger
  const { activityLogger } = useBizHelpIntegration('');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BoardMember>>({
    name: '',
    position: '',
    appointedDate: new Date(),
    termEnd: undefined,
    contact: {
      email: '',
      phone: ''
    },
    status: 'active'
  });

  useEffect(() => {
    loadBoardMembers();
  }, [loadBoardMembers]);

  const boardMembers = governance?.board || [];

  const handleInputChange = (field: keyof BoardMember, value: any) => {
    if (field === 'contact') {
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact!, ...value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.position || !formData.appointedDate || !formData.contact?.email) {
      return;
    }

    try {
      await addBoardMember({
        name: formData.name,
        position: formData.position,
        appointedDate: formData.appointedDate,
        termEnd: formData.termEnd,
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone || ''
        },
        status: formData.status || 'active'
      });

      // Log board member addition
      if (activityLogger) {
        await activityLogger.log('board_member_added', {
          memberName: formData.name,
          position: formData.position,
          appointedDate: formData.appointedDate,
          email: formData.contact.email,
          status: formData.status || 'active'
        });
      }

      setFormData({
        name: '',
        position: '',
        appointedDate: new Date(),
        termEnd: undefined,
        contact: {
          email: '',
          phone: ''
        },
        status: 'active'
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding board member:', error);
    }
  };

  const handleEdit = (member: BoardMember) => {
    setFormData(member);
    setEditingId(member.id);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.position || !formData.appointedDate || !formData.contact?.email) {
      return;
    }

    try {
      const oldMember = boardMembers.find(m => m.id === editingId);
      
      await updateBoardMember(editingId, {
        name: formData.name,
        position: formData.position,
        appointedDate: formData.appointedDate,
        termEnd: formData.termEnd,
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone || ''
        },
        status: formData.status || 'active'
      });

      // Log board member update
      if (activityLogger) {
        await activityLogger.log('board_member_updated', {
          memberName: formData.name,
          oldPosition: oldMember?.position,
          newPosition: formData.position,
          status: formData.status || 'active',
          updatedDate: new Date()
        });
      }

      setFormData({
        name: '',
        position: '',
        appointedDate: new Date(),
        termEnd: undefined,
        contact: {
          email: '',
          phone: ''
        },
        status: 'active'
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating board member:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      position: '',
      appointedDate: new Date(),
      termEnd: undefined,
      contact: {
        email: '',
        phone: ''
      },
      status: 'active'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <UserCheck className="h-5 w-5 text-green-500" />
    ) : (
      <UserX className="h-5 w-5 text-gray-500" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isChairperson = (position: string) => {
    return position.toLowerCase().includes('chair') || position.toLowerCase().includes('president');
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
          <span className="ml-3 text-gray-600">Loading board members...</span>
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
          <UserX className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Board Members</h3>
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
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Board Registry</h2>
              <p className="text-sm text-gray-600">Manage board members, positions, and governance records</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Board Member
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isAdding ? 'Add Board Member' : 'Edit Board Member'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AccessibleInput
                label="Full Name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="w-full"
              />

              <AccessibleInput
                label="Position"
                value={formData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g., Chairperson, Director, Secretary"
                className="w-full"
              />

              <AccessibleInput
                label="Appointed Date"
                type="date"
                value={formData.appointedDate ? formData.appointedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('appointedDate', new Date(e.target.value))}
                className="w-full"
              />

              <AccessibleInput
                label="Term End Date (Optional)"
                type="date"
                value={formData.termEnd ? formData.termEnd.toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('termEnd', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full"
              />

              <AccessibleInput
                label="Email"
                type="email"
                value={formData.contact?.email || ''}
                onChange={(e) => handleInputChange('contact', { email: e.target.value })}
                placeholder="Enter email address"
                className="w-full"
              />

              <AccessibleInput
                label="Phone (Optional)"
                value={formData.contact?.phone || ''}
                onChange={(e) => handleInputChange('contact', { phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full"
              />

              <AccessibleSelect
                label="Status"
                value={formData.status || 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
                className="w-full"
              />
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
                {isAdding ? 'Add Member' : 'Update Member'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Board Members List */}
        <div className="space-y-4">
          {boardMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Board Members</h3>
              <p className="text-gray-500 mb-4">Start building your company's board of directors</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add First Member
              </button>
            </div>
          ) : (
            boardMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {isChairperson(member.position) && (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      )}
                      {getStatusIcon(member.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                        {isChairperson(member.position) && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Chairperson
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">{member.position}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Appointed: {member.appointedDate.toLocaleDateString()}
                        </div>
                        {member.termEnd && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Term Ends: {member.termEnd.toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {member.contact.email}
                        </div>
                        {member.contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {member.contact.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit member"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};