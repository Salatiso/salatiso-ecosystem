/**
 * Ubuntu Alignment Gauge Component
 * 
 * Circular gauge showing Ubuntu alignment score with breakdown
 * of individual cultural values
 * 
 * @module UbuntuAlignmentGauge
 */

'use client';

import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';
import { useTranslation } from '@/contexts/I18nContext';

interface UbuntuAlignmentGaugeProps {
  /** Overall Ubuntu score (0-100) */
  score: number;
  /** Breakdown by value */
  breakdown: {
    respect: number;
    community: number;
    sharing: number;
    harmony: number;
    leadership: number;
  };
}

/**
 * Ubuntu alignment gauge component
 */
export default function UbuntuAlignmentGauge({
  score,
  breakdown
}: UbuntuAlignmentGaugeProps) {
  const { t } = useTranslation();

  // Get score color
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  // Get score label
  const getScoreLabel = (score: number): string => {
    if (score >= 90) return t('ubuntu.gauge.excellent', 'Excellent');
    if (score >= 80) return t('ubuntu.gauge.good', 'Good');
    if (score >= 70) return t('ubuntu.gauge.fair', 'Fair');
    if (score >= 60) return t('ubuntu.gauge.needsImprovement', 'Needs Improvement');
    return t('ubuntu.gauge.critical', 'Critical');
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  // Prepare data for radial chart
  const chartData = [
    {
      name: 'Score',
      value: score,
      fill: scoreColor
    }
  ];

  // Ubuntu values with icons
  const values = [
    {
      key: 'respect',
      label: t('ubuntu.values.respect', 'Respect'),
      icon: '🙏',
      value: breakdown.respect,
      color: '#F59E0B'
    },
    {
      key: 'community',
      label: t('ubuntu.values.community', 'Community'),
      icon: '👥',
      value: breakdown.community,
      color: '#3B82F6'
    },
    {
      key: 'sharing',
      label: t('ubuntu.values.sharing', 'Sharing'),
      icon: '🤝',
      value: breakdown.sharing,
      color: '#10B981'
    },
    {
      key: 'harmony',
      label: t('ubuntu.values.harmony', 'Harmony'),
      icon: '☮️',
      value: breakdown.harmony,
      color: '#8B5CF6'
    },
    {
      key: 'leadership',
      label: t('ubuntu.values.leadership', 'Leadership'),
      icon: '👑',
      value: breakdown.leadership,
      color: '#EF4444'
    }
  ];

  return (
    <div className="ubuntu-alignment-gauge">
      {/* Main gauge */}
      <div className="relative mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              fill={scoreColor}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Score overlay */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-5xl font-bold" style={{ color: scoreColor }}>
            {score}
          </div>
          <div className="text-sm text-gray-600 mt-1">{scoreLabel}</div>
        </div>
      </div>

      {/* Ubuntu values breakdown */}
      <div className="space-y-3">
        {values.map(value => (
          <div key={value.key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center space-x-2">
                <span>{value.icon}</span>
                <span className="font-medium text-gray-700">{value.label}</span>
              </div>
              <span className="font-semibold text-gray-900">{value.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${value.value}%`,
                  backgroundColor: value.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Ubuntu principle */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-sm text-gray-700 text-center">
          <span className="font-semibold text-orange-900">
            {t('ubuntu.principle', 'Umuntu Ngumuntu Ngabantu')}
          </span>
          <br />
          <span className="italic text-gray-600">
            {t('ubuntu.meaning', 'I am because we are')}
          </span>
        </p>
      </div>
    </div>
  );
}
