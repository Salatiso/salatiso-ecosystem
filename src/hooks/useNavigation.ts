/**
 * useNavigation Hook
 * Manages navigation state for sidebar
 * Date: October 26, 2025
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { NavigationState } from '../components/navigation/navigation.types';

const NAVIGATION_STATE_KEY = 'salatiso-nav-state';

/**
 * Initialize default state
 */
const getDefaultState = (): NavigationState => ({
  expandedSections: {
    personal: true, // Personal is expanded by default
    family: false,
    professional: false,
    communities: false,
    commonTools: false,
    dashboard: false,
    bottom: false,
  },
  activeItem: null,
  activePath: undefined,
});

/**
 * Hook to manage navigation state
 * Persists expanded/collapsed state to localStorage
 */
export const useNavigation = () => {
  const [state, setState] = useState<NavigationState>(getDefaultState());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAVIGATION_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (error) {
      console.warn('Failed to load navigation state:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(
        NAVIGATION_STATE_KEY,
        JSON.stringify({
          expandedSections: state.expandedSections,
          activeItem: state.activeItem,
        })
      );
    } catch (error) {
      console.warn('Failed to save navigation state:', error);
    }
  }, [state, isInitialized]);

  /**
   * Toggle section expansion
   */
  const toggleSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      expandedSections: {
        ...prev.expandedSections,
        [sectionId]: !prev.expandedSections[sectionId],
      },
    }));
  }, []);

  /**
   * Expand section
   */
  const expandSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      expandedSections: {
        ...prev.expandedSections,
        [sectionId]: true,
      },
    }));
  }, []);

  /**
   * Collapse section
   */
  const collapseSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      expandedSections: {
        ...prev.expandedSections,
        [sectionId]: false,
      },
    }));
  }, []);

  /**
   * Collapse all sections
   */
  const collapseAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expandedSections: Object.keys(prev.expandedSections).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      ),
    }));
  }, []);

  /**
   * Expand all sections
   */
  const expandAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expandedSections: Object.keys(prev.expandedSections).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      ),
    }));
  }, []);

  /**
   * Set active item
   */
  const setActiveItem = useCallback((itemId: string | null, path?: string) => {
    setState((prev) => ({
      ...prev,
      activeItem: itemId,
      activePath: path,
    }));
  }, []);

  /**
   * Check if section is expanded
   */
  const isSectionExpanded = useCallback(
    (sectionId: string): boolean => {
      return state.expandedSections[sectionId] ?? false;
    },
    [state.expandedSections]
  );

  return {
    state,
    isInitialized,
    toggleSection,
    expandSection,
    collapseSection,
    collapseAll,
    expandAll,
    setActiveItem,
    isSectionExpanded,
  };
};

/**
 * Hook to track active navigation path
 */
export const useActiveNavPath = (currentPath: string) => {
  const { setActiveItem } = useNavigation();

  useEffect(() => {
    // Update active item based on current path
    setActiveItem(currentPath, currentPath);
  }, [currentPath, setActiveItem]);
};
