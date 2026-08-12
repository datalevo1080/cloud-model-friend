import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Crop as CropIcon,
  Download,
  Loader2,
  Pause,
  Play,
  Scissors,
  Trash2,
  Wand2,
} from "lucide-react";
import { DropZone } from "./drop-zone";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import { fetchGifFromUrl } from "@/lib/gif-url";
import { EngineLoadError, warmupEngine } from "@/lib/gif-engine";
import {
  ASPECT_PRESETS,
  clampRect,
  cropGif,
  detectContentBounds,
  successLine,
  type AspectId,
  type CropRect,
} from "@/lib/gif-crop";
import { MAX_BYTES, MAX_FILES } from "@/lib/gif-types";

type CropItem = {
  id: string;
  file: File;
  url: string;
  size: number;
  width: number;
  height: number;
  status: "ready" | "cropping" | "done" | "error";
  rect?: CropRect;
  resultUrl?: string;
  resultBlob?: Blob;
  resultSize?: number;
  message?: string;
  error?: string;
};

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "move";

const HANDLES: { id: Handle; label: string; className: string; cursor: string }[] = [
  { id: "nw", label: "top left", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2", cursor: "nwse-resize" },
  { id: "n", label: "top", className: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", cursor: "ns-resize" },
  { id: "ne", label: "top right", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2", cursor: "nesw-resize" },
  { id: "e", label: "right", className: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2", cursor: "ew-resize" },
  { id: "se", label: "bottom right", className: "bottom-0 right-0 translate-x-1/2 translate-y-1/2", cursor: "nwse-resize" },
  { id: "s", label: "bottom", className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2", cursor: "ns-resize" },
  { id: "sw", label: "bottom left", className: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2", cursor: "nesw-resize" },
  { id: "w", label: "left", className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2", cursor: "ew-resize" },
];

async function readDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("unreadable"));
    img.src = url;
  });
}

function applyAspect(rect: CropRect, ratio: number, maxW: number, maxH: number): CropRect {
  let width = rect.width;
  let height = Math.round(width / ratio);
  if (height > maxH) {
    height = maxH;
    width = Math.round(height * ratio);
  }
  if (width > maxW) {
    width = maxW;
    height = Math.round(width / ratio);
  }
  return clampRect({ ...rect, width, height }, maxW, maxH);
}

export function Cropper() {
  const [items, setItems] = useState<CropItem[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [rect, setRect] = useState<CropRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [aspect, setAspect] = useState<AspectId>("free");
  const [playing, setPlaying] = useState(true);
  const [pausedFrame, setPausedFrame] = useState<string | null>(null);
  const [trimming, setTrimming] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ handle: Handle; startX: number; startY: number; base: CropRect } | null>(
    null,
  );
  const itemsRef = useRef<CropItem[]>([]);
  itemsRef.current = items;

  const current = items.find((i) => i.status === "ready" || i.status === "cropping");
  const done = items.filter((i) => i.status === "done");

  // Release every object URL when the component goes away.
  useEffect(
    () => () => {
      for (const i of itemsRef.current) {
        URL.revokeObjectURL(i.url);
        if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
      }
    },
    [],
  );

  // Reset the crop box whenever a new GIF becomes the active one.
  useEffect(() => {
    if (!current) return;
    setPlaying(true);
    setPausedFrame(null);
    setRect(current.rect ?? { x: 0, y: 0, width: current.width, height: current.height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const addFiles = useCallback(async (files: File[]) => {
    const skips: string[] = [];
    const accepted: CropItem[] = [];
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
        skips.push(`"${file.name}" — not a real GIF, so there's nothing to crop.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      try {
        const { width, height } = await readDimensions(url);
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          url,
          size: file.size,
          width,
          height,
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
      // The WASM engine only loads once a file is actually here.
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

  const maxW = current?.width ?? 0;
  const maxH = current?.height ?? 0;

  const setRectSafe = useCallback(
    (next: CropRect) => setRect(clampRect(next, maxW, maxH)),
    [maxW, maxH],
  );

  const chooseAspect = (id: AspectId) => {
    setAspect(id);
    const preset = ASPECT_PRESETS.find((p) => p.id === id);
    if (preset?.ratio) setRect(applyAspect(rect, preset.ratio, maxW, maxH));
  };

  const ratio = ASPECT_PRESETS.find((p) => p.id === aspect)?.ratio ?? null;

  // ---- pointer dragging -------------------------------------------------
  const onPointerDown = (handle: Handle) => (e: React.PointerEvent) => {
    if (!current) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { handle, startX: e.clientX, startY: e.clientY, base: rect };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const stage = stageRef.current;
    if (!drag || !stage || !current) return;
    // Crop maths always happens in true source pixels, even when the stage
    // is rendered smaller than the GIF.
    const scale = current.width / stage.clientWidth;
    const dx = (e.clientX - drag.startX) * scale;
    const dy = (e.clientY - drag.startY) * scale;
    const b = drag.base;

    if (drag.handle === "move") {
      setRectSafe({ ...b, x: b.x + dx, y: b.y + dy });
      return;
    }

    let { x, y, width, height } = b;
    if (drag.handle.includes("w")) {
      x = b.x + dx;
      width = b.width - dx;
    }
    if (drag.handle.includes("e")) width = b.width + dx;
    if (drag.handle.includes("n")) {
      y = b.y + dy;
      height = b.height - dy;
    }
    if (drag.handle.includes("s")) height = b.height + dy;

    if (width < 16) width = 16;
    if (height < 16) height = 16;
    if (ratio) {
      if (drag.handle === "n" || drag.handle === "s") width = height * ratio;
      else height = width / ratio;
    }
    setRectSafe({ x, y, width, height });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = map[e.key];
    if (!delta) return;
    e.preventDefault();
    setRectSafe({ ...rect, x: rect.x + delta[0], y: rect.y + delta[1] });
  };

  // ---- play / pause -----------------------------------------------------
  const togglePlay = () => {
    if (playing) {
      const img = imgRef.current;
      if (img && current) {
        const canvas = document.createElement("canvas");
        canvas.width = current.width;
        canvas.height = current.height;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        setPausedFrame(canvas.toDataURL("image/png"));
      }
      setPlaying(false);
    } else {
      setPausedFrame(null);
      setPlaying(true);
    }
  };

  const autoTrim = async () => {
    if (!current) return;
    setTrimming(true);
    setNotice(null);
    try {
      const bounds = await detectContentBounds(current.file);
      if (!bounds) {
        setNotice("No uniform border found — this GIF already fills its frame.");
      } else {
        setAspect("free");
        setRectSafe(bounds);
        setNotice(`Auto-trim snapped the box to ${bounds.width}×${bounds.height}px of content.`);
      }
    } catch {
      setNotice("Auto-trim couldn't read every frame of this GIF, so the box is unchanged.");
    } finally {
      setTrimming(false);
    }
  };

  const runCrop = async () => {
    if (!current) return;
    const target = clampRect(rect, current.width, current.height);
    const queue = applyToAll
      ? items.filter(
          (i) =>
            i.status === "ready" && i.width === current.width && i.height === current.height,
        )
      : [current];

    for (const item of queue) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "cropping", error: undefined } : i)),
      );
      try {
        const blob = await cropGif(item.file, target);
        const resultUrl = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "done",
                  rect: target,
                  resultBlob: blob,
                  resultUrl,
                  resultSize: blob.size,
                  message: successLine(item.file.name.length),
                }
              : i,
          ),
        );
      } catch (err) {
        const message =
          err instanceof EngineLoadError
            ? err.message
            : "We couldn't crop this GIF — the file looks damaged or ran out of memory. Try a smaller crop or another file.";
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: message } : i)),
        );
      }
    }
  };

  const downloadZip = async () => {
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const item of done) {
        if (item.resultBlob) zip.file(`cropped-${item.file.name}`, item.resultBlob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zipgif-cropped.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setZipping(false);
    }
  };

  const reset = () => {
    for (const i of itemsRef.current) {
      URL.revokeObjectURL(i.url);
      if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
    }
    setItems([]);
    setSkipped([]);
    setNotice(null);
    setApplyToAll(false);
  };

  const pct = useMemo(() => {
    if (!current) return { left: 0, top: 0, width: 0, height: 0 };
    return {
      left: (rect.x / current.width) * 100,
      top: (rect.y / current.height) * 100,
      width: (rect.width / current.width) * 100,
      height: (rect.height / current.height) * 100,
    };
  }, [rect, current]);

  const remainingSameSize = current
    ? items.filter(
        (i) =>
          i.status === "ready" &&
          i.id !== current.id &&
          i.width === current.width &&
          i.height === current.height,
      ).length
    : 0;

  const busy = items.some((i) => i.status === "cropping");

  return (
    <div className="space-y-6">
      {!items.length && <DropZone onFiles={addFiles} onUrl={addFromUrl} />}

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

      {current && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div
              ref={stageRef}
              className="relative w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]"
              style={{ aspectRatio: `${current.width} / ${current.height}` }}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <img
                ref={imgRef}
                src={pausedFrame ?? current.url}
                alt={`GIF cropper preview of ${current.file.name}`}
                width={current.width}
                height={current.height}
                decoding="async"
                className="pointer-events-none absolute inset-0 size-full object-contain"
              />

              {/* dimmed area outside the crop box */}
              <div
                className="pointer-events-none absolute inset-0 bg-foreground/50"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${pct.left}% ${pct.top}%, ${pct.left}% ${pct.top + pct.height}%, ${pct.left + pct.width}% ${pct.top + pct.height}%, ${pct.left + pct.width}% ${pct.top}%, ${pct.left}% ${pct.top}%)`,
                }}
                aria-hidden="true"
              />

              <div
                role="application"
                tabIndex={0}
                aria-label={`Crop box: ${Math.round(rect.width)} by ${Math.round(rect.height)} pixels at ${Math.round(rect.x)}, ${Math.round(rect.y)}. Arrow keys move it by 1 pixel, Shift plus arrows by 10.`}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown("move")}
                className="absolute cursor-move border-2 border-primary bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                style={{
                  left: `${pct.left}%`,
                  top: `${pct.top}%`,
                  width: `${pct.width}%`,
                  height: `${pct.height}%`,
                }}
              >
                {HANDLES.map((h) => (
                  <span
                    key={h.id}
                    role="presentation"
                    onPointerDown={onPointerDown(h.id)}
                    style={{ cursor: h.cursor }}
                    className={cn(
                      "absolute size-6 rounded-full border-2 border-background bg-primary shadow-soft",
                      h.className,
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {playing ? (
                  <>
                    <Pause className="size-4" aria-hidden="true" /> Pause preview
                  </>
                ) : (
                  <>
                    <Play className="size-4" aria-hidden="true" /> Play preview
                  </>
                )}
              </button>
              <span>
                Original {current.width}×{current.height}px · {formatBytes(current.size)}
              </span>
              <span className="font-medium text-foreground">
                Output {Math.round(rect.width)}×{Math.round(rect.height)}px
              </span>
            </div>
          </div>

          <div className="space-y-5 rounded-xl border border-border bg-card p-5">
            <div>
              <h3 className="text-sm font-semibold">Aspect ratio</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {ASPECT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    title={p.hint}
                    aria-pressed={aspect === p.id}
                    onClick={() => chooseAspect(p.id)}
                    className={cn(
                      "min-h-11 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      aspect === p.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Exact pixels</h3>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(
                  [
                    ["X", "x", maxW],
                    ["Y", "y", maxH],
                    ["Width", "width", maxW],
                    ["Height", "height", maxH],
                  ] as const
                ).map(([label, key, max]) => (
                  <div key={key}>
                    <label
                      htmlFor={`crop-${key}`}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {label} (px)
                    </label>
                    <input
                      id={`crop-${key}`}
                      type="number"
                      inputMode="numeric"
                      min={key === "width" || key === "height" ? 1 : 0}
                      max={max}
                      value={Math.round(rect[key])}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isFinite(v)) return;
                        const next = { ...rect, [key]: v };
                        if (ratio && (key === "width" || key === "height")) {
                          if (key === "width") next.height = Math.round(v / ratio);
                          else next.width = Math.round(v * ratio);
                        }
                        setRectSafe(next);
                      }}
                      className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Type here for a keyboard-only crop, or focus the box and nudge with the arrow keys
                (Shift for 10px).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void autoTrim()}
                disabled={trimming}
                title="Snaps to the pixels that actually change. Great for screen recordings with huge empty margins."
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
              >
                {trimming ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Wand2 className="size-4" aria-hidden="true" />
                )}
                Auto-trim borders
              </button>
              <button
                type="button"
                onClick={() => {
                  setAspect("free");
                  setRect({ x: 0, y: 0, width: current.width, height: current.height });
                }}
                className="min-h-11 rounded-lg px-3 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Reset crop
              </button>
            </div>

            {notice && (
              <p role="status" className="text-xs text-muted-foreground">
                {notice}
              </p>
            )}

            {remainingSameSize > 0 && (
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={applyToAll}
                  onChange={(e) => setApplyToAll(e.target.checked)}
                  className="mt-1 size-4"
                />
                <span>
                  Apply the same crop to the {remainingSameSize} remaining GIF
                  {remainingSameSize > 1 ? "s" : ""} of the same size
                </span>
              </label>
            )}

            <button
              type="button"
              onClick={() => void runCrop()}
              disabled={busy}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Cropping…
                </>
              ) : (
                <>
                  <CropIcon className="size-5" aria-hidden="true" /> Crop GIF →
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground">
              {items.filter((i) => i.status === "ready").length} GIF
              {items.filter((i) => i.status === "ready").length === 1 ? "" : "s"} waiting ·{" "}
              {done.length} cropped
            </p>
          </div>
        </div>
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
        <section aria-label="Cropped results" className="space-y-4">
          {done.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold">{item.file.name}</h3>
                <p className="text-sm text-success">{item.message}</p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <figure>
                  <img
                    src={item.url}
                    alt={`Original GIF before cropping: ${item.file.name}`}
                    width={item.width}
                    height={item.height}
                    decoding="async"
                    className="w-full rounded-lg border border-border object-contain"
                  />
                  <figcaption className="mt-2 text-xs text-muted-foreground">
                    Before — {item.width}×{item.height}px · {formatBytes(item.size)}
                  </figcaption>
                </figure>
                <figure>
                  <img
                    src={item.resultUrl}
                    alt={`Cropped GIF result from the GIF cropper: ${item.file.name}`}
                    width={item.rect?.width ?? item.width}
                    height={item.rect?.height ?? item.height}
                    decoding="async"
                    className="w-full rounded-lg border border-primary/40 object-contain"
                  />
                  <figcaption className="mt-2 text-xs text-muted-foreground">
                    After — {item.rect?.width}×{item.rect?.height}px ·{" "}
                    {formatBytes(item.resultSize ?? 0)}
                  </figcaption>
                </figure>
              </div>
              <a
                href={item.resultUrl}
                download={`cropped-${item.file.name}`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Download className="size-4" aria-hidden="true" /> Download cropped GIF
              </a>
            </article>
          ))}

          <div className="flex flex-wrap items-center gap-3">
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
                  <Download className="size-4" aria-hidden="true" />
                )}
                Download all as .zip
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Trash2 className="size-4" aria-hidden="true" /> Crop another GIF
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            <Scissors className="mr-1 inline size-4 align-text-bottom" aria-hidden="true" />
            Cropping cut the dimensions — want the file smaller too?{" "}
            <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
              compress the GIF after cropping
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  );
}
