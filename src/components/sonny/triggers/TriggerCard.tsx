// Trigger Card Component - Display individual trigger
// Shows status, timing, contacts, and action buttons

import React from 'react';
import { Clock, Users, Calendar, Bell, BellOff, Edit2, Trash2, Check, AlertTriangle } from 'lucide-react';
import { SimpleTrigger, TriggerType } from './TriggerForm';

interface TriggerCardProps {
  trigger: SimpleTrigger;
  onEdit: (trigger: SimpleTrigger) => void;
  onDelete: (triggerId: string) => void;
  onToggleActive: (triggerId: string) => void;
  onCheckIn: (triggerId: string) => void;
  familyMembers: Array<{ id: string; name: string }>;
}

export const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  onEdit,
  onDelete,
  onToggleActive,
  onCheckIn,
  familyMembers
}) => {
  const getStatusColor = () => {
    const now = Date.now();
    
    if (!trigger.isActive) return 'gray';
    if (now < trigger.startTime) return 'blue'; // Scheduled
    if (now >= trigger.startTime && now <= trigger.endTime) return 'green'; // Active
    if (now > trigger.endTime) return 'gray'; // Completed
    
    return 'gray';
  };

  const getStatusText = () => {
    const now = Date.now();
    
    if (!trigger.isActive) return 'Inactive';
    if (now < trigger.startTime) return 'Scheduled';
    if (now >= trigger.startTime && now <= trigger.endTime) return 'Active';
    if (now > trigger.endTime) return 'Completed';
    
    return 'Unknown';
  };

  const getTypeIcon = (type: TriggerType) => {
    switch (type) {
      case 'trip': return '🚗';
      case 'periodic': return '🔄';
      case 'one-time': return '📅';
      default: return '📌';
    }
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContactNames = () => {
    return trigger.emergencyContacts
      .map(id => familyMembers.find(m => m.id === id)?.name || 'Unknown')
      .join(', ');
  };

  const isActiveNow = () => {
    const now = Date.now();
    return trigger.isActive && now >= trigger.startTime && now <= trigger.endTime;
  };

  const needsCheckIn = () => {
    if (!isActiveNow()) return false;
    if (!trigger.lastCheckIn) return true;
    
    const timeSinceLastCheckIn = Date.now() - trigger.lastCheckIn;
    const intervalMs = trigger.checkInInterval;
    
    return timeSinceLastCheckIn >= intervalMs;
  };

  const statusColor = getStatusColor();
  const statusColors = {
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    red: 'bg-red-100 text-red-700 border-red-300'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="text-3xl">{getTypeIcon(trigger.type)}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{trigger.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[statusColor]}`}>
                  {getStatusText()}
                </span>
                {needsCheckIn() && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 animate-pulse">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    Check-in Needed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 capitalize mt-1">
                {trigger.type === 'one-time' ? 'One Time' : trigger.type} Trigger
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleActive(trigger.id)}
              className={`p-2 rounded-lg transition-colors ${
                trigger.isActive
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              title={trigger.isActive ? 'Deactivate' : 'Activate'}
            >
              {trigger.isActive ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onEdit(trigger)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit trigger"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${trigger.name}"?`)) {
                  onDelete(trigger.id);
                }
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete trigger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Timing */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Start: {formatDateTime(trigger.startTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>End: {formatDateTime(trigger.endTime)}</span>
          </div>
        </div>

        {/* Check-in Interval */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Check-in every {trigger.checkInInterval / 60000} minutes</span>
        </div>

        {/* Emergency Contacts */}
        <div className="flex items-start space-x-2 text-sm">
          <Users className="h-4 w-4 text-gray-600 mt-0.5" />
          <div>
            <span className="text-gray-600">Emergency Contacts: </span>
            <span className="text-gray-900 font-medium">{getContactNames()}</span>
          </div>
        </div>

        {/* Last Check-in */}
        {trigger.lastCheckIn && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Check className="h-4 w-4 text-green-600" />
            <span>Last check-in: {formatDateTime(trigger.lastCheckIn)}</span>
          </div>
        )}
      </div>

      {/* Check-in Button (if active) */}
      {isActiveNow() && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => onCheckIn(trigger.id)}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              needsCheckIn()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {needsCheckIn() ? '⏰ Check In Now' : '✅ Checked In'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TriggerCard;
