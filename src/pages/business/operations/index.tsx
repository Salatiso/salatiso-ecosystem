import React, { useState } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OperationalMetric {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

interface Project {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'completed' | 'planning';
  progress: number;
  owner: string;
  deadline: string;
}

const BusinessOperations: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'metrics' | 'reports'>('overview');

  const metrics: OperationalMetric[] = [
    {
      id: '1',
      name: 'Active Projects',
      value: '12',
      change: '+3 this month',
      trend: 'up',
      icon: Target
    },
    {
      id: '2',
      name: 'Team Members',
      value: '8',
      change: 'Fully allocated',
      trend: 'stable',
      icon: Users
    },
    {
      id: '3',
      name: 'Completion Rate',
      value: '94%',
      change: '+5% from last quarter',
      trend: 'up',
      icon: TrendingUp
    },
    {
      id: '4',
      name: 'On-Time Delivery',
      value: '89%',
      change: 'Meeting targets',
      trend: 'up',
      icon: Clock
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'Salatiso Ecosystem Phase 5',
      status: 'completed',
      progress: 100,
      owner: 'Salatiso Mdeni',
      deadline: '2025-10-14'
    },
    {
      id: '2',
      name: 'Sonny Network Integration',
      status: 'planning',
      progress: 15,
      owner: 'Salatiso Mdeni',
      deadline: '2025-11-30'
    },
    {
      id: '3',
      name: 'Family Contact Management',
      status: 'on-track',
      progress: 65,
      owner: 'Kwakho Mdeni',
      deadline: '2025-10-20'
    },
    {
      id: '4',
      name: 'Marketing Campaign Q4',
      status: 'on-track',
      progress: 72,
      owner: 'Tina Mdeni',
      deadline: '2025-12-15'
    },
    {
      id: '5',
      name: 'AI Content Production',
      status: 'on-track',
      progress: 88,
      owner: 'Solo Mdeni',
      deadline: '2025-10-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'planning':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return CheckCircle;
      case 'at-risk':
        return AlertCircle;
      case 'completed':
        return CheckCircle;
      case 'planning':
        return Clock;
      default:
        return Activity;
    }
  };

  return (
    <IntranetLayout>
      <Head>
        <title>Business Operations - MNI Ecosystem</title>
        <meta name="description" content="Operational metrics and project management for Mlandeli-Notemba Investments" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Business Operations
          </h1>
          <p className="text-lg text-gray-600">
            Operational metrics, project tracking, and performance monitoring
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'projects', name: 'Projects', icon: Target },
              { id: 'metrics', name: 'Metrics', icon: BarChart3 },
              { id: 'reports', name: 'Reports', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map(metric => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      metric.trend === 'up' ? 'bg-green-100' : 
                      metric.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <metric.icon className={`h-6 w-6 ${
                        metric.trend === 'up' ? 'text-green-600' :
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                  <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                  <p className="text-xs text-gray-500">{metric.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Projects</h2>
              <div className="space-y-4">
                {projects.slice(0, 3).map(project => {
                  const StatusIcon = getStatusIcon(project.status);
                  return (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <StatusIcon className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Owner: {project.owner}</span>
                          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <div className="text-right mb-1">
                          <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {projects.map(project => {
              const StatusIcon = getStatusIcon(project.status);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <StatusIcon className="h-6 w-6 text-gray-400" />
                        <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{project.owner}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Operational Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {metrics.map(metric => (
                <div key={metric.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        metric.trend === 'up' ? 'bg-green-100' :
                        metric.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <metric.icon className={`h-5 w-5 ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="font-semibold text-gray-900">{metric.name}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  </div>
                  <p className="text-sm text-gray-600 pl-11">{metric.change}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports</h2>
            <p className="text-gray-600 mb-6">
              Operational reports and analytics will be available here
            </p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Generate Report
            </button>
          </div>
        )}
      </div>
    </IntranetLayout>
  );
};

export default BusinessOperations;
