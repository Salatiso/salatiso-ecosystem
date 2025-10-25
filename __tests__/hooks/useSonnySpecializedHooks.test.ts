import { renderHook, act } from '@testing-library/react';
import { useSonnyBridge, useSafetyManager, useConsentManager, useTrustNetwork } from '@/hooks/useSonnyServices';

// Mock the base useSonnyServices hook
jest.mock('@/hooks/useSonnyServices', () => {
  const originalModule = jest.requireActual('@/hooks/useSonnyServices');
  return {
    ...originalModule,
    useSonnyServices: jest.fn(() => ({
      state: { isInitialized: true, meshStatus: 'online', isConnecting: false, connectionCount: 3 },
      familyMembers: [
        { id: 'f1', name: 'Family Member 1', status: 'online', trustScore: 85, role: 'parent', lastSeen: new Date() }
      ],
      safetyStatus: { isActive: false, activeTriggers: [], lastCheckIn: new Date() },
      services: {
        sonnyBridge: {
          sendFamilyMessage: jest.fn().mockResolvedValue(true),
          broadcastFamilyStatus: jest.fn().mockResolvedValue(true)
        },
        triggerManager: {
          performCheckIn: jest.fn().mockResolvedValue(true),
          triggerEmergency: jest.fn().mockResolvedValue(true),
          createGeofence: jest.fn().mockResolvedValue(true)
        },
        consentLedger: {
          requestConsent: jest.fn().mockResolvedValue(true),
          grantConsent: jest.fn().mockResolvedValue(true),
          checkConsent: jest.fn().mockResolvedValue(true)
        },
        trustFramework: {
          getTrustProfile: jest.fn().mockResolvedValue({ ubuntuScore: 88, id: 'user1' }),
          recordInteraction: jest.fn().mockResolvedValue(true),
          updateUbuntuQualities: jest.fn().mockResolvedValue(true)
        }
      }
    }))
  };
});

const baseConfig = {
  nodeId: 'node_test',
  deviceId: 'device_test',
  displayName: 'Tester',
  familyId: 'fam_1',
  userId: 'user_1',
  enableBluetooth: false,
  enableWifiDirect: false,
  enableInternetBridge: true,
  debugMode: false,
};

describe('Specialized Sonny Hooks', () => {
  describe('useSonnyBridge', () => {
    it('exposes messaging functions', async () => {
      const { result } = renderHook(() => useSonnyBridge(baseConfig));

      expect(result.current.isConnected).toBe(true);
      expect(result.current.connectionCount).toBe(3);
      expect(typeof result.current.sendFamilyMessage).toBe('function');
      expect(typeof result.current.broadcastStatusUpdate).toBe('function');

      await act(async () => {
        const sent = await result.current.sendFamilyMessage('recipient1', 'Hello family!');
        expect(sent).toBe(true);
      });
    });
  });

  describe('useSafetyManager', () => {
    it('provides safety functions', async () => {
      const { result } = renderHook(() => useSafetyManager(baseConfig));

      expect(typeof result.current.performCheckIn).toBe('function');
      expect(typeof result.current.triggerEmergency).toBe('function');
      expect(typeof result.current.setGeofence).toBe('function');

      await act(async () => {
        const checked = await result.current.performCheckIn({ lat: -33.9, lng: 18.4 });
        expect(checked).toBe(true);
      });
    });
  });

  describe('useConsentManager', () => {
    it('manages permissions', async () => {
      const { result } = renderHook(() => useConsentManager(baseConfig));

      expect(typeof result.current.requestPermission).toBe('function');
      expect(typeof result.current.grantPermission).toBe('function');
      expect(typeof result.current.checkPermission).toBe('function');

      await act(async () => {
        const requested = await result.current.requestPermission('user2', 'location', 'family', 'Safety check');
        expect(requested).toBe(true);
      });
    });
  });

  describe('useTrustNetwork', () => {
    it('provides trust scoring functions', async () => {
      const { result } = renderHook(() => useTrustNetwork(baseConfig));

      expect(typeof result.current.getTrustScore).toBe('function');
      expect(typeof result.current.recordInteraction).toBe('function');
      expect(typeof result.current.updateUbuntuQualities).toBe('function');

      await act(async () => {
        const score = await result.current.getTrustScore('user2');
        expect(score).toBe(88);
      });
    });
  });
});
