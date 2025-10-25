/**
 * @file EventForm.tsx
 * @description Event creation/editing form with quick-add and advanced modes
 * Supports Activities and Incidents with role assignment and entity linking
 * 
 * @author Salatiso Ecosystem - Sprint 3.1 Task 3
 * @created October 25, 2025
 */

import React, { useState } from 'react';
import {
  CreateEventInput,
  UpdateEventInput,
  EventType,
  ActivityCategory,
  IncidentCategory,
  ContextLevel,
  SeverityLevel,
  RoleType,
  EnhancedCalendarEvent
} from '@/types/calendar';
import enhancedCalendarService from '@/services/EnhancedCalendarService';

interface EventFormProps {
  userId: string;
  initialEvent?: EnhancedCalendarEvent;
  defaultContext?: ContextLevel;
  onSuccess?: (event: EnhancedCalendarEvent) => void;
  onCancel?: () => void;
  mode?: 'quick' | 'advanced';
}

export const EventForm: React.FC<EventFormProps> = ({
  userId,
  initialEvent,
  defaultContext = ContextLevel.INDIVIDUAL,
  onSuccess,
  onCancel,
  mode = 'quick'
}) => {
  const [formMode, setFormMode] = useState<'quick' | 'advanced'>(mode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [eventType, setEventType] = useState<EventType>(initialEvent?.type || EventType.ACTIVITY);
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [category, setCategory] = useState(
    initialEvent?.category || ActivityCategory.MEETING
  );
  const [context, setContext] = useState<ContextLevel>(
    initialEvent?.context || defaultContext
  );
  const [dateTime, setDateTime] = useState(
    initialEvent?.dateTime ? initialEvent.dateTime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState(initialEvent?.location || '');

  // Incident-specific
  const [severity, setSeverity] = useState<SeverityLevel>(SeverityLevel.MEDIUM);
  const [injuries, setInjuries] = useState('');

  // Activity-specific
  const [recurring, setRecurring] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const categories = eventType === EventType.ACTIVITY ? Object.values(ActivityCategory) : Object.values(IncidentCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const dateTimeObj = new Date(`${dateTime}T${time}:00`);

      if (initialEvent?.id) {
        // Update
        const input: UpdateEventInput = {
          id: initialEvent.id,
          title,
          description,
          category,
          dateTime: dateTimeObj,
          location
        };
        const result = await enhancedCalendarService.updateEvent(userId, input);
        if (!result.success) throw new Error(result.error);
        setSuccessMsg('Event updated successfully');
        onSuccess?.(result.data!);
      } else {
        // Create
        const input: CreateEventInput = {
          title,
          description,
          type: eventType,
          category: category as any,
          context,
          dateTime: dateTimeObj,
          location,
          tags: []
        };

        if (eventType === EventType.INCIDENT) {
          (input as any).severity = severity;
          if (injuries) (input as any).injuries = injuries;
        }

        if (eventType === EventType.ACTIVITY && recurring) {
          input.recurring = {
            frequency: recurringFreq,
            interval: 1
          };
        }

        const result = await enhancedCalendarService.createEvent(userId, input);
        if (!result.success) throw new Error(result.error);
        setSuccessMsg('Event created successfully');
        setTitle('');
        setDescription('');
        setLocation('');
        onSuccess?.(result.data!);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== QUICK MODE FORM ==========
  if (formMode === 'quick') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-800">Quick Add Event</h3>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            {successMsg}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={eventType}
              onChange={e => {
                setEventType(e.target.value as EventType);
                setCategory(eventType === EventType.ACTIVITY ? ActivityCategory.MEETING : IncidentCategory.HEALTH);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={EventType.ACTIVITY}>Activity</option>
              <option value={EventType.INCIDENT}>Incident</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ActivityCategory | IncidentCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
            <select
              value={context}
              onChange={e => setContext(e.target.value as ContextLevel)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(ContextLevel).map(ctx => (
                <option key={ctx} value={ctx}>
                  {ctx.charAt(0).toUpperCase() + ctx.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {eventType === EventType.INCIDENT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(SeverityLevel).map(sev => (
                  <option key={sev} value={sev}>
                    {sev.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setFormMode('advanced')}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded font-medium"
          >
            Advanced
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    );
  }

  // ========== ADVANCED MODE FORM ==========
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow max-w-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Advanced Event Editor</h3>
        <button
          type="button"
          onClick={() => setFormMode('quick')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Quick Mode
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Basic Section */}
      <section>
        <h4 className="font-semibold text-gray-700 mb-4">Basic Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Event description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value as EventType)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={EventType.ACTIVITY}>Activity</option>
                <option value={EventType.INCIDENT}>Incident</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ActivityCategory | IncidentCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Context *</label>
              <select
                value={context}
                onChange={e => setContext(e.target.value as ContextLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(ContextLevel).map(ctx => (
                  <option key={ctx} value={ctx}>
                    {ctx.charAt(0).toUpperCase() + ctx.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Timing Section */}
      <section>
        <h4 className="font-semibold text-gray-700 mb-4">Timing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {eventType === EventType.ACTIVITY && (
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recurring}
                onChange={e => setRecurring(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Recurring</span>
            </label>
            {recurring && (
              <select
                value={recurringFreq}
                onChange={e => setRecurringFreq(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>
        )}
      </section>

      {/* Location & Incident Details */}
      <section>
        <h4 className="font-semibold text-gray-700 mb-4">Details</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Event location"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {eventType === EventType.INCIDENT && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as SeverityLevel)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(SeverityLevel).map(sev => (
                    <option key={sev} value={sev}>
                      {sev.charAt(0).toUpperCase() + sev.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Injuries/Damage</label>
                <textarea
                  value={injuries}
                  onChange={e => setInjuries(e.target.value)}
                  placeholder="Describe any injuries or damage"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialEvent ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
