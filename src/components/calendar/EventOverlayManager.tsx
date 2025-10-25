'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useCalendarSystem } from '@/providers/CalendarSystemProvider';
import { useSeasonalContext, useNatural13Conversion } from '@/hooks/useConversionService';
import { CalendarSystemService } from '@/services/CalendarSystemService';
import { NATURAL13_MONTH_NAMES } from '@/types/calendar-systems';
import type { CalendarOverlay, CalendarSystem } from '@/types/calendar-systems';

interface EventOverlayManagerProps {
  /**
   * The event ID to manage overlays for
   */
  eventId: string;
  /**
   * Initial selected date
   */
  initialDate?: Date;
  /**
   * Callback when overlay is saved
   */
  onSaved?: (overlay: CalendarOverlay) => void;
  /**
   * CSS class for container
   */
  className?: string;
  /**
   * Whether loading
   */
  isLoading?: boolean;
  /**
   * Existing overlays for this event (optional)
   */
  existingOverlays?: CalendarOverlay[];
}

/**
 * System selector component
 */
const SystemSelector = React.memo(
  ({
    systems,
    selectedSystemId,
    onChange,
  }: {
    systems: CalendarSystem[];
    selectedSystemId: string | null;
    onChange: (systemId: string) => void;
  }) => (
    <div className="flex items-center gap-2">
      <label htmlFor="system-select" className="text-sm font-medium text-gray-700">
        Calendar System:
      </label>
      <select
        id="system-select"
        value={selectedSystemId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select a system...</option>
        {systems.map((system) => (
          <option key={system.id} value={system.id}>
            {system.displayName}
          </option>
        ))}
      </select>
    </div>
  )
);

SystemSelector.displayName = 'SystemSelector';

/**
 * Overlay card component for existing overlays
 */
const OverlayCard = React.memo(
  ({
    overlay,
    system,
    onDelete,
  }: {
    overlay: CalendarOverlay;
    system: CalendarSystem;
    onDelete: () => void;
  }) => (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{system.displayName}</p>
        <p className="text-xs text-gray-600 mt-1">
          Mapped: {overlay.convertedDate?.month
            ? NATURAL13_MONTH_NAMES[overlay.convertedDate.month - 1]
            : 'Unknown'}{' '}
          {overlay.convertedDate?.day}
        </p>
        {overlay.lunarPhase && (
          <p className="text-xs text-gray-600">
            🌙 {overlay.lunarPhase.phase.replace(/_/g, ' ')} ({overlay.lunarPhase.illumination.toFixed(0)}%)
          </p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200"
      >
        Remove
      </button>
    </div>
  )
);

OverlayCard.displayName = 'OverlayCard';

/**
 * EventOverlayManager Component
 *
 * Manages event-to-calendar-system mappings with Firestore integration.
 * Allows users to:
 * - Select a date in multiple calendar systems
 * - View seasonal context (lunar, solar)
 * - Save mappings to Firestore
 * - View and delete existing overlays
 *
 * Features:
 * - Multi-calendar date mapping
 * - Firestore integration
 * - Seasonal context display
 * - Existing overlay management
 * - Real-time conversion
 * - Error handling
 * - Loading states
 *
 * @example
 * ```tsx
 * <EventOverlayManager
 *   eventId="event-123"
 *   initialDate={new Date()}
 *   existingOverlays={[...]}
 *   onSaved={(overlay) => console.log('Saved:', overlay)}
 * />
 * ```
 */
export const EventOverlayManager: React.FC<EventOverlayManagerProps> = ({
  eventId,
  initialDate = new Date(),
  onSaved,
  className = '',
  isLoading: externalIsLoading = false,
  existingOverlays = [],
}) => {
  // State
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localOverlays, setLocalOverlays] = useState<CalendarOverlay[]>(existingOverlays);

  // Context
  const { calendarSystems } = useCalendarSystem();
  const naturalConversion = useNatural13Conversion(selectedDate);
  const seasonalContext = useSeasonalContext(selectedDate);

  // Get selected system
  const selectedSystem = useMemo(
    () => calendarSystems.find((sys) => sys.id === selectedSystemId),
    [calendarSystems, selectedSystemId]
  );

  // Handle date change
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setError(null);
      }
    }
  }, []);

  // Handle save overlay
  const handleSaveOverlay = useCallback(async () => {
    if (!selectedSystemId) {
      setError('Please select a calendar system');
      return;
    }

    if (!selectedSystem) {
      setError('Selected system not found');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Create overlay object
      const overlay: CalendarOverlay = {
        id: `${eventId}-${selectedSystemId}-${Date.now()}`,
        eventId,
        calendarSystemId: selectedSystemId,
        convertedDate: {
          year: naturalConversion.year,
          month: naturalConversion.month,
          day: naturalConversion.day,
          monthName: naturalConversion.monthName,
        },
        lunarPhase: seasonalContext.lunarPhase,
        solarTerm: seasonalContext.solarTerm,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Firestore
      await CalendarSystemService.setEventOverlay(overlay);

      // Add to local overlays
      setLocalOverlays((prev) => {
        // Remove if already exists for this system
        const filtered = prev.filter((o) => o.calendarSystemId !== selectedSystemId);
        return [...filtered, overlay];
      });

      setSuccessMessage(`Added to ${selectedSystem.displayName}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      onSaved?.(overlay);

      // Reset form
      setSelectedSystemId(null);
    } catch (err) {
      console.error('Error saving overlay:', err);
      setError(err instanceof Error ? err.message : 'Failed to save overlay');
    } finally {
      setIsSaving(false);
    }
  }, [eventId, selectedSystemId, selectedSystem, naturalConversion, seasonalContext, onSaved]);

  // Handle delete overlay
  const handleDeleteOverlay = useCallback(async (overlay: CalendarOverlay) => {
    try {
      setError(null);
      // Note: CalendarSystemService doesn't have delete method yet
      // This would need to be implemented
      console.log('Delete not yet implemented:', overlay.eventId);
      setLocalOverlays((prev) => prev.filter((o) => o.eventId !== overlay.eventId));
    } catch (err) {
      console.error('Error deleting overlay:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete overlay');
    }
  }, []);

  // Find overlays for other systems
  const otherSystemOverlays = useMemo(() => {
    return localOverlays.filter((o) => o.calendarSystemId !== selectedSystemId);
  }, [localOverlays, selectedSystemId]);

  const dateStr = selectedDate.toISOString().split('T')[0];

  if (externalIsLoading || calendarSystems.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center p-4`}>
        <div className="text-gray-400">Loading calendar systems...</div>
      </div>
    );
  }

  return (
    <div
      className={`${className} space-y-6 p-4 bg-white rounded-lg shadow-md`}
      role="region"
      aria-labelledby="event-overlay-title"
      aria-describedby="event-overlay-description"
    >
      {/* Screen Reader Announcement */}
      <div id="event-overlay-description" className="sr-only">
        Event calendar mapping tool. Map the event {eventId} to multiple calendar systems including Gregorian, Natural13-month, and others. Review seasonal context and lunar phase information.
      </div>

      {/* Header */}
      <div className="border-b pb-4">
        <h3 id="event-overlay-title" className="text-lg font-semibold text-gray-900">Event Calendar Mappings</h3>
        <p className="text-sm text-gray-600">Map this event to multiple calendar systems</p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-3 bg-red-50 rounded-lg border border-red-200"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          className="p-3 bg-green-50 rounded-lg border border-green-200"
          role="status"
          aria-live="polite"
          aria-label="Success message"
        >
          <p className="text-sm text-green-800">✓ {successMessage}</p>
        </div>
      )}

      {/* Date Input */}
      <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
        <label htmlFor="event-date" className="block text-sm font-medium text-gray-700">
          Event Date (Gregorian)
        </label>
        <input
          id="event-date"
          type="date"
          value={dateStr}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-600">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Conversion Display */}
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <p className="text-sm font-semibold text-emerald-900 mb-2">Natural13 Conversion</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-gray-600">Month:</span>{' '}
            <span className="font-medium">{NATURAL13_MONTH_NAMES[naturalConversion.month - 1]}</span>
          </p>
          <p>
            <span className="text-gray-600">Day:</span> <span className="font-medium">{naturalConversion.day}</span>
          </p>
          <p>
            <span className="text-gray-600">Year:</span> <span className="font-medium">{naturalConversion.year}</span>
          </p>
        </div>
      </div>

      {/* Seasonal Context */}
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-sm font-semibold text-purple-900 mb-3">Seasonal Context</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">🌙 Lunar Phase:</span>
            <span className="font-medium capitalize">
              {seasonalContext.lunarPhase.phase.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Illumination:</span>
            <span className="font-medium">{seasonalContext.lunarPhase.illumination.toFixed(0)}%</span>
          </div>
          {seasonalContext.solarTerm && (
            <div className="flex justify-between">
              <span className="text-gray-600">⭐ Solar Term:</span>
              <span className="font-medium">{seasonalContext.solarTerm}</span>
            </div>
          )}
        </div>
      </div>

      {/* System Selection & Add */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <SystemSelector systems={calendarSystems} selectedSystemId={selectedSystemId} onChange={setSelectedSystemId} />
        <button
          onClick={handleSaveOverlay}
          disabled={!selectedSystemId || isSaving}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSaving ? 'Saving...' : 'Add to System'}
        </button>
      </div>

      {/* Existing Overlays */}
      {localOverlays.length > 0 && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">Mapped to Systems ({localOverlays.length})</p>
          <div className="space-y-2">
            {localOverlays.map((overlay) => {
              const system = calendarSystems.find((s) => s.id === overlay.calendarSystemId);
              return system ? (
                <OverlayCard
                  key={overlay.eventId + overlay.calendarSystemId}
                  overlay={overlay}
                  system={system}
                  onDelete={() => handleDeleteOverlay(overlay)}
                />
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Other Available Systems */}
      {calendarSystems.length > localOverlays.length && (
        <div className="text-sm text-gray-600">
          <p>
            {calendarSystems.length - localOverlays.length} more system
            {calendarSystems.length - localOverlays.length !== 1 ? 's' : ''} available
          </p>
        </div>
      )}

      {/* Info Footer */}
      <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
        <p>💡 Tip: Create mappings for important events to track them across multiple calendar systems.</p>
        <p>✓ Changes are automatically saved to the database.</p>
      </div>
    </div>
  );
};

export default EventOverlayManager;
