/**
 * Toolkit Context Tabs System
 * Phase 5 - STEP 10
 * Context switching, unified filtering, cross-context navigation
 */

'use client';

import React, { useState, useContext, createContext } from 'react';
import {
  User,
  Users,
  Zap,
  Briefcase,
  Filter,
  Settings,
  ChevronDown,
  Check,
  Search,
  X,
  Plus,
  MoreVertical,
  Share2,
  Archive,
} from 'lucide-react';

// ===== Context Types =====

export type ToolkitContext = 'individual' | 'family' | 'community' | 'professional';
export type ToolType = 'tracker' | 'planner' | 'organizer' | 'communicator' | 'analyzer';

export interface ToolkitTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: ToolType;
  contexts: ToolkitContext[];
  description: string;
  features: string[];
}

export interface ContextTabsState {
  selectedContext: ToolkitContext;
  selectedTools: Set<string>;
  filters: {
    toolType?: ToolType;
    search?: string;
    archived?: boolean;
  };
}

// ===== Context API =====

interface ToolkitContextType {
  state: ContextTabsState;
  setContext: (context: ToolkitContext) => void;
  toggleTool: (toolId: string) => void;
  setFilter: (filter: Partial<ContextTabsState['filters']>) => void;
  clearFilters: () => void;
}

const ToolkitContextAPI = createContext<ToolkitContextType | undefined>(undefined);

export const ToolkitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ContextTabsState>({
    selectedContext: 'individual',
    selectedTools: new Set(),
    filters: {},
  });

  const setContext = (context: ToolkitContext) => {
    setState((prev) => ({
      ...prev,
      selectedContext: context,
      selectedTools: new Set(),
    }));
  };

  const toggleTool = (toolId: string) => {
    setState((prev) => {
      const newTools = new Set(prev.selectedTools);
      if (newTools.has(toolId)) {
        newTools.delete(toolId);
      } else {
        newTools.add(toolId);
      }
      return { ...prev, selectedTools: newTools };
    });
  };

  const setFilter = (filter: Partial<ContextTabsState['filters']>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filter },
    }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      filters: {},
    }));
  };

  return (
    <ToolkitContextAPI.Provider
      value={{ state, setContext, toggleTool, setFilter, clearFilters }}
    >
      {children}
    </ToolkitContextAPI.Provider>
  );
};

export const useToolkit = () => {
  const context = useContext(ToolkitContextAPI);
  if (!context) {
    throw new Error('useToolkit must be used within ToolkitProvider');
  }
  return context;
};

// ===== Tool Registry =====

export const TOOLKIT_TOOLS: ToolkitTool[] = [
  // Individual Tools
  {
    id: 't1',
    name: 'Personal XP Tracker',
    icon: <Zap className="w-5 h-5" />,
    type: 'tracker',
    contexts: ['individual'],
    description: 'Track personal growth, achievements, and experience points',
    features: ['XP tracking', 'Achievements', 'Milestones', 'Progress insights'],
  },
  {
    id: 't2',
    name: 'Life Goals Planner',
    icon: <Settings className="w-5 h-5" />,
    type: 'planner',
    contexts: ['individual'],
    description: 'Plan and track life goals across timescales',
    features: ['Goal setting', '103-year arc', 'Milestones', 'Review system'],
  },
  {
    id: 't3',
    name: 'Personal Dashboard',
    icon: <User className="w-5 h-5" />,
    type: 'analyzer',
    contexts: ['individual'],
    description: 'View personal metrics and analytics',
    features: ['Metrics', 'Charts', 'Reports', 'Trends'],
  },

  // Family Tools
  {
    id: 't4',
    name: 'Family Hub',
    icon: <Users className="w-5 h-5" />,
    type: 'communicator',
    contexts: ['family'],
    description: 'Central hub for family communication and coordination',
    features: ['Messages', 'Events', 'Announcements', 'Shared calendar'],
  },
  {
    id: 't5',
    name: 'Household Manager',
    icon: <Filter className="w-5 h-5" />,
    type: 'organizer',
    contexts: ['family'],
    description: 'Manage household tasks, finances, and responsibilities',
    features: ['Tasks', 'Finance', 'Roles', 'Permissions'],
  },
  {
    id: 't6',
    name: 'Family Projects',
    icon: <Briefcase className="w-5 h-5" />,
    type: 'organizer',
    contexts: ['family'],
    description: 'Organize and track family initiatives and projects',
    features: ['Kanban board', 'Timeline', 'Team assignment', 'Progress tracking'],
  },

  // Community Tools
  {
    id: 't7',
    name: 'Community Network',
    icon: <Zap className="w-5 h-5" />,
    type: 'communicator',
    contexts: ['community'],
    description: 'Connect with community members and initiatives',
    features: ['Networking', 'Events', 'Collaboration', 'Mesh meetings'],
  },
  {
    id: 't8',
    name: 'Community Projects',
    icon: <Briefcase className="w-5 h-5" />,
    type: 'organizer',
    contexts: ['community'],
    description: 'Coordinate community initiatives and events',
    features: ['Project planning', 'Resource allocation', 'Team coordination'],
  },

  // Professional Tools
  {
    id: 't9',
    name: 'Business Dashboard',
    icon: <Briefcase className="w-5 h-5" />,
    type: 'analyzer',
    contexts: ['professional'],
    description: 'Monitor business metrics and performance',
    features: ['Revenue tracking', 'KPIs', 'Forecasting', 'Reports'],
  },
  {
    id: 't10',
    name: 'Project Management',
    icon: <Filter className="w-5 h-5" />,
    type: 'organizer',
    contexts: ['professional'],
    description: 'Manage professional projects and teams',
    features: ['Kanban', 'Gantt charts', 'Resource planning', 'Budget tracking'],
  },
  {
    id: 't11',
    name: 'Team Collaboration',
    icon: <Users className="w-5 h-5" />,
    type: 'communicator',
    contexts: ['professional'],
    description: 'Collaborate with team members efficiently',
    features: ['Messaging', 'File sharing', 'Meetings', 'Feedback'],
  },
];

