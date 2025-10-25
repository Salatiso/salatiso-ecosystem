/**
 * @file CalendarSystemProvider.tsx
 * @description React context provider for calendar system state management
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1B - Integration
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CalendarSystemService } from '@/services/CalendarSystemService';
import { ConversionService } from '@/services/ConversionService';
import { CalendarSystem, SeasonalMarker } from '@/types/calendar-systems';

/**
 * Calendar System Context Type
 */
export interface CalendarSystemContextType {
  // Initialization state
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;

  // Calendar systems
  calendarSystems: CalendarSystem[];
  activeSystem: CalendarSystem | null;
  natural13SystemId: string | null;

  // Seasonal markers
  seasonalMarkers: SeasonalMarker[];

  // Actions
  setActiveSystem: (systemId: string) => void;
  refreshSystems: () => Promise<void>;
  refreshMarkers: () => Promise<void>;

  // Cache management
  clearConversionCache: () => void;
}

/**
 * Create the calendar system context
 */
const CalendarSystemContext = createContext<CalendarSystemContextType | undefined>(
  undefined
);

/**
 * Props for CalendarSystemProvider
 */
export interface CalendarSystemProviderProps {
  children: ReactNode;
}

/**
 * CalendarSystemProvider Component
 * 
 * Provides global access to calendar systems, seasonal markers, and conversion utilities
 * Should wrap the root of your application
 * 
 * @example
 * ```tsx
 * export default function RootLayout({
 *   children,
 * }: {
 *   children: React.ReactNode;
 * }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <CalendarSystemProvider>
 *           {children}
 *         </CalendarSystemProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function CalendarSystemProvider({
  children
}: CalendarSystemProviderProps) {
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [calendarSystems, setCalendarSystems] = useState<CalendarSystem[]>([]);
  const [activeSystemId, setActiveSystemId] = useState<string | null>(null);
  const [seasonalMarkers, setSeasonalMarkers] = useState<SeasonalMarker[]>([]);
  const [natural13SystemId, setNatural13SystemId] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    initializeCalendarSystems();
  }, []);

  // Initialize calendar systems
  const initializeCalendarSystems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize services (creates calendar systems and markers if needed)
      await CalendarSystemService.initialize();

      // Fetch calendar systems
      const systems = await CalendarSystemService.getCalendarSystems();
      setCalendarSystems(systems);

      // Find Natural13 system
      const natural13System = systems.find(s => s.name === 'Natural 13-Month');
      if (natural13System) {
        setNatural13SystemId(natural13System.id);
        setActiveSystemId(natural13System.id);

        // Fetch seasonal markers for Natural13 system
        const markers = await CalendarSystemService.getSeasonalMarkers(
          natural13System.id
        );
        setSeasonalMarkers(markers);
      }

      setIsInitialized(true);

      console.log('✅ Calendar system context initialized', {
        systemCount: systems.length,
        natural13SystemId: natural13System?.id,
        markerCount: seasonalMarkers.length
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Failed to initialize calendar system context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh systems
  const refreshSystems = async () => {
    try {
      setIsLoading(true);
      const systems = await CalendarSystemService.getCalendarSystems();
      setCalendarSystems(systems);

      // Update Natural13 system reference if still valid
      if (natural13SystemId) {
        const natural13System = systems.find(s => s.id === natural13SystemId);
        if (!natural13System) {
          setActiveSystemId(null);
          setNatural13SystemId(null);
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to refresh calendar systems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh markers
  const refreshMarkers = async () => {
    try {
      setIsLoading(true);
      if (activeSystemId) {
        const markers = await CalendarSystemService.getSeasonalMarkers(
          activeSystemId
        );
        setSeasonalMarkers(markers);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to refresh seasonal markers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set active system
  const setActiveSystem = async (systemId: string) => {
    try {
      const system = calendarSystems.find(s => s.id === systemId);
      if (!system) {
        throw new Error(`Calendar system not found: ${systemId}`);
      }

      setActiveSystemId(systemId);

      // Load markers for new system
      const markers = await CalendarSystemService.getSeasonalMarkers(systemId);
      setSeasonalMarkers(markers);

      console.log(`Switched to calendar system: ${system.name}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to set active calendar system:', error);
    }
  };

  // Clear conversion cache
  const clearConversionCache = () => {
    ConversionService.clearCache();
    console.log('Conversion cache cleared');
  };

  // Get active system
  const activeSystem = calendarSystems.find(s => s.id === activeSystemId) || null;

  // Context value
  const value: CalendarSystemContextType = {
    isInitialized,
    isLoading,
    error,
    calendarSystems,
    activeSystem,
    natural13SystemId,
    seasonalMarkers,
    setActiveSystem,
    refreshSystems,
    refreshMarkers,
    clearConversionCache
  };

  return (
    <CalendarSystemContext.Provider value={value}>
      {children}
    </CalendarSystemContext.Provider>
  );
}

/**
 * Hook to use the calendar system context
 * Must be called within a CalendarSystemProvider
 * 
 * @returns Calendar system context value
 * @throws Error if used outside CalendarSystemProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { activeSystem, seasonalMarkers, isLoading } = useCalendarSystem();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <div>
 *       <h2>{activeSystem?.displayName}</h2>
 *       <MarkerList markers={seasonalMarkers} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useCalendarSystem(): CalendarSystemContextType {
  const context = useContext(CalendarSystemContext);

  if (!context) {
    throw new Error(
      'useCalendarSystem must be used within a CalendarSystemProvider'
    );
  }

  return context;
}

/**
 * Hook to check if calendar systems are initialized
 * 
 * @returns true if calendar systems are ready to use
 * 
 * @example
 * ```tsx
 * function ConditionalComponent() {
 *   const isReady = useCalendarSystemReady();
 *   return isReady ? <DualCalendar /> : <Placeholder />;
 * }
 * ```
 */
