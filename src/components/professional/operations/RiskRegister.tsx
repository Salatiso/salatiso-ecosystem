import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Target,
  Calendar,
  User
} from 'lucide-react';
import { AccessibleSelect, AccessibleButton } from '@/components/accessibility';
import { useOperations } from '@/hooks/useOperations';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { Risk } from '@/contexts/professional/ProfessionalContext';

interface RiskRegisterProps {
  className?: string;
}

interface RiskFormData {
  title: string;
  description: string;
  category: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'identified' | 'mitigating' | 'mitigated' | 'closed';
  owner: string;
  mitigationPlan: string;
  dueDate: string;
  projectId?: string;
}

export const RiskRegister: React.FC<RiskRegisterProps> = ({ className = '' }) => {
  const {
    operations,
    loading,
    error
  } = useOperations();

  const { activityLogger } = useBizHelpIntegration('');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock risks - in real implementation, this would come from operations.risks
  const mockRisks: Risk[] = [
    {
      id: '1',
      title: 'Resource Shortage',
      description: 'Potential shortage of skilled developers for Phase 3 implementation',
      category: 'Resource',
      probability: 'medium',
      impact: 'high',
      status: 'mitigating',
      owner: 'Project Manager',
      mitigationPlan: 'Hire additional developers and provide training to existing team members',
      dueDate: new Date('2024-02-15'),
      projectId: 'project-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      title: 'Technology Stack Changes',
      description: 'Potential need to upgrade or change technology stack mid-project',
      category: 'Technical',
      probability: 'low',
      impact: 'high',
      status: 'identified',
      owner: 'Technical Lead',
      mitigationPlan: 'Conduct technology assessment and plan migration strategy',
      dueDate: new Date('2024-03-01'),
      projectId: 'project-1',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '3',
      title: 'Budget Overrun',
      description: 'Project costs exceeding allocated budget',
      category: 'Financial',
      probability: 'medium',
      impact: 'medium',
      status: 'mitigated',
      owner: 'Finance Manager',
      mitigationPlan: 'Implement strict budget monitoring and approval processes',
      dueDate: new Date('2024-01-30'),
      projectId: 'project-2',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  const filteredRisks = mockRisks.filter(risk => {
    const matchesProject = selectedProject === 'all' || risk.projectId === selectedProject;
    const matchesStatus = filterStatus === 'all' || risk.status === filterStatus;
    return matchesProject && matchesStatus;
  });

  const getRiskLevel = (probability: string, impact: string) => {
    const probScore = { low: 1, medium: 2, high: 3 }[probability] || 1;
    const impactScore = { low: 1, medium: 2, high: 3 }[impact] || 1;
    const total = probScore * impactScore;

    if (total >= 6) return 'critical';
    if (total >= 4) return 'high';
    if (total >= 2) return 'medium';
    return 'low';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProbabilityIcon = (probability: string) => {
    switch (probability) {
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'medium': return <Minus className="h-4 w-4" />;
      case 'low': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified': return 'bg-gray-100 text-gray-800';
      case 'mitigating': return 'bg-blue-100 text-blue-800';
      case 'mitigated': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRisk = async (riskData: RiskFormData) => {
    try {
      // Log activity: risk identified
      await activityLogger?.log('risk_identified', {
        riskTitle: riskData.title,
        category: riskData.category,
        probability: riskData.probability,
        impact: riskData.impact,
        status: riskData.status,
        owner: riskData.owner,
        projectId: riskData.projectId
      });

      // In real implementation, this would call operations service
      console.log('Creating risk:', riskData);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create risk:', err);
    }
  };

  const handleUpdateRisk = async (riskId: string, updates: Partial<Risk>) => {
    try {
      // Log activity: mitigation plan created
      if (updates.mitigationPlan) {
        await activityLogger?.log('mitigation_plan_created', {
          riskId,
          riskTitle: updates.title,
          mitigationPlan: updates.mitigationPlan,
          status: updates.status,
          dueDate: updates.dueDate
        });
      }

      // In real implementation, this would call operations service
      console.log('Updating risk:', riskId, updates);
      setEditingRisk(null);
    } catch (err) {
      console.error('Failed to update risk:', err);
    }
  };

  const handleDeleteRisk = async (riskId: string) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        // In real implementation, this would call operations service
        console.log('Deleting risk:', riskId);
      } catch (err) {
        console.error('Failed to delete risk:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading risk register: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Register</h2>
          <p className="text-gray-600">Manage project risks and mitigation strategies</p>
        </div>
        <AccessibleButton
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Risk
        </AccessibleButton>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-64">
          <AccessibleSelect
            label="Project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={[
              { value: 'all', label: 'All Projects' },
              ...(operations.projects?.map(project => ({
                value: project.id,
                label: project.name
              })) || [])
            ]}
          />
        </div>
        <div className="sm:w-64">
          <AccessibleSelect
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'identified', label: 'Identified' },
              { value: 'mitigating', label: 'Mitigating' },
              { value: 'mitigated', label: 'Mitigated' },
              { value: 'closed', label: 'Closed' }
            ]}
          />
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Matrix</h3>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div></div>
          <div className="font-medium text-gray-700">Low Impact</div>
          <div className="font-medium text-gray-700">Medium Impact</div>
          <div className="font-medium text-gray-700">High Impact</div>

          <div className="font-medium text-gray-700 text-right pr-2">High Prob</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('critical')}`}>Critical</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('high')}`}>High</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('critical')}`}>Critical</div>

          <div className="font-medium text-gray-700 text-right pr-2">Med Prob</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('medium')}`}>Medium</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('medium')}`}>Medium</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('high')}`}>High</div>

          <div className="font-medium text-gray-700 text-right pr-2">Low Prob</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('low')}`}>Low</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('low')}`}>Low</div>
          <div className={`p-2 rounded border-2 ${getRiskLevelColor('medium')}`}>Medium</div>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-4">
        {filteredRisks.map((risk, index) => {
          const riskLevel = getRiskLevel(risk.probability, risk.impact);
          const projectName = operations.projects?.find(p => p.id === risk.projectId)?.name || 'Unknown Project';

          return (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{risk.title}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskLevelColor(riskLevel)}`}>
                      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(risk.status)}`}>
                      {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{risk.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Category: {risk.category}</span>
                    </div>
                    <div className="flex items-center">
                      {getProbabilityIcon(risk.probability)}
                      <span className="ml-2 text-gray-600">
                        Prob: {risk.probability.charAt(0).toUpperCase() + risk.probability.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Impact: {risk.impact.charAt(0).toUpperCase() + risk.impact.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Owner: {risk.owner}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Due: {risk.dueDate ? new Date(risk.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'No due date'}
                      </span>
                    </div>
                    {!selectedProject && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {projectName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <AccessibleButton
                    onClick={() => setEditingRisk(risk)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </AccessibleButton>
                  <AccessibleButton
                    onClick={() => handleDeleteRisk(risk.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </AccessibleButton>
                </div>
              </div>

              {risk.mitigationPlan && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Mitigation Plan</h4>
                  <p className="text-blue-800">{risk.mitigationPlan}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredRisks.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No risks found</h3>
          <p className="text-gray-600 mb-4">
            {selectedProject !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by identifying potential risks for your projects'}
          </p>
          <AccessibleButton
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add First Risk
          </AccessibleButton>
        </div>
      )}

      {/* Create/Edit Risk Modal */}
      {(showCreateForm || editingRisk) && (
        <RiskForm
          risk={editingRisk}
          projects={operations.projects || []}
          onSubmit={editingRisk ? (data) => handleUpdateRisk(editingRisk.id, data) : handleCreateRisk}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingRisk(null);
          }}
        />
      )}
    </div>
  );
};

// Risk Form Component
interface RiskFormProps {
  risk?: Risk | null;
  projects: any[];
  onSubmit: (data: RiskFormData) => void;
  onCancel: () => void;
}

const RiskForm: React.FC<RiskFormProps> = ({ risk, projects, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<RiskFormData>({
    title: risk?.title || '',
    description: risk?.description || '',
    category: risk?.category || 'Technical',
    probability: risk?.probability || 'medium',
    impact: risk?.impact || 'medium',
    status: risk?.status || 'identified',
    owner: risk?.owner || '',
    mitigationPlan: risk?.mitigationPlan || '',
    dueDate: risk?.dueDate ? new Date(risk.dueDate).toISOString().split('T')[0] : '',
    projectId: risk?.projectId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
    } as any);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {risk ? 'Edit Risk' : 'Create New Risk'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Technical">Technical</option>
                <option value="Resource">Resource</option>
                <option value="Financial">Financial</option>
                <option value="Schedule">Schedule</option>
                <option value="Quality">Quality</option>
                <option value="External">External</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Probability</label>
              <select
                value={formData.probability}
                onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="identified">Identified</option>
                <option value="mitigating">Mitigating</option>
                <option value="mitigated">Mitigated</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter risk owner name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mitigation Plan</label>
            <textarea
              value={formData.mitigationPlan}
              onChange={(e) => setFormData(prev => ({ ...prev, mitigationPlan: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe how this risk will be mitigated"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <AccessibleButton type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </AccessibleButton>
            <AccessibleButton type="submit">
              {risk ? 'Update Risk' : 'Create Risk'}
            </AccessibleButton>
          </div>
        </form>
      </div>
    </div>
  );
};