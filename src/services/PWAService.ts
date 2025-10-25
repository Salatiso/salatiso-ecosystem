/**
 * PWAService
 * Progressive Web App core service for offline capabilities, caching, and sync
 * Features: Service Worker management, offline data sync, cache strategies
 */

// ==================== Types ====================

export interface CacheStrategy {
  name: string;
  version: number;
  maxAge?: number; // milliseconds
  maxItems?: number;
}

export interface SyncEvent {
  id: string;
  tag: string;
  timestamp: Date;
  data: Record<string, any>;
  status: 'pending' | 'synced' | 'failed';
  retries: number;
}

export interface OfflineData {
  id: string;
  type: 'event' | 'contact' | 'notification' | 'comment';
  userId: string;
  data: Record<string, any>;
  timestamp: Date;
  synced: boolean;
}

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAConfig {
  enableOffline: boolean;
  enableAutoSync: boolean;
  cacheStrategies: CacheStrategy[];
  maxStorageSize: number; // MB
  syncInterval: number; // milliseconds
}

// ==================== PWAService ====================

class PWAService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private syncQueue: SyncEvent[] = [];
  private offlineData: Map<string, OfflineData> = new Map();
  private deferredPrompt: InstallPromptEvent | null = null;
  private config: PWAConfig = {
    enableOffline: true,
    enableAutoSync: true,
    cacheStrategies: [
      { name: 'api-cache', version: 1, maxAge: 3600000, maxItems: 100 },
      { name: 'image-cache', version: 1, maxAge: 86400000, maxItems: 50 },
      { name: 'document-cache', version: 1, maxAge: 604800000, maxItems: 200 },
    ],
    maxStorageSize: 50,
    syncInterval: 30000,
  };

  /**
   * Initialize PWA service
   */
  async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Register service worker
      if ('serviceWorker' in navigator) {
        this.swRegistration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });
        console.log('✅ Service Worker registered');
      }

      // Setup online/offline listeners
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      // Setup install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e as InstallPromptEvent;
        this.notifyInstallPromptReady();
      });

      // App installed listener
      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.notifyAppInstalled();
      });

      // Restore offline data on load
      await this.restoreOfflineData();

      // Start auto-sync if enabled
      if (this.config.enableAutoSync) {
        this.startAutoSync();
      }

      console.log('✅ PWA Service initialized');
    } catch (error) {
      console.error('❌ PWA Service init failed:', error);
    }
  }

  /**
   * Check if app is online
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.isOnline = true;
    console.log('✅ Back online');

    // Trigger sync
    if (this.config.enableAutoSync) {
      this.syncOfflineData();
    }

    this.notifyStatusChange('online');
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.isOnline = false;
    console.log('⚠️  Gone offline');
    this.notifyStatusChange('offline');
  }

  /**
   * Store data for offline use
   */
  async storeOfflineData(
    type: 'event' | 'contact' | 'notification' | 'comment',
    userId: string,
    data: Record<string, any>
  ): Promise<string> {
    try {
      const id = `${type}-${Date.now()}-${Math.random()}`;
      const offlineItem: OfflineData = {
        id,
        type,
        userId,
        data,
        timestamp: new Date(),
        synced: false,
      };

      this.offlineData.set(id, offlineItem);

      // Persist to IndexedDB
      await this.saveToIndexedDB(offlineItem);

      console.log(`📝 Stored offline: ${type}`);
      return id;
    } catch (error) {
      console.error('Error storing offline data:', error);
      throw error;
    }
  }

  /**
   * Get offline data
   */
  async getOfflineData(
    type?: 'event' | 'contact' | 'notification' | 'comment'
  ): Promise<OfflineData[]> {
    const data = Array.from(this.offlineData.values());

    if (type) {
      return data.filter((item) => item.type === type && !item.synced);
    }

    return data.filter((item) => !item.synced);
  }

  /**
   * Sync offline data with server
   */
  async syncOfflineData(): Promise<{ synced: number; failed: number }> {
    try {
      const unsynced = Array.from(this.offlineData.values()).filter((item) => !item.synced);
      let synced = 0;
      let failed = 0;

      for (const item of unsynced) {
        try {
          // Send to server
          const response = await fetch(`/api/sync/${item.type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: item.userId,
              data: item.data,
              offlineId: item.id,
            }),
          });

          if (response.ok) {
            item.synced = true;
            synced++;
            console.log(`✅ Synced: ${item.type}`);
          } else {
            failed++;
            console.error(`❌ Sync failed: ${item.type}`);
          }
        } catch (error) {
          failed++;
          console.error(`❌ Sync error: ${item.type}`, error);
        }
      }

      // Update IndexedDB
      for (const item of unsynced) {
        if (item.synced) {
          this.offlineData.delete(item.id);
          await this.removeFromIndexedDB(item.id);
        }
      }

      console.log(`📊 Sync complete: ${synced} synced, ${failed} failed`);
      return { synced, failed };
    } catch (error) {
      console.error('❌ Sync error:', error);
      return { synced: 0, failed: 0 };
    }
  }

  /**
   * Queue background sync event
   */
  async queueSync(tag: string, data: Record<string, any>): Promise<void> {
    try {
      const syncEvent: SyncEvent = {
        id: `${tag}-${Date.now()}`,
        tag,
        timestamp: new Date(),
        data,
        status: 'pending',
        retries: 0,
      };

      this.syncQueue.push(syncEvent);

      // Request background sync
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(tag);
        console.log(`📤 Queued sync: ${tag}`);
      }
    } catch (error) {
      console.error('❌ Queue sync error:', error);
    }
  }

  /**
   * Start auto-sync interval
   */
  private startAutoSync(): void {
    setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.processSyncQueue();
      }
    }, this.config.syncInterval);
  }

  /**
   * Process sync queue
   */
  private async processSyncQueue(): Promise<void> {
    const queue = [...this.syncQueue];

    for (const event of queue) {
      if (event.status === 'pending' && event.retries < 3) {
        try {
          const response = await fetch(`/api/background-sync/${event.tag}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event.data),
          });

          if (response.ok) {
            event.status = 'synced';
            this.syncQueue = this.syncQueue.filter((e) => e.id !== event.id);
            console.log(`✅ Background sync completed: ${event.tag}`);
          } else {
            event.retries++;
            console.warn(`⚠️  Retrying sync: ${event.tag} (${event.retries}/3)`);
          }
        } catch (error) {
          event.retries++;
          console.error(`❌ Background sync error: ${event.tag}`, error);
        }
      }
    }
  }

  /**
   * Prompt user to install app
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ App installed');
        this.deferredPrompt = null;
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Install prompt error:', error);
      return false;
    }
  }

  /**
   * Check if install is available
   */
  isInstallPromptAvailable(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Check if app is installed
   */
  isAppInstalled(): boolean {
    if (typeof window === 'undefined') return false;

    // Check display mode
    if ((window.navigator as any).standalone === true) {
      return true;
    }

    // Check media query
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // Check fullscreen
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return true;
    }

    return false;
  }

  /**
   * Clear cache
   */
  async clearCache(cacheName?: string): Promise<void> {
    try {
      if (typeof caches === 'undefined') return;

      if (cacheName) {
        await caches.delete(cacheName);
        console.log(`✅ Cleared cache: ${cacheName}`);
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log('✅ Cleared all caches');
      }
    } catch (error) {
      console.error('❌ Clear cache error:', error);
    }
  }

  /**
   * Get cache stats
   */
  async getCacheStats(): Promise<{ cacheName: string; size: number; items: number }[]> {
    try {
      if (typeof caches === 'undefined') return [];

      const cacheNames = await caches.keys();
      const stats = [];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        let size = 0;

        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            size += blob.size;
          }
        }

        stats.push({
          cacheName,
          size,
          items: requests.length,
        });
      }

      return stats;
    } catch (error) {
      console.error('❌ Get cache stats error:', error);
      return [];
    }
  }

  /**
   * Save data to IndexedDB
   */
  private async saveToIndexedDB(data: OfflineData): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) return;

    try {
      const request = window.indexedDB.open('salatiso-pwa', 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['offlineData'], 'readwrite');
        const store = transaction.objectStore('offlineData');
        store.put(data);
      };
    } catch (error) {
      console.error('IndexedDB save error:', error);
    }
  }

  /**
   * Restore data from IndexedDB
   */
  private async restoreOfflineData(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) return;

    try {
      const request = window.indexedDB.open('salatiso-pwa', 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['offlineData'], 'readonly');
        const store = transaction.objectStore('offlineData');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const data = getAllRequest.result as OfflineData[];
          data.forEach((item) => {
            this.offlineData.set(item.id, item);
          });
          console.log(`📂 Restored ${data.length} offline items`);
        };
      };
    } catch (error) {
      console.error('IndexedDB restore error:', error);
    }
  }

  /**
   * Remove data from IndexedDB
   */
  private async removeFromIndexedDB(id: string): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) return;

    try {
      const request = window.indexedDB.open('salatiso-pwa', 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['offlineData'], 'readwrite');
        const store = transaction.objectStore('offlineData');
        store.delete(id);
      };
    } catch (error) {
      console.error('IndexedDB delete error:', error);
    }
  }

  /**
   * Get storage quota
   */
  async getStorageQuota(): Promise<{ usage: number; quota: number; percentage: number }> {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
          percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
        };
      }

      return { usage: 0, quota: 0, percentage: 0 };
    } catch (error) {
      console.error('❌ Storage quota error:', error);
      return { usage: 0, quota: 0, percentage: 0 };
    }
  }

  // ==================== Callbacks ====================

  private callbacks = {
    onInstallPromptReady: [] as (() => void)[],
    onAppInstalled: [] as (() => void)[],
    onStatusChange: [] as ((status: 'online' | 'offline') => void)[],
  };

  onInstallPromptReady(callback: () => void): void {
    this.callbacks.onInstallPromptReady.push(callback);
  }

  onAppInstalled(callback: () => void): void {
    this.callbacks.onAppInstalled.push(callback);
  }

  onStatusChange(callback: (status: 'online' | 'offline') => void): void {
    this.callbacks.onStatusChange.push(callback);
  }

  private notifyInstallPromptReady(): void {
    this.callbacks.onInstallPromptReady.forEach((cb) => cb());
  }

  private notifyAppInstalled(): void {
    this.callbacks.onAppInstalled.forEach((cb) => cb());
  }

  private notifyStatusChange(status: 'online' | 'offline'): void {
    this.callbacks.onStatusChange.forEach((cb) => cb(status));
  }
}

// ==================== Export ====================

const pwaService = new PWAService();
export default pwaService;
