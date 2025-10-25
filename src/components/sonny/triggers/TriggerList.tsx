// Trigger List Component - Display all triggers with filtering
// Manages trigger CRUD operations

import React, { useState } from 'react';
import { Plus, Filter, Calendar } from 'lucide-react';
import { SimpleTrigger, TriggerType } from './TriggerForm';
import { TriggerCard } from './TriggerCard';

interface TriggerListProps {
  triggers: SimpleTrigger[];
  familyMembers: Array<{ id: string; name: string }>;
  onCreateClick: () => void;
  onEdit: (trigger: SimpleTrigger) => void;
  onDelete: (triggerId: string) => void;
  onToggleActive: (triggerId: string) => void;
  onCheckIn: (triggerId: string) => void;
}

type FilterType = 'all' | 'active' | 'scheduled' | 'completed' | 'inactive';

export const TriggerList: React.FC<TriggerListProps> = ({
  triggers,
  familyMembers,
  onCreateClick,
  onEdit,
  onDelete,
  onToggleActive,
  onCheckIn
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<TriggerType | 'all'>('all');

  const getFilteredTriggers = () => {
    const now = Date.now();
    
    let filtered = triggers;

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(t =>
          t.isActive && now >= t.startTime && now <= t.endTime
        );
        break;
      case 'scheduled':
        filtered = filtered.filter(t =>
          t.isActive && now < t.startTime
        );
        break;
      case 'completed':
        filtered = filtered.filter(t => now > t.endTime);
        break;
      case 'inactive':
        filtered = filtered.filter(t => !t.isActive);
        break;
      // 'all' shows everything
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Sort: active first, then by start time
    return filtered.sort((a, b) => {
      const aActive = a.isActive && now >= a.startTime && now <= a.endTime;
      const bActive = b.isActive && now >= b.startTime && now <= b.endTime;
      
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      
      return b.startTime - a.startTime; // Newest first
    });
  };

  const filteredTriggers = getFilteredTriggers();

  const getCounts = () => {
    const now = Date.now();
    return {
      all: triggers.length,
      active: triggers.filter(t =>
        t.isActive && now >= t.startTime && now <= t.endTime
      ).length,
      scheduled: triggers.filter(t =>
        t.isActive && now < t.startTime
      ).length,
      completed: triggers.filter(t => now > t.endTime).length,
      inactive: triggers.filter(t => !t.isActive).length
    };
  };

  const counts = getCounts();

  const filterButtons: Array<{ key: FilterType; label: string; color: string }> = [
    { key: 'all', label: `All (${counts.all})`, color: 'gray' },
    { key: 'active', label: `Active (${counts.active})`, color: 'green' },
    { key: 'scheduled', label: `Scheduled (${counts.scheduled})`, color: 'blue' },
    { key: 'completed', label: `Completed (${counts.completed})`, color: 'gray' },
    { key: 'inactive', label: `Inactive (${counts.inactive})`, color: 'red' }
  ];

  const typeButtons: Array<{ key: TriggerType | 'all'; label: string; icon: string }> = [
    { key: 'all', label: 'All Types', icon: '📋' },
    { key: 'trip', label: 'Trips', icon: '🚗' },
    { key: 'periodic', label: 'Periodic', icon: '🔄' },
    { key: 'one-time', label: 'One Time', icon: '📅' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Safety Triggers</h2>
          <p className="text-gray-600 mt-1">Manage automatic safety check-ins and monitoring</p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Trigger</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Status Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${
                  filter === key
                    ? `border-${color}-500 bg-${color}-50 text-${color}-700 font-medium`
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by Type</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {typeButtons.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1 text-sm rounded-full border-2 transition-colors flex items-center space-x-1 ${
                  typeFilter === key
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Triggers Grid */}
      {filteredTriggers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {triggers.length === 0 ? 'No Triggers Yet' : 'No Matching Triggers'}
          </h3>
          <p className="text-gray-600 mb-6">
            {triggers.length === 0
              ? 'Create your first safety trigger to start automatic check-ins'
              : 'Try adjusting your filters to see more triggers'}
          </p>
          {triggers.length === 0 && (
            <button
              onClick={onCreateClick}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Trigger</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTriggers.map((trigger) => (
            <TriggerCard
              key={trigger.id}
              trigger={trigger}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              onCheckIn={onCheckIn}
              familyMembers={familyMembers}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredTriggers.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredTriggers.length} of {triggers.length} trigger{triggers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TriggerList;
