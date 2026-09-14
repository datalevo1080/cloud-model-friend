/**
 * Target-size workflow for the Discord page. Runs entirely in the browser on
 * the same Gifsicle WASM engine as every other ZipGIF tool — nothing uploaded.
 *
 * The strategy is a ladder: start with lossless optimization and only reach for
 * stronger, more visible tools (lossy, palette, dimensions, frame reduction)
 * when the previous rung missed the target.
 */
import { runGifsicleCommand } from "./gif-engine";
import { parseGifDelays, effectiveDelay } from "./gif-speed";

export type DiscordTargetId = "upload" | "emoji" | "sticker" | "custom";

export type DiscordTarget = {
  id: DiscordTargetId;
  label: string;
  /** byte budget we aim for (a little under the hard limit) */
  bytes: number;
  /** hard platform limit, for the copy */
  limitLabel: string;
  /** optional dimension cap Discord enforces for this upload type */
  maxDim?: number;
  note: string;
};

export const DISCORD_TARGETS: DiscordTarget[] = [
  {
    id: "upload",
    label: "Under 10 MB Upload",
    bytes: 8 * 1024 * 1024,
    limitLabel: "10 MiB",
    note: "Aims at 8 MB so the 10 MiB attachment limit is never borderline.",
  },
  {
    id: "emoji",
    label: "Under 256 KB Emoji",
    bytes: 250 * 1024,
    limitLabel: "256 KiB",
    maxDim: 128,
    note: "Emoji are capped at 128×128, so the size cap comes with a dimension cap.",
  },
  {
    id: "sticker",
    label: "Under 512 KB Sticker",
    bytes: 500 * 1024,
    limitLabel: "512 KiB",
    maxDim: 320,
    note: "Stickers are capped at 320×320.",
  },
];

export type Rung = {
  /** lossy LZW level, 0 = off */
  lossy: number;
  /** palette size, 0 = keep the original palette */
  colors: number;
  /** scale factor applied on top of any dimension cap, 1 = untouched */
  scale: number;
  /** 1 = keep every frame, 2 = every second frame, 3 = every third */
  frameStep: number;
};

/** Progressively stronger settings. Never enlarges, never exceeds the source. */
export const LADDER: Rung[] = [
  { lossy: 0, colors: 0, scale: 1, frameStep: 1 },
  { lossy: 30, colors: 0, scale: 1, frameStep: 1 },
  { lossy: 60, colors: 0, scale: 1, frameStep: 1 },
  { lossy: 90, colors: 128, scale: 1, frameStep: 1 },
  { lossy: 110, colors: 64, scale: 1, frameStep: 1 },
  { lossy: 130, colors: 64, scale: 0.85, frameStep: 1 },
  { lossy: 150, colors: 48, scale: 0.7, frameStep: 1 },
  { lossy: 170, colors: 32, scale: 0.6, frameStep: 2 },
  { lossy: 200, colors: 32, scale: 0.5, frameStep: 2 },
  { lossy: 200, colors: 24, scale: 0.4, frameStep: 3 },
];

export type FitLimits = {
  /** hard dimension cap from the preset or the manual control */
  maxDim?: number | undefined;
  allowColorReduction: boolean;
  allowResize: boolean;
  allowFrameReduction: boolean;
};

export const DEFAULT_LIMITS: FitLimits = {
  allowColorReduction: true,
  allowResize: true,
  allowFrameReduction: true,
};

/** Applies the user's manual switches to a ladder rung. */
export function applyLimits(rung: Rung, limits: FitLimits): Rung {
  return {
    lossy: rung.lossy,
    colors: limits.allowColorReduction ? rung.colors : 0,
    scale: limits.allowResize ? rung.scale : 1,
    frameStep: limits.allowFrameReduction ? rung.frameStep : 1,
  };
}

export type GifMeta = { width: number; height: number; frameCount: number; durationMs: number };

