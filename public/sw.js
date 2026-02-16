const CACHE_NAME = 'iapourtous-course-v1';
const STATIC_CACHE = 'iapourtous-static-v1';

// Pre-cache essential app shell
const APP_SHELL = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache course content requests
  if (url.pathname.startsWith('/offline/course/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
    return;
  }

  // For API calls to supabase, try network first
  if (url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache GET requests for course data
          if (event.request.method === 'GET' && url.pathname.includes('/rest/')) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Network-first for navigation, cache-first for assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for static assets
  if (url.pathname.match(/\.(js|css|png|jpg|svg|woff2?)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const cloned = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, cloned));
          return response;
        });
      })
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Prevent downloads - intercept and block
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Block direct file downloads of course content
  if (event.request.destination === 'document' && 
      (url.pathname.endsWith('.pdf') || url.pathname.endsWith('.docx'))) {
    if (url.pathname.includes('/courses/')) {
      event.respondWith(
        new Response('Téléchargement non autorisé. Consultez le contenu en ligne.', {
          status: 403,
          headers: { 'Content-Type': 'text/plain' },
        })
      );
    }
  }
});
