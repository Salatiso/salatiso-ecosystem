/**
 * NavSection Component
 * Collapsible navigation section
 * Date: October 26, 2025
 */

'use client';

import React, { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavSection as NavSectionType } from './navigation.types';
import NavItem from './NavItem';
import clsx from 'clsx';

interface NavSectionProps {
  section: NavSectionType;
  isExpanded: boolean;
  onToggle: (sectionId: string) => void;
  onNavigate?: (path: string) => void;
  activePath?: string;
}

/**
 * NavSection Component
 */
export const NavSection: React.FC<NavSectionProps> = ({
  section,
  isExpanded,
  onToggle,
  onNavigate,
  activePath,
}) => {
  const Icon = section.icon;

  /**
   * Handle section toggle
   */
  const handleToggle = () => {
    onToggle(section.id);
  };

  /**
   * Check if any item in section is active
   */
  const hasActiveItem =
    section.items?.some((item) => item.path === activePath) ?? false;

  // Standalone sections render items directly in the parent
  if (section.standalone) {
    return (
      <div className="py-2">
        {section.items?.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            isActive={item.path === activePath}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  // Collapsible sections
  return (
    <div className="py-2">
      {/* Section Header */}
      <button
        onClick={handleToggle}
        className={clsx(
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150',
          'group hover:bg-slate-700/30',
          hasActiveItem ? 'text-blue-400' : 'text-slate-300 hover:text-white',
          'font-semibold text-sm'
        )}
        aria-expanded={isExpanded}
        aria-controls={`section-${section.id}`}
      >
        {/* Section Icon */}
        <Icon className="flex-shrink-0 w-5 h-5" />

        {/* Section Label */}
        <span className="flex-1 text-left">{section.label}</span>

        {/* Badge if present */}
        {section.badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {section.badge}
          </span>
        )}

        {/* Chevron */}
        <ChevronDown
          className={clsx(
            'flex-shrink-0 w-4 h-4 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Section Items */}
      {isExpanded && section.items && (
        <div
          id={`section-${section.id}`}
          className="mt-2 ml-2 space-y-1 border-l border-slate-700/50 pl-0"
          role="region"
          aria-labelledby={`section-${section.id}-heading`}
        >
          {section.items.map((item) => (
            <div key={item.path} className="pl-2">
              <NavItem
                item={item}
                isActive={item.path === activePath}
                level={0}
                onNavigate={onNavigate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Export for use in other components
 */
export default NavSection;
