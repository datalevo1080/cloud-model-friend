/** Fallback throughput before we've measured this device: ms per megabyte. */
const DEFAULT_MS_PER_MB = 2600;
const MB = 1024 * 1024;

/**
 * Rolling estimate of this device's compression throughput, learned from the
 * files already finished in this session.
 */
export class ThroughputModel {
  private samples: number[] = [];

  /** Record a finished run: bytes processed and how long it took. */
  record(bytes: number, ms: number, passes = 1) {
    const mb = bytes / MB;
    if (mb <= 0 || ms <= 0 || passes <= 0) return;
    const perMb = ms / mb / passes;
    if (!Number.isFinite(perMb) || perMb <= 0) return;
    this.samples.push(perMb);
    if (this.samples.length > 6) this.samples.shift();
  }

  private msPerMb(): number {
    if (!this.samples.length) return DEFAULT_MS_PER_MB;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }

  /** Total predicted duration in ms for one file. */
  predict(bytes: number, passes = 1): number {
    return Math.max(700, (bytes / MB) * this.msPerMb() * passes);
  }
}

/** Turns a remaining-time value into a short human label. */
export function formatEta(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s <= 1) return "less than a second left";
  if (s < 60) return `about ${s}s left`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest ? `about ${m}m ${rest}s left` : `about ${m}m left`;
}
