/**
 * @file Updated Calendar Page with Sprint 3.2 Integration
 * @description Calendar page integrating:
 * - ContextSwitcher for multi-context filtering
 * - CalendarGrid for enhanced event display
 * - EventForm for creating/editing events
 * - EventDetails for viewing event information
 * - Real-time Firestore subscriptions
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import ContextSwitcher from '@/components/calendar/ContextSwitcher';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventForm from '@/components/calendar/EventForm';
import EventDetails from '@/components/calendar/EventDetails';
import toast from 'react-hot-toast';
import {
  EnhancedCalendarEvent,
  ContextLevel,
  EventStatus,
} from '@/types/calendar';
import enhancedCalendarService from '@/services/EnhancedCalendarService';

const CalendarPageV2: React.FC = () => {
  const { user } = useAuth();

  // State Management
  const [context, setContext] = useState<ContextLevel>(ContextLevel.FAMILY);
  const [events, setEvents] = useState<EnhancedCalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EnhancedCalendarEvent | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EnhancedCalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Load context from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedContext = localStorage.getItem('calendar-context') as ContextLevel | null;
      if (savedContext) {
        setContext(savedContext);
      }
    }
  }, []);

  // Subscribe to real-time events from Firestore
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      try {
        // Subscribe to events for current context
        unsubscribe = enhancedCalendarService.subscribeToEvents(
          user.id,
          {
            context: [context], // Pass as array
          },
          (events) => {
            console.log(`[Calendar] Loaded ${events.length} events for context: ${context}`);
            setEvents(events);
            setError(null);
            setLoading(false);
          },
          (error) => {
            console.error('[Calendar] Subscription error:', error);
            setError('Failed to load events');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('[Calendar] Subscription setup error:', err);
        setError('Failed to set up calendar subscription');
        setLoading(false);
      }
    };

    setupSubscription();

    // Cleanup subscription on unmount or context change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id, context]);

  // Handle event creation
  const handleCreateEvent = async (input: any) => {
    if (!user?.id) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const response = await enhancedCalendarService.createEvent(user.id, {
        ...input,
        context,
      });

      if (response.success) {
        toast.success('Event created successfully!');
        setShowEventForm(false);
        // Event will be added via real-time subscription
      } else {
        toast.error(response.error || 'Failed to create event');
      }
    } catch (err: any) {
      console.error('Event creation error:', err);
      toast.error('Error creating event');
    }
  };

  // Handle event update
  const handleUpdateEvent = async (eventId: string, updates: any) => {
    if (!user?.id || !selectedEvent) {
      toast.error('Not authenticated or no event selected');
      return;
    }

    try {
      const response = await enhancedCalendarService.updateEvent(user.id, {
        id: eventId,
        ...updates,
      });

      if (response.success) {
        toast.success('Event updated successfully!');
        setShowEventForm(false);
        setSelectedEvent(null);
        // Event will be updated via real-time subscription
      } else {
        toast.error(response.error || 'Failed to update event');
      }
    } catch (err: any) {
      console.error('Event update error:', err);
      toast.error('Error updating event');
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    if (!user?.id) {
      toast.error('Not authenticated');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await enhancedCalendarService.deleteEvent(user.id, eventId);

      if (response.success) {
        toast.success('Event deleted successfully!');
        setShowEventDetails(false);
        setSelectedEvent(null);
        // Event will be removed via real-time subscription
      } else {
        toast.error(response.error || 'Failed to delete event');
      }
    } catch (err: any) {
      console.error('Event deletion error:', err);
      toast.error('Error deleting event');
    }
  };

  // Handle event escalation (for incidents)
  const handleEscalateIncident = async () => {
    if (!user?.id || !selectedEvent) {
      toast.error('Not authenticated or no event selected');
      return;
    }

    try {
      const response = await enhancedCalendarService.escalateIncident(
        user.id,
        selectedEvent.id,
        ContextLevel.FAMILY,
        'Escalated from calendar UI'
      );

      if (response.success) {
        toast.success('Incident escalated successfully!');
        setSelectedEvent(null);
        // Event will be updated via real-time subscription
      } else {
        toast.error(response.error || 'Failed to escalate incident');
      }
    } catch (err: any) {
      console.error('Escalation error:', err);
      toast.error('Error escalating incident');
    }
  };

  // Loading state
  if (loading && events.length === 0) {
    return (
      <IntranetLayout title="Calendar">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin mx-auto text-purple-500" />
            <p className="text-gray-600">Loading calendar events...</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <IntranetLayout title="Calendar">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
            <p className="text-red-600 font-semibold">Error loading calendar</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  return (
    <IntranetLayout title="Calendar">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  Calendar
                </h1>
                <p className="text-gray-600 mt-1">Manage events and activities across multiple contexts</p>
              </div>
              <motion.button
                onClick={() => {
                  setEditingEvent(null);
                  setShowEventForm(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Event
              </motion.button>
            </div>

            {/* Context Switcher */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Filter by context:</p>
              <ContextSwitcher current={context} onChange={setContext} />
            </div>

            {/* View Mode Controls */}
            <div className="flex gap-2">
              {(['month', 'week'] as const).map(mode => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} View
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3"
            >
              <CalendarGrid
                events={events}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onMonthChange={setCurrentMonth}
                onDateSelect={setSelectedDate}
                onEventSelect={(event) => {
                  setSelectedEvent(event);
                  setShowEventDetails(true);
                }}
                viewMode={viewMode}
              />
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Context Info Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4">Current Context</h3>
                <p className="text-sm text-gray-600 capitalize mb-4">
                  Viewing events in <strong>{context.toLowerCase()}</strong> context
                </p>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium text-gray-900">Total Events:</span>
                    <span className="ml-2 text-gray-600">{events.length}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Selected Date:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedDate ? selectedDate.toLocaleDateString() : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Date Events */}
              {selectedDate && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                  <div className="space-y-2">
                    {events
                      .filter(
                        e =>
                          new Date(e.dateTime).toDateString() ===
                          selectedDate.toDateString()
                      )
                      .slice(0, 5)
                      .map(event => (
                        <motion.button
                          key={event.id}
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventDetails(true);
                          }}
                          whileHover={{ scale: 1.05 }}
                          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {event.status}
                          </div>
                        </motion.button>
                      ))}
                    {events.filter(
                      e =>
                        new Date(e.dateTime).toDateString() ===
                        selectedDate.toDateString()
                    ).length === 0 && (
                      <p className="text-sm text-gray-600">No events scheduled</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Event Form Modal */}
          {showEventForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <EventForm
                  userId={user?.id || ''}
                  defaultContext={context}
                  mode="advanced"
                  initialEvent={editingEvent || undefined}
                  onSuccess={() => setShowEventForm(false)}
                  onCancel={() => setShowEventForm(false)}
                />
              </motion.div>
            </div>
          )}

          {/* Event Details Modal */}
          {showEventDetails && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <EventDetails
                  event={selectedEvent}
                  onEdit={() => {
                    setEditingEvent(selectedEvent);
                    setShowEventDetails(false);
                    setShowEventForm(true);
                  }}
                  onEscalate={handleEscalateIncident}
                  onResolve={() => {
                    handleUpdateEvent(selectedEvent.id, {
                      status: EventStatus.RESOLVED,
                    });
                  }}
                />
                <div className="border-t border-gray-200 p-6 flex gap-3">
                  <button
                    onClick={() => {
                      setEditingEvent(selectedEvent);
                      setShowEventDetails(false);
                      setShowEventForm(true);
                    }}
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="py-2 px-4 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowEventDetails(false)}
                    className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </IntranetLayout>
  );
};

export default CalendarPageV2;
