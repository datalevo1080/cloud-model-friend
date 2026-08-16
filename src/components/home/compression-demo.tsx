import { useEffect, useRef, useState } from "react";

const CYCLE = 5200;
const START_KB = 5120;
const END_KB = 812;

const FRAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function formatKb(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

/**
 * Purely presentational hero animation: a GIF being squeezed down.
 * CSS drives the geometry; a rAF loop only animates the readout numbers.
 */
export function CompressionDemo() {
  const [kb, setKb] = useState(START_KB);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setKb(END_KB);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) % CYCLE) / CYCLE;
      // Matches the zg-squeeze keyframe timing: hold, squeeze, hold, release.
      let p = 0;
      if (t < 0.08) p = 0;
      else if (t < 0.55) p = (t - 0.08) / 0.47;
      else if (t < 0.92) p = 1;
      else p = 1 - (t - 0.92) / 0.08;
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setKb(START_KB + (END_KB - START_KB) * eased);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const saved = Math.round((1 - kb / START_KB) * 100);

  return (
    <div
      className="relative rounded-2xl border border-hero-border bg-hero-elevated/70 p-5 shadow-2xl backdrop-blur-sm sm:p-6"
      role="img"
      aria-label="Animated demo: a 5 MB GIF being compressed down to about 812 kilobytes, entirely in the browser."
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-hero-foreground">
          <span className="flex size-2 rounded-full bg-success" aria-hidden="true" />
          screen-capture.gif
        </div>
        <span className="rounded-full border border-hero-border px-2.5 py-1 text-xs text-hero-muted">
          on your device
        </span>
      </div>

      {/* frame strip */}
      <div className="mt-5 flex gap-1.5 overflow-hidden" aria-hidden="true">
        {FRAMES.map((f) => (
          <span
            key={f}
            className="h-10 flex-1 rounded-[4px] bg-gradient-to-b from-primary/70 to-violet/50 zg-float"
            style={{
              animationDelay: `${f * 0.12}s`,
              opacity: 0.35 + (f % 4) * 0.16,
            }}
          />
        ))}
      </div>

      {/* the squeeze */}
      <div className="mt-6 space-y-3" aria-hidden="true">
        <div className="flex items-center justify-between text-xs text-hero-muted">
          <span>Before</span>
          <span>5.0 MB</span>
        </div>
        <div className="h-3 w-full rounded-full bg-hero-foreground/12" />

        <div className="flex items-center justify-between pt-2 text-xs text-hero-muted">
          <span>After</span>
          <span className="font-mono tabular-nums text-hero-foreground">{formatKb(kb)}</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-hero-foreground/12">
          <span className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-primary to-violet zg-squeeze" />
          <span className="absolute inset-y-0 left-0 w-1/5 -skew-x-12 bg-hero-foreground/30 zg-sweep" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-hero-border pt-5 text-center">
        <Stat label="Smaller" value={`${saved}%`} />
        <Stat label="Uploaded" value="0 bytes" />
        <Stat label="Watermark" value="None" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-lg font-bold tabular-nums text-hero-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-hero-muted">{label}</p>
    </div>
  );
}
