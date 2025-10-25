/**
 * @file useConversionService.ts
 * @description React hooks for calendar conversion operations
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1B - Integration
 */

import { useMemo, useCallback } from 'react';
import { ConversionService } from '@/services/ConversionService';
import { Natural13Date, LunarPhase } from '@/types/calendar-systems';

/**
 * Hook to convert a Gregorian date to Natural 13-Month calendar
 * Automatically memoized for performance
 * 
 * @param date - The Gregorian date to convert
 * @returns Natural13Date object with all conversion details
 * 
 * @example
 * ```tsx
 * function EventDateDisplay({ eventDate }: { eventDate: Date }) {
 *   const natural13 = useNatural13Conversion(eventDate);
 *   
 *   return (
 *     <div>
 *       <p>{natural13.monthName}, Day {natural13.day}</p>
 *       <p>Week {natural13.weekOfMonth}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNatural13Conversion(date: Date): Natural13Date {
  const dateKey = useMemo(() => date.toISOString(), [date]);

  return useMemo(() => {
    return ConversionService.toNatural13(date);
  }, [dateKey]);
}

/**
 * Hook to convert Natural 13-Month date back to Gregorian
 * 
 * @param natural13Date - The Natural13 date to convert
 * @returns Gregorian Date object
 * 
 * @example
 * ```tsx
 * function GregorianDateDisplay() {
 *   const natural13 = {
 *     year: 2024,
 *     month: 1,
 *     day: 15,
 *     monthName: 'Moon of Renewal'
 *   };
 *   
 *   const gregorian = useGregorianConversion(natural13);
 *   
 *   return <p>{gregorian.toLocaleDateString()}</p>;
 * }
 * ```
 */
export function useGregorianConversion(natural13Date: Natural13Date): Date {
  const dateKey = useMemo(
    () => `${natural13Date.year}-${natural13Date.month}-${natural13Date.day}`,
    [natural13Date.year, natural13Date.month, natural13Date.day]
  );

  return useMemo(() => {
    return ConversionService.toGregorian(natural13Date);
  }, [dateKey]);
}

/**
 * Hook to get lunar phase information for a date
 * 
 * @param date - The date to get lunar phase for
 * @returns LunarPhase object with phase name, illumination %, and age
 * 
 * @example
 * ```tsx
 * function MoonPhaseDisplay({ date }: { date: Date }) {
 *   const lunar = useLunarPhase(date);
 *   
 *   return (
 *     <div>
 *       <p>🌙 {lunar.phase}</p>
 *       <p>{lunar.illumination}% illuminated</p>
 *       <p>Age: {lunar.age.toFixed(1)} days</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLunarPhase(date: Date): LunarPhase {
  const dateKey = useMemo(() => date.toISOString(), [date]);

  return useMemo(() => {
    return ConversionService.getLunarPhase(date);
  }, [dateKey]);
}

/**
 * Hook to get solar term (solstice/equinox) for a date
 * Returns null if date is not a solar term
 * 
 * @param natural13Date - The Natural13 date to check
 * @returns Solar term name or null
 * 
 * @example
 * ```tsx
 * function SolarTermDisplay({ date }: { date: Natural13Date }) {
 *   const solarTerm = useSolarTerm(date);
 *   
 *   return solarTerm ? (
 *     <Alert type="info">🌞 {solarTerm}</Alert>
 *   ) : null;
 * }
 * ```
 */
export function useSolarTerm(natural13Date: Natural13Date): string | null {
  const dateKey = useMemo(
    () => `${natural13Date.year}-${natural13Date.month}-${natural13Date.day}`,
    [natural13Date.year, natural13Date.month, natural13Date.day]
  );

  return useMemo(() => {
    return ConversionService.getSolarTerm(natural13Date);
  }, [dateKey]);
}

/**
 * Hook to get complete seasonal context for a Gregorian date
 * Includes Natural13 conversion, lunar phase, solar term, and season
 * 
 * @param date - The Gregorian date to analyze
 * @returns Complete seasonal context object
 * 
 * @example
 * ```tsx
 * function CompleteSeasonalDisplay({ date }: { date: Date }) {
 *   const context = useSeasonalContext(date);
 *   
 *   return (
 *     <div>
 *       <h3>{context.natural13Date.monthName}</h3>
 *       <p>Season: {context.season}</p>
 *       <p>Moon: {context.lunarPhase.phase}</p>
 *       {context.solarTerm && <p>⭐ {context.solarTerm}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSeasonalContext(date: Date) {
  const dateKey = useMemo(() => date.toISOString(), [date]);

  return useMemo(() => {
    return ConversionService.getSeasonalContext(date);
  }, [dateKey]);
}

/**
 * Hook to verify round-trip conversion accuracy
 * Useful for debugging or testing conversions
 * 
 * @param date - The Gregorian date to verify
 * @returns Object with success status and days difference
 * 
 * @example
 * ```tsx
 * function DebugConversion({ date }: { date: Date }) {
 *   const result = useConversionVerification(date);
 *   
 *   return (
 *     <p>
 *       {result.success ? '✅ Perfect' : `⚠️ ${result.daysDifference} day difference`}
 *     </p>
 *   );
 * }
 * ```
 */
export function useConversionVerification(date: Date) {
  const dateKey = useMemo(() => date.toISOString(), [date]);

  return useMemo(() => {
    return ConversionService.verifyRoundTrip(date);
  }, [dateKey]);
}

