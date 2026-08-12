import type { CompressMethod, GifAnalysis, SmartPlan } from "./gif-types";

export const DEFAULT_METHOD: CompressMethod = {
  lossy: 80,
  colors: 0,
  frameStep: 1,
  dropDuplicates: false,
  optimizeTransparency: true,
};

/**
 * Picks compression settings from the *measured* properties of the GIF:
 * motion (lossy artifacts hide in movement), palette density (flat art tolerates
 * fewer colors), and duplicate frames (free savings with no visual cost).
 */
export function planFromAnalysis(a: GifAnalysis): SmartPlan {
  const reasons: string[] = [];

  let lossy: number;
  if (a.motionAverage > 0.3) {
    lossy = 120;
    reasons.push(`high motion (${Math.round(a.motionAverage * 100)}% of pixels change per frame)`);
  } else if (a.motionAverage > 0.12) {
    lossy = 80;
    reasons.push(`moderate motion (${Math.round(a.motionAverage * 100)}% pixel change per frame)`);
  } else {
    lossy = 40;
    reasons.push("low motion, so artifacts would be visible");
  }
  if (a.motionVariance > 0.2) lossy = Math.min(200, lossy + 20);

  let colors: CompressMethod["colors"] = 0;
  if (a.paletteDensity < 0.35) {
    colors = 32;
    reasons.push("flat, low-colour artwork");
  } else if (a.paletteDensity < 0.6) {
    colors = 64;
    reasons.push("limited palette");
  } else if (a.paletteDensity < 0.85) {
    colors = 128;
  }

  const dropDuplicates = a.duplicateShare > 0.08;
  if (dropDuplicates) {
    reasons.push(`${Math.round(a.duplicateShare * 100)}% duplicate frames`);
  }

  let frameStep: CompressMethod["frameStep"] = 1;
  if (!dropDuplicates && a.frameCount > 60 && a.fps > 20) {
    frameStep = 2;
    reasons.push(`${a.frameCount} frames at ${a.fps} fps (halving the frame rate is safe)`);
  }

  const parts = [`Lossy ${lossy}`];
  if (colors) parts.push(`${colors} colours`);
  if (dropDuplicates) parts.push("drop duplicate frames");
  if (frameStep > 1) parts.push(`keep every ${frameStep === 2 ? "2nd" : "3rd"} frame`);

  return {
    method: { lossy, colors, frameStep, dropDuplicates, optimizeTransparency: true },
    explanation: `AI picked: ${parts.join(" + ")} — detected ${reasons.join(", ")}.`,
  };
}

function keptFrames(a: GifAnalysis | undefined, m: CompressMethod): number[] | null {
  if (!a) return null;
  const total = a.frameCount;
  if (total < 2) return null;
  const dup = new Set(m.dropDuplicates ? a.duplicateIndices : []);
  const kept: number[] = [];
  for (let i = 0; i < total; i++) {
    if (dup.has(i)) continue;
    if (m.frameStep > 1 && i % m.frameStep !== 0) continue;
    kept.push(i);
  }
  if (!kept.length) return null;
  if (kept.length === total) return null;
  return kept;
}

/** Collapse consecutive indices into gifsicle frame ranges (#0-4). */
function frameSelection(indices: number[]): string {
  const parts: string[] = [];
  let start = indices[0]!;
  let prev = start;
  for (let i = 1; i <= indices.length; i++) {
    const cur = indices[i];
    if (cur !== undefined && cur === prev + 1) {
      prev = cur;
      continue;
    }
    parts.push(start === prev ? `#${start}` : `#${start}-${prev}`);
    if (cur !== undefined) {
      start = cur;
      prev = cur;
    }
  }
  return parts.join(" ");
}

export function buildCommand(
  inputName: string,
  method: CompressMethod,
  analysis?: GifAnalysis,
): string {
  const opts: string[] = [method.optimizeTransparency ? "-O3" : "-O1"];
  opts.push(`--lossy=${Math.round(method.lossy)}`);
  if (method.colors) opts.push(`--colors=${method.colors}`);

  const kept = keptFrames(analysis, method);
  let delayOpt = "";
  if (kept && analysis) {
    // Keep total playback length roughly the same after dropping frames.
    const avg = Math.max(2, Math.round(analysis.durationMs / kept.length / 10));
    delayOpt = ` --delay=${avg}`;
  }

  const selection = kept ? ` ${frameSelection(kept)}` : "";
  return `${opts.join(" ")}${delayOpt} ${inputName}${selection} -o /out/out.gif`;
}

type GifsicleModule = {
  run: (opts: {
    input: { file: File | Blob | ArrayBuffer | string; name: string }[];
    command: string[];
    isStrict?: boolean;
  }) => Promise<File[]>;
};

export class EngineLoadError extends Error {
  constructor() {
    super(
      "The compression engine couldn't be loaded. Check your connection or ad-blocker and try again.",
    );
    this.name = "EngineLoadError";
  }
}

let gifsiclePromise: Promise<GifsicleModule> | null = null;
async function getGifsicle(): Promise<GifsicleModule> {
  if (!gifsiclePromise) {
    gifsiclePromise = import("gifsicle-wasm-browser")
      .then((m) => ((m as { default?: GifsicleModule }).default ?? m) as GifsicleModule)
      .catch(() => {
        // Allow a later retry instead of caching the failure forever.
        gifsiclePromise = null;
        throw new EngineLoadError();
      });

  }
  return gifsiclePromise;
}

/** True once the WASM engine chunk has been requested at least once. */
export function isEngineRequested(): boolean {
  return gifsiclePromise !== null;
}

