import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { EnhancedCalendarEvent, EventStatus, EventType, SeverityLevel } from '@/types/calendar';

interface CalendarGridProps {
  events: EnhancedCalendarEvent[];
  currentMonth: Date;
  selectedDate: Date | null;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: EnhancedCalendarEvent) => void;
  viewMode?: 'month' | 'week';
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  events,
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
  onEventSelect,
  viewMode = 'month',
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Utility functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date): EnhancedCalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.dateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handlePrevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const today = new Date();

  // Get event color based on type and status
  const getEventColor = (event: EnhancedCalendarEvent) => {
    if (event.type === EventType.INCIDENT && event.incidentData) {
      const severity = event.incidentData.severity || SeverityLevel.MEDIUM;
      const colors: Record<SeverityLevel, string> = {
        [SeverityLevel.CRITICAL]: 'bg-red-500',
        [SeverityLevel.HIGH]: 'bg-orange-500',
        [SeverityLevel.MEDIUM]: 'bg-yellow-500',
        [SeverityLevel.LOW]: 'bg-yellow-400',
      };
      return colors[severity];
    }
    return 'bg-blue-500';
  };

  // Get status badge color
  const getStatusBadgeColor = (status: EventStatus) => {
    const colors: Record<EventStatus, string> = {
      [EventStatus.PLANNED]: 'bg-gray-100 text-gray-800',
      [EventStatus.OPEN]: 'bg-blue-100 text-blue-800',
      [EventStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [EventStatus.RESOLVED]: 'bg-green-100 text-green-800',
      [EventStatus.ARCHIVED]: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50 h-28 border border-gray-200"></div>
      );
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const dateKey = date.toISOString().split('T')[0];
      const isExpanded = expandedDate === dateKey;

      days.push(
        <motion.div
          key={day}
          layout
          onClick={() => {
            onDateSelect(date);
            setExpandedDate(isExpanded ? null : dateKey);
          }}
          className={`
            min-h-28 border border-gray-200 p-2 cursor-pointer transition-all
            ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}
            ${isSelected ? 'ring-2 ring-inset ring-purple-500' : ''}
            ${isExpanded ? 'lg:row-span-2' : ''}
            hover:bg-gray-50
          `}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </div>
            {dayEvents.length > 0 && (
              <div className="text-xs font-semibold bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded-full">
                {dayEvents.length}
              </div>
            )}
          </div>

          {/* Event preview dots */}
          {dayEvents.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-1">
              {dayEvents.slice(0, 3).map((event) => (
                <motion.div
                  key={event.id}
                  layoutId={`event-${event.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventSelect(event);
                  }}
                  className={`
                    w-2 h-2 rounded-full cursor-pointer
                    ${getEventColor(event)}
                    hover:w-3 hover:h-3
                  `}
                  title={event.title}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-600">+{dayEvents.length - 3}</div>
              )}
            </div>
          )}

          {/* Expanded event list */}
          {isExpanded && dayEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 mt-2 pt-2 space-y-1"
            >
              {dayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventSelect(event);
                  }}
                  className={`text-xs p-1 rounded cursor-pointer truncate ${getStatusBadgeColor(event.status)} hover:shadow-md transition-shadow`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  {event.type === EventType.INCIDENT && event.incidentData && (
                    <div className="text-xs opacity-75">
                      🚨 {event.incidentData.severity}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentMonth);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      weekDays.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, idx) => {
          const dayEvents = getEventsForDate(day);
          const isToday = day.toDateString() === today.toDateString();

          return (
            <motion.div
              key={idx}
              onClick={() => onDateSelect(day)}
              className={`
                rounded-lg p-3 cursor-pointer transition-all
                ${isToday ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-200'}
                hover:shadow-md
              `}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center mb-3">
                <div className="text-xs font-bold text-gray-600">{daysOfWeek[day.getDay()]}</div>
                <div className="text-lg font-bold text-gray-900">{day.getDate()}</div>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <motion.div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventSelect(event);
                    }}
                    className={`text-xs p-1.5 rounded cursor-pointer truncate ${getStatusBadgeColor(event.status)} hover:shadow-sm`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                  </motion.div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-600 px-1">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={handlePrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </motion.button>

        <h2 className="text-xl font-bold text-gray-900 min-w-48 text-center">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </motion.button>
      </div>

      {/* View-specific content */}
      {viewMode === 'month' && (
        <>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center py-2 text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 bg-gray-50 rounded-lg overflow-hidden">
            {renderCalendarDays()}
          </div>
        </>
      )}

      {viewMode === 'week' && renderWeekView()}

      {/* Statistics footer */}
      {events.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{events.length}</div>
            <div className="text-gray-600">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.type === EventType.ACTIVITY).length}
            </div>
            <div className="text-gray-600">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.type === EventType.INCIDENT).length}
            </div>
            <div className="text-gray-600">Incidents</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CalendarGrid;
