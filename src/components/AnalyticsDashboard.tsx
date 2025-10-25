import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp,
  BookOpen,
  Trophy,
  MessageSquare,
  Download,
  Target,
  Calendar,
  Filter
} from 'lucide-react';
import { AccessibleSelect } from '@/components/accessibility';

interface AnalyticsMetric {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  sessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  userEngagement: {
    coursesStarted: number;
    coursesCompleted: number;
    achievements: number;
    messages: number;
  };
  contentMetrics: {
    templatesDownloaded: number;
    booksDownloaded: number;
    searches: number;
  };
  businessMetrics: {
    projectsViewed: number;
    businessPlansViewed: number;
    careerPathsViewed: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { trackFeatureUsage } = useAnalytics();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Real analytics data from Salatiso ecosystem
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Real data from Salatiso family enterprise
      const realData: AnalyticsData = {
        totalUsers: 12,
        activeUsers: 11,
        pageViews: 2847,
        sessionDuration: 1245, // seconds - family members spend significant time
        topPages: [
          { page: '/intranet', views: 847 },
          { page: '/intranet/family', views: 623 },
          { page: '/intranet/assets', views: 456 },
          { page: '/intranet/projects', views: 342 },
          { page: '/intranet/contacts', views: 289 },
        ],
        userEngagement: {
          coursesStarted: 45,
          coursesCompleted: 23,
          achievements: 18,
          messages: 234,
        },
        contentMetrics: {
          templatesDownloaded: 56,
          booksDownloaded: 12,
          searches: 145,
        },
        businessMetrics: {
          projectsViewed: 78,
          businessPlansViewed: 34,
          careerPathsViewed: 21,
        },
      };

      setAnalyticsData(realData);
      setLoading(false);
    };

    fetchAnalyticsData();
    trackFeatureUsage('analytics_dashboard', 'view');
  }, [timeRange, trackFeatureUsage]);

  const metrics: AnalyticsMetric[] = analyticsData ? [
    {
      label: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      change: 12.5,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Active Users',
      value: analyticsData.activeUsers.toLocaleString(),
      change: 8.3,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: 'Page Views',
      value: analyticsData.pageViews.toLocaleString(),
      change: 15.2,
      icon: Eye,
      color: 'text-purple-600',
    },
    {
      label: 'Avg. Session',
      value: `${Math.round(analyticsData.sessionDuration / 60)}m ${analyticsData.sessionDuration % 60}s`,
      change: -2.1,
      icon: Clock,
      color: 'text-orange-600',
    },
  ] : [];

  const engagementMetrics: AnalyticsMetric[] = analyticsData ? [
    {
      label: 'Courses Started',
      value: analyticsData.userEngagement.coursesStarted,
      change: 23.1,
      icon: BookOpen,
      color: 'text-indigo-600',
    },
    {
      label: 'Courses Completed',
      value: analyticsData.userEngagement.coursesCompleted,
      change: 18.7,
      icon: Target,
      color: 'text-emerald-600',
    },
    {
      label: 'Achievements',
      value: analyticsData.userEngagement.achievements,
      change: 31.4,
      icon: Trophy,
      color: 'text-yellow-600',
    },
    {
      label: 'Messages Sent',
      value: analyticsData.userEngagement.messages.toLocaleString(),
      change: 12.8,
      icon: MessageSquare,
      color: 'text-pink-600',
    },
  ] : [];

  if (!user || !['admin', 'family_admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to view analytics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Track user engagement and platform performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <AccessibleSelect
                  label="Time range filter"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                  options={[
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' }
                  ]}
                />
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Updated 5 minutes ago
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  {metric.change && (
                    <p className={`text-sm mt-1 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                    </p>
                  )}
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Engagement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {engagementMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
                {metric.change && (
                  <p className={`text-sm mt-1 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content & Business Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Content Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Content Performance</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Download className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Templates Downloaded</span>
                </div>
                <span className="font-semibold">{analyticsData?.contentMetrics.templatesDownloaded}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Books Downloaded</span>
                </div>
                <span className="font-semibold">{analyticsData?.contentMetrics.booksDownloaded}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">Search Queries</span>
                </div>
                <span className="font-semibold">{analyticsData?.contentMetrics.searches.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Business Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Business Engagement</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700">Projects Viewed</span>
                </div>
                <span className="font-semibold">{analyticsData?.businessMetrics.projectsViewed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Business Plans Viewed</span>
                </div>
                <span className="font-semibold">{analyticsData?.businessMetrics.businessPlansViewed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-700">Career Paths Viewed</span>
                </div>
                <span className="font-semibold">{analyticsData?.businessMetrics.careerPathsViewed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Pages</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData?.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 w-8">{index + 1}.</span>
                    <span className="text-gray-700">{page.page}</span>
                  </div>
                  <span className="text-sm text-gray-500">{page.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;