/** Load the WASM engine ahead of time (idle prefetch or first file added). */
export function warmupEngine(): Promise<boolean> {
  return getGifsicle().then(
    () => true,
    () => false,
  );
}



const SAFE_NAME = "input.gif";

export async function runGifsicle(
  file: File,
  method: CompressMethod,
  analysis?: GifAnalysis,
): Promise<Blob> {
  const gifsicle = await getGifsicle();
  const out = await gifsicle.run({
    input: [{ file, name: SAFE_NAME }],
    command: [buildCommand(SAFE_NAME, method, analysis)],
    isStrict: false,
  });
  const result = out?.[0];
  if (!result || result.size === 0) throw new Error("Gifsicle returned no output.");
  return result;
}

/**
 * Binary-search the lossy level (and, if needed, the palette) until the output
 * fits the target size or we hit the minimum acceptable quality.
 */
export async function compressToTarget(
  file: File,
  targetBytes: number,
  base: CompressMethod,
  analysis: GifAnalysis | undefined,
  onPass: (pass: number, maxPasses: number, size: number) => void,
  isCanceled?: () => boolean,
): Promise<{ blob: Blob; method: CompressMethod; hitTarget: boolean }> {
  const maxPasses = 7;
  let low = 5;
  let high = 200;
  let best: { blob: Blob; method: CompressMethod } | null = null;
  let lastAny: { blob: Blob; method: CompressMethod } | null = null;

  for (let pass = 1; pass <= maxPasses; pass++) {
    if (isCanceled?.()) throw new DOMException("Canceled", "AbortError");
    const lossy = Math.round((low + high) / 2);
    const colors: CompressMethod["colors"] =
      pass >= 5 && !best ? 64 : pass >= 6 && !best ? 32 : base.colors;
    const method: CompressMethod = { ...base, lossy, colors };
    const blob = await runGifsicle(file, method, analysis);
    onPass(pass, maxPasses, blob.size);
    lastAny = { blob, method };
    if (blob.size <= targetBytes) {
      best = { blob, method };
      high = lossy - 1;
      if (high < low) break;
    } else {
      low = lossy + 1;
      if (low > high) break;
    }
  }

  if (best) return { ...best, hitTarget: true };
  if (lastAny) return { ...lastAny, hitTarget: false };
  throw new Error("Compression failed.");
}

export type SavingsEstimate = {
  /** conservative end of the predicted reduction, 0-95 */
  low: number;
  /** optimistic end of the predicted reduction, 0-95 */
  high: number;
  confidence: "high" | "medium" | "low";
  /** why the range and the confidence look the way they do */
  note: string;
};

const clampPct = (n: number) => Math.max(0, Math.min(95, Math.round(n)));

/**
 * Predicts the reduction *before* any compression runs, from the measured GIF
 * and the settings currently selected. Deliberately conservative: the estimate
 * is only as good as the analysis behind it, which is what `confidence` says.
 */
export function estimateSavings(
  sizeBytes: number,
  analysis: GifAnalysis | undefined,
  method: CompressMethod,
  targetBytes?: number,
): SavingsEstimate {
  if (targetBytes && targetBytes > 0) {
    const wanted = clampPct((1 - targetBytes / sizeBytes) * 100);
    if (wanted <= 0) {
      return {
        low: 0,
        high: 0,
        confidence: "high",
        note: "Already under your target size — nothing to do.",
      };
    }
    const reachable = analysis ? (analysis.frameCount > 1 ? 80 : 55) : 70;
    return {
      low: wanted,
      high: wanted,
      confidence: wanted <= reachable ? "high" : "low",
      note:
        wanted <= reachable
          ? "Target mode compresses in passes until the file fits."
          : "That target is very aggressive for this file — expect quality loss or a near miss.",
    };
  }

  // Lossy 5 barely moves the needle; 200 is destructive. Roughly linear between.
  let low = 8 + (method.lossy / 200) * 42;
  let high = low + 14;

  if (method.colors && method.colors < 256) {
    const bonus = method.colors <= 32 ? 18 : method.colors <= 64 ? 12 : 6;
    low += bonus * 0.6;
    high += bonus;
  }

  const frames = analysis?.frameCount ?? 0;
  if (frames > 1) {
    if (method.frameStep > 1) {
      const dropped = (1 - 1 / method.frameStep) * 100;
      low += dropped * 0.5;
      high += dropped * 0.75;
    }
    if (method.dropDuplicates && analysis) {
      low += analysis.duplicateShare * 60;
      high += analysis.duplicateShare * 90;
    }
    if (!method.optimizeTransparency) {
      low -= 6;
      high -= 6;
    }
  }

  let confidence: SavingsEstimate["confidence"];
  let note: string;
  if (!analysis || analysis.partial) {
    confidence = "low";
    note = "We couldn't fully read this GIF's frames, so this is a rough guess.";
    low -= 10;
    high += 10;
  } else if (frames <= 1) {
    confidence = "medium";
    // A single-frame GIF has no inter-frame redundancy to exploit.
    low = Math.min(low, 30);
    high = Math.min(high, 45);
    note = "Static GIF — only palette and lossy settings can help here.";
  } else if (analysis.truncated) {
    confidence = "medium";
    note = "This GIF's frame data ends early, so the estimate is approximate.";
  } else {
    confidence = "high";
    note = `Based on ${frames} analyzed frames at ${analysis.width}×${analysis.height}.`;
  }

  // Big files carry more redundancy, tiny ones are usually near their floor.
  if (sizeBytes < 200 * 1024) {
    low -= 8;
    high -= 8;
    if (confidence === "high") confidence = "medium";
  }

  return { low: clampPct(low), high: clampPct(Math.max(high, low + 5)), confidence, note };
}
