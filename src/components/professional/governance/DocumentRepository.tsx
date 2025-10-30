import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Edit3,
  Eye,
  Archive,
  CheckCircle,
  Clock,
  BookOpen,
  Users,
  Calendar,
  Tag,
  Download
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useGovernance } from '@/hooks/useGovernance';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { Policy } from '@/contexts/professional/ProfessionalContext';

interface DocumentRepositoryProps {
  className?: string;
}

export const DocumentRepository: React.FC<DocumentRepositoryProps> = ({ className }) => {
  const {
    governance,
    loading,
    error,
    loadPolicies,
    createPolicy,
    updatePolicy,
    acknowledgePolicy,
    getConstitution,
    updateConstitution
  } = useGovernance();

  // Get activity logger
  const { activityLogger } = useBizHelpIntegration('');

  const [activeTab, setActiveTab] = useState<'constitution' | 'policies'>('constitution');
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [viewingPolicyId, setViewingPolicyId] = useState<string | null>(null);
  const [constitution, setConstitution] = useState<string>('');
  const [constitutionApprovers, setConstitutionApprovers] = useState<string[]>([]);
  const [isEditingConstitution, setIsEditingConstitution] = useState(false);

  const [policyFormData, setPolicyFormData] = useState<Partial<Policy>>({
    title: '',
    content: '',
    category: '',
    version: 1,
    effectiveDate: new Date(),
    approvedBy: [],
    acknowledgments: [],
    status: 'draft'
  });

  const policies = governance?.policies || [];

  useEffect(() => {
    loadPolicies();
    loadConstitution();
  }, [loadPolicies]);

  const loadConstitution = async () => {
    try {
      const constitutionData = await getConstitution();
      if (constitutionData) {
        setConstitution(constitutionData.content || '');
        setConstitutionApprovers(constitutionData.approvedBy || []);
      }
    } catch (error) {
      console.error('Error loading constitution:', error);
    }
  };

  const handleConstitutionSave = async () => {
    if (!constitution.trim()) return;

    try {
      await updateConstitution(constitution, constitutionApprovers);
      
      // Log constitution update
      if (activityLogger) {
        await activityLogger.log('governance_document_updated', {
          documentType: 'constitution',
          approversCount: constitutionApprovers.length,
          contentLength: constitution.length,
          timestamp: new Date()
        });
      }
      
      setIsEditingConstitution(false);
    } catch (error) {
      console.error('Error saving constitution:', error);
    }
  };

  const handlePolicyInputChange = (field: keyof Policy, value: any) => {
    setPolicyFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPolicy = async () => {
    if (!policyFormData.title || !policyFormData.content || !policyFormData.category) {
      return;
    }

    try {
      await createPolicy({
        title: policyFormData.title,
        content: policyFormData.content,
        category: policyFormData.category,
        version: policyFormData.version || 1,
        effectiveDate: policyFormData.effectiveDate || new Date(),
        approvedBy: policyFormData.approvedBy || [],
        acknowledgments: policyFormData.acknowledgments || [],
        status: policyFormData.status || 'draft'
      });

      // Log policy creation
      if (activityLogger) {
        await activityLogger.log('governance_document_uploaded', {
          documentType: 'policy',
          documentName: policyFormData.title,
          category: policyFormData.category,
          version: policyFormData.version || 1,
          status: policyFormData.status || 'draft'
        });
      }

      setPolicyFormData({
        title: '',
        content: '',
        category: '',
        version: 1,
        effectiveDate: new Date(),
        approvedBy: [],
        acknowledgments: [],
        status: 'draft'
      });
      setIsAddingPolicy(false);
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  const handleEditPolicy = (policy: Policy) => {
    setPolicyFormData(policy);
    setEditingPolicyId(policy.id);
  };

  const handleUpdatePolicy = async () => {
    if (!editingPolicyId || !policyFormData.title || !policyFormData.content || !policyFormData.category) {
      return;
    }

    try {
      const oldPolicy = policies.find(p => p.id === editingPolicyId);
      
      await updatePolicy(editingPolicyId, {
        title: policyFormData.title,
        content: policyFormData.content,
        category: policyFormData.category,
        version: policyFormData.version || 1,
        effectiveDate: policyFormData.effectiveDate || new Date(),
        approvedBy: policyFormData.approvedBy || [],
        acknowledgments: policyFormData.acknowledgments || [],
        status: policyFormData.status || 'draft'
      });

      // Log policy update
      if (activityLogger) {
        await activityLogger.log('document_version_created', {
          documentName: policyFormData.title,
          category: policyFormData.category,
          newVersion: (policyFormData.version || 1) + 1,
          oldVersion: oldPolicy?.version || 1,
          status: policyFormData.status || 'draft'
        });
      }

      setPolicyFormData({
        title: '',
        content: '',
        category: '',
        version: 1,
        effectiveDate: new Date(),
        approvedBy: [],
        acknowledgments: [],
        status: 'draft'
      });
      setEditingPolicyId(null);
    } catch (error) {
      console.error('Error updating policy:', error);
    }
  };

  const handleCancel = () => {
    setPolicyFormData({
      title: '',
      content: '',
      category: '',
      version: 1,
      effectiveDate: new Date(),
      approvedBy: [],
      acknowledgments: [],
      status: 'draft'
    });
    setIsAddingPolicy(false);
    setEditingPolicyId(null);
    setViewingPolicyId(null);
    setIsEditingConstitution(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <span className="ml-3 text-gray-600">Loading documents...</span>
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
              <h2 className="text-xl font-semibold text-gray-900">Document Repository</h2>
              <p className="text-sm text-gray-600">Manage constitution, policies, and legal documents</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('constitution')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'constitution'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Constitution
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'policies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Policies ({policies.length})
          </button>
        </div>

        {/* Constitution Tab */}
        {activeTab === 'constitution' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Company Constitution</h3>
              {!isEditingConstitution && (
                <button
                  onClick={() => setIsEditingConstitution(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Constitution
                </button>
              )}
            </div>

            {isEditingConstitution ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Constitution Content</label>
                  <textarea
                    value={constitution}
                    onChange={(e) => setConstitution(e.target.value)}
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Enter the company constitution..."
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
                    onClick={handleConstitutionSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Constitution
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                {constitution ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{constitution}</pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Constitution</h3>
                    <p className="text-gray-500 mb-4">Create your company constitution to establish governance framework</p>
                    <button
                      onClick={() => setIsEditingConstitution(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Create Constitution
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Company Policies</h3>
              <button
                onClick={() => setIsAddingPolicy(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4" />
                Add Policy
              </button>
            </div>

            {/* Add/Edit Policy Form */}
            {(isAddingPolicy || editingPolicyId) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {isAddingPolicy ? 'Add New Policy' : 'Edit Policy'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <AccessibleInput
                    label="Policy Title"
                    value={policyFormData.title || ''}
                    onChange={(e) => handlePolicyInputChange('title', e.target.value)}
                    placeholder="Enter policy title"
                    className="w-full"
                  />

                  <AccessibleInput
                    label="Category"
                    value={policyFormData.category || ''}
                    onChange={(e) => handlePolicyInputChange('category', e.target.value)}
                    placeholder="e.g., HR, Finance, Operations"
                    className="w-full"
                  />

                  <AccessibleInput
                    label="Version"
                    type="number"
                    value={policyFormData.version?.toString() || '1'}
                    onChange={(e) => handlePolicyInputChange('version', parseInt(e.target.value) || 1)}
                    className="w-full"
                  />

                  <AccessibleInput
                    label="Effective Date"
                    type="date"
                    value={policyFormData.effectiveDate ? policyFormData.effectiveDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handlePolicyInputChange('effectiveDate', new Date(e.target.value))}
                    className="w-full"
                  />

                  <AccessibleSelect
                    label="Status"
                    value={policyFormData.status || 'draft'}
                    onChange={(e) => handlePolicyInputChange('status', e.target.value)}
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'active', label: 'Active' },
                      { value: 'archived', label: 'Archived' }
                    ]}
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Policy Content</label>
                  <textarea
                    value={policyFormData.content || ''}
                    onChange={(e) => handlePolicyInputChange('content', e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Enter the policy content..."
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
                    onClick={isAddingPolicy ? handleAddPolicy : handleUpdatePolicy}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isAddingPolicy ? 'Add Policy' : 'Update Policy'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Policies List */}
            <div className="space-y-4">
              {policies.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Policies</h3>
                  <p className="text-gray-500 mb-4">Create company policies to establish operational guidelines</p>
                  <button
                    onClick={() => setIsAddingPolicy(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create First Policy
                  </button>
                </div>
              ) : (
                policies.map((policy) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(policy.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{policy.title}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(policy.status)}`}>
                              {policy.status}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              v{policy.version}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              {policy.category}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Effective: {policy.effectiveDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {policy.acknowledgments?.length || 0} acknowledgments
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2">
                            {policy.content.substring(0, 200)}...
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingPolicyId(policy.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View policy"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditPolicy(policy)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit policy"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};