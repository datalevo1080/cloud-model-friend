import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Download, Loader2, Maximize2, Package, RotateCcw } from "lucide-react";
import { DropZone } from "./drop-zone";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import { fetchGifFromUrl } from "@/lib/gif-url";
import { EngineLoadError, warmupEngine } from "@/lib/gif-engine";
import { uniqueName } from "@/lib/gif-crop";
import {
  MAX_SCALE,
  MIN_SCALE,
  PRESETS,
  estimateResizedSize,
  isUpscale,
  predictDimensions,
  resizeGif,
  resizedFileName,
  type FitMode,
  type Preset,
  type ResizeMode,
  type ResizeSpec,
} from "@/lib/gif-resize";
import { MAX_BYTES, MAX_FILES } from "@/lib/gif-types";

const HEAVY_BYTES = 30 * 1024 * 1024;

type ResizeItem = {
  id: string;
  file: File;
  url: string;
  size: number;
  width: number;
  height: number;
  status: "ready" | "working" | "done" | "error";
  statusText?: string | undefined;
  resultUrl?: string | undefined;
  resultBlob?: Blob | undefined;
  resultSize?: number | undefined;
  outWidth?: number | undefined;
  outHeight?: number | undefined;
  error?: string | undefined;
};

async function readDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("unreadable"));
    img.src = url;
  });
}

const MODES: { id: ResizeMode; label: string }[] = [
  { id: "dimensions", label: "Dimensions" },
  { id: "percentage", label: "Percentage" },
  { id: "presets", label: "Presets" },
];

