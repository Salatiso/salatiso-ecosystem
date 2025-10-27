/**
 * Enhanced Sidebar Component
 * New navigation structure with context-aware sections
 * Date: October 26, 2025
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import clsx from 'clsx';

import { NAV_STRUCTURE, getMainNavSections, getBottomNavSections } from '@/config/navigation.config';
import NavSection from './NavSection';
import { useNavigation } from '@/hooks/useNavigation';

interface EnhancedSidebarProps {
  /**
   * Called when logout is clicked
   */
  onLogout?: () => void | Promise<void>;
  /**
   * Additional className for the sidebar container
   */
  className?: string;
  /**
   * Whether sidebar starts open on mobile
   */
  defaultOpen?: boolean;
}

/**
 * Enhanced Sidebar Navigation Component
 * Features:
 * - Collapsible sections (Personal, Family, Professional, Communities, Common Tools)
 * - Context-aware calendar and assets links
 * - Mobile responsive with drawer
 * - Persistent state to localStorage
 * - Full accessibility support
 */
export const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  onLogout,
  className,
  defaultOpen = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { state, isInitialized, toggleSection, setActiveItem } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get navigation sections
  const mainSections = getMainNavSections();
  const bottomSections = getBottomNavSections();

  /**
   * Update active path when pathname changes
   */
  useEffect(() => {
    if (isInitialized) {
      setActiveItem(pathname, pathname);
    }
  }, [pathname, isInitialized, setActiveItem]);

  /**
   * Handle responsive behavior
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Close mobile drawer when route changes
   */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /**
   * Handle navigation
   */
  const handleNavigate = (path: string) => {
    if (!path.startsWith('http')) {
      router.push(path);
    }
    setMobileOpen(false);
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * Sidebar Content
   */
  const sidebarContent = (
    <aside
      className={clsx(
        'flex flex-col h-full bg-slate-800/95 border-r border-slate-700',
        'overflow-y-auto overflow-x-hidden',
        className
      )}
    >
      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
        {mainSections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            isExpanded={state.expandedSections[section.id] ?? false}
            onToggle={toggleSection}
            onNavigate={handleNavigate}
            activePath={state.activePath}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-slate-700/50 my-2" />

      {/* Bottom Navigation */}
      <nav className="px-3 py-4 space-y-1" aria-label="Secondary navigation">
        {bottomSections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            isExpanded={state.expandedSections[section.id] ?? false}
            onToggle={toggleSection}
            onNavigate={handleNavigate}
            activePath={state.activePath}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-700/50 p-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={clsx(
            'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg',
            'text-slate-300 hover:text-white hover:bg-slate-700/50',
            'transition-all duration-150',
            'font-medium text-sm',
            isLoggingOut && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Logout"
          title="Logout from LifeCV"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700/50 text-center">
        <p className="text-xs text-slate-400">
          LifeCV v4.0 • Ecosystem
        </p>
      </div>
    </aside>
  );

  // Desktop: Always visible
  if (!isMobile) {
    return (
      <div className="hidden lg:block h-screen w-72 flex-shrink-0">
        {sidebarContent}
      </div>
    );
  }

  // Tablet/Mobile: Collapsible drawer
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={clsx(
          'lg:hidden fixed top-4 left-4 z-50',
          'p-2 rounded-lg',
          'bg-slate-800 text-slate-200 hover:bg-slate-700',
          'transition-colors duration-150'
        )}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={clsx(
              'fixed inset-y-0 left-0 z-40 w-64 lg:hidden',
              'transition-transform duration-200',
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}
            role="navigation"
            aria-label="Mobile navigation"
          >
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

/**
 * Export for use in layouts
 */
export default EnhancedSidebar;
