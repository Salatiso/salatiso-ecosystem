/**
 * @file calendar-conversion.ts
 * @description Core conversion logic between calendar systems
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1 - Foundation
 * 
 * This module provides conversion functions between:
 * - Gregorian calendar (canonical/canonical storage)
 * - Natural 13-Month calendar (overlay system)
 * - Lunar phases (astronomical overlay)
 */

import { Natural13Date, LunarPhase, LunarPhaseName } from '@/types/calendar-systems';

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

/**
 * Determine if a year is a Gregorian leap year
 */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the Julian Day Number for a date
 * Used for lunar phase calculations
 * Formula: JD = (ms / 86400000) + 2440587.5 at UTC
 */
export function getJulianDate(date: Date): number {
  // Get UTC time in milliseconds
  const utcMs = date.getTime();
  // Convert to days and add the Julian Day Number epoch offset
  return utcMs / 86400000 + 2440587.5;
}

/**
 * Get the winter solstice date for a given year
 * Winter Solstice is approximately Dec 21-22
 * Using a simplified calculation
 */
export function getWinterSolstice(year: number): Date {
  // Accurate to within a day for practical purposes
  // Solstice occurs around Dec 21-22
  // For simplicity, using Dec 21
  return new Date(year, 11, 21); // Month is 0-indexed, so 11 = December
}

/**
 * Get the number of days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const ms = date2.getTime() - date1.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/**
 * ============================================================================
 * GREGORIAN TO NATURAL 13-MONTH CONVERSION
 * ============================================================================
 */

/**
 * Convert a Gregorian date to Natural 13-Month calendar
 * 
 * Natural 13-Month Calendar Structure:
 * - 13 months, 28 days each = 364 days
 * - 1 "Year Day" (intercalary) on Dec 21 each year
 * - 1 "Leap Day" after Month 6 in leap years
 * - Year starts on winter solstice (Dec 21/22)
 */
export function convertGregorianToNatural13(gregorianDate: Date): Natural13Date {
  const currentYear = gregorianDate.getFullYear();
  const currentMonth = gregorianDate.getMonth();
  const currentDay = gregorianDate.getDate();
  
  // Determine which Natural13 year this falls into
  // Year Day = Dec 21, then Month 1 Day 1 starts Dec 22
  let natural13Year = currentYear;
  let yearStart: Date;
  
  if (currentMonth < 11 || (currentMonth === 11 && currentDay < 21)) {
    // Before Dec 21 - belongs to previous Natural13 year
    natural13Year = currentYear - 1;
    yearStart = new Date(currentYear - 1, 11, 21);
  } else {
    // Dec 21 or later - belongs to current Natural13 year
    yearStart = new Date(currentYear, 11, 21);
  }
  
  // Check if this IS the year start (Dec 21) - special Year Day
  if (
    currentMonth === 11 &&
    currentDay === 21 &&
    (natural13Year === currentYear || currentYear - 1 === natural13Year)
  ) {
    return {
      year: natural13Year,
      month: 0,
      day: 1,
      dayOfWeek: 0,
      specialDay: 'Year Day',
      monthName: 'Year Day',
      seasonalPosition: 'Winter Solstice'
    };
  }
  
  // Calculate days since year start (Dec 22 = day 1 of Month 1)
  let daysSinceYearDay = daysBetween(yearStart, gregorianDate);
  
  const isLeapYear = isGregorianLeapYear(currentYear);
  
  // Handle Leap Day: After 168 days (6 months × 28 days)
  const leapDayPosition = 169; // The 169th day (after 168)
  
  if (isLeapYear && daysSinceYearDay === leapDayPosition) {
    return {
      year: natural13Year,
      month: 6,
      day: 29, // Extended 29th day of month 6
      dayOfWeek: ((daysSinceYearDay) % 7) + 1,
      specialDay: 'Leap Day',
      monthName: NATURAL13_MONTH_NAMES[5] || 'Moon of First Rains',
      seasonalPosition: 'Leap Day Balance'
    };
  }
  
  // For days after leap day in leap years, adjust the count
  let adjustedDays = daysSinceYearDay;
  if (isLeapYear && daysSinceYearDay > leapDayPosition) {
    adjustedDays -= 1;
  }
  
  // Calculate month and day (13 months × 28 days each)
  const month = Math.floor((adjustedDays - 1) / 28) + 1;
  const day = ((adjustedDays - 1) % 28) + 1;
  
  // Ensure month stays in valid range (1-13)
  const finalMonth = Math.min(Math.max(month, 1), 13);
  
  return {
    year: natural13Year,
    month: finalMonth,
    day: day,
    dayOfWeek: ((day - 1) % 7) + 1,
    weekOfMonth: Math.floor((day - 1) / 7) + 1,
    monthName: NATURAL13_MONTH_NAMES[finalMonth - 1] || 'Unknown',
    seasonalPosition: getSeasonalPosition(finalMonth, day)
  };
}

