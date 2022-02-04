const CACHE_NAME = "pomodoro-V1";
const urlsToCache = ['/'];

const self = this;

// Install SW
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function (response) {
      return response;
    })
  );
});

// Activate the SW
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return Promise.all(
        cacheName.filter(function (cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});