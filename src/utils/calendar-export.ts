/**
 * @file calendar-export.ts - Sprint 4A Implementation
 * @description Calendar export utilities for iCal, JSON, CSV formats
 * 
 * Features:
 * - RFC 5545 compliant iCalendar format
 * - JSON export for data backup
 * - CSV export for spreadsheets
 * - Auto-download functionality
 * - Support for recurring events
 * 
 * @author Salatiso Ecosystem - Sprint 4A Calendar Enhancements
 * @created October 25, 2025
 */

import { EnhancedCalendarEvent, EventType, EventStatus } from '@/types/calendar';

/**
 * CalendarExportService - Export calendar events to various formats
 */
export class CalendarExportService {
  /**
   * Export events to iCalendar (.ics) format (RFC 5545)
   */
  static exportToICalFormat(events: EnhancedCalendarEvent[]): string {
    const lines: string[] = [];

    // iCalendar header
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//Salatiso Ecosystem//Calendar//EN');
    lines.push(`CALSCALE:GREGORIAN`);
    lines.push(`METHOD:PUBLISH`);
    lines.push(`X-WR-CALNAME:Salatiso Calendar`);
    lines.push(`X-WR-TIMEZONE:UTC`);

    // Add events
    for (const event of events) {
      lines.push(this.generateICalEvent(event));
    }

    // iCalendar footer
    lines.push('END:VCALENDAR');

    return lines.join('\r\n');
  }

  /**
   * Generate single iCal event entry
   */
  private static generateICalEvent(event: EnhancedCalendarEvent): string {
    const lines: string[] = [];

    lines.push('BEGIN:VEVENT');

    // Required properties
    lines.push(`UID:${event.id}@salatiso.com`);
    lines.push(`DTSTAMP:${this.formatICalDate(new Date())}`);

    // Date/time
    const startTime = new Date(event.dateTime);
    lines.push(`DTSTART:${this.formatICalDate(startTime)}`);

    // For now, use 1-hour default duration (no endDateTime on event)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    lines.push(`DTEND:${this.formatICalDate(endTime)}`);

    // Summary (title)
    lines.push(`SUMMARY:${this.escapeICalText(event.title)}`);

    // Description
    if (event.description) {
      lines.push(`DESCRIPTION:${this.escapeICalText(event.description)}`);
    }

    // Location
    if (event.location) {
      lines.push(`LOCATION:${this.escapeICalText(event.location)}`);
    }

    // Category (event type)
    lines.push(`CATEGORIES:${event.type.toUpperCase()}`);

    // Status mapping
    const statusMap: Record<string, string> = {
      PLANNED: 'TENTATIVE',
      OPEN: 'CONFIRMED',
      IN_PROGRESS: 'CONFIRMED',
      RESOLVED: 'COMPLETED',
      ARCHIVED: 'CANCELLED',
    };
    const iCalStatus = statusMap[event.status] || 'CONFIRMED';
    lines.push(`STATUS:${iCalStatus}`);

    // Priority (map from severity if incident)
    if (event.type === EventType.INCIDENT && event.incidentData?.severity) {
      const severityMap: Record<string, number> = {
        LOW: 7,
        MEDIUM: 5,
        HIGH: 3,
        CRITICAL: 1,
      };
      const priority = severityMap[event.incidentData.severity] || 5;
      lines.push(`PRIORITY:${priority}`);
    }

    // Attendees (roles)
    if (event.roles && event.roles.length > 0) {
      for (const role of event.roles) {
        lines.push(
          `ATTENDEE;CN=${this.escapeICalText(role.userId)}:${role.userId}`
        );
      }
    }

    // Recurrence rule (if applicable)
    if ('recurrencePattern' in event && event.recurrencePattern) {
      lines.push(this.generateRRuleFromPattern(event.recurrencePattern));
    }

    // Last modified
    lines.push(`LAST-MODIFIED:${this.formatICalDate(new Date(event.updatedAt))}`);

    // Created
    lines.push(`CREATED:${this.formatICalDate(new Date(event.createdAt))}`);

    // Custom properties
    lines.push(`X-SALATISO-CONTEXT:${event.context}`);
    lines.push(`X-SALATISO-TYPE:${event.type}`);

    lines.push('END:VEVENT');

    return lines.join('\r\n');
  }

