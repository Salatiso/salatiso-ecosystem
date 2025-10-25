'use client';

import React, { ReactNode } from 'react';
import { useLayoutContext } from './useLayoutContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout Component
 * 
 * Responsive layout wrapper for the unified dashboard.
 * Manages sidebar state, responsive grid, and overall page structure.
 * 
 * Features:
 * - Desktop: Sidebar + content area side-by-side
 * - Tablet: Collapsible sidebar with toggle button
 * - Mobile: Hamburger menu with overlay drawer
 * - Smooth transitions between states
 * - Firestore-persisted preferences
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { sidebarCollapsed, toggleSidebar, darkMode } = useLayoutContext();

  return (
    <div 
      className={`dashboard-layout ${darkMode ? 'dark-mode' : 'light-mode'}`}
      data-testid="dashboard-layout"
    >
      {/* Main grid container */}
      <div className="dashboard-container">
        {/* Overlay backdrop for mobile - shows when sidebar is open */}
        {!sidebarCollapsed && (
          <div 
            className="sidebar-backdrop"
            onClick={toggleSidebar}
            role="button"
            tabIndex={-1}
            aria-hidden="true"
            data-testid="sidebar-backdrop"
          />
        )}

        {/* Content area - main dashboard content */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
