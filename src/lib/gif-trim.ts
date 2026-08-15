/**
 * Client-side GIF trimming: keep a start-to-end frame range, drop the rest.
 * Same Gifsicle WASM engine as the other tools.
 */
import { runGifsicleCommand } from "./gif-engine";
import { baseName } from "./gif-frames";

export type TrimRange = { start: number; end: number };

export function clampRange(range: TrimRange, total: number): TrimRange {
  const last = Math.max(0, total - 1);
  const start = Math.min(Math.max(0, Math.round(range.start)), last);
  const end = Math.min(Math.max(start, Math.round(range.end)), last);
  return { start, end };
}

export function keptCount(range: TrimRange): number {
  return range.end - range.start + 1;
}

/** Sum of the kept frames' own delays, in milliseconds. */
export function rangeDurationMs(delaysMs: number[], range: TrimRange): number {
  let total = 0;
  for (let i = range.start; i <= range.end && i < delaysMs.length; i++) total += delaysMs[i] ?? 0;
  return total;
}

/**
 * `--unoptimize` first so each kept frame is a full image, then the frame
 * selection (each kept frame keeps its own delay), then `-O3`.
 */
export function buildTrimCommand(inputName: string, range: TrimRange): string {
  const sel = range.start === range.end ? `#${range.start}` : `#${range.start}-${range.end}`;
  return `--unoptimize ${inputName} ${sel} -O3 -o /out/out.gif`;
}

export async function trimGif(file: File, range: TrimRange): Promise<Blob> {
  return runGifsicleCommand(file, (name) => buildTrimCommand(name, range));
}

/** `clip.gif` + frames 5-20 -> `clip-trimmed-5-20.gif` */
export function trimmedFileName(name: string, range: TrimRange): string {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot) : ".gif";
  return `${baseName(name)}-trimmed-${range.start + 1}-${range.end + 1}${ext}`;
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const s = ms / 1000;
  return `${s < 10 ? s.toFixed(1) : Math.round(s)}s`;
}
