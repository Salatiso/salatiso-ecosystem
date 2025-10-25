/**
 * Projects Module - First-Class Organizer
 * Phase 5 - STEP 8
 * Kanban, Timeline, Calendar, List views with governance progression
 */

'use client';

import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Grid,
  List,
  Kanban as KanbanIcon,
  Share2,
  Archive,
  Trash2,
  ChevronRight,
} from 'lucide-react';

// ===== Data Models =====

export type ProjectContext = 'personal' | 'family' | 'community' | 'professional';
export type ProjectLifecycle = 'idea' | 'active' | 'on-hold' | 'completed';
export type GovernanceLevel = 'informal' | 'semi-formal' | 'formal';
export type ProjectViewType = 'kanban' | 'timeline' | 'calendar' | 'list';

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface MeshMeeting {
  id: string;
  title: string;
  scheduledDate: string;
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  context: ProjectContext;
  lifecycle: ProjectLifecycle;
  governance: GovernanceLevel;
  owner: string;
  team: string[];
  tasks: ProjectTask[];
  meshMeetings: MeshMeeting[];
  startDate: string;
  targetDate: string;
  progress: number; // 0-100
  tags?: string[];
  crossLinks?: string[]; // Project IDs
  createdAt: string;
  updatedAt: string;
}

// ===== Example Projects =====

export const EXAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Family Academy Initiative',
    description: 'Launch comprehensive learning program for all family members',
    context: 'family',
    lifecycle: 'active',
    governance: 'formal',
    owner: 'salatiso',
    team: ['nc-mdeni', 'tina', 'azora'],
    startDate: '2024-01-15',
    targetDate: '2025-06-30',
    progress: 65,
    tasks: [
      {
        id: 't1',
        title: 'Curriculum Design',
        status: 'done',
        priority: 'high',
        assignee: 'tina',
      },
      {
        id: 't2',
        title: 'Instructor Recruitment',
        status: 'in-progress',
        priority: 'high',
        assignee: 'salatiso',
      },
      {
        id: 't3',
        title: 'Platform Setup',
        status: 'in-progress',
        priority: 'medium',
      },
    ],
    meshMeetings: [
      {
        id: 'm1',
        title: 'Academy Planning Session',
        scheduledDate: '2025-02-15',
        participants: ['salatiso', 'tina', 'azora'],
        status: 'scheduled',
      },
    ],
    crossLinks: ['proj-2', 'proj-3'],
    createdAt: '2024-01-15',
    updatedAt: '2025-02-01',
  },
  {
    id: 'proj-2',
    name: 'Health & Sustainability Hub',
    description: 'Create sustainable health practices framework',
    context: 'family',
    lifecycle: 'active',
    governance: 'semi-formal',
    owner: 'solo',
    team: ['kwakho', 'solo'],
    startDate: '2024-06-01',
    targetDate: '2025-12-31',
    progress: 40,
    tasks: [
      {
        id: 't4',
        title: 'Research Best Practices',
        status: 'done',
        priority: 'high',
      },
      {
        id: 't5',
        title: 'Partner Engagement',
        status: 'in-progress',
        priority: 'medium',
      },
    ],
    meshMeetings: [],
    crossLinks: ['proj-1'],
    createdAt: '2024-06-01',
    updatedAt: '2025-02-01',
  },
  {
    id: 'proj-3',
    name: 'Business Expansion 2025',
    description: 'Strategic expansion of professional operations',
    context: 'professional',
    lifecycle: 'idea',
    governance: 'informal',
    owner: 'visa',
    team: ['salatiso', 'visa'],
    startDate: '2025-03-01',
    targetDate: '2025-12-31',
    progress: 10,
    tasks: [
      {
        id: 't6',
        title: 'Market Analysis',
        status: 'todo',
        priority: 'high',
      },
    ],
    meshMeetings: [],
    crossLinks: [],
    createdAt: '2025-02-01',
    updatedAt: '2025-02-01',
  },
];

