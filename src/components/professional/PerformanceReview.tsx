import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Users,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Target
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useHumanCapital } from '@/hooks/useHumanCapital';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { PerformanceReview } from '@/contexts/professional/ProfessionalContext';

interface PerformanceReviewProps {
  className?: string;
}

export const PerformanceReviewComponent: React.FC<PerformanceReviewProps> = ({ className }) => {
  const {
    humanCapital,
    loading,
    error,
    loadPerformanceReviews,
    createPerformanceReview,
    updatePerformanceReview,
    deletePerformanceReview
  } = useHumanCapital();

  const { activityLogger } = useBizHelpIntegration('');

  const performanceReviews = humanCapital?.performance || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PerformanceReview>>({
    employeeId: '',
    reviewerId: '',
    reviewPeriod: { start: new Date(), end: new Date() },
    overallRating: 3,
    categories: [],
    goals: [],
    feedback: '',
    developmentPlan: '',
    status: 'draft',
    reviewType: 'annual'
  });

  useEffect(() => {
    loadPerformanceReviews();
  }, [loadPerformanceReviews]);

  const handleInputChange = (field: keyof PerformanceReview, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    if (!formData.employeeId || !formData.reviewerId || !formData.feedback) {
      return;
    }

    try {
      await createPerformanceReview({
        employeeId: formData.employeeId,
        reviewerId: formData.reviewerId,
        reviewPeriod: formData.reviewPeriod || { start: new Date(), end: new Date() },
        overallRating: formData.overallRating || 3,
        categories: formData.categories || [],
        goals: formData.goals || [],
        feedback: formData.feedback,
        developmentPlan: formData.developmentPlan || '',
        status: formData.status || 'draft',
        reviewType: formData.reviewType || 'annual'
      });

      // Log activity: performance review submitted
      await activityLogger?.log('performance_review_submitted', {
        employeeId: formData.employeeId,
        reviewerId: formData.reviewerId,
        overallRating: formData.overallRating || 3,
        reviewType: formData.reviewType || 'annual',
        status: formData.status || 'draft',
        reviewPeriodStart: formData.reviewPeriod?.start,
        reviewPeriodEnd: formData.reviewPeriod?.end
      });

      resetForm();
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating performance review:', error);
    }
  };

  const handleEdit = (review: PerformanceReview) => {
    setFormData(review);
    setEditingId(review.id);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.employeeId || !formData.reviewerId || !formData.feedback) {
      return;
    }

    try {
      await updatePerformanceReview(editingId, {
        employeeId: formData.employeeId,
        reviewerId: formData.reviewerId,
        reviewPeriod: formData.reviewPeriod || { start: new Date(), end: new Date() },
        overallRating: formData.overallRating || 3,
        categories: formData.categories || [],
        goals: formData.goals || [],
        feedback: formData.feedback,
        developmentPlan: formData.developmentPlan || '',
        status: formData.status || 'draft',
        reviewType: formData.reviewType || 'annual'
      });

      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating performance review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this performance review? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePerformanceReview(reviewId);
    } catch (error) {
      console.error('Error deleting performance review:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      reviewerId: '',
      reviewPeriod: { start: new Date(), end: new Date() },
      overallRating: 3,
      categories: [],
      goals: [],
      feedback: '',
      developmentPlan: '',
      status: 'draft',
      reviewType: 'annual'
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit3 className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
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
          <span className="ml-3 text-gray-600">Loading performance reviews...</span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Performance Reviews</h3>
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
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Performance Management</h2>
              <p className="text-sm text-gray-600">Conduct performance reviews, track goals, and manage employee development</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Review
          </button>
        </div>

        {/* Add/Edit Performance Review Modal */}
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
                  {isAdding ? 'Create Performance Review' : 'Edit Performance Review'}
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
                      label="Reviewer ID"
                      value={formData.reviewerId || ''}
                      onChange={(e) => handleInputChange('reviewerId', e.target.value)}
                      placeholder="Reviewer identifier"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <AccessibleSelect
                      label="Review Type"
                      value={formData.reviewType || 'annual'}
                      onChange={(e) => handleInputChange('reviewType', e.target.value)}
                      options={[
                        { value: 'annual', label: 'Annual Review' },
                        { value: 'mid_year', label: 'Mid-Year Review' },
                        { value: 'probation', label: 'Probation Review' },
                        { value: 'project', label: 'Project Review' },
                        { value: 'ad_hoc', label: 'Ad-hoc Review' }
                      ]}
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
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Rating
                    </label>
                    {renderStars(formData.overallRating || 3, true, (rating) =>
                      handleInputChange('overallRating', rating)
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <AccessibleInput
                      label="Review Period Start"
                      type="date"
                      value={formData.reviewPeriod?.start ? formData.reviewPeriod.start.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('reviewPeriod', {
                        ...formData.reviewPeriod,
                        start: new Date(e.target.value)
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <AccessibleInput
                      label="Review Period End"
                      type="date"
                      value={formData.reviewPeriod?.end ? formData.reviewPeriod.end.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('reviewPeriod', {
                        ...formData.reviewPeriod,
                        end: new Date(e.target.value)
                      })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Feedback
                  </label>
                  <textarea
                    value={formData.feedback || ''}
                    onChange={(e) => handleInputChange('feedback', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed feedback on performance, achievements, and areas for improvement..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Development Plan
                  </label>
                  <textarea
                    value={formData.developmentPlan || ''}
                    onChange={(e) => handleInputChange('developmentPlan', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Outline development goals, training needs, and next steps..."
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
                    {isAdding ? 'Create Review' : 'Update Review'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance Reviews List */}
        <div className="space-y-4">
          {performanceReviews.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance Reviews</h3>
              <p className="text-gray-500 mb-4">Start conducting performance reviews and tracking employee development</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create First Review
              </button>
            </div>
          ) : (
            performanceReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Review for Employee {review.employeeId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Reviewed by {review.reviewerId} • {review.reviewType} Review
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(review.status)}`}>
                        {getStatusIcon(review.status)}
                        {review.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      {renderStars(review.overallRating)}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {review.reviewPeriod.start.toLocaleDateString()} - {review.reviewPeriod.end.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Feedback:</p>
                        <p className="text-gray-600 text-sm line-clamp-2">{review.feedback}</p>
                      </div>

                      {review.developmentPlan && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Development Plan:</p>
                          <p className="text-gray-600 text-sm line-clamp-2">{review.developmentPlan}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit review"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete review"
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