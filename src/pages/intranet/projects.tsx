import React, { useState } from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import { 
  Calendar,
  CheckCircle,
  Clock,
  Users,
  Target,
  TrendingUp,
  Building2,
  Globe,
  Award,
  Zap,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PrintExportButtons } from '@/components/common/PrintExport';

interface Milestone {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
  progress: number;
  category: 'legal' | 'governance' | 'operations' | 'growth' | 'expansion' | 'legacy';
}

interface Phase {
  id: string;
  name: string;
  description: string;
  timeline: string;
  color: string;
  icon: React.ReactNode;
  milestones: Milestone[];
  objectives: string[];
}

const ProjectTracker: React.FC = () => {
  const { user } = useAuth();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gantt' | 'kanban' | 'timeline'>('gantt');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const phases: Phase[] = [
    {
      id: 'phase1',
      name: 'Phase 1: Immediate',
      description: 'Company registration, governance setup, Visa\'s subsidiary launch, patent filing',
      timeline: 'Year 0–1',
      color: 'from-red-500 to-red-600',
      icon: <Zap className="h-6 w-6" />,
      objectives: [
        'Company registration and legal setup',
        'Governance framework establishment',
        'IP protection and patent filing',
        'Initial operational structure'
      ],
      milestones: [
        {
          id: 'company-registration',
          title: 'Company Formation',
          description: 'Register Mlandeli Notemba Investments (Pty) Ltd with CIPC',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          status: 'completed',
          assignee: 'Salatiso',
          priority: 'critical',
          progress: 100,
          category: 'legal'
        },
        {
          id: 'governance-charter',
          title: 'Family Governance Charter',
          description: 'Draft and adopt comprehensive family governance framework',
          startDate: '2024-02-01',
          endDate: '2024-06-30',
          status: 'in-progress',
          assignee: 'Tina',
          priority: 'high',
          progress: 75,
          category: 'governance'
        },
        {
          id: 'visa-subsidiary',
          title: 'Visa\'s Subsidiary Launch',
          description: 'Establish Visa\'s subsidiary (60% MNI, 40% Visa)',
          startDate: '2024-04-01',
          endDate: '2024-08-31',
          status: 'in-progress',
          assignee: 'Visa',
          priority: 'high',
          progress: 60,
          category: 'operations'
        },
        {
          id: 'patent-filing',
          title: 'Patent Application',
          description: 'File comprehensive patent for Salatiso ecosystem',
          startDate: '2024-03-01',
          endDate: '2024-12-31',
          status: 'in-progress',
          assignee: 'Solo',
          priority: 'critical',
          progress: 40,
          category: 'legal'
        }
      ]
    },
    {
      id: 'phase2',
      name: 'Phase 2: Short-Term',
      description: 'Subsidiaries operational, first apps profitable, family onboarding',
      timeline: 'Years 1–5',
      color: 'from-blue-500 to-blue-600',
      icon: <TrendingUp className="h-6 w-6" />,
      objectives: [
        'All subsidiaries operational and profitable',
        'Family member onboarding complete',
        'Performance management system live',
        'First institutional clients secured'
      ],
      milestones: [
        {
          id: 'apps-profitable',
          title: 'App Profitability',
          description: 'BizHelp, SafetyHelp, PigeeBack, and Sazi Life Academy profitable',
          startDate: '2025-01-01',
          endDate: '2027-12-31',
          status: 'not-started',
          assignee: 'Kwakho',
          priority: 'critical',
          progress: 0,
          category: 'growth'
        },
        {
          id: 'family-onboarding',
          title: 'Family Integration',
          description: 'Complete family member role assignment and training',
          startDate: '2025-06-01',
          endDate: '2026-12-31',
          status: 'not-started',
          assignee: 'Tina',
          priority: 'high',
          progress: 0,
          category: 'governance'
        },
        {
          id: 'intranet-launch',
          title: 'Family Intranet',
          description: 'Full deployment of salatiso.com family hub',
          startDate: '2024-10-01',
          endDate: '2025-03-31',
          status: 'in-progress',
          assignee: 'Solo',
          priority: 'high',
          progress: 80,
          category: 'operations'
        }
      ]
    },
    {
      id: 'phase3',
      name: 'Phase 3: Medium-Term',
      description: 'International expansion, multiple subsidiaries trading, succession pathways',
      timeline: 'Years 6–10',
      color: 'from-green-500 to-green-600',
      icon: <Globe className="h-6 w-6" />,
      objectives: [
        'Regional expansion across SADC',
        'LifeCV verification services launched',
        'Family leadership rotation initiated',
        'At least 6 subsidiaries trading'
      ],
      milestones: [
        {
          id: 'international-expansion',
          title: 'SADC Expansion',
          description: 'Establish regional hubs across Southern Africa',
          startDate: '2028-01-01',
          endDate: '2030-12-31',
          status: 'not-started',
          assignee: 'Visa',
          priority: 'high',
          progress: 0,
          category: 'expansion'
        },
        {
          id: 'lifecv-services',
          title: 'LifeCV Verification',
          description: 'Launch institutional verification services',
          startDate: '2029-01-01',
          endDate: '2030-06-30',
          status: 'not-started',
          assignee: 'Solo',
          priority: 'medium',
          progress: 0,
          category: 'growth'
        }
      ]
    },
    {
      id: 'phase4',
      name: 'Phase 4: Long-Term',
      description: 'IP transfer to trust, global recognition, university partnerships',
      timeline: 'Years 11–15',
      color: 'from-purple-500 to-purple-600',
      icon: <Building2 className="h-6 w-6" />,
      objectives: [
        'Family trust established with IP ownership',
        'Global licensing of trust protocol',
        'University partnerships for Sazi Life Academy',
        'AI-driven governance systems'
      ],
      milestones: [
        {
          id: 'trust-establishment',
          title: 'Family Trust Setup',
          description: 'Transfer IP from MNI (Pty) Ltd to MNI Trust',
          startDate: '2033-01-01',
          endDate: '2034-12-31',
          status: 'not-started',
          assignee: 'Salatiso',
          priority: 'critical',
          progress: 0,
          category: 'governance'
        },
        {
          id: 'university-partnerships',
          title: 'Educational Alliances',
          description: 'Establish partnerships with leading universities',
          startDate: '2034-01-01',
          endDate: '2036-12-31',
          status: 'not-started',
          assignee: 'Tina',
          priority: 'medium',
          progress: 0,
          category: 'expansion'
        }
      ]
    },
    {
      id: 'phase5',
      name: 'Phase 5: Legacy',
      description: 'Succession complete, grandchildren integrated, Ubuntu governance codified',
      timeline: 'Years 16–20',
      color: 'from-orange-500 to-orange-600',
      icon: <Award className="h-6 w-6" />,
      objectives: [
        'Multi-generational leadership operational',
        'Global Ubuntu governance framework',
        'Trust economy embedded in society',
        'Complete succession pathways'
      ],
      milestones: [
        {
          id: 'succession-completion',
          title: 'Succession Framework',
          description: 'Complete multi-generational leadership transition',
          startDate: '2038-01-01',
          endDate: '2040-12-31',
          status: 'not-started',
          assignee: 'Next Generation',
          priority: 'critical',
          progress: 0,
          category: 'legacy'
        },
        {
          id: 'ubuntu-codification',
          title: 'Ubuntu Governance',
          description: 'Codify Ubuntu-based governance as exportable framework',
          startDate: '2039-01-01',
          endDate: '2044-12-31',
          status: 'not-started',
          assignee: 'Family Council',
          priority: 'high',
          progress: 0,
          category: 'legacy'
        }
      ]
    }
  ];

  const roleAssignments = [
    { name: 'Salatiso (Founder)', roles: ['Vision', 'Governance', 'IP', 'Oversight'], color: 'bg-red-100 text-red-800' },
    { name: 'Visa (Parent Company Lead)', roles: ['Marketing', 'Subsidiary Leadership', 'Global Expansion'], color: 'bg-blue-100 text-blue-800' },
    { name: 'Tina (Mother/Family Steward)', roles: ['Branding', 'Education Liaison', 'Finance/Dividend Oversight', 'Family Governance'], color: 'bg-green-100 text-green-800' },
    { name: 'Kwakho (Community Lead)', roles: ['Community Engagement', 'Support', 'Partnerships', 'Social Impact'], color: 'bg-purple-100 text-purple-800' },
    { name: 'Solo (CTO Path)', roles: ['Development', 'CTO Path', 'AI & Tech Governance', 'Innovation'], color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Next Generation', roles: ['Career Paths at 18', 'Marketing, Tech, Legal, Finance, Community'], color: 'bg-gray-100 text-gray-800' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500';
      case 'high': return 'border-orange-500';
      case 'medium': return 'border-yellow-500';
      default: return 'border-green-500';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleImportProjects = (importedData: any) => {
    // For now, just log the imported data
    // TODO: Implement state management for phases
    console.log('Imported project data:', importedData);
  };

  return (
    <IntranetLayout title="Project Tracker & Gantt Roadmap">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Mlandeli Notemba Investments Project Tracker
              </h1>
              <p className="text-gray-600">
                20-Year Gantt Roadmap & Family Role Management System
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <PrintExportButtons 
                data={{ phases, exportDate: new Date().toISOString() }}
                filename="mni-project-tracker"
                onImport={handleImportProjects}
              />
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <option value="gantt">Gantt View</option>
                <option value="timeline">Timeline View</option>
                <option value="kanban">Kanban Board</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Phase Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${phase.color} text-white mb-3`}>
                  {phase.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{phase.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{phase.timeline}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {phase.milestones.length} milestones
                  </span>
                  {selectedPhase === phase.id ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Phase Details */}
        {selectedPhase && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {phases
              .filter(phase => phase.id === selectedPhase)
              .map(phase => (
                <div key={phase.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${phase.color} text-white`}>
                      {phase.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{phase.name}</h2>
                      <p className="text-gray-600 mb-4">{phase.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Objectives */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Key Objectives</h3>
                          <ul className="space-y-2">
                            {phase.objectives.map((objective, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Target className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Milestones */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Active Milestones</h3>
                          <div className="space-y-3">
                            {phase.milestones.map((milestone) => (
                              <div 
                                key={milestone.id} 
                                className={`p-3 rounded-lg border-l-4 ${getPriorityColor(milestone.priority)} bg-gray-50`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 text-sm">{milestone.title}</h4>
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(milestone.status)}`}>
                                    {milestone.status.replace('-', ' ')}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    Assigned to: {milestone.assignee}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className={`h-1.5 rounded-full ${getProgressColor(milestone.progress)}`}
                                        style={{ width: `${milestone.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500">{milestone.progress}%</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        )}

        {/* Role Assignments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🧩 Role Assignments & Career Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roleAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {assignment.name.split(' ')[0].substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{assignment.name}</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {assignment.roles.map((role, rIndex) => (
                    <span
                      key={rIndex}
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full mr-2 mb-2 ${assignment.color}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Implementation Dashboard */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📌 Implementation Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Interactive Gantt</h3>
              </div>
              <p className="text-sm text-gray-600">Visual timeline with drag-and-drop milestone management</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Role Dashboard</h3>
              </div>
              <p className="text-sm text-gray-600">Task assignment and family member progress tracking</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Succession Tracker</h3>
              </div>
              <p className="text-sm text-gray-600">Auto-updates when children turn 18, career path transitions</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">LifeCV Integration</h3>
              </div>
              <p className="text-sm text-gray-600">Performance linked to trust ratings and career advancement</p>
            </div>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default ProjectTracker;