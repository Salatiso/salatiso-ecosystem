/**
 * Service Worker
 * Handles offline capabilities, caching, and background sync
 * Place at: public/service-worker.js (note: .js not .ts for SW)
 */

const CACHE_VERSION = 'v1';
const CACHES_TO_CLEANUP = [
  `api-cache-${CACHE_VERSION}`,
  `image-cache-${CACHE_VERSION}`,
  `document-cache-${CACHE_VERSION}`,
  `page-cache-${CACHE_VERSION}`,
];

const API_CACHE = `api-cache-${CACHE_VERSION}`;
const IMAGE_CACHE = `image-cache-${CACHE_VERSION}`;
const DOCUMENT_CACHE = `document-cache-${CACHE_VERSION}`;
const PAGE_CACHE = `page-cache-${CACHE_VERSION}`;

// Cache size limits
const CACHE_LIMITS = {
  [API_CACHE]: 100,
  [IMAGE_CACHE]: 50,
  [DOCUMENT_CACHE]: 200,
  [PAGE_CACHE]: 50,
};

// ==================== Install ====================

self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');

  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => {
      console.log('✅ Cache opened:', PAGE_CACHE);
      // Cache essential pages
      return cache.addAll([
        '/',
        '/intranet/calendar',
        '/intranet/contacts',
        '/intranet/notifications',
        '/offline.html',
      ]).catch((error) => {
        console.warn('⚠️  Some resources failed to cache:', error);
      });
    }).then(() => {
      console.log('✅ Service Worker installed');
      return self.skipWaiting();
    })
  );
});

// ==================== Activate ====================

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!CACHES_TO_CLEANUP.includes(cacheName)) {
            console.log('🗑️  Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// ==================== Fetch ====================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other special protocols
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // API routes - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Images - Cache first, fallback to network
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Documents - Cache first, fallback to network
  if (
    url.pathname.endsWith('.pdf') ||
    url.pathname.endsWith('.doc') ||
    url.pathname.endsWith('.docx') ||
    url.pathname.endsWith('.xls')
  ) {
    event.respondWith(cacheFirstStrategy(request, DOCUMENT_CACHE));
    return;
  }

  // Pages - Network first, fallback to cache
  if (request.destination === 'document' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirstStrategy(request, PAGE_CACHE));
    return;
  }

  // Default - Stale while revalidate
  event.respondWith(staleWhileRevalidateStrategy(request));
});

// ==================== Cache Strategies ====================

/**
 * Cache first strategy - Use cache, fallback to network
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      console.log('📦 Cache hit:', request.url);
      return cached;
    }

    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    await enforceLimit(cacheName);

    console.log('✅ Cached:', request.url);
    return response;
  } catch (error) {
    console.error('❌ Cache first error:', error);
    return createOfflineResponse();
  }
}

/**
 * Network first strategy - Use network, fallback to cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    await enforceLimit(cacheName);

    console.log('✅ Network fresh:', request.url);
    return response;
  } catch (error) {
    console.warn('⚠️  Network failed, using cache:', request.url);

    const cached = await caches.match(request);
    if (cached) {
      console.log('📦 Cache fallback:', request.url);
      return cached;
    }

    return createOfflineResponse();
  }
}

/**
 * Stale while revalidate strategy
 */
async function staleWhileRevalidateStrategy(request) {
  try {
    const cached = await caches.match(request);

    const fetchPromise = fetch(request).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const cache = caches.open(PAGE_CACHE);
      cache.then((c) => {
        c.put(request, response.clone());
        return enforceLimit(PAGE_CACHE);
      });

      return response;
    });

    return cached || fetchPromise;
  } catch (error) {
    console.error('❌ Stale while revalidate error:', error);
    return createOfflineResponse();
  }
}

// ==================== Cache Management ====================

/**
 * Enforce cache size limits
 */
async function enforceLimit(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const limit = CACHE_LIMITS[cacheName] || 50;

  if (keys.length > limit) {
    const toDelete = keys.slice(0, keys.length - limit);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
    console.log(`🗑️  Trimmed ${cacheName} to ${limit} items`);
  }
}

/**
 * Create offline response
 */
function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      offline: true,
      message: 'You are offline. Changes will sync when back online.',
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// ==================== Background Sync ====================

self.addEventListener('sync', (event) => {
  console.log('📤 Background sync:', event.tag);

  if (event.tag.startsWith('sync-')) {
    event.waitUntil(
      (async () => {
        try {
          // Notify all clients to trigger sync
          const clients = await self.clients.matchAll();
          clients.forEach((client) => {
            client.postMessage({
              type: 'BACKGROUND_SYNC',
              tag: event.tag,
            });
          });

          console.log('✅ Background sync completed:', event.tag);
        } catch (error) {
          console.error('❌ Background sync error:', error);
          throw error;
        }
      })()
    );
  }
});

// ==================== Push Notifications ====================

self.addEventListener('push', (event) => {
  console.log('📬 Push notification received');

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || 'You have a new notification',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: data.tag || 'notification',
      requireInteraction: data.requireInteraction || false,
      data: data.data || {},
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Salatiso', options)
    );
  }
});

// ==================== Notification Click ====================

self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification clicked:', event.notification.tag);

  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if client is already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ==================== Message Handler ====================

self.addEventListener('message', (event) => {
  console.log('💬 Message received:', event.data.type);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('🗑️  Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }

  if (event.data.type === 'GET_CACHE_STATS') {
    event.waitUntil(
      (async () => {
        const stats = [];
        for (const cacheName of CACHES_TO_CLEANUP) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          stats.push({
            name: cacheName,
            items: keys.length,
          });
        }

        event.ports[0].postMessage({
          type: 'CACHE_STATS',
          stats,
        });
      })()
    );
  }
});

console.log('✅ Service Worker loaded');
