// Minimal service worker — enables PWA install and basic offline shell
const CACHE = 'freshket-v1';
const ASSETS = ['./index.html', './manifest.json', './icon.png'];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS).catch(function() { /* ignore missing */ });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  // Network-first for API calls, cache-first for app shell
  const url = e.request.url;
  if (url.includes('/api/') || url.includes('frankfurter') || url.includes('generativelanguage')) {
    return; // let network handle API/data calls
  }
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request).then(function(r) {
        return r || caches.match('./index.html');
      });
    })
  );
});
