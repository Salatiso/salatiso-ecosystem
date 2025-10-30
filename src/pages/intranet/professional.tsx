import React, { useState } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  FileText,
  Shield,
  Calendar,
  TrendingUp,
  Target,
  BookOpen,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalProvider } from '@/contexts/professional/ProfessionalContext';
import { BizHelpIntegrationWidget } from '@/components/professional/BizHelpIntegrationWidget';
import { ActivityFeedWidget } from '@/components/professional/ActivityFeedWidget';
import { CompanyProfileCard } from '@/components/professional/governance/CompanyProfileCard';
import { ComplianceTracker } from '@/components/professional/governance/ComplianceTracker';
import { DocumentRepository } from '@/components/professional/governance/DocumentRepository';
import { BoardRegistry } from '@/components/professional/governance/BoardRegistry';
import { MeetingMinutesComponent } from '@/components/professional/governance/MeetingMinutes';
import { OrgChart } from '@/components/professional/OrgChart';
import { RoleDefinition } from '@/components/professional/RoleDefinition';
import { ContractManager } from '@/components/professional/ContractManager';
import { PerformanceReviewComponent } from '@/components/professional/PerformanceReview';
import { DevelopmentPlans } from '@/components/professional/DevelopmentPlans';
import { ProjectCanvas } from '@/components/professional/operations/ProjectCanvas';
import { TaskTracker } from '@/components/professional/operations/TaskTracker';
import { MilestoneTimeline } from '@/components/professional/operations/MilestoneTimeline';
import { KnowledgeBaseViewer } from '@/components/professional/operations/KnowledgeBaseViewer';
import { RiskRegister } from '@/components/professional/operations/RiskRegister';
import { IncidentReportForm } from '@/components/professional/operations/IncidentReportForm';

const ProfessionalPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'bizhelp' | 'activity-feed' | 'governance' | 'human-capital' | 'operations' | 'finance' | 'marketing' | 'reporting'>('bizhelp');

  const sections = [
    {
      id: 'bizhelp' as const,
      title: 'BizHelp Integration',
      description: 'Unified business operations dashboard',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    },
    {
      id: 'activity-feed' as const,
      title: 'Activity Feed',
      description: 'Cross-app activity tracking and sync',
      icon: Calendar,
      color: 'bg-cyan-500'
    },
    {
      id: 'governance' as const,
      title: 'Governance',
      description: 'Company constitution, board management, compliance',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      id: 'human-capital' as const,
      title: 'Human Capital',
      description: 'HR management, talent development, succession planning',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'operations' as const,
      title: 'Operations',
      description: 'Business operations, processes, quality management',
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      id: 'finance' as const,
      title: 'Finance',
      description: 'Financial management, reporting, compliance',
      icon: TrendingUp,
      color: 'bg-yellow-500'
    },
    {
      id: 'marketing' as const,
      title: 'Marketing',
      description: 'Brand management, market strategy, communications',
      icon: Target,
      color: 'bg-pink-500'
    },
    {
      id: 'reporting' as const,
      title: 'Reporting',
      description: 'Analytics, dashboards, performance monitoring',
      icon: BarChart3,
      color: 'bg-indigo-500'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'bizhelp':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">BizHelp Operations Dashboard</h2>
                <p className="text-gray-600 mt-1">Integrated view of all business operations from BizHelp platform</p>
              </div>
            </div>

            {user && (
              <BizHelpIntegrationWidget 
                companyId={user.businessId || user.id}
                compact={false}
                onNavigate={(url) => window.open(url, '_blank')}
              />
            )}
          </div>
        );

      case 'activity-feed':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cross-App Activity Feed</h2>
                <p className="text-gray-600 mt-1">Real-time activity synchronization across MNI, BizHelp, and Hub platforms</p>
              </div>
            </div>

            {user && (
              <ActivityFeedWidget 
                companyId={user.businessId || user.id}
                maxItems={100}
                compact={false}
              />
            )}
          </div>
        );

      case 'governance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Company Governance</h2>
                <p className="text-gray-600 mt-1">Manage company constitution, board members, and compliance</p>
              </div>
            </div>

            <CompanyProfileCard />
            <ComplianceTracker />
            <DocumentRepository />
            <BoardRegistry />
            <MeetingMinutesComponent />
          </div>
        );

      case 'human-capital':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Human Capital Management</h2>
                <p className="text-gray-600 mt-1">Talent development, succession planning, and HR operations</p>
              </div>
            </div>

            <OrgChart />
            <RoleDefinition />
            <ContractManager />
            <PerformanceReviewComponent />
            <DevelopmentPlans />
          </div>
        );

      case 'operations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Operations Management</h2>
                <p className="text-gray-600 mt-1">Project management, risk assessment, and operational excellence</p>
              </div>
            </div>

            {/* Project Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <ProjectCanvas />
              </div>
            </div>

            {/* Task Management & Timeline */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TaskTracker />
              </div>
              <div>
                <MilestoneTimeline />
              </div>
            </div>

            {/* Knowledge Base & Risk Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KnowledgeBaseViewer />
              <RiskRegister />
            </div>

            {/* Incident Reporting */}
            <div className="grid grid-cols-1 gap-6">
              <IncidentReportForm />
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Financial Management</h2>
                <p className="text-gray-600 mt-1">Financial reporting, compliance, and business intelligence</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Finance Module</h3>
                <p className="text-gray-500">Coming soon - Financial management and reporting tools</p>
              </div>
            </div>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Marketing & Communications</h2>
                <p className="text-gray-600 mt-1">Brand management, market strategy, and stakeholder communications</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing Module</h3>
                <p className="text-gray-500">Coming soon - Marketing and communications tools</p>
              </div>
            </div>
          </div>
        );

      case 'reporting':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h2>
                <p className="text-gray-600 mt-1">Performance monitoring, dashboards, and business intelligence</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reporting Module</h3>
                <p className="text-gray-500">Coming soon - Analytics and reporting dashboards</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProfessionalProvider>
      <IntranetLayout>
        <Head>
          <title>Professional Management - Salatiso Ecosystem</title>
          <meta name="description" content="Professional management system for company governance and operations" />
        </Head>

        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Management</h1>
              <p className="text-gray-600">Comprehensive enterprise management system for governance, operations, and strategic planning</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Navigation Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Modules</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{section.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3"
              >
                {renderActiveSection()}
              </motion.div>
            </div>
          </div>
        </div>
      </IntranetLayout>
    </ProfessionalProvider>
  );
};

export default ProfessionalPage;