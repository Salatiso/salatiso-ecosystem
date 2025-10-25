import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BookOpen, Award, Target, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { UbuntuIcon, FamilyIcon } from '../icons';

interface LearningMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface TrainingProgram {
  id: string;
  name: string;
  category: 'ubuntu' | 'leadership' | 'technical' | 'cultural';
  enrolled: number;
  completed: number;
  averageScore: number;
  averageTime: number; // hours
  satisfaction: number; // 1-5
}

interface CulturalImpact {
  id: string;
  metric: string;
  value: number;
  target: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

const TrainingAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [metrics, setMetrics] = useState<LearningMetric[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [culturalImpact, setCulturalImpact] = useState<CulturalImpact[]>([]);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = () => {
      const learningMetrics: LearningMetric[] = [
        {
          id: 'total_learners',
          name: 'Active Learners',
          value: 1247,
          change: 12.5,
          changeType: 'increase',
          unit: 'users',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          id: 'completion_rate',
          name: 'Completion Rate',
          value: 78.3,
          change: 5.2,
          changeType: 'increase',
          unit: '%',
          icon: Target,
          color: 'text-green-600'
        },
        {
          id: 'avg_learning_time',
          name: 'Avg Learning Time',
          value: 4.2,
          change: -0.3,
          changeType: 'decrease',
          unit: 'hours/week',
          icon: BookOpen,
          color: 'text-purple-600'
        },
        {
          id: 'certifications_earned',
          name: 'Certifications Earned',
          value: 89,
          change: 23.1,
          changeType: 'increase',
          unit: 'this month',
          icon: Award,
          color: 'text-yellow-600'
        }
      ];

      const trainingPrograms: TrainingProgram[] = [
        {
          id: 'ubuntu-foundation',
          name: 'Ubuntu Foundation',
          category: 'ubuntu',
          enrolled: 247,
          completed: 189,
          averageScore: 87,
          averageTime: 12,
          satisfaction: 4.6
        },
        {
          id: 'cultural-stewardship',
          name: 'Cultural Stewardship',
          category: 'cultural',
          enrolled: 156,
          completed: 98,
          averageScore: 82,
          averageTime: 18,
          satisfaction: 4.4
        },
        {
          id: 'ubuntu-leadership',
          name: 'Ubuntu Leadership',
          category: 'leadership',
          enrolled: 89,
          completed: 45,
          averageScore: 79,
          averageTime: 24,
          satisfaction: 4.7
        },
        {
          id: 'digital-ecosystem',
          name: 'Digital Ecosystem Mastery',
          category: 'technical',
          enrolled: 34,
          completed: 12,
          averageScore: 91,
          averageTime: 36,
          satisfaction: 4.8
        }
      ];

      const culturalMetrics: CulturalImpact[] = [
        {
          id: 'ubuntu_alignment',
          metric: 'Ubuntu Alignment Score',
          value: 87,
          target: 90,
          description: 'Overall cultural alignment across all activities',
          trend: 'up'
        },
        {
          id: 'community_engagement',
          metric: 'Community Engagement',
          value: 76,
          target: 85,
          description: 'Active participation in cultural activities',
          trend: 'up'
        },
        {
          id: 'knowledge_transfer',
          metric: 'Knowledge Transfer',
          value: 68,
          target: 80,
          description: 'Intergenerational wisdom sharing',
          trend: 'stable'
        },
        {
          id: 'cultural_preservation',
          metric: 'Cultural Preservation',
          value: 92,
          target: 95,
          description: 'Traditional practices maintained',
          trend: 'up'
        }
      ];

      setMetrics(learningMetrics);
      setPrograms(trainingPrograms);
      setCulturalImpact(culturalMetrics);
    };

    loadAnalytics();
  }, [timeRange]);

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ubuntu': return 'bg-purple-100 text-purple-800';
      case 'leadership': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-green-100 text-green-800';
      case 'cultural': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-8 h-8 text-ubuntu-purple mr-3" />
          <div>
            <h2 className="text-xl font-bold text-ubuntu-purple">Training Analytics Dashboard</h2>
            <p className="text-gray-600 text-sm">
              Monitor learning progress and cultural impact across the ecosystem
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ubuntu-purple focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
              {getChangeIcon(metric.changeType)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {typeof metric.value === 'number' && metric.value % 1 !== 0
                ? metric.value.toFixed(1)
                : metric.value}
              <span className="text-sm text-gray-600 ml-1">{metric.unit}</span>
            </div>
            <div className="text-sm text-gray-600">{metric.name}</div>
            <div className={`text-xs mt-1 ${
              metric.changeType === 'increase' ? 'text-green-600' :
              metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit === '%' ? '%' : metric.unit === 'users' ? '' : ' ' + metric.unit} from last {timeRange}
            </div>
          </div>
        ))}
      </div>

      {/* Training Programs Performance */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Programs Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Program</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Enrolled</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Completed</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Completion Rate</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Avg Score</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Avg Time</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{program.name}</div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getCategoryColor(program.category)}`}>
                        {program.category}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-900">{program.enrolled}</td>
                  <td className="text-center py-3 px-4 text-gray-900">{program.completed}</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-ubuntu-purple h-2 rounded-full"
                          style={{ width: `${(program.completed / program.enrolled) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {Math.round((program.completed / program.enrolled) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-medium ${
                      program.averageScore >= 90 ? 'text-green-600' :
                      program.averageScore >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {program.averageScore}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-900">{program.averageTime}h</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center">
                      {renderStars(program.satisfaction)}
                      <span className="ml-1 text-sm text-gray-600">({program.satisfaction})</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cultural Impact Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultural Impact Metrics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {culturalImpact.map((impact) => (
            <div key={impact.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{impact.metric}</h4>
                <div className={`text-2xl font-bold ${getTrendColor(impact.trend)}`}>
                  {impact.value}%
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{impact.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Target: {impact.target}%
                </div>
                <div className="flex items-center">
                  {impact.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600 mr-1" />}
                  {impact.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-600 rotate-180 mr-1" />}
                  <span className={`text-sm ${getTrendColor(impact.trend)}`}>
                    {impact.trend === 'up' ? 'Improving' : impact.trend === 'down' ? 'Declining' : 'Stable'}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      impact.value >= impact.target ? 'bg-green-500' :
                      impact.value >= impact.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(impact.value / impact.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Journey Visualization */}
      <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Learning Journey Overview</h3>
            <p className="text-sm opacity-90">Ubuntu-aligned education progress</p>
          </div>
          <Activity className="w-8 h-8 opacity-80" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">1,247</div>
            <div className="text-sm opacity-90">Active Learners</div>
            <div className="text-xs opacity-75 mt-1">+12.5% this month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">89</div>
            <div className="text-sm opacity-90">Certifications Earned</div>
            <div className="text-xs opacity-75 mt-1">+23.1% this month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">4.6</div>
            <div className="text-sm opacity-90">Avg Satisfaction</div>
            <div className="text-xs opacity-75 mt-1">Out of 5 stars</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingAnalyticsDashboard;