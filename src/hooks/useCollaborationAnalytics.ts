/**
 * useCollaborationAnalytics Hook
 * 
 * React hook for collaboration analytics tracking and data retrieval
 * (Separate from useAnalytics which handles Google Analytics)
 * 
 * @module useCollaborationAnalytics
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnalyticsService, getAnalyticsService } from '@/services/AnalyticsService';
import {
  AnalyticsDashboardData,
  AnalyticsEvent,
  TimePeriod,
  MemberActivity,
  CollaborationNetwork
} from '@/types/analytics';

interface UseCollaborationAnalyticsOptions {
  /** Family ID */
  familyId: string;
  /** Default time period */
  defaultPeriod?: TimePeriod;
  /** Auto-load on mount */
  autoLoad?: boolean;
}

interface UseCollaborationAnalyticsReturn {
  /** Dashboard data */
  data: AnalyticsDashboardData | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Current time period */
  period: TimePeriod;
  /** Load dashboard data */
  loadData: (period?: TimePeriod) => Promise<void>;
  /** Track analytics event */
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => Promise<void>;
  /** Get member activity */
  getMemberActivity: () => Promise<MemberActivity[]>;
  /** Get collaboration network */
  getCollaborationNetwork: () => Promise<CollaborationNetwork>;
  /** Refresh data */
  refresh: () => Promise<void>;
}

/**
 * Hook for collaboration analytics
 */
export function useCollaborationAnalytics({
  familyId,
  defaultPeriod = 'month',
  autoLoad = true
}: UseCollaborationAnalyticsOptions): UseCollaborationAnalyticsReturn {
  const [service] = useState<AnalyticsService>(() => getAnalyticsService(familyId));
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [period, setPeriod] = useState<TimePeriod>(defaultPeriod);

  // Load dashboard data
  const loadData = useCallback(async (newPeriod?: TimePeriod) => {
    const targetPeriod = newPeriod || period;
    setIsLoading(true);
    setError(null);

    try {
      const dashboardData = await service.getDashboardData(targetPeriod);
      setData(dashboardData);
      setPeriod(targetPeriod);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load analytics');
      setError(error);
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [service, period]);

  // Track analytics event
  const trackEvent = useCallback(async (event: Omit<AnalyticsEvent, 'timestamp'>) => {
    try {
      await service.trackEvent({
        ...event,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [service]);

  // Get member activity
  const getMemberActivity = useCallback(async (): Promise<MemberActivity[]> => {
    try {
      const { startDate, endDate } = getDateRange(period);
      return await service.getMemberActivity(startDate, endDate);
    } catch (err) {
      console.error('Failed to get member activity:', err);
      return [];
    }
  }, [service, period]);

  // Get collaboration network
  const getCollaborationNetwork = useCallback(async (): Promise<CollaborationNetwork> => {
    try {
      return await service.getCollaborationNetwork();
    } catch (err) {
      console.error('Failed to get collaboration network:', err);
      return { nodes: [], edges: [] };
    }
  }, [service]);

  // Refresh data
  const refresh = useCallback(async () => {
    await loadData(period);
  }, [loadData, period]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  return {
    data,
    isLoading,
    error,
    period,
    loadData,
    trackEvent,
    getMemberActivity,
    getCollaborationNetwork,
    refresh
  };
}

/**
 * Helper: Get date range for period
 */
function getDateRange(period: TimePeriod): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case 'day':
      startDate.setDate(endDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    case 'all':
      startDate.setFullYear(2020);
      break;
  }

  return { startDate, endDate };
}
