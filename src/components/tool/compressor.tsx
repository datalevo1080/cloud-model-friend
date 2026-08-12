import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Download,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { DropZone } from "./drop-zone";
import { BeforeAfter } from "./before-after";
import { formatBytes, savingsPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DEFAULT_METHOD,
  compressToTarget,
  isEngineRequested,
  planFromAnalysis,
  runGifsicle,
  warmupEngine,
} from "@/lib/gif-engine";

import {
  MAX_BYTES,
  MAX_FILES,
  type CompressMethod,
  type GifAnalysis,
  type GifItem,
} from "@/lib/gif-types";

const STATUS_TEXTS = [
  "Crunching frames…",
  "Optimizing palette…",
  "Squeezing LZW data…",
  "Merging identical pixels…",
  "Writing your GIF…",
];

const TARGET_PRESETS = [
  { label: "Discord 256KB", kb: 256 },
  { label: "Email 1MB", kb: 1024 },
  { label: "Twitter 15MB", kb: 15 * 1024 },
];

let idCounter = 0;
const nextId = () => `gif-${++idCounter}-${Date.now()}`;

function friendlyError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (/memory|allocation|abort/i.test(raw)) {
    return "Your browser ran out of memory on this GIF. Try a smaller file, or compress it on a desktop browser.";
  }
  if (/no frames|frame|parse|invalid|magic/i.test(raw)) {
    return "This file looks corrupted or isn't a real GIF. Try re-exporting it.";
  }
  return "Compression failed for this file. Try adjusting the settings and running it again.";
}

