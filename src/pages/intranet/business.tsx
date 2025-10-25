import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Users,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  LineChart,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/hooks/useOffline';

interface MNIHolding {
  id: string;
  name: string;
  type: 'company' | 'property' | 'fund' | 'service' | 'partnership';
  description: string;
  valueUSD: number;
  ownership: number; // percentage
  revenue: number;
  profitMargin: number;
  employees: number;
  status: 'active' | 'developing' | 'mature' | 'divesting';
  location: string;
  foundedYear: number;
  leadership: string;
  performance: number; // -100 to 100 (% change)
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
  contributors: string[];
}

interface FinancialMetrics {
  totalAssets: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  employeesTotal: number;
  holdingsCount: number;
  growthRate: number;
  roi: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'planning' | 'active' | 'review' | 'completed';
  target: number;
  invested: number;
  expectedReturn: number;
  timelineMonths: number;
  riskLevel: 'low' | 'medium' | 'high';
  progress: number;
}

const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const [selectedPeriod, setSelectedPeriod] = useState('ytd'); // ytd, quarter, year, all
  const [viewType, setViewType] = useState<'overview' | 'holdings' | 'projects' | 'analytics'>('overview');
  const [expandedHolding, setExpandedHolding] = useState<string | null>(null);

  // Sample MNI Holdings Data
  const holdings: MNIHolding[] = [
    {
      id: 'mni-core',
      name: 'MNI Core Holdings',
      type: 'company',
      description: 'Central holding company coordinating all MNI family enterprise initiatives and strategic investments.',
      valueUSD: 25000000,
      ownership: 100,
      revenue: 8500000,
      profitMargin: 28,
      employees: 156,
      status: 'mature',
      location: 'Eastern Cape, South Africa',
      foundedYear: 2020,
      leadership: 'Lonwabo Mdeni',
      performance: 18.5,
      riskLevel: 'low',
      lastUpdated: '2025-10-15',
      contributors: ['Strategic Planning', 'Operations', 'Finance']
    },
    {
      id: 'salatiso-lifecv',
      name: 'Salatiso LifeCV Platform',
      type: 'service',
      description: 'Digital career passport and skill verification platform for emerging professionals.',
      valueUSD: 12000000,
      ownership: 85,
      revenue: 3200000,
      profitMargin: 42,
      employees: 48,
      status: 'active',
      location: 'Virtual/South Africa',
      foundedYear: 2022,
      leadership: 'Lonwabo Mdeni',
      performance: 35.2,
      riskLevel: 'medium',
      lastUpdated: '2025-10-15',
      contributors: ['Tech Development', 'User Growth', 'B2B Sales']
    },
    {
      id: 'sonny-network',
      name: 'Sonny Network Protocol',
      type: 'partnership',
      description: 'Ubuntu-inspired mesh networking system for family enterprise coordination and trust building.',
      valueUSD: 8500000,
      ownership: 100,
      revenue: 1200000,
      profitMargin: 35,
      employees: 22,
      status: 'developing',
      location: 'Technology Hub, South Africa',
      foundedYear: 2024,
      leadership: 'Tech Innovation Team',
      performance: 52.1,
      riskLevel: 'high',
      lastUpdated: '2025-10-14',
      contributors: ['Innovation', 'Research', 'Partnerships']
    },
    {
      id: 'sazi-academy',
      name: 'Sazi Life Academy',
      type: 'service',
      description: 'Comprehensive life skills and professional development curriculum for emerging generations.',
      valueUSD: 5800000,
      ownership: 90,
      revenue: 2100000,
      profitMargin: 38,
      employees: 35,
      status: 'active',
      location: 'Multiple, South Africa',
      foundedYear: 2023,
      leadership: 'Education Team',
      performance: 28.7,
      riskLevel: 'low',
      lastUpdated: '2025-10-15',
      contributors: ['Curriculum', 'Training', 'Certification']
    },
    {
      id: 'trust-framework',
      name: 'Ubuntu Trust Framework',
      type: 'fund',
      description: 'Investment and benefit distribution framework based on Ubuntu principles of shared prosperity.',
      valueUSD: 18500000,
      ownership: 100,
      revenue: 4300000,
      profitMargin: 22,
      employees: 8,
      status: 'mature',
      location: 'Finance Center, South Africa',
      foundedYear: 2020,
      leadership: 'Trust Management',
      performance: 12.4,
      riskLevel: 'low',
      lastUpdated: '2025-10-15',
      contributors: ['Portfolio Management', 'Distributions', 'Growth']
    },
    {
      id: 'business-development',
      name: 'Business Development Fund',
      type: 'fund',
      description: 'Capital reserve for strategic acquisitions, new ventures, and emerging opportunities.',
      valueUSD: 9200000,
      ownership: 100,
      revenue: 1800000,
      profitMargin: 18,
      employees: 5,
      status: 'active',
      location: 'Investment Office, South Africa',
      foundedYear: 2021,
      leadership: 'Investment Team',
      performance: 15.8,
      riskLevel: 'medium',
      lastUpdated: '2025-10-14',
      contributors: ['M&A', 'Venture Capital', 'Growth']
    }
  ];

  // Sample Projects
  const projects: Project[] = [
    {
      id: 'proj-sonny-expansion',
      name: 'Sonny Network Global Expansion',
      description: 'Expand Sonny mesh networking to international markets and enterprise clients.',
      owner: 'Tech Innovation Team',
      status: 'active',
      target: 5000000,
      invested: 2100000,
      expectedReturn: 18000000,
      timelineMonths: 24,
      riskLevel: 'high',
      progress: 42
    },
    {
      id: 'proj-lifecv-integration',
      name: 'LifeCV Ecosystem Integration',
      description: 'Integrate LifeCV with corporate HR systems and educational institutions.',
      owner: 'Platform Team',
      status: 'active',
      target: 2500000,
      invested: 1200000,
      expectedReturn: 8500000,
      timelineMonths: 18,
      riskLevel: 'medium',
      progress: 58
    },
    {
      id: 'proj-academy-scaling',
      name: 'Sazi Academy Scaling',
      description: 'Scale Sazi Life Academy curriculum to 50 additional institutions across Africa.',
      owner: 'Education Team',
      status: 'planning',
      target: 3000000,
      invested: 400000,
      expectedReturn: 12000000,
      timelineMonths: 30,
      riskLevel: 'medium',
      progress: 15
    },
    {
      id: 'proj-trust-innovation',
      name: 'Trust Framework Innovation',
      description: 'Develop blockchain-based verification and distribution mechanisms for trust framework.',
      owner: 'Trust Management',
      status: 'review',
      target: 1500000,
      invested: 950000,
      expectedReturn: 5000000,
      timelineMonths: 12,
      riskLevel: 'high',
      progress: 68
    }
  ];

  // Calculate metrics
  const metrics: FinancialMetrics = useMemo(() => {
    return {
      totalAssets: holdings.reduce((sum, h) => sum + h.valueUSD, 0),
      totalRevenue: holdings.reduce((sum, h) => sum + h.revenue, 0),
      totalProfit: holdings.reduce((sum, h) => sum + (h.revenue * h.profitMargin / 100), 0),
      profitMargin: Math.round(holdings.reduce((sum, h) => sum + h.profitMargin, 0) / holdings.length),
      employeesTotal: holdings.reduce((sum, h) => sum + h.employees, 0),
      holdingsCount: holdings.length,
      growthRate: 22.5,
      roi: 18.7
    };
  }, []);

  // Filter holdings by status
  const holdingsByStatus = useMemo(() => {
    return {
      active: holdings.filter(h => h.status === 'active').length,
      developing: holdings.filter(h => h.status === 'developing').length,
      mature: holdings.filter(h => h.status === 'mature').length,
      divesting: holdings.filter(h => h.status === 'divesting').length
    };
  }, []);

  // Holdings by type
  const holdingsByType = useMemo(() => {
    const types: Record<string, number> = {};
    holdings.forEach(h => {
      types[h.type] = (types[h.type] || 0) + h.valueUSD;
    });
    return types;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'developing': return 'bg-blue-100 text-blue-800';
      case 'mature': return 'bg-purple-100 text-purple-800';
      case 'divesting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Overview View
  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-purple-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(metrics.totalAssets)}
              </p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{metrics.growthRate}% YoY
              </p>
            </div>
            <Building2 className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Annual Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(metrics.totalRevenue)}
              </p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +18.5% Growth
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(metrics.totalProfit)}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {metrics.profitMargin}% Margin
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-orange-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">ROI & Growth</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.roi}%</p>
              <p className="text-xs text-gray-600 mt-2">
                {metrics.employeesTotal} Team Members
              </p>
            </div>
            <Zap className="w-12 h-12 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Holdings Summary & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Holdings Status
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Active', count: holdingsByStatus.active, color: 'bg-green-100 text-green-800' },
              { label: 'Developing', count: holdingsByStatus.developing, color: 'bg-blue-100 text-blue-800' },
              { label: 'Mature', count: holdingsByStatus.mature, color: 'bg-purple-100 text-purple-800' }
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-gray-700">{item.label}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.color}`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Active Projects
          </h3>
          <div className="space-y-3">
            {projects.slice(0, 3).map(project => (
              <div key={project.id} className="pb-2 border-b last:border-b-0">
                <p className="text-sm font-medium text-gray-700">{project.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.progress}% Complete</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quick Stats
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Holdings</span>
              <span className="font-semibold text-gray-900">{metrics.holdingsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Team Members</span>
              <span className="font-semibold text-gray-900">{metrics.employeesTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Profit Margin</span>
              <span className="font-semibold text-gray-900">{metrics.profitMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Investments</span>
              <span className="font-semibold text-gray-900">{projects.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Holdings by Value</h3>
        <div className="space-y-3">
          {holdings
            .sort((a, b) => b.valueUSD - a.valueUSD)
            .slice(0, 5)
            .map((holding, idx) => (
              <div key={holding.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{holding.name}</p>
                      <p className="text-xs text-gray-500">{holding.type}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(holding.valueUSD)}</p>
                  <p className={`text-xs ${holding.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {holding.performance >= 0 ? '+' : ''}{holding.performance}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Holdings View
  const renderHoldings = () => (
    <div className="space-y-4">
      {holdings.map((holding) => (
        <motion.div
          key={holding.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{holding.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(holding.status)}`}>
                  {holding.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{holding.description}</p>
            </div>
            <button
              onClick={() => setExpandedHolding(expandedHolding === holding.id ? null : holding.id)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expandedHolding === holding.id ? 'Hide' : 'Details'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
            <div>
              <p className="text-xs text-gray-600 font-medium">Value</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(holding.valueUSD)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Revenue</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(holding.revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Profit Margin</p>
              <p className="text-lg font-bold text-blue-600">{holding.profitMargin}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Employees</p>
              <p className="text-lg font-bold text-purple-600">{holding.employees}</p>
            </div>
          </div>

          {expandedHolding === holding.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-medium text-gray-900">{holding.foundedYear}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">{holding.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Leadership</span>
                  <span className="font-medium text-gray-900">{holding.leadership}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ownership</span>
                  <span className="font-medium text-gray-900">{holding.ownership}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performance</span>
                  <span className={`font-medium ${holding.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {holding.performance >= 0 ? '+' : ''}{holding.performance}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risk Level</span>
                  <span className={`font-medium ${getRiskColor(holding.riskLevel)}`}>
                    {holding.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-900">{holding.lastUpdated}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block mb-2">Contributors</span>
                  <div className="flex flex-wrap gap-1">
                    {holding.contributors.map((contrib) => (
                      <span key={contrib} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {contrib}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  // Projects View
  const renderProjects = () => (
    <div className="space-y-4">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProjectStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="text-xs text-gray-500 mt-2">Owner: {project.owner}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Investment Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(project.invested / project.target) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {Math.round((project.invested / project.target) * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(project.invested)} of {formatCurrency(project.target)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Timeline</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">{project.timelineMonths} months</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Completion Progress: {project.progress}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Expected ROI</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(project.expectedReturn)}</p>
              <p className={`text-xs mt-1 ${getRiskColor(project.riskLevel)}`}>
                {project.riskLevel.toUpperCase()} RISK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
              View Details
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
              Update Status
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <IntranetLayout>
      <Head>
        <title>Business Dashboard | MNI Intranet</title>
        <meta name="description" content="MNI Holdings and Business Analytics Dashboard" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Business Dashboard</h1>
            <p className="text-gray-600 mt-1">MNI Holdings, Assets, and Strategic Projects</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Initiative
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
          {['overview', 'holdings', 'projects', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setViewType(tab as any)}
              className={`px-6 py-2 rounded-md font-medium transition-colors capitalize ${
                viewType === tab
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
          {['ytd', 'quarter', 'year', 'all'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {period === 'ytd' ? 'Year to Date' : period === 'all' ? 'All Time' : period.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {viewType === 'overview' && renderOverview()}
        {viewType === 'holdings' && renderHoldings()}
        {viewType === 'projects' && renderProjects()}
        {viewType === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">Detailed financial analysis and trend reports coming soon.</p>
          </div>
        )}
      </div>
    </IntranetLayout>
  );
};

export default BusinessDashboard;