// ===== Context Configuration =====

const contextConfig: Record<
  ProjectContext,
  { icon: React.ReactNode; color: string; label: string }
> = {
  personal: { icon: '🎯', color: 'amber', label: 'Personal' },
  family: { icon: '👨‍👩‍👧‍👦', color: 'blue', label: 'Family' },
  community: { icon: '🤝', color: 'green', label: 'Community' },
  professional: { icon: '💼', color: 'purple', label: 'Professional' },
};

const lifecycleConfig: Record<
  ProjectLifecycle,
  { icon: React.ReactNode; color: string; label: string }
> = {
  idea: { icon: '💡', color: 'gray', label: 'Idea' },
  active: { icon: '🚀', color: 'blue', label: 'Active' },
  'on-hold': { icon: '⏸️', color: 'amber', label: 'On Hold' },
  completed: { icon: '✅', color: 'green', label: 'Completed' },
};

const governanceConfig: Record<
  GovernanceLevel,
  { icon: React.ReactNode; color: string; label: string }
> = {
  informal: { icon: '🤝', color: 'amber', label: 'Informal' },
  'semi-formal': { icon: '📋', color: 'blue', label: 'Semi-Formal' },
  formal: { icon: '📑', color: 'purple', label: 'Formal' },
};

// ===== Components =====

/**
 * Project Card
 */
