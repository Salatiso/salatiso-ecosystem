'use client';

import React, { useMemo, useCallback } from 'react';
import { useNatural13Conversion } from '@/hooks/useConversionService';
import { useCalendarSystem } from '@/providers/CalendarSystemProvider';
import { NATURAL13_MONTH_NAMES } from '@/types/calendar-systems';
import type { SeasonalMarker } from '@/types/calendar-systems';

interface SeasonalWheelProps {
  /**
   * Month to highlight (1-13)
   */
  highlightMonth?: number;
  /**
   * Whether to show astronomical markers (solstices, equinoxes)
   */
  showMarkers?: boolean;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * CSS class for container
   */
  className?: string;
  /**
   * Whether to animate rotation
   */
  animated?: boolean;
  /**
   * Whether loading
   */
  isLoading?: boolean;
  /**
   * Callback when a month segment is clicked
   */
  onMonthSelect?: (month: number) => void;
}

/**
 * Season color mapping for visual distinction
 */
const SEASON_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Winter Renewal': {
    bg: 'from-blue-500 to-cyan-400',
    text: 'text-blue-900',
    border: 'border-blue-600',
  },
  'Spring Awakening': {
    bg: 'from-green-500 to-emerald-400',
    text: 'text-green-900',
    border: 'border-green-600',
  },
  'Summer Abundance': {
    bg: 'from-yellow-500 to-orange-400',
    text: 'text-yellow-900',
    border: 'border-orange-600',
  },
  'Autumn Gratitude': {
    bg: 'from-amber-600 to-red-500',
    text: 'text-amber-900',
    border: 'border-red-700',
  },
};

/**
 * Month to season mapping
 */
const MONTH_TO_SEASON: Record<number, string> = {
  1: 'Winter Renewal',
  2: 'Winter Renewal',
  3: 'Spring Awakening',
  4: 'Spring Awakening',
  5: 'Spring Awakening',
  6: 'Summer Abundance',
  7: 'Summer Abundance',
  8: 'Summer Abundance',
  9: 'Autumn Gratitude',
  10: 'Autumn Gratitude',
  11: 'Autumn Gratitude',
  12: 'Winter Renewal',
  13: 'Winter Renewal',
};

/**
 * Size configuration
 */
const SIZE_CONFIG = {
  sm: {
    viewBox: '0 0 200 200',
    radius: 70,
    circleR: 60,
    fontSize: 10,
    labelOffset: 50,
  },
  md: {
    viewBox: '0 0 400 400',
    radius: 140,
    circleR: 120,
    fontSize: 14,
    labelOffset: 100,
  },
  lg: {
    viewBox: '0 0 600 600',
    radius: 210,
    circleR: 180,
    fontSize: 18,
    labelOffset: 150,
  },
};

/**
 * Marker symbol component for astronomical events
 */
const MarkerSymbol = React.memo(
  ({
    marker,
    angle,
    radius,
    size,
  }: {
    marker: SeasonalMarker;
    angle: number;
    radius: number;
    size: 'sm' | 'md' | 'lg';
  }) => {
    const config = SIZE_CONFIG[size];
    const centerX = parseInt(config.viewBox.split(' ')[2]) / 2;
    const centerY = parseInt(config.viewBox.split(' ')[3]) / 2;

    // Convert angle to radians
    const radians = ((angle - 90) * Math.PI) / 180;
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);

    // Marker symbols
    const symbols: Record<string, string> = {
      solstice: '☀️',
      equinox: '⚖️',
      seasonal_marker: '✦',
    };

    return (
      <g key={marker.id}>
        {/* Marker line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke="#666"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0.5"
        />
        {/* Marker dot */}
        <circle cx={x} cy={y} r="3" fill="#333" />
        {/* Marker label */}
        <text
          x={x}
          y={y - 8}
          textAnchor="middle"
          fontSize="8"
          fill="#333"
          fontWeight="bold"
        >
          {symbols[marker.type] || '✦'}
        </text>
      </g>
    );
  }
);

MarkerSymbol.displayName = 'MarkerSymbol';

/**
 * Month segment component
 */
