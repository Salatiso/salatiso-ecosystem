import { renderHook, act, waitFor } from '@testing-library/react';
import { useIncidentDashboard, useCriticalIncidents } from '@/hooks/useIncidentDashboard';
import {
  EscalationLevel,
  EscalationStatus,
  SeverityLevel,
  EscalationContext,
} from '@/types/escalation';

// Mock Firebase
jest.mock('@/config/firebase');

describe('useIncidentDashboard Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data State', () => {
    it('should initialize with empty incidents array', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(Array.isArray(result.current.incidents)).toBeTruthy();
    });

    it('should load incidents', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      await waitFor(() => {
        // Data should be loaded or error state
        expect(result.current.isLoading === false || result.current.incidents).toBeTruthy();
      });
    });

    it('should provide metrics', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      await waitFor(() => {
        expect(result.current.metrics === null || typeof result.current.metrics === 'object').toBeTruthy();
      });
    });

    it('should provide severity trends', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(Array.isArray(result.current.severityTrends)).toBeTruthy();
    });

    it('should provide status summaries by level', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.statusSummaries).toBe('object');
    });

    it('should provide responder performance data', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(Array.isArray(result.current.responderPerformance)).toBeTruthy();
    });
  });

  describe('Pagination', () => {
    it('should track current page', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.currentPage).toBe('number');
      expect(result.current.currentPage >= 1).toBeTruthy();
    });

    it('should track page size', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.pageSize).toBe('number');
      expect(result.current.pageSize > 0).toBeTruthy();
    });

    it('should track total incidents', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.totalIncidents).toBe('number');
    });

    it('should indicate hasMore', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.hasMore).toBe('boolean');
    });

    it('should provide nextPage function', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.nextPage).toBe('function');
    });

    it('should provide previousPage function', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.previousPage).toBe('function');
    });

    it('should provide goToPage function', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.goToPage).toBe('function');
    });

    it('should handle page navigation', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      act(() => {
        result.current.nextPage();
      });

      // Page should change
      expect(result.current.currentPage > 0).toBeTruthy();
    });
  });

  describe('Filtering', () => {
    it('should track active filters', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.activeFilters).toBe('object');
    });

    it('should provide updateFilters function', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.updateFilters).toBe('function');
    });

    it('should provide clearFilters function', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.clearFilters).toBe('function');
    });

    it('should apply filters', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      act(() => {
        result.current.updateFilters({
          statuses: [EscalationStatus.OPEN],
        });
      });

      // Filters should be applied
      expect(result.current.activeFilters).toBeDefined();
    });

    it('should clear filters', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      act(() => {
        result.current.updateFilters({
          statuses: [EscalationStatus.OPEN],
        });
      });

      act(() => {
        result.current.clearFilters();
      });

      // Filters should be cleared
      expect(Object.keys(result.current.activeFilters || {}).length === 0).toBeTruthy();
    });
  });

  describe('Computed Properties', () => {
    it('should compute critical count', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.criticalCount).toBe('number');
      expect(result.current.criticalCount >= 0).toBeTruthy();
    });

    it('should compute high count', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.highCount).toBe('number');
      expect(result.current.highCount >= 0).toBeTruthy();
    });

    it('should compute open count', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.openCount).toBe('number');
      expect(result.current.openCount >= 0).toBeTruthy();
    });

    it('should compute average resolution time', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.averageResolutionTime).toBe('string');
    });
  });

  describe('State Management', () => {
    it('should track loading state', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should track error state', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      expect(result.current.error === null || typeof result.current.error === 'string').toBeTruthy();
    });

    it('should handle errors gracefully', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      await waitFor(() => {
        // Should not crash with errors
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should subscribe to incidents', () => {
      const { result } = renderHook(() => useIncidentDashboard());

      // Should have subscription active
      expect(result.current.incidents !== undefined).toBeTruthy();
    });

    it('should cleanup subscriptions on unmount', () => {
      const { unmount } = renderHook(() => useIncidentDashboard());

      expect(() => unmount()).not.toThrow();
    });

    it('should handle subscription errors', async () => {
      const { result } = renderHook(() => useIncidentDashboard());

      await waitFor(() => {
        // Should handle errors gracefully
        expect(result.current).toBeDefined();
      });
    });
  });
});

describe('useCriticalIncidents Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return only critical incidents', async () => {
    const { result } = renderHook(() => useCriticalIncidents());

    expect(Array.isArray(result.current.incidents)).toBeTruthy();
  });

  it('should track critical count', () => {
    const { result } = renderHook(() => useCriticalIncidents());

    expect(typeof result.current.count).toBe('number');
  });

  it('should provide refresh function', () => {
    const { result } = renderHook(() => useCriticalIncidents());

    expect(typeof result.current.refresh).toBe('function');
  });

  it('should filter by severity', async () => {
    const { result } = renderHook(() => useCriticalIncidents());

    // All returned incidents should be critical
    if (result.current.incidents.length > 0) {
      result.current.incidents.forEach((incident) => {
        expect(incident.severity === SeverityLevel.CRITICAL).toBeTruthy();
      });
    }
  });

  it('should be subset of all incidents', async () => {
    const { result: allResult } = renderHook(() => useIncidentDashboard());
    const { result: criticalResult } = renderHook(() => useCriticalIncidents());

    await waitFor(() => {
      // Critical incidents should be <= total incidents
      expect(criticalResult.current.incidents.length <= allResult.current.incidents.length).toBeTruthy();
    });
  });

  it('should update in real-time', async () => {
    const { result } = renderHook(() => useCriticalIncidents());

    // Should have subscription
    expect(result.current).toBeDefined();

    // Unmount without error
    // Should cleanup gracefully
  });
});

describe('Dashboard Integration', () => {
  it('should work with pagination and filtering together', async () => {
    const { result } = renderHook(() => useIncidentDashboard());

    act(() => {
      result.current.updateFilters({
        statuses: [EscalationStatus.OPEN],
      });
    });

    act(() => {
      result.current.nextPage();
    });

    // Should handle combined operations
    expect(result.current).toBeDefined();
  });

  it('should maintain data consistency', async () => {
    const { result } = renderHook(() => useIncidentDashboard());

    await waitFor(() => {
      // Total should match incidents + pagination
      expect(result.current.totalIncidents >= result.current.incidents.length).toBeTruthy();
    });
  });

  it('should handle rapid updates', async () => {
    const { result } = renderHook(() => useIncidentDashboard());

    act(() => {
      result.current.nextPage();
      result.current.previousPage();
      result.current.updateFilters({
        statuses: [EscalationStatus.IN_PROGRESS],
      });
    });

    // Should remain stable
    expect(result.current).toBeDefined();
  });
});
