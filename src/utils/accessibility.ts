/**
 * Accessibility Utilities for Calendar Components
 * 
 * Provides WCAG 2.1 AA compliance helpers:
 * - ARIA labels and descriptions
 * - Keyboard navigation support
 * - Screen reader announcements
 * - Focus management
 * - Contrast compliance utilities
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing screen reader announcements
 * Uses aria-live region to announce updates
 */
export const useScreenReaderAnnouncement = () => {
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;

      // Clear after announcement to allow re-announcement of same message
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announcementRef, announce };
};

/**
 * Custom hook for keyboard navigation in grid/list components
 * Handles arrow key navigation
 */
export const useKeyboardNavigation = (
  itemCount: number,
  onItemSelect: (index: number) => void
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newIndex = currentIndexRef.current;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newIndex = Math.max(0, currentIndexRef.current - 7); // Week up
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = Math.min(itemCount - 1, currentIndexRef.current + 7); // Week down
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(0, currentIndexRef.current - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(itemCount - 1, currentIndexRef.current + 1);
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = itemCount - 1;
          break;
        default:
          return;
      }

      currentIndexRef.current = newIndex;
      onItemSelect(newIndex);
    },
    [itemCount, onItemSelect]
  );

  return { containerRef, handleKeyDown };
};

/**
 * Custom hook for focus management in modals/overlays
 */
export const useFocusManagement = (isOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previous active element
      previousActiveElementRef.current = document.activeElement;

      // Focus the container
      if (containerRef.current) {
        containerRef.current.focus();
      }

      // Trap focus within container
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && containerRef.current) {
          const focusableElements = containerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            // Shift+Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      // Restore focus to previous element
      if (previousActiveElementRef.current instanceof HTMLElement) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  return containerRef;
};

/**
 * Accessibility properties for common components
 */
export const a11y = {
  /**
   * Calendar grid ARIA attributes
   */
  calendarGrid: (monthYear: string) => ({
    role: 'grid',
    'aria-label': `Calendar for ${monthYear}`,
    'aria-description': 'Navigate using arrow keys, select a date using Enter or Space',
  }),

  /**
   * Date cell ARIA attributes
   */
  dateCell: (
    gregorianDate: Date,
    natural13Info: string,
    isToday: boolean,
    isCurrentMonth: boolean
  ) => ({
    role: 'gridcell',
    'aria-label': `${gregorianDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })} (${natural13Info})${isToday ? ', Today' : ''}`,
    'aria-current': isToday ? 'date' : undefined,
    'aria-disabled': !isCurrentMonth ? 'true' : undefined,
  }),

  /**
   * Date picker ARIA attributes
   */
  datePicker: () => ({
    role: 'group',
    'aria-label': 'Date picker',
    'aria-description': 'Enter or select a date from the calendar',
  }),

  /**
   * Month select ARIA attributes
   */
  monthSelect: () => ({
    'aria-label': 'Select month',
    'aria-describedby': 'month-help',
  }),

  /**
   * Day input ARIA attributes
   */
  dayInput: (maxDay: number) => ({
    'aria-label': `Day (1-${maxDay})`,
    'aria-required': 'true',
    inputMode: 'numeric' as const,
  }),

  /**
   * Event overlay manager ARIA attributes
   */
  eventOverlay: (eventId: string, eventCount: number) => ({
    role: 'region',
    'aria-label': `Event overlays for ${eventId}`,
    'aria-description': `Manage ${eventCount} calendar event overlay(s)`,
  }),

  /**
   * Modal/Dialog ARIA attributes
   */
  dialog: (title: string) => ({
    role: 'dialog',
    'aria-labelledby': 'dialog-title',
    'aria-modal': 'true',
  }),

  /**
   * Loading state ARIA attributes
   */
  loading: () => ({
    role: 'status',
    'aria-live': 'polite' as const,
    'aria-busy': 'true' as const,
    'aria-label': 'Loading...',
  }),

  /**
   * Lunar phase ARIA attributes
   */
  lunarPhase: (phase: string, illumination: number) => ({
    role: 'img',
    'aria-label': `${phase.replace(/_/g, ' ')} moon (${illumination.toFixed(0)}% illuminated)`,
  }),
};

/**
 * Contrast ratio checker for WCAG AA compliance
 * Returns accessibility status
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((x) => {
      const s = x / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Parse hex colors (simplified)
  const parseColor = (color: string): [number, number, number] => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  };

  const [r1, g1, b1] = parseColor(color1);
  const [r2, g2, b2] = parseColor(color2);

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check WCAG AA compliance for contrast ratio
 */
export const isWCAG_AA_Compliant = (ratio: number, fontSize: 'normal' | 'large' = 'normal'): boolean => {
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  return fontSize === 'large' ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Accessibility banner component for live regions
 */
export const AccessibilityBanner = ({ id = 'a11y-banner' }: { id?: string }) => (
  <div
    id={id}
    className="sr-only"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  />
);

// CSS class for screen reader only content
export const srOnlyClass =
  'sr-only absolute w-1 h-1 p-0 -m-1 overflow-hidden bg-clip-padding border-0';

/**
 * Screen reader only text component
 */
export const SROnly = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <span id={id} className={srOnlyClass}>
    {children}
  </span>
);
