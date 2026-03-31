const CACHE_NAME = 'tourneylinks-pwa-v1';

// Install Event - Precache core routing
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Intentionally lightweight. Let Next.js handle aggressive caching, we just need the shell to exist.
      return cache.addAll(['/']);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First, Fallback to Cache
self.addEventListener('fetch', (event) => {
  // We explicitly bypass API routes so we don't accidentally cache dynamic scoring data endpoints 
  if (event.request.url.includes('/api/')) {
     return; // Let the React Application handle offline API queuing via localStorage
  }

  // Network First Strategy for UI assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
         // Optionally cache successful non-API requests here dynamically
         return networkResponse;
      })
      .catch(() => {
         // If offline, serve from cache so the device doesn't crash to a white screen
         return caches.match(event.request).then((cachedResponse) => {
             if (cachedResponse) return cachedResponse;
             // If completely missing, return a basic offline fallback or original request
             return new Response('Internet Connection Lost. TourneyLinks is tracking your scores offline.', { headers: { 'Content-Type': 'text/plain' }});
         });
      })
  );
});
