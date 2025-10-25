/**
 * Global Keyboard Shortcuts Handler
 * Phase 5 UX Enhancements
 * Cmd+K for search, Cmd+/ for help, Escape to close
 */

'use client';

import { useEffect } from 'react';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchEvent = new CustomEvent('open-search');
        window.dispatchEvent(searchEvent);
      }

      // Cmd+/ or Ctrl+/ for help
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        const helpEvent = new CustomEvent('open-help');
        window.dispatchEvent(helpEvent);
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        const closeEvent = new CustomEvent('close-modal');
        window.dispatchEvent(closeEvent);
      }

      // Cmd+S or Ctrl+S for save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const saveEvent = new CustomEvent('save-form');
        window.dispatchEvent(saveEvent);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
