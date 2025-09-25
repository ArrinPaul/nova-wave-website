/*
  NovaWave Service Worker
  Provides offline functionality and caching
*/

const CACHE_NAME = 'novawave-v1.0.0';
const OFFLINE_URL = '/404.html';

// Files to cache for offline functionality
const CACHE_FILES = [
  '/',
  '/index.html',
  '/features.html',
  '/pricing.html',
  '/about.html',
  '/contact.html',
  '/404.html',
  '/assets/css/main.css',
  '/assets/js/script.js',
  '/manifest.json'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('NovaWave Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('NovaWave Service Worker: Caching files');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('NovaWave Service Worker: All files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('NovaWave Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('NovaWave Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('NovaWave Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('NovaWave Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('NovaWave Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('NovaWave Service Worker: Network fetch failed', error);
            
            // For navigation requests, serve the offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, you might want to return a default response
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    console.log('NovaWave Service Worker: Background sync triggered');
    
    event.waitUntil(
      // Handle offline form submissions here
      handleOfflineFormSubmissions()
    );
  }
});

// Push notification handling
self.addEventListener('push', event => {
  console.log('NovaWave Service Worker: Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open NovaWave',
        icon: '/manifest-icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/manifest-icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NovaWave', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('NovaWave Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Helper function for offline form submissions
async function handleOfflineFormSubmissions() {
  // This would handle any queued form submissions when back online
  // Implementation depends on your backend API
  console.log('NovaWave Service Worker: Handling offline form submissions');
}