/**
 * ============================================================================
 * NATURAL 13-MONTH TO GREGORIAN CONVERSION
 * ============================================================================
 */

/**
 * Convert a Natural 13-Month date to Gregorian calendar
 */
export function convertNatural13ToGregorian(natural13Date: Natural13Date): Date {
  const yearStart = new Date(natural13Date.year, 11, 21); // Dec 21
  
  // Handle Year Day (special intercalary day)
  if (natural13Date.specialDay === 'Year Day') {
    return new Date(natural13Date.year, 11, 21); // Dec 21
  }
  
  // Handle Leap Day (169th day = after 168 days from Dec 22)
  if (natural13Date.specialDay === 'Leap Day') {
    const leapDayTime = yearStart.getTime() + (168 * 24 * 60 * 60 * 1000);
    return new Date(leapDayTime);
  }
  
  // Regular months: calculate days from year start
  let daysFromYearDay = (natural13Date.month - 1) * 28 + natural13Date.day;
  
  // Add leap day offset if applicable and after month 6
  const isLeapYear = isGregorianLeapYear(natural13Date.year);
  if (isLeapYear && natural13Date.month > 6) {
    daysFromYearDay += 1;
  }
  
  // Return calculated Gregorian date (days from Dec 21)
  const resultTime = yearStart.getTime() + (daysFromYearDay * 24 * 60 * 60 * 1000);
  return new Date(resultTime);
}

/**
 * ============================================================================
 * LUNAR PHASE CALCULATIONS
 * ============================================================================
 */

/**
 * Calculate the lunar phase for a given date
 * Uses astronomical calculations based on the synodic month (29.53 days)
 * 
 * Reference new moon: Jan 6, 2000 (known astronomical date)
 */
export function calculateLunarPhase(date: Date): LunarPhase {
  // Reference new moon (JD 2451550.1)
  const REFERENCE_NEW_MOON_JD = 2451550.1;
  const SYNODIC_MONTH = 29.53058867; // Days in lunar cycle
  
  // Get Julian Day Number
  const jd = getJulianDate(date);
  
  // Calculate days since reference new moon
  let daysSinceNewMoon = (jd - REFERENCE_NEW_MOON_JD) % SYNODIC_MONTH;
  
  // Normalize to positive value
  if (daysSinceNewMoon < 0) {
    daysSinceNewMoon += SYNODIC_MONTH;
  }
  
  // Calculate illumination (0-100%)
  const illumination = 50 * (1 - Math.cos((2 * Math.PI * daysSinceNewMoon) / SYNODIC_MONTH));
  
  // Determine phase name based on age
  let phase: LunarPhaseName;
  
  if (daysSinceNewMoon < 1.84566) {
    phase = 'new';
  } else if (daysSinceNewMoon < 7.38244) {
    phase = 'waxing_crescent';
  } else if (daysSinceNewMoon < 9.22831) {
    phase = 'first_quarter';
  } else if (daysSinceNewMoon < 14.76491) {
    phase = 'waxing_gibbous';
  } else if (daysSinceNewMoon < 16.61078) {
    phase = 'full';
  } else if (daysSinceNewMoon < 22.14737) {
    phase = 'waning_gibbous';
  } else if (daysSinceNewMoon < 23.99324) {
    phase = 'last_quarter';
  } else if (daysSinceNewMoon < 29.53058867) {
    phase = 'waning_crescent';
  } else {
    phase = 'new';
  }
  
  return {
    phase,
    illumination: Math.round(illumination * 100) / 100, // Round to 2 decimals
    age: Math.round(daysSinceNewMoon * 100) / 100
  };
}

