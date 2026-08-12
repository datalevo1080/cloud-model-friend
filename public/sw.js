/*
 * ZipGIF engine cache.
 * Stores the Gifsicle WebAssembly bundle in the browser's Cache Storage so
 * repeat visits start instantly. Nothing is uploaded and no user file ever
 * touches this cache — only the immutable, hashed engine asset.
 */
const CACHE = "zipgif-engine-v1";
const ENGINE = /gifsicle|\.wasm$/i;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

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
  if (!ENGINE.test(url.pathname)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
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
    })(),
  );
});