// ===== Components =====

/**
 * Context Tab Button
 */
const ContextTab: React.FC<{
  context: ToolkitContext;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ context, selected, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
        selected
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

/**
 * Tool Card for Grid Display
 */
const ToolCard: React.FC<{
  tool: ToolkitTool;
  selected: boolean;
  onToggle: (id: string) => void;
}> = ({ tool, selected, onToggle }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`p-4 rounded-lg border-2 transition cursor-pointer relative group ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
      onClick={() => onToggle(tool.id)}
    >
      {/* Selection Indicator */}
      <div
        className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
          selected
            ? 'bg-blue-600 border-blue-600'
            : 'border-gray-300 bg-white group-hover:border-blue-400'
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>

      {/* Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition"
      >
        <MoreVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </button>

      {/* Tool Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-3 mx-auto">
        <div className="text-blue-600">{tool.icon}</div>
      </div>

      {/* Tool Info */}
      <h3 className="font-semibold text-gray-900 text-center mb-1">{tool.name}</h3>
      <p className="text-xs text-gray-600 text-center mb-3">{tool.description}</p>

      {/* Type Badge */}
      <div className="flex justify-center mb-3">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
          {tool.type}
        </span>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1 justify-center">
        {tool.features.slice(0, 2).map((feature, idx) => (
          <span
            key={idx}
            className="px-1.5 py-0.5 text-xs bg-gray-50 text-gray-600 rounded"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};

/**
 * Filter Sidebar
 */
const FilterSidebar: React.FC<{
  toolTypes: ToolType[];
  selectedType?: ToolType;
  onTypeSelect: (type: ToolType) => void;
  onClearFilters: () => void;
}> = ({ toolTypes, selectedType, onTypeSelect, onClearFilters }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {selectedType && (
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-700 mb-3">Tool Type</p>
        {toolTypes.map((type) => (
          <button
            key={type}
            onClick={() => onTypeSelect(selectedType === type ? undefined! : type)}
            className={`w-full text-left px-3 py-2 rounded text-sm capitalize transition ${
              selectedType === type
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Stats</p>
        <p className="text-xs text-gray-600">
          {TOOLKIT_TOOLS.length} tools available
        </p>
      </div>
    </div>
  );
};

/**
 * Search and Selection Bar
 */
const SelectionBar: React.FC<{
  selectedCount: number;
  onClearSelection: () => void;
  onShare: () => void;
  search: string;
  onSearchChange: (search: string) => void;
}> = ({ selectedCount, onClearSelection, onShare, search, onSearchChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tools..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Selection Status */}
      {selectedCount > 0 ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} selected
          </span>
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <Share2 className="w-4 h-4" />
            Share Setup
          </button>
          <button
            onClick={onClearSelection}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      ) : (
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <Plus className="w-4 h-4" />
          Create Set
        </button>
      )}
    </div>
  );
};

