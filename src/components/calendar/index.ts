/**
 * Calendar Components - Barrel Export
 * 
 * Phase 2 - UI Components for Dual Calendar System
 * 
 * Exports:
 * - DualCalendarGrid: Month view with Gregorian + Natural13 dates
 * - SeasonalWheel: Circular visualization of 13-month calendar
 * - LunarDisplay: Moon phase information and upcoming phases
 * - DateSelector: Interactive dual-calendar date picker
 * - EventOverlayManager: Event-to-calendar mapping UI
 */

export { DualCalendarGrid } from './DualCalendarGrid';
export { SeasonalWheel } from './SeasonalWheel';
export { LunarDisplay } from './LunarDisplay';
export { DateSelector } from './DateSelector';
export { EventOverlayManager } from './EventOverlayManager';

// Type re-exports (if needed by consumers)
export type { } from '@/types/calendar-systems';
