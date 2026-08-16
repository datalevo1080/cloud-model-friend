import { useEffect, useRef, useState } from "react";

/**
 * Scroll-scrubbed hero "film".
 *
 * A tall section pins a canvas stage. Scroll position drives a single
 * continuous journey: a stack of GIF frames fans out, loses the colours it
 * never needed, gets swept by the encoder, and settles as one small file.
 * Scrolling back up plays the same journey in reverse.
 */

const BANDS = [
  {
    kicker: "01 / The file",
    line: "A GIF is a stack of frames.",
    sub: "Five megabytes of the same picture, repeated ninety times, each one carrying its own palette.",
  },
  {
    kicker: "02 / The waste",
    line: "Most of those colours do nothing.",
    sub: "Two hundred and fifty six slots per frame, and a screen recording uses maybe thirty of them.",
  },
  {
    kicker: "03 / The work",
    line: "Gifsicle rewrites it. On your machine.",
    sub: "A WebAssembly engine runs inside a worker thread in this tab. No upload, no queue, no server.",
  },
  {
    kicker: "04 / The result",
    line: "Same GIF. A fraction of the weight.",
    sub: "Drag the before and after slider, check the numbers, save it. Your file never moved.",
  },
];

const START_KB = 5120;
const END_KB = 812;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

const CARDS = 15;

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  ctx.clearRect(0, 0, w, h);

  const small = w < 640;
  const cx = w / 2;
  const cy = h * (small ? 0.36 : 0.46);
  const e = easeInOut(p);

  // Ambient glow behind the stack.
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
  glow.addColorStop(0, `oklch(0.62 0.2 268 / ${0.22 + 0.16 * e})`);
  glow.addColorStop(0.55, "oklch(0.55 0.2 292 / 0.08)");
  glow.addColorStop(1, "oklch(0.2 0.05 275 / 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const cardW = small ? w * 0.62 : Math.min(w * 0.34, 420);
  const cardH = cardW * 0.6;
  const spread = 1 - 0.93 * e;
  const colours = Math.round(20 - 16 * clamp01((p - 0.18) / 0.5));

  for (let i = 0; i < CARDS; i++) {
    const t = i / (CARDS - 1);
    const isFront = i === CARDS - 1;
    const x = cx + (t - 0.5) * Math.min(w * 0.72, 900) * spread;
    const y = cy + Math.sin(t * Math.PI) * -14 * spread + (t - 0.5) * 30 * spread;
    const rot = (t - 0.5) * 0.36 * spread;
    const alpha = isFront ? 1 : (0.16 + 0.5 * (1 - Math.abs(t - 0.5) * 2)) * (1 - 0.85 * e);

    if (alpha <= 0.01) continue;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rot);

    ctx.shadowColor = "oklch(0.12 0.04 275 / 0.55)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 16);
    ctx.fillStyle = "oklch(0.24 0.05 275)";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "oklch(1 0 0 / 0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Palette strip: the colours the frame is carrying.
    const cols = 12;
    const rows = 6;
    const padX = cardW * 0.07;
    const padY = cardH * 0.12;
    const gw = (cardW - padX * 2) / cols;
    const gh = (cardH - padY * 2) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = (r * cols + c + i * 7) % 97;
        const bucket = seed % colours;
        const hue = 248 + (bucket / Math.max(colours - 1, 1)) * 66;
        const light = 0.42 + ((bucket * 13) % 7) / 22;
        ctx.fillStyle = `oklch(${light.toFixed(2)} 0.15 ${hue.toFixed(0)} / ${
          0.55 + 0.35 * Math.sin(seed)
        })`;
        roundRect(ctx, -cardW / 2 + padX + c * gw, -cardH / 2 + padY + r * gh, gw - 2, gh - 2, 3);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // Encoder sweep: a light bar passing across the settled stack.
  const sweep = clamp01((p - 0.42) / 0.34);
  if (sweep > 0 && sweep < 1) {
    const sx = cx - cardW / 2 + cardW * sweep;
    const grad = ctx.createLinearGradient(sx - 28, 0, sx + 28, 0);
    grad.addColorStop(0, "oklch(0.85 0.16 268 / 0)");
    grad.addColorStop(0.5, "oklch(0.92 0.14 268 / 0.75)");
    grad.addColorStop(1, "oklch(0.85 0.16 268 / 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(sx - 28, cy - cardH / 2 - 10, 56, cardH + 20);
  }

  // Settle ring.
  const settle = clamp01((p - 0.78) / 0.22);
  if (settle > 0) {
    ctx.save();
    ctx.globalAlpha = settle * 0.6;
    ctx.strokeStyle = "oklch(0.75 0.16 268 / 0.7)";
    ctx.lineWidth = 1.5;
    roundRect(
      ctx,
      cx - cardW / 2 - 14 * settle,
      cy - cardH / 2 - 14 * settle,
      cardW + 28 * settle,
      cardH + 28 * settle,
      22,
    );
    ctx.stroke();
    ctx.restore();
  }
}

export function ScrollFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(0);
  const shown = useRef(0);
  const raf = useRef<number | null>(null);
  const [band, setBand] = useState(0);
  const [kb, setKb] = useState(START_KB);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, shown.current);
    };

    const commit = (p: number) => {
      draw(ctx, w, h, p);
      const b = Math.min(BANDS.length - 1, Math.floor(p * BANDS.length * 0.999));
      setBand(b);
      const shrink = easeInOut(clamp01((p - 0.3) / 0.55));
      setKb(Math.round(START_KB + (END_KB - START_KB) * shrink));
    };

    const tick = () => {
      const diff = target.current - shown.current;
      if (Math.abs(diff) < 0.0008) {
        shown.current = target.current;
        commit(shown.current);
        raf.current = null;
        return;
      }
      shown.current += diff * 0.12;
      commit(shown.current);
      raf.current = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;
      target.current = p;
      if (reduced) {
        shown.current = p;
        commit(p);
        return;
      }
      if (raf.current === null) raf.current = requestAnimationFrame(tick);
    };

    resize();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  const active = BANDS[band] ?? BANDS[0]!;
  const mb = (kb / 1024).toFixed(2);

  return (
    <div ref={wrapRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 size-full"
        />

        {/* Caption band, held in the empty space under the stack. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-auto p-4 pb-14 sm:p-8 sm:pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-xl rounded-2xl bg-hero/70 p-5 backdrop-blur-md sm:p-6">
              <p className="font-mono text-xs tracking-[0.22em] text-primary uppercase">
                {active.kicker}
              </p>
              <p
                key={active.line}
                className="zg-band mt-3 text-2xl font-bold tracking-tight text-hero-foreground text-balance sm:text-4xl"
              >
                {active.line}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-hero-muted sm:text-base">
                {active.sub}
              </p>
            </div>
          </div>
        </div>

        {/* Live weight readout. */}
        <div className="pointer-events-none absolute right-4 top-24 rounded-xl border border-hero-border bg-hero/70 px-4 py-3 text-right backdrop-blur-md sm:right-8 sm:top-28">
          <p className="text-[10px] tracking-[0.2em] text-hero-muted uppercase">File weight</p>
          <p className="font-mono text-2xl font-bold text-hero-foreground tabular-nums sm:text-3xl">
            {mb} MB
          </p>
          <p className="font-mono text-xs text-primary tabular-nums">
            {Math.round(100 - (kb / START_KB) * 100)}% smaller
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
          {BANDS.map((b, i) => (
            <span
              key={b.kicker}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === band ? "w-8 bg-primary" : "w-3 bg-hero-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
