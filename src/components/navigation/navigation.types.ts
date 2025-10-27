/**
 * Navigation Type Definitions
 * Enhanced Sidebar Navigation - Technical Specification
 * Date: October 26, 2025
 */

import { LucideIcon } from 'lucide-react';

/**
 * Badge types for feature clarity
 */
export type BadgeType = 'core' | 'mesh' | 'mni' | 'external' | 'new';

/**
 * Navigation item configuration
 */
export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: {
    text: string;
    type: BadgeType;
  };
  external?: boolean; // Opens in new tab
  description?: string;
  disabled?: boolean;
}

/**
 * Navigation section configuration
 */
export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  standalone?: boolean; // Not collapsible
  items?: NavItem[];
  description?: string;
}

/**
 * Navigation state
 */
export interface NavigationState {
  expandedSections: Record<string, boolean>;
  activeItem: string | null;
  activePath?: string;
}

/**
 * Navigation context configuration
 */
export type NavigationContext = 'individual' | 'family' | 'professional' | 'community';

/**
 * Calendar link builder
 */
export const buildCalendarLink = (context: NavigationContext): string => {
  return `/intranet/calendar?context=${context}`;
};

/**
 * Assets link builder
 */
export const buildAssetLink = (context?: NavigationContext): string => {
  if (context) {
    return `/intranet/assets?context=${context}`;
  }
  return `/intranet/assets`;
};

/**
 * Projects link builder
 */
export const buildProjectLink = (context?: NavigationContext): string => {
  if (context) {
    return `/intranet/projects?context=${context}`;
  }
  return `/intranet/projects`;
};
