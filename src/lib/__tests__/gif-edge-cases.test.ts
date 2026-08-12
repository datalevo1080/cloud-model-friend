import { describe, expect, it } from "vitest";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import {
  DEFAULT_METHOD,
  buildCommand,
  estimateSavings,
  planFromAnalysis,
  shouldKeepOriginal,
} from "@/lib/gif-engine";
import type { GifAnalysis } from "@/lib/gif-types";

/**
 * Regression tests for the file shapes that used to crash the tool:
 * corrupted GIFs, single-frame (static) GIFs, non-GIFs renamed to .gif, and
 * GIFs that are already optimized. None of these may throw.
 */

function fileFrom(bytes: number[], name: string, type = "image/gif"): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

const GIF89A = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
const GIF87A = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const baseAnalysis: GifAnalysis = {
  width: 480,
  height: 270,
  frameCount: 48,
  fps: 24,
  durationMs: 2000,
  duplicateShare: 0.2,
  duplicateIndices: [1, 3, 5, 7],
  paletteDensity: 0.7,
  motionAverage: 0.18,
  motionVariance: 0.05,
};

const staticAnalysis: GifAnalysis = {
  ...baseAnalysis,
  frameCount: 1,
  fps: 0,
  durationMs: 0,
  duplicateShare: 0,
  duplicateIndices: [],
  motionAverage: 0,
  motionVariance: 0,
};

const corruptAnalysis: GifAnalysis = {
  ...staticAnalysis,
  width: 0,
  height: 0,
  frameCount: 0,
  partial: true,
  truncated: true,
};

describe("file validation", () => {
  it("accepts both real GIF signatures", async () => {
    await expect(hasGifMagicBytes(fileFrom(GIF89A, "a.gif"))).resolves.toBe(true);
    await expect(hasGifMagicBytes(fileFrom(GIF87A, "b.gif"))).resolves.toBe(true);
  });

  it("rejects a PNG renamed to .gif", async () => {
    await expect(hasGifMagicBytes(fileFrom(PNG, "fake.gif"))).resolves.toBe(false);
  });

  it("rejects an empty or truncated header without throwing", async () => {
    await expect(hasGifMagicBytes(fileFrom([], "empty.gif"))).resolves.toBe(false);
    await expect(hasGifMagicBytes(fileFrom([0x47, 0x49], "cut.gif"))).resolves.toBe(false);
  });

  it("rejects a text file with a .gif extension", async () => {
    const txt = new File(["not a gif at all"], "notes.gif", { type: "image/gif" });
    await expect(hasGifMagicBytes(txt)).resolves.toBe(false);
  });
});

describe("smart planning", () => {
  it("plans an animated GIF and reports why", () => {
    const plan = planFromAnalysis(baseAnalysis);
    expect(plan.method.lossy).toBeGreaterThan(0);
    expect(plan.method.dropDuplicates).toBe(true);
    expect(plan.explanation).toContain("AI picked");
  });

  it("never drops frames on a static GIF", () => {
    const plan = planFromAnalysis(staticAnalysis);
    expect(plan.method.frameStep).toBe(1);
    expect(plan.method.dropDuplicates).toBe(false);
  });

  it("survives a corrupted analysis", () => {
    expect(() => planFromAnalysis(corruptAnalysis)).not.toThrow();
    const plan = planFromAnalysis(corruptAnalysis);
    expect(Number.isFinite(plan.method.lossy)).toBe(true);
  });
});

describe("gifsicle command building", () => {
  it("emits a valid command with no analysis at all", () => {
    const cmd = buildCommand("input.gif", DEFAULT_METHOD);
    expect(cmd).toContain("input.gif");
    expect(cmd).toContain("-o /out/out.gif");
    expect(cmd).not.toContain("#");
  });

  it("never emits a frame selection for a static GIF", () => {
    const cmd = buildCommand(
      "input.gif",
      { ...DEFAULT_METHOD, frameStep: 2, dropDuplicates: true },
      staticAnalysis,
    );
    expect(cmd).not.toContain("#");
  });

  it("selects surviving frames when duplicates are dropped", () => {
    const cmd = buildCommand(
      "input.gif",
      { ...DEFAULT_METHOD, dropDuplicates: true },
      baseAnalysis,
    );
    expect(cmd).toMatch(/#\d/);
    expect(cmd).toContain("--delay=");
  });

  it("produces no frame selection for a corrupted zero-frame analysis", () => {
    const cmd = buildCommand(
      "input.gif",
      { ...DEFAULT_METHOD, frameStep: 3, dropDuplicates: true },
      corruptAnalysis,
    );
    expect(cmd).not.toContain("#");
  });
});

describe("savings estimate", () => {
  const MB = 1024 * 1024;

  it("is confident about a fully analyzed animated GIF", () => {
    const est = estimateSavings(5 * MB, baseAnalysis, DEFAULT_METHOD);
    expect(est.confidence).toBe("high");
    expect(est.high).toBeGreaterThanOrEqual(est.low);
    expect(est.high).toBeLessThanOrEqual(95);
  });

  it("caps expectations for a static GIF", () => {
    const est = estimateSavings(5 * MB, staticAnalysis, DEFAULT_METHOD);
    expect(est.confidence).toBe("medium");
    expect(est.high).toBeLessThanOrEqual(45);
  });

  it("drops to low confidence when the GIF could not be read", () => {
    expect(estimateSavings(5 * MB, corruptAnalysis, DEFAULT_METHOD).confidence).toBe("low");
    expect(estimateSavings(5 * MB, undefined, DEFAULT_METHOD).confidence).toBe("low");
  });

  it("reports nothing to do when the file already fits the target", () => {
    const est = estimateSavings(100 * 1024, baseAnalysis, DEFAULT_METHOD, 256 * 1024);
    expect(est.high).toBe(0);
    expect(est.note).toContain("Already under");
  });

  it("flags an unreachable target as low confidence", () => {
    const est = estimateSavings(50 * MB, baseAnalysis, DEFAULT_METHOD, 64 * 1024);
    expect(est.confidence).toBe("low");
  });

  it("always returns a range inside 0-95 for any settings", () => {
    for (const lossy of [5, 50, 120, 200]) {
      for (const colors of [0, 32, 64, 128, 256] as const) {
        const est = estimateSavings(8 * MB, baseAnalysis, {
          ...DEFAULT_METHOD,
          lossy,
          colors,
          frameStep: 3,
          dropDuplicates: true,
        });
        expect(est.low).toBeGreaterThanOrEqual(0);
        expect(est.high).toBeLessThanOrEqual(95);
        expect(est.low).toBeLessThanOrEqual(est.high);
      }
    }
  });
});

describe("already-optimized GIFs", () => {
  it("keeps the original when compression makes it bigger or equal", () => {
    expect(shouldKeepOriginal(1000, 1200)).toBe(true);
    expect(shouldKeepOriginal(1000, 1000)).toBe(true);
  });

  it("uses the compressed output when it is actually smaller", () => {
    expect(shouldKeepOriginal(1000, 640)).toBe(false);
  });
});
