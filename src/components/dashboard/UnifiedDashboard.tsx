'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useLayoutContext, DashboardContext } from './useLayoutContext';
import { WidgetConfig } from './types';
import {
  WelcomeWidget,
  EcosystemHealthWidget,
  ProjectTimelineWidget,
  CareerProgressWidget,
  GamificationWidget,
} from './widgets';
import { Menu, X } from 'lucide-react';
import { Shield } from 'lucide-react';

interface GridPosition {
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

/**
 * UnifiedDashboard Component
 *
 * Main dashboard container that:
 * - Manages responsive 12-column grid
 * - Switches between contexts (personal/professional/family/admin)
 * - Shows/hides widgets based on context and user preferences
 * - Handles loading and error states per widget
 * - Supports dark mode
 * - Fully responsive (mobile/tablet/desktop)
 */

export const UnifiedDashboard: React.FC = () => {
  const {
    currentContext,
    setContext,
    sidebarCollapsed,
    toggleSidebar,
    darkMode,
    kidsMode,
    hiddenWidgets,
    isLoading: prefsLoading,
  } = useLayoutContext();

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Widget configuration with grid positions for each context
  const widgetConfigs: Record<DashboardContext, WidgetConfig[]> = useMemo(
    () => ({
      personal: [
        {
          id: 'welcome',
          title: 'Welcome',
          component: WelcomeWidget,
          description: 'Daily greeting and motivation',
          position: { x: 0, y: 0, width: isMobile ? 12 : 6, height: 2 },
          context: 'personal',
        },
        {
          id: 'ecosystem-health',
          title: 'Ecosystem Health',
          component: EcosystemHealthWidget,
          description: 'System and family overview',
          position: { x: isMobile ? 0 : 6, y: isMobile ? 2 : 0, width: 6, height: 2 },
          context: 'personal',
        },
        {
          id: 'gamification',
          title: 'Trust & Achievements',
          component: GamificationWidget,
          description: 'Your achievements and trust score',
          position: { x: 0, y: isMobile ? 4 : 2, width: isMobile ? 12 : 6, height: 3 },
          context: 'personal',
        },
        {
          id: 'career-progress',
          title: 'Career Progress',
          component: CareerProgressWidget,
          description: 'Career growth tracking',
          position: { x: isMobile ? 0 : 6, y: isMobile ? 7 : 2, width: 6, height: 3 },
          context: 'personal',
        },
      ],
      business: [
        {
          id: 'welcome',
          title: 'Welcome',
          component: WelcomeWidget,
          description: 'Daily greeting and motivation',
          position: { x: 0, y: 0, width: isMobile ? 12 : 6, height: 2 },
          context: 'business',
        },
        {
          id: 'project-timeline',
          title: 'Project Timeline',
          component: ProjectTimelineWidget,
          description: 'Upcoming milestones and deadlines',
          position: { x: isMobile ? 0 : 6, y: isMobile ? 2 : 0, width: 6, height: 3 },
          context: 'business',
        },
        {
          id: 'career-progress',
          title: 'Career Progress',
          component: CareerProgressWidget,
          description: 'Career growth tracking',
          position: { x: 0, y: isMobile ? 5 : 3, width: isMobile ? 12 : 6, height: 3 },
          context: 'business',
        },
        {
          id: 'ecosystem-health',
          title: 'Ecosystem Health',
          component: EcosystemHealthWidget,
          description: 'System and team overview',
          position: { x: isMobile ? 0 : 6, y: isMobile ? 8 : 3, width: 6, height: 2 },
          context: 'business',
        },
      ],
      family: [
        {
          id: 'welcome',
          title: 'Welcome',
          component: WelcomeWidget,
          description: 'Family greeting',
          position: { x: 0, y: 0, width: isMobile ? 12 : 8, height: 2 },
          context: 'family',
        },
        {
          id: 'ecosystem-health',
          title: 'Family Overview',
          component: EcosystemHealthWidget,
          description: 'Family members and activities',
          position: { x: isMobile ? 0 : 8, y: isMobile ? 2 : 0, width: 4, height: 2 },
          context: 'family',
        },
        {
          id: 'gamification',
          title: 'Family Achievements',
          component: GamificationWidget,
          description: 'Family milestones and bonding',
          position: { x: 0, y: isMobile ? 4 : 2, width: isMobile ? 12 : 6, height: 3 },
          context: 'family',
        },
      ],
      admin: [
        {
          id: 'welcome',
          title: 'Welcome',
          component: WelcomeWidget,
          description: 'Admin dashboard',
          position: { x: 0, y: 0, width: isMobile ? 12 : 6, height: 2 },
          context: 'admin',
        },
        {
          id: 'ecosystem-health',
          title: 'System Health',
          component: EcosystemHealthWidget,
          description: 'Complete system overview',
          position: { x: isMobile ? 0 : 6, y: isMobile ? 2 : 0, width: 6, height: 2 },
          context: 'admin',
        },
        {
          id: 'project-timeline',
          title: 'Projects & Timeline',
          component: ProjectTimelineWidget,
          description: 'All project tracking',
          position: { x: 0, y: isMobile ? 4 : 2, width: isMobile ? 12 : 6, height: 3 },
          context: 'admin',
        },
        {
          id: 'gamification',
          title: 'System Metrics',
          component: GamificationWidget,
          description: 'Performance metrics',
          position: { x: isMobile ? 0 : 6, y: isMobile ? 7 : 2, width: 6, height: 3 },
          context: 'admin',
        },
      ],
    }),
    [isMobile]
  );

  // Get widgets for current context, filtered by visibility
  const visibleWidgets = useMemo(() => {
    const contextWidgets = widgetConfigs[currentContext] || [];
    return contextWidgets.filter((w) => !hiddenWidgets.includes(w.id));
  }, [currentContext, widgetConfigs, hiddenWidgets]);

  // Calculate grid layout positions
  const getGridPosition = (position: GridPosition): React.CSSProperties => {
    if (isMobile) {
      return {
        gridColumn: '1 / -1',
        gridRow: 'auto',
      };
    }
    return {
      gridColumn: `${position.colStart + 1} / span ${position.colSpan}`,
      gridRow: `${position.rowStart + 1} / span ${position.rowSpan}`,
    };
  };

  // Context switcher buttons
  const contextButtons: Array<{ context: DashboardContext; label: string; icon: React.ReactNode }> = [
    { context: 'personal', label: 'Personal', icon: '👤' },
    { context: 'business', label: 'Professional', icon: '💼' },
    { context: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { context: 'admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <div
      className={`unified-dashboard min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </button>

            {/* Branding */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-semibold">Salatiso Ecosystem</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Your personalised view through the Mlandeli Notemba Intranet</div>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Kids Mode Badge */}
              {kidsMode && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  👶 Kids Mode
                </span>
              )}

              {/* Admin Badge */}
              {currentContext === 'admin' && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </span>
              )}
            </div>
          </div>

          {/* Context Switcher - Mobile Horizontal Scroll, Desktop Inline */}
          <div className={`mt-4 overflow-x-auto pb-2 ${isMobile ? 'flex space-x-2' : 'hidden'}`}>
            <div className="flex space-x-2 min-w-max md:min-w-0">
              {contextButtons.map(({ context, label, icon }) => (
                <button
                  key={context}
                  onClick={() => setContext(context)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    currentContext === context
                      ? darkMode
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-500 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <span className="mr-1">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Context Switcher - Desktop */}
          <div className="hidden md:flex mt-4 space-x-2">
            {contextButtons.map(({ context, label, icon }) => (
              <button
                key={context}
                onClick={() => setContext(context)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentContext === context
                    ? darkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {prefsLoading ? (
          // Loading state
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full"></div>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading dashboard...
              </p>
            </div>
          </div>
        ) : visibleWidgets.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No widgets to display
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enable widgets in your dashboard preferences
            </p>
          </div>
        ) : (
          // Responsive grid layout
          <div
            className="dashboard-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                ? 'repeat(8, 1fr)'
                : 'repeat(12, 1fr)',
              gap: isMobile ? '1rem' : '1.5rem',
              gridAutoRows: 'auto',
            } as React.CSSProperties}
          >
            {visibleWidgets.map((widget) => {
              const Widget = widget.component;
              const pos = widget.position;

              return (
                <div
                  key={widget.id}
                  style={getGridPosition({
                    colStart: pos.x,
                    colSpan: isMobile ? 12 : isTablet ? pos.width * (8 / 12) : pos.width,
                    rowStart: pos.y,
                    rowSpan: pos.height,
                  })}
                  className={`
                    rounded-xl transition-all duration-300
                    ${darkMode ? 'dark' : ''}
                  `}
                >
                  <Widget />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t mt-12 transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <p
            className={`text-center text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            © 2025 Salatiso Ecosystem. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedDashboard;