export function Compressor() {
  const [items, setItems] = useState<GifItem[]>([]);
  const [notices, setNotices] = useState<string[]>([]);
  const [smart, setSmart] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [method, setMethod] = useState<CompressMethod>(DEFAULT_METHOD);
  const [targetOn, setTargetOn] = useState(false);
  const [targetValue, setTargetValue] = useState(256);
  const [targetUnit, setTargetUnit] = useState<"KB" | "MB">("KB");
  const [running, setRunning] = useState(false);
  const [engineState, setEngineState] = useState<"idle" | "loading" | "ready">("idle");
  const workerRef = useRef<Worker | null>(null);
  const itemsRef = useRef<GifItem[]>([]);
  itemsRef.current = items;

  // Prefetch the WASM engine only when the browser is idle — never on page load.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    const start = () => {
      void warmupEngine().then(() => setEngineState((s) => (s === "idle" ? s : "ready")));
    };
    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(start, { timeout: 6000 });
      return () => (window as unknown as { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback?.(handle);
    }
    const t = window.setTimeout(start, 3000);
    return () => window.clearTimeout(t);
  }, []);

  const ensureEngine = useCallback(() => {
    if (isEngineRequested()) {
      setEngineState("ready");
      return;
    }
    setEngineState("loading");
    const started = Date.now();
    void warmupEngine().then(() => {
      const wait = Math.max(0, 1000 - (Date.now() - started));
      window.setTimeout(() => setEngineState("ready"), wait);
    });
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL("../../workers/gif-analyze.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);


  useEffect(
    () => () => {
      itemsRef.current.forEach((i) => {
        URL.revokeObjectURL(i.url);
        if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
      });
    },
    [],
  );

  const patch = useCallback((id: string, next: Partial<GifItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...next } : i)));
  }, []);

  const analyze = useCallback(
    (item: GifItem) => {
      const worker = workerRef.current;
      if (!worker) return;
      item.file
        .arrayBuffer()
        .then((buffer) => {
          const handler = (e: MessageEvent) => {
            const data = e.data as { id: string; analysis?: GifAnalysis; error?: string };
            if (data.id !== item.id) return;
            worker.removeEventListener("message", handler);
            if (data.analysis) {
              patch(item.id, {
                status: "ready",
                analysis: data.analysis,
                plan: planFromAnalysis(data.analysis),
              });
            } else {
              patch(item.id, {
                status: "error",
                error: "This file couldn't be read as a GIF. It may be corrupted.",
              });
            }
          };
          worker.addEventListener("message", handler);
          worker.postMessage({ id: item.id, buffer }, [buffer]);
        })
        .catch(() =>
          patch(item.id, { status: "error", error: "This file couldn't be read from disk." }),
        );
    },
    [patch],
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const problems: string[] = [];
      const accepted: GifItem[] = [];
      const room = MAX_FILES - itemsRef.current.length;

      for (const file of files) {
        const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
        if (!isGif) {
          problems.push(`"${file.name}" isn't a GIF — only .gif files can be compressed here.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          problems.push(`"${file.name}" is ${formatBytes(file.size)} — the limit is 200 MB.`);
          continue;
        }
        if (accepted.length >= room) {
          problems.push(`You can compress up to ${MAX_FILES} GIFs at a time.`);
          break;
        }
        accepted.push({
          id: nextId(),
          file,
          url: URL.createObjectURL(file),
          size: file.size,
          status: "analyzing",
          progress: 0,
          statusText: "Analyzing…",
        });
      }

      setNotices(problems);
      if (accepted.length) {
        ensureEngine();
        setItems((prev) => [...prev, ...accepted]);
        accepted.forEach(analyze);
      }
    },
    [analyze, ensureEngine],

  );

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) {
        URL.revokeObjectURL(found.url);
        if (found.resultUrl) URL.revokeObjectURL(found.resultUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const reset = useCallback(() => {
    itemsRef.current.forEach((i) => {
      URL.revokeObjectURL(i.url);
      if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
    });
    setItems([]);
    setNotices([]);
  }, []);

  const targetBytes = useMemo(
    () => Math.max(1, targetValue) * 1024 * (targetUnit === "MB" ? 1024 : 1),
    [targetValue, targetUnit],
  );

  const compressAll = useCallback(async () => {
    const queue = itemsRef.current.filter((i) => i.status === "ready" || i.status === "done");
    if (!queue.length || running) return;
    setRunning(true);
    setNotices([]);
    setItems((prev) =>
      prev.map((i) =>
        i.status === "error" ? i : { ...i, status: "queued", progress: 0, statusText: "Queued…" },
      ),
    );

    let bestSaving = 0;

    for (const queued of queue) {
      const item = itemsRef.current.find((i) => i.id === queued.id);
      if (!item) continue;
      patch(item.id, { status: "processing", progress: 4, statusText: STATUS_TEXTS[0]! });

      let textIdx = 0;
      const ticker = window.setInterval(() => {
        textIdx = (textIdx + 1) % STATUS_TEXTS.length;
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && i.status === "processing"
              ? {
                  ...i,
                  statusText: STATUS_TEXTS[textIdx]!,
                  progress: Math.min(92, i.progress + 6),
                }
              : i,
          ),
        );
      }, 900);

      try {
        const base: CompressMethod = smart && item.plan ? item.plan.method : method;
        let blob: Blob;
        let hitTarget = true;

        if (targetOn) {
          const res = await compressToTarget(
            item.file,
            targetBytes,
            base,
            item.analysis,
            (pass, maxPasses) =>
              patch(item.id, {
                progress: Math.round((pass / maxPasses) * 95),
                statusText: `Target pass ${pass} of ${maxPasses}…`,
              }),
          );
          blob = res.blob;
          hitTarget = res.hitTarget;
        } else {
          blob = await runGifsicle(item.file, base, item.analysis);
        }

        window.clearInterval(ticker);
        const resultUrl = URL.createObjectURL(blob);
        const saving = savingsPercent(item.size, blob.size);
        bestSaving = Math.max(bestSaving, saving);
        patch(item.id, {
          status: "done",
          progress: 100,
          resultBlob: blob,
          resultUrl,
          resultSize: blob.size,
          statusText: hitTarget
            ? "Done"
            : "Smallest possible size reached — still above your target.",
        });
      } catch (err) {
        window.clearInterval(ticker);
        patch(item.id, { status: "error", progress: 0, error: friendlyError(err) });
      }
    }

    setRunning(false);

    if (bestSaving > 50 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 }, disableForReducedMotion: true });
      } catch {
        /* confetti is decorative only */
      }
    }
  }, [method, patch, running, smart, targetBytes, targetOn]);

  const downloadAll = useCallback(async () => {
    const done = itemsRef.current.filter((i) => i.resultBlob);
    if (!done.length) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    done.forEach((i) => zip.file(i.file.name.replace(/\.gif$/i, "") + "-zipgif.gif", i.resultBlob!));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zipgif-compressed.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const readyCount = items.filter((i) => i.status !== "error").length;
  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <section id="tool" aria-label="GIF compressor" className="scroll-mt-24">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
        <DropZone onFiles={addFiles} disabled={running} />

        {notices.length > 0 && (
          <ul className="mt-4 space-y-2" role="alert">
            {notices.map((n) => (
              <li
                key={n}
                className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <FileCard key={item.id} item={item} onRemove={() => remove(item.id)} />
              ))}
            </div>

            <div className="mt-6 space-y-4 rounded-xl border border-border bg-muted/30 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={smart}
                  onChange={(e) => setSmart(e.target.checked)}
                  className="mt-1 size-5 accent-[var(--color-primary)]"
                  aria-describedby="smart-desc"
                />
                <span>
                  <span className="flex items-center gap-2 font-semibold">
                    <Sparkles className="size-4 text-primary" aria-hidden="true" />
                    Smart Compress (AI)
                  </span>
                  <span id="smart-desc" className="mt-1 block text-sm text-muted-foreground">
                    Analyses each GIF on your device — motion, palette and duplicate frames — and
                    picks the strongest settings that still look good.
                  </span>
                </span>
              </label>

              <div>
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((o) => !o)}
                  aria-expanded={advancedOpen}
                  aria-controls="advanced-panel"
                  className="flex min-h-11 w-full items-center justify-between rounded-lg px-1 text-sm font-medium"
                >
                  Advanced settings {smart && "(used when Smart Compress is off)"}
                  <ChevronDown
                    className={cn("size-4 transition-transform", advancedOpen && "rotate-180")}
                    aria-hidden="true"
                  />
                </button>

                {advancedOpen && (
                  <div id="advanced-panel" className="mt-4 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lossy" className="text-sm font-medium">
                        Compression strength: {method.lossy}
                      </label>
                      <input
                        id="lossy"
                        type="range"
                        min={5}
                        max={200}
                        step={5}
                        value={method.lossy}
                        onChange={(e) =>
                          setMethod((m) => ({ ...m, lossy: Number(e.target.value) }))
                        }
                        className="mt-3 h-3 w-full accent-[var(--color-primary)]"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Best for: bigger savings on video-like GIFs; keep it under 60 for text or
                        line art.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="colors" className="text-sm font-medium">
                        Colour reduction
                      </label>
                      <select
                        id="colors"
                        value={method.colors}
                        onChange={(e) =>
                          setMethod((m) => ({
                            ...m,
                            colors: Number(e.target.value) as CompressMethod["colors"],
                          }))
                        }
                        className="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value={0}>Keep original palette</option>
                        <option value={256}>256 colours</option>
                        <option value={128}>128 colours</option>
                        <option value={64}>64 colours</option>
                        <option value={32}>32 colours</option>
                      </select>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Best for: flat illustrations, screen recordings and UI clips.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="framestep" className="text-sm font-medium">
                        Frame dropping
                      </label>
                      <select
                        id="framestep"
                        value={method.frameStep}
                        onChange={(e) =>
                          setMethod((m) => ({
                            ...m,
                            frameStep: Number(e.target.value) as CompressMethod["frameStep"],
                          }))
                        }
                        className="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value={1}>Keep every frame</option>
                        <option value={2}>Drop every 2nd frame</option>
                        <option value={3}>Drop every 3rd frame</option>
                      </select>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Best for: long, high-frame-rate GIFs where smoothness matters less than
                        size.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={method.dropDuplicates}
                          onChange={(e) =>
                            setMethod((m) => ({ ...m, dropDuplicates: e.target.checked }))
                          }
                          className="size-5 accent-[var(--color-primary)]"
                        />
                        Drop duplicate frames
                      </label>
                      <p className="-mt-3 text-xs text-muted-foreground">
                        Best for: screen recordings that pause on the same image.
                      </p>
                      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={method.optimizeTransparency}
                          onChange={(e) =>
                            setMethod((m) => ({ ...m, optimizeTransparency: e.target.checked }))
                          }
                          className="size-5 accent-[var(--color-primary)]"
                        />
                        Optimize transparency
                      </label>
                      <p className="-mt-3 text-xs text-muted-foreground">
                        Best for: almost every GIF — reuses unchanged pixels between frames.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold">
                  <input
                    type="checkbox"
                    checked={targetOn}
                    onChange={(e) => setTargetOn(e.target.checked)}
                    className="size-5 accent-[var(--color-primary)]"
                  />
                  Target file size
                </label>
                {targetOn && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      aria-label="Target size value"
                      value={targetValue}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      className="h-11 w-28 rounded-lg border border-input bg-background px-3 text-sm"
                    />
                    <select
                      aria-label="Target size unit"
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value as "KB" | "MB")}
                      className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                    {TARGET_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          if (p.kb % 1024 === 0) {
                            setTargetUnit("MB");
                            setTargetValue(p.kb / 1024);
                          } else {
                            setTargetUnit("KB");
                            setTargetValue(p.kb);
                          }
                        }}
                        className="h-11 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        {p.label}
                      </button>
                    ))}
                    <p className="w-full text-xs text-muted-foreground">
                      ZipGIF runs repeated passes, halving in on the strongest setting that still
                      fits your target.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={compressAll}
                disabled={running || readyCount === 0}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
              >
                {running ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Compressing…
                  </>
                ) : (
                  <>
                    <Wand2 className="size-5" aria-hidden="true" /> Compress GIF →
                  </>
                )}
              </button>

              {doneCount > 1 && (
                <button
                  type="button"
                  onClick={downloadAll}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-6 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  <Download className="size-4" aria-hidden="true" /> Download all (.zip)
                </button>
              )}

              <button
                type="button"
                onClick={reset}
                disabled={running}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-6 text-sm font-semibold transition-colors hover:bg-accent disabled:opacity-60"
              >
                <RotateCcw className="size-4" aria-hidden="true" /> Compress more
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FileCard({ item, onRemove }: { item: GifItem; onRemove: () => void }) {
  const saving =
    item.resultSize !== undefined ? savingsPercent(item.size, item.resultSize) : undefined;

  return (
    <article className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <img
          src={item.url}
          alt={`Preview of ${item.file.name}`}
          className="h-24 w-full rounded-lg border border-border bg-muted object-contain sm:w-32"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <h3 className="truncate text-sm font-semibold" title={item.file.name}>
              {item.file.name}
            </h3>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${item.file.name}`}
              className="ml-auto inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {formatBytes(item.size)}
            {item.analysis && (
              <>
                {" · "}
                {item.analysis.width}×{item.analysis.height}
                {" · "}
                {item.analysis.frameCount} frames{" · "}
                {item.analysis.fps} fps
              </>
            )}
            {item.status === "analyzing" && " · analyzing…"}
          </p>

          {item.plan && item.status !== "error" && (
            <p className="mt-2 inline-flex items-start gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {item.plan.explanation}
            </p>
          )}

          {(item.status === "processing" || item.status === "queued") && (
            <div className="mt-3">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.progress}
                aria-label={`Compressing ${item.file.name}`}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {item.progress}% · {item.statusText}
              </p>
            </div>
          )}

          {item.status === "error" && (
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {item.error}
            </p>
          )}

          {item.status === "done" && item.resultUrl && item.resultSize !== undefined && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {formatBytes(item.size)} → <strong className="text-foreground">{formatBytes(item.resultSize)}</strong>
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-semibold",
                  saving && saving > 0
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {saving && saving > 0 ? `−${saving}% smaller` : "Already optimal"}
              </span>
              <a
                href={item.resultUrl}
                download={item.file.name.replace(/\.gif$/i, "") + "-zipgif.gif"}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Download className="size-4" aria-hidden="true" /> Download
              </a>
              {item.statusText !== "Done" && (
                <span className="w-full text-xs text-muted-foreground">{item.statusText}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {item.status === "done" && item.resultUrl && (
        <div className="mt-4">
          <BeforeAfter beforeUrl={item.url} afterUrl={item.resultUrl} alt={item.file.name} />
        </div>
      )}
    </article>
  );
}
