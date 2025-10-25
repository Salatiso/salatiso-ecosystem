/**
 * @file useCalendarSystemInit.ts
 * @description React hook for initializing the calendar system on app startup
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1B - Integration
 */

import { useEffect, useState, useCallback } from 'react';
import { CalendarSystemService } from '@/services/CalendarSystemService';

export interface CalendarSystemInitStatus {
  loading: boolean;
  error: Error | null;
  initialized: boolean;
  systemId?: string;
}

/**
 * Hook to initialize calendar systems on app startup
 * 
 * This hook should be called once in the root layout/app component
 * It will:
 * 1. Create the Natural 13-Month calendar system if it doesn't exist
 * 2. Seed 4 astronomical seasonal markers
 * 3. Handle errors gracefully
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { loading, error, initialized } = useCalendarSystemInit();
 *   
 *   if (loading) return <LoadingScreen />;
 *   if (error) return <ErrorScreen error={error} />;
 *   
 *   return initialized ? <MainApp /> : null;
 * }
 * ```
 */
export function useCalendarSystemInit(): CalendarSystemInitStatus {
  const [status, setStatus] = useState<CalendarSystemInitStatus>({
    loading: true,
    error: null,
    initialized: false
  });

  const initializeCalendarSystems = useCallback(async () => {
    try {
      setStatus({
        loading: true,
        error: null,
        initialized: false
      });

      // Initialize calendar systems and seed data
      await CalendarSystemService.initialize();

      // Get the Natural13 system to return its ID
      const natural13System = await CalendarSystemService.getCalendarSystemByName(
        'Natural 13-Month'
      );

      if (!natural13System) {
        throw new Error('Failed to initialize Natural 13-Month calendar system');
      }

      setStatus({
        loading: false,
        error: null,
        initialized: true,
        systemId: natural13System.id
      });

      console.log('✅ Calendar systems initialized successfully', {
        systemId: natural13System.id,
        systemName: natural13System.name
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      setStatus({
        loading: false,
        error: err,
        initialized: false
      });

      console.error('❌ Failed to initialize calendar systems:', err);
    }
  }, []);

  // Run initialization once on mount
  useEffect(() => {
    initializeCalendarSystems();
  }, [initializeCalendarSystems]);

  return status;
}

/**
 * Hook to check if calendar systems are initialized
 * Useful for conditional rendering or feature gates
 * 
 * @example
 * ```tsx
 * function EventCalendar() {
 *   const isInitialized = useCalendarSystemInitialized();
 *   
 *   return isInitialized ? (
 *     <DualCalendarView />
 *   ) : (
 *     <PlaceholderCalendar />
 *   );
 * }
 * ```
 */
export function useCalendarSystemInitialized(): boolean {
  const { initialized } = useCalendarSystemInit();
  return initialized;
}

/**
 * Hook to get the Natural 13-Month calendar system ID
 * Returns the system ID once initialized, or undefined while loading
 * 
 * @example
 * ```tsx
 * function createEventWithNatural13() {
 *   const systemId = useNatural13SystemId();
 *   
 *   if (!systemId) return null; // Not initialized yet
 *   
 *   return createOverlay(eventId, systemId);
 * }
 * ```
 */
export function useNatural13SystemId(): string | undefined {
  const { systemId, initialized } = useCalendarSystemInit();
  return initialized ? systemId : undefined;
}

/**
 * Hook to handle initialization errors
 * Useful for displaying error messages to users
 * 
 * @example
 * ```tsx
 * function App() {
 *   const error = useCalendarSystemError();
 *   
 *   if (error) {
 *     return (
 *       <Alert type="error">
 *         Calendar system initialization failed: {error.message}
 *       </Alert>
 *     );
 *   }
 *   
 *   return <MainApp />;
 * }
 * ```
 */
export function useCalendarSystemError(): Error | null {
  const { error } = useCalendarSystemInit();
  return error;
}