/** Header dimensions plus frame delays — cheap, no decode of pixel data. */
export async function readGifMeta(file: File): Promise<GifMeta> {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  if (buffer.byteLength < 10) throw new Error("That file is too small to be a GIF.");
  const width = view.getUint16(6, true);
  const height = view.getUint16(8, true);
  let delays: number[] = [];
  try {
    delays = parseGifDelays(buffer);
  } catch {
    delays = [];
  }
  const durationMs = delays.reduce((sum, d) => sum + effectiveDelay(d) * 10, 0);
  return { width, height, frameCount: Math.max(1, delays.length), durationMs };
}

/** Frame indices kept for a given step, as gifsicle ranges (#0 #2 #4 …). */
export function frameSelection(frameCount: number, step: number): string {
  if (step <= 1 || frameCount < 2) return "";
  const kept: number[] = [];
  for (let i = 0; i < frameCount; i += step) kept.push(i);
  if (kept.length < 2 || kept.length === frameCount) return "";
  return kept.map((i) => `#${i}`).join(" ");
}

export function predictedSize(
  meta: GifMeta,
  rung: Rung,
  maxDim?: number,
): { width: number; height: number; frames: number } {
  let w = meta.width;
  let h = meta.height;
  if (maxDim && (w > maxDim || h > maxDim)) {
    const f = Math.min(1, maxDim / w, maxDim / h);
    w = Math.max(1, Math.round(w * f));
    h = Math.max(1, Math.round(h * f));
  }
  if (rung.scale < 1) {
    w = Math.max(1, Math.round(w * rung.scale));
    h = Math.max(1, Math.round(h * rung.scale));
  }
  const frames =
    rung.frameStep > 1 && meta.frameCount > 1
      ? Math.ceil(meta.frameCount / rung.frameStep)
      : meta.frameCount;
  return { width: w, height: h, frames };
}

/**
 * `--unoptimize` first so each frame is a full image (otherwise resizing a
 * frame-optimized GIF ghosts), then the frame selection, then the shrinking
 * options, then `-O3` to put inter-frame optimization back.
 */
export function buildFitCommand(
  inputName: string,
  meta: GifMeta,
  rung: Rung,
  maxDim?: number,
): string {
  const parts = ["--unoptimize", inputName];

  // Frame reduction becomes an unwieldy command on very long GIFs.
  const sel = meta.frameCount <= 400 ? frameSelection(meta.frameCount, rung.frameStep) : "";
  if (sel) parts.push(sel);

  if (maxDim && (meta.width > maxDim || meta.height > maxDim)) {
    parts.push("--resize-method", "mix", `--resize-fit ${maxDim}x${maxDim}`);
  }
  if (rung.scale < 1) {
    if (!parts.includes("--resize-method")) parts.push("--resize-method", "mix");
    parts.push(`--scale ${rung.scale.toFixed(3)}`);
  }
  if (rung.colors) parts.push(`--colors=${rung.colors}`);
  if (rung.lossy) parts.push(`--lossy=${rung.lossy}`);
  parts.push("-O3");

  if (sel) {
    // Keep the playback length roughly the same after dropping frames.
    const keptFrames = Math.ceil(meta.frameCount / rung.frameStep);
    const avg = Math.max(2, Math.round(meta.durationMs / Math.max(1, keptFrames) / 10));
    if (meta.durationMs > 0) parts.push(`--delay=${avg}`);
  }

  parts.push("-o /out/out.gif");
  return parts.join(" ");
}

/** Plain-English list of what a rung actually changed. */
export function describeRung(rung: Rung, meta: GifMeta, maxDim?: number): string[] {
  const out: string[] = ["Lossless frame optimization"];
  if (rung.lossy) out.push(`Lossy compression level ${rung.lossy}`);
  if (rung.colors) out.push(`Palette reduced to ${rung.colors} colours`);
  const dims = predictedSize(meta, rung, maxDim);
  if (dims.width !== meta.width || dims.height !== meta.height) {
    out.push(`Resized ${meta.width}×${meta.height} → ${dims.width}×${dims.height}`);
  }
  if (dims.frames !== meta.frameCount) {
    out.push(`Frames reduced ${meta.frameCount} → ${dims.frames} (same playback length)`);
  }
  return out;
}