export function useCalendarSystemReady(): boolean {
  const { isInitialized, isLoading, error } = useCalendarSystem();
  return isInitialized && !isLoading && !error;
}

/**
 * Hook to get the Natural 13-Month calendar system
 * 
 * @returns The Natural13 calendar system or null if not found
 * 
 * @example
 * ```tsx
 * function CreateNatural13Event() {
 *   const natural13 = useNatural13System();
 *   if (!natural13) return <Error />;
 *   
 *   return <EventForm systemId={natural13.id} />;
 * }
 * ```
 */
export function useNatural13System(): CalendarSystem | null {
  const { calendarSystems } = useCalendarSystem();
  return calendarSystems.find(s => s.name === 'Natural 13-Month') || null;
}

/**
 * Hook to get seasonal markers for the active system
 * 
 * @returns Array of seasonal markers
 * 
 * @example
 * ```tsx
 * function SeasonalMarkerDisplay() {
 *   const markers = useSeasonalMarkersForActiveSystem();
 *   return <MarkerTimeline markers={markers} />;
 * }
 * ```
 */
export function useSeasonalMarkersForActiveSystem(): SeasonalMarker[] {
  const { seasonalMarkers } = useCalendarSystem();
  return seasonalMarkers;
}

/**
 * Hook to check if system is loading
 * 
 * @returns true if systems are currently loading
 * 
 * @example
 * ```tsx
 * function LoadingIndicator() {
 *   const isLoading = useCalendarSystemLoading();
 *   return isLoading ? <Spinner /> : null;
 * }
 * ```
 */
export function useCalendarSystemLoading(): boolean {
  const { isLoading } = useCalendarSystem();
  return isLoading;
}

/**
 * Hook to get any initialization errors
 * 
 * @returns Error object or null
 * 
 * @example
 * ```tsx
 * function ErrorBoundary() {
 *   const error = useCalendarSystemError();
 *   return error ? <Alert error={error} /> : null;
 * }
 * ```
 */
export function useCalendarSystemError(): Error | null {
  const { error } = useCalendarSystem();
  return error;
}
