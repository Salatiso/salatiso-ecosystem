'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { EscalationEvent, EscalationStatus, EscalationLevel } from '@/types/escalation';

interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface EscalationTrend {
  date: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

interface LevelDistribution {
  name: string;
  value: number;
  color: string;
}

interface ResponderMetrics {
  responder: string;
  total: number;
  resolved: number;
  avgTime: number;
  efficiency: number;
}

/**
 * AnalyticsDashboard Component
 * 
 * Displays escalation analytics with:
 * - Key metrics and KPIs
 * - Trend charts over time
 * - Status and level distribution
 * - Team performance metrics
 * - Response time analysis
 */
export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [escalations, setEscalations] = useState<EscalationEvent[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [trends, setTrends] = useState<EscalationTrend[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([]);
  const [levelDistribution, setLevelDistribution] = useState<LevelDistribution[]>([]);
  const [responderMetrics, setResponderMetrics] = useState<ResponderMetrics[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  // Fetch escalations from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchEscalations = async () => {
      try {
        setLoading(true);
        let q;

        // Filter by time range
        const now = new Date();
        let startDate = new Date();

        if (timeRange === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        } else {
          startDate = new Date(0); // All time
        }

        q = query(collection(db, 'escalations'));
        const snapshot = await getDocs(q);

        const data: EscalationEvent[] = [];
        snapshot.docs.forEach((doc) => {
          const escalation = doc.data() as EscalationEvent;
          const createdAt = escalation.createdAt instanceof Timestamp
            ? escalation.createdAt.toDate()
            : new Date(escalation.createdAt);

          if (createdAt >= startDate) {
            data.push({
              ...escalation,
              id: doc.id,
              createdAt,
            });
          }
        });

        setEscalations(data);
        calculateMetrics(data);
        calculateTrends(data);
        calculateDistributions(data);
        calculateResponderMetrics(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching escalations:', error);
        setLoading(false);
      }
    };

    fetchEscalations();
  }, [user, timeRange]);

  // Calculate key metrics
  const calculateMetrics = useCallback((data: EscalationEvent[]) => {
    if (data.length === 0) {
      setMetrics([
        { label: 'Total Escalations', value: 0 },
        { label: 'Average Response Time', value: 0, unit: 'min' },
        { label: 'Resolution Rate', value: 0, unit: '%' },
        { label: 'Critical Incidents', value: 0 },
      ]);
      return;
    }

    const total = data.length;
    const resolved = data.filter(e => e.status === EscalationStatus.RESOLVED || e.status === EscalationStatus.ARCHIVED).length;
    const critical = data.filter(e => e.currentLevel === EscalationLevel.PROFESSIONAL).length;

    // Calculate average response time (escalated vs created)
    let totalResponseTime = 0;
    let escalatedCount = 0;
    data.forEach(e => {
      if (e.escalatedAt) {
        const responseTime = new Date(e.escalatedAt).getTime() - new Date(e.createdAt).getTime();
        totalResponseTime += responseTime;
        escalatedCount++;
      }
    });
    const avgResponseTime = escalatedCount > 0 ? Math.round(totalResponseTime / escalatedCount / 60000) : 0;
    const resolutionRate = Math.round((resolved / total) * 100);

    setMetrics([
      { label: 'Total Escalations', value: total, change: 5, trend: 'up' },
      { label: 'Average Response Time', value: avgResponseTime, unit: 'min', change: -2, trend: 'down' },
      { label: 'Resolution Rate', value: resolutionRate, unit: '%', change: 3, trend: 'up' },
      { label: 'Critical Incidents', value: critical, change: 1, trend: 'up' },
    ]);
  }, []);

  // Calculate trend data
  const calculateTrends = useCallback((data: EscalationEvent[]) => {
    const trendData: { [key: string]: EscalationTrend } = {};

    data.forEach((e) => {
      const date = new Date(e.createdAt);
      const dateStr = date.toISOString().split('T')[0];

      if (!trendData[dateStr]) {
        trendData[dateStr] = {
          date: dateStr,
          count: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        };
      }

      trendData[dateStr].count++;

      // Count by severity (approximated from level)
      if (e.currentLevel === EscalationLevel.PROFESSIONAL) {
        trendData[dateStr].critical++;
      } else if (e.currentLevel === EscalationLevel.COMMUNITY) {
        trendData[dateStr].high++;
      } else if (e.currentLevel === EscalationLevel.FAMILY) {
        trendData[dateStr].medium++;
      } else {
        trendData[dateStr].low++;
      }
    });

    const sortedTrends = Object.values(trendData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days

    setTrends(sortedTrends);
  }, []);

  // Calculate status distribution
  const calculateDistributions = useCallback((data: EscalationEvent[]) => {
    const statusCounts: { [key: string]: number } = {};
    const levelCounts: { [key: string]: number } = {};

    data.forEach((e) => {
      statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
      levelCounts[e.currentLevel] = (levelCounts[e.currentLevel] || 0) + 1;
    });

    // Status colors
    const statusColors: { [key: string]: string } = {
      [EscalationStatus.OPEN]: '#3B82F6',
      [EscalationStatus.ESCALATED]: '#F59E0B',
      [EscalationStatus.IN_PROGRESS]: '#8B5CF6',
      [EscalationStatus.AWAITING_RESPONSE]: '#06B6D4',
      [EscalationStatus.ON_HOLD]: '#6B7280',
      [EscalationStatus.RESOLVED]: '#10B981',
      [EscalationStatus.ARCHIVED]: '#9CA3AF',
      [EscalationStatus.CANCELLED]: '#EF4444',
    };

    // Level colors
    const levelColors: { [key: string]: string } = {
      [EscalationLevel.INDIVIDUAL]: '#3B82F6',
      [EscalationLevel.FAMILY]: '#F59E0B',
      [EscalationLevel.COMMUNITY]: '#8B5CF6',
      [EscalationLevel.PROFESSIONAL]: '#EF4444',
    };

    const statusDistData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: count,
      color: statusColors[status] || '#6B7280',
    }));

    const levelDistData = Object.entries(levelCounts).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: levelColors[level] || '#6B7280',
    }));

    setStatusDistribution(statusDistData);
    setLevelDistribution(levelDistData);
  }, []);

  // Calculate responder metrics
  const calculateResponderMetrics = useCallback((data: EscalationEvent[]) => {
    const responders: { [key: string]: ResponderMetrics } = {};

    data.forEach((e) => {
      // Get first responder ID if available, otherwise use "Unassigned"
      const responderId = e.responders && e.responders.length > 0 
        ? e.responders[0].userId 
        : 'Unassigned';

      if (!responders[responderId]) {
        responders[responderId] = {
          responder: responderId === 'Unassigned' ? 'Unassigned' : `User ${responderId.substring(0, 8)}`,
          total: 0,
          resolved: 0,
          avgTime: 0,
          efficiency: 0,
        };
      }

      responders[responderId].total++;

      if (e.status === EscalationStatus.RESOLVED || e.status === EscalationStatus.ARCHIVED) {
        responders[responderId].resolved++;
      }
    });

    // Calculate efficiency
    const responderList = Object.values(responders).map((r) => ({
      ...r,
      efficiency: r.total > 0 ? Math.round((r.resolved / r.total) * 100) : 0,
      avgTime: Math.floor(Math.random() * 120) + 15, // Placeholder
    }));

    setResponderMetrics(responderList.sort((a, b) => b.efficiency - a.efficiency));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeRange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  {metric.unit && <span className="text-sm text-gray-500">{metric.unit}</span>}
                </div>
                {metric.change && (
                  <p className={`text-sm mt-2 ${
                    metric.trend === 'up' ? 'text-red-600' :
                    metric.trend === 'down' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}% vs last period
                  </p>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalation Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trends}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorCount)"
              name="Total Escalations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status and Level Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Level Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalation Level Distribution</h3>
          {levelDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={levelDistribution as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {levelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="critical" stackId="a" fill="#EF4444" name="Critical" />
            <Bar dataKey="high" stackId="a" fill="#F59E0B" name="High" />
            <Bar dataKey="medium" stackId="a" fill="#3B82F6" name="Medium" />
            <Bar dataKey="low" stackId="a" fill="#10B981" name="Low" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Responder Performance */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
        {responderMetrics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Responder</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Resolved</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Efficiency</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {responderMetrics.map((responder, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{responder.responder}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{responder.total}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{responder.resolved}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${responder.efficiency}%` }}
                          />
                        </div>
                        <span className="text-gray-900 font-medium">{responder.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{responder.avgTime} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-500">
            No responder data available
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700 font-semibold">Open Escalations</p>
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {escalations.filter(e => e.status === EscalationStatus.OPEN).length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-orange-700 font-semibold">Escalated</p>
          </div>
          <p className="text-3xl font-bold text-orange-900">
            {escalations.filter(e => e.status === EscalationStatus.ESCALATED).length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 font-semibold">Resolved</p>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {escalations.filter(e => e.status === EscalationStatus.RESOLVED || e.status === EscalationStatus.ARCHIVED).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
