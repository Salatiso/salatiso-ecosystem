import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  MoreVertical,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect, AccessibleButton } from '@/components/accessibility';
import { useOperations } from '@/hooks/useOperations';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { Task, Project } from '@/services/operations.service';

interface TaskTrackerProps {
  projectId?: string;
  className?: string;
}

export const TaskTracker: React.FC<TaskTrackerProps> = ({ projectId, className = '' }) => {
  const {
    tasks,
    projects,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    loadTasks
  } = useOperations();

  const { activityLogger } = useBizHelpIntegration('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>(projectId || 'all');

  useEffect(() => {
    loadTasks(selectedProject === 'all' ? undefined : selectedProject);
  }, [loadTasks, selectedProject]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignedTo === assigneeFilter;
    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;

    return matchesSearch && matchesStatus && matchesAssignee && matchesProject;
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 border-red-200';
      case 'high': return 'text-orange-600 border-orange-200';
      case 'medium': return 'text-yellow-600 border-yellow-200';
      case 'low': return 'text-green-600 border-green-200';
      default: return 'text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return <Square className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'review': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createTask(taskData);

      // Log activity: task created
      await activityLogger?.log('task_created', {
        taskTitle: taskData.title,
        projectId: taskData.projectId,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate,
        assignedTo: taskData.assignedTo
      });

      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);

      // Log activity: task status changed
      if (updates.status) {
        await activityLogger?.log('task_status_changed', {
          taskId,
          newStatus: updates.status,
          updatedDate: new Date()
        });
      }

      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    await handleUpdateTask(task.id, { status: newStatus });
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
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading tasks: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Tracker</h2>
          <p className="text-gray-600">Manage and track project tasks</p>
        </div>
        <AccessibleButton
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </AccessibleButton>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <AccessibleInput
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        {!projectId && (
          <AccessibleSelect
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="min-w-40"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </AccessibleSelect>
        )}
        <AccessibleSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-w-32"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </AccessibleSelect>
        <AccessibleSelect
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="min-w-32"
        >
          <option value="all">All Assignees</option>
          {/* TODO: Add unique assignees from tasks */}
        </AccessibleSelect>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {['todo', 'in-progress', 'review', 'completed'].map(status => {
          const statusTasks = filteredTasks.filter(task => task.status === status);
          return (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 capitalize flex items-center">
                  {getStatusIcon(status as Task['status'])}
                  <span className="ml-2">{status.replace('-', ' ')}</span>
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {statusTasks.length}
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                {statusTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{task.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {status !== 'todo' && (
                          <AccessibleButton
                            onClick={() => handleStatusChange(task, 'todo')}
                            variant="secondary"
                            size="sm"
                            className="px-2 py-1"
                          >
                            <Square className="h-3 w-3" />
                          </AccessibleButton>
                        )}
                        {status !== 'in-progress' && (
                          <AccessibleButton
                            onClick={() => handleStatusChange(task, 'in-progress')}
                            variant="secondary"
                            size="sm"
                            className="px-2 py-1"
                          >
                            <Play className="h-3 w-3" />
                          </AccessibleButton>
                        )}
                        {status !== 'review' && (
                          <AccessibleButton
                            onClick={() => handleStatusChange(task, 'review')}
                            variant="secondary"
                            size="sm"
                            className="px-2 py-1"
                          >
                            <Clock className="h-3 w-3" />
                          </AccessibleButton>
                        )}
                        {status !== 'completed' && (
                          <AccessibleButton
                            onClick={() => handleStatusChange(task, 'completed')}
                            variant="secondary"
                            size="sm"
                            className="px-2 py-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </AccessibleButton>
                        )}
                      </div>

                      <div className="flex space-x-1">
                        <AccessibleButton
                          onClick={() => setEditingTask(task)}
                          variant="secondary"
                          size="sm"
                        >
                          <Edit className="h-3 w-3" />
                        </AccessibleButton>
                        <AccessibleButton
                          onClick={() => handleDeleteTask(task.id)}
                          variant="danger"
                          size="sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </AccessibleButton>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Square className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks in {status.replace('-', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || assigneeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first task'}
          </p>
          <AccessibleButton
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Task
          </AccessibleButton>
        </div>
      )}

      {/* Create/Edit Task Modal would go here */}
      {showCreateForm && (
        <TaskForm
          projects={projects}
          selectedProject={selectedProject}
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          projects={projects}
          selectedProject={selectedProject}
          onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

// Task Form Component
interface TaskFormProps {
  task?: Task;
  projects: Project[];
  selectedProject: string;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, projects, selectedProject, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo' as Task['status'],
    priority: task?.priority || 'medium' as Task['priority'],
    projectId: task?.projectId || selectedProject || '',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    estimatedHours: task?.estimatedHours || 0,
    actualHours: task?.actualHours || 0,
    tags: task?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AccessibleInput
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <AccessibleInput
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            as="textarea"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <AccessibleSelect
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </AccessibleSelect>

            <AccessibleSelect
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </AccessibleSelect>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AccessibleSelect
              label="Project"
              value={formData.projectId}
              onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
              required
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </AccessibleSelect>

            <AccessibleInput
              label="Assigned To"
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              placeholder="Enter assignee name or email"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <AccessibleInput
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />

            <AccessibleInput
              label="Estimated Hours"
              type="number"
              min="0"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
            />

            <AccessibleInput
              label="Actual Hours"
              type="number"
              min="0"
              step="0.5"
              value={formData.actualHours}
              onChange={(e) => setFormData(prev => ({ ...prev, actualHours: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <AccessibleButton type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </AccessibleButton>
            <AccessibleButton type="submit">
              {task ? 'Update Task' : 'Create Task'}
            </AccessibleButton>
          </div>
        </form>
      </div>
    </div>
  );
};