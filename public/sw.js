/* Workbox-powered Service Worker for الدسوقي لمنتجات الألبان
 * - Precache app shell + offline fallback
 * - HTML: StaleWhileRevalidate w/ offline fallback
 * - Images: CacheFirst
 * - CSS/JS: StaleWhileRevalidate
 * - Fonts: CacheFirst (long term)
 * - API: NetworkFirst w/ cache fallback
 * - Automatic old-cache cleanup + versioning
 */
importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js");

const VERSION = "v3-2026-07-18";
workbox.core.setCacheNameDetails({
  prefix: "dsoky",
  suffix: VERSION,
  precache: "precache",
  runtime: "runtime",
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(`dsoky-precache-${VERSION}`).then((cache) =>
      cache.addAll(["/", "/offline.html", "/manifest.webmanifest", "/favicon.png", "/icon-512.png"])
    )
  );
});

// Take over open tabs and clean any older caches not matching current VERSION.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("dsoky-") && !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// --------- Routes ---------

// HTML pages: StaleWhileRevalidate + fallback to /offline.html when offline.
workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: `dsoky-pages-${VERSION}`,
    networkTimeoutSeconds: 4,
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// Images (products + hero + icons): CacheFirst
workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: `dsoky-images-${VERSION}`,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 60 }),
    ],
  })
);

// CSS + JS: StaleWhileRevalidate
workbox.routing.registerRoute(
  ({ request }) => request.destination === "style" || request.destination === "script" || request.destination === "worker",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `dsoky-assets-${VERSION}`,
  })
);

// Fonts: CacheFirst, long lived
workbox.routing.registerRoute(
  ({ request, url }) =>
    request.destination === "font" ||
    url.origin === "https://fonts.gstatic.com" ||
    url.origin === "https://fonts.googleapis.com",
  new workbox.strategies.CacheFirst({
    cacheName: `dsoky-fonts-${VERSION}`,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);

// APIs: NetworkFirst with cache fallback
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new workbox.strategies.NetworkFirst({
    cacheName: `dsoky-api-${VERSION}`,
    networkTimeoutSeconds: 6,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  })
);

// Offline navigation fallback
workbox.routing.setCatchHandler(async ({ event }) => {
  if (event.request.destination === "document" || event.request.mode === "navigate") {
    const cache = await caches.open(`dsoky-precache-${VERSION}`);
    const offline = await cache.match("/offline.html");
    if (offline) return offline;
  }
  return Response.error();
});
