/**
 * useIncidentDashboard Hook - Phase 3
 * 
 * Real-time incident dashboard state management.
 * Handles metrics, filtering, pagination, and subscriptions
 * for the incident dashboard component.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  IncidentMetrics,
  EscalationEvent,
  EscalationStatus,
  SeverityLevel,
  EscalationStatusSummary,
  EscalationLevel,
  SeverityTrend,
  ResponderPerformance,
  EscalationFilterOptions,
  PaginatedEscalations,
  MetricsSubscriptionCallback,
} from '@/types/escalation';
import * as dashboardService from '@/services/incidentDashboardService';

export interface UseIncidentDashboardReturn {
  // Data
  incidents: EscalationEvent[];
  metrics: IncidentMetrics | null;
  severityTrends: SeverityTrend[];
  statusSummaries: Record<EscalationLevel, EscalationStatusSummary>;
  responderPerformance: ResponderPerformance[];

  // Pagination
  currentPage: number;
  pageSize: number;
  totalIncidents: number;
  hasMore: boolean;

  // Filters
  activeFilters: EscalationFilterOptions;
  updateFilters: (filters: EscalationFilterOptions) => Promise<void>;
  clearFilters: () => void;

  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;

  // Computed
  criticalCount: number;
  highCount: number;
  openCount: number;
  averageResolutionTime: string;
}

/**
 * Hook for incident dashboard with metrics and filtering
 */
