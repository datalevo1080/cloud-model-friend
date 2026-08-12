import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

/**
 * Cooperative service-worker updates.
 *
 * A waiting worker is never forced through. We first ask it whether the
 * Gifsicle engine is already in its cache; only once it is (or after a short
 * grace period) do we hand over and reload, so an update can never drop
 * someone onto a cold, slow first compression. Everything is announced in
 * plain language through a small status pill.
 */

type Phase = "idle" | "found" | "priming" | "ready" | "reloading";

const GRACE_MS = 6000;

function isPreviewHost(host: string): boolean {
  return (
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev")
  );
}

function askEngineReady(worker: ServiceWorker): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const done = (v: boolean) => {
      if (settled) return;
      settled = true;
      resolve(v);
    };
    try {
      const channel = new MessageChannel();
      channel.port1.onmessage = (e) => done(Boolean(e.data?.ready));
      worker.postMessage({ type: "ENGINE_STATUS" }, [channel.port2]);
      window.setTimeout(() => done(false), 1500);
    } catch {
      done(false);
    }
  });
}

export function ServiceWorkerUpdater() {
  const [phase, setPhase] = useState<Phase>("idle");
  const reloading = useRef(false);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const host = window.location.hostname;
    const off = new URLSearchParams(window.location.search).get("sw") === "off";

    // Never run in the Lovable preview, in an iframe, or with the kill switch.
    if (off || window.self !== window.top || isPreviewHost(host)) {
      void navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .catch(() => {});
      return;
    }

    let cancelled = false;
    let timer = 0;

    const onControllerChange = () => {
      if (reloading.current) return;
      reloading.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const takeOver = async (waiting: ServiceWorker) => {
      if (cancelled) return;
      setPhase("priming");
      const ready = await askEngineReady(waiting);
      if (cancelled) return;
      const go = () => {
        if (cancelled) return;
        setPhase("reloading");
        waiting.postMessage({ type: "SKIP_WAITING" });
      };
      if (ready) {
        setPhase("ready");
        window.setTimeout(go, 900);
      } else {
        // Engine isn't cached yet — give it a moment rather than reloading cold.
        setPhase("priming");
        timer = window.setTimeout(go, GRACE_MS);
      }
    };

    const watch = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        setPhase("found");
        void takeOver(reg.waiting);
      }
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            setPhase("found");
            void takeOver(installing);
          }
        });
      });
    };

    const register = () => {
      // Caches only the immutable Gifsicle engine asset — never user files.
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (!cancelled) watch(reg);
        })
        .catch(() => {
          /* engine cache is a progressive enhancement */
        });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  if (phase === "idle" || phase === "found") return null;

  const message =
    phase === "priming"
      ? "Update found — warming up the compression engine first…"
      : phase === "ready"
        ? "Update ready. Refreshing now — your engine is already cached."
        : "Refreshing ZipGIF…";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground shadow-lift"
    >
      {phase === "priming" ? (
        <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
      ) : (
        <RefreshCw className="size-4 shrink-0 text-primary" aria-hidden="true" />
      )}
      {message}
    </div>
  );
}
