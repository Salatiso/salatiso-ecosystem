import React, { useState } from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import { 
  Building2,
  Target,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Edit,
  Share2,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PrintExportButtons } from '@/components/common/PrintExport';

interface BusinessPhase {
  id: string;
  name: string;
  timeline: string;
  description: string;
  goals: string[];
  actions: string[];
  kpis: { metric: string; target: string; current: string; }[];
  status: 'completed' | 'active' | 'planning' | 'future';
  color: string;
}

const BusinessPlan: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'template' | 'monitoring'>('overview');
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const businessPhases: BusinessPhase[] = [
    {
      id: 'immediate',
      name: 'Phase 1: Immediate Actions',
      timeline: '0–12 months',
      description: 'Company formation, governance setup, and operational foundation',
      status: 'active',
      color: 'from-red-500 to-red-600',
      goals: [
        'Complete company registration with CIPC',
        'Establish family governance framework',
        'Set up operational infrastructure',
        'Begin IP protection process'
      ],
      actions: [
        'Register Mlandeli Notemba Investments (Pty) Ltd with CIPC',
        'Draft and adopt Memorandum of Incorporation (MOI)',
        'Open corporate bank accounts',
        'Register for SARS tax, VAT, PAYE',
        'Draft Family Governance Charter',
        'Establish Visa\'s Subsidiary (60% MNI, 40% Visa)',
        'Deploy salatiso.com intranet for family collaboration'
      ],
      kpis: [
        { metric: 'Company Registration', target: '100%', current: '100%' },
        { metric: 'Governance Framework', target: '100%', current: '75%' },
        { metric: 'Bank Account Setup', target: '100%', current: '100%' },
        { metric: 'Patent Application', target: '100%', current: '40%' }
      ]
    },
    {
      id: 'short-term',
      name: 'Phase 2: 5-Year Horizon',
      timeline: 'Years 1–5',
      description: 'Profitability achievement and family integration',
      status: 'planning',
      color: 'from-blue-500 to-blue-600',
      goals: [
        'All core apps profitable',
        'Family intranet fully operational',
        'At least 3 subsidiaries trading',
        'Succession pathways established'
      ],
      actions: [
        'Scale BizHelp, SafetyHelp, PigeeBack, and Sazi Life Academy',
        'Launch non-profit modules for personal use',
        'Secure institutional clients (schools, NGOs, SMEs)',
        'Implement performance management via HrHelp',
        'Begin career path training for children at 18',
        'Annual family AGM with comprehensive reporting'
      ],
      kpis: [
        { metric: 'App Profitability', target: '4/4 Apps', current: '2/4 Apps' },
        { metric: 'Subsidiary Trading', target: '3', current: '1' },
        { metric: 'Family Integration', target: '100%', current: '60%' },
        { metric: 'Institutional Clients', target: '50+', current: '12' }
      ]
    },
    {
      id: 'medium-term',
      name: 'Phase 3: 10-Year Horizon',
      timeline: 'Years 6–10',
      description: 'Pan-African expansion and ecosystem recognition',
      status: 'future',
      color: 'from-green-500 to-green-600',
      goals: [
        'Pan-African trust economy platform recognition',
        'At least 6 subsidiaries trading',
        'Family leadership roles established',
        'International market presence'
      ],
      actions: [
        'Expand internationally with SADC regional hubs',
        'Launch LifeCV verification services',
        'Establish Family Foundation for philanthropy',
        'Rotate family leadership roles',
        'Begin share buy-back programs'
      ],
      kpis: [
        { metric: 'Regional Presence', target: '5 Countries', current: '1 Country' },
        { metric: 'Trading Subsidiaries', target: '6', current: '1' },
        { metric: 'LifeCV Verification', target: 'Live', current: 'Development' },
        { metric: 'Leadership Rotation', target: 'Active', current: 'Planning' }
      ]
    },
    {
      id: 'long-term',
      name: 'Phase 4: 15-Year Horizon',
      timeline: 'Years 11–15',
      description: 'Global recognition and trust establishment',
      status: 'future',
      color: 'from-purple-500 to-purple-600',
      goals: [
        'Global ecosystem recognition',
        'Family trust with IP ownership',
        'University partnerships',
        'AI-driven governance'
      ],
      actions: [
        'Transfer IP from MNI (Pty) Ltd to MNI Trust',
        'Expand global licensing of LifeCV and Trust Protocol',
        'Establish University partnerships for Sazi Life Academy',
        'Implement AI-driven governance dashboards'
      ],
      kpis: [
        { metric: 'Trust Establishment', target: 'Complete', current: 'Planning' },
        { metric: 'Global Licensing', target: 'Active', current: 'Future' },
        { metric: 'University Partners', target: '10+', current: '0' },
        { metric: 'AI Governance', target: 'Live', current: 'Concept' }
      ]
    },
    {
      id: 'legacy',
      name: 'Phase 5: 20-Year Horizon',
      timeline: 'Years 16–20',
      description: 'Multi-generational legacy institution',
      status: 'future',
      color: 'from-orange-500 to-orange-600',
      goals: [
        'Multi-generational family legacy',
        'Trust economy embedded in society',
        'Complete succession operational',
        'Ubuntu governance framework export'
      ],
      actions: [
        'Formalize coming-of-age traditions',
        'Establish global partnerships with governments',
        'Ensure every descendant has a role',
        'Export Ubuntu governance model globally'
      ],
      kpis: [
        { metric: 'Succession Complete', target: '100%', current: '0%' },
        { metric: 'Global Partnerships', target: '20+', current: '0' },
        { metric: 'Ubuntu Export', target: 'Active', current: 'Future' },
        { metric: 'Descendant Integration', target: '100%', current: '40%' }
      ]
    }
  ];

  const complianceChecklist = [
    { item: 'CIPC Registration', status: 'completed', due: '2024-03-31' },
    { item: 'SARS Registration', status: 'completed', due: '2024-04-30' },
    { item: 'VAT Registration', status: 'completed', due: '2024-05-31' },
    { item: 'PAYE Registration', status: 'completed', due: '2024-06-30' },
    { item: 'Patent Filing', status: 'in-progress', due: '2024-12-31' },
    { item: 'Trademark Registration', status: 'pending', due: '2025-03-31' },
    { item: 'Annual Returns', status: 'pending', due: '2025-12-31' }
  ];

  const profitabilityProjection = [
    { phase: 'Year 1-2', focus: 'Setup, IP protection, Visa\'s company trading', revenue: 'R 500K', status: 'active' },
    { phase: 'Year 3-5', focus: 'Core apps profitable, institutional licensing', revenue: 'R 5M', status: 'planning' },
    { phase: 'Year 6-10', focus: 'International expansion, multiple subsidiaries', revenue: 'R 25M', status: 'future' },
    { phase: 'Year 11-20', focus: 'Global trust economy, foundation, intergenerational wealth', revenue: 'R 100M+', status: 'future' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'planning': return <Target className="h-4 w-4 text-purple-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleImportBusinessPlan = (importedData: any) => {
    // TODO: Implement state management for business plan data
    console.log('Imported business plan data:', importedData);
  };

  return (
    <IntranetLayout title="Business Plan & Universal Template">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🏁 Mlandeli Notemba Investments Business Plan
              </h1>
              <p className="text-gray-600">
                Comprehensive 20-year roadmap & Universal Template for BizHelp
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <PrintExportButtons 
                data={{ businessPhases, exportDate: new Date().toISOString() }}
                filename="mni-business-plan"
                onImport={handleImportBusinessPlan}
              />
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
                { id: 'phases', name: 'Business Phases', icon: <Target className="h-4 w-4" /> },
                { id: 'template', name: 'Universal Template', icon: <FileText className="h-4 w-4" /> },
                { id: 'monitoring', name: 'Monitoring', icon: <TrendingUp className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Active Subsidiaries</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-500">Target: 8 by 2030</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Annual Revenue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">R 750K</div>
                <div className="text-sm text-gray-500">Target: R 5M by 2027</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">Family Integration</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">75%</div>
                <div className="text-sm text-gray-500">6 of 8 members active</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">Phase Progress</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">80%</div>
                <div className="text-sm text-gray-500">Phase 1 completion</div>
              </div>
            </div>

            {/* Profitability Projection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Profitability Projection</h2>
              <div className="space-y-4">
                {profitabilityProjection.map((projection, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{projection.phase}</div>
                      <div className="text-sm text-gray-600">{projection.focus}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{projection.revenue}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(projection.status)}`}>
                        {projection.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Dashboard */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Compliance Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceChecklist.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{item.item}</div>
                        <div className="text-xs text-gray-500">Due: {item.due}</div>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Business Phases Tab */}
        {activeTab === 'phases' && (
          <div className="space-y-6">
            {businessPhases.map((phase, index) => (
              <motion.div
                key={phase.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className={`p-6 bg-gradient-to-r ${phase.color} text-white cursor-pointer`}
                  onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{phase.name}</h3>
                      <p className="text-white/90">{phase.timeline} • {phase.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
                        {phase.status.replace('-', ' ')}
                      </span>
                      {selectedPhase === phase.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Target className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </div>

                {selectedPhase === phase.id && (
                  <motion.div 
                    className="p-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Goals */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">🎯 Key Goals</h4>
                        <ul className="space-y-2">
                          {phase.goals.map((goal, gIndex) => (
                            <li key={gIndex} className="flex items-start space-x-2">
                              <Target className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">🚀 Key Actions</h4>
                        <ul className="space-y-2">
                          {phase.actions.slice(0, 4).map((action, aIndex) => (
                            <li key={aIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{action}</span>
                            </li>
                          ))}
                          {phase.actions.length > 4 && (
                            <li className="text-sm text-gray-500 italic">
                              +{phase.actions.length - 4} more actions...
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* KPIs */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">📊 Key Metrics</h4>
                        <div className="space-y-3">
                          {phase.kpis.map((kpi, kIndex) => (
                            <div key={kIndex} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{kpi.metric}</span>
                                <span className="text-xs text-gray-500">{kpi.current} / {kpi.target}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-primary-600 h-1.5 rounded-full"
                                  style={{ 
                                    width: `${(parseInt(kpi.current.replace(/\D/g, '')) / parseInt(kpi.target.replace(/\D/g, '')) * 100) || 0}%` 
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Universal Template Tab */}
        {activeTab === 'template' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 Universal Business Plan Template</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                This comprehensive business plan serves as a universal template that can be adapted 
                for any business through the BizHelp platform. Each section provides structured 
                guidance for business planning and execution.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Core Components</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Registration & Compliance Framework</li>
                    <li>• Governance & Policy Templates</li>
                    <li>• Critical Role Assignments</li>
                    <li>• Operational Setup Guidelines</li>
                    <li>• 5–20 Year Projection Models</li>
                    <li>• Succession & Continuity Planning</li>
                    <li>• Monitoring & Revision Protocols</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Adaptable Elements</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Industry-specific compliance checklists</li>
                    <li>• Scalable governance structures</li>
                    <li>• Customizable role definitions</li>
                    <li>• Flexible timeline frameworks</li>
                    <li>• Variable profitability models</li>
                    <li>• Sector-appropriate KPI metrics</li>
                    <li>• Contextual risk assessments</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Implementation in BizHelp</h3>
                <p className="text-gray-600 mb-4">
                  This template will be integrated into the BizHelp platform, allowing any business to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <Building2 className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Generate Custom Plans</div>
                    <div className="text-sm text-gray-600">Industry-specific business plans</div>
                  </div>
                  <div className="text-center p-4">
                    <Target className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Track Progress</div>
                    <div className="text-sm text-gray-600">Milestone and KPI monitoring</div>
                  </div>
                  <div className="text-center p-4">
                    <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Scale Operations</div>
                    <div className="text-sm text-gray-600">Growth-ready frameworks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Monitoring & Updating Framework</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">Quarterly Reviews</div>
                  <div className="text-sm text-gray-600">Progress against milestones</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">Annual Revisions</div>
                  <div className="text-sm text-gray-600">Update projections & policies</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">Succession Tracking</div>
                  <div className="text-sm text-gray-600">Children’s leadership progress</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">Compliance Check</div>
                  <div className="text-sm text-gray-600">Banking, SARS, labor, IP</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 Continuous Improvement Cycle</h3>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1 text-center p-4 bg-white rounded-lg">
                    <div className="font-medium text-gray-900">Monitor</div>
                    <div className="text-sm text-gray-600">Track KPIs & milestones</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 text-center p-4 bg-white rounded-lg">
                    <div className="font-medium text-gray-900">Analyze</div>
                    <div className="text-sm text-gray-600">Assess performance gaps</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 text-center p-4 bg-white rounded-lg">
                    <div className="font-medium text-gray-900">Adjust</div>
                    <div className="text-sm text-gray-600">Update strategies & plans</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 text-center p-4 bg-white rounded-lg">
                    <div className="font-medium text-gray-900">Execute</div>
                    <div className="text-sm text-gray-600">Implement improvements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </IntranetLayout>
  );
};

export default BusinessPlan;