const MonthSegment = React.memo(
  ({
    month,
    monthName,
    angle,
    segmentAngle,
    radius,
    circleR,
    fontSize,
    labelOffset,
    season,
    isHighlighted,
    onClick,
  }: {
    month: number;
    monthName: string;
    angle: number;
    segmentAngle: number;
    radius: number;
    circleR: number;
    fontSize: number;
    labelOffset: number;
    season: string;
    isHighlighted: boolean;
    onClick: () => void;
  }) => {
    const centerX = radius + circleR;
    const centerY = radius + circleR;
    const colors = SEASON_COLORS[season];

    // Calculate path for segment
    const startAngle = angle - segmentAngle / 2;
    const endAngle = angle + segmentAngle / 2;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = centerX + circleR * Math.cos(startRad);
    const y1 = centerY + circleR * Math.sin(startRad);
    const x2 = centerX + circleR * Math.cos(endRad);
    const y2 = centerY + circleR * Math.sin(endRad);

    // Label position
    const labelRad = ((angle - 90) * Math.PI) / 180;
    const labelX = centerX + (circleR + labelOffset) * Math.cos(labelRad);
    const labelY = centerY + (circleR + labelOffset) * Math.sin(labelRad);

    return (
      <g key={`month-${month}`} onClick={onClick} className="cursor-pointer">
        {/* Segment path */}
        <path
          d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${circleR} ${circleR} 0 0 1 ${x2} ${y2} Z`}
          fill={`url(#gradient-${month})`}
          stroke={isHighlighted ? '#000' : '#fff'}
          strokeWidth={isHighlighted ? '3' : '2'}
          opacity={isHighlighted ? '1' : '0.85'}
          className="transition-all hover:opacity-100"
        />

        {/* Month label */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill="#000"
          opacity="0.8"
          className="pointer-events-none select-none"
        >
          {monthName.split(' ')[0]}
        </text>

        {/* Day number indicator */}
        <text
          x={centerX + (circleR * 0.6) * Math.cos(labelRad)}
          y={centerY + (circleR * 0.6) * Math.sin(labelRad)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize - 2}
          fill="#fff"
          fontWeight="bold"
          opacity="0.9"
          className="pointer-events-none select-none"
        >
          {month}
        </text>
      </g>
    );
  }
);

MonthSegment.displayName = 'MonthSegment';

/**
 * SeasonalWheel Component
 *
 * Displays a circular visualization of the 13-month Natural13 calendar.
 * Each month is represented as a colored segment on a wheel.
 *
 * Features:
 * - 13 month segments with distinct colors
 * - 4 astronomical markers (solstices/equinoxes)
 * - Season-based color coding
 * - Month highlighting
 * - Click callbacks for month selection
 * - Multiple size variants
 * - Smooth animations
 * - Accessible labels
 *
 * @example
 * ```tsx
 * // Simple display
 * <SeasonalWheel />
 *
 * // Highlight current month with markers
 * <SeasonalWheel
 *   highlightMonth={7}
 *   showMarkers={true}
 *   size="lg"
 *   onMonthSelect={(month) => console.log(`Selected: ${month}`)}
 * />
 * ```
 */
export const SeasonalWheel: React.FC<SeasonalWheelProps> = ({
  highlightMonth,
  showMarkers = true,
  size = 'md',
  className = '',
  animated = true,
  isLoading = false,
  onMonthSelect,
}) => {
  const config = SIZE_CONFIG[size];
  const { seasonalMarkers } = useCalendarSystem();
  const today = new Date();
  const todayNatural13 = useNatural13Conversion(today);

  // Use provided highlight month or current month
  const effectiveHighlightMonth = useMemo(
    () => highlightMonth || todayNatural13.month,
    [highlightMonth, todayNatural13.month]
  );

  // Calculate segment angle (360 / 13 months)
  const segmentAngle = 360 / 13;
  const centerX = parseInt(config.viewBox.split(' ')[2]) / 2;
  const centerY = parseInt(config.viewBox.split(' ')[3]) / 2;

  // Get calendar dimensions
  const viewBoxDim = parseInt(config.viewBox.split(' ')[2]);

  // Marker angles (astronomical events)
  const markerAngles = useMemo(() => {
    const angles: Record<string, number> = {};
    if (seasonalMarkers.length > 0) {
      seasonalMarkers.forEach((marker) => {
        // Map marker dates to wheel positions based on timing
        // Winter Solstice (Dec 21) = Month 13, Day 1 = angle 0°
        // Spring Equinox (Mar 20) = Month 3, Day ~28 = angle ~90°
        // Summer Solstice (Jun 21) = Month 6, Day ~28 = angle ~180°
        // Fall Equinox (Sept 22) = Month 10, Day ~1 = angle ~270°

        let angle = 0;
        if (marker.timing.fixedDate) {
          // Convert Gregorian to Natural13 month/day equivalent
          // For now, map roughly to calendar position
          const month = marker.timing.fixedDate.month;
          angle = ((month - 1) / 12) * 360;
        }
        angles[marker.id] = angle % 360;
      });
    }
    return angles;
  }, [seasonalMarkers, segmentAngle]);

  const handleMonthClick = useCallback(
    (month: number) => {
      onMonthSelect?.(month);
    },
    [onMonthSelect]
  );

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ minHeight: '300px' }}>
        <div className="text-gray-400">Loading seasonal wheel...</div>
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col items-center gap-4`}>
      {/* Seasonal Wheel SVG */}
      <svg
        viewBox={config.viewBox}
        className={`w-full max-w-md ${animated ? 'transition-transform duration-300' : ''}`}
        style={{
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.1))',
        }}
      >
        <defs>
          {/* SVG Gradients for each month */}
          {NATURAL13_MONTH_NAMES.map((name, i) => {
            const season = MONTH_TO_SEASON[i + 1];
            const colors = SEASON_COLORS[season];
            return (
              <linearGradient
                key={`gradient-${i + 1}`}
                id={`gradient-${i + 1}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={colors.bg.split(' to ')[0].replace('from-', '')} />
                <stop offset="100%" stopColor={colors.bg.split(' to ')[1].replace('to-', '')} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r={config.circleR * 0.3} fill="#f8f8f8" stroke="#ccc" strokeWidth="1" />

        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fontSize={config.fontSize + 2}
          fontWeight="bold"
          fill="#333"
          className="select-none"
        >
          Natural 13
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          fontSize={config.fontSize - 4}
          fill="#666"
          className="select-none"
        >
          Lunar Calendar
        </text>

        {/* Month segments */}
        {NATURAL13_MONTH_NAMES.map((name, i) => {
          const month = i + 1;
          const angle = (month - 1) * segmentAngle;
          const season = MONTH_TO_SEASON[month];

          return (
            <MonthSegment
              key={`month-${month}`}
              month={month}
              monthName={name}
              angle={angle}
              segmentAngle={segmentAngle}
              radius={config.radius}
              circleR={config.circleR}
              fontSize={config.fontSize}
              labelOffset={config.labelOffset - config.circleR}
              season={season}
              isHighlighted={month === effectiveHighlightMonth}
              onClick={() => handleMonthClick(month)}
            />
          );
        })}

        {/* Astronomical markers */}
        {showMarkers &&
          seasonalMarkers.map((marker) => (
            <MarkerSymbol
              key={marker.id}
              marker={marker}
              angle={markerAngles[marker.id] || 0}
              radius={config.circleR + 20}
              size={size}
            />
          ))}

        {/* Outer circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={config.circleR}
          fill="none"
          stroke="#333"
          strokeWidth="2"
          opacity="0.3"
        />
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {Object.entries(SEASON_COLORS).map(([season, colors]) => (
          <div key={season} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded bg-gradient-to-br ${colors.bg}`} />
            <span className="text-gray-700">{season}</span>
          </div>
        ))}
      </div>

      {/* Current Month Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-center text-gray-700">
        <p className="font-medium">
          Currently: {NATURAL13_MONTH_NAMES[todayNatural13.month - 1]} (Month {todayNatural13.month})
        </p>
        <p className="text-xs text-gray-600 mt-1">{MONTH_TO_SEASON[todayNatural13.month]}</p>
      </div>

      {/* Marker legend */}
      {showMarkers && seasonalMarkers.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p className="font-medium text-gray-700 mb-2">Astronomical Events:</p>
          <div className="space-y-1">
            {seasonalMarkers.map((marker) => (
              <div key={marker.id} className="flex items-center gap-2">
                <span>
                  {marker.timing.astronomicalEvent === 'solstice'
                    ? '☀️'
                    : marker.timing.astronomicalEvent === 'equinox'
                      ? '⚖️'
                      : '✦'}
                </span>
                <span>{marker.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonalWheel;
