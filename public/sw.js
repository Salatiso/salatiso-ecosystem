// Service Worker for Salatiso PWA - Phase 4.5
// Enhanced offline support, caching strategies, push notifications, background sync
const CACHE_VERSION = 'v4-phase4.5';
const CACHE_NAMES = {
  static: `salatiso-static-${CACHE_VERSION}`,
  dynamic: `salatiso-dynamic-${CACHE_VERSION}`,
  images: `salatiso-images-${CACHE_VERSION}`,
  api: `salatiso-api-${CACHE_VERSION}`
};

const FILE_PATTERNS = {
  static: /\.(css|js|woff|woff2|ttf|eot)$/i,
  images: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/i
};

const CRITICAL = ['/', '/offline', '/manifest.json'];
const SKIP_CACHE = ['__nextData', 'sockjs-node', 'hot-update'];

// Install event - cache critical assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...', CACHE_VERSION);
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAMES.static);
      for (const url of CRITICAL) {
        try {
          await cache.add(url);
          console.log('[ServiceWorker] Cached:', url);
        } catch (err) {
          console.warn('[ServiceWorker] Cache fail:', url, err?.message);
        }
      }
    } catch (err) {
      console.warn('[ServiceWorker] Install error:', err?.message);
    }
  })());
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map(key => {
        if (!Object.values(CACHE_NAMES).includes(key)) {
          return caches.delete(key);
        }
      })
    );
  })());
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Exclude Google APIs and other external scripts from caching
  if (url.hostname.includes('google.com') || url.hostname.includes('gstatic.com')) {
    return;
  }

  // Skip extension URLs
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

  // Skip HMR and development URLs
  if (SKIP_CACHE.some(pattern => url.href.includes(pattern))) return;

  // Skip dynamic imports
  if (url.pathname.includes('_next')) return;

  // API requests with fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok || response.status === 404) {
          const cache = await caches.open(CACHE_NAMES.api);
          cache.put(request, response.clone());
          return response;
        }
      } catch (err) {
        console.log('[SW] Net fail:', url.href);
        const cached = await caches.match(request);
        if (cached) return cached;
      }
      return new Response('Offline', { status: 503 });
    })());
    return;
  }

  // Static assets
  if (FILE_PATTERNS.static.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) {
        fetch(request)
          .then(response => {
            if (response && response.ok) {
              caches.open(CACHE_NAMES.static).then(cache => {
                cache.put(request, response);
              });
            }
          })
          .catch(() => {});
        return cached;
      }

      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAMES.static);
          cache.put(request, response.clone());
          return response;
        }
      } catch (err) {
        return new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  // Images
  if (FILE_PATTERNS.images.test(url.pathname)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.status === 404)) {
          const cache = await caches.open(CACHE_NAMES.images);
          cache.put(request, response.clone());
          return response;
        }
      } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;
      }
      return new Response('Offline', { status: 503 });
    })());
    return;
  }

  // Navigation requests
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.status === 404)) return response;
      } catch (err) {}
      return (await caches.match('/offline.html')) || new Response('Offline', { status: 503 });
    })());
    return;
  }

  // Default - dynamic content
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response && (response.ok || response.status === 404)) {
        const cache = await caches.open(CACHE_NAMES.dynamic);
        cache.put(request, response.clone());
        return response;
      }
    } catch (err) {
      const cached = await caches.match(request);
      if (cached) return cached;
    }
    return new Response('Offline', { status: 503 });
  })());
});

// Message handling
self.addEventListener('message', event => {
  const { type, data } = event.data || {};

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (type === 'CLEAR_CACHE' && data?.cacheName) {
    if (Object.values(CACHE_NAMES).includes(data.cacheName)) {
      caches.delete(data.cacheName);
      console.log('[SW] Cache cleared:', data.cacheName);
    }
  }
});

// Push notification event - Phase 4.5 PWA
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');
  
  if (!event.data) {
    console.log('[ServiceWorker] No data in push event');
    return;
  }

  let notificationData = {
    title: 'Salatiso Alert',
    body: 'New update available',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    tag: 'default-notification',
  };

  try {
    notificationData = JSON.parse(event.data.text());
  } catch (e) {
    notificationData.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: { url: notificationData.url || '/' },
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].url === url && 'focus' in clientList[i]) {
            return clientList[i].focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'sync-escalations') {
    event.waitUntil(syncEscalations());
  }
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Helper: Sync escalations
async function syncEscalations() {
  console.log('[ServiceWorker] Syncing escalations...');
  try {
    const response = await fetch('/api/escalations/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('[ServiceWorker] Escalations synced:', response.status);
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    throw error;
  }
}

// Helper: Sync notifications
async function syncNotifications() {
  console.log('[ServiceWorker] Syncing notifications...');
  try {
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('[ServiceWorker] Notifications synced:', response.status);
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    throw error;
  }
}

console.log('[ServiceWorker] ' + CACHE_VERSION + ' ready - PWA enabled');
