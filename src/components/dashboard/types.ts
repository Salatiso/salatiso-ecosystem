/**
 * Dashboard Type Definitions
 * Centralized types for unified dashboard system
 */

// Context Types
export type ContextType = 'personal' | 'business' | 'family' | 'admin';

export interface DashboardContext {
  type: ContextType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

// Widget Types
export interface WidgetPosition {
  x: number; // column (0-11 for 12-column grid)
  y: number; // row
  width: number; // columns wide (1-12)
  height: number; // rows tall
}

export interface WidgetConfig {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  description: string;
  position: WidgetPosition;
  context: ContextType | ContextType[]; // which contexts show this widget
  props?: Record<string, any>;
  refreshInterval?: number; // ms, 0 for no refresh
  cacheKey?: string; // for persistent widget data
}

// Layout Types
export interface LayoutConfig {
  context: ContextType;
  widgets: WidgetConfig[];
  gridCols: number; // responsive column counts
  gridRows: number;
  gap: number; // spacing between widgets (px)
}

export interface ResponsiveBreakpoint {
  name: 'mobile' | 'tablet' | 'desktop';
  width: number; // min-width in px
  cols: number; // grid columns
  rows: number; // grid rows
  gap: number; // grid gap
}

// Dashboard State
export interface DashboardState {
  currentContext: ContextType;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  kidsMode: boolean;
  activeModule?: string;
  loadingWidgets: Set<string>;
  errorWidgets: Set<string>;
}

// User Preferences (persisted)
export interface DashboardPreferences {
  userId: string;
  preferredContext: ContextType;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  widgetOrder: Record<ContextType, string[]>; // widget IDs in order
  hiddenWidgets: Record<ContextType, string[]>; // hidden widget IDs
  lastUpdated: number; // timestamp
}

// Navigation Items
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  children?: NavItem[];
  hidden?: boolean;
  badge?: number | string;
}

// Module Navigation
export interface ModuleNav {
  name: string;
  icon: string;
  items: NavItem[];
}

// Context Switcher Config
export interface ContextConfig {
  id: ContextType;
  label: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  hoverColor: string;
  permissions: string[];
  modules: string[];
}

// Widget Error State
export interface WidgetError {
  widgetId: string;
  error: Error;
  timestamp: number;
  retryCount: number;
}

// Dashboard Events
export type DashboardEventType = 
  | 'context-changed'
  | 'widget-loaded'
  | 'widget-error'
  | 'sidebar-toggled'
  | 'theme-changed'
  | 'preferences-saved';

export interface DashboardEvent {
  type: DashboardEventType;
  payload: any;
  timestamp: number;
}
