'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { useNatural13Conversion, useBatchConversion, useLunarPhase } from '@/hooks/useConversionService';
import { NATURAL13_MONTH_NAMES } from '@/types/calendar-systems';
import type { Natural13Date } from '@/types/calendar-systems';

interface DualCalendarGridProps {
  /**
   * The month to display (1-12 for Gregorian)
   */
  month: number;
  /**
   * The year to display
   */
  year: number;
  /**
   * Whether to show lunar phase indicators
   */
  showLunar?: boolean;
  /**
   * Whether to highlight today
   */
  showToday?: boolean;
  /**
   * Callback when a date is selected
   */
  onDateSelect?: (gregorianDate: Date, natural13Date: Natural13Date) => void;
  /**
   * CSS class for the grid container
   */
  className?: string;
  /**
   * Whether the component is loading
   */
  isLoading?: boolean;
}

/**
 * Lunar phase emoji mapping
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
 * Generate array of dates for a calendar month (42 dates = 6 weeks)
 * Includes dates from previous/next months for complete grid
 */
function generateMonthDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const firstDayOfWeek = firstDay.getDay();

  const dates: Date[] = [];

  // Add previous month's dates to fill the first week
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, -i);
    dates.push(date);
  }

  // Add all dates in the current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    dates.push(new Date(year, month - 1, day));
  }

  // Add next month's dates to fill the last week
  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    dates.push(new Date(year, month, i));
  }

  return dates;
}

/**
 * Individual date cell component
 */
