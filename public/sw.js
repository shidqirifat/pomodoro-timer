const CACHE_NAME = "pomodoro-V1";
const urlsToCache = ['/'];

const self = this;

self.addEventListener("install", function (event) {
  event.waitUntil(preLoad());
});

const preLoad = async function () {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(urlsToCache);
  });
};

self.addEventListener("fetch", function (event) {
  event.respondWith(checkResponse(event.request).catch(function () {
    return returnFromCache(event.request);
  }));
  event.waitUntil(addToCache(event.request));
});

const checkResponse = function (request) {
  return new Promise(function (fulfill, reject) {
    fetch(request).then(function (response) {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};

const addToCache = async function (request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
};

const returnFromCache = async function (request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return cache.match("offline.html");
      } else {
        return matching;
      }
    });
  });
};