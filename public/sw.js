/*
 * ZipGIF engine cache.
 * Stores the Gifsicle WebAssembly bundle in the browser's Cache Storage so
 * repeat visits start instantly. Nothing is uploaded and no user file ever
 * touches this cache — only the immutable, hashed engine asset.
 *
 * Updates are cooperative: a new worker waits until the page tells it to take
 * over, and the page only asks once the engine is cached, so an update never
 * reloads someone into a slow cold start.
 */
const CACHE = "zipgif-engine-v1";
const ENGINE = /gifsicle|\.wasm$/i;

// A fresh worker installs but does NOT skip waiting — the page decides when.
self.addEventListener("install", () => {
  /* wait for SKIP_WAITING */
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

async function engineCached() {
  try {
    const cache = await caches.open(CACHE);
    const keys = await cache.keys();
    return keys.some((req) => ENGINE.test(new URL(req.url).pathname));
  } catch {
    return false;
  }
}

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (data.type === "ENGINE_STATUS") {
    const port = event.ports && event.ports[0];
    event.waitUntil(
      engineCached().then((ready) => {
        if (port) port.postMessage({ type: "ENGINE_STATUS", ready });
      }),
    );
  }
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
