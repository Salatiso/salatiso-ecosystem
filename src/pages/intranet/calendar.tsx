import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Bell,
  Search,
  Download,
  Upload,
  Settings,
  X,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import toast from 'react-hot-toast';
import { db } from '@/config/firebase';
import { collection, onSnapshot, query, where, Query, DocumentData } from 'firebase/firestore';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  attendees?: string[];
  category: 'personal' | 'work' | 'family' | 'maintenance' | 'travel' | 'compliance' | 'other';
  color?: string;
  reminder?: boolean;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  linkedAsset?: string;
  isAllDay?: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 21)); // Oct 21, 2025
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<CalendarEvent['category']>('personal');

  // Real-time Firestore sync for calendar events
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q: Query<DocumentData> = query(
        collection(db, 'calendarEvents'),
        where('userId', '==', user.id)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const eventsData: CalendarEvent[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Omit<CalendarEvent, 'startDate' | 'endDate'>),
            startDate: doc.data().startDate?.toDate() || new Date(),
            endDate: doc.data().endDate?.toDate(),
          }));
          setEvents(eventsData);
          setLoading(false);
          setError(null);
          console.log(`[Calendar] Successfully loaded ${eventsData.length} events`);
        },
        (err: any) => {
          console.error('[Calendar] Firestore error:', err.code, err.message);
          
          // More detailed error handling
          if (err.code === 'permission-denied') {
            setError('Permission denied. Please check your account access.');
          } else if (err.code === 'unavailable') {
            setError('Firestore service unavailable. Please try again later.');
          } else if (err.code === 'not-found') {
            setError('Calendar events collection not found.');
          } else {
            setError(`Failed to load events: ${err.message}`);
          }
          
          setLoading(false);
          
          // Use mock data as fallback
          console.log('[Calendar] Using fallback mock data');
          const mockEvents: CalendarEvent[] = [
            {
              id: '1',
              title: 'Family Dinner',
              description: 'Weekly family gathering',
              startDate: new Date(2025, 9, 24),
              startTime: '18:00',
              endTime: '20:00',
              location: 'Home',
              category: 'family',
              color: '#E74C3C',
              reminder: true,
              recurring: 'weekly',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: user?.id || '',
            },
            {
              id: '2',
              title: 'Vehicle Maintenance - Toyota',
              description: 'Regular service and inspection',
              startDate: new Date(2025, 10, 15),
              startTime: '09:00',
              endTime: '12:00',
              location: 'Service Center',
              category: 'maintenance',
              linkedAsset: '2',
              color: '#F39C12',
              reminder: true,
              recurring: 'none',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: user?.id || '',
            },
            {
              id: '3',
              title: 'SARS Tax Deadline',
              description: 'Monthly tax submission deadline',
              startDate: new Date(2025, 11, 20),
              isAllDay: true,
              category: 'compliance',
              color: '#3498DB',
              reminder: true,
              recurring: 'monthly',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: user?.id || '',
            },
            {
              id: '4',
              title: 'Travel - Cape Town',
              description: 'Family vacation',
              startDate: new Date(2025, 11, 1),
              endDate: new Date(2025, 11, 8),
              category: 'travel',
              color: '#9B59B6',
              reminder: true,
              recurring: 'none',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: user?.id || '',
            },
          ];
          setEvents(mockEvents);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Calendar setup error:', err);
      setError('Failed to set up calendar');
      setLoading(false);
    }
  }, [user?.id]);

  // Calendar utilities
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = () => {
    setShowEventForm(true);
  };

  const handleCreateEvent = () => {
    if (!newEventTitle.trim()) {
      toast.error('Event title is required');
      return;
    }
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      startDate: selectedDate || new Date(),
      category: newEventCategory,
      color: '#3498DB',
      reminder: true,
      recurring: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id || '',
    };
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setShowEventForm(false);
    toast.success('Event created successfully!');
  };

  const handleDownloadCalendar = () => {
    const icsContent = events.map(event => {
      const startDate = new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      return `BEGIN:VEVENT
DTSTART:${startDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
END:VEVENT`;
    }).join('\n');

    const icsText = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salatiso//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${icsContent}
END:VCALENDAR`;

    const blob = new Blob([icsText], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-${new Date().toISOString().split('T')[0]}.ics`;
    a.click();
    toast.success('Calendar downloaded as .ics');
  };

  const handleDownloadJSON = () => {
    const jsonText = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Calendar downloaded as JSON');
  };

  const handleImportCalendar = async (file: File) => {
    const text = await file.text();
    try {
      if (file.name.endsWith('.ics')) {
        toast.success('ICS import support coming soon');
      } else if (file.name.endsWith('.json')) {
        const imported = JSON.parse(text);
        if (Array.isArray(imported)) {
          setEvents([...events, ...imported]);
          toast.success(`Imported ${imported.length} events`);
        }
      }
    } catch (error) {
      toast.error('Failed to import calendar');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      family: 'bg-red-100 text-red-800',
      maintenance: 'bg-orange-100 text-orange-800',
      travel: 'bg-purple-100 text-purple-800',
      compliance: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      weekDays.push(day);
    }
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              <div className="text-center mb-3">
                <div className="text-xs font-bold text-ubuntu-warm-600">{daysOfWeek[day.getDay()]}</div>
                <div className="text-lg font-bold text-ubuntu-warm-900">{day.getDate()}</div>
              </div>
              <div className="space-y-2">
                {getEventsForDate(day).slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="text-xs p-2 bg-ubuntu-warm-50 rounded cursor-pointer hover:bg-ubuntu-warm-100"
                  >
                    <div className="font-medium text-ubuntu-warm-900">{event.title}</div>
                    {event.startTime && <div className="text-ubuntu-warm-600">{event.startTime}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const displayDate = selectedDate || currentDate;
    const dayEvents = getEventsForDate(displayDate).sort((a, b) => {
      const aTime = a.startTime || '00:00';
      const bTime = b.startTime || '00:00';
      return aTime.localeCompare(bTime);
    });
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-ubuntu-warm-900 mb-6">
          {displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        {dayEvents.length === 0 ? (
          <p className="text-ubuntu-warm-600">No events for this day</p>
        ) : (
          <div className="space-y-4">
            {dayEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-4 bg-ubuntu-warm-50 rounded-lg border-l-4 cursor-pointer hover:bg-ubuntu-warm-100"
                style={{ borderLeftColor: event.color || '#3498DB' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-ubuntu-warm-900">{event.title}</h4>
                    {event.startTime && <p className="text-sm text-ubuntu-warm-600 mt-1">{event.startTime} {event.endTime && `- ${event.endTime}`}</p>}
                    {event.location && <p className="text-sm text-ubuntu-warm-600">{event.location}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-ubuntu-warm-50 h-24"></div>
      );
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ backgroundColor: '#fff5e6' }}
          onClick={() => setSelectedDate(date)}
          className={`h-24 border border-ubuntu-warm-100 p-2 cursor-pointer transition-colors ${
            isToday ? 'bg-ubuntu-purple-light' : 'bg-white'
          } ${isSelected ? 'ring-2 ring-ubuntu-purple' : ''}`}
        >
          <div className="text-xs font-bold text-ubuntu-warm-900 mb-1">{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                }}
                className="text-xs bg-ubuntu-purple text-white px-1 py-0.5 rounded truncate cursor-pointer hover:bg-ubuntu-purple-dark"
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-ubuntu-warm-600 px-1">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  // Get upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <IntranetLayout title="Calendar">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin mx-auto text-ubuntu-purple" />
            <p className="text-gray-600">Loading calendar events...</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  if (error) {
    return (
      <IntranetLayout title="Calendar">
        <div className="flex items-center justify-center h-screen">
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
      <div className="min-h-screen bg-gradient-to-br from-ubuntu-warm-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-ubuntu-warm-900 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-ubuntu-purple" />
                  Calendar
                </h1>
                <p className="text-ubuntu-warm-600 mt-1">Manage events, maintenance, and family schedule</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddEvent}
                  className="bg-ubuntu-purple hover:bg-ubuntu-purple-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Event
                </button>
                <button
                  onClick={handleDownloadCalendar}
                  className="bg-ubuntu-warm-100 hover:bg-ubuntu-warm-200 text-ubuntu-warm-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  title="Download as .ics"
                >
                  <Download className="w-5 h-5" />
                  .ics
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="bg-ubuntu-warm-100 hover:bg-ubuntu-warm-200 text-ubuntu-warm-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  title="Download as JSON"
                >
                  <Download className="w-5 h-5" />
                  JSON
                </button>
                <label className="bg-ubuntu-warm-100 hover:bg-ubuntu-warm-200 text-ubuntu-warm-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Import
                  <input
                    type="file"
                    accept=".ics,.json"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImportCalendar(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </motion.div>

          {/* View Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 mb-6"
          >
            {(['month', 'week', 'day'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-ubuntu-purple text-white'
                    : 'bg-white text-ubuntu-warm-900 border border-ubuntu-warm-200 hover:bg-ubuntu-warm-50'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-lg shadow p-6">
                {/* Month Header - only show for month view */}
                {viewMode === 'month' && (
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-ubuntu-warm-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-ubuntu-warm-600" />
                    </button>
                    <h2 className="text-xl font-bold text-ubuntu-warm-900">
                      {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-ubuntu-warm-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-ubuntu-warm-600" />
                    </button>
                  </div>
                )}

                {/* View-specific rendering */}
                {viewMode === 'month' && (
                  <>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-0 mb-2">
                      {daysOfWeek.map(day => (
                        <div key={day} className="text-center py-2 text-sm font-semibold text-ubuntu-warm-600">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-0 border border-ubuntu-warm-100">
                      {renderCalendarDays()}
                    </div>
                  </>
                )}

                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Selected Date Events */}
              {selectedDate && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-bold text-ubuntu-warm-900 mb-4">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </h3>
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <p className="text-sm text-ubuntu-warm-600">No events scheduled</p>
                    ) : (
                      getEventsForDate(selectedDate).map(event => (
                        <div
                          key={event.id}
                          className="p-3 bg-ubuntu-warm-50 rounded-lg cursor-pointer hover:bg-ubuntu-warm-100 transition-colors"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="font-medium text-sm text-ubuntu-warm-900">{event.title}</div>
                          <div className="text-xs text-ubuntu-warm-600 mt-1">
                            {event.startTime && `${event.startTime}`}
                            {event.startTime && event.endTime && ` - ${event.endTime}`}
                          </div>
                          <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-ubuntu-warm-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-ubuntu-purple" />
                  Upcoming
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-ubuntu-warm-600">No upcoming events</p>
                  ) : (
                    upcomingEvents.map(event => (
                      <div
                        key={event.id}
                        className="p-3 bg-ubuntu-warm-50 rounded-lg cursor-pointer hover:bg-ubuntu-warm-100 transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="font-medium text-sm text-ubuntu-warm-900">{event.title}</div>
                        <div className="text-xs text-ubuntu-warm-600 mt-1">
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Category Legend */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-ubuntu-warm-900 mb-4">Categories</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { cat: 'personal', label: 'Personal' },
                    { cat: 'family', label: 'Family' },
                    { cat: 'work', label: 'Work' },
                    { cat: 'maintenance', label: 'Maintenance' },
                    { cat: 'travel', label: 'Travel' },
                    { cat: 'compliance', label: 'Compliance' },
                  ].map(({ cat, label }) => (
                    <div key={cat} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${getCategoryColor(cat).split(' ')[0]}`}></div>
                      <span className="text-ubuntu-warm-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Event Detail Modal */}
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-ubuntu-warm-900">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-ubuntu-warm-400 hover:text-ubuntu-warm-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedEvent.description && (
                    <div>
                      <div className="text-xs font-medium text-ubuntu-warm-600 mb-1">Description</div>
                      <p className="text-sm text-ubuntu-warm-900">{selectedEvent.description}</p>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-medium text-ubuntu-warm-600 mb-1">Date & Time</div>
                    <div className="flex items-center gap-2 text-sm text-ubuntu-warm-900">
                      <Clock className="w-4 h-4" />
                      {new Date(selectedEvent.startDate).toLocaleDateString()}
                      {selectedEvent.startTime && ` at ${selectedEvent.startTime}`}
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div>
                      <div className="text-xs font-medium text-ubuntu-warm-600 mb-1">Location</div>
                      <div className="flex items-center gap-2 text-sm text-ubuntu-warm-900">
                        <MapPin className="w-4 h-4" />
                        {selectedEvent.location}
                      </div>
                    </div>
                  )}

                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-ubuntu-warm-600 mb-1">Attendees</div>
                      <div className="flex items-center gap-2 text-sm text-ubuntu-warm-900">
                        <Users className="w-4 h-4" />
                        {selectedEvent.attendees.join(', ')}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className={`inline-block text-xs px-3 py-1 rounded font-medium ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-6 border-t border-ubuntu-warm-100">
                  <button className="flex-1 py-2 px-4 bg-ubuntu-purple hover:bg-ubuntu-purple-dark text-white rounded-lg font-medium transition-colors">
                    Edit
                  </button>
                  <button className="py-2 px-4 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Event Form Modal */}
          {showEventForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEventForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-ubuntu-warm-900">Add New Event</h3>
                  <button
                    onClick={() => setShowEventForm(false)}
                    className="text-ubuntu-warm-400 hover:text-ubuntu-warm-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-ubuntu-warm-900">Event Title</label>
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Enter event title"
                      className="w-full mt-1 px-3 py-2 border border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-ubuntu-warm-900">Category</label>
                    <select
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value as CalendarEvent['category'])}
                      className="w-full mt-1 px-3 py-2 border border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple"
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="family">Family</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="travel">Travel</option>
                      <option value="compliance">Compliance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-ubuntu-warm-900">Date</label>
                    <input
                      type="date"
                      defaultValue={(selectedDate || currentDate).toISOString().split('T')[0]}
                      className="w-full mt-1 px-3 py-2 border border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple"
                    />
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={handleCreateEvent}
                      className="flex-1 py-2 px-4 bg-ubuntu-purple hover:bg-ubuntu-purple-dark text-white rounded-lg font-medium transition-colors"
                    >
                      Create Event
                    </button>
                    <button
                      onClick={() => setShowEventForm(false)}
                      className="py-2 px-4 bg-ubuntu-warm-100 hover:bg-ubuntu-warm-200 text-ubuntu-warm-900 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </IntranetLayout>
  );
};

export default CalendarPage;
