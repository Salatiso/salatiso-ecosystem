/**
 * NavItem Component
 * Individual navigation link with badge support
 * Date: October 26, 2025
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { NavItem as NavItemType, BadgeType } from './navigation.types';
import { ExternalLink } from 'lucide-react';
import clsx from 'clsx';

interface NavItemProps {
  item: NavItemType;
  isActive?: boolean;
  level?: number;
  onNavigate?: (path: string) => void;
}

/**
 * Badge style mapping
 */
const badgeStyles: Record<BadgeType, string> = {
  core: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  mesh: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  mni: 'bg-green-500/20 text-green-400 border border-green-500/30',
  external: 'bg-slate-600/50 text-slate-300 border border-slate-500/30',
  new: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

/**
 * NavItem Component
 */
export const NavItem: React.FC<NavItemProps> = ({
  item,
  isActive,
  level = 0,
  onNavigate,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const Icon = item.icon;

  // Determine if this item is active
  const itemIsActive =
    isActive || pathname === item.path || pathname.startsWith(item.path);

  // Calculate padding based on nesting level
  const paddingLeft = level * 16;

  /**
   * Handle click
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.external) {
      // External links open in new tab - let browser handle it
      return;
    }

    // Internal navigation
    e.preventDefault();
    if (onNavigate) {
      onNavigate(item.path);
    }
    router.push(item.path);
  };

  /**
   * Render badge if present
   */
  const renderBadge = () => {
    if (!item.badge) return null;

    return (
      <span
        className={clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
          badgeStyles[item.badge.type]
        )}
        title={item.badge.text}
      >
        {item.badge.text}
      </span>
    );
  };

  /**
   * Item classes
   */
  const itemClasses = clsx(
    'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150',
    'group relative',
    itemIsActive
      ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500'
      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white',
    item.disabled && 'opacity-50 cursor-not-allowed'
  );

  // Content component (can be Link or button)
  const Content = () => (
    <>
      {/* Icon */}
      <Icon
        className={clsx(
          'flex-shrink-0 w-5 h-5 transition-transform',
          itemIsActive && 'scale-110'
        )}
      />

      {/* Label */}
      <span className="flex-1 text-sm font-medium text-left truncate">
        {item.label}
      </span>

      {/* Badge */}
      {renderBadge()}

      {/* External link indicator */}
      {item.external && (
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
      )}
    </>
  );

  // Render as link for internal paths or external links
  if (!item.disabled) {
    if (item.external) {
      return (
        <a
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClasses}
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
          title={item.description}
          aria-label={`${item.label} (opens in new tab)`}
        >
          <Content />
        </a>
      );
    }

    return (
      <Link
        href={item.path}
        onClick={handleClick}
        className={itemClasses}
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
        title={item.description}
      >
        <Content />
      </Link>
    );
  }

  // Render as disabled button
  return (
    <button
      disabled
      className={clsx(itemClasses, 'cursor-not-allowed')}
      style={{ paddingLeft: `${paddingLeft + 16}px` }}
      title={item.description}
    >
      <Content />
    </button>
  );
};

/**
 * Export for use in other components
 */
export default NavItem;
