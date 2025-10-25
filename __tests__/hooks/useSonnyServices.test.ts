import { act, renderHook } from '@testing-library/react';
import { useSonnyServices } from '@/hooks/useSonnyServices';

// Lightweight EventEmitter mock
class Emitter {
  private handlers: Record<string, Function[]> = {};
  on(event: string, handler: Function) {
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(handler);
  }
  emit(event: string, ...args: any[]) {
    (this.handlers[event] || []).forEach(h => h(...args));
  }
}

// Mock all underlying services using jest.mock
jest.mock('@/services/SonnyBridgeService', () => ({
  SonnyBridgeService: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    initialize: jest.fn().mockResolvedValue(true),
    shutdown: jest.fn(),
  }))
}));

jest.mock('@/services/TriggerManagerService', () => ({
  TriggerManagerService: jest.fn().mockImplementation(() => Object.assign(new Emitter(), {
    initialize: jest.fn().mockResolvedValue(true),
  }))
}));

jest.mock('@/services/ConsentLedgerService', () => ({
  ConsentLedgerService: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(true),
  }))
}));

jest.mock('@/services/TrustFrameworkService', () => ({
  TrustFrameworkService: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(true),
    getTrustProfile: jest.fn().mockResolvedValue({ ubuntuScore: 82 })
  }))
}));

jest.mock('@/services/MeshEngineService', () => ({
  MeshEngineService: jest.fn().mockImplementation(() => Object.assign(new Emitter(), {
    initialize: jest.fn().mockResolvedValue(true),
  }))
}));

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

describe('useSonnyServices', () => {
  it('initializes and sets state to online', async () => {
    const { result } = renderHook(() => useSonnyServices(baseConfig));
    // wait for microtasks
    await act(async () => {});

    expect(result.current.state.isInitialized).toBe(true);
    expect(result.current.state.meshStatus).toBe('online');
    expect(result.current.services.sonnyBridge).toBeDefined();
  });

  it('exposes actions.initialize and actions.shutdown', async () => {
    const { result } = renderHook(() => useSonnyServices(baseConfig));
    await act(async () => {});

    expect(typeof result.current.actions.initialize).toBe('function');
    expect(typeof result.current.actions.shutdown).toBe('function');

    act(() => {
      result.current.actions.shutdown();
    });
    expect(result.current.state.isInitialized).toBe(false);
    expect(result.current.state.meshStatus).toBe('offline');
  });
});