/**
 * ============================================================================
 * SEASONAL CONTEXT
 * ============================================================================
 */

/**
 * Natural 13-Month calendar month names
 */
export const NATURAL13_MONTH_NAMES = [
  'Moon of Renewal',        // 1
  'Moon of Deep Cold',      // 2
  'Moon of Awakening',      // 3
  'Moon of First Growth',   // 4
  'Moon of Planting',       // 5
  'Moon of First Rains',    // 6
  'Moon of Long Days',      // 7
  'Moon of First Harvest',  // 8
  'Moon of Ripening',       // 9
  'Moon of Gathering',      // 10
  'Moon of Falling Leaves', // 11
  'Moon of First Frost',    // 12
  'Moon of Long Nights'     // 13
] as const;

/**
 * Get seasonal position description
 */
export function getSeasonalPosition(month: number, day: number): string {
  const weekOfMonth = Math.floor((day - 1) / 7);
  const weekNames = ['First', 'Second', 'Third', 'Fourth'];
  
  const monthName = NATURAL13_MONTH_NAMES[month - 1];
  const weekName = weekNames[weekOfMonth] || 'Unknown';
  
  return `${weekName} week of ${monthName}`;
}

/**
 * Get solar term (astronomical event) for a Gregorian date
 * Returns closest upcoming or current solar term
 */
export function getSolarTerm(date: Date): string | null {
  const month = date.getMonth() + 1; // 1-indexed
  const dayOfMonth = date.getDate();
  
  // Approximate solar term dates (±1 day variance)
  const solarTerms: Record<string, { month: number; day: number }> = {
    'Winter Solstice': { month: 12, day: 21 },
    'Imbolc': { month: 2, day: 2 },
    'Spring Equinox': { month: 3, day: 20 },
    'Beltane': { month: 5, day: 1 },
    'Summer Solstice': { month: 6, day: 21 },
    'Lughnasadh': { month: 8, day: 1 },
    'Autumn Equinox': { month: 9, day: 22 },
    'Samhain': { month: 10, day: 31 }
  };
  
  // Find matching or closest solar term
  for (const [name, { month: sMonth, day: sDay }] of Object.entries(solarTerms)) {
    if (month === sMonth && Math.abs(dayOfMonth - sDay) <= 2) {
      return name;
    }
  }
  
  return null;
}

/**
 * ============================================================================
 * VALIDATION & UTILITY
 * ============================================================================
 */

/**
 * Validate a Natural13Date object
 */
export function validateNatural13Date(date: Natural13Date): boolean {
  if (date.specialDay === 'Year Day' || date.specialDay === 'Leap Day') {
    return true;
  }
  
  if (date.month < 1 || date.month > 13) {
    return false;
  }
  
  if (date.day < 1 || date.day > 28) {
    return false;
  }
  
  if (date.year < 1900 || date.year > 2100) {
    return false;
  }
  
  return true;
}

/**
 * Check if two dates are the same in Natural13 calendar
 */
export function isSameNatural13Date(date1: Natural13Date, date2: Natural13Date): boolean {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
}

// All exports are defined inline above - no need for re-export
