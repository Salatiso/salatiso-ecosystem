// Safety Trigger Form Component
// Implements trigger creation/editing as per Sonny Chat specification
// Supports: TRIP, PERIODIC, ONE_TIME trigger types

import React, { useState, useEffect } from 'react';
import { X, Clock, Users, AlertCircle, Calendar, Bell } from 'lucide-react';

export type TriggerType = 'trip' | 'periodic' | 'one-time';

export interface SimpleTrigger {
  id: string;
  name: string;
  type: TriggerType;
  startTime: number; // Unix timestamp
  endTime: number;
  checkInInterval: number; // Minutes
  emergencyContacts: string[];
  reciprocalParty?: string;
  isActive: boolean;
  lastCheckIn?: number;
  createdAt: number;
}

interface TriggerFormProps {
  trigger?: SimpleTrigger; // For editing existing trigger
  familyMembers: Array<{ id: string; name: string }>;
  onSave: (trigger: SimpleTrigger) => void;
  onCancel: () => void;
}

export const TriggerForm: React.FC<TriggerFormProps> = ({
  trigger,
  familyMembers,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<SimpleTrigger>>({
    name: '',
    type: 'trip',
    checkInInterval: 15,
    emergencyContacts: [],
    reciprocalParty: undefined,
    isActive: true,
    ...trigger
  });

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize date/time fields from existing trigger
  useEffect(() => {
    if (trigger?.startTime) {
      const start = new Date(trigger.startTime);
      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
    }
    if (trigger?.endTime) {
      const end = new Date(trigger.endTime);
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0, 5));
    }
  }, [trigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!startDate || !startTime) {
      newErrors.start = 'Start date and time are required';
    }
    
    if (!endDate || !endTime) {
      newErrors.end = 'End date and time are required';
    }
    
    if (formData.emergencyContacts!.length === 0) {
      newErrors.contacts = 'At least one emergency contact is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Combine date and time
    const startTimestamp = new Date(`${startDate}T${startTime}`).getTime();
    const endTimestamp = new Date(`${endDate}T${endTime}`).getTime();
    
    if (endTimestamp <= startTimestamp) {
      setErrors({ end: 'End time must be after start time' });
      return;
    }
    
    const completeTrigger: SimpleTrigger = {
      id: trigger?.id || `trigger_${Date.now()}`,
      name: formData.name!.trim(),
      type: formData.type!,
      startTime: startTimestamp,
      endTime: endTimestamp,
      checkInInterval: formData.checkInInterval! * 60 * 1000, // Convert to milliseconds
      emergencyContacts: formData.emergencyContacts!,
      reciprocalParty: formData.reciprocalParty,
      isActive: formData.isActive!,
      createdAt: trigger?.createdAt || Date.now()
    };
    
    onSave(completeTrigger);
  };

  const handleContactToggle = (contactId: string) => {
    const contacts = formData.emergencyContacts || [];
    if (contacts.includes(contactId)) {
      setFormData({
        ...formData,
        emergencyContacts: contacts.filter(id => id !== contactId)
      });
    } else {
      setFormData({
        ...formData,
        emergencyContacts: [...contacts, contactId]
      });
    }
  };

  const triggerTypeDescriptions = {
    trip: 'One-time trip with check-in points (e.g., taxi ride, visit)',
    periodic: 'Recurring schedule (e.g., daily commute, school run)',
    'one-time': 'Single event (e.g., meeting, appointment)'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {trigger ? 'Edit Safety Trigger' : 'Create Safety Trigger'}
              </h2>
              <p className="text-sm text-gray-600">Set up automatic safety check-ins</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Trigger Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trigger Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Commute, School Run"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> {errors.name}
              </p>
            )}
          </div>

          {/* Trigger Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Trigger Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['trip', 'periodic', 'one-time'] as TriggerType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.type === type
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 capitalize mb-1">
                    {type === 'one-time' ? 'One Time' : type}
                  </div>
                  <div className="text-xs text-gray-600">
                    {triggerTypeDescriptions[type]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          {errors.start && (
            <p className="text-sm text-red-600 flex items-center -mt-3">
              <AlertCircle className="h-4 w-4 mr-1" /> {errors.start}
            </p>
          )}

          {/* End Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                End Time *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          {errors.end && (
            <p className="text-sm text-red-600 flex items-center -mt-3">
              <AlertCircle className="h-4 w-4 mr-1" /> {errors.end}
            </p>
          )}

          {/* Check-in Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Interval
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={formData.checkInInterval}
                onChange={(e) => setFormData({
                  ...formData,
                  checkInInterval: parseInt(e.target.value)
                })}
                className="flex-1"
              />
              <div className="text-lg font-semibold text-indigo-600 min-w-[80px] text-right">
                {formData.checkInInterval} min
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You&apos;ll be reminded to check in every {formData.checkInInterval} minutes
            </p>
          </div>

          {/* Emergency Contacts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Users className="inline h-4 w-4 mr-1" />
              Emergency Contacts * (Select at least one)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {familyMembers.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                    formData.emergencyContacts?.includes(member.id)
                      ? 'bg-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.emergencyContacts?.includes(member.id)}
                    onChange={() => handleContactToggle(member.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-900">{member.name}</span>
                </label>
              ))}
            </div>
            {errors.contacts && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> {errors.contacts}
              </p>
            )}
          </div>

          {/* Reciprocal Party (for trips) */}
          {formData.type === 'trip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reciprocal Party (Optional)
              </label>
              <select
                value={formData.reciprocalParty || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  reciprocalParty: e.target.value || undefined
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">None (I&apos;ll check in myself)</option>
                {familyMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                If selected, this person will also be prompted to check your safety
              </p>
            </div>
          )}

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Activate Immediately</div>
              <div className="text-sm text-gray-600">
                Start monitoring as soon as you save this trigger
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({
                  ...formData,
                  isActive: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>{trigger ? 'Update Trigger' : 'Create Trigger'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TriggerForm;