/**
 * Main Toolkit Context Tabs Component
 */
export const ToolkitContextTabs: React.FC = () => {
  const { state, setContext, toggleTool, setFilter, clearFilters } = useToolkit();
  const [search, setSearch] = useState('');

  const contextConfig: Record<
    ToolkitContext,
    { icon: React.ReactNode; label: string }
  > = {
    individual: { icon: <User className="w-5 h-5" />, label: 'Individual' },
    family: { icon: <Users className="w-5 h-5" />, label: 'Family' },
    community: { icon: <Zap className="w-5 h-5" />, label: 'Community' },
    professional: {
      icon: <Briefcase className="w-5 h-5" />,
      label: 'Professional',
    },
  };

  // Filter tools based on context, type, and search
  const filteredTools = TOOLKIT_TOOLS.filter((tool) => {
    const matchesContext = tool.contexts.includes(state.selectedContext);
    const matchesType =
      !state.filters.toolType || tool.type === state.filters.toolType;
    const matchesSearch =
      !search ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());

    return matchesContext && matchesType && matchesSearch;
  });

  const toolTypes: ToolType[] = [
    'tracker',
    'planner',
    'organizer',
    'communicator',
    'analyzer',
  ];

  const handleShare = () => {
    const selectedToolNames = Array.from(state.selectedTools)
      .map((id) => TOOLKIT_TOOLS.find((t) => t.id === id)?.name)
      .join(', ');

    alert(
      `Shared toolkit setup for ${state.selectedContext}:\n${selectedToolNames}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Toolkit</h1>
        <p className="text-sm text-gray-600">
          Customize your tools across different life contexts
        </p>
      </div>

      {/* Context Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(contextConfig) as ToolkitContext[]).map((context) => (
          <ContextTab
            key={context}
            context={context}
            selected={state.selectedContext === context}
            onClick={() => setContext(context)}
            icon={contextConfig[context].icon}
            label={contextConfig[context].label}
          />
        ))}
      </div>

      {/* Search and Selection Bar */}
      <SelectionBar
        selectedCount={state.selectedTools.size}
        onClearSelection={() => {
          state.selectedTools.forEach((id) => toggleTool(id));
        }}
        onShare={handleShare}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <FilterSidebar
          toolTypes={toolTypes}
          selectedType={state.filters.toolType}
          onTypeSelect={(type) => setFilter({ toolType: type })}
          onClearFilters={clearFilters}
        />

        {/* Tools Grid */}
        <div className="lg:col-span-3">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  selected={state.selectedTools.has(tool.id)}
                  onToggle={toggleTool}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">
                {search
                  ? 'No tools match your search'
                  : 'No tools available for this context'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Context Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          💡 Tip: You can customize your toolkit for each context independently.
          Your selection will sync across all ecosystem apps via Sonny's mesh
          network.
        </p>
      </div>
    </div>
  );
};

/**
 * Simplified Toolbar Component (for integration)
 */
export const ToolkitToolbar: React.FC<{ minimal?: boolean }> = ({
  minimal = false,
}) => {
  const { state, setContext } = useToolkit();

  const contextConfig: Record<
    ToolkitContext,
    { icon: React.ReactNode; label: string }
  > = {
    individual: { icon: <User className="w-4 h-4" />, label: 'Me' },
    family: { icon: <Users className="w-4 h-4" />, label: 'Family' },
    community: { icon: <Zap className="w-4 h-4" />, label: 'Community' },
    professional: { icon: <Briefcase className="w-4 h-4" />, label: 'Work' },
  };

  if (minimal) {
    return (
      <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
        {(Object.keys(contextConfig) as ToolkitContext[]).map((context) => (
          <button
            key={context}
            onClick={() => setContext(context)}
            title={contextConfig[context].label}
            className={`p-2 rounded transition ${
              state.selectedContext === context
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {contextConfig[context].icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-2">
      {(Object.keys(contextConfig) as ToolkitContext[]).map((context) => (
        <button
          key={context}
          onClick={() => setContext(context)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition ${
            state.selectedContext === context
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {contextConfig[context].icon}
          {contextConfig[context].label}
        </button>
      ))}
    </div>
  );
};
