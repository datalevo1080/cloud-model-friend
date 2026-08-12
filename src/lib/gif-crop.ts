/**
 * Client-side GIF cropping. Reuses the Gifsicle WASM engine already shipped
 * for the compressor — nothing is uploaded and no new engine is added.
 */
import { runGifsicleCommand } from "./gif-engine";

export type CropRect = { x: number; y: number; width: number; height: number };

export const ASPECT_PRESETS = [
  { id: "free", label: "Free", ratio: null as number | null, hint: "No constraint — drag freely" },
  { id: "1:1", label: "1:1", ratio: 1, hint: "Square — emotes and PFPs" },
  { id: "16:9", label: "16:9", ratio: 16 / 9, hint: "Widescreen — screen recordings" },
  { id: "9:16", label: "9:16", ratio: 9 / 16, hint: "Vertical — phone and stories" },
  { id: "4:3", label: "4:3", ratio: 4 / 3, hint: "Classic — older captures" },
  { id: "3:2", label: "3:2", ratio: 3 / 2, hint: "Photo — camera framing" },
] as const;

export type AspectId = (typeof ASPECT_PRESETS)[number]["id"];

export function clampRect(rect: CropRect, maxW: number, maxH: number): CropRect {
  const width = Math.max(1, Math.min(Math.round(rect.width), maxW));
  const height = Math.max(1, Math.min(Math.round(rect.height), maxH));
  const x = Math.max(0, Math.min(Math.round(rect.x), maxW - width));
  const y = Math.max(0, Math.min(Math.round(rect.y), maxH - height));
  return { x, y, width, height };
}

/**
 * `--unoptimize` first so frame-offset GIFs (where each frame only stores the
 * changed rectangle) are coalesced before the crop, then `-O3` puts the
 * inter-frame optimization back so the output isn't bloated. Delays, loop
 * count and transparency are carried through by gifsicle untouched.
 */
export function buildCropCommand(inputName: string, rect: CropRect): string {
  const r = `${rect.x},${rect.y}+${rect.width}x${rect.height}`;
  return `--unoptimize --crop ${r} -O3 ${inputName} -o /out/out.gif`;
}

export async function cropGif(file: File, rect: CropRect): Promise<Blob> {
  return runGifsicleCommand(file, (name) => buildCropCommand(name, rect));
}

const TRIM_MAX_EDGE = 480;

/**
 * Finds the bounding box of pixels that actually carry content across every
 * frame: anything transparent or matching the uniform border colour is
 * treated as margin. Runs on a downsampled canvas for speed, then pads the
 * result back out by one sampled pixel so nothing is shaved off.
 */
export async function detectContentBounds(file: File): Promise<CropRect | null> {
  const { parseGIF, decompressFrames } = await import("gifuct-js");
  const buffer = await file.arrayBuffer();
  const gif = parseGIF(buffer);
  let frames: ReturnType<typeof decompressFrames>;
  try {
    frames = decompressFrames(gif, true);
  } catch {
    return null;
  }
  if (!frames.length) return null;

  const width = gif.lsd.width;
  const height = gif.lsd.height;
  const scale = Math.min(1, TRIM_MAX_EDGE / Math.max(width, height));
  const sw = Math.max(1, Math.round(width * scale));
  const sh = Math.max(1, Math.round(height * scale));

  const full = document.createElement("canvas");
  full.width = width;
  full.height = height;
  const fctx = full.getContext("2d", { willReadFrequently: true });
  const patch = document.createElement("canvas");
  const pctx = patch.getContext("2d", { willReadFrequently: true });
  const small = document.createElement("canvas");
  small.width = sw;
  small.height = sh;
  const sctx = small.getContext("2d", { willReadFrequently: true });
  if (!fctx || !pctx || !sctx) return null;

  let minX = sw;
  let minY = sh;
  let maxX = -1;
  let maxY = -1;
  let ref: [number, number, number] | null = null;

  for (const f of frames) {
    if (f.disposalType === 2) {
      fctx.clearRect(f.dims.left, f.dims.top, f.dims.width, f.dims.height);
    }
    const bytes = new Uint8ClampedArray(f.patch.length);
    bytes.set(f.patch);
    patch.width = f.dims.width;
    patch.height = f.dims.height;
    pctx.putImageData(new ImageData(bytes, f.dims.width, f.dims.height), 0, 0);
    fctx.drawImage(patch, f.dims.left, f.dims.top);

    sctx.clearRect(0, 0, sw, sh);
    sctx.drawImage(full, 0, 0, sw, sh);
    const data = sctx.getImageData(0, 0, sw, sh).data;

    // The top-left pixel of the first frame defines the "margin" colour.
    if (!ref) ref = [data[0]!, data[1]!, data[2]!];

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const p = (y * sw + x) * 4;
        const a = data[p + 3]!;
        if (a < 12) continue;
        const d =
          Math.abs(data[p]! - ref[0]) +
          Math.abs(data[p + 1]! - ref[1]) +
          Math.abs(data[p + 2]! - ref[2]);
        if (d <= 24) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0 || maxY < 0) return null;

  const inv = 1 / scale;
  const rect = clampRect(
    {
      x: Math.floor((minX - 1) * inv),
      y: Math.floor((minY - 1) * inv),
      width: Math.ceil((maxX - minX + 3) * inv),
      height: Math.ceil((maxY - minY + 3) * inv),
    },
    width,
    height,
  );
  if (rect.width >= width && rect.height >= height) return null;
  return rect;
}

export const CROP_SUCCESS_LINES = [
  "Cropped. The boring pixels are gone.",
  "Trimmed to the good part. Animation intact.",
  "Nice framing — every frame cropped the same way.",
  "Done. Same loop, less letterbox.",
];

export function successLine(seed: number): string {
  return CROP_SUCCESS_LINES[seed % CROP_SUCCESS_LINES.length]!;
}
