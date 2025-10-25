/**
 * Enhanced Sidebar Navigation Component
 * Phase 5 - STEP 4
 * New organized navigation structure
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface NavSection {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  items: NavItem[];
  isExpanded?: boolean;
}

export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  isActive?: boolean;
  disabled?: boolean;
  submenu?: NavItem[];
}

interface SidebarProps {
  sections: NavSection[];
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (href: string) => void;
  className?: string;
}

/**
 * Navigation Item Component
 */
const NavigationItem: React.FC<{
  item: NavItem;
  level?: number;
  onNavigate?: (href: string) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}> = ({ item, level = 0, onNavigate, isExpanded, onToggle }) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const paddingLeft = level * 16;

  return (
    <div>
      <button
        onClick={() => {
          if (hasSubmenu && onToggle) {
            onToggle();
          } else if (onNavigate) {
            onNavigate(item.href);
          }
        }}
        disabled={item.disabled}
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          item.isActive
            ? 'bg-blue-100 text-blue-900 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
      >
        {item.icon && <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>}
        <span className="flex-1 text-left text-sm">{item.name}</span>
        {item.badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.badge}
          </span>
        )}
        {hasSubmenu && (
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </button>

      {/* Submenu */}
      {hasSubmenu && isExpanded && (
        <div className="space-y-1">
          {item.submenu!.map((subitem, idx) => (
            <NavigationItem
              key={idx}
              item={subitem}
              level={level + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Navigation Section Component
 */
const NavigationSection: React.FC<{
  section: NavSection;
  onNavigate?: (href: string) => void;
  expandedItems?: Set<string>;
  onToggleExpand?: (itemName: string) => void;
}> = ({ section, onNavigate, expandedItems, onToggleExpand }) => {
  const [isExpanded, setIsExpanded] = useState(section.isExpanded ?? true);

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
      >
        {section.icon && <span className="flex-shrink-0 w-5 h-5 text-gray-600">{section.icon}</span>}
        <div className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-gray-900">{section.label}</h3>
          {section.description && (
            <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Section Items */}
      {isExpanded && (
        <div className="mt-2 space-y-1">
          {section.items.map((item, idx) => (
            <div key={idx}>
              <NavigationItem
                item={item}
                onNavigate={onNavigate}
                isExpanded={expandedItems?.has(item.name)}
                onToggle={() => onToggleExpand?.(item.name)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced Sidebar Component
 */
export const EnhancedSidebar: React.FC<SidebarProps> = ({
  sections,
  isOpen = true,
  onClose,
  onNavigate,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItemExpansion = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <aside
      className={`flex flex-col w-64 bg-white border-r border-gray-200 overflow-y-auto ${className}`}
    >
      {/* Sidebar Content */}
      <div className="flex-1 px-3 py-4 space-y-2">
        {sections.map((section, idx) => (
          <NavigationSection
            key={idx}
            section={section}
            onNavigate={onNavigate}
            expandedItems={expandedItems}
            onToggleExpand={toggleItemExpansion}
          />
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          LifeCV v5.0 • Ecosystem
        </p>
      </div>
    </aside>
  );
};

/**
 * Sidebar Navigation Builder
 * Creates the new organized structure
 */
export const createOrganizedNavigation = (): NavSection[] => {
  return [
    {
      label: '🎯 Identity & Journey',
      description: 'Your LifeCV and progress',
      isExpanded: true,
      items: [
        { name: 'LifeCV', href: '/intranet/lifecv', badge: 'New' },
        { name: 'Progress Plan', href: '/intranet/progress', badge: 'New' },
        { name: 'Achievements', href: '/intranet/achievements' },
        { name: 'Testimonials', href: '/intranet/testimonials' },
      ],
    },
    {
      label: '🏠 Core Tools',
      description: 'Essential features',
      isExpanded: true,
      items: [
        { name: 'Dashboard', href: '/intranet/dashboard' },
        { name: 'Search', href: '/intranet/search' },
        { name: 'Help & Support', href: '/intranet/help' },
      ],
    },
    {
      label: '👨‍👩‍👧‍👦 Family',
      description: 'Family structure & planning',
      isExpanded: false,
      items: [
        { name: 'Family Overview', href: '/intranet/family' },
        { name: 'Family Tree', href: '/family/tree', badge: 'New' },
        { name: 'Households', href: '/family/households', badge: 'New' },
        { name: 'Succession Planning', href: '/family/succession', badge: 'New' },
        { name: 'Family Timeline', href: '/family/timeline' },
      ],
    },
    {
      label: '🤝 Community',
      description: 'Connections & collaboration',
      isExpanded: false,
      items: [
        { name: 'Contacts', href: '/intranet/contacts' },
        { name: 'Projects', href: '/intranet/projects' },
        { name: 'Events', href: '/intranet/events' },
        { name: 'Collaboration', href: '/intranet/collaboration' },
      ],
    },
    {
      label: '💼 Professional',
      description: 'Career & business',
      isExpanded: false,
      items: [
        { name: 'Career Paths', href: '/business/careers' },
        { name: 'Business Operations', href: '/business/operations' },
        { name: 'Organogram', href: '/business/organogram' },
        { name: 'Business Plan', href: '/intranet/business-plan' },
      ],
    },
    {
      label: '🛠️ Toolkit',
      description: 'Cross-context tools',
      isExpanded: false,
      items: [
        { name: 'Assets', href: '/intranet/assets' },
        { name: 'Calendar', href: '/intranet/calendar' },
        { name: 'Contacts', href: '/intranet/contacts' },
        { name: 'Projects Organizer', href: '/intranet/projects' },
      ],
    },
    {
      label: '👶 Children',
      description: 'Kids-friendly access',
      isExpanded: false,
      items: [
        { name: 'Smart Dashboard', href: '/kids/dashboard', badge: 'New' },
        { name: 'Learning Paths', href: '/kids/learning' },
        { name: 'Games', href: '/kids/games' },
        { name: 'Family Tasks', href: '/kids/tasks' },
      ],
    },
    {
      label: '🌟 Expansion',
      description: 'Advanced features',
      isExpanded: false,
      items: [
        { name: 'Sazi Academy', href: '/academy' },
        { name: 'Curriculum', href: '/academy/curriculum' },
        { name: 'Sonny Network', href: '/sonny' },
        { name: 'Cultural Integration', href: '/cultural' },
        { name: 'Ecosystem', href: '/intranet/ecosystem' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Admin Panel', href: '/admin', badge: 'Admin' },
      ],
    },
  ];
};