export function Resizer() {
  const [items, setItems] = useState<ResizeItem[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [mode, setMode] = useState<ResizeMode>("dimensions");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [scale, setScale] = useState(0.5);
  const [presetId, setPresetId] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<FitMode>("fit");
  const [extra, setExtra] = useState(false);
  const [zipping, setZipping] = useState(false);
  const itemsRef = useRef<ResizeItem[]>([]);
  itemsRef.current = items;

  const first = items[0];
  const done = items.filter((i) => i.status === "done");
  const busy = items.some((i) => i.status === "working");

  useEffect(
    () => () => {
      for (const i of itemsRef.current) {
        URL.revokeObjectURL(i.url);
        if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
      }
    },
    [],
  );

  // Seed the dimension fields from the first GIF added.
  useEffect(() => {
    if (first && !width && !height) {
      setWidth(first.width);
      setHeight(first.height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first?.id]);

  const addFiles = useCallback(async (files: File[]) => {
    const skips: string[] = [];
    const accepted: ResizeItem[] = [];
    const existing = itemsRef.current.length;

    for (const file of files) {
      if (existing + accepted.length >= MAX_FILES) {
        skips.push(`"${file.name}" — the queue is full at ${MAX_FILES} GIFs.`);
        continue;
      }
      if (file.size === 0) {
        skips.push(`"${file.name}" — that file is empty.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        skips.push(`"${file.name}" — larger than 200 MB, which browsers can't hold safely.`);
        continue;
      }
      if (!(await hasGifMagicBytes(file))) {
        skips.push(`"${file.name}" — not a real GIF, so there's nothing to resize.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      try {
        const { width: w, height: h } = await readDimensions(url);
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          url,
          size: file.size,
          width: w,
          height: h,
          status: "ready",
        });
      } catch {
        URL.revokeObjectURL(url);
        skips.push(`"${file.name}" — the frames couldn't be read. The file looks corrupt.`);
      }
    }

    setSkipped(skips);
    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted]);
      void warmupEngine();
    }
  }, []);

  const addFromUrl = useCallback(
    async (url: string) => {
      const file = await fetchGifFromUrl(url);
      await addFiles([file]);
    },
    [addFiles],
  );

  const preset: Preset | null = PRESETS.find((p) => p.id === presetId) ?? null;

  const spec: ResizeSpec = useMemo(() => {
    if (mode === "percentage") return { kind: "scale", factor: scale };
    if (mode === "presets" && preset) {
      return preset.square && fitMode === "stretch"
        ? { kind: "exact", width: preset.width, height: preset.height }
        : { kind: "fit", width: preset.width, height: preset.height };
    }
    return { kind: "exact", width: width || first?.width || 1, height: height || first?.height || 1 };
  }, [mode, scale, preset, fitMode, width, height, first?.width, first?.height]);

  const out = first ? predictDimensions(spec, first.width, first.height) : { width: 0, height: 0 };
  const upscaling = first ? isUpscale(spec, first.width, first.height) : false;
  const estimate =
    first && out.width
      ? estimateResizedSize(first.size, first.width, first.height, out.width, out.height)
      : null;
  const sourceIsSquare = first ? first.width === first.height : true;
  const showSquareChoice = mode === "presets" && !!preset?.square && !sourceIsSquare;
  const heavy = items.filter((i) => i.size > HEAVY_BYTES);
  const canRun = items.some((i) => i.status === "ready" || i.status === "done");

  const setWidthLinked = (value: number) => {
    setWidth(value);
    if (lock && first && first.width) {
      setHeight(Math.max(1, Math.round((value * first.height) / first.width)));
    }
  };
  const setHeightLinked = (value: number) => {
    setHeight(value);
    if (lock && first && first.height) {
      setWidth(Math.max(1, Math.round((value * first.width) / first.height)));
    }
  };

  const runResize = async () => {
    const queue = items.filter((i) => i.status !== "working");
    for (const item of queue) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: "working", error: undefined, statusText: "Coalescing frames…" }
            : i,
        ),
      );
      // Yield so the status paints before the WASM run starts.
      await new Promise((r) => setTimeout(r, 30));
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, statusText: "Resizing and re-optimizing…" } : i)),
      );
      try {
        const blob = await resizeGif(item.file, spec, extra);
        const resultUrl = URL.createObjectURL(blob);
        const dims = predictDimensions(spec, item.width, item.height);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "done",
                  statusText: undefined,
                  resultBlob: blob,
                  resultUrl,
                  resultSize: blob.size,
                  outWidth: dims.width,
                  outHeight: dims.height,
                }
              : i,
          ),
        );
      } catch (err) {
        const message =
          err instanceof EngineLoadError
            ? err.message
            : "We couldn't resize this GIF — the file looks damaged or your device ran out of memory. Try a smaller target size.";
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "error", statusText: undefined, error: message } : i,
          ),
        );
      }
    }
  };

  const downloadOne = (item: ResizeItem) => {
    if (!item.resultUrl) return;
    const a = document.createElement("a");
    a.href = item.resultUrl;
    a.download = resizedFileName(item.file.name, item.outWidth ?? 0, item.outHeight ?? 0);
    a.click();
  };

  const downloadZip = async () => {
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const taken = new Set<string>();
      for (const item of done) {
        if (!item.resultBlob) continue;
        const name = resizedFileName(item.file.name, item.outWidth ?? 0, item.outHeight ?? 0);
        zip.file(uniqueName(name, taken), item.resultBlob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zipgif-resized.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setZipping(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const gone = prev.find((i) => i.id === id);
      if (gone) {
        URL.revokeObjectURL(gone.url);
        if (gone.resultUrl) URL.revokeObjectURL(gone.resultUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const reset = () => {

    for (const i of itemsRef.current) {
      URL.revokeObjectURL(i.url);
      if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
    }
    setItems([]);
    setSkipped([]);
    setWidth(0);
    setHeight(0);
    setPresetId(null);
  };

  const onFormKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key !== "Enter" || target.tagName === "BUTTON" || target.tagName === "TEXTAREA") return;
    e.preventDefault();
    if (!busy && canRun) void runResize();
  };

  return (
    <div className="space-y-6">
      {!items.length && (
        <>
          <DropZone onFiles={addFiles} onUrl={addFromUrl} />
          <ol className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">1.</span>Drop a GIF (or several).
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">2.</span>Pick a size: pixels,
              percentage or a preset.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">3.</span>Resize and download.
            </li>
          </ol>
        </>
      )}

      {skipped.length > 0 && (
        <div
          role="status"
          className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          <p className="font-medium text-foreground">Some files were skipped</p>
          <ul className="mt-2 space-y-1">
            {skipped.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {first && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* preview */}
          <div>
            <div
              className="relative w-full overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]"
              style={{ aspectRatio: `${first.width} / ${first.height}` }}
            >
              <img
                src={first.url}
                alt={`Preview of ${first.file.name} before resizing`}
                width={first.width}
                height={first.height}
                decoding="async"
                className="absolute inset-0 size-full object-contain"
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {first.file.name} — original {first.width}×{first.height}px ·{" "}
              {formatBytes(first.size)}
            </p>

            <div
              role="status"
              aria-live="polite"
              className="mt-3 rounded-xl border border-border bg-card p-4 text-sm"
            >
              <p className="font-semibold text-foreground">Estimated result before you resize</p>
              <dl className="mt-2 grid gap-2 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Output dimensions</dt>
                  <dd className="font-medium text-foreground">
                    {out.width}×{out.height}px
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Approx. file size</dt>
                  <dd className="font-medium text-foreground">
                    {estimate ? `${formatBytes(estimate.low)} – ${formatBytes(estimate.high)}` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Pixels kept</dt>
                  <dd className="font-medium text-foreground">
                    {estimate ? `${Math.round(estimate.areaShare * 100)}%` : "—"}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                Estimated from pixel area — palettes and frame data don't shrink perfectly in step,
                so the real file can land just outside this range.
              </p>
            </div>

            {upscaling && (
              <p className="mt-3 rounded-xl border border-warning/50 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
                Upscaling can't add detail — your GIF may look blurry and the file will get bigger.
              </p>
            )}

            {heavy.length > 0 && (
              <p className="mt-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                {heavy.length === 1 ? "One file is" : `${heavy.length} files are`} over 30 MB.
                Processing may be slow on this device — the tab stays usable while it runs.
              </p>
            )}
          </div>

          {/* controls */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-5" onKeyDown={onFormKeyDown}>
            <div role="tablist" aria-label="Resize mode" className="flex gap-1 rounded-lg bg-muted p-1">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "min-h-11 flex-1 rounded-md px-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    mode === m.id ? "bg-background shadow-soft" : "hover:bg-background/60",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {mode === "dimensions" && (
              <div>
                <h3 className="text-sm font-semibold">Exact pixels</h3>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rs-w" className="text-xs font-medium text-muted-foreground">
                      Width (px)
                    </label>
                    <input
                      id="rs-w"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={width}
                      onChange={(e) => setWidthLinked(Math.max(1, Number(e.target.value) || 1))}
                      className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="rs-h" className="text-xs font-medium text-muted-foreground">
                      Height (px)
                    </label>
                    <input
                      id="rs-h"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={height}
                      onChange={(e) => setHeightLinked(Math.max(1, Number(e.target.value) || 1))}
                      className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    />
                  </div>
                </div>
                <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={lock}
                    onChange={(e) => setLock(e.target.checked)}
                    className="size-4"
                  />
                  Lock aspect ratio
                </label>
              </div>
            )}

            {mode === "percentage" && (
              <div>
                <h3 className="text-sm font-semibold">Percentage of original</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[0.75, 0.5, 0.25].map((f) => (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={Math.abs(scale - f) < 0.001}
                      onClick={() => setScale(f)}
                      className={cn(
                        "min-h-11 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        Math.abs(scale - f) < 0.001
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-accent",
                      )}
                    >
                      {Math.round(f * 100)}%
                    </button>
                  ))}
                </div>
                <label htmlFor="rs-scale" className="mt-4 block text-xs font-medium text-muted-foreground">
                  Custom scale — {Math.round(scale * 100)}% ({out.width}×{out.height}px)
                </label>
                <input
                  id="rs-scale"
                  type="range"
                  min={MIN_SCALE * 100}
                  max={MAX_SCALE * 100}
                  step={1}
                  value={Math.round(scale * 100)}
                  onChange={(e) => setScale(Number(e.target.value) / 100)}
                  className="mt-2 h-11 w-full accent-[var(--color-primary)]"
                />
              </div>
            )}

            {mode === "presets" && (
              <div>
                <h3 className="text-sm font-semibold">Platform presets</h3>
                <div className="mt-2 grid gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={presetId === p.id}
                      onClick={() => setPresetId(p.id)}
                      className={cn(
                        "min-h-11 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        presetId === p.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-accent",
                      )}
                    >
                      <span className="font-medium">{p.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{p.note}</span>
                    </button>
                  ))}
                </div>

                {showSquareChoice && (
                  <fieldset className="mt-4 rounded-lg border border-border p-3">
                    <legend className="px-1 text-xs font-medium text-muted-foreground">
                      This preset is square, your GIF isn't
                    </legend>
                    <div className="space-y-2">
                      {(
                        [
                          ["fit", "Fit inside (keeps proportions)", "aspect-video w-10"],
                          ["stretch", "Stretch to exact size", "size-10"],
                        ] as const
                      ).map(([id, label, box]) => (
                        <label key={id} className="flex min-h-11 items-center gap-3 text-sm">
                          <input
                            type="radio"
                            name="fit-mode"
                            checked={fitMode === id}
                            onChange={() => setFitMode(id)}
                            className="size-4"
                          />
                          <span
                            aria-hidden="true"
                            className={cn("shrink-0 rounded border-2 border-primary/60", box)}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Want it perfectly square without stretching?{" "}
                      <Link
                        to="/gif-cropper"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Crop it square first with our GIF Cropper
                      </Link>
                      .
                    </p>
                  </fieldset>
                )}
              </div>
            )}

            <label className="flex min-h-11 items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={extra}
                onChange={(e) => setExtra(e.target.checked)}
                className="mt-1 size-4"
              />
              <span>
                Extra compression
                <span className="block text-xs text-muted-foreground">
                  Smaller file, slight quality loss.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={() => void runResize()}
              disabled={busy || !canRun}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Resizing…
                </>
              ) : (
                <>
                  <Maximize2 className="size-5" aria-hidden="true" /> Resize GIF →
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground">
              {items.length} GIF{items.length === 1 ? "" : "s"} queued · {done.length} resized ·
              settings apply to every file
            </p>

            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <RotateCcw className="size-4" aria-hidden="true" /> Start over
            </button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <section aria-labelledby="rs-queue" className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id="rs-queue" className="text-sm font-semibold">
              Queue ({items.length} {items.length === 1 ? "GIF" : "GIFs"})
            </h3>
            <p className="text-xs text-muted-foreground">
              Settings above apply to every GIF in the queue. Files are resized one at a time.
            </p>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {items.map((i) => {
              const dims = predictDimensions(spec, i.width, i.height);
              return (
                <li key={i.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <img
                    src={i.url}
                    alt=""
                    width={40}
                    height={40}
                    decoding="async"
                    className="size-10 shrink-0 rounded-md border border-border object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">
                      {i.file.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {i.width}×{i.height}px · {formatBytes(i.size)} → {dims.width}×{dims.height}px
                      {i.status === "working" && ` · ${i.statusText ?? "Working…"}`}
                      {i.status === "done" && ` · done, ${formatBytes(i.resultSize ?? 0)}`}
                      {i.status === "error" && " · failed"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(i.id)}
                    disabled={busy}
                    className="min-h-11 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                  >
                    Remove
                    <span className="sr-only"> {i.file.name} from the queue</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {items.length < MAX_FILES && (
            <div className="mt-4">
              <DropZone onFiles={addFiles} onUrl={addFromUrl} compact />
            </div>
          )}
        </section>
      )}



      {items.some((i) => i.status === "working") && (
        <ul aria-live="polite" className="space-y-2">
          {items
            .filter((i) => i.status === "working")
            .map((i) => (
              <li
                key={i.id}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
              >
                <span className="font-medium text-foreground">{i.file.name}</span> — {i.statusText}
                <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <span className="block h-full w-1/2 animate-pulse rounded-full bg-primary" />
                </span>
              </li>
            ))}
        </ul>
      )}

      {items
        .filter((i) => i.status === "error")
        .map((i) => (
          <p
            key={i.id}
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>{i.file.name}</strong> — {i.error}
            </span>
          </p>
        ))}

      {done.length > 0 && (
        <section aria-label="Resized results" aria-live="polite" className="space-y-4">
          {done.length > 1 && (
            <button
              type="button"
              onClick={() => void downloadZip()}
              disabled={zipping}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              {zipping ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Package className="size-4" aria-hidden="true" />
              )}
              Download all ({done.length}) as .zip
            </button>
          )}

          {done.map((item) => {
            const change = item.resultSize
              ? Math.round(((item.resultSize - item.size) / item.size) * 100)
              : 0;
            const bigger = (item.resultSize ?? 0) > item.size;
            const overLimit =
              preset?.limitBytes && item.resultSize ? item.resultSize > preset.limitBytes : false;
            return (
              <article key={item.id} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold">{item.file.name}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <figure>
                    <img
                      src={item.url}
                      alt={`Original GIF before resizing: ${item.file.name}`}
                      width={item.width}
                      height={item.height}
                      decoding="async"
                      className="w-full rounded-lg border border-border object-contain"
                      style={{ aspectRatio: `${item.width} / ${item.height}` }}
                    />
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      Before — {item.width}×{item.height}px · {formatBytes(item.size)}
                    </figcaption>
                  </figure>
                  <figure>
                    <img
                      src={item.resultUrl}
                      alt={`Resized GIF result: ${item.file.name}`}
                      width={item.outWidth}
                      height={item.outHeight}
                      decoding="async"
                      className="w-full rounded-lg border border-border object-contain"
                      style={{ aspectRatio: `${item.outWidth} / ${item.outHeight}` }}
                    />
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      After — {item.outWidth}×{item.outHeight}px ·{" "}
                      {formatBytes(item.resultSize ?? 0)}{" "}
                      <span className={bigger ? "text-warning-foreground" : "text-success"}>
                        ({change > 0 ? "+" : ""}
                        {change}%)
                      </span>
                    </figcaption>
                  </figure>
                </div>

                {bigger && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    This file came out bigger than the original — upscaling adds pixels without
                    adding detail. The original is still the smaller file.
                  </p>
                )}

                {overLimit && preset && (
                  <p className="mt-3 text-sm">
                    Still over {preset.limitLabel} —{" "}
                    <Link to="/" className="text-primary underline-offset-4 hover:underline">
                      run it through our GIF compressor
                    </Link>
                    .
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => downloadOne(item)}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Download className="size-4" aria-hidden="true" /> Download
                </button>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