export type FitAttempt = { step: number; size: number; rung: Rung };

export type FitResult = {
  blob: Blob;
  meta: GifMeta;
  rung: Rung;
  maxDim?: number | undefined;
  width: number;
  height: number;
  frames: number;
  hitTarget: boolean;
  /** compression would have made it bigger, so the original was kept */
  keptOriginal?: boolean;
  attempts: FitAttempt[];
  changes: string[];
};

/**
 * Walks the ladder until the output fits the target, then stops. Returns the
 * smallest result produced when nothing fits — and says so honestly.
 */
export async function fitToTarget(
  file: File,
  targetBytes: number,
  limits: FitLimits,
  onStep: (step: number, total: number, lastSize?: number) => void,
  isCanceled?: () => boolean,
): Promise<FitResult> {
  const meta = await readGifMeta(file);
  const maxDim = limits.allowResize ? limits.maxDim : undefined;

  // Already small enough, and no dimension cap to honour — re-encoding a
  // tuned GIF often makes it bigger, so hand the original back untouched.
  const needsResize = !!maxDim && (meta.width > maxDim || meta.height > maxDim);
  if (file.size <= targetBytes && !needsResize) {
    return {
      blob: file,
      meta,
      rung: { lossy: 0, colors: 0, scale: 1, frameStep: 1 },
      maxDim,
      width: meta.width,
      height: meta.height,
      frames: meta.frameCount,
      hitTarget: true,
      keptOriginal: true,
      attempts: [],
      changes: ["Nothing — the file was already under the target, so the original was kept."],
    };
  }
  const attempts: FitAttempt[] = [];
  let best: { blob: Blob; rung: Rung } | null = null;

  for (let i = 0; i < LADDER.length; i++) {
    if (isCanceled?.()) throw new DOMException("Canceled", "AbortError");
    const rung = applyLimits(LADDER[i]!, limits);
    onStep(i + 1, LADDER.length, attempts.at(-1)?.size);
    const blob = await runGifsicleCommand(file, (name) =>
      buildFitCommand(name, meta, rung, maxDim),
    );
    attempts.push({ step: i + 1, size: blob.size, rung });
    if (!best || blob.size < best.blob.size) best = { blob, rung };
    if (blob.size <= targetBytes) {
      const dims = predictedSize(meta, rung, maxDim);
      // Never hand back something larger than the source.
      if (blob.size >= file.size && file.size <= targetBytes) {
        return {
          blob: file,
          meta,
          rung: { lossy: 0, colors: 0, scale: 1, frameStep: 1 },
          maxDim,
          width: meta.width,
          height: meta.height,
          frames: meta.frameCount,
          hitTarget: true,
          keptOriginal: true,
          attempts,
          changes: ["Nothing — compressing made it bigger, so the original was kept."],
        };
      }
      return {
        blob,
        meta,
        rung,
        maxDim,
        ...dims,
        hitTarget: true,
        attempts,
        changes: describeRung(rung, meta, maxDim),
      };
    }
  }

  if (!best) throw new Error("Compression failed — the engine returned nothing.");
  const dims = predictedSize(meta, best.rung, maxDim);
  return {
    blob: best.blob,
    meta,
    rung: best.rung,
    maxDim,
    ...dims,
    hitTarget: false,
    attempts,
    changes: describeRung(best.rung, meta, maxDim),
  };
}

/** `clip.gif` -> `clip-discord.gif` */
export function discordFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[\\/:*?"<>|]+/g, "_") || "gif";
  return `${base}-discord.gif`;
}
