import { useState, useEffect, useCallback } from 'react';

interface OfflineState {
  isOnline: boolean;
  isServiceWorkerRegistered: boolean;
  cachedDocuments: string[];
  offlineActions: OfflineAction[];
}

interface OfflineAction {
  id: string;
  type: 'UPDATE_PROGRESS' | 'COMPLETE_DOCUMENT' | 'UPDATE_PROFILE';
  data: any;
  timestamp: number;
}

export const useOffline = () => {
  const [state, setState] = useState<OfflineState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isServiceWorkerRegistered: false,
    cachedDocuments: [],
    offlineActions: []
  });

  // Load cached documents
  const loadCachedDocuments = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !navigator.serviceWorker?.controller
    ) {
      return;
    }

    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => {
      const { documents } = event.data;
      setState(prev => ({
        ...prev,
        cachedDocuments: documents
      }));
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHED_DOCUMENTS' },
      [channel.port2]
    );
  }, []);

  // Load offline actions from IndexedDB
  const loadOfflineActions = useCallback(async () => {
    try {
      const actions = await getOfflineActions();
      setState(prev => ({
        ...prev,
        offlineActions: actions
      }));
    } catch (error) {
      console.error('Failed to load offline actions:', error);
    }
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Skip in development mode with HMR
    if (process.env.NODE_ENV === 'development') {
      console.debug('Service Worker registration skipped in development (HMR active)');
      return;
    }

    try {
      // Check if SW is already registered
      const existingRegs = await navigator.serviceWorker.getRegistrations();
      if (existingRegs.length > 0) {
        console.log('Service Worker already registered');
        setState(prev => ({
          ...prev,
          isServiceWorkerRegistered: true
        }));
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      console.log('Service Worker registered:', registration);

      setState(prev => ({
        ...prev,
        isServiceWorkerRegistered: true
      }));

      if (navigator.serviceWorker) {
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          const { type } = event.data || {};

          switch (type) {
            case 'SYNC_COMPLETE':
              console.log('Offline sync completed');
              loadOfflineActions(); // Refresh actions
              break;
            default:
              if (type) {
                console.log('Unknown message from SW:', type);
              }
          }
        });
      }

      // Request background sync permission
      if (
        typeof window !== 'undefined' &&
        'ServiceWorkerRegistration' in window &&
        'sync' in (window as any).ServiceWorkerRegistration.prototype
      ) {
        try {
          await (registration as any).sync.register('background-sync');
        } catch (error) {
          console.log('Background sync not supported or failed to register');
        }
      }

    } catch (error) {
      // Silently fail in development - HMR can interfere
      console.debug('Service Worker registration encountered error:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [loadOfflineActions]);

  // Cache document manually
  const cacheDocument = useCallback(async (url: string, content: string) => {
    if (
      typeof navigator === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !navigator.serviceWorker?.controller
    ) {
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_DOCUMENT',
      data: { url, content }
    });
  }, []);

  // Trigger background sync
  const triggerSync = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if (
        typeof window !== 'undefined' &&
        'ServiceWorkerRegistration' in window &&
        'sync' in (window as any).ServiceWorkerRegistration.prototype
      ) {
        await (registration as any).sync.register('background-sync');
      }
    } catch (error) {
      console.log('Background sync not available');
    }
  }, []);

  // Add offline action
  const addOfflineAction = useCallback(async (action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const offlineAction: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    try {
      await saveOfflineAction(offlineAction);
      setState(prev => ({
        ...prev,
        offlineActions: [...prev.offlineActions, offlineAction]
      }));

      // Try to sync immediately if online
      if (state.isOnline) {
        triggerSync();
      }
    } catch (error) {
      console.error('Failed to save offline action:', error);
    }
  }, [state.isOnline, triggerSync]);

  // Handle online/offline status changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      console.log('Connection restored - syncing offline data...');
      triggerSync();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      console.log('Connection lost - switching to offline mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  // Initialize on mount
  useEffect(() => {
    registerServiceWorker();
    loadCachedDocuments();
    // Offline storage disabled for web app - reserved for native apps
    // loadOfflineActions(); ← Disabled to prevent IndexedDB errors
  }, [registerServiceWorker, loadCachedDocuments]);

  return {
    ...state,
    addOfflineAction,
    cacheDocument,
    triggerSync,
    loadCachedDocuments
  };
};

// IndexedDB helpers
// Note: IndexedDB functionality disabled for web app - reserved for native apps
// These functions are kept for reference but not called in web version

async function getOfflineActions(): Promise<OfflineAction[]> {
  // Offline storage disabled for web - returns empty array
  // Native apps (Android, Google TV, Homestead OS) will use this
  return Promise.resolve([]);
}

async function saveOfflineAction(action: OfflineAction): Promise<void> {
  // Offline storage disabled for web - no-op
  // Native apps will implement this
  return Promise.resolve();
}