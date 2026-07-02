const CACHE_NAME = 'stock-monitor-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
    self.clients.claim();
});
self.addEventListener('fetch', e => {
    // Only cache same-origin requests
    if (e.request.url.includes('github.io') || e.request.url.includes('localhost')) {
        e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
            const clone = r.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
            return r;
        })));
    }
});
