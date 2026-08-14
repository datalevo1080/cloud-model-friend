/**
 * Client-side GIF resizing. Reuses the same Gifsicle WASM engine as the
 * compressor and cropper — no second GIF library, nothing uploaded.
 */
import { runGifsicleCommand } from "./gif-engine";

export type ResizeMode = "dimensions" | "percentage" | "presets";

/** How a square-ish target is applied to a non-matching source. */
export type FitMode = "fit" | "stretch";

export type ResizeSpec =
  | { kind: "exact"; width: number; height: number }
  | { kind: "fit"; width: number; height: number }
  | { kind: "scale"; factor: number };

export type Preset = {
  id: string;
  label: string;
  width: number;
  height: number;
  square: boolean;
  /** Only set when the limit is sourced from official platform documentation. */
  limitBytes?: number;
  limitLabel?: string;
  /** Short, honest note shown under the chip. */
  note: string;
};

/**
 * Size limits are only shown where they come from official platform docs.
 * Discord's developer documentation states 256 KB for emoji and 512 KB for
 * stickers. Everything else is dimensions only — no invented limits.
 */
export const PRESETS: Preset[] = [
  {
    id: "discord-emoji",
    label: "Discord Emoji",
    width: 128,
    height: 128,
    square: true,
    limitBytes: 256 * 1024,
    limitLabel: "256 KB",
    note: "128×128 · max 256 KB (Discord docs)",
  },
  {
    id: "discord-sticker",
    label: "Discord Sticker",
    width: 320,
    height: 320,
    square: true,
    limitBytes: 512 * 1024,
    limitLabel: "512 KB",
    note: "320×320 · max 512 KB (Discord docs)",
  },
  {
    id: "discord-avatar",
    label: "Discord Avatar",
    width: 128,
    height: 128,
    square: true,
    note: "128×128",
  },
  { id: "slack-emoji", label: "Slack Emoji", width: 128, height: 128, square: true, note: "128×128" },
  {
    id: "twitch-emote",
    label: "Twitch Emote",
    width: 112,
    height: 112,
    square: true,
    note: "112×112 · Twitch scales to 56 and 28",
  },
  {
    id: "telegram-sticker",
    label: "Telegram Sticker",
    width: 512,
    height: 512,
    square: true,
    note: "512×512",
  },
  { id: "email", label: "Email-safe", width: 600, height: 100000, square: false, note: "max width 600px" },
  { id: "hd-web", label: "HD web", width: 1280, height: 100000, square: false, note: "max width 1280px" },
];

export const MIN_SCALE = 0.1;
export const MAX_SCALE = 2;

/** What the output will actually measure, given the source and the spec. */
export function predictDimensions(
  spec: ResizeSpec,
  sourceW: number,
  sourceH: number,
): { width: number; height: number } {
  if (!sourceW || !sourceH) return { width: 0, height: 0 };
  if (spec.kind === "exact") {
    return { width: Math.max(1, Math.round(spec.width)), height: Math.max(1, Math.round(spec.height)) };
  }
  if (spec.kind === "scale") {
    return {
      width: Math.max(1, Math.round(sourceW * spec.factor)),
      height: Math.max(1, Math.round(sourceH * spec.factor)),
    };
  }
  // --resize-fit only ever shrinks; an already-smaller GIF is left alone.
  const factor = Math.min(1, spec.width / sourceW, spec.height / sourceH);
  return {
    width: Math.max(1, Math.round(sourceW * factor)),
    height: Math.max(1, Math.round(sourceH * factor)),
  };
}

export function isUpscale(spec: ResizeSpec, sourceW: number, sourceH: number): boolean {
  const { width, height } = predictDimensions(spec, sourceW, sourceH);
  return width > sourceW || height > sourceH;
}

/**
 * `--unoptimize` first: frame-optimized GIFs store only the changed rectangle
 * per frame, and resizing those without coalescing produces ghosting. Then the
 * resize itself with the `mix` sampler, then `-O3` to put inter-frame
 * optimization back so the output isn't bloated.
 */
export function buildResizeCommand(
  inputName: string,
  spec: ResizeSpec,
  extraCompression = false,
): string {
  const parts = ["--unoptimize", "--resize-method", "mix"];
  if (spec.kind === "exact") {
    parts.push(`--resize ${Math.max(1, Math.round(spec.width))}x${Math.max(1, Math.round(spec.height))}`);
  } else if (spec.kind === "fit") {
    parts.push(
      `--resize-fit ${Math.max(1, Math.round(spec.width))}x${Math.max(1, Math.round(spec.height))}`,
    );
  } else {
    parts.push(`--scale ${spec.factor.toFixed(4)}`);
  }
  parts.push("-O3");
  if (extraCompression) parts.push("--lossy=80");
  return `${parts.join(" ")} ${inputName} -o /out/out.gif`;
}

export async function resizeGif(
  file: File,
  spec: ResizeSpec,
  extraCompression = false,
): Promise<Blob> {
  return runGifsicleCommand(file, (name) => buildResizeCommand(name, spec, extraCompression));
}

/**
 * Rough band for the output size before anything runs. GIF bytes track pixel
 * area closely but never perfectly — headers and palettes don't shrink.
 */
export function estimateResizedSize(
  originalBytes: number,
  sourceW: number,
  sourceH: number,
  outW: number,
  outH: number,
): { low: number; high: number; areaShare: number } {
  const area = Math.max(1, sourceW * sourceH);
  const share = Math.max(0.0001, (outW * outH) / area);
  const overhead = Math.min(originalBytes, 1024 + originalBytes * 0.04);
  const scalable = Math.max(0, originalBytes - overhead);
  const mid = overhead + scalable * Math.pow(share, 0.9);
  return {
    low: Math.round(mid * 0.78),
    high: Math.round(mid * 1.25),
    areaShare: share,
  };
}

/** `clip.gif` + 128×128 -> `clip-128x128.gif` */
export function resizedFileName(name: string, width: number, height: number): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[\\/:*?"<>|]+/g, "_") || "gif";
  const ext = dot > 0 ? name.slice(dot) : ".gif";
  return `${base}-${Math.round(width)}x${Math.round(height)}${ext}`;
}
