/**
 * Client-side GIF speed changing. Same Gifsicle WASM engine as the other
 * tools — no extra library, nothing uploaded.
 */
import { runGifsicleCommand } from "./gif-engine";

/** Browsers ignore frame delays below 2cs and fall back to a slow default. */
export const MIN_DELAY_CS = 2;
export const MIN_FACTOR = 0.1;
export const MAX_FACTOR = 8;
export const SPEED_CHIPS = [0.25, 0.5, 0.75, 1.25, 1.5, 2, 3, 4] as const;

export type LoopMode = "keep" | "forever" | "once" | "custom";

export type LoopSetting = { mode: LoopMode; count: number };

/**
 * Reads every frame's own delay (in centiseconds) straight from the GIF's
 * Graphic Control Extension blocks. Delays of 0 or 1cs are what browsers
 * clamp to ~10cs, so timing maths uses the effective value.
 */
export function parseGifDelays(buffer: ArrayBuffer): number[] {
  const b = new Uint8Array(buffer);
  const delays: number[] = [];
  if (b.length < 13) return delays;
  let p = 6; // skip "GIF89a"
  const flags = b[10] ?? 0;
  p = 13;
  if (flags & 0x80) p += 3 * (1 << ((flags & 0x07) + 1)); // global colour table

  let pending: number | null = null;
  const skipSubBlocks = () => {
    while (p < b.length) {
      const len = b[p++] ?? 0;
      if (!len) break;
      p += len;
    }
  };

  while (p < b.length) {
    const marker = b[p++];
    if (marker === 0x3b) break; // trailer
    if (marker === 0x21) {
      const label = b[p++];
      if (label === 0xf9) {
        const size = b[p++] ?? 0;
        if (size >= 4) pending = (b[p + 1] ?? 0) | ((b[p + 2] ?? 0) << 8);
        p += size;
        skipSubBlocks();
      } else {
        skipSubBlocks();
      }
      continue;
    }
    if (marker === 0x2c) {
      const local = b[p + 8] ?? 0;
      p += 9;
      if (local & 0x80) p += 3 * (1 << ((local & 0x07) + 1));
      p += 1; // LZW minimum code size
      skipSubBlocks();
      delays.push(pending ?? 0);
      pending = null;
      continue;
    }
    break; // unknown byte — stop rather than guess
  }
  return delays;
}

/** What browsers actually play: 0cs and 1cs render at roughly 10cs. */
export function effectiveDelay(cs: number): number {
  return cs > 1 ? cs : 10;
}

export type SpeedPlan = {
  factor: number;
  /** kept frame index -> new delay in centiseconds */
  frames: { index: number; delay: number }[];
  /** 1 = every frame kept, N = every Nth frame kept */
  keepEvery: number;
  droppedFrames: boolean;
  beforeMs: number;
  afterMs: number;
  frameCountBefore: number;
  frameCountAfter: number;
};

/**
 * Scales each frame's OWN delay so variable timing keeps its ratios. When a
 * speed-up would push delays under 2cs, frames are dropped evenly and the kept
 * frames absorb their group's time, so the effective speed still matches.
 */
export function planSpeed(rawDelays: number[], factor: number): SpeedPlan {
  const delays = rawDelays.map(effectiveDelay);
  const total = delays.length;
  const beforeMs = delays.reduce((s, d) => s + d, 0) * 10;

  if (!total) {
    return {
      factor,
      frames: [],
      keepEvery: 1,
      droppedFrames: false,
      beforeMs: 0,
      afterMs: 0,
      frameCountBefore: 0,
      frameCountAfter: 0,
    };
  }

  const build = (step: number) => {
    const frames: { index: number; delay: number }[] = [];
    for (let i = 0; i < total; i += step) {
      let sum = 0;
      for (let k = i; k < Math.min(total, i + step); k++) sum += delays[k]!;
      frames.push({ index: i, delay: Math.round(sum / factor) });
    }
    return frames;
  };

  let keepEvery = 1;
  let frames = build(1);
  // Slowdowns only ever scale delays up — never drop frames.
  if (factor > 1) {
    while (keepEvery < 12 && frames.some((f) => f.delay < MIN_DELAY_CS)) {
      keepEvery += 1;
      frames = build(keepEvery);
    }
  }
  frames = frames.map((f) => ({ ...f, delay: Math.max(MIN_DELAY_CS, f.delay) }));

  const afterMs = frames.reduce((s, f) => s + f.delay, 0) * 10;
  return {
    factor,
    frames,
    keepEvery,
    droppedFrames: keepEvery > 1,
    beforeMs,
    afterMs,
    frameCountBefore: total,
    frameCountAfter: frames.length,
  };
}

function loopOption(loop: LoopSetting): string | null {
  if (loop.mode === "keep") return null;
  if (loop.mode === "forever") return "--loopcount=forever";
  if (loop.mode === "once") return "--no-loopcount";
  return `--loopcount=${Math.max(1, Math.round(loop.count))}`;
}

/**
 * `--unoptimize` first: re-timing a frame-optimized GIF without coalescing it
 * corrupts the output. Then per-frame delays (consecutive frames sharing a
 * delay are grouped into one range), then `-O3` to put the optimization back.
 */
export function buildSpeedCommand(
  inputName: string,
  plan: SpeedPlan,
  loop: LoopSetting,
): string {
  const parts: string[] = ["--unoptimize"];
  const loopOpt = loopOption(loop);
  if (loopOpt) parts.push(loopOpt);

  if (!plan.frames.length) {
    parts.push(inputName);
  } else if (plan.keepEvery === 1) {
    // Group consecutive frames that share a delay into one range.
    let runStart = 0;
    for (let i = 1; i <= plan.frames.length; i++) {
      const cur = plan.frames[i];
      const prev = plan.frames[i - 1]!;
      if (cur && cur.delay === prev.delay) continue;
      const first = plan.frames[runStart]!;
      parts.push(`--delay ${first.delay}`, inputName);
      parts.push(first.index === prev.index ? `#${first.index}` : `#${first.index}-${prev.index}`);
      runStart = i;
    }
  } else {
    for (const f of plan.frames) {
      parts.push(`--delay ${f.delay}`, inputName, `#${f.index}`);
    }
  }

  parts.push("-O3", "-o", "/out/out.gif");
  return parts.join(" ");
}

export async function changeGifSpeed(
  file: File,
  plan: SpeedPlan,
  loop: LoopSetting,
): Promise<Blob> {
  return runGifsicleCommand(file, (name) => buildSpeedCommand(name, plan, loop));
}

export function formatSeconds(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const s = ms / 1000;
  if (s < 1) return `${s.toFixed(2)}s`;
  return `${s < 10 ? s.toFixed(1) : Math.round(s)}s`;
}

/** `clip.gif` + 2 -> `clip-2x.gif` */
export function speedFileName(name: string, factor: number): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[\\/:*?"<>|]+/g, "_") || "gif";
  const ext = dot > 0 ? name.slice(dot) : ".gif";
  const label = String(Number(factor.toFixed(2))).replace(".", "-");
  return `${base}-${label}x${ext}`;
}
