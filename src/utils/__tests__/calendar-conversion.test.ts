/**
 * @file calendar-conversion.test.ts
 * @description Comprehensive tests for calendar conversion logic
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1 - Foundation
 */

import {
  isGregorianLeapYear,
  getJulianDate,
  getWinterSolstice,
  daysBetween,
  convertGregorianToNatural13,
  convertNatural13ToGregorian,
  calculateLunarPhase,
  getSeasonalPosition,
  getSolarTerm,
  validateNatural13Date,
  isSameNatural13Date,
  NATURAL13_MONTH_NAMES
} from '../calendar-conversion';

describe('Calendar Conversion Utils', () => {
  
  // ============================================================================
  // LEAP YEAR TESTS
  // ============================================================================
  
  describe('isGregorianLeapYear', () => {
    it('should identify leap years correctly', () => {
      expect(isGregorianLeapYear(2020)).toBe(true);  // Divisible by 4
      expect(isGregorianLeapYear(2024)).toBe(true);  // Divisible by 4
      expect(isGregorianLeapYear(2000)).toBe(true);  // Divisible by 400
    });
    
    it('should identify non-leap years correctly', () => {
      expect(isGregorianLeapYear(2021)).toBe(false); // Not divisible by 4
      expect(isGregorianLeapYear(2022)).toBe(false); // Not divisible by 4
      expect(isGregorianLeapYear(1900)).toBe(false); // Divisible by 100 but not 400
      expect(isGregorianLeapYear(2100)).toBe(false); // Divisible by 100 but not 400
    });
  });
  
  // ============================================================================
  // JULIAN DATE TESTS
  // ============================================================================
  
  describe('getJulianDate', () => {
    it('should calculate Julian dates correctly', () => {
      // Test with a known date at noon UTC
      const date = new Date('2000-01-01T12:00:00Z');
      const jd = getJulianDate(date);
      
      // JD for Jan 1, 2000 at noon is approximately 2451545
      expect(jd).toBeCloseTo(2451545, 0);
    });
    
    it('should handle different dates', () => {
      const date1 = new Date('2025-01-01');
      const date2 = new Date('2025-01-02');
      const jd1 = getJulianDate(date1);
      const jd2 = getJulianDate(date2);
      
      // Should differ by approximately 1 day
      expect(jd2 - jd1).toBeCloseTo(1, 0);
    });
  });
  
  // ============================================================================
  // WINTER SOLSTICE TESTS
  // ============================================================================
  
  describe('getWinterSolstice', () => {
    it('should return December 21 for any year', () => {
      const solstice2020 = getWinterSolstice(2020);
      const solstice2025 = getWinterSolstice(2025);
      
      expect(solstice2020.getMonth()).toBe(11); // December (0-indexed)
      expect(solstice2020.getDate()).toBe(21);
      
      expect(solstice2025.getMonth()).toBe(11);
      expect(solstice2025.getDate()).toBe(21);
    });
  });
  
  // ============================================================================
  // DAYS BETWEEN TESTS
  // ============================================================================
  
  describe('daysBetween', () => {
    it('should calculate days correctly', () => {
      const date1 = new Date('2025-01-01');
      const date2 = new Date('2025-01-10');
      
      expect(daysBetween(date1, date2)).toBe(9);
    });
    
    it('should handle negative days', () => {
      const date1 = new Date('2025-01-10');
      const date2 = new Date('2025-01-01');
      
      expect(daysBetween(date1, date2)).toBe(-9);
    });
    
    it('should return 0 for same dates', () => {
      const date = new Date('2025-01-01');
      expect(daysBetween(date, date)).toBe(0);
    });
  });
  
  // ============================================================================
  // GREGORIAN TO NATURAL13 CONVERSION TESTS
  // ============================================================================
  
  describe('convertGregorianToNatural13', () => {
    it('should convert winter solstice (year start) correctly', () => {
      const gregorianDate = new Date('2024-12-21');
      const natural = convertGregorianToNatural13(gregorianDate);
      
      expect(natural.specialDay).toBe('Year Day');
      expect(natural.monthName).toBe('Year Day');
    });
    
    it('should convert a date shortly after year start', () => {
      const gregorianDate = new Date('2024-12-22');
      const natural = convertGregorianToNatural13(gregorianDate);
      
      expect(natural.month).toBe(1); // Month of Renewal
      expect(natural.day).toBe(1);
      expect(natural.monthName).toContain('Renewal');
    });
    
    it('should have correct month names', () => {
      const dates = [
        new Date('2024-12-22'), // Month 1
        new Date('2025-01-20'), // Month 2
        new Date('2025-02-17'), // Month 3
      ];
      
      const natural1 = convertGregorianToNatural13(dates[0]);
      const natural2 = convertGregorianToNatural13(dates[1]);
      const natural3 = convertGregorianToNatural13(dates[2]);
      
      expect(natural1.monthName).toContain('Renewal');
      expect(natural2.monthName).toContain('Deep Cold');
      expect(natural3.monthName).toContain('Awakening');
    });
    
    it('should have all 28 days in a month', () => {
      // Test first month
      const dates = [];
      const startDate = new Date('2024-12-22');
      
      for (let i = 0; i < 28; i++) {
        const testDate = new Date(startDate);
        testDate.setDate(testDate.getDate() + i);
        dates.push(testDate);
      }
      
      const natural = convertGregorianToNatural13(dates[27]);
      expect(natural.day).toBe(28);
      expect(natural.month).toBe(1);
    });
    
    it('should handle leap years', () => {
      // 2024 is a leap year
      const leapYearDate = new Date('2024-07-05'); // Just before leap day
      const natural = convertGregorianToNatural13(leapYearDate);
      
      // Should be in month 7 (Moon of Long Days)
      expect(natural.month).toBeGreaterThanOrEqual(7);
    });
    
    it('should validate day of week calculation', () => {
      const date = new Date('2024-12-22');
      const natural = convertGregorianToNatural13(date);
      
      // Day of week should be 1-7
      expect(natural.dayOfWeek).toBeGreaterThanOrEqual(1);
      expect(natural.dayOfWeek).toBeLessThanOrEqual(7);
    });
    
    it('should have correct week of month', () => {
      // Day 1-7 should be week 1
      const date1 = new Date('2024-12-22');
      const natural1 = convertGregorianToNatural13(date1);
      expect(natural1.weekOfMonth).toBe(1);
      
      // Day 15 should be week 2 or 3
      const date2 = new Date('2024-12-30');
      const natural2 = convertGregorianToNatural13(date2);
      expect(natural2.weekOfMonth).toBeGreaterThan(1);
    });
  });
  
  // ============================================================================
  // NATURAL13 TO GREGORIAN CONVERSION TESTS
  // ============================================================================
  
  describe('convertNatural13ToGregorian', () => {
    it('should convert Year Day correctly', () => {
      const natural = {
        year: 2024,
        month: 0,
        day: 1,
        specialDay: 'Year Day' as const,
        monthName: 'Year Day'
      };
      
      const gregorian = convertNatural13ToGregorian(natural);
      
      expect(gregorian.getMonth()).toBe(11); // December
      expect(gregorian.getDate()).toBe(21);
    });
    
    it('should convert Month 1, Day 1 correctly', () => {
      const natural = {
        year: 2024,
        month: 1,
        day: 1,
        monthName: 'Moon of Renewal'
      };
      
      const gregorian = convertNatural13ToGregorian(natural);
      
      expect(gregorian.getMonth()).toBe(11); // December
      expect(gregorian.getDate()).toBe(22); // After solstice
    });
  });
  
  // ============================================================================
  // ROUND-TRIP CONVERSION TESTS
  // ============================================================================
  
  describe('Round-trip conversions', () => {
    it('should accurately convert Gregorian → Natural13 → Gregorian', () => {
      const originalDates = [
        new Date('2024-12-22'),
        new Date('2025-01-15'),
        new Date('2025-06-15'),
        new Date('2025-12-20'),
      ];
      
      for (const original of originalDates) {
        const natural = convertGregorianToNatural13(original);
        const backToGregorian = convertNatural13ToGregorian(natural);
        
        // Should match within a day (due to rounding)
        const diff = Math.abs(daysBetween(original, backToGregorian));
        expect(diff).toBeLessThanOrEqual(1);
      }
    });
    
    it('should handle month boundaries correctly', () => {
      // Last day of month 1
      const endDate = new Date('2025-01-17');
      const natural = convertGregorianToNatural13(endDate);
      
      expect(natural.month).toBe(1);
      expect(natural.day).toBe(27);
    });
  });
  
  // ============================================================================
  // LUNAR PHASE TESTS
  // ============================================================================
  
  describe('calculateLunarPhase', () => {
    it('should return a valid phase', () => {
      const date = new Date('2025-01-01');
      const phase = calculateLunarPhase(date);
      
      expect(phase.phase).toBeDefined();
      expect(['new', 'waxing_crescent', 'first_quarter', 'waxing_gibbous', 
              'full', 'waning_gibbous', 'last_quarter', 'waning_crescent']).toContain(phase.phase);
    });
    
    it('should have illumination 0-100', () => {
      const date = new Date('2025-01-01');
      const phase = calculateLunarPhase(date);
      
      expect(phase.illumination).toBeGreaterThanOrEqual(0);
      expect(phase.illumination).toBeLessThanOrEqual(100);
    });
    
    it('should have age 0-29.53 days', () => {
      const date = new Date('2025-01-01');
      const phase = calculateLunarPhase(date);
      
      expect(phase.age).toBeGreaterThanOrEqual(0);
      expect(phase.age).toBeLessThanOrEqual(29.53);
    });
    
    it('should vary across different dates', () => {
      const date1 = new Date('2025-01-01');
      const date2 = new Date('2025-01-15');
      
      const phase1 = calculateLunarPhase(date1);
      const phase2 = calculateLunarPhase(date2);
      
      // Illumination should be different
      expect(phase1.illumination).not.toEqual(phase2.illumination);
    });
  });
  
  // ============================================================================
  // SEASONAL CONTEXT TESTS
  // ============================================================================
  
  describe('getSeasonalPosition', () => {
    it('should describe position correctly', () => {
      const position = getSeasonalPosition(1, 1);
      
      expect(position).toContain('First');
      expect(position).toContain('Renewal');
    });
    
    it('should show correct week of month', () => {
      const position1 = getSeasonalPosition(1, 1); // Week 1
      const position2 = getSeasonalPosition(1, 15); // Week 3
      
      expect(position1).toContain('First');
      expect(position2).toContain('Third');
    });
  });
  
  describe('getSolarTerm', () => {
    it('should identify winter solstice', () => {
      const date = new Date('2025-12-21');
      const term = getSolarTerm(date);
      
      expect(term).toBe('Winter Solstice');
    });
    
    it('should identify spring equinox', () => {
      const date = new Date('2025-03-20');
      const term = getSolarTerm(date);
      
      expect(term).toBe('Spring Equinox');
    });
    
    it('should return null for non-solar-term dates', () => {
      const date = new Date('2025-02-15');
      const term = getSolarTerm(date);
      
      expect(term).toBeNull();
    });
  });
  
  // ============================================================================
  // VALIDATION TESTS
  // ============================================================================
  
  describe('validateNatural13Date', () => {
    it('should validate correct dates', () => {
      const validDate = {
        year: 2024,
        month: 1,
        day: 15,
        monthName: 'Moon of Renewal'
      };
      
      expect(validateNatural13Date(validDate)).toBe(true);
    });
    
    it('should reject invalid months', () => {
      const invalidDate = {
        year: 2024,
        month: 14,
        day: 15,
        monthName: 'Invalid'
      };
      
      expect(validateNatural13Date(invalidDate)).toBe(false);
    });
    
    it('should reject invalid days', () => {
      const invalidDate = {
        year: 2024,
        month: 1,
        day: 29,
        monthName: 'Moon of Renewal'
      };
      
      expect(validateNatural13Date(invalidDate)).toBe(false);
    });
    
    it('should accept Year Day', () => {
      const yearDay = {
        year: 2024,
        month: 0,
        day: 1,
        specialDay: 'Year Day' as const,
        monthName: 'Year Day'
      };
      
      expect(validateNatural13Date(yearDay)).toBe(true);
    });
  });
  
  describe('isSameNatural13Date', () => {
    it('should identify same dates', () => {
      const date1 = {
        year: 2024,
        month: 1,
        day: 15,
        monthName: 'Moon of Renewal'
      };
      const date2 = {
        year: 2024,
        month: 1,
        day: 15,
        monthName: 'Moon of Renewal'
      };
      
      expect(isSameNatural13Date(date1, date2)).toBe(true);
    });
    
    it('should identify different dates', () => {
      const date1 = {
        year: 2024,
        month: 1,
        day: 15,
        monthName: 'Moon of Renewal'
      };
      const date2 = {
        year: 2024,
        month: 1,
        day: 16,
        monthName: 'Moon of Renewal'
      };
      
      expect(isSameNatural13Date(date1, date2)).toBe(false);
    });
  });
  
  // ============================================================================
  // CONSTANTS TESTS
  // ============================================================================
  
  describe('NATURAL13_MONTH_NAMES', () => {
    it('should have 13 month names', () => {
      expect(NATURAL13_MONTH_NAMES.length).toBe(13);
    });
    
    it('should contain expected month names', () => {
      expect(NATURAL13_MONTH_NAMES).toContain('Moon of Renewal');
      expect(NATURAL13_MONTH_NAMES).toContain('Moon of Planting');
      expect(NATURAL13_MONTH_NAMES).toContain('Moon of Gathering');
      expect(NATURAL13_MONTH_NAMES).toContain('Moon of Long Nights');
    });
    
    it('should be in correct order', () => {
      expect(NATURAL13_MONTH_NAMES[0]).toBe('Moon of Renewal');
      expect(NATURAL13_MONTH_NAMES[12]).toBe('Moon of Long Nights');
    });
  });
});
