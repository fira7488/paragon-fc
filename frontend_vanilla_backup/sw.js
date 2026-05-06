const CACHE_NAME = "paragon-fc-v1";
const urlsToCache = [
  "/",
  "/index-ultimate.html",
  "/gallery.html",
  "/admin.html",
  "/advanced-dashboard.html",
  "/styles.css", // if you have external CSS
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
