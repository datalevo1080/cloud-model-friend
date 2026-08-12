/*
 * ZipGIF service worker.
 * Two jobs, both privacy-preserving:
 *  1. Cache the Gifsicle WebAssembly bundle so repeat visits start instantly.
 *  2. Cache the app shell (HTML/CSS/JS) so the UI opens offline.
 * No user file, no GIF and no file metadata is ever cached or transmitted.
 */
const ENGINE_CACHE = "zipgif-engine-v1";
const SHELL_CACHE = "zipgif-shell-v2";
const KEEP = [ENGINE_CACHE, SHELL_CACHE];
const ENGINE = /gifsicle|\.wasm$/i;
const SHELL_URLS = ["/", "/site.webmanifest", "/favicon.png", "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.allSettled(SHELL_URLS.map((u) => cache.add(u)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok && res.status === 200) {
    try {
      await cache.put(req, res.clone());
    } catch {
      /* quota exceeded — serve from network */
    }
  }
  return res;
}

async function networkFirst(req, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res && res.ok && res.status === 200) {
      try {
        await cache.put(req, res.clone());
      } catch {
        /* ignore */
      }
    }
    return res;
  } catch (err) {
    const hit = (await cache.match(req)) || (fallbackUrl && (await cache.match(fallbackUrl)));
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (ENGINE.test(url.pathname)) {
    event.respondWith(cacheFirst(req, ENGINE_CACHE));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, SHELL_CACHE, "/"));
    return;
  }

  if (/\.(?:js|css|woff2|png|svg|ico|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          return await cacheFirst(req, SHELL_CACHE);
        } catch {
          return fetch(req);
        }
      })(),
    );
  }
});
