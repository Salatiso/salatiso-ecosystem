/**
 * MetricCard Component
 * 
 * Display key metric with trend indicator
 * 
 * @module MetricCard
 */

'use client';

import React from 'react';
import { TrendDirection } from '@/types/analytics';

interface MetricCardProps {
  /** Card title */
  title: string;
  /** Main metric value */
  value: string | number;
  /** Subtitle or additional info */
  subtitle?: string;
  /** Trend direction */
  trend?: TrendDirection;
  /** Change percentage */
  change?: number;
  /** Icon emoji */
  icon?: string;
  /** Color theme */
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

/**
 * Metric card component
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  change,
  icon,
  color = 'blue'
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    stable: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-2xl`}>
            {icon}
          </div>
        )}
      </div>

      {trend && change !== undefined && (
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
            {trendIcons[trend]}
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
          <span className="text-sm text-gray-500">vs previous period</span>
        </div>
      )}
    </div>
  );
}
