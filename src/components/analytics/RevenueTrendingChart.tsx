/**
 * RevenueTrendingChart Component - Phase 4.6 Analytics
 * Advanced revenue trend visualization with predictive forecasting
 * Line chart showing historical revenue, trend, and forecast
 */

'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Filter } from 'lucide-react';

interface RevenueTrendingChartProps {
  timeRange?: '7d' | '30d' | '90d' | 'ytd' | 'all';
  onTimeRangeChange?: (range: string) => void;
}

interface DataPoint {
  date: string;
  revenue: number;
  forecast?: number;
  trend?: number;
}

/**
 * Generate mock revenue data with trend
 */
const generateRevenueData = (days: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const baseRevenue = 45000;
  let currentRevenue = baseRevenue;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Add random variance and growth trend
    const variance = (Math.random() - 0.45) * 10000;
    const growth = (i / days) * 8000;
    currentRevenue = Math.max(30000, baseRevenue + growth + variance);
    
    const point: DataPoint = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(currentRevenue),
    };
    
    // Add forecast for last 7 days
    if (i >= days - 7) {
      point.forecast = Math.round(currentRevenue * (1 + Math.random() * 0.1));
      point.trend = i > 0 ? Math.round((currentRevenue - data[i - 1].revenue) / 1000) : 0;
    }
    
    data.push(point);
  }
  
  return data;
};

/**
 * Simple SVG line chart component
 */
const LineChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;
  
  const maxRevenue = Math.max(...data.map(d => Math.max(d.revenue, d.forecast || 0)));
  const minRevenue = Math.min(...data.map(d => d.revenue));
  const range = maxRevenue - minRevenue;
  
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - ((point.revenue - minRevenue) / range) * (chartHeight - padding * 2) - padding;
    return { x, y, ...point };
  });
  
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <svg width={chartWidth} height={chartHeight} className="w-full">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={`grid-${i}`}
          x1={padding}
          y1={padding + (i * (chartHeight - padding * 2)) / 4}
          x2={chartWidth - padding}
          y2={padding + (i * (chartHeight - padding * 2)) / 4}
          stroke="#e5e7eb"
          strokeDasharray="4"
          strokeWidth="1"
        />
      ))}
      
      {/* Revenue line */}
      <path
        d={pathData}
        stroke="#2563eb"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Forecast line */}
      {points.map((p, i) => (
        p.forecast && i > 0 && points[i - 1].forecast ? (
          <line
            key={`forecast-${i}`}
            x1={points[i - 1].x}
            y1={chartHeight - ((points[i - 1].forecast! - minRevenue) / range) * (chartHeight - padding * 2) - padding}
            x2={p.x}
            y2={chartHeight - ((p.forecast - minRevenue) / range) * (chartHeight - padding * 2) - padding}
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4"
          />
        ) : null
      ))}
      
      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={`point-${i}`}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#2563eb"
        />
      ))}
      
      {/* Axes */}
      <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#000" strokeWidth="1" />
      <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#000" strokeWidth="1" />
    </svg>
  );
};

export const RevenueTrendingChart: React.FC<RevenueTrendingChartProps> = ({
  timeRange = '30d',
  onTimeRangeChange,
}) => {
  const daysMap = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    'ytd': 365,
    'all': 365,
  };
  
  const data = useMemo(() => generateRevenueData(daysMap[timeRange]), [timeRange]);
  
  const stats = useMemo(() => {
    const revenueValues = data.map(d => d.revenue);
    const currentRevenue = revenueValues[revenueValues.length - 1];
    const previousRevenue = revenueValues[Math.max(0, revenueValues.length - 8)];
    const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const avgRevenue = revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length;
    
    return {
      currentRevenue: currentRevenue.toLocaleString(),
      growth: growth.toFixed(1),
      avgRevenue: Math.round(avgRevenue).toLocaleString(),
      forecast: data[data.length - 1].forecast?.toLocaleString() || 'N/A',
    };
  }, [data]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange?.(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="ytd">Year to date</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Current Revenue</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">${stats.currentRevenue}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Growth</p>
          <p className={`text-2xl font-bold mt-1 ${parseFloat(stats.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.growth}%
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Avg Revenue</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">${stats.avgRevenue}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Forecast</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${stats.forecast}</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <LineChart data={data} />
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-600"></div>
            <span className="text-gray-600">Forecast</span>
          </div>
        </div>
      </div>
    </div>
  );
};
