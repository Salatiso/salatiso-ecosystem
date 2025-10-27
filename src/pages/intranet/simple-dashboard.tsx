import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AlertCircle, BarChart3, Users, Clock, TrendingUp } from 'lucide-react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  EcosystemHealthWidget,
  ProjectTimelineWidget,
  CareerProgressWidget,
  GamificationWidget
} from '@/components/dashboard/widgets';
import {
  SonnyNetworkWidget,
  WelcomeWidget,
  FamilyActivityWidget,
  QuickActionsWidget
} from '@/components/dashboard/SonnyWidgets';
import MNIProfileWidget from '@/components/dashboard/MNIProfileWidget';
import { mniRegistrationPlan } from '@/data/mni-registration';
import { TaskCard } from '@/components/project/TaskCard';
import { EscalationTracker } from '@/components/dashboard/EscalationTracker';
import { IncidentForm } from '@/components/dashboard/IncidentForm';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { TeamAssignmentComponent } from '@/components/assignments/TeamAssignmentComponent';
import { SLATrackingComponent } from '@/components/sla/SLATrackingComponent';
import { PerformanceMetricsComponent } from '@/components/metrics/PerformanceMetricsComponent';
import ExportToPDFComponent from '@/components/advanced/ExportToPDFComponent';
import AdvancedSearchComponent from '@/components/advanced/AdvancedSearchComponent';
import BulkOperationsComponent from '@/components/advanced/BulkOperationsComponent';
import CustomReportBuilderComponent from '@/components/advanced/CustomReportBuilderComponent';
import { AnalyticsDashboardTab } from '@/components/analytics/AnalyticsDashboardTab';
import { CollaborationHub } from '@/components/collaboration/CollaborationHub';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { Settings } from 'lucide-react';

// Dynamic import with SSR disabled to prevent hydration errors
const EcosystemActivityWidget = dynamic(
  () => import('@/components/ecosystemActivity/EcosystemActivityWidget').then(mod => ({ default: mod.EcosystemActivityWidget })),
  { ssr: false }
);

