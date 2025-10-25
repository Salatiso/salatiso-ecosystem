import React, { useState, useEffect } from 'react';
import { Users, Heart, Shield, BookOpen, TrendingUp, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { UbuntuIcon, FamilyIcon } from '../icons';

interface GovernanceMetric {
  id: string;
  name: string;
  xhosa: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface GovernanceAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignee?: string;
  dueDate?: string;
}

const UbuntuGovernanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<GovernanceMetric[]>([]);
  const [actions, setActions] = useState<GovernanceAction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'actions'>('overview');

  useEffect(() => {
    // Simulate loading governance data
    const loadGovernanceData = () => {
      const governanceMetrics: GovernanceMetric[] = [
        {
          id: 'community_engagement',
          name: 'Community Engagement',
          xhosa: 'Ukudibana Kwabantu',
          value: 87,
          target: 90,
          unit: '%',
          trend: 'up',
          description: 'Active participation in community decision-making processes',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          id: 'reciprocity_index',
          name: 'Reciprocity Index',
          xhosa: 'Isalathiso Sokuphindisela',
          value: 78,
          target: 85,
          unit: '%',
          trend: 'up',
          description: 'Balance of giving and receiving within the community',
          icon: Heart,
          color: 'text-red-600'
        },
        {
          id: 'cultural_preservation',
          name: 'Cultural Preservation',
          xhosa: 'Ukugcinwa Kwamasiko',
          value: 92,
          target: 95,
          unit: '%',
          trend: 'stable',
          description: 'Maintenance of Ubuntu traditions and cultural practices',
          icon: Shield,
          color: 'text-purple-600'
        },
        {
          id: 'knowledge_sharing',
          name: 'Knowledge Sharing',
          xhosa: 'Ukwabelana Ngolwazi',
          value: 71,
          target: 80,
          unit: '%',
          trend: 'up',
          description: 'Transfer of wisdom between generations',
          icon: BookOpen,
          color: 'text-green-600'
        }
      ];

      const governanceActions: GovernanceAction[] = [
        {
          id: 'elder_council_meeting',
          title: 'Monthly Elder Council Meeting',
          description: 'Gather community elders to discuss important matters and share wisdom',
          priority: 'high',
          status: 'pending',
          assignee: 'Community Elders',
          dueDate: '2025-10-15'
        },
        {
          id: 'ubuntu_training',
          title: 'Ubuntu Philosophy Training',
          description: 'Conduct training sessions on Ubuntu principles for new community members',
          priority: 'medium',
          status: 'in_progress',
          assignee: 'Sazi Life Academy',
          dueDate: '2025-10-30'
        },
        {
          id: 'reciprocity_audit',
          title: 'Community Reciprocity Audit',
          description: 'Review and balance community giving/receiving relationships',
          priority: 'medium',
          status: 'pending',
          assignee: 'Governance Council',
          dueDate: '2025-11-15'
        },
        {
          id: 'cultural_festival',
          title: 'Annual Ubuntu Cultural Festival',
          description: 'Celebrate Ubuntu values through traditional ceremonies and sharing',
          priority: 'high',
          status: 'completed',
          assignee: 'Cultural Committee',
          dueDate: '2025-09-28'
        }
      ];

      setMetrics(governanceMetrics);
      setActions(governanceActions);
    };

    loadGovernanceData();
  }, []);

  const getOverallHealth = () => {
    if (metrics.length === 0) return 0;
    const average = metrics.reduce((sum, metric) => sum + (metric.value / metric.target) * 100, 0) / metrics.length;
    return Math.round(average);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UbuntuIcon className="w-8 h-8 text-ubuntu-purple mr-3" />
          <div>
            <h2 className="text-xl font-bold text-ubuntu-purple">Ubuntu Governance Dashboard</h2>
            <p className="text-gray-600 text-sm">
              Monitor community health through Ubuntu principles
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-ubuntu-purple">{getOverallHealth()}%</div>
          <div className="text-sm text-gray-600">Overall Health</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'metrics', label: 'Metrics' },
          { id: 'actions', label: 'Actions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-ubuntu-purple shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Health Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-sm text-gray-600">{metric.name}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.xhosa}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Ubuntu Governance Principles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Active Principles</h4>
                <ul className="text-sm space-y-1">
                  <li>• Community decision-making</li>
                  <li>• Reciprocal relationships</li>
                  <li>• Respect for elders</li>
                  <li>• Collective wisdom sharing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Current Focus</h4>
                <ul className="text-sm space-y-1">
                  <li>• Elder council engagement</li>
                  <li>• Cultural knowledge transfer</li>
                  <li>• Community reciprocity</li>
                  <li>• Ubuntu value integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <metric.icon className={`w-6 h-6 ${metric.color} mr-3`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{metric.name}</h3>
                    <p className="text-sm text-gray-600">{metric.xhosa}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}{metric.unit}
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: {metric.target}{metric.unit}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{metric.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm text-gray-600 ml-2 capitalize">{metric.trend} trend</span>
                </div>
                <div className="text-sm text-gray-600">
                  {metric.value >= metric.target ? 'On track' : 'Needs attention'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium text-gray-900 mr-3">{action.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(action.priority)}`}>
                      {action.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                  {action.assignee && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      Assigned to: {action.assignee}
                    </div>
                  )}
                </div>
                <div className="flex items-center ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(action.status)}`}>
                    {getStatusIcon(action.status)}
                    <span className="ml-1 capitalize">{action.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              {action.dueDate && (
                <div className="text-sm text-gray-600">
                  Due: {new Date(action.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UbuntuGovernanceDashboard;