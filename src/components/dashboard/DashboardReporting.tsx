/**
 * Dashboard & Reporting System
 * Phase 5 - STEP 9
 * Context-aware widgets, multi-level reporting, real-time sync
 */

'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Award,
  Filter,
  Download,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';

// ===== Data Models =====

export type ReportLevel = 'simple' | 'intermediate' | 'advanced';
export type DashboardContext = 'individual' | 'family' | 'community' | 'professional';

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'progress' | 'activity';
  context: DashboardContext;
  minReportLevel: ReportLevel;
  data: any;
  refreshRate?: number; // seconds
  visible: boolean;
}

export interface DashboardReport {
  id: string;
  name: string;
  context: DashboardContext;
  level: ReportLevel;
  widgets: DashboardWidget[];
  lastUpdated: string;
  autoRefresh: boolean;
}

// ===== Mock Data =====

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  // Individual Context
  {
    id: 'w1',
    title: 'Personal XP Progress',
    type: 'progress',
    context: 'individual',
    minReportLevel: 'simple',
    data: { current: 2450, target: 5000, percentage: 49 },
    visible: true,
  },
  {
    id: 'w2',
    title: 'Active Goals',
    type: 'metric',
    context: 'individual',
    minReportLevel: 'simple',
    data: { value: 5, change: '+2 this month' },
    visible: true,
  },
  {
    id: 'w3',
    title: 'Achievement Timeline',
    type: 'list',
    context: 'individual',
    minReportLevel: 'intermediate',
    data: [
      { date: '2025-02-01', title: 'Foundation Master', xp: 500 },
      { date: '2025-01-15', title: 'Team Player', xp: 250 },
    ],
    visible: true,
  },

  // Family Context
  {
    id: 'w4',
    title: 'Family Health Score',
    type: 'metric',
    context: 'family',
    minReportLevel: 'simple',
    data: { value: '8.5/10', change: '+0.3 from last month' },
    visible: true,
  },
  {
    id: 'w5',
    title: 'Member Activity',
    type: 'chart',
    context: 'family',
    minReportLevel: 'simple',
    data: [
      { name: 'Salatiso', activities: 45 },
      { name: 'Tina', activities: 38 },
      { name: 'Azora', activities: 32 },
      { name: 'Solo', activities: 28 },
    ],
    visible: true,
  },
  {
    id: 'w6',
    title: 'Family Projects Status',
    type: 'progress',
    context: 'family',
    minReportLevel: 'intermediate',
    data: { active: 3, completed: 8, planned: 5 },
    visible: true,
  },
  {
    id: 'w7',
    title: 'Household Balance Sheet',
    type: 'chart',
    context: 'family',
    minReportLevel: 'advanced',
    data: {
      income: 125000,
      expenses: 87500,
      savings: 37500,
      investments: 45000,
    },
    visible: true,
  },

  // Community Context
  {
    id: 'w8',
    title: 'Community Engagement',
    type: 'metric',
    context: 'community',
    minReportLevel: 'simple',
    data: { value: '42 members', change: '+5 this quarter' },
    visible: true,
  },
  {
    id: 'w9',
    title: 'Collaboration Metrics',
    type: 'chart',
    context: 'community',
    minReportLevel: 'intermediate',
    data: [
      { metric: 'Projects', count: 12 },
      { metric: 'Events', count: 24 },
      { metric: 'Partnerships', count: 8 },
    ],
    visible: true,
  },

  // Professional Context
  {
    id: 'w10',
    title: 'Business Revenue',
    type: 'metric',
    context: 'professional',
    minReportLevel: 'intermediate',
    data: { value: '$250K', change: '+15% YoY' },
    visible: true,
  },
  {
    id: 'w11',
    title: 'Team Performance',
    type: 'chart',
    context: 'professional',
    minReportLevel: 'intermediate',
    data: [
      { name: 'Visa', performance: 92 },
      { name: 'Salatiso', performance: 88 },
      { name: 'Tina', performance: 85 },
    ],
    visible: true,
  },
];

// ===== Components =====

/**
 * Metric Widget
 */
const MetricWidget: React.FC<{
  widget: DashboardWidget;
  onToggle: () => void;
}> = ({ widget, onToggle }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition relative group">
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
        title="Toggle visibility"
      >
        <Eye className="w-4 h-4 text-gray-400" />
      </button>

      <h3 className="font-semibold text-gray-600 text-sm mb-2">{widget.title}</h3>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-gray-900">{widget.data.value}</p>
        <p className="text-sm text-green-600 mb-1">{widget.data.change}</p>
      </div>
    </div>
  );
};

/**
 * Progress Widget
 */
