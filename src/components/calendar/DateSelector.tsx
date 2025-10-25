'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useNatural13Conversion, useValidateNatural13 } from '@/hooks/useConversionService';
import { useSeasonalContext } from '@/hooks/useConversionService';
import { NATURAL13_MONTH_NAMES } from '@/types/calendar-systems';
import type { Natural13Date } from '@/types/calendar-systems';

interface DateSelectorProps {
  /**
   * Callback when a date is selected
   */
  onDateSelect: (gregorianDate: Date, natural13Date: Natural13Date) => void;
  /**
   * Initial date to display
   */
  initialDate?: Date;
  /**
   * CSS class for container
   */
  className?: string;
  /**
   * Whether loading
   */
  isLoading?: boolean;
  /**
   * Show additional context (lunar, solar)
   */
  showContext?: boolean;
}

/**
 * Month selector component
 */
const MonthSelector = React.memo(
  ({
    selectedMonth,
    onChange,
  }: {
    selectedMonth: number;
    onChange: (month: number) => void;
  }) => (
    <div className="flex items-center gap-2">
      <label htmlFor="month-select" className="text-sm font-medium text-gray-700">
        Month:
      </label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
      >
        {NATURAL13_MONTH_NAMES.map((name, i) => (
          <option key={i} value={i + 1}>
            {i + 1} - {name}
          </option>
        ))}
      </select>
    </div>
  )
);

MonthSelector.displayName = 'MonthSelector';

/**
 * Day input component with validation
 */
const DayInput = React.memo(
  ({
    value,
    maxDay,
    onChange,
  }: {
    value: number;
    maxDay: number;
    onChange: (day: number) => void;
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (input === '') {
          onChange(1);
          return;
        }

        const day = parseInt(input);
        if (!isNaN(day) && day >= 1 && day <= maxDay) {
          onChange(day);
        }
      },
      [maxDay, onChange]
    );

    return (
      <div className="flex items-center gap-2">
        <label htmlFor="day-input" className="text-sm font-medium text-gray-700">
          Day:
        </label>
        <input
          id="day-input"
          type="number"
          min="1"
          max={maxDay}
          value={value}
          onChange={handleChange}
          className="w-16 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        />
        <span className="text-sm text-gray-600">/ {maxDay}</span>
      </div>
    );
  }
);

DayInput.displayName = 'DayInput';

/**
 * Gregorian date input component
 */
const GregorianDateInput = React.memo(
  ({
    value,
    onChange,
  }: {
    value: Date;
    onChange: (date: Date) => void;
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateStr = e.target.value;
        if (dateStr) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            onChange(date);
          }
        }
      },
      [onChange]
    );

    const dateStr = value.toISOString().split('T')[0];

    return (
      <div className="flex items-center gap-2">
        <label htmlFor="gregorian-input" className="text-sm font-medium text-gray-700">
          Gregorian Date:
        </label>
        <input
          id="gregorian-input"
          type="date"
          value={dateStr}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  }
);

GregorianDateInput.displayName = 'GregorianDateInput';

/**
 * Days per month in Natural13 calendar
 * 12 months of 28 days + 1 month of 29/30 days
 */
const DAYS_PER_MONTH = [28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29]; // 13th month can be 29-30

/**
 * DateSelector Component
 *
 * Interactive date picker allowing selection via:
 * - Natural13 month + day input
 * - Gregorian date picker
 * - Real-time conversion display
 * - Optional seasonal context
 *
 * Features:
 * - Dual-calendar date selection
 * - Input validation
 * - Real-time conversion
 * - Lunar and solar context
 * - Responsive layout
 * - Accessible form elements
 *
 * @example
 * ```tsx
 * <DateSelector
 *   initialDate={new Date()}
 *   showContext={true}
 *   onDateSelect={(gregorian, natural13) => {
 *     console.log('Selected:', natural13.monthName, natural13.day);
 *   }}
 * />
 * ```
 */