/**
 * Hook to validate a Natural13Date before using it
 * 
 * @param natural13Date - The date to validate
 * @returns Validation result with isValid flag and optional error message
 * 
 * @example
 * ```tsx
 * function SaveNatural13Event({ natural13Date }: { natural13Date: Natural13Date }) {
 *   const validation = useValidateNatural13(natural13Date);
 *   
 *   if (!validation.isValid) {
 *     return <Alert type="error">{validation.error}</Alert>;
 *   }
 *   
 *   return <SaveButton />;
 * }
 * ```
 */
export function useValidateNatural13(natural13Date: Natural13Date) {
  const dateKey = useMemo(
    () => `${natural13Date.year}-${natural13Date.month}-${natural13Date.day}`,
    [natural13Date.year, natural13Date.month, natural13Date.day]
  );

  return useMemo(() => {
    return ConversionService.validateAndConvert(natural13Date);
  }, [dateKey]);
}

/**
 * Hook to batch convert multiple dates
 * Useful for generating date ranges with Natural13 conversions
 * 
 * @param dates - Array of Gregorian dates to convert
 * @returns Array of Natural13Date objects
 * 
 * @example
 * ```tsx
 * function MonthViewCalendar() {
 *   const monthDates = generateMonthDates(new Date());
 *   const natural13Dates = useBatchConversion(monthDates);
 *   
 *   return (
 *     <Grid>
 *       {natural13Dates.map(date => (
 *         <DateCell key={`${date.month}-${date.day}`} date={date} />
 *       ))}
 *     </Grid>
 *   );
 * }
 * ```
 */
export function useBatchConversion(dates: Date[]): Natural13Date[] {
  const dateStrings = useMemo(
    () => dates.map(d => d.toISOString()).join(','),
    [dates]
  );

  return useMemo(() => {
    return ConversionService.batchToNatural13(dates);
  }, [dateStrings]);
}

/**
 * Hook to batch convert multiple Natural13 dates
 * 
 * @param natural13Dates - Array of Natural13 dates to convert
 * @returns Array of Gregorian Date objects
 * 
 * @example
 * ```tsx
 * function ExportToGregorian() {
 *   const natural13Dates = [...];
 *   const gregorianDates = useBatchGregorianConversion(natural13Dates);
 *   
 *   // Use gregorianDates for export/sharing
 * }
 * ```
 */
export function useBatchGregorianConversion(natural13Dates: Natural13Date[]): Date[] {
  const dateStrings = useMemo(
    () =>
      natural13Dates
        .map(d => `${d.year}-${d.month}-${d.day}`)
        .join(','),
    [natural13Dates]
  );

  return useMemo(() => {
    return ConversionService.batchToGregorian(natural13Dates);
  }, [dateStrings]);
}

/**
 * Hook to batch get lunar phases for multiple dates
 * 
 * @param dates - Array of Gregorian dates
 * @returns Array of LunarPhase objects
 * 
 * @example
 * ```tsx
 * function LunarCalendar() {
 *   const dates = generateMonthDates(new Date());
 *   const lunarPhases = useBatchLunarPhases(dates);
 *   
 *   return (
 *     <div>
 *       {lunarPhases.map((phase, i) => (
 *         <LunarCell key={i} phase={phase} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBatchLunarPhases(dates: Date[]): LunarPhase[] {
  const dateStrings = useMemo(
    () => dates.map(d => d.toISOString()).join(','),
    [dates]
  );

  return useMemo(() => {
    return ConversionService.batchGetLunarPhases(dates);
  }, [dateStrings]);
}

/**
 * Hook to get date range with optional metadata
 * Useful for generating calendars with all context information
 * 
 * @param startDate - Start date for range
 * @param endDate - End date for range
 * @param includeMetadata - Whether to include lunar/solar data
 * @returns Array of dates with optional metadata
 * 
 * @example
 * ```tsx
 * function SeasonalCalendarView() {
 *   const start = new Date(2024, 11, 1);
 *   const end = new Date(2024, 11, 31);
 *   
 *   const range = useDateRange(start, end, true);
 *   
 *   return (
 *     <Calendar>
 *       {range.map(item => (
 *         <EnhancedDateCell
 *           key={`${item.date.month}-${item.date.day}`}
 *           date={item.date}
 *           lunar={item.lunar}
 *           solar={item.solar}
 *         />
 *       ))}
 *     </Calendar>
 *   );
 * }
 * ```
 */
export function useDateRange(
  startDate: Date,
  endDate: Date,
  includeMetadata: boolean = false
) {
  const dateRangeKey = useMemo(
    () => `${startDate.toISOString()}-${endDate.toISOString()}-${includeMetadata}`,
    [startDate, endDate, includeMetadata]
  );

  return useMemo(() => {
    return ConversionService.getDateRange(startDate, endDate, includeMetadata);
  }, [dateRangeKey]);
}

/**
 * Hook to clear the conversion cache
 * Useful for memory-constrained environments
 * 
 * @example
 * ```tsx
 * function SettingsPage() {
 *   const clearCache = useClearConversionCache();
 *   
 *   return (
 *     <Button onClick={clearCache}>
 *       Clear Conversion Cache
 *     </Button>
 *   );
 * }
 * ```
 */
export function useClearConversionCache() {
  return useCallback(() => {
    ConversionService.clearCache();
  }, []);
}
