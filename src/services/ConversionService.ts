/**
 * @file ConversionService.ts
 * @description Service layer for calendar conversions with caching
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1 - Foundation
 */

import {
  convertGregorianToNatural13,
  convertNatural13ToGregorian,
  calculateLunarPhase,
  getSolarTerm,
  validateNatural13Date
} from '@/utils/calendar-conversion';
import { Natural13Date, LunarPhase, LunarPhaseName } from '@/types/calendar-systems';

/**
 * Conversion Service
 * Manages calendar system conversions with caching for performance
 */
export class ConversionService {
  // Simple in-memory cache for conversions
  private static readonly conversionCache = new Map<string, Natural13Date>();
  private static readonly lunarPhaseCache = new Map<string, LunarPhase>();
  private static readonly MAX_CACHE_SIZE = 500;

  /**
   * Clear the conversion cache
   */
  static clearCache(): void {
    this.conversionCache.clear();
    this.lunarPhaseCache.clear();
  }

  /**
   * Generate cache key for a Gregorian date
   */
  private static getCacheKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  /**
   * Convert Gregorian date to Natural 13-Month calendar with caching
   */
  static toNatural13(gregorianDate: Date): Natural13Date {
    const cacheKey = this.getCacheKey(gregorianDate);
    
    // Check cache
    if (this.conversionCache.has(cacheKey)) {
      return this.conversionCache.get(cacheKey)!;
    }

    // Perform conversion
    const result = convertGregorianToNatural13(gregorianDate);

    // Cache the result
    if (this.conversionCache.size < this.MAX_CACHE_SIZE) {
      this.conversionCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Convert Natural 13-Month date to Gregorian calendar
   */
  static toGregorian(natural13Date: Natural13Date): Date {
    return convertNatural13ToGregorian(natural13Date);
  }

  /**
   * Get lunar phase for a date with caching
   */
  static getLunarPhase(date: Date): LunarPhase {
    const cacheKey = `lunar-${this.getCacheKey(date)}`;
    
    // Check cache
    if (this.lunarPhaseCache.has(cacheKey)) {
      return this.lunarPhaseCache.get(cacheKey)!;
    }

    // Calculate phase
    const phase = calculateLunarPhase(date);

    // Cache the result
    if (this.lunarPhaseCache.size < this.MAX_CACHE_SIZE) {
      this.lunarPhaseCache.set(cacheKey, phase);
    }

    return phase;
  }

  /**
   * Get solar term (solstice/equinox) for a Natural13 date
   */
  static getSolarTerm(natural13Date: Natural13Date): string | null {
    const gregorianDate = this.toGregorian(natural13Date);
    return getSolarTerm(gregorianDate);
  }

  /**
   * Convert and validate a Natural 13-Month date
   */
  static validateAndConvert(natural13Date: Natural13Date): {
    isValid: boolean;
    error?: string;
    gregorianDate?: Date;
  } {
    // Validate
    if (!validateNatural13Date(natural13Date)) {
      return {
        isValid: false,
        error: `Invalid Natural13 date: ${JSON.stringify(natural13Date)}`
      };
    }

    // Convert
    try {
      const gregorianDate = this.toGregorian(natural13Date);
      return {
        isValid: true,
        gregorianDate
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Batch convert multiple Gregorian dates
   */
  static batchToNatural13(dates: Date[]): Natural13Date[] {
    return dates.map(date => this.toNatural13(date));
  }

  /**
   * Batch convert multiple Natural13 dates
   */
  static batchToGregorian(natural13Dates: Natural13Date[]): Date[] {
    return natural13Dates.map(date => this.toGregorian(date));
  }

  /**
   * Get lunar phases for multiple dates
   */
  static batchGetLunarPhases(dates: Date[]): LunarPhase[] {
    return dates.map(date => this.getLunarPhase(date));
  }

  /**
   * Get date range in Natural13 calendar
   * Returns all Natural13 dates between two Gregorian dates
   */
  static getDateRange(
    startDate: Date,
    endDate: Date,
    includeMetadata: boolean = false
  ): (Natural13Date | { date: Natural13Date; lunar: LunarPhase; solar?: string })[] {
    const results = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const natural13 = this.toNatural13(current);

      if (includeMetadata) {
        results.push({
          date: natural13,
          lunar: this.getLunarPhase(current),
          solar: this.getSolarTerm(natural13) || undefined
        });
      } else {
        results.push(natural13);
      }

      // Move to next day
      current.setDate(current.getDate() + 1);
    }

    return results;
  }

  /**
   * Round-trip conversion verification
   * Converts Gregorian → Natural13 → Gregorian and checks accuracy
   */
  static verifyRoundTrip(originalDate: Date): {
    success: boolean;
    daysDifference: number;
  } {
    const natural13 = this.toNatural13(originalDate);
    const reconstructed = this.toGregorian(natural13);
    
    // Calculate days difference
    const timeDiff = Math.abs(reconstructed.getTime() - originalDate.getTime());
    const daysDifference = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return {
      success: daysDifference === 0,
      daysDifference
    };
  }

  /**
   * Get seasonal context for a date
   */
  static getSeasonalContext(date: Date): {
    natural13Date: Natural13Date;
    lunarPhase: LunarPhase;
    solarTerm: string | null;
    season: string;
  } {
    const natural13Date = this.toNatural13(date);
    const lunarPhase = this.getLunarPhase(date);
    const solarTerm = this.getSolarTerm(natural13Date);
    
    // Determine season from month
    const season = this.getSeasonFromMonth(natural13Date.month);

    return {
      natural13Date,
      lunarPhase,
      solarTerm,
      season
    };
  }

  /**
   * Helper: Get season name from month
   */
  private static getSeasonFromMonth(month: number): string {
    const seasons = [
      'Winter Renewal', // Months 1-3
      'Spring Awakening', // Months 4-6
      'Summer Abundance', // Months 7-9
      'Autumn Gratitude' // Months 10-13
    ];

    const seasonIndex = Math.floor((month - 1) / 3.25);
    return seasons[Math.min(seasonIndex, 3)];
  }
}