export const DateSelector: React.FC<DateSelectorProps> = ({
  onDateSelect,
  initialDate = new Date(),
  className = '',
  isLoading = false,
  showContext = true,
}) => {
  // Input mode: 'gregorian' or 'natural13'
  const [inputMode, setInputMode] = useState<'gregorian' | 'natural13'>('gregorian');

  // Gregorian date input
  const [gregorianDate, setGregorianDate] = useState(initialDate);

  // Natural13 date input
  const initialNatural13 = useNatural13Conversion(initialDate);
  const [natural13Month, setNatural13Month] = useState(initialNatural13.month);
  const [natural13Day, setNatural13Day] = useState(initialNatural13.day);

  // Get current conversions
  const gregorianConversion = useNatural13Conversion(gregorianDate);
  const natural13Validation = useValidateNatural13({
    year: new Date().getFullYear(), // TODO: Add year picker
    month: natural13Month,
    day: natural13Day,
  });
  const seasonalContext = useSeasonalContext(gregorianDate);

  // Computed Natural13 date from inputs
  const inputNatural13: Natural13Date = useMemo(
    () => {
      const dayOfYear = NATURAL13_MONTH_NAMES.slice(0, natural13Month - 1).reduce((sum, _, i) => {
        return sum + DAYS_PER_MONTH[i];
      }, natural13Day);
      return {
        year: new Date().getFullYear(),
        month: natural13Month,
        day: natural13Day,
        monthName: NATURAL13_MONTH_NAMES[natural13Month - 1],
        isLeapYear: false,
      };
    },
    [natural13Month, natural13Day]
  );

  // Calculate day of year for display
  const dayOfYear = useMemo(
    () =>
      NATURAL13_MONTH_NAMES.slice(0, natural13Month - 1).reduce((sum, _, i) => {
        return sum + DAYS_PER_MONTH[i];
      }, natural13Day),
    [natural13Month, natural13Day]
  );

  // Handle Gregorian date change
  const handleGregorianChange = useCallback((date: Date) => {
    setGregorianDate(date);
    setInputMode('gregorian');
    const n13 = useNatural13Conversion(date);
    setNatural13Month(n13.month);
    setNatural13Day(n13.day);
    onDateSelect(date, n13);
  }, [onDateSelect]);

  // Handle Natural13 date change
  const handleNatural13Change = useCallback(
    (month: number, day: number) => {
      setNatural13Month(month);
      setNatural13Day(day);
      setInputMode('natural13');

      // Convert Natural13 to Gregorian (approximate)
      // This is a simplified conversion - for exact accuracy, use service
      const maxDay = DAYS_PER_MONTH[month - 1];
      if (day <= maxDay && month >= 1 && month <= 13) {
        // Approximate Gregorian date
        const yearStart = new Date(new Date().getFullYear(), 11, 21); // Dec 21 (Natural13 Year Day)
        const dayOfYear = NATURAL13_MONTH_NAMES.slice(0, month - 1).reduce((sum, _, i) => {
          return sum + DAYS_PER_MONTH[i];
        }, day);
        const gregorianApprox = new Date(yearStart);
        gregorianApprox.setDate(gregorianApprox.getDate() + dayOfYear - 1);
        setGregorianDate(gregorianApprox);
        onDateSelect(gregorianApprox, inputNatural13);
      }
    },
    [inputNatural13, onDateSelect]
  );

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center p-4`}>
        <div className="text-gray-400">Loading date selector...</div>
      </div>
    );
  }

  return (
    <div
      className={`${className} space-y-6 p-4 bg-white rounded-lg shadow-md`}
      role="group"
      aria-labelledby="date-selector-title"
      aria-describedby="date-selector-description"
    >
      {/* Screen Reader Announcement */}
      <div id="date-selector-title" className="sr-only">
        Date Selector: Gregorian and Natural13-Month Calendar
      </div>
      <div id="date-selector-description" className="sr-only">
        Convert between Gregorian and Natural13-month calendar systems. Use the input fields or selectors below to choose a date.
      </div>

      {/* Gregorian Date Input */}
      <fieldset className="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <legend className="text-sm font-semibold text-blue-900">Gregorian Calendar</legend>
        <GregorianDateInput value={gregorianDate} onChange={handleGregorianChange} />
        <div className="text-sm text-gray-700 mt-2">
          <p>{gregorianDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </fieldset>

      {/* Conversion Arrow */}
      <div className="flex justify-center" aria-hidden="true">
        <div className="text-2xl text-gray-400">⇅</div>
      </div>

      {/* Natural13 Date Input */}
      <fieldset className="space-y-4 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
        <legend className="text-sm font-semibold text-emerald-900">Natural13-Month Calendar</legend>
        <div className="grid grid-cols-2 gap-4">
          <MonthSelector selectedMonth={natural13Month} onChange={(m) => handleNatural13Change(m, natural13Day)} />
          <DayInput value={natural13Day} maxDay={DAYS_PER_MONTH[natural13Month - 1]} onChange={(d) => handleNatural13Change(natural13Month, d)} />
        </div>
        <div className="text-sm text-gray-700 mt-2">
          <p className="font-medium">
            {NATURAL13_MONTH_NAMES[natural13Month - 1]} • Day {natural13Day} of{' '}
            {DAYS_PER_MONTH[natural13Month - 1]}
          </p>
          <p className="text-xs text-gray-600">
            Year Day #{dayOfYear} of 365/366
          </p>
        </div>
      </fieldset>

      {/* Conversion Summary */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm font-semibold text-gray-900 mb-3">Conversion Summary</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Gregorian:</span>
            <span className="font-medium">
              {inputMode === 'gregorian'
                ? gregorianDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Calculated...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Natural13:</span>
            <span className="font-medium">
              {NATURAL13_MONTH_NAMES[natural13Month - 1]} {natural13Day}, {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {/* Seasonal Context (optional) */}
      {showContext && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-sm font-semibold text-purple-900 mb-3">Seasonal Context</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">🌙 Lunar Phase:</span>
              <span className="font-medium capitalize">
                {seasonalContext.lunarPhase.phase.replace(/_/g, ' ')} ({seasonalContext.lunarPhase.illumination.toFixed(0)}%)
              </span>
            </div>
            {seasonalContext.solarTerm && (
              <div className="flex justify-between">
                <span className="text-gray-600">⭐ Solar Term:</span>
                <span className="font-medium">{seasonalContext.solarTerm}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">🌍 Season:</span>
              <span className="font-medium capitalize">{seasonalContext.season}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => {
            const today = new Date();
            setGregorianDate(today);
            const n13 = useNatural13Conversion(today);
            setNatural13Month(n13.month);
            setNatural13Day(n13.day);
            onDateSelect(today, n13);
          }}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Today
        </button>
        <button
          onClick={() => {
            const yesterday = new Date(gregorianDate);
            yesterday.setDate(yesterday.getDate() - 1);
            handleGregorianChange(yesterday);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={() => {
            const tomorrow = new Date(gregorianDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            handleGregorianChange(tomorrow);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default DateSelector;
