/**
 * @file RecurrenceService.ts - Sprint 4A Implementation
 * @description Service for managing recurring events and generating event instances
 * 
 * Features:
 * - Daily, weekly, monthly, yearly recurrence patterns
 * - Generate event instances for date ranges
 * - Update/delete single instances or all future
 * - Exception handling for skipped occurrences
 * 
 * @author Salatiso Ecosystem - Sprint 4A Calendar Enhancements
 * @created October 25, 2025
 */

import { EnhancedCalendarEvent } from '@/types/calendar';

/**
 * Recurrence frequency types
 */
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Recurrence pattern interface
 */
export interface RecurrencePattern {
  type: RecurrenceFrequency;
  interval: number; // Every N days/weeks/months/years
  endDate?: Date; // Optional end date for recurrence
  occurrences?: number; // Or max occurrences
  daysOfWeek?: number[]; // For weekly (0=Sun, 6=Sat)
  dayOfMonth?: number; // For monthly (1-31)
  monthOfYear?: number; // For yearly (1-12)
  exceptions?: Date[]; // Dates to skip
}

/**
 * Input for creating/updating recurrence
 */
export interface CreateRecurrenceInput {
  type: RecurrenceFrequency;
  interval?: number;
  endDate?: Date;
  occurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
}

/**
 * RecurringEvent interface (extends EnhancedCalendarEvent)
 */
export interface RecurringEvent extends EnhancedCalendarEvent {
  isRecurring: boolean;
  parentEventId?: string;
  recurrencePattern?: RecurrencePattern;
  instanceIndex?: number;
  instanceDate?: Date;
}

/**
 * RecurrenceService - Manages recurring events
 */
export class RecurrenceService {
  /**
   * Create a recurrence pattern
   */
  static createPattern(input: CreateRecurrenceInput): RecurrencePattern {
    return {
      type: input.type,
      interval: input.interval || 1,
      endDate: input.endDate,
      occurrences: input.occurrences,
      daysOfWeek: input.daysOfWeek,
      dayOfMonth: input.dayOfMonth,
      monthOfYear: input.monthOfYear,
      exceptions: [],
    };
  }

  /**
   * Generate event instances for a date range
   */
  static generateInstances(
    baseEvent: EnhancedCalendarEvent,
    pattern: RecurrencePattern,
    fromDate: Date,
    toDate: Date
  ): RecurringEvent[] {
    const instances: RecurringEvent[] = [];
    const eventTime = new Date(baseEvent.dateTime);
    const timeOfDay = {
      hours: eventTime.getHours(),
      minutes: eventTime.getMinutes(),
      seconds: eventTime.getSeconds(),
    };

    let currentDate = new Date(fromDate);
    let instanceCount = 0;

    while (currentDate <= toDate) {
      // Check end conditions
      if (pattern.endDate && currentDate > pattern.endDate) break;
      if (pattern.occurrences && instanceCount >= pattern.occurrences) break;

      // Check if this date should have an instance
      if (this.shouldGenerateInstanceForDate(currentDate, eventTime, pattern)) {
        // Check exceptions
        if (!this.isDateInExceptions(currentDate, pattern.exceptions || [])) {
          const instanceDateTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            timeOfDay.hours,
            timeOfDay.minutes,
            timeOfDay.seconds
          );

          // Create instance
          const instance: RecurringEvent = {
            ...baseEvent,
            id: `${baseEvent.id}_${instanceCount}`,
            parentEventId: baseEvent.id,
            isRecurring: true,
            recurrencePattern: pattern,
            instanceIndex: instanceCount,
            instanceDate: instanceDateTime,
            dateTime: instanceDateTime,
            title: baseEvent.title,
          };

          instances.push(instance);
          instanceCount++;
        }
      }

      // Move to next period
      currentDate = this.getNextPeriodDate(currentDate, pattern);
    }