export function useIncidentDashboard(): UseIncidentDashboardReturn {
  // Data State
  const [incidents, setIncidents] = useState<EscalationEvent[]>([]);
  const [metrics, setMetrics] = useState<IncidentMetrics | null>(null);
  const [severityTrends, setSeverityTrends] = useState<SeverityTrend[]>([]);
  const [statusSummaries, setStatusSummaries] = useState<
    Record<EscalationLevel, EscalationStatusSummary>
  >({
    [EscalationLevel.INDIVIDUAL]: {
      level: EscalationLevel.INDIVIDUAL,
      open: 0,
      inProgress: 0,
      awaitingResponse: 0,
      resolved: 0,
      avgResolutionTime: 0,
    },
    [EscalationLevel.FAMILY]: {
      level: EscalationLevel.FAMILY,
      open: 0,
      inProgress: 0,
      awaitingResponse: 0,
      resolved: 0,
      avgResolutionTime: 0,
    },
    [EscalationLevel.COMMUNITY]: {
      level: EscalationLevel.COMMUNITY,
      open: 0,
      inProgress: 0,
      awaitingResponse: 0,
      resolved: 0,
      avgResolutionTime: 0,
    },
    [EscalationLevel.PROFESSIONAL]: {
      level: EscalationLevel.PROFESSIONAL,
      open: 0,
      inProgress: 0,
      awaitingResponse: 0,
      resolved: 0,
      avgResolutionTime: 0,
    },
  });
  const [responderPerformance, setResponderPerformance] = useState<ResponderPerformance[]>([]);

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [activeFilters, setActiveFilters] = useState<EscalationFilterOptions>({});

  // Subscription refs
  const metricsUnsubscribeRef = useRef<(() => void) | null>(null);
  const incidentsUnsubscribeRef = useRef<(() => void) | null>(null);

  // Load metrics on mount and subscribe
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Initial metrics load
    dashboardService
      .calculateIncidentMetrics('week')
      .then((data) => {
        setMetrics(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
        setIsLoading(false);
      });

    // Subscribe to metrics updates
    metricsUnsubscribeRef.current = dashboardService.subscribeToMetrics(
      'week',
      (data) => {
        setMetrics(data);
      }
    );

    // Subscribe to open incidents
    incidentsUnsubscribeRef.current = dashboardService.subscribeToOpenIncidents((data) => {
      setIncidents(data);
      setTotalIncidents(data.length);
    });

    return () => {
      if (metricsUnsubscribeRef.current) metricsUnsubscribeRef.current();
      if (incidentsUnsubscribeRef.current) incidentsUnsubscribeRef.current();
    };
  }, []);

  // Load severity trends
  useEffect(() => {
    dashboardService
      .calculateSeverityTrends(30)
      .then((data) => {
        setSeverityTrends(data);
      })
      .catch((err) => {
        console.error('Failed to load trends:', err);
      });
  }, []);

  // Load status summaries
  useEffect(() => {
    const loadSummaries = async () => {
      try {
        const levels = [
          EscalationLevel.INDIVIDUAL,
          EscalationLevel.FAMILY,
          EscalationLevel.COMMUNITY,
          EscalationLevel.PROFESSIONAL,
        ];

        const summaries: Record<EscalationLevel, EscalationStatusSummary> = {} as any;
        for (const level of levels) {
          summaries[level] = await dashboardService.getStatusSummaryByLevel(level);
        }

        setStatusSummaries(summaries);
      } catch (err) {
        console.error('Failed to load status summaries:', err);
      }
    };

    loadSummaries();
  }, []);

  // Load responder performance
  useEffect(() => {
    dashboardService
      .getAllResponderPerformance()
      .then((data) => {
        setResponderPerformance(data);
      })
      .catch((err) => {
        console.error('Failed to load responder performance:', err);
      });
  }, []);

  // Filter incidents
  const updateFilters = useCallback(
    async (filters: EscalationFilterOptions) => {
      setIsLoading(true);
      try {
        setActiveFilters(filters);
        setCurrentPage(0);

        const result = await dashboardService.getOpenIncidents(filters, pageSize, 0);
        setIncidents(result.items);
        setTotalIncidents(result.total);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to filter incidents');
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setCurrentPage(0);
  }, []);

  // Pagination
  const loadPage = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const offset = page * pageSize;
        const result = await dashboardService.getOpenIncidents(
          activeFilters,
          pageSize,
          offset
        );
        setIncidents(result.items);
        setTotalIncidents(result.total);
        setHasMore(result.hasMore);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setIsLoading(false);
      }
    },
    [activeFilters, pageSize]
  );

  const nextPage = useCallback(() => {
    if (hasMore) {
      loadPage(currentPage + 1);
    }
  }, [currentPage, hasMore, loadPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      loadPage(currentPage - 1);
    }
  }, [currentPage, loadPage]);

  const goToPage = useCallback(
    (page: number) => {
      loadPage(page);
    },
    [loadPage]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Refresh all data
      const metricsData = await dashboardService.calculateIncidentMetrics('week');
      setMetrics(metricsData);

      const trendsData = await dashboardService.calculateSeverityTrends(30);
      setSeverityTrends(trendsData);

      const perfData = await dashboardService.getAllResponderPerformance();
      setResponderPerformance(perfData);

      // Reload current page
      await loadPage(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, loadPage]);

  // Computed properties
  const criticalCount = incidents.filter((i) => i.severity === SeverityLevel.CRITICAL).length;
  const highCount = incidents.filter((i) => i.severity === SeverityLevel.HIGH).length;
  const openCount = incidents.filter((i) => i.status !== EscalationStatus.RESOLVED).length;
  const averageResolutionTime = metrics
    ? formatMilliseconds(metrics.averageResolutionTime)
    : 'N/A';

  return {
    incidents,
    metrics,
    severityTrends,
    statusSummaries,
    responderPerformance,
    currentPage,
    pageSize,
    totalIncidents,
    hasMore,
    activeFilters,
    updateFilters,
    clearFilters,
    isLoading,
    error,
    refresh,
    nextPage,
    previousPage,
    goToPage,
    criticalCount,
    highCount,
    openCount,
    averageResolutionTime,
  };
}

/**
 * Hook for loading critical incidents with auto-refresh
 */
export interface UseCriticalIncidentsReturn {
  incidents: EscalationEvent[];
  isLoading: boolean;
  error: string | null;
  count: number;
  refresh: () => Promise<void>;
}

export function useCriticalIncidents(): UseCriticalIncidentsReturn {
  const [incidents, setIncidents] = useState<EscalationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsLoading(true);

    // Subscribe to critical incidents
    unsubscribeRef.current = dashboardService.subscribeToCriticalIncidents((data) => {
      setIncidents(data);
      setIsLoading(false);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await dashboardService.getCriticalIncidents();
      setIncidents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    }
  }, []);

  return {
    incidents,
    isLoading,
    error,
    count: incidents.length,
    refresh,
  };
}

/**
 * Helper: Format milliseconds to readable time
 */
function formatMilliseconds(ms: number): string {
  if (ms < 60000) {
    return `${Math.round(ms / 1000)}s`;
  } else if (ms < 3600000) {
    return `${Math.round(ms / 60000)}m`;
  } else {
    return `${Math.round(ms / 3600000)}h`;
  }
}

export default { useIncidentDashboard, useCriticalIncidents };
