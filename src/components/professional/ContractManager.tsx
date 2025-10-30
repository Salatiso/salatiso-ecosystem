import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  PenTool,
  Eye,
  Send
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useHumanCapital } from '@/hooks/useHumanCapital';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { Contract } from '@/contexts/professional/ProfessionalContext';

interface ContractManagerProps {
  className?: string;
}

export const ContractManager: React.FC<ContractManagerProps> = ({ className }) => {
  const {
    humanCapital,
    loading,
    error,
    loadContracts,
    createContract,
    updateContract,
    deleteContract
  } = useHumanCapital();

  const { activityLogger } = useBizHelpIntegration('');

  const contracts = humanCapital?.contracts || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Contract>>({
    title: '',
    type: 'employment',
    employeeId: '',
    templateId: '',
    content: '',
    status: 'draft',
    startDate: new Date(),
    endDate: new Date(),
    signatures: [],
    attachments: []
  });

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const handleInputChange = (field: keyof Contract, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.employeeId || !formData.content) {
      return;
    }

    try {
      await createContract({
        title: formData.title,
        type: formData.type || 'employment',
        employeeId: formData.employeeId,
        templateId: formData.templateId || '',
        content: formData.content,
        status: formData.status || 'draft',
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || new Date(),
        signatures: formData.signatures || [],
        attachments: formData.attachments || []
      });

      // Log activity: contract created
      await activityLogger?.log('contract_created', {
        contractTitle: formData.title,
        contractType: formData.type || 'employment',
        employeeId: formData.employeeId,
        status: formData.status || 'draft',
        startDate: formData.startDate,
        endDate: formData.endDate
      });

      resetForm();
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  const handleEdit = (contract: Contract) => {
    setFormData(contract);
    setEditingId(contract.id);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.title || !formData.employeeId || !formData.content) {
      return;
    }

    try {
      await updateContract(editingId, {
        title: formData.title,
        type: formData.type || 'employment',
        employeeId: formData.employeeId,
        templateId: formData.templateId || '',
        content: formData.content,
        status: formData.status || 'draft',
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || new Date(),
        signatures: formData.signatures || [],
        attachments: formData.attachments || []
      });

      // Log activity: contract signed (if status changed to signed)
      if (formData.status === 'signed') {
        await activityLogger?.log('contract_signed', {
          contractTitle: formData.title,
          contractType: formData.type || 'employment',
          employeeId: formData.employeeId,
          signedDate: new Date(),
          endDate: formData.endDate
        });
      }

      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  const handleDelete = async (contractId: string) => {
    if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteContract(contractId);
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  const handleSendForSignature = async (contractId: string) => {
    // Implementation for sending contract for e-signature
    alert('E-signature functionality would be integrated here with services like DocuSign or HelloSign');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'employment',
      employeeId: '',
      templateId: '',
      content: '',
      status: 'draft',
      startDate: new Date(),
      endDate: new Date(),
      signatures: [],
      attachments: []
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
    setViewingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_signature': return 'bg-yellow-100 text-yellow-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit3 className="h-4 w-4" />;
      case 'pending_signature': return <Clock className="h-4 w-4" />;
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
          <span className="ml-3 text-gray-600">Loading contracts...</span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Contracts</h3>
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
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Contract Management</h2>
              <p className="text-sm text-gray-600">Create, manage, and track employment contracts with e-signature integration</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Contract
          </button>
        </div>

        {/* Add/Edit Contract Modal */}
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
                className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {isAdding ? 'Create New Contract' : 'Edit Contract'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <AccessibleInput
                      label="Contract Title"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Employment Contract - John Doe"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <AccessibleSelect
                      label="Contract Type"
                      value={formData.type || 'employment'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      options={[
                        { value: 'employment', label: 'Employment Contract' },
                        { value: 'consulting', label: 'Consulting Agreement' },
                        { value: 'nda', label: 'Non-Disclosure Agreement' },
                        { value: 'contractor', label: 'Independent Contractor' },
                        { value: 'internship', label: 'Internship Agreement' },
                        { value: 'probation', label: 'Probation Agreement' }
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <AccessibleInput
                      label="Employee ID"
                      value={formData.employeeId || ''}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      placeholder="Employee identifier"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <AccessibleSelect
                      label="Status"
                      value={formData.status || 'draft'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'pending_signature', label: 'Pending Signature' },
                        { value: 'signed', label: 'Signed' },
                        { value: 'expired', label: 'Expired' }
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <AccessibleInput
                      label="Start Date"
                      type="date"
                      value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('startDate', new Date(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <AccessibleInput
                      label="End Date"
                      type="date"
                      value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('endDate', new Date(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Content
                  </label>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contract content or use a template..."
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
                    {isAdding ? 'Create Contract' : 'Update Contract'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Contract Modal */}
        <AnimatePresence>
          {viewingId && (
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
                className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Contract Details</h3>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {(() => {
                  const contract = contracts.find(c => c.id === viewingId);
                  if (!contract) return null;

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <p className="text-gray-900">{contract.title}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type</label>
                          <p className="text-gray-900">{contract.type}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto whitespace-pre-wrap">
                          {contract.content}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contracts List */}
        <div className="space-y-4">
          {contracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Contracts</h3>
              <p className="text-gray-500 mb-4">Start managing employment contracts and agreements</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create First Contract
              </button>
            </div>
          ) : (
            contracts.map((contract) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{contract.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(contract.status)}`}>
                        {getStatusIcon(contract.status)}
                        {contract.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>Type: {contract.type}</span>
                      <span>Employee: {contract.employeeId}</span>
                      {contract.startDate && (
                        <span>Start: {contract.startDate.toLocaleDateString()}</span>
                      )}
                      {contract.endDate && (
                        <span>End: {contract.endDate.toLocaleDateString()}</span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {contract.content?.substring(0, 200)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setViewingId(contract.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View contract"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(contract)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit contract"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {contract.status === 'draft' && (
                      <button
                        onClick={() => handleSendForSignature(contract.id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Send for signature"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(contract.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete contract"
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