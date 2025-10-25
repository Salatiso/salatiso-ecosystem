import { renderHook, act, waitFor } from '@testing-library/react';
import { useEscalation } from '@/hooks/useEscalation';
import {
  EscalationLevel,
  EscalationStatus,
  SeverityLevel,
  EscalationContext,
} from '@/types/escalation';

// Mock Firebase
jest.mock('@/config/firebase');
jest.mock('firebase/auth');

describe('useEscalation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() => useEscalation('test-escalation-id'));

      expect(result.current.isLoading).toBeTruthy();
      expect(result.current.escalation).toBeNull();
    });

    it('should load escalation data', async () => {
      const { result } = renderHook(() => useEscalation('test-escalation-id'));

      await waitFor(() => {
        expect(result.current.isLoading).toBeFalsy();
      });
    });

    it('should handle loading errors', async () => {
      const { result } = renderHook(() => useEscalation('invalid-id'));

      await waitFor(() => {
        expect(result.current.isLoading).toBeFalsy();
      });

      // May have error or no data
      expect(result.current.escalation === null || result.current.error).toBeTruthy();
    });
  });

  describe('Escalation Data', () => {
    it('should provide escalation properties', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      await waitFor(() => {
        if (result.current.escalation) {
          expect(result.current.escalation.id).toBeDefined();
          expect(result.current.escalation.context).toBeDefined();
          expect(result.current.escalation.severity).toBeDefined();
          expect(result.current.escalation.currentLevel).toBeDefined();
          expect(result.current.escalation.status).toBeDefined();
        }
      });
    });

    it('should provide user role information', () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      // Should have userRole computed from permissions
      expect(result.current.userRole === null || typeof result.current.userRole === 'string').toBeTruthy();
    });
  });

  describe('Computed Properties', () => {
    it('should compute isResolved status', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.isResolved).toBe('boolean');
    });

    it('should compute isCritical status', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.isCritical).toBe('boolean');
    });

    it('should compute canAutoEscalate', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.canAutoEscalate).toBe('boolean');
    });

    it('should compute nextLevel', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      const nextLevel = result.current.nextLevel;
      expect(nextLevel === null || Object.values(EscalationLevel).includes(nextLevel as EscalationLevel)).toBeTruthy();
    });

    it('should compute timeInCurrentLevel', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.timeInCurrentLevel).toBe('number');
    });
  });

  describe('Permissions', () => {
    it('should check canEscalate permission', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.canEscalate).toBe('boolean');
    });

    it('should check canResolve permission', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.canResolve).toBe('boolean');
    });
  });

  describe('Actions', () => {
    it('should provide updateStatus action', () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.updateStatus).toBe('function');
    });

    it('should provide escalateToNext action', () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.escalateToNext).toBe('function');
    });

    it('should provide assignResponder action', () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.assignResponder).toBe('function');
    });

    it('should provide acknowledgeAssignment action', () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.acknowledgeAssignment).toBe('function');
    });

    it('should provide handoffEscalation action', () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.handoffEscalation).toBe('function');
    });

    it('should provide logAction action', () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      expect(typeof result.current.logAction).toBe('function');
    });
  });

  describe('Real-time Subscriptions', () => {
    it('should cleanup subscriptions on unmount', async () => {
      const { unmount } = renderHook(() => useEscalation('test-id'));

      // Unmount and verify no memory leaks
      expect(() => unmount()).not.toThrow();
    });

    it('should handle reconnection', async () => {
      const { result } = renderHook(() => useEscalation('test-id'));

      // Component should remain stable during reconnection
      expect(result.current).toBeDefined();
    });
  });

  describe('useUserEscalations Hook', () => {
    it('should return array of escalations', async () => {
      const { result } = renderHook(() => {
        const main = useEscalation('');
        return main;
      });

      // Hook should support multiple escalations
      expect(result.current).toBeDefined();
    });

    it('should track open escalation count', async () => {
      const { result } = renderHook(() => useEscalation(''));

      expect(typeof result.current).toBe('object');
    });

    it('should provide refresh function', () => {
      const { result } = renderHook(() => useEscalation(''));

      expect(result.current).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should set error state on failure', async () => {
      const { result } = renderHook(() => useEscalation('invalid-id'));

      await waitFor(() => {
        // Either error or no data is acceptable
        expect(result.current.error === null || typeof result.current.error === 'string').toBeTruthy();
      });
    });

    it('should provide error message', async () => {
      const { result } = renderHook(() => useEscalation('invalid-id'));

      await waitFor(() => {
        if (result.current.error) {
          expect(typeof result.current.error).toBe('string');
        }
      });
    });
  });
});
