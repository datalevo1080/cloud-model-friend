/**
 * Frame extraction for the GIF Splitter and the GIF Trimmer. Same Gifsicle
 * WASM engine as the other tools — no extra library, nothing uploaded.
 */
import { runGifsicleMulti } from "./gif-engine";
import { parseGifDelays, effectiveDelay } from "./gif-speed";

export type GifFrame = {
  index: number;
  blob: Blob;
  url: string;
  /** delay of this frame in milliseconds, as browsers play it */
  delayMs: number;
};

/**
 * `--unoptimize` first: frame-optimized GIFs store only the changed rectangle
 * per frame, so exploding without coalescing yields slivers instead of full
 * frames. `-O3` puts the optimization back on each single-frame output.
 */
export function buildExplodeCommand(inputName: string): string {
  return `--unoptimize -O3 --explode ${inputName} -o /out/frame`;
}

/** Explodes a GIF into one single-frame GIF per frame, in playback order. */
export async function explodeGifFrames(file: File): Promise<GifFrame[]> {
  let delays: number[] = [];
  try {
    delays = parseGifDelays(await file.arrayBuffer());
  } catch {
    delays = [];
  }
  const files = await runGifsicleMulti(file, buildExplodeCommand);
  return files.map((f, i) => ({
    index: i,
    blob: f,
    url: URL.createObjectURL(f),
    delayMs: effectiveDelay(delays[i] ?? 10) * 10,
  }));
}

export function revokeFrames(frames: GifFrame[]): void {
  for (const f of frames) URL.revokeObjectURL(f.url);
}

/** Converts a single-frame GIF to PNG with a canvas — no library needed. */
export async function gifFrameToPng(frame: GifFrame): Promise<Blob> {
  const img = new Image();
  img.decoding = "async";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("That frame couldn't be decoded."));
    img.src = frame.url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || 1;
  canvas.height = img.naturalHeight || 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser blocked canvas access.");
  ctx.drawImage(img, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("That frame couldn't be converted to PNG.");
  return blob;
}

/** `frame-001.png` — 1-based, zero padded to at least three digits. */
export function frameFileName(index: number, format: "gif" | "png", total = 999): string {
  const width = Math.max(3, String(total).length);
  return `frame-${String(index + 1).padStart(width, "0")}.${format}`;
}

export function baseName(name: string): string {
  const dot = name.lastIndexOf(".");
  return (dot > 0 ? name.slice(0, dot) : name).replace(/[\\/:*?"<>|]+/g, "_") || "gif";
}

export function formatMs(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0ms";
  return `${Math.round(ms)}ms`;
}