type TabType = 'overview' | 'escalations' | 'analytics' | 'collaboration' | 'team-assignment' | 'sla-tracking' | 'performance' | 'advanced' | 'admin';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [projectTasks, setProjectTasks] = useState(mniRegistrationPlan.tasks);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [advancedTab, setAdvancedTab] = useState<'export' | 'search' | 'bulk' | 'reports'>('export');
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  // For testing Phase 4.3 components, create a mock user if not logged in during development
  const displayUser = user || (process.env.NODE_ENV === 'development' ? {
    id: 'test-user-phase-4-3',
    email: 'test@salatiso.com',
    displayName: 'Test User (Phase 4.3)',
    photoURL: undefined,
    role: 'guest',
    createdAt: new Date(),
    lastLogin: new Date(),
  } as any : null);

  if (!displayUser) {
    return (
      <IntranetLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  return (
    <IntranetLayout title="Dashboard">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Family Dashboard
              </h1>
              <p className="text-gray-600">
                Your personalized view of the Mlandeli ecosystem
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Today</div>
                <div className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('escalations')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'escalations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Escalations
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'collaboration'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            💬 Collaboration
          </button>
          <button
            onClick={() => setActiveTab('team-assignment')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'team-assignment'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Team Assignment
          </button>
          <button
            onClick={() => setActiveTab('sla-tracking')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'sla-tracking'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            SLA Tracking
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'performance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Performance
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🔐 Admin
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'advanced'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Advanced
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Welcome Section */}
              <div className="lg:col-span-8">
                <WelcomeWidget />
              </div>
              
              {/* Sonny Network Status */}
              <div className="lg:col-span-4">
                <SonnyNetworkWidget />
              </div>

              {/* Family Activity */}
              <div className="lg:col-span-6">
                <FamilyActivityWidget />
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-6">
                <QuickActionsWidget />
              </div>

              {/* Ecosystem Health */}
              <div className="lg:col-span-6">
                <EcosystemHealthWidget />
              </div>

              {/* Gamification */}
              <div className="lg:col-span-3">
                <GamificationWidget />
              </div>

              {/* MNI Profile */}
              <div className="lg:col-span-3">
                <MNIProfileWidget />
              </div>

              {/* Career Progress */}
              <div className="lg:col-span-6">
                <CareerProgressWidget />
              </div>

              {/* Project Timeline */}
              <div className="lg:col-span-12">
                <ProjectTimelineWidget />
              </div>

              {/* Ecosystem Activity - Real-time sync across all apps */}
              <div className="lg:col-span-12">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <EcosystemActivityWidget
                    mode="full"
                    limit={15}
                    showStats={true}
                    showFilters={true}
                  />
                </div>
              </div>

              {/* MNI Registration Project */}
              <div className="lg:col-span-12">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">MNI Registration Project</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Solo''s task to register Mlandeli-Notemba Investments with mother''s help
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="text-lg font-semibold text-primary-600">
                        {Math.round((projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {projectTasks.slice(0, 3).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdateTask={(updatedTask) => {
                          setProjectTasks(prev =>
                            prev.map(t => t.id === updatedTask.id ? updatedTask : t)
                          );
                        }}
                        onToggleSubtask={(taskId, subtaskId) => {
                          setProjectTasks(prev =>
                            prev.map(task => {
                              if (task.id === taskId) {
                                const updatedSubtasks = task.subtasks.map(subtask =>
                                  subtask.id === subtaskId
                                    ? { ...subtask, completed: !subtask.completed, completedDate: !subtask.completed ? new Date() : null }
                                    : subtask
                                );
                                return { ...task, subtasks: updatedSubtasks };
                              }
                              return task;
                            })
                          );
                        }}
                        onAddNote={(taskId, note) => {
                          setProjectTasks(prev =>
                            prev.map(task =>
                              task.id === taskId
                                ? {
                                    ...task,
                                    notes: [...task.notes, {
                                      id: Date.now().toString(),
                                      author: displayUser?.displayName || 'User',
                                      content: note,
                                      createdAt: new Date(),
                                      updatedAt: new Date()
                                    }]
                                  }
                                : task
                            )
                          );
                        }}
                      />
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-primary-600 hover:text-primary-800 font-medium">
                      View All Tasks ({projectTasks.length}) →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Buttons */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 text-center rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm font-medium text-gray-900">New Project</div>
                </button>
                <button className="p-4 text-center rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-sm font-medium text-gray-900">Family Directory</div>
                </button>
                <button className="p-4 text-center rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium text-gray-900">Analytics</div>
                </button>
                <button className="p-4 text-center rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-sm font-medium text-gray-900">Settings</div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Escalations Tab */}
        {activeTab === 'escalations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">System Escalations</h2>
              <button
                onClick={() => setShowIncidentForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                New Incident
              </button>
            </div>
            
            <EscalationTracker />
            
            <IncidentForm 
              isOpen={showIncidentForm}
              onClose={() => setShowIncidentForm(false)}
            />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboardTab />
        )}

        {/* Collaboration Tab */}
        {activeTab === 'collaboration' && (
          <CollaborationHub />
        )}

        {/* Team Assignment Tab */}
        {activeTab === 'team-assignment' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Team Assignment</h2>
              <p className="text-gray-600 mt-1">Intelligently assign escalations to team members with workload balancing</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <TeamAssignmentComponent 
                teamId="team-001"
                escalationId="sample-escalation"
                escalationPriority="high"
              />
            </div>
          </div>
        )}

        {/* SLA Tracking Tab */}
        {activeTab === 'sla-tracking' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">SLA Tracking</h2>
              <p className="text-gray-600 mt-1">Monitor SLA compliance in real-time and track breaches</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <SLATrackingComponent teamId="team-001" />
            </div>
          </div>
        )}

        {/* Performance Metrics Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Performance Metrics</h2>
              <p className="text-gray-600 mt-1">Track team and individual performance with analytics and trends</p>
            </div>
            
            <PerformanceMetricsComponent teamId="team-001" dateRange="month" />
          </div>
        )}

        {/* Admin Panel Tab */}
        {activeTab === 'admin' && (
          <div>
            <AdminPanel />
          </div>
        )}

        {/* Advanced Features Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Advanced Features</h2>
              <p className="text-gray-600 mt-1">Powerful tools for data management, reporting, and bulk operations</p>
            </div>

            {/* Sub-tabs for Advanced Features */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
              {(['export', 'search', 'bulk', 'reports'] as const).map(subTab => (
                <button
                  key={subTab}
                  onClick={() => setAdvancedTab(subTab)}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    advancedTab === subTab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {subTab === 'export' && '📤 Export'}
                  {subTab === 'search' && '🔍 Search'}
                  {subTab === 'bulk' && '✓ Bulk Ops'}
                  {subTab === 'reports' && '📊 Reports'}
                </button>
              ))}
            </div>

            {/* Export Tab */}
            {advancedTab === 'export' && <ExportToPDFComponent />}

            {/* Advanced Search Tab */}
            {advancedTab === 'search' && <AdvancedSearchComponent />}

            {/* Bulk Operations Tab */}
            {advancedTab === 'bulk' && <BulkOperationsComponent />}

            {/* Custom Reports Tab */}
            {advancedTab === 'reports' && <CustomReportBuilderComponent />}
          </div>
        )}
      </div>
    </IntranetLayout>
  );
}
