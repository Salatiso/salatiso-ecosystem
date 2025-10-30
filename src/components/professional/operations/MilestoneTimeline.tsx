import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target
} from 'lucide-react';
import { AccessibleSelect } from '@/components/accessibility';
import { useOperations } from '@/hooks/useOperations';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { Milestone } from '@/contexts/professional/ProfessionalContext';

interface MilestoneTimelineProps {
  projectId?: string;
  className?: string;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ projectId, className = '' }) => {
  const {
    operations,
    loading,
    error
  } = useOperations();

  const { activityLogger } = useBizHelpIntegration('');

  const [selectedProject, setSelectedProject] = useState<string>(projectId || 'all');

  // Get all milestones from projects
  const allMilestones = operations.projects?.flatMap(project =>
    project.milestones?.map(milestone => ({
      ...milestone,
      projectId: project.id,
      projectName: project.name
    })) || []
  ) || [];

  const filteredMilestones = selectedProject === 'all'
    ? allMilestones
    : allMilestones.filter(milestone => milestone.projectId === selectedProject);

  // Sort milestones by due date
  const sortedMilestones = filteredMilestones.sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return dateA - dateB;
  });

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const isOverdue = (milestone: Milestone & { projectId: string; projectName: string }) => {
    if (!milestone.dueDate || milestone.status === 'completed') {
      return false;
    }
    return new Date(milestone.dueDate) < new Date();
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
          <span className="text-red-800">Error loading milestones: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Milestone Timeline</h2>
          <p className="text-gray-600">Track project milestones and deadlines</p>
        </div>
      </div>

      {/* Project Filter */}
      {!projectId && (
        <div className="max-w-xs">
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
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-8">
          {sortedMilestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start"
            >
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-white ${getStatusColor(milestone.status)}`}>
                {getStatusIcon(milestone.status)}
              </div>

              {/* Content */}
              <div className="ml-6 flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {milestone.title}
                    </h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                    {!projectId && (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                        {milestone.projectName}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{milestone.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {milestone.dueDate
                          ? new Date(milestone.dueDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'No due date'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overdue warning */}
                {isOverdue(milestone) && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-800 text-sm font-medium">
                        This milestone is overdue
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {sortedMilestones.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones found</h3>
            <p className="text-gray-600">
              {selectedProject === 'all'
                ? 'Milestones will appear here once projects are created'
                : 'No milestones for the selected project yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};