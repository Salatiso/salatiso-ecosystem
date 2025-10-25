import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Save, Trash2, History } from 'lucide-react';
import { format } from 'date-fns';

interface SearchFilter {
  id: string;
  name: string;
  fields: {
    searchText: string;
    priority: string[];
    status: string[];
    assignedTo: string[];
    dateRange: { start: Date; end: Date };
  };
  createdAt: Date;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: SearchFilter['fields'];
  createdAt: Date;
}

interface EscalationRecord {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'escalated' | 'resolved';
  assignedTo: string;
  createdAt: Date;
}

const AdvancedSearchComponent: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilter['fields']>({
    searchText: '',
    priority: [],
    status: [],
    assignedTo: [],
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 30)),
      end: new Date(),
    },
  });

  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>([
    {
      id: 'preset-1',
      name: 'Critical Issues',
      filters: {
        searchText: '',
        priority: ['critical', 'high'],
        status: ['open', 'escalated'],
        assignedTo: [],
        dateRange: {
          start: new Date(new Date().setDate(new Date().getDate() - 7)),
          end: new Date(),
        },
      },
      createdAt: new Date('2025-10-20'),
    },
    {
      id: 'preset-2',
      name: 'Resolved This Month',
      filters: {
        searchText: '',
        priority: [],
        status: ['resolved'],
        assignedTo: [],
        dateRange: {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          end: new Date(),
        },
      },
      createdAt: new Date('2025-10-18'),
    },
  ]);

  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; timestamp: Date }>>([
    { query: 'database error', timestamp: new Date('2025-10-22T14:30:00') },
    { query: 'authentication', timestamp: new Date('2025-10-22T13:15:00') },
    { query: 'sync failure', timestamp: new Date('2025-10-22T11:45:00') },
  ]);

  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'presets' | 'history'>('search');

  // Mock data
  const mockRecords: EscalationRecord[] = [
    {
      id: 'ESC-001',
      title: 'Critical System Outage',
      description: 'Database connection failure in production environment',
      priority: 'critical',
      status: 'escalated',
      assignedTo: 'Senior Engineer',
      createdAt: new Date('2025-10-15'),
    },
    {
      id: 'ESC-002',
      title: 'Data Sync Issue',
      description: 'Real-time sync failing for mobile clients',
      priority: 'high',
      status: 'assigned',
      assignedTo: 'Mobile Team',
      createdAt: new Date('2025-10-16'),
    },
    {
      id: 'ESC-003',
      title: 'User Authentication Failure',
      description: 'OAuth2 provider integration broken',
      priority: 'high',
      status: 'resolved',
      assignedTo: 'Auth Team',
      createdAt: new Date('2025-10-14'),
    },
    {
      id: 'ESC-004',
      title: 'API Rate Limiting',
      description: 'External API requests being throttled',
      priority: 'medium',
      status: 'assigned',
      assignedTo: 'Backend Team',
      createdAt: new Date('2025-10-12'),
    },
    {
      id: 'ESC-005',
      title: 'UI Rendering Issue',
      description: 'Dashboard components not loading correctly',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Frontend Team',
      createdAt: new Date('2025-10-11'),
    },
    {
      id: 'ESC-006',
      title: 'Email Notification Delay',
      description: 'Email service experiencing delays',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'DevOps',
      createdAt: new Date('2025-10-10'),
    },
  ];

  // Apply filters
  const filteredResults = useMemo(() => {
    return mockRecords.filter(record => {
      // Text search
      if (searchFilters.searchText) {
        const query = searchFilters.searchText.toLowerCase();
        if (
          !record.title.toLowerCase().includes(query) &&
          !record.description.toLowerCase().includes(query) &&
          !record.id.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Priority filter
      if (searchFilters.priority.length > 0 && !searchFilters.priority.includes(record.priority)) {
        return false;
      }

      // Status filter
      if (searchFilters.status.length > 0 && !searchFilters.status.includes(record.status)) {
        return false;
      }

      // Assigned to filter
      if (searchFilters.assignedTo.length > 0 && !searchFilters.assignedTo.includes(record.assignedTo)) {
        return false;
      }

      // Date range filter
      if (
        record.createdAt < searchFilters.dateRange.start ||
        record.createdAt > searchFilters.dateRange.end
      ) {
        return false;
      }

      return true;
    });
  }, [searchFilters]);

  const handleTogglePriority = (priority: string) => {
    setSearchFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority],
    }));
  };

  const handleToggleStatus = (status: string) => {
    setSearchFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleToggleAssignee = (assignee: string) => {
    setSearchFilters(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(assignee)
        ? prev.assignedTo.filter(a => a !== assignee)
        : [...prev.assignedTo, assignee],
    }));
  };

  const handleSearch = (text: string) => {
    setSearchFilters(prev => ({ ...prev, searchText: text }));
    if (text.trim()) {
      setSearchHistory(prev => [
        { query: text, timestamp: new Date() },
        ...prev.slice(0, 9),
      ]);
    }
  };

  const savePreset = () => {
    if (presetName.trim()) {
      setSavedPresets(prev => [
        ...prev,
        {
          id: `preset-${Date.now()}`,
          name: presetName,
          filters: searchFilters,
          createdAt: new Date(),
        },
      ]);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const loadPreset = (preset: FilterPreset) => {
    setSearchFilters(preset.filters);
  };

  const deletePreset = (id: string) => {
    setSavedPresets(prev => prev.filter(p => p.id !== id));
  };

  const clearFilters = () => {
    setSearchFilters({
      searchText: '',
      priority: [],
      status: [],
      assignedTo: [],
      dateRange: {
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date(),
      },
    });
  };

  const allAssignees = [...new Set(mockRecords.map(r => r.assignedTo))];
  const activeFilterCount = [
    searchFilters.searchText ? 1 : 0,
    searchFilters.priority.length,
    searchFilters.status.length,
    searchFilters.assignedTo.length,
  ].reduce((a, b) => a + b, 0);

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Search className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Advanced Search</h2>
            <p className="text-sm text-gray-600">Find escalations with powerful filtering</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-700">{filteredResults.length}</p>
          <p className="text-sm text-gray-600">Results Found</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        {(['search', 'presets', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'presets' && ` (${savedPresets.length})`}
            {tab === 'history' && ` (${searchHistory.length})`}
          </button>
        ))}
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, or ID..."
              value={searchFilters.searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">{activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Filter Panels */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            {/* Priority Filter */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Priority</h3>
              <div className="grid grid-cols-2 gap-2">
                {['critical', 'high', 'medium', 'low'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => handleTogglePriority(priority)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      searchFilters.priority.includes(priority)
                        ? `${priorityColor(priority)} border-opacity-100`
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {['open', 'assigned', 'escalated', 'resolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleToggleStatus(status)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      searchFilters.status.includes(status)
                        ? `${statusColor(status)} border-opacity-100`
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Assigned To Filter */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Assigned To</h3>
              <div className="grid grid-cols-2 gap-2">
                {allAssignees.map(assignee => (
                  <button
                    key={assignee}
                    onClick={() => handleToggleAssignee(assignee)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all text-left truncate ${
                      searchFilters.assignedTo.includes(assignee)
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {assignee}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Date Range</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">From</label>
                  <input
                    type="date"
                    value={format(searchFilters.dateRange.start, 'yyyy-MM-dd')}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: new Date(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">To</label>
                  <input
                    type="date"
                    value={format(searchFilters.dateRange.end, 'yyyy-MM-dd')}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: new Date(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Search Results ({filteredResults.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredResults.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No records match your search criteria</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredResults.map(record => (
                    <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{record.title}</p>
                          <p className="text-sm text-gray-600">{record.description}</p>
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${priorityColor(record.priority)}`}>
                          {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{record.id}</span>
                        <span className={`px-2 py-1 rounded ${statusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                        <span>{record.assignedTo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Current Search as Preset */}
          {!showSavePreset && (
            <button
              onClick={() => setShowSavePreset(true)}
              className="w-full py-2 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Current Search as Preset</span>
            </button>
          )}

          {showSavePreset && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <input
                type="text"
                placeholder="Enter preset name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={savePreset}
                  className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Save Preset
                </button>
                <button
                  onClick={() => setShowSavePreset(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          {savedPresets.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              <Save className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No saved presets yet</p>
            </div>
          ) : (
            savedPresets.map(preset => (
              <div key={preset.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{preset.name}</p>
                  <p className="text-xs text-gray-600">Created {format(preset.createdAt, 'MMM dd, yyyy')}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => loadPreset(preset)}
                    className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-sm font-medium"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {searchHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No search history</p>
            </div>
          ) : (
            searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSearch(item.query)}
                className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.query}</p>
                  <p className="text-xs text-gray-500">{format(item.timestamp, 'MMM dd, HH:mm')}</p>
                </div>
                <History className="w-4 h-4 text-gray-400" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchComponent;
