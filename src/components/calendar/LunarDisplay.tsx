'use client';

import React, { useMemo, useCallback } from 'react';
import { useLunarPhase, useBatchLunarPhases } from '@/hooks/useConversionService';

interface LunarDisplayProps {
  /**
   * The date to display the lunar phase for
   */
  date?: Date;
  /**
   * Number of upcoming days to show phases for
   */
  showUpcoming?: number;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * CSS class for container
   */
  className?: string;
  /**
   * Whether to show percentage and age info
   */
  showDetails?: boolean;
  /**
   * Whether loading
   */
  isLoading?: boolean;
}

/**
 * Lunar phase emoji mapping
 * Uses standard Unicode moon phase characters
 */
const MOON_EMOJIS: Record<string, string> = {
  new: '🌑',
  waxing_crescent: '🌒',
  first_quarter: '🌓',
  waxing_gibbous: '🌔',
  full: '🌕',
  waning_gibbous: '🌖',
  last_quarter: '🌗',
  waning_crescent: '🌘',
};

/**
 * Phase name formatting
 */
function formatPhaseName(phase: string): string {
  return phase
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Size configuration
 */
const SIZE_CONFIG = {
  sm: {
    moonEmoji: 'text-2xl',
    phaseName: 'text-sm',
    details: 'text-xs',
    container: 'p-2',
  },
  md: {
    moonEmoji: 'text-5xl',
    phaseName: 'text-base',
    details: 'text-sm',
    container: 'p-4',
  },
  lg: {
    moonEmoji: 'text-7xl',
    phaseName: 'text-lg',
    details: 'text-base',
    container: 'p-6',
  },
};

/**
 * Upcoming phase indicator component
 */
const UpcomingPhaseIndicator = React.memo(
  ({
    phase,
    daysAhead,
    size,
  }: {
    phase: { phase: string; illumination: number; age: number };
    daysAhead: number;
    size: 'sm' | 'md' | 'lg';
  }) => {
    const config = SIZE_CONFIG[size];
    const sizeMap = { sm: 'text-xl', md: 'text-3xl', lg: 'text-4xl' };

    return (
      <div className="flex flex-col items-center gap-1">
        <div className={sizeMap[size]}>
          {MOON_EMOJIS[phase.phase as keyof typeof MOON_EMOJIS] || '🌙'}
        </div>
        <div className={`${config.details} text-gray-600 font-medium`}>+{daysAhead}d</div>
        <div className={`${config.details} text-gray-500`}>{phase.illumination.toFixed(0)}%</div>
      </div>
    );
  }
);

UpcomingPhaseIndicator.displayName = 'UpcomingPhaseIndicator';

/**
 * LunarDisplay Component
 *
 * Displays current lunar phase with detailed information and optional upcoming phases.
 *
 * Features:
 * - Current moon phase emoji
 * - Illumination percentage
 * - Age in days
 * - Upcoming phases (optional)
 * - Multiple size variants
 * - Responsive layout
 * - Accessible phase names
 *
 * @example
 * ```tsx
 * // Simple current phase
 * <LunarDisplay date={new Date()} />
 *
 * // With upcoming phases
 * <LunarDisplay
 *   date={new Date()}
 *   showUpcoming={7}
 *   size="lg"
 *   showDetails={true}
 * />
 *
 * // Compact version
 * <LunarDisplay size="sm" />
 * ```
 */
export const LunarDisplay: React.FC<LunarDisplayProps> = ({
  date = new Date(),
  showUpcoming = 0,
  size = 'md',
  className = '',
  showDetails = true,
  isLoading = false,
}) => {
  const config = SIZE_CONFIG[size];

  // Get lunar phase for the given date
  const lunarPhase = useLunarPhase(date);

  // Generate upcoming dates
  const upcomingDates = useMemo(() => {
    if (showUpcoming <= 0) return [];
    return Array.from({ length: showUpcoming }, (_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() + i + 1);
      return d;
    });
  }, [date, showUpcoming]);

  // Batch get lunar phases for upcoming dates
  const upcomingPhases = useBatchLunarPhases(upcomingDates);

  if (isLoading) {
    return (
      <div className={`${config.container} ${className} flex items-center justify-center`}>
        <div className="text-gray-400">Loading lunar data...</div>
      </div>
    );
  }

  return (
    <div
      className={`${config.container} ${className}`}
      role="region"
      aria-label="Lunar phase display"
      aria-describedby="lunar-description"
    >
      {/* Screen Reader Description */}
      <div id="lunar-description" className="sr-only">
        Lunar phase information for {date.toLocaleDateString()}. Shows current moon phase, illumination percentage, and age in lunar cycle.
      </div>

      {/* Current Lunar Phase */}
      <div className="flex flex-col items-center gap-3 mb-6">
        {/* Moon Emoji */}
        <div
          className={`${config.moonEmoji} leading-none`}
          role="img"
          aria-label={`${formatPhaseName(lunarPhase.phase)} moon`}
          title={`${formatPhaseName(lunarPhase.phase)} - ${lunarPhase.illumination.toFixed(0)}% illuminated`}
        >
          {MOON_EMOJIS[lunarPhase.phase as keyof typeof MOON_EMOJIS] || '🌙'}
        </div>

        {/* Phase Name */}
        <div className={`${config.phaseName} font-semibold text-gray-900`}>
          {formatPhaseName(lunarPhase.phase)}
        </div>

        {/* Phase Details */}
        {showDetails && (
          <div className={`${config.details} text-center space-y-1`}>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium text-gray-700">{lunarPhase.illumination.toFixed(0)}%</span>
              <span className="text-gray-500">illuminated</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium text-gray-700">{lunarPhase.age.toFixed(1)}</span>
              <span className="text-gray-500">days old</span>
            </div>
          </div>
        )}

        {/* Illumination Bar */}
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 via-white to-gray-800 h-full transition-all duration-500"
            style={{ width: `${lunarPhase.illumination}%` }}
          />
        </div>

        {/* Lunar Cycle Progress */}
        <div className={`${config.details} text-gray-500`}>
          Cycle: {lunarPhase.age.toFixed(1)} / 29.5 days
        </div>
      </div>

      {/* Upcoming Phases */}
      {upcomingPhases.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <div className={`${config.details} font-semibold text-gray-900 mb-3`}>Upcoming Phases</div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {upcomingPhases.map((phase, index) => (
              <div key={index} className="flex-shrink-0">
                <UpcomingPhaseIndicator phase={phase} daysAhead={index + 1} size={size} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className={`${config.details} text-gray-600 mt-4 pt-4 border-t border-gray-100`}>
        <p>Lunar Month: ~29.5 days</p>
        <p>Last Full Moon: ~{(lunarPhase.age - 14.75).toFixed(1)} days ago</p>
        <p>Next Full Moon: ~{(14.75 - lunarPhase.age).toFixed(1)} days away</p>
      </div>
    </div>
  );
};

export default LunarDisplay;
