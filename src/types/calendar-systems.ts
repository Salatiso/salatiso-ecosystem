/**
 * @file calendar-systems.ts
 * @description Type definitions for dual calendar system
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1 - Foundation
 */

// ============================================================================
// CALENDAR SYSTEM TYPES
// ============================================================================

export type CalendarType = 'solar' | 'lunar' | 'lunisolar' | 'seasonal';

export interface CalendarConfig {
  daysPerYear: number;
  monthsPerYear: number;
  daysPerMonth: number | number[]; // Fixed or variable
  weekDaysPerMonth?: number;
  intercalationRules: IntercalationRule[];
  yearStartAlignment: 'solstice' | 'equinox' | 'lunar' | 'fixed';
}

export interface IntercalationRule {
  type: 'leap_day' | 'leap_month' | 'intercalary_period';
  frequency: string; // e.g., "every 4 years"
  insertionPoint: string; // e.g., "after month 6"
  duration: number; // days
}

export interface CulturalOrigin {
  regions: string[]; // ['Southern Africa', 'Khoisan', 'Bantu']
  description: string;
  references: string[]; // Academic sources
}

export interface CalendarSystem {
  id: string; // 'gregorian', 'natural13', 'lunar', 'mayan', etc.
  name: string;
  displayName: string; // Localized
  type: CalendarType;
  config: CalendarConfig;
  culturalOrigin?: CulturalOrigin;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDefault: boolean;
}

// ============================================================================
// CALENDAR OVERLAY TYPES
// ============================================================================

export interface ConvertedDate {
  year: number;
  month: number; // Or month name
  day: number;
  dayOfWeek?: number;
  seasonalPosition?: string; // "3rd day of Planting Moon"
  monthName?: string; // Localized month name
  weekOfMonth?: number;
}

export type LunarPhaseName = 
  | 'new' 
  | 'waxing_crescent' 
  | 'first_quarter' 
  | 'waxing_gibbous'
  | 'full' 
  | 'waning_gibbous' 
  | 'last_quarter' 
  | 'waning_crescent';

export interface LunarPhase {
  phase: LunarPhaseName;
  illumination: number; // 0-100%
  age: number; // Days since new moon
}

export interface CalendarOverlay {
  id: string;
  eventId: string; // Links to EnhancedCalendarEvent
  calendarSystemId: string;
  
  // Converted date in overlay system
  convertedDate: ConvertedDate;
  
  // Astronomical data
  lunarPhase?: LunarPhase;
  
  // Seasonal alignment
  seasonalMarkers?: string[]; // IDs of relevant markers
  solarTerm?: string; // For East Asian calendars
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SEASONAL MARKER TYPES
// ============================================================================

export type SeasonalMarkerType = 
  | 'lunar' 
  | 'solar' 
  | 'biological' 
  | 'cultural' 
  | 'agricultural';

export interface MarkerTiming {
  fixedDate?: { month: number; day: number }; // For solar markers
  lunarPhase?: LunarPhaseName; // For lunar markers
  astronomicalEvent?: 'solstice' | 'equinox' | 'cross_quarter';
  ecologicalTrigger?: string; // "First frost", "Flowering of Marula"
}

export interface CulturalSignificance {
  origin: string[]; // ['Khoisan', 'San']
  description: string;
  traditionalActivities: string[];
  biologicalAlignment: string[]; // ['Gestation peak', 'Migration']
}

export interface SeasonalMarker {
  id: string;
  calendarSystemId: string;
  
  name: string; // "Green Corn Moon"
  localizedNames: Record<string, string>; // Multi-language
  
  type: SeasonalMarkerType;
  
  // Timing
  timing: MarkerTiming;
  
  // Cultural context
  culturalSignificance: CulturalSignificance;
  
  // Visual representation
  icon?: string;
  color?: string;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// NATURAL 13-MONTH SPECIFIC TYPES
// ============================================================================

export interface Natural13Date extends ConvertedDate {
  specialDay?: 'Year Day' | 'Leap Day'; // Intercalary days
}

export const NATURAL13_MONTH_NAMES = [
  'Moon of Renewal',
  'Moon of Deep Cold',
  'Moon of Awakening',
  'Moon of First Growth',
  'Moon of Planting',
  'Moon of First Rains',
  'Moon of Long Days',
  'Moon of First Harvest',
  'Moon of Ripening',
  'Moon of Gathering',
  'Moon of Falling Leaves',
  'Moon of First Frost',
  'Moon of Long Nights'
] as const;

export type Natural13MonthName = typeof NATURAL13_MONTH_NAMES[number];

// ============================================================================
// ENHANCED EVENT TYPE (Extension)
// ============================================================================

export interface SeasonalContext {
  markers: string[]; // Relevant seasonal markers
  lunarPhase: LunarPhaseName;
  biologicalCycle?: string;
}

export interface EnhancedCalendarEventExtension {
  // Add to existing EnhancedCalendarEvent interface
  calendarOverlays?: CalendarOverlay[];
  primaryCalendarSystem?: string; // Default: 'gregorian'
  seasonalContext?: SeasonalContext;
  displayInCalendars?: string[]; // Which calendars to show event in
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface DateConversionResult {
  success: boolean;
  date?: ConvertedDate;
  error?: string;
}

export interface LunarCalculationResult {
  success: boolean;
  phase?: LunarPhase;
  error?: string;
}

export interface CalendarSystemSelector {
  activeSystem: string;
  availableSystems: CalendarSystem[];
  overlayMode: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CALENDAR_SYSTEM_IDS = {
  GREGORIAN: 'gregorian',
  NATURAL13: 'natural13',
  LUNAR: 'lunar',
  MAYAN: 'mayan',
  CHINESE: 'chinese',
  ISLAMIC: 'islamic'
} as const;

export const LUNAR_PHASES: Record<LunarPhaseName, { icon: string; name: string }> = {
  new: { icon: '🌑', name: 'New Moon' },
  waxing_crescent: { icon: '🌒', name: 'Waxing Crescent' },
  first_quarter: { icon: '🌓', name: 'First Quarter' },
  waxing_gibbous: { icon: '🌔', name: 'Waxing Gibbous' },
  full: { icon: '🌕', name: 'Full Moon' },
  waning_gibbous: { icon: '🌖', name: 'Waning Gibbous' },
  last_quarter: { icon: '🌗', name: 'Last Quarter' },
  waning_crescent: { icon: '🌘', name: 'Waning Crescent' }
};

export const SOLAR_TERMS = {
  WINTER_SOLSTICE: 'winter_solstice',
  IMBOLC: 'imbolc',
  SPRING_EQUINOX: 'spring_equinox',
  BELTANE: 'beltane',
  SUMMER_SOLSTICE: 'summer_solstice',
  LUGHNASADH: 'lughnasadh',
  AUTUMN_EQUINOX: 'autumn_equinox',
  SAMHAIN: 'samhain'
} as const;

// ============================================================================
// FIRESTORE COLLECTION NAMES
// ============================================================================

export const FIRESTORE_COLLECTIONS = {
  CALENDAR_SYSTEMS: 'calendarSystems',
  CALENDAR_OVERLAYS: 'calendarOverlays',
  SEASONAL_MARKERS: 'seasonalMarkers'
} as const;

// ============================================================================
// All types are already exported inline above
// ============================================================================