const DateCell = React.memo(
  ({
    gregorianDate,
    natural13Date,
    lunarPhase,
    isCurrentMonth,
    isToday,
    showLunar,
    onSelect,
  }: {
    gregorianDate: Date;
    natural13Date: Natural13Date;
    lunarPhase?: { phase: string; illumination: number; age: number };
    isCurrentMonth: boolean;
    isToday: boolean;
    showLunar: boolean;
    onSelect: (gregorianDate: Date, natural13Date: Natural13Date) => void;
  }) => {
    const handleClick = useCallback(() => {
      onSelect(gregorianDate, natural13Date);
    }, [gregorianDate, natural13Date, onSelect]);

    return (
      <button
        onClick={handleClick}
        className={`
          relative w-full aspect-square p-1 text-xs rounded-md border-2
          transition-all duration-200 hover:shadow-md cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
          ${
            isToday
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
              : isCurrentMonth
                ? 'border-gray-200 bg-white hover:bg-gray-50'
                : 'border-gray-100 bg-gray-50 text-gray-400'
          }
        `}
        disabled={!isCurrentMonth}
        role="gridcell"
        aria-label={`${gregorianDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })} (${natural13Date.monthName} Day ${natural13Date.day})${isToday ? ', Today' : ''}`}
        aria-current={isToday ? 'date' : undefined}
        aria-disabled={!isCurrentMonth}
        title={`${gregorianDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })} · ${natural13Date.monthName} ${natural13Date.day}`}
      >
        <div className="flex flex-col gap-0.5 h-full">
          {/* Gregorian date (top) */}
          <div
            className={`font-semibold text-xs ${
              isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {gregorianDate.getDate()}
          </div>

          {/* Natural13 info (middle) */}
          <div className={`text-xs ${isCurrentMonth ? 'text-emerald-700' : 'text-emerald-300'}`}>
            <div className="font-medium">{natural13Date.day}</div>
            <div className="text-xs opacity-75">{natural13Date.monthName.split(' ')[0]}</div>
          </div>

          {/* Lunar phase indicator (bottom) */}
          {showLunar && lunarPhase && (
            <div className="text-lg mt-auto" title={`${lunarPhase.phase} (${lunarPhase.illumination.toFixed(0)}%)`}>
              {MOON_EMOJIS[lunarPhase.phase as keyof typeof MOON_EMOJIS] || '🌙'}
            </div>
          )}
        </div>
      </button>
    );
  },
  (prev, next) => {
    // Custom memo comparison - only re-render if essential props change
    return (
      prev.gregorianDate.getTime() === next.gregorianDate.getTime() &&
      prev.natural13Date.year === next.natural13Date.year &&
      prev.natural13Date.month === next.natural13Date.month &&
      prev.natural13Date.day === next.natural13Date.day &&
      prev.isCurrentMonth === next.isCurrentMonth &&
      prev.isToday === next.isToday &&
      prev.showLunar === next.showLunar &&
      prev.lunarPhase?.phase === next.lunarPhase?.phase &&
      prev.lunarPhase?.illumination === next.lunarPhase?.illumination
    );
  }
);

DateCell.displayName = 'DateCell';

/**
 * DualCalendarGrid Component
 *
 * Displays a month view with both Gregorian and Natural13-month calendars.
 * Each cell shows:
 * - Gregorian date (top)
 * - Natural13 date and month name (middle)
 * - Lunar phase emoji (bottom, optional)
 *
 * Features:
 * - 6-week grid (42 dates total)
 * - Batch conversion for performance
 * - Lunar phase indicators
 * - Today highlighting
 * - Click callbacks
 * - Responsive layout
 * - Accessible date labels
 *
 * @example
 * ```tsx
 * <DualCalendarGrid
 *   month={10}
 *   year={2024}
 *   showLunar={true}
 *   showToday={true}
 *   onDateSelect={(gDate, n13Date) => console.log(n13Date)}
 * />
 * ```
 */
export const DualCalendarGrid: React.FC<DualCalendarGridProps> = ({
  month,
  year,
  showLunar = true,
  showToday = true,
  onDateSelect,
  className = '',
  isLoading = false,
}) => {
  // State for selected date (optional local tracking)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate all dates for this month (42 dates = 6 weeks)
  const monthDates = useMemo(() => generateMonthDates(year, month), [year, month]);

  // Get today's date
  const today = useMemo(() => new Date(), []);

  // Batch convert all dates to Natural13 format (efficient!)
  const natural13Dates = useBatchConversion(monthDates);

  // Get lunar phase for today (for potential header display)
  const todayLunarPhase = useLunarPhase(today);

  // Handler for date selection
  const handleDateSelect = useCallback(
    (gregorianDate: Date, natural13Date: Natural13Date) => {
      setSelectedDate(gregorianDate);
      onDateSelect?.(gregorianDate, natural13Date);
    },
    [onDateSelect]
  );

  // Determine if a date is in the current month
  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === month - 1 && date.getFullYear() === year;
  }, [month, year]);

  // Determine if a date is today
  const isToday = useCallback((date: Date) => {
    return (
      showToday &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, [today, showToday]);

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Loading calendar...</div>
        </div>
      </div>
    );
  }

  if (natural13Dates.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} role="region" aria-label="Calendar display">
      {/* Calendar Description for Screen Readers */}
      <div id="calendar-description" className="sr-only">
        Dual calendar view showing Gregorian and Natural13-month calendars. Navigate using arrow keys or click to select a date. Today is highlighted with a blue ring.
      </div>

      {/* Calendar Header */}
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-900">
          {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="text-sm text-gray-600">
          🌙 {todayLunarPhase.phase.replace(/_/g, ' ')} ({todayLunarPhase.illumination.toFixed(0)}%)
        </div>
      </div>

      {/* Weekday Headers */}
      <div
        className="grid grid-cols-7 gap-1 mb-2"
        role="rowheader"
        aria-label="Days of the week"
      >
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 py-2"
            role="columnheader"
            aria-label={day}
          >
            {day.substring(0, 3)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        className="grid grid-cols-7 gap-1 bg-gray-50 p-2 rounded-lg"
        role="grid"
        aria-label={`Calendar grid for ${new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
        aria-describedby="calendar-description"
      >
        {monthDates.map((date, index) => {
          const natural13 = natural13Dates[index];
          const currentMonthBool = isCurrentMonth(date);
          const isTodayBool = isToday(date);

          // Get lunar phase for this date (cached)
          const lunarPhase = useLunarPhase(date);

          return (
            <DateCell
              key={`${date.getTime()}`}
              gregorianDate={date}
              natural13Date={natural13}
              lunarPhase={showLunar ? lunarPhase : undefined}
              isCurrentMonth={currentMonthBool}
              isToday={isTodayBool}
              showLunar={showLunar}
              onSelect={handleDateSelect}
            />
          );
        })}
      </div>

      {/* Footer Info */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-medium">
            Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {natural13Dates[monthDates.indexOf(selectedDate)] && (
            <p className="text-emerald-700 font-medium">
              Natural13: {natural13Dates[monthDates.indexOf(selectedDate)].monthName} Day{' '}
              {natural13Dates[monthDates.indexOf(selectedDate)].day}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DualCalendarGrid;