const ProgressWidget: React.FC<{
  widget: DashboardWidget;
  onToggle: () => void;
}> = ({ widget, onToggle }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition relative group">
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
      >
        <Eye className="w-4 h-4 text-gray-400" />
      </button>

      <h3 className="font-semibold text-gray-900 mb-4">{widget.title}</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-bold text-gray-900">
              {widget.data.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${widget.data.percentage}%` }}
            />
          </div>
        </div>
        {widget.data.current && (
          <p className="text-xs text-gray-600">
            {widget.data.current} / {widget.data.target}
          </p>
        )}
        {widget.data.active && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{widget.data.active}</p>
              <p className="text-xs text-gray-600">Active</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{widget.data.completed}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-600">{widget.data.planned}</p>
              <p className="text-xs text-gray-600">Planned</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Chart Widget
 */
const ChartWidget: React.FC<{
  widget: DashboardWidget;
  onToggle: () => void;
}> = ({ widget, onToggle }) => {
  const data = widget.data;
  const isArray = Array.isArray(data);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition relative group">
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
      >
        <Eye className="w-4 h-4 text-gray-400" />
      </button>

      <h3 className="font-semibold text-gray-900 mb-4">{widget.title}</h3>

      {isArray ? (
        <div className="space-y-3">
          {data.map((item: any, idx: number) => {
            const maxValue = Math.max(...data.map((d: any) => d.activities || d.performance || d.count || 0));
            const value = item.activities || item.performance || item.count || 0;
            const percentage = (value / maxValue) * 100;

            return (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {item.name || item.metric}
                  </span>
                  <span className="text-sm text-gray-600">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]: [string, any]) => (
            <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">${value / 1000}K</p>
              <p className="text-xs text-gray-600 mt-1 capitalize">{key}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * List Widget
 */
const ListWidget: React.FC<{
  widget: DashboardWidget;
  onToggle: () => void;
}> = ({ widget, onToggle }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition relative group">
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
      >
        <Eye className="w-4 h-4 text-gray-400" />
      </button>

      <h3 className="font-semibold text-gray-900 mb-4">{widget.title}</h3>
      <div className="space-y-2">
        {widget.data.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-600">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
            <span className="text-sm font-bold text-blue-600">+{item.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Dashboard Builder
 */
export const ContextAwareDashboard: React.FC<{
  context?: DashboardContext;
  reportLevel?: ReportLevel;
}> = ({ context = 'individual', reportLevel = 'simple' }) => {
  const [selectedLevel, setSelectedLevel] = useState<ReportLevel>(reportLevel);
  const [visibleWidgets, setVisibleWidgets] = useState<Set<string>>(
    new Set(DASHBOARD_WIDGETS.map((w) => w.id))
  );

  // Filter widgets by context and report level
  const availableWidgets = DASHBOARD_WIDGETS.filter(
    (w) =>
      w.context === context &&
      w.minReportLevel === 'simple' ||
      (selectedLevel === 'intermediate' && w.minReportLevel !== 'advanced') ||
      selectedLevel === 'advanced'
  );

  const visibleAvailableWidgets = availableWidgets.filter((w) =>
    visibleWidgets.has(w.id)
  );

  const toggleWidgetVisibility = (widgetId: string) => {
    const newVisible = new Set(visibleWidgets);
    if (newVisible.has(widgetId)) {
      newVisible.delete(widgetId);
    } else {
      newVisible.add(widgetId);
    }
    setVisibleWidgets(newVisible);
  };

  const contextLabels: Record<DashboardContext, string> = {
    individual: '👤 Individual',
    family: '👨‍👩‍👧‍👦 Family',
    community: '🤝 Community',
    professional: '💼 Professional',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            {contextLabels[context]} • {selectedLevel} reporting
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="w-4 h-4" />
            Configure
          </button>
        </div>
      </div>

      {/* Report Level Selector */}
      <div className="flex gap-2">
        {(['simple', 'intermediate', 'advanced'] as ReportLevel[]).map(
          (level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                selectedLevel === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          )
        )}
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-600 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        ✓ Real-time sync enabled • Last updated: Just now
      </div>

      {/* Widgets Grid */}
      {visibleAvailableWidgets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleAvailableWidgets.map((widget) => (
            <div key={widget.id}>
              {widget.type === 'metric' && (
                <MetricWidget
                  widget={widget}
                  onToggle={() => toggleWidgetVisibility(widget.id)}
                />
              )}
              {widget.type === 'progress' && (
                <ProgressWidget
                  widget={widget}
                  onToggle={() => toggleWidgetVisibility(widget.id)}
                />
              )}
              {widget.type === 'chart' && (
                <ChartWidget
                  widget={widget}
                  onToggle={() => toggleWidgetVisibility(widget.id)}
                />
              )}
              {widget.type === 'list' && (
                <ListWidget
                  widget={widget}
                  onToggle={() => toggleWidgetVisibility(widget.id)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No widgets available for this report level</p>
        </div>
      )}

      {/* Hidden Widgets Info */}
      {availableWidgets.length > visibleAvailableWidgets.length && (
        <div className="text-sm text-gray-600 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          {availableWidgets.length - visibleAvailableWidgets.length} widget(s) hidden
        </div>
      )}

      {/* Sync Status */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Real-time sync active across ecosystem apps
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Offline mode: Data will sync when connection returns (Sonny mesh priority: Wi-Fi → Bluetooth → Internet)
        </p>
      </div>
    </div>
  );
};

/**
 * Multi-Context Dashboard Switcher
 */
export const MultiContextDashboard: React.FC = () => {
  const [selectedContext, setSelectedContext] =
    useState<DashboardContext>('individual');

  const contexts: DashboardContext[] = [
    'individual',
    'family',
    'community',
    'professional',
  ];

  const contextEmojis: Record<DashboardContext, string> = {
    individual: '👤',
    family: '👨‍👩‍👧‍👦',
    community: '🤝',
    professional: '💼',
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        {contexts.map((ctx) => (
          <button
            key={ctx}
            onClick={() => setSelectedContext(ctx)}
            className={`px-4 py-2 rounded-lg font-medium transition capitalize flex items-center gap-2 ${
              selectedContext === ctx
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{contextEmojis[ctx]}</span>
            {ctx}
          </button>
        ))}
      </div>

      <ContextAwareDashboard context={selectedContext} reportLevel="intermediate" />
    </div>
  );
};
