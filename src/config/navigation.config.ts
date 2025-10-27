/**
 * Navigation Configuration
 * Enhanced Sidebar Navigation Structure
 * Date: October 26, 2025
 */

import {
  Home,
  User,
  Users,
  Briefcase,
  Globe,
  Wrench,
  FileText,
  Calendar,
  Database,
  BarChart3,
  Code,
  BookOpen,
  Network,
  Lightbulb,
  Zap,
  Settings,
  ExternalLink,
} from 'lucide-react';

import { NavSection } from '../components/navigation/navigation.types';

/**
 * Main navigation structure following user journey flow:
 * 1. Dashboard (Standalone)
 * 2. Personal (Individual activities & identity)
 * 3. Family (Household & family network)
 * 4. Professional (Business operations)
 * 5. Communities (Sonny network & groups)
 * 6. Common Tools (Cross-context utilities)
 * 7. Bottom Section (Settings & Logout)
 */
export const NAV_STRUCTURE: NavSection[] = [
  // ===== DASHBOARD (Standalone) =====
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    standalone: true,
    items: [
      {
        label: 'Dashboard',
        icon: Home,
        path: '/intranet/dashboard',
        description: 'Main dashboard overview',
      },
    ],
  },

  // ===== PERSONAL SECTION =====
  {
    id: 'personal',
    label: 'Personal',
    icon: User,
    description: 'Personal identity & development',
    items: [
      {
        label: 'My Profile',
        icon: User,
        path: '/intranet/profile',
        description: 'Your profile and settings',
      },
      {
        label: 'My Contacts',
        icon: Users,
        path: '/intranet/contacts',
        description: 'Contact management and relationships',
      },
      {
        label: 'My Calendar',
        icon: Calendar,
        path: '/intranet/calendar?context=individual',
        description: 'Personal calendar and events',
      },
      {
        label: 'My Assets',
        icon: Database,
        path: '/intranet/assets?context=individual',
        description: 'Personal assets and inventory',
      },
      {
        label: 'My Projects',
        icon: Briefcase,
        path: '/intranet/projects?context=individual',
        description: 'Personal projects and initiatives',
      },
      {
        label: 'Career Pathways',
        icon: BarChart3,
        path: '/intranet/career',
        badge: { text: 'LifeSync', type: 'external' },
        description: 'Career development and planning',
      },
    ],
  },

  // ===== FAMILY SECTION =====
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    description: 'Family network and household',
    items: [
      {
        label: 'Family Dashboard',
        icon: Home,
        path: '/intranet/family',
        description: 'Family overview and status',
      },
      {
        label: 'Family Tree',
        icon: Users,
        path: '/intranet/family/tree',
        description: 'Auto-generated from contact roles',
      },
      {
        label: 'Family Timeline',
        icon: Calendar,
        path: '/intranet/family/timeline',
        description: 'Family milestones and events',
      },
      {
        label: 'Household Members',
        icon: Users,
        path: '/intranet/contacts?filter=household',
        description: 'Manage household members',
      },
      {
        label: 'Family Calendar',
        icon: Calendar,
        path: '/intranet/calendar?context=family',
        description: 'Shared family calendar',
      },
      {
        label: 'Family Assets',
        icon: Database,
        path: '/intranet/assets?context=family',
        description: 'Household assets and inventory',
      },
      {
        label: 'Family Projects',
        icon: Briefcase,
        path: '/intranet/projects?context=family',
        description: 'Family initiatives and goals',
      },
      {
        label: 'Family Values',
        icon: ExternalLink,
        path: 'https://familyvalue-lifecv.web.app/',
        external: true,
        badge: { text: 'External', type: 'external' },
        description: 'Family values and heritage app',
      },
    ],
  },

  // ===== PROFESSIONAL SECTION =====
  {
    id: 'professional',
    label: 'Professional',
    icon: Briefcase,
    description: 'Business and professional activities',
    items: [
      {
        label: 'Business Dashboard',
        icon: BarChart3,
        path: 'https://bizhelp-lifecv.web.app/',
        external: true,
        badge: { text: 'BizHelp', type: 'external' },
        description: 'Business management ecosystem',
      },
      {
        label: 'Business Operations',
        icon: Wrench,
        path: '/intranet/business/operations',
        description: 'Business operations management',
      },
      {
        label: 'Business Organogram',
        icon: Network,
        path: '/intranet/business/organogram',
        description: 'Organizational structure',
      },
      {
        label: 'Business Plan',
        icon: FileText,
        path: '/intranet/business/business-plan',
        description: 'Business planning and strategy',
      },
      {
        label: 'Professional Calendar',
        icon: Calendar,
        path: '/intranet/calendar?context=professional',
        description: 'Business calendar and events',
      },
      {
        label: 'Business Assets',
        icon: Database,
        path: '/intranet/assets?context=professional',
        description: 'Business assets and resources',
      },
      {
        label: 'Business Projects',
        icon: Briefcase,
        path: '/intranet/projects?context=professional',
        description: 'Business projects and initiatives',
      },
    ],
  },

  // ===== COMMUNITIES SECTION =====
  {
    id: 'communities',
    label: 'Communities',
    icon: Globe,
    description: 'Sonny network and community groups',
    items: [
      {
        label: 'My Networks',
        icon: Network,
        path: '/intranet/networks',
        description: 'Your community networks',
      },
      {
        label: 'Sonny Network',
        icon: Network,
        path: '/intranet/sonny',
        badge: { text: 'Mesh', type: 'mesh' },
        description: 'Sonny mesh networking',
      },
      {
        label: 'Community Calendar',
        icon: Calendar,
        path: '/intranet/calendar?context=community',
        description: 'Community events calendar',
      },
      {
        label: 'PigeeBack',
        icon: ExternalLink,
        path: 'https://pigeeback-lifecv.web.app/',
        external: true,
        badge: { text: 'External', type: 'external' },
        description: 'Follow me home community app',
      },
      {
        label: 'Ekhaya Communities',
        icon: Globe,
        path: '/intranet/communities/ekhaya',
        description: 'Ekhaya community groups',
      },
      {
        label: 'LifeSync Groups',
        icon: ExternalLink,
        path: 'https://lifesync-lifecv.web.app/',
        external: true,
        badge: { text: 'External', type: 'external' },
        description: 'LifeSync community platform',
      },
    ],
  },

  // ===== COMMON TOOLS SECTION =====
  {
    id: 'commonTools',
    label: 'Common Tools',
    icon: Wrench,
    description: 'Cross-context utilities',
    items: [
      {
        label: 'Assets Register',
        icon: Database,
        path: '/intranet/assets',
        description: 'All contexts asset management',
      },
      {
        label: 'Reporting',
        icon: FileText,
        path: '/intranet/reporting',
        description: 'Reports and analytics',
      },
      {
        label: 'Analytics',
        icon: BarChart3,
        path: '/intranet/analytics',
        description: 'Data analytics and insights',
      },
      {
        label: 'Toolkit',
        icon: Wrench,
        path: '/intranet/toolkit',
        description: 'Utilities and tools',
      },
      {
        label: 'Sazi Academy',
        icon: BookOpen,
        path: 'https://sazi-life-academy.web.app/',
        external: true,
        badge: { text: 'Training', type: 'external' },
        description: 'Learning and training platform',
      },
      {
        label: 'Sync Control',
        icon: Code,
        path: '/intranet/sync-control',
        badge: { text: 'MNI', type: 'mni' },
        description: 'MNI ecosystem sync control',
      },
    ],
  },

  // ===== BOTTOM SECTION =====
  {
    id: 'bottom',
    label: 'Bottom Navigation',
    icon: Settings,
    standalone: true,
    items: [
      {
        label: 'Innovation Lab',
        icon: Lightbulb,
        path: '/intranet/innovation',
        description: 'Innovation and experiments',
      },
      {
        label: 'Beta Testing',
        icon: Zap,
        path: '/intranet/beta',
        description: 'Beta features and testing',
      },
      {
        label: 'Settings',
        icon: Settings,
        path: '/intranet/settings',
        description: 'User settings and preferences',
      },
    ],
  },
];

/**
 * Get navigation sections for rendering
 * Excludes bottom section by default
 */
export const getMainNavSections = (): NavSection[] => {
  return NAV_STRUCTURE.filter((section) => section.id !== 'bottom');
};

/**
 * Get bottom navigation sections
 */
export const getBottomNavSections = (): NavSection[] => {
  return NAV_STRUCTURE.filter((section) => section.id === 'bottom');
};

/**
 * Find section by ID
 */
export const findNavSection = (id: string): NavSection | undefined => {
  return NAV_STRUCTURE.find((section) => section.id === id);
};

/**
 * Find item in all sections
 */
export const findNavItem = (path: string) => {
  for (const section of NAV_STRUCTURE) {
    if (section.items) {
      const item = section.items.find((i) => i.path === path);
      if (item) return { item, section };
    }
  }
  return null;
};
