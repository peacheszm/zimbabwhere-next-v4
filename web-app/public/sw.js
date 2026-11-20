// Push notifications (OneSignal) and the offline cache share this one worker:
// a second worker on the same scope would replace this one and break push.
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_NAME = "zimbabwhere-v1.0.3";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/img/icon-192.png",
  "/img/icon-512.png",
  "/img/zimbabwhere-logo.png",
];

self.addEventListener("install", (event) => {
  // Cache each file on its own. addAll() fails the whole install if a single
  // file can't be fetched, and a worker that never installs also takes push
  // notifications (OneSignal) down with it.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        ASSETS_TO_CACHE.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn("sw: couldn't cache", asset, err);
          }),
        ),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  // Use Network First for HTML navigation requests to ensure latest Next.js assets are referenced
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/", { ignoreSearch: true });
      })
    );
    return;
  }

  // Use Cache First for all other requests (like images and manifest)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
