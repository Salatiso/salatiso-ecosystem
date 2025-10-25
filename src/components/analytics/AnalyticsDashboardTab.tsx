/**
 * AnalyticsDashboardTab Component - Phase 4.6
 * Integrates all analytics components into one cohesive dashboard tab
 * Combines Revenue, Heatmap, Team Performance, and Predictive Analytics
 */

'use client';

import React, { useState } from 'react';
import { BarChart3, RefreshCw, Download, Settings } from 'lucide-react';
import { RevenueTrendingChart } from './RevenueTrendingChart';
import { EscalationHeatmap } from './EscalationHeatmap';
import { TeamPerformanceScorecard } from './TeamPerformanceScorecard';
import { PredictiveAnalyticsPanel } from './PredictiveAnalyticsPanel';

interface AnalyticsDashboardTabProps {
  onRefresh?: () => void;
  onDownload?: () => void;
}

export const AnalyticsDashboardTab: React.FC<AnalyticsDashboardTabProps> = ({
  onRefresh,
  onDownload,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd' | 'all'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh?.();
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleDownload = () => {
    onDownload?.();
    // Trigger download
    const data = {
      timestamp: new Date().toISOString(),
      timeRange,
      report: 'Analytics Dashboard Export',
    };
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
    element.setAttribute('download', `analytics-report-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics & BI</h2>
            <p className="text-sm text-gray-600 mt-1">Advanced metrics, predictions, and team performance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Download report"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-sm font-medium text-blue-900">Active Metrics</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
          <p className="text-xs text-blue-700 mt-2">Real-time tracking</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <p className="text-sm font-medium text-purple-900">Predictions</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">6</p>
          <p className="text-xs text-purple-700 mt-2">ML-powered forecasts</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-sm font-medium text-green-900">Model Accuracy</p>
          <p className="text-3xl font-bold text-green-600 mt-2">89.2%</p>
          <p className="text-xs text-green-700 mt-2">Ensemble ML model</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <p className="text-sm font-medium text-orange-900">Data Points</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">15.2K</p>
          <p className="text-xs text-orange-700 mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trending */}
        <div className="lg:col-span-1">
          <RevenueTrendingChart timeRange={timeRange} onTimeRangeChange={(range) => setTimeRange(range as any)} />
        </div>

        {/* Escalation Heatmap */}
        <div className="lg:col-span-1">
          <EscalationHeatmap />
        </div>
      </div>

      {/* Team Performance - Full Width */}
      <div>
        <TeamPerformanceScorecard />
      </div>

      {/* Predictive Analytics - Full Width */}
      <div>
        <PredictiveAnalyticsPanel />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Analytics Dashboard Help</h3>
        <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-900 mb-2">💡 Tips</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Use time range selector to compare periods</li>
              <li>Hover over charts for detailed tooltips</li>
              <li>Export reports for stakeholder presentations</li>
              <li>ML predictions update daily with new data</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-2">📊 Features</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Real-time revenue tracking and forecasting</li>
              <li>Escalation pattern heatmap (24h × 7d)</li>
              <li>Team performance KPIs and trends</li>
              <li>ML-powered predictive models</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
