'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalyticsService } from '@/services/AnalyticsService';
import { Download, RefreshCw } from 'lucide-react';

/**
 * AnalyticsDashboard
 * Main analytics dashboard page
 */

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const analytics = getAnalyticsService(user.id);
      const data = await analytics.getDashboardData(period as any);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, period]);

  const handleExport = () => {
    const dataStr = JSON.stringify(metrics, null, 2);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    );
    element.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive view of family collaboration and activity
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:shadow-md transition hover:bg-blue-600"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mt-4">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                period === p
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metrics Cards */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Members</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {metrics.participationMetrics?.totalMembers || 0}
            </p>
          </div>

          {/* Active Members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Active Members</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {metrics.participationMetrics?.activeMembers || 0}
            </p>
          </div>

          {/* Total Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Events</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {metrics.participationMetrics?.totalEvents || 0}
            </p>
          </div>

          {/* Collaboration Score */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Collaboration</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {(metrics.collaborationMetrics?.overallScore || 0).toFixed(0)}%
            </p>
          </div>
        </motion.div>
      )}

      {/* Collaboration Metrics */}
      {metrics?.collaborationMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Collaboration Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 font-medium mb-2">Overall Score</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${metrics.collaborationMetrics.overallScore}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {metrics.collaborationMetrics.overallScore.toFixed(1)}%
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-medium mb-2">Communication</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${metrics.collaborationMetrics.communicationScore || 0}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {(metrics.collaborationMetrics.communicationScore || 0).toFixed(1)}%
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-medium mb-2">Participation</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${metrics.collaborationMetrics.participationScore || 0}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {(metrics.collaborationMetrics.participationScore || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Ubuntu Metrics */}
      {metrics?.ubuntuMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ubuntu Principles
          </h2>

          <div className="space-y-4">
            {metrics.ubuntuMetrics.principlesScores &&
              Object.entries(metrics.ubuntuMetrics.principlesScores).map(
                ([principle, score]: [string, any]) => (
                  <div key={principle}>
                    <p className="text-gray-700 font-medium capitalize">
                      {principle.replace(/_/g, ' ')}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${score || 0}%` }}
                      />
                    </div>
                  </div>
                )
              )}
          </div>
        </motion.div>
      )}

      {/* Business Impact */}
      {metrics?.businessImpactMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Business Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-green-800 font-semibold">ROI</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {(metrics.businessImpactMetrics.estimatedROI || 0).toFixed(1)}%
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-blue-800 font-semibold">Efficiency Gain</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {(metrics.businessImpactMetrics.efficiencyGain || 0).toFixed(1)}%
              </p>
            </div>

            {metrics.businessImpactMetrics.keyAchievements && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-700 font-semibold mb-3">
                  Key Achievements
                </p>
                <ul className="space-y-2">
                  {metrics.businessImpactMetrics.keyAchievements.slice(0, 5).map(
                    (achievement: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{achievement}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
