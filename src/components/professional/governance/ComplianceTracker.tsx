import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Plus,
  Edit3,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  Trash2
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useGovernance } from '@/hooks/useGovernance';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { ComplianceRecord } from '@/contexts/professional/ProfessionalContext';

interface ComplianceTrackerProps {
  className?: string;
}

export const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({ className }) => {
  const {
    governance,
    loading,
    error,
    loadComplianceRecords,
    createComplianceRecord,
    updateComplianceRecord
  } = useGovernance();

  // Get activity logger - using empty string for now as we don't have company ID in this context
  const { activityLogger } = useBizHelpIntegration('');

  const complianceRecords = governance?.compliance || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ComplianceRecord>>({
    type: '',
    description: '',
    dueDate: new Date(),
    status: 'pending',
    assignedTo: '',
    documents: []
  });

  useEffect(() => {
    loadComplianceRecords();
  }, [loadComplianceRecords]);

  const handleInputChange = (field: keyof ComplianceRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    if (!formData.type || !formData.description || !formData.dueDate || !formData.assignedTo) {
      return;
    }

    try {
      await createComplianceRecord({
        type: formData.type,
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status || 'pending',
        assignedTo: formData.assignedTo,
        documents: formData.documents || []
      });

      // Log compliance obligation creation
      if (activityLogger) {
        await activityLogger.log('compliance_obligation_created', {
          obligationType: formData.type,
          description: formData.description,
          dueDate: formData.dueDate,
          assignedTo: formData.assignedTo,
          status: formData.status || 'pending'
        });
      }

      setFormData({
        type: '',
        description: '',
        dueDate: new Date(),
        status: 'pending',
        assignedTo: '',
        documents: []
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating compliance record:', error);
    }
  };

  const handleEdit = (record: ComplianceRecord) => {
    setFormData(record);
    setEditingId(record.id);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.type || !formData.description || !formData.dueDate || !formData.assignedTo) {
      return;
    }

    try {
      const oldRecord = complianceRecords.find(r => r.id === editingId);
      const oldStatus = oldRecord?.status;

      await updateComplianceRecord(editingId, {
        type: formData.type,
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status || 'pending',
        assignedTo: formData.assignedTo,
        documents: formData.documents || []
      });

      // Log compliance status update
      if (activityLogger) {
        const changes: Record<string, any> = {};
        if (oldStatus !== formData.status) {
          changes.status = { from: oldStatus, to: formData.status };
        }

        await activityLogger.log('compliance_status_updated', {
          obligationType: formData.type,
          description: formData.description,
          oldStatus,
          newStatus: formData.status,
          changes: Object.keys(changes).length > 0 ? changes : { status: 'updated' }
        });

        // If marked as completed, log separately
        if (formData.status === 'completed' && oldStatus !== 'completed') {
          await activityLogger.log('compliance_completed', {
            obligationType: formData.type,
            description: formData.description,
            completionDate: new Date(),
            assignedTo: formData.assignedTo
          });
        }
      }

      setFormData({
        type: '',
        description: '',
        dueDate: new Date(),
        status: 'pending',
        assignedTo: '',
        documents: []
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating compliance record:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      type: '',
      description: '',
      dueDate: new Date(),
      status: 'pending',
      assignedTo: '',
      documents: []
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
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
          <span className="ml-3 text-gray-600">Loading compliance records...</span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Compliance Records</h3>
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
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Compliance Tracker</h2>
              <p className="text-sm text-gray-600">Track regulatory compliance, policies, and audit requirements</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Compliance Record
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg border"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isAdding ? 'Add Compliance Record' : 'Edit Compliance Record'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AccessibleInput
                label="Type"
                value={formData.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value)}
                placeholder="e.g., Tax Filing, Audit, Regulatory Report"
                className="w-full"
              />

              <AccessibleInput
                label="Assigned To"
                value={formData.assignedTo || ''}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="Person responsible"
                className="w-full"
              />

              <AccessibleInput
                label="Due Date"
                type="date"
                value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('dueDate', new Date(e.target.value))}
                className="w-full"
              />

              <AccessibleSelect
                label="Status"
                value={formData.status || 'pending'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'overdue', label: 'Overdue' }
                ]}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <AccessibleInput
                label="Description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the compliance requirement"
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
                {isAdding ? 'Add Record' : 'Update Record'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Compliance Records List */}
        <div className="space-y-4">
          {complianceRecords.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Records</h3>
              <p className="text-gray-500 mb-4">Start tracking your compliance requirements</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add First Record
              </button>
            </div>
          ) : (
            complianceRecords.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(record.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{record.type}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{record.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {record.dueDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {record.assignedTo}
                        </div>
                        {record.documents.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {record.documents.length} document{record.documents.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit record"
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