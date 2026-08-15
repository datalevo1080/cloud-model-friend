/**
 * PNG/JPG/WebP → GIF. Canvas decodes the source images, gifenc quantizes and
 * encodes them, and the shared Gifsicle WASM pass optimizes the result.
 * Everything runs in the browser — nothing is uploaded.
 */
import { runGifsicleCommand } from "./gif-engine";

export type LoopChoice = { mode: "forever" | "once" | "custom"; count: number };

export type SourceImage = {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  /** the image has at least one pixel that is not fully opaque */
  hasAlpha: boolean;
};

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function isAcceptedImage(file: File): boolean {
  if (ACCEPTED_IMAGE_TYPES.includes(file.type)) return true;
  return /\.(png|jpe?g|webp)$/i.test(file.name);
}

function canvasOf(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("This browser blocked canvas access.");
  return { canvas, ctx };
}

async function decode(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`"${file.name}" couldn't be decoded as an image.`));
      img.src = url;
    });
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

/** Reads size and whether the file carries real transparency. */
export async function inspectImage(file: File): Promise<SourceImage> {
  const img = await decode(file);
  const width = img.naturalWidth || 1;
  const height = img.naturalHeight || 1;
  let hasAlpha = false;
  if (/png|webp/i.test(file.type) || /\.(png|webp)$/i.test(file.name)) {
    // Sample a downscaled copy — enough to know if alpha exists, cheap on big files.
    const s = Math.min(1, 160 / Math.max(width, height));
    const { ctx } = canvasOf(width * s, height * s);
    ctx.drawImage(img, 0, 0, Math.max(1, width * s), Math.max(1, height * s));
    const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i]! < 255) {
        hasAlpha = true;
        break;
      }
    }
  }
  return {
    id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    url: URL.createObjectURL(file),
    width,
    height,
    hasAlpha,
  };
}

/** Draws one source scaled to fit inside the output box and centered. */
async function frameData(file: File, width: number, height: number): Promise<ImageData> {
  const img = await decode(file);
  const { ctx } = canvasOf(width, height);
  ctx.clearRect(0, 0, width, height);
  const iw = img.naturalWidth || 1;
  const ih = img.naturalHeight || 1;
  const scale = Math.min(width / iw, height / ih);
  const dw = Math.max(1, Math.round(iw * scale));
  const dh = Math.max(1, Math.round(ih * scale));
  ctx.drawImage(img, Math.round((width - dw) / 2), Math.round((height - dh) / 2), dw, dh);
  return ctx.getImageData(0, 0, width, height);
}

function repeatValue(loop: LoopChoice): number {
  if (loop.mode === "once") return -1;
  if (loop.mode === "custom") return Math.max(1, Math.round(loop.count));
  return 0;
}

export type BuildResult = {
  blob: Blob;
  width: number;
  height: number;
  frameCount: number;
};

/**
 * Encodes the ordered images into one GIF, then runs the existing Gifsicle
 * `-O3` pass over the bytes to squeeze out inter-frame redundancy.
 */
export async function buildGif(
  files: File[],
  opts: { width: number; height: number; delayMs: number; loop: LoopChoice; transparent: boolean },
  onProgress?: (done: number, total: number) => void,
): Promise<BuildResult> {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const gif = GIFEncoder();
  const { width, height, delayMs, transparent } = opts;
  const repeat = repeatValue(opts.loop);

  for (let i = 0; i < files.length; i++) {
    const data = await frameData(files[i]!, width, height);
    const rgba = data.data;
    const format = transparent ? "rgba4444" : "rgb565";
    const maxColors = transparent ? 255 : 256;
    const palette = quantize(rgba, maxColors, {
      format,
      oneBitAlpha: true,
      clearAlpha: true,
    });

    let transparentIndex = -1;
    if (transparent) {
      transparentIndex = palette.findIndex((c) => (c[3] ?? 255) === 0);
      if (transparentIndex === -1) {
        palette.push([0, 0, 0, 0]);
        transparentIndex = palette.length - 1;
      }
    }

    const index = applyPalette(rgba, palette, format);
    if (transparent && transparentIndex >= 0) {
      // GIF transparency is on/off: anything under half opaque disappears.
      for (let p = 0; p < index.length; p++) {
        if (rgba[p * 4 + 3]! < 128) index[p] = transparentIndex;
      }
    }

    gif.writeFrame(index, width, height, {
      palette,
      delay: Math.max(10, Math.round(delayMs)),
      repeat,
      first: i === 0,
      transparent: transparent && transparentIndex >= 0,
      transparentIndex: transparentIndex >= 0 ? transparentIndex : 0,
      dispose: transparent ? 2 : -1,
    });
    onProgress?.(i + 1, files.length);
  }

  gif.finish();
  const bytes = gif.bytes();
  const raw = new Blob([bytes as unknown as BlobPart], { type: "image/gif" });

  let blob = raw;
  try {
    const optimized = await runGifsicleCommand(
      new File([raw], "input.gif", { type: "image/gif" }),
      (name) => `-O3 ${name} -o /out/out.gif`,
    );
    if (optimized.size > 0 && optimized.size < raw.size) {
      blob = new Blob([optimized], { type: "image/gif" });
    }
  } catch {
    /* the un-optimized GIF is still a valid GIF */
  }

  return { blob, width, height, frameCount: files.length };
}

export function loopLabel(loop: LoopChoice): string {
  if (loop.mode === "once") return "Play once";
  if (loop.mode === "custom") return `${Math.max(1, Math.round(loop.count))} loops`;
  return "Loop forever";
}

export function imageBaseName(name: string): string {
  const dot = name.lastIndexOf(".");
  return (dot > 0 ? name.slice(0, dot) : name).replace(/[\\/:*?"<>|]+/g, "_") || "image";
}
