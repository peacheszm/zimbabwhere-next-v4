const CACHE_NAME = "zimbabwhere-v1.0.2";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/img/icon-192.png",
  "/img/icon-512.png",
  "/img/zimbabwhere-logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
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
