/**
 * Client-side GIF cropping. Reuses the Gifsicle WASM engine already shipped
 * for the compressor — nothing is uploaded and no new engine is added.
 */
import { runGifsicleCommand } from "./gif-engine";

export type CropRect = { x: number; y: number; width: number; height: number };

export const ASPECT_PRESETS = [
  { id: "free", label: "Free", ratio: null as number | null, hint: "No constraint — drag freely" },
  {
    id: "1:1",
    label: "1:1",
    ratio: 1,
    hint: "Square now, circle later — platforms do the rounding.",
  },
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

/**
 * Maps a crop rect from one GIF's pixel space into another's, keeping the
 * relative position and size. Used by "apply to all" when queued GIFs have
 * different dimensions.
 */
export function scaleRect(
  rect: CropRect,
  fromW: number,
  fromH: number,
  toW: number,
  toH: number,
): CropRect {
  if (!fromW || !fromH) return clampRect(rect, toW, toH);
  const sx = toW / fromW;
  const sy = toH / fromH;
  return clampRect(
    {
      x: rect.x * sx,
      y: rect.y * sy,
      width: rect.width * sx,
      height: rect.height * sy,
    },
    toW,
    toH,
  );
}

/**
 * Rough output-size prediction before the crop runs. GIF bytes scale close to
 * the kept pixel area, but headers, palettes and the re-optimization pass mean
 * small crops never shrink fully proportionally — hence the floor and the
 * deliberately wide low/high band.
 */
export function estimateCroppedSize(
  originalBytes: number,
  rect: CropRect,
  width: number,
  height: number,
): { low: number; high: number; areaShare: number } {
  const area = Math.max(1, width * height);
  const share = Math.max(0, Math.min(1, (rect.width * rect.height) / area));
  const overhead = Math.min(originalBytes, 1024 + originalBytes * 0.04);
  const scalable = Math.max(0, originalBytes - overhead);
  const mid = overhead + scalable * Math.pow(share, 0.92);
  return {
    low: Math.round(Math.min(originalBytes, mid * 0.82)),
    high: Math.round(Math.min(originalBytes, mid * 1.15)),
    areaShare: share,
  };
}

/** `clip.gif` + 300x200 -> `clip-cropped-300x200.gif` */
export function croppedFileName(name: string, rect: CropRect): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[\\/:*?"<>|]+/g, "_") || "gif";
  const ext = dot > 0 ? name.slice(dot) : ".gif";
  return `${base}-cropped-${Math.round(rect.width)}x${Math.round(rect.height)}${ext}`;
}

/** Ensures no two files in the same ZIP collide. */
export function uniqueName(name: string, taken: Set<string>): string {
  if (!taken.has(name)) {
    taken.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let n = 2;
  while (taken.has(`${base}-${n}${ext}`)) n++;
  const out = `${base}-${n}${ext}`;
  taken.add(out);
  return out;
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
