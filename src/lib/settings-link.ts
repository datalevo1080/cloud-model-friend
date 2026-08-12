import { DEFAULT_METHOD } from "./gif-engine";
import type { CompressMethod } from "./gif-types";

export type ShareableSettings = {
  smart: boolean;
  method: CompressMethod;
  targetOn: boolean;
  targetValue: number;
  targetUnit: "KB" | "MB";
};

/** Serialises the current compression settings into URL query params. */
export function settingsToParams(s: ShareableSettings): URLSearchParams {
  const p = new URLSearchParams();
  p.set("smart", s.smart ? "1" : "0");
  p.set("lossy", String(Math.round(s.method.lossy)));
  p.set("colors", String(s.method.colors));
  p.set("step", String(s.method.frameStep));
  p.set("dup", s.method.dropDuplicates ? "1" : "0");
  p.set("opt", s.method.optimizeTransparency ? "1" : "0");
  if (s.targetOn) {
    p.set("target", String(Math.max(1, Math.round(s.targetValue))));
    p.set("unit", s.targetUnit);
  }
  return p;
}

export function buildSettingsLink(origin: string, path: string, s: ShareableSettings): string {
  return `${origin}${path}?${settingsToParams(s).toString()}`;
}

const COLORS: CompressMethod["colors"][] = [0, 32, 64, 128, 256];
const STEPS: CompressMethod["frameStep"][] = [1, 2, 3];

/** Reads settings back from a query string. Returns null when none are present. */
export function settingsFromSearch(search: string): ShareableSettings | null {
  const p = new URLSearchParams(search);
  const known = ["smart", "lossy", "colors", "step", "dup", "opt", "target"];
  if (!known.some((k) => p.has(k))) return null;

  const num = (key: string, fallback: number) => {
    const raw = Number(p.get(key));
    return Number.isFinite(raw) ? raw : fallback;
  };
  const bool = (key: string, fallback: boolean) =>
    p.has(key) ? p.get(key) === "1" || p.get(key) === "true" : fallback;

  const colorsRaw = num("colors", DEFAULT_METHOD.colors);
  const stepRaw = num("step", DEFAULT_METHOD.frameStep);
  const unit = p.get("unit") === "MB" ? "MB" : "KB";
  const targetRaw = num("target", 0);

  return {
    smart: bool("smart", true),
    method: {
      lossy: Math.min(200, Math.max(5, Math.round(num("lossy", DEFAULT_METHOD.lossy)))),
      colors: COLORS.includes(colorsRaw as CompressMethod["colors"])
        ? (colorsRaw as CompressMethod["colors"])
        : DEFAULT_METHOD.colors,
      frameStep: STEPS.includes(stepRaw as CompressMethod["frameStep"])
        ? (stepRaw as CompressMethod["frameStep"])
        : DEFAULT_METHOD.frameStep,
      dropDuplicates: bool("dup", DEFAULT_METHOD.dropDuplicates),
      optimizeTransparency: bool("opt", DEFAULT_METHOD.optimizeTransparency),
    },
    targetOn: targetRaw > 0,
    targetValue: targetRaw > 0 ? targetRaw : 256,
    targetUnit: unit,
  };
}
