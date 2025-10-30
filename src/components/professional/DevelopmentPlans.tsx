import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Award
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useHumanCapital } from '@/hooks/useHumanCapital';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { DevelopmentPlan } from '@/contexts/professional/ProfessionalContext';

interface DevelopmentPlansProps {
  className?: string;
}

export const DevelopmentPlans: React.FC<DevelopmentPlansProps> = ({ className }) => {
  const {
    humanCapital,
    loading,
    error,
    loadDevelopmentPlans,
    createDevelopmentPlan,
    updateDevelopmentPlan,
    deleteDevelopmentPlan
  } = useHumanCapital();

  const { activityLogger } = useBizHelpIntegration('');

  const developmentPlans = humanCapital?.development || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DevelopmentPlan>>({
    employeeId: '',
    title: '',
    description: '',
    objectives: [],
    courses: [],
    certifications: [],
    startDate: new Date(),
    targetCompletionDate: new Date(),
    status: 'planned',
    progress: 0,
    academyLinks: []
  });

  useEffect(() => {
    loadDevelopmentPlans();
  }, [loadDevelopmentPlans]);

  const handleInputChange = (field: keyof DevelopmentPlan, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    if (!formData.employeeId || !formData.title || !formData.description) {
      return;
    }

    try {
      await createDevelopmentPlan({
        employeeId: formData.employeeId,
        title: formData.title,
        description: formData.description,
        objectives: formData.objectives || [],
        courses: formData.courses || [],
        certifications: formData.certifications || [],
        startDate: formData.startDate || new Date(),
        targetCompletionDate: formData.targetCompletionDate || new Date(),
        status: formData.status || 'planned',
        progress: formData.progress || 0,
        academyLinks: formData.academyLinks || []
      });

      // Log activity: development plan created
      await activityLogger?.log('development_plan_created', {
        employeeId: formData.employeeId,
        planTitle: formData.title,
        objectivesCount: formData.objectives?.length || 0,
        coursesCount: formData.courses?.length || 0,
        certificationsCount: formData.certifications?.length || 0,
        startDate: formData.startDate,
        targetCompletionDate: formData.targetCompletionDate,
        status: formData.status || 'planned'
      });

      resetForm();
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating development plan:', error);
    }
  };

  const handleEdit = (plan: DevelopmentPlan) => {
    setFormData(plan);
    setEditingId(plan.id);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.employeeId || !formData.title || !formData.description) {
      return;
    }

    try {
      await updateDevelopmentPlan(editingId, {
        employeeId: formData.employeeId,
        title: formData.title,
        description: formData.description,
        objectives: formData.objectives || [],
        courses: formData.courses || [],
        certifications: formData.certifications || [],
        startDate: formData.startDate || new Date(),
        targetCompletionDate: formData.targetCompletionDate || new Date(),
        status: formData.status || 'planned',
        progress: formData.progress || 0,
        academyLinks: formData.academyLinks || []
      });

      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating development plan:', error);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this development plan? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDevelopmentPlan(planId);
    } catch (error) {
      console.error('Error deleting development plan:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      title: '',
      description: '',
      objectives: [],
      courses: [],
      certifications: [],
      startDate: new Date(),
      targetCompletionDate: new Date(),
      status: 'planned',
      progress: 0,
      academyLinks: []
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return <Calendar className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on_hold': return <AlertTriangle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <GraduationCap className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
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
          <span className="ml-3 text-gray-600">Loading development plans...</span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Development Plans</h3>
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
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Development Plans</h2>
              <p className="text-sm text-gray-600">Create personalized learning paths linked to Sazi Life Academy</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Plan
          </button>
        </div>

        {/* Add/Edit Development Plan Modal */}
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
                  {isAdding ? 'Create Development Plan' : 'Edit Development Plan'}
                </h3>

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
                    <AccessibleInput
                      label="Plan Title"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Leadership Development Program"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the development goals and objectives..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <AccessibleSelect
                      label="Status"
                      value={formData.status || 'planned'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      options={[
                        { value: 'planned', label: 'Planned' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'on_hold', label: 'On Hold' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ]}
                      className="w-full"
                    />
                  </div>

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
                      label="Target Completion"
                      type="date"
                      value={formData.targetCompletionDate ? formData.targetCompletionDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('targetCompletionDate', new Date(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress ({formData.progress || 0}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress || 0}
                    onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Courses
                    </label>
                    <textarea
                      value={formData.courses?.join('\n') || ''}
                      onChange={(e) => handleInputChange('courses', e.target.value.split('\n').filter(course => course.trim()))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="List required courses (one per line)..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Certifications
                    </label>
                    <textarea
                      value={formData.certifications?.join('\n') || ''}
                      onChange={(e) => handleInputChange('certifications', e.target.value.split('\n').filter(cert => cert.trim()))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="List target certifications (one per line)..."
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sazi Life Academy Links
                  </label>
                  <textarea
                    value={formData.academyLinks?.join('\n') || ''}
                    onChange={(e) => handleInputChange('academyLinks', e.target.value.split('\n').filter(link => link.trim()))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add links to relevant Sazi Life Academy courses (one per line)..."
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
                    {isAdding ? 'Create Plan' : 'Update Plan'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Development Plans List */}
        <div className="space-y-4">
          {developmentPlans.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Development Plans</h3>
              <p className="text-gray-500 mb-4">Create personalized development plans linked to Sazi Life Academy courses</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create First Plan
              </button>
            </div>
          ) : (
            developmentPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                        <p className="text-sm text-gray-600">Employee: {plan.employeeId}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(plan.status)}`}>
                        {getStatusIcon(plan.status)}
                        {plan.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{plan.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{plan.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(plan.progress)}`}
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {plan.startDate.toLocaleDateString()} - {plan.targetCompletionDate.toLocaleDateString()}
                      </span>
                      {plan.courses && plan.courses.length > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {plan.courses.length} courses
                        </span>
                      )}
                      {plan.certifications && plan.certifications.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {plan.certifications.length} certifications
                        </span>
                      )}
                    </div>

                    {/* Academy Links */}
                    {plan.academyLinks && plan.academyLinks.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Sazi Life Academy:</p>
                        <div className="flex flex-wrap gap-2">
                          {plan.academyLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Course {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Objectives */}
                    {plan.objectives && plan.objectives.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Objectives:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {plan.objectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="h-3 w-3 mt-0.5 text-blue-600 flex-shrink-0" />
                              <span>{objective}</span>
                            </li>
                          ))}
                          {plan.objectives.length > 3 && (
                            <li className="text-gray-500">...and {plan.objectives.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit plan"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete plan"
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