    return instances;
  }

  /**
   * Check if a date should have an instance
   */
  private static shouldGenerateInstanceForDate(
    checkDate: Date,
    baseEventDate: Date,
    pattern: RecurrencePattern
  ): boolean {
    switch (pattern.type) {
      case 'daily':
        return this.isDailyRecurrence(checkDate, baseEventDate, pattern);

      case 'weekly':
        return this.isWeeklyRecurrence(checkDate, baseEventDate, pattern);

      case 'monthly':
        return this.isMonthlyRecurrence(checkDate, baseEventDate, pattern);

      case 'yearly':
        return this.isYearlyRecurrence(checkDate, baseEventDate, pattern);

      default:
        return false;
    }
  }

  /**
   * Check if date matches daily recurrence
   */
  private static isDailyRecurrence(
    checkDate: Date,
    baseDate: Date,
    pattern: RecurrencePattern
  ): boolean {
    const daysDiff = Math.floor(
      (checkDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff % (pattern.interval || 1) === 0;
  }

  /**
   * Check if date matches weekly recurrence
   */
  private static isWeeklyRecurrence(
    checkDate: Date,
    baseDate: Date,
    pattern: RecurrencePattern
  ): boolean {
    const daysOfWeek = pattern.daysOfWeek || [baseDate.getDay()];
    const checkDayOfWeek = checkDate.getDay();

    if (!daysOfWeek.includes(checkDayOfWeek)) {
      return false;
    }

    const weeksDiff = Math.floor(
      (checkDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    return weeksDiff % (pattern.interval || 1) === 0;
  }

  /**
   * Check if date matches monthly recurrence
   */
  private static isMonthlyRecurrence(
    checkDate: Date,
    baseDate: Date,
    pattern: RecurrencePattern
  ): boolean {
    const dayOfMonth = pattern.dayOfMonth || baseDate.getDate();

    // Try exact day of month
    if (checkDate.getDate() === dayOfMonth) {
      const monthsDiff = this.getMonthsDifference(checkDate, baseDate);
      return monthsDiff % (pattern.interval || 1) === 0;
    }

    // Handle end of month (e.g., 31st of Feb -> last day of Feb)
    if (dayOfMonth > 28) {
      const nextMonth = new Date(checkDate.getFullYear(), checkDate.getMonth() + 1, 0);
      if (checkDate.getDate() === nextMonth.getDate()) {
        const monthsDiff = this.getMonthsDifference(checkDate, baseDate);
        return monthsDiff % (pattern.interval || 1) === 0;
      }
    }

    return false;
  }

  /**
   * Check if date matches yearly recurrence
   */
  private static isYearlyRecurrence(
    checkDate: Date,
    baseDate: Date,
    pattern: RecurrencePattern
  ): boolean {
    const month = pattern.monthOfYear || baseDate.getMonth() + 1;
    const day = pattern.dayOfMonth || baseDate.getDate();

    if (
      checkDate.getMonth() + 1 === month &&
      checkDate.getDate() === day
    ) {
      const yearsDiff = checkDate.getFullYear() - baseDate.getFullYear();
      return yearsDiff % (pattern.interval || 1) === 0;
    }

    return false;
  }

  /**
   * Get next period date
   */
  private static getNextPeriodDate(
    currentDate: Date,
    pattern: RecurrencePattern
  ): Date {
    const next = new Date(currentDate);

    switch (pattern.type) {
      case 'daily':
        next.setDate(next.getDate() + (pattern.interval || 1));
        break;

      case 'weekly':
        next.setDate(next.getDate() + 7 * (pattern.interval || 1));
        break;

      case 'monthly':
        next.setMonth(next.getMonth() + (pattern.interval || 1));
        break;

      case 'yearly':
        next.setFullYear(next.getFullYear() + (pattern.interval || 1));
        break;
    }

    return next;
  }

  /**
   * Check if date is in exceptions
   */
  private static isDateInExceptions(checkDate: Date, exceptions: Date[]): boolean {
    return exceptions.some(
      excDate =>
        excDate.getDate() === checkDate.getDate() &&
        excDate.getMonth() === checkDate.getMonth() &&
        excDate.getFullYear() === checkDate.getFullYear()
    );
  }

  /**
   * Get difference in months between two dates
   */
  private static getMonthsDifference(date1: Date, date2: Date): number {
    return (
      (date1.getFullYear() - date2.getFullYear()) * 12 +
      (date1.getMonth() - date2.getMonth())
    );
  }

  /**
   * Check if event is recurring
   */
  static isRecurring(event: EnhancedCalendarEvent | RecurringEvent): boolean {
    return 'isRecurring' in event && event.isRecurring === true;
  }

  /**
   * Get next occurrence date
   */
  static getNextOccurrence(
    event: EnhancedCalendarEvent | RecurringEvent,
    fromDate: Date = new Date()
  ): Date | null {
    if (!this.isRecurring(event)) {
      return null;
    }

    const recurringEvent = event as RecurringEvent;
    if (!recurringEvent.recurrencePattern) {
      return null;
    }

    const pattern = recurringEvent.recurrencePattern;
    const baseEventDate = new Date(event.dateTime);

    // Check if pattern is already ended
    if (
      pattern.endDate &&
      fromDate > pattern.endDate
    ) {
      return null;
    }

    // Generate next instance
    const toDate = new Date(fromDate);
    toDate.setFullYear(toDate.getFullYear() + 2); // Look 2 years ahead

    const instances = this.generateInstances(
      event,
      pattern,
      fromDate,
      toDate
    );

    return instances.length > 0 ? new Date(instances[0].dateTime) : null;
  }

  /**
   * Add exception to pattern (skip specific date)
   */
  static addException(pattern: RecurrencePattern, exceptionDate: Date): void {
    if (!pattern.exceptions) {
      pattern.exceptions = [];
    }

    if (!this.isDateInExceptions(exceptionDate, pattern.exceptions)) {
      pattern.exceptions.push(exceptionDate);
    }
  }

  /**
   * Remove exception from pattern
   */
  static removeException(pattern: RecurrencePattern, exceptionDate: Date): void {
    if (!pattern.exceptions) return;

    pattern.exceptions = pattern.exceptions.filter(
      excDate =>
        !(
          excDate.getDate() === exceptionDate.getDate() &&
          excDate.getMonth() === exceptionDate.getMonth() &&
          excDate.getFullYear() === exceptionDate.getFullYear()
        )
    );
  }

  /**
   * Format recurrence pattern for display
   */
  static formatPattern(pattern: RecurrencePattern): string {
    let desc = `Every ${pattern.interval || 1} `;

    switch (pattern.type) {
      case 'daily':
        desc += pattern.interval === 1 ? 'day' : 'days';
        break;
      case 'weekly':
        desc += pattern.interval === 1 ? 'week' : 'weeks';
        if (pattern.daysOfWeek) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          desc += ` on ${pattern.daysOfWeek.map(d => days[d]).join(', ')}`;
        }
        break;
      case 'monthly':
        desc += pattern.interval === 1 ? 'month' : 'months';
        if (pattern.dayOfMonth) {
          desc += ` on day ${pattern.dayOfMonth}`;
        }
        break;
      case 'yearly':
        desc += pattern.interval === 1 ? 'year' : 'years';
        break;
    }

    if (pattern.endDate) {
      desc += ` until ${pattern.endDate.toLocaleDateString()}`;
    } else if (pattern.occurrences) {
      desc += ` for ${pattern.occurrences} occurrences`;
    }

    return desc;
  }
}

export default RecurrenceService;