  /**
   * Generate RRULE from recurrence pattern
   */
  private static generateRRuleFromPattern(pattern: any): string {
    let rrule = `RRULE:FREQ=${pattern.type.toUpperCase()}`;

    if (pattern.interval && pattern.interval > 1) {
      rrule += `;INTERVAL=${pattern.interval}`;
    }

    if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
      const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      const days = pattern.daysOfWeek.map(d => dayMap[d]).join(',');
      rrule += `;BYDAY=${days}`;
    }

    if (pattern.dayOfMonth) {
      rrule += `;BYMONTHDAY=${pattern.dayOfMonth}`;
    }

    if (pattern.monthOfYear) {
      rrule += `;BYMONTH=${pattern.monthOfYear}`;
    }

    if (pattern.endDate) {
      rrule += `;UNTIL=${this.formatICalDate(pattern.endDate)}`;
    }

    if (pattern.occurrences) {
      rrule += `;COUNT=${pattern.occurrences}`;
    }

    return rrule;
  }

  /**
   * Format date for iCalendar (RFC 5545 format: 20251025T140000Z)
   */
  private static formatICalDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  /**
   * Escape special characters in iCalendar text
   */
  private static escapeICalText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n');
  }

  /**
   * Export events to JSON format
   */
  static exportToJSON(events: EnhancedCalendarEvent[]): string {
    const exportData = {
      exportedAt: new Date().toISOString(),
      eventCount: events.length,
      events: events.map(event => ({
        ...event,
        dateTime: event.dateTime instanceof Date ? event.dateTime.toISOString() : event.dateTime,
        createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
        updatedAt: event.updatedAt instanceof Date ? event.updatedAt.toISOString() : event.updatedAt,
      })),
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export events to CSV format
   */
  static exportToCSV(events: EnhancedCalendarEvent[]): string {
    const headers = [
      'ID',
      'Title',
      'Description',
      'Date/Time',
      'End Date/Time',
      'Location',
      'Type',
      'Status',
      'Category',
      'Context',
      'Created By',
      'Created At',
    ];

    const rows = events.map(event => [
      event.id,
      this.escapeCsvField(event.title),
      this.escapeCsvField(event.description || ''),
      new Date(event.dateTime).toLocaleString(),
      '', // No end datetime on event
      this.escapeCsvField(event.location || ''),
      event.type,
      event.status,
      event.category || '',
      event.context,
      event.organizer || '',
      new Date(event.createdAt).toLocaleString(),
    ]);

    // Combine headers and rows
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Escape CSV field values
   */
  private static escapeCsvField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  /**
   * Download file to client
   */
  static downloadFile(content: string, filename: string, mimeType: string): void {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[CalendarExportService] Download error:', error);
    }
  }

  /**
   * Export and download as iCal file
   */
  static downloadAsICal(events: EnhancedCalendarEvent[], filename?: string): void {
    const content = this.exportToICalFormat(events);
    const downloadFilename = filename || `calendar-${new Date().toISOString().split('T')[0]}.ics`;
    this.downloadFile(content, downloadFilename, 'text/calendar');
  }

  /**
   * Export and download as JSON file
   */
  static downloadAsJSON(events: EnhancedCalendarEvent[], filename?: string): void {
    const content = this.exportToJSON(events);
    const downloadFilename = filename || `calendar-${new Date().toISOString().split('T')[0]}.json`;
    this.downloadFile(content, downloadFilename, 'application/json');
  }

  /**
   * Export and download as CSV file
   */
  static downloadAsCSV(events: EnhancedCalendarEvent[], filename?: string): void {
    const content = this.exportToCSV(events);
    const downloadFilename = filename || `calendar-${new Date().toISOString().split('T')[0]}.csv`;
    this.downloadFile(content, downloadFilename, 'text/csv');
  }

  /**
   * Get file size in human-readable format
   */
  static getFileSizeEstimate(events: EnhancedCalendarEvent[], format: 'ical' | 'json' | 'csv'): string {
    let content = '';

    switch (format) {
      case 'ical':
        content = this.exportToICalFormat(events);
        break;
      case 'json':
        content = this.exportToJSON(events);
        break;
      case 'csv':
        content = this.exportToCSV(events);
        break;
    }

    const bytes = new Blob([content]).size;
    const kb = (bytes / 1024).toFixed(2);
    return `${kb} KB`;
  }
}

export default CalendarExportService;