const ProjectCard: React.FC<{
  project: Project;
  onSelect?: (project: Project) => void;
}> = ({ project, onSelect }) => {
  const contextCfg = contextConfig[project.context];
  const lifecycleCfg = lifecycleConfig[project.lifecycle];

  const completedTasks = project.tasks.filter((t) => t.status === 'done').length;

  return (
    <div
      onClick={() => onSelect?.(project)}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition p-4 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-2xl">{contextCfg.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{project.name}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Tags & Badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
          {lifecycleCfg.label}
        </span>
        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded capitalize">
          {project.governance}
        </span>
        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
          {completedTasks}/{project.tasks.length} tasks
        </span>
      </div>

      {/* Team & Dates */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{project.team.length} members</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(project.targetDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Kanban View
 */
const KanbanView: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <div className="grid grid-cols-4 gap-4 overflow-x-auto pb-4">
      {(['idea', 'active', 'on-hold', 'completed'] as ProjectLifecycle[]).map(
        (status) => {
          const statusProjects = projects.filter(
            (p) => p.lifecycle === status
          );
          const config = lifecycleConfig[status];

          return (
            <div key={status} className="min-w-80 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{config.icon}</span>
                <h4 className="font-bold text-gray-900">
                  {config.label} ({statusProjects.length})
                </h4>
              </div>

              <div className="space-y-3">
                {statusProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg p-3 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-medium text-sm text-gray-900">
                      {project.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

/**
 * Timeline View
 */
const TimelineView: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedProjects.map((project, idx) => (
        <div key={project.id} className="flex gap-4">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full" />
            {idx !== sortedProjects.length - 1 && (
              <div className="w-0.5 h-16 bg-blue-200 my-2" />
            )}
          </div>

          {/* Event */}
          <div className="flex-1 pb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.description}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded capitalize">
                  {project.lifecycle}
                </span>
              </div>

              <div className="flex gap-4 mt-3 text-xs text-gray-600">
                <div>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start: {new Date(project.startDate).toLocaleDateString()}
                </div>
                <div>
                  <Target className="w-4 h-4 inline mr-1" />
                  Target: {new Date(project.targetDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Projects Dashboard
 */
export const ProjectsDashboard: React.FC<{
  contextFilter?: ProjectContext;
  viewType?: ProjectViewType;
}> = ({ contextFilter, viewType = 'kanban' }) => {
  const [selectedView, setSelectedView] = useState<ProjectViewType>(viewType);
  const [selectedContext, setSelectedContext] =
    useState<ProjectContext | 'all'>(contextFilter || 'all');
  const [showNewProject, setShowNewProject] = useState(false);

  const filteredProjects =
    selectedContext === 'all'
      ? EXAMPLE_PROJECTS
      : EXAMPLE_PROJECTS.filter((p) => p.context === selectedContext);

  const activeCount = EXAMPLE_PROJECTS.filter(
    (p) => p.lifecycle === 'active'
  ).length;
  const completedCount = EXAMPLE_PROJECTS.filter(
    (p) => p.lifecycle === 'completed'
  ).length;
  const avgProgress =
    Math.round(
      EXAMPLE_PROJECTS.reduce((sum, p) => sum + p.progress, 0) /
        EXAMPLE_PROJECTS.length
    ) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-600">
              {EXAMPLE_PROJECTS.length} total projects
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: EXAMPLE_PROJECTS.length, icon: '📁' },
          { label: 'Active', value: activeCount, icon: '🚀' },
          { label: 'Completed', value: completedCount, icon: '✅' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: '📊' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Context Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'personal', 'family', 'community', 'professional'] as const).map(
          (context) => {
            const label =
              context === 'all'
                ? 'All Projects'
                : contextConfig[context as ProjectContext].label;
            return (
              <button
                key={context}
                onClick={() =>
                  setSelectedContext(
                    context as ProjectContext | 'all'
                  )
                }
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedContext === context
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {context !== 'all' && (
                  <span className="mr-2">
                    {contextConfig[context as ProjectContext].icon}
                  </span>
                )}
                {label}
              </button>
            );
          }
        )}
      </div>

      {/* View Selector */}
      <div className="flex gap-2">
        {[
          { type: 'kanban' as ProjectViewType, icon: KanbanIcon, label: 'Kanban' },
          { type: 'timeline' as ProjectViewType, icon: Calendar, label: 'Timeline' },
          { type: 'list' as ProjectViewType, icon: List, label: 'List' },
        ].map((view) => (
          <button
            key={view.type}
            onClick={() => setSelectedView(view.type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              selectedView === view.type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <view.icon className="w-5 h-5" />
            {view.label}
          </button>
        ))}
      </div>

      {/* Views */}
      <div>
        {selectedView === 'kanban' && (
          <KanbanView projects={filteredProjects} />
        )}
        {selectedView === 'timeline' && (
          <TimelineView projects={filteredProjects} />
        )}
        {selectedView === 'list' && (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create New Project
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Project description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-3 gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Context</option>
                  {Object.entries(contextConfig).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Governance</option>
                  {Object.entries(governanceConfig).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Status</option>
                  {Object.entries(lifecycleConfig).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Project Detail View
 */
export const ProjectDetail: React.FC<{ project: Project }> = ({ project }) => {
  const contextCfg = contextConfig[project.context];
  const lifecycleCfg = lifecycleConfig[project.lifecycle];
  const governanceCfg = governanceConfig[project.governance];

  const taskStats = {
    total: project.tasks.length,
    done: project.tasks.filter((t) => t.status === 'done').length,
    inProgress: project.tasks.filter((t) => t.status === 'in-progress').length,
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{contextCfg.icon}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-lg">
            {lifecycleCfg.label}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 font-medium rounded-lg">
            {governanceCfg.label}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg">
            {contextCfg.label}
          </span>
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Progress', value: `${project.progress}%` },
          { label: 'Completed', value: `${taskStats.done}/${taskStats.total}` },
          { label: 'In Progress', value: taskStats.inProgress },
          { label: 'Team', value: project.team.length },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-200 p-4 text-center"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks</h2>
        <div className="space-y-3">
          {project.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <input type="checkbox" className="w-5 h-5 rounded" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : task.priority === 'medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mesh Meetings */}
      {project.meshMeetings.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Mesh Meetings
          </h2>
          <div className="space-y-3">
            {project.meshMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-start gap-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
              >
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{meeting.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(meeting.scheduledDate).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      {meeting.participants.length} participants
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded capitalize flex-shrink-0 ${
                    meeting.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {meeting.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
