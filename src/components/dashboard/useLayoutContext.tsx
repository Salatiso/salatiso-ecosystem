'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, FC } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export type DashboardContext = 'personal' | 'business' | 'family' | 'admin';

/**
 * Dashboard Preferences stored in Firestore at:
 * users/{uid}/dashboardPreferences
 */
export interface DashboardPreferences {
  currentContext: DashboardContext;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  kidsMode: boolean;
  hiddenWidgets: string[]; // Array of widget IDs to hide
  lastUpdated: number;
}

interface LayoutContextType {
  // State
  currentContext: DashboardContext;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  kidsMode: boolean;
  hiddenWidgets: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setContext: (context: DashboardContext) => Promise<void>;
  toggleSidebar: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  toggleKidsMode: () => Promise<void>;
  toggleWidgetVisibility: (widgetId: string) => Promise<void>;
  setHiddenWidgets: (widgetIds: string[]) => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Default preferences
const DEFAULT_PREFERENCES: DashboardPreferences = {
  currentContext: 'personal',
  sidebarCollapsed: false,
  darkMode: false,
  kidsMode: false,
  hiddenWidgets: [],
  lastUpdated: Date.now(),
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: FC<LayoutProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<DashboardPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load preferences from Firestore on mount and when user changes
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) {
        setPreferences(DEFAULT_PREFERENCES);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const prefsRef = doc(db, 'users', user.id, 'dashboardPreferences', 'settings');
        const prefsSnap = await getDoc(prefsRef);

        if (prefsSnap.exists()) {
          setPreferences(prefsSnap.data() as DashboardPreferences);
        } else {
          // Create default preferences if they don't exist
          await setDoc(prefsRef, DEFAULT_PREFERENCES);
          setPreferences(DEFAULT_PREFERENCES);
        }
      } catch (err) {
        console.error('Failed to load dashboard preferences:', err);
        setError(err instanceof Error ? err.message : 'Failed to load preferences');
        setPreferences(DEFAULT_PREFERENCES);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  // Save preferences to Firestore
  const savePreferences = useCallback(
    async (newPreferences: Partial<DashboardPreferences>) => {
      if (!user?.id) return;

      try {
        setError(null);
        const prefsRef = doc(db, 'users', user.id, 'dashboardPreferences', 'settings');
        const updatedPrefs = {
          ...preferences,
          ...newPreferences,
          lastUpdated: Date.now(),
        };

        await updateDoc(prefsRef, updatedPrefs);
        setPreferences(updatedPrefs);
      } catch (err) {
        console.error('Failed to save dashboard preferences:', err);
        setError(err instanceof Error ? err.message : 'Failed to save preferences');
      }
    },
    [user?.id, preferences]
  );

  // Action handlers
  const setContext = useCallback(
    async (context: DashboardContext) => {
      setPreferences(prev => ({ ...prev, currentContext: context }));
      await savePreferences({ currentContext: context });
    },
    [savePreferences]
  );

  const toggleSidebar = useCallback(
    async () => {
      const newState = !preferences.sidebarCollapsed;
      setPreferences(prev => ({ ...prev, sidebarCollapsed: newState }));
      await savePreferences({ sidebarCollapsed: newState });
    },
    [preferences.sidebarCollapsed, savePreferences]
  );

  const toggleDarkMode = useCallback(
    async () => {
      const newState = !preferences.darkMode;
      setPreferences(prev => ({ ...prev, darkMode: newState }));
      await savePreferences({ darkMode: newState });
    },
    [preferences.darkMode, savePreferences]
  );

  const toggleKidsMode = useCallback(
    async () => {
      const newState = !preferences.kidsMode;
      setPreferences(prev => ({ ...prev, kidsMode: newState }));
      await savePreferences({ kidsMode: newState });
    },
    [preferences.kidsMode, savePreferences]
  );

  const toggleWidgetVisibility = useCallback(
    async (widgetId: string) => {
      const newHidden = preferences.hiddenWidgets.includes(widgetId)
        ? preferences.hiddenWidgets.filter(id => id !== widgetId)
        : [...preferences.hiddenWidgets, widgetId];

      setPreferences(prev => ({ ...prev, hiddenWidgets: newHidden }));
      await savePreferences({ hiddenWidgets: newHidden });
    },
    [preferences.hiddenWidgets, savePreferences]
  );

  const setHiddenWidgets = useCallback(
    async (widgetIds: string[]) => {
      setPreferences(prev => ({ ...prev, hiddenWidgets: widgetIds }));
      await savePreferences({ hiddenWidgets: widgetIds });
    },
    [savePreferences]
  );

  const value: LayoutContextType = {
    currentContext: preferences.currentContext,
    sidebarCollapsed: preferences.sidebarCollapsed,
    darkMode: preferences.darkMode,
    kidsMode: preferences.kidsMode,
    hiddenWidgets: preferences.hiddenWidgets,
    isLoading,
    error,
    setContext,
    toggleSidebar,
    toggleDarkMode,
    toggleKidsMode,
    toggleWidgetVisibility,
    setHiddenWidgets,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

/**
 * Hook to use the layout context
 * Must be called within a LayoutProvider
 */
export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};

export default LayoutProvider;
