/// <reference lib="webworker" />
import { parseGIF, decompressFrames } from "gifuct-js";
import type { GifAnalysis } from "../lib/gif-types";

const SAMPLE = 48; // downsample edge for motion analysis

type Req = { id: string; buffer: ArrayBuffer };

function isGifHeader(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 6) return false;
  const sig = String.fromCharCode(...new Uint8Array(buffer, 0, 6));
  return sig === "GIF87a" || sig === "GIF89a";
}

function analyze(buffer: ArrayBuffer): GifAnalysis {
  if (!isGifHeader(buffer)) {
    throw new Error("NOT_GIF");
  }
  const gif = parseGIF(buffer);
  let frames: ReturnType<typeof decompressFrames>;
  let truncated = false;
  try {
    frames = decompressFrames(gif, true);
  } catch {
    // A truncated file can still parse its header; salvage what we can.
    truncated = true;
    frames = [];
  }
  if (!frames.length) {
    // Fall back to header-only metadata so the user can still compress.
    const w = gif.lsd?.width ?? 0;
    const h = gif.lsd?.height ?? 0;
    if (!w || !h) throw new Error("CORRUPT");
    return {
      width: w,
      height: h,
      frameCount: 1,
      fps: 0,
      durationMs: 0,
      duplicateShare: 0,
      duplicateIndices: [],
      paletteDensity: 1,
      motionAverage: 0.15,
      motionVariance: 0,
      truncated: true,
      partial: true,
    };
  }


  const width = gif.lsd.width;
  const height = gif.lsd.height;
  const delays = frames.map((f) => (f.delay && f.delay > 0 ? f.delay : 100));
  const durationMs = delays.reduce((a, b) => a + b, 0);
  const fps = durationMs > 0 ? Math.round((frames.length / durationMs) * 1000 * 10) / 10 : 0;

  // Composite each frame onto a full canvas, then downsample for comparison.
  const full = new OffscreenCanvas(width, height);
  const fctx = full.getContext("2d", { willReadFrequently: true })!;
  const small = new OffscreenCanvas(SAMPLE, SAMPLE);
  const sctx = small.getContext("2d", { willReadFrequently: true })!;

  const patch = new OffscreenCanvas(width, height);
  const pctx = patch.getContext("2d", { willReadFrequently: true })!;

  let prev: Uint8ClampedArray | null = null;
  const diffs: number[] = [];
  const duplicateIndices: number[] = [];
  const colorSet = new Set<number>();

  let analysed = 0;
  try {
  for (let i = 0; i < frames.length; i++) {

    const f = frames[i]!;
    if (f.disposalType === 2 && prev) {
      fctx.clearRect(f.dims.left, f.dims.top, f.dims.width, f.dims.height);
    }
    const bytes = new Uint8ClampedArray(f.patch.length);
    bytes.set(f.patch);
    const img = new ImageData(bytes, f.dims.width, f.dims.height);
    patch.width = f.dims.width;
    patch.height = f.dims.height;
    pctx.putImageData(img, 0, 0);
    fctx.drawImage(patch, f.dims.left, f.dims.top);

    sctx.clearRect(0, 0, SAMPLE, SAMPLE);
    sctx.drawImage(full, 0, 0, SAMPLE, SAMPLE);
    const data = sctx.getImageData(0, 0, SAMPLE, SAMPLE).data;

    // palette sampling: quantise to 5 bits/channel to estimate palette density
    for (let p = 0; p < data.length; p += 4) {
      const key = ((data[p]! >> 3) << 10) | ((data[p + 1]! >> 3) << 5) | (data[p + 2]! >> 3);
      if (colorSet.size < 4096) colorSet.add(key);
    }

    if (prev) {
      let changed = 0;
      const px = SAMPLE * SAMPLE;
      for (let p = 0; p < data.length; p += 4) {
        const d =
          Math.abs(data[p]! - prev[p]!) +
          Math.abs(data[p + 1]! - prev[p + 1]!) +
          Math.abs(data[p + 2]! - prev[p + 2]!);
        if (d > 24) changed++;
      }
      const ratio = changed / px;
      diffs.push(ratio);
      if (ratio < 0.012) duplicateIndices.push(i);
    }
    prev = new Uint8ClampedArray(data);
  }

  const motionAverage = diffs.length ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
  const motionVariance = diffs.length
    ? Math.sqrt(diffs.reduce((a, b) => a + (b - motionAverage) ** 2, 0) / diffs.length)
    : 0;

  return {
    width,
    height,
    frameCount: frames.length,
    fps,
    durationMs,
    duplicateShare: frames.length > 1 ? duplicateIndices.length / (frames.length - 1) : 0,
    duplicateIndices,
    paletteDensity: Math.min(1, colorSet.size / 256),
    motionAverage,
    motionVariance,
  };
}

self.onmessage = (e: MessageEvent<Req>) => {
  const { id, buffer } = e.data;
  try {
    const analysis = analyze(buffer);
    (self as unknown as Worker).postMessage({ id, analysis });
  } catch (err) {
    (self as unknown as Worker).postMessage({
      id,
      error: err instanceof Error ? err.message : "Could not read this GIF.",
    });
  }
};
