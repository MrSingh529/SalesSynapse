const CACHE_NAME = 'sales-synapse-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Install event with error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Try to add all, but don't fail if some resources are missing
        return cache.addAll(urlsToCache).catch((error) => {
          console.warn('Cache addAll failed for some resources:', error);
          // Cache resources individually to avoid complete failure
          return Promise.all(
            urlsToCache.map((url) => {
              return cache.add(url).catch((err) => {
                console.warn(`Failed to cache ${url}:`, err);
              });
            })
          );
        });
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event with network-first strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Network-first strategy for API calls
  if (event.request.url.includes('/api/') || event.request.url.includes('firestore')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return a custom offline page if available
            return caches.match('/index.html');
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-visits') {
    event.waitUntil(syncVisits());
  }
});

async function syncVisits() {
  console.log('Syncing offline visits...');
  // Implement offline visit sync logic here
}
