import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Gauge, Loader2, RotateCcw } from "lucide-react";
import { DropZone } from "./drop-zone";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import { fetchGifFromUrl } from "@/lib/gif-url";
import { EngineLoadError, warmupEngine } from "@/lib/gif-engine";
import { MAX_BYTES } from "@/lib/gif-types";
import {
  MAX_FACTOR,
  MIN_FACTOR,
  SPEED_CHIPS,
  changeGifSpeed,
  formatSeconds,
  parseGifDelays,
  planSpeed,
  speedFileName,
  type LoopMode,
  type SpeedPlan,
} from "@/lib/gif-speed";

const HEAVY_BYTES = 30 * 1024 * 1024;

type SpeedItem = {
  id: string;
  file: File;
  url: string;
  size: number;
  delays: number[];
  status: "ready" | "working" | "done" | "error";
  progress: number;
  resultUrl?: string | undefined;
  resultSize?: number | undefined;
  resultPlan?: SpeedPlan | undefined;
  error?: string | undefined;
};

const LOOPS: { id: LoopMode; label: string }[] = [
  { id: "keep", label: "Keep original" },
  { id: "forever", label: "Forever" },
  { id: "once", label: "Play once" },
  { id: "custom", label: "Custom count" },
];

export function SpeedChanger() {
  const [item, setItem] = useState<SpeedItem | null>(null);
  const [skipped, setSkipped] = useState<string | null>(null);
  const [factor, setFactor] = useState(2);
  const [loopMode, setLoopMode] = useState<LoopMode>("keep");
  const [loopCount, setLoopCount] = useState(3);
  const itemRef = useRef<SpeedItem | null>(null);
  itemRef.current = item;

  useEffect(
    () => () => {
      const i = itemRef.current;
      if (i) {
        URL.revokeObjectURL(i.url);
        if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
      }
    },
    [],
  );

  const addFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setSkipped(null);
    if (file.size === 0) {
      setSkipped(`"${file.name}" — that file is empty.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setSkipped(`"${file.name}" — larger than 200 MB, which browsers can't hold safely.`);
      return;
    }
    if (!(await hasGifMagicBytes(file))) {
      setSkipped(`"${file.name}" — not a real GIF, so there's no timing to change.`);
      return;
    }
    let delays: number[] = [];
    try {
      delays = parseGifDelays(await file.arrayBuffer());
    } catch {
      delays = [];
    }
    const prev = itemRef.current;
    if (prev) {
      URL.revokeObjectURL(prev.url);
      if (prev.resultUrl) URL.revokeObjectURL(prev.resultUrl);
    }
    if (files.length > 1) {
      setSkipped("The speed changer handles one GIF at a time — we kept the first one.");
    }
    setItem({
      id: `${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
      size: file.size,
      delays,
      status: "ready",
      progress: 0,
    });
    void warmupEngine();
  }, []);

  const addFromUrl = useCallback(
    async (url: string) => {
      const file = await fetchGifFromUrl(url);
      await addFiles([file]);
    },
    [addFiles],
  );

  const plan = useMemo(
    () => (item ? planSpeed(item.delays, factor) : null),
    [item, factor],
  );

  const run = async () => {
    const current = itemRef.current;
    if (!current || !plan) return;
    if (current.resultUrl) URL.revokeObjectURL(current.resultUrl);
    setItem((p) => (p ? { ...p, status: "working", progress: 8, resultUrl: undefined } : p));
    const timer = window.setInterval(() => {
      setItem((p) => (p && p.status === "working" ? { ...p, progress: Math.min(92, p.progress + 6) } : p));
    }, 320);
    try {
      const blob = await changeGifSpeed(current.file, plan, { mode: loopMode, count: loopCount });
      setItem((p) =>
        p
          ? {
              ...p,
              status: "done",
              progress: 100,
              resultUrl: URL.createObjectURL(blob),
              resultSize: blob.size,
              resultPlan: plan,
              error: undefined,
            }
          : p,
      );
    } catch (err) {
      setItem((p) =>
        p
          ? {
              ...p,
              status: "error",
              progress: 0,
              error:
                err instanceof EngineLoadError
                  ? err.message
                  : "That GIF couldn't be re-timed. Try another file.",
            }
          : p,
      );
    } finally {
      window.clearInterval(timer);
    }
  };

  const reset = () => {
    const i = itemRef.current;
    if (i) {
      URL.revokeObjectURL(i.url);
      if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
    }
    setItem(null);
    setSkipped(null);
  };

  const download = () => {
    if (!item?.resultUrl) return;
    const a = document.createElement("a");
    a.href = item.resultUrl;
    a.download = speedFileName(item.file.name, factor);
    a.click();
  };

  const busy = item?.status === "working";
  const result = item?.status === "done" ? item : null;
  const rp = result?.resultPlan;

  return (
    <div className="space-y-6">
      {!item && (
        <>
          <DropZone onFiles={addFiles} onUrl={addFromUrl} />
          <ol className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">1.</span>Drop one GIF.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">2.</span>Pick a speed and loop
              setting.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">3.</span>Change speed and download.
            </li>
          </ol>
        </>
      )}

      {skipped && (
        <div
          role="status"
          className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          {skipped}
        </div>
      )}

      {item && plan && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* preview */}
          <div>
            <div className="relative w-full overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
              <img
                src={result?.resultUrl ?? item.url}
                alt={
                  result
                    ? `Preview of ${item.file.name} at ${factor}× speed`
                    : `Preview of ${item.file.name} before the speed change`
                }
                decoding="async"
                className="mx-auto max-h-[26rem] w-full object-contain"
              />
            </div>
            <p className="mt-3 break-words text-sm text-muted-foreground">
              {item.file.name} — {formatBytes(item.size)} · {plan.frameCountBefore} frames
            </p>

            <div
              role="status"
              aria-live="polite"
              className="mt-3 rounded-xl border border-border bg-card p-4 text-sm"
            >
              <p className="font-semibold text-foreground">
                {formatSeconds(plan.beforeMs)} → {formatSeconds(plan.afterMs)} per loop
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {factor}× speed · each frame keeps its own share of the timing.
              </p>
            </div>

            {plan.droppedFrames && (
              <p className="mt-3 rounded-xl border border-warning/50 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
                To play this fast we skip frames — browsers won't render delays under 20ms.
              </p>
            )}

            {item.size > HEAVY_BYTES && (
              <p className="mt-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                This file is over 30 MB. Processing may be slow on this device — the tab stays
                usable while it runs.
              </p>
            )}

            {busy && (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
                  Changing speed… {item.progress}%
                </p>
              </div>
            )}

            {item.error && (
              <p
                role="alert"
                className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {item.error}
              </p>
            )}

            {result && rp && (
              <div className="mt-4 rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">Result</h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">One loop</dt>
                    <dd className="font-medium text-foreground">
                      {formatSeconds(rp.beforeMs)} → {formatSeconds(rp.afterMs)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Frames</dt>
                    <dd className="font-medium text-foreground">
                      {rp.frameCountBefore} → {rp.frameCountAfter} frames
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">File size</dt>
                    <dd className="font-medium text-foreground">
                      {formatBytes(item.size)} → {formatBytes(result.resultSize ?? 0)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={download}
                    aria-label={`Download ${speedFileName(item.file.name, factor)}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Download className="size-4" aria-hidden="true" /> Download GIF
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* controls */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-5">
            <div>
              <h3 className="text-sm font-semibold">Speed</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {SPEED_CHIPS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={factor === s}
                    onClick={() => setFactor(s)}
                    className={cn(
                      "min-h-11 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      factor === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              <label htmlFor="sp-custom" className="mt-4 block text-xs font-medium text-muted-foreground">
                Custom speed: {factor}×
              </label>
              <input
                id="sp-custom"
                type="range"
                min={MIN_FACTOR}
                max={MAX_FACTOR}
                step={0.05}
                value={factor}
                onChange={(e) => setFactor(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--color-primary)]"
              />
              <p className="mt-1 text-xs text-muted-foreground">0.1× to 8×</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Looping</h3>
              <div className="mt-2 grid gap-2" role="radiogroup" aria-label="Loop setting">
                {LOOPS.map((l) => (
                  <label
                    key={l.id}
                    className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="loop-mode"
                      className="size-4"
                      checked={loopMode === l.id}
                      onChange={() => setLoopMode(l.id)}
                    />
                    {l.label}
                  </label>
                ))}
              </div>
              {loopMode === "custom" && (
                <div className="mt-2">
                  <label htmlFor="sp-loops" className="text-xs font-medium text-muted-foreground">
                    Number of loops
                  </label>
                  <input
                    id="sp-loops"
                    type="number"
                    min={1}
                    max={100}
                    value={loopCount}
                    onChange={(e) => setLoopCount(Math.max(1, Number(e.target.value) || 1))}
                    className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void run()}
                disabled={busy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Changing speed…
                  </>
                ) : (
                  <>
                    <Gauge className="size-4" aria-hidden="true" /> Change speed
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <RotateCcw className="size-4" aria-hidden="true" /> Start over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
