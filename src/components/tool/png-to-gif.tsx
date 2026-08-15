import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, Loader2, RotateCcw, Trash2, Wand2 } from "lucide-react";
import { ImageDropZone } from "./image-drop-zone";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EngineLoadError, warmupEngine } from "@/lib/gif-engine";
import { MAX_BYTES, MAX_FILES } from "@/lib/gif-types";
import {
  buildGif,
  imageBaseName,
  inspectImage,
  isAcceptedImage,
  loopLabel,
  type LoopChoice,
  type SourceImage,
} from "@/lib/png-to-gif";

const LOOPS: { id: LoopChoice["mode"]; label: string }[] = [
  { id: "forever", label: "Loop forever" },
  { id: "once", label: "Play once" },
  { id: "custom", label: "Custom loop count" },
];

type Result = { url: string; size: number; width: number; height: number; frames: number };

export function PngToGif() {
  const [images, setImages] = useState<SourceImage[]>([]);
  const [delayMs, setDelayMs] = useState(100);
  const [loopMode, setLoopMode] = useState<LoopChoice["mode"]>("forever");
  const [loopCount, setLoopCount] = useState(3);
  const [status, setStatus] = useState<"idle" | "adding" | "working">("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const imagesRef = useRef<SourceImage[]>([]);
  imagesRef.current = images;
  const resultRef = useRef<Result | null>(null);
  resultRef.current = result;

  useEffect(
    () => () => {
      for (const img of imagesRef.current) URL.revokeObjectURL(img.url);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    },
    [],
  );

  const clearResult = useCallback(() => {
    setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const addFiles = useCallback(
    async (list: File[]) => {
      setError(null);
      setMessage(null);
      clearResult();
      const skipped: string[] = [];
      const usable: File[] = [];
      for (const file of list) {
        if (!isAcceptedImage(file)) {
          skipped.push(`${file.name} (not a PNG, JPG, or WebP)`);
          continue;
        }
        if (file.size === 0) {
          skipped.push(`${file.name} (empty file)`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          skipped.push(`${file.name} (over 200 MB)`);
          continue;
        }
        usable.push(file);
      }

      const room = MAX_FILES - imagesRef.current.length;
      if (usable.length > room) {
        skipped.push(`${usable.length - room} more (the limit is ${MAX_FILES} images)`);
      }
      const accepted = usable.slice(0, Math.max(0, room));
      if (!accepted.length) {
        setMessage(skipped.length ? `Skipped: ${skipped.join(", ")}.` : null);
        return;
      }

      setStatus("adding");
      void warmupEngine();
      const added: SourceImage[] = [];
      for (const file of accepted) {
        try {
          added.push(await inspectImage(file));
        } catch {
          skipped.push(`${file.name} (couldn't be decoded)`);
        }
      }
      setImages((prev) => [...prev, ...added]);
      setStatus("idle");
      if (skipped.length) setMessage(`Skipped: ${skipped.join(", ")}.`);
    },
    [clearResult],
  );

  const move = (from: number, to: number) => {
    setImages((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = prev.slice();
      const [item] = next.splice(from, 1);
      if (item) next.splice(to, 0, item);
      return next;
    });
    clearResult();
  };

  const remove = (id: string) => {
    setImages((prev) => {
      const hit = prev.find((i) => i.id === id);
      if (hit) URL.revokeObjectURL(hit.url);
      return prev.filter((i) => i.id !== id);
    });
    clearResult();
  };

  const reset = () => {
    for (const img of imagesRef.current) URL.revokeObjectURL(img.url);
    setImages([]);
    clearResult();
    setError(null);
    setMessage(null);
    setStatus("idle");
  };

  const first = images[0];
  const hasAlpha = images.some((i) => i.hasAlpha);
  const mixedSizes = useMemo(
    () => !!first && images.some((i) => i.width !== first.width || i.height !== first.height),
    [images, first],
  );

  const loop: LoopChoice = { mode: loopMode, count: loopCount };

  const convert = async () => {
    if (!first || status === "working") return;
    setStatus("working");
    setError(null);
    setProgress(0);
    clearResult();
    try {
      const out = await buildGif(
        images.map((i) => i.file),
        {
          width: first.width,
          height: first.height,
          delayMs,
          loop,
          transparent: hasAlpha,
        },
        (done, total) => setProgress(Math.round((done / total) * 100)),
      );
      setResult({
        url: URL.createObjectURL(out.blob),
        size: out.blob.size,
        width: out.width,
        height: out.height,
        frames: out.frameCount,
      });
    } catch (err) {
      setError(
        err instanceof EngineLoadError
          ? err.message
          : err instanceof Error
            ? err.message
            : "That conversion failed. Try fewer or smaller images.",
      );
    } finally {
      setStatus("working" === status ? "idle" : "idle");
      setProgress(100);
    }
  };

  const download = () => {
    if (!result || !first) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${imageBaseName(first.file.name)}.gif`;
    a.click();
  };

  const busy = status === "working" || status === "adding";

  return (
    <div className="space-y-6">
      {!images.length && (
        <>
          <ImageDropZone onFiles={addFiles} disabled={busy} />
          <ol className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">1.</span>Drop your images.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">2.</span>Set the order, delay, and
              looping.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">3.</span>Convert and download the
              GIF.
            </li>
          </ol>
        </>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          {message}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {images.length > 0 && first && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {images.length} image{images.length === 1 ? "" : "s"} · output {first.width}×
              {first.height}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <RotateCcw className="size-4" aria-hidden="true" /> Start over
              </button>
            </div>
          </div>

          <ul
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6"
            aria-label="Frame order"
          >
            {images.map((img, i) => (
              <li
                key={img.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={cn(
                  "overflow-hidden rounded-xl border-2 border-border bg-card",
                  dragIndex === i && "border-primary",
                )}
              >
                <img
                  src={img.url}
                  alt={`Frame ${i + 1}: ${img.file.name}`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full bg-muted/40 object-contain"
                />
                <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                  <span className="text-xs font-semibold">#{i + 1}</span>
                  <span className="flex gap-0.5">
                    <button
                      type="button"
                      aria-label={`Move ${img.file.name} earlier`}
                      disabled={i === 0}
                      onClick={() => move(i, i - 1)}
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-40"
                    >
                      <ArrowLeft className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${img.file.name} later`}
                      disabled={i === images.length - 1}
                      onClick={() => move(i, i + 1)}
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-40"
                    >
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${img.file.name}`}
                      onClick={() => remove(img.id)}
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <ImageDropZone onFiles={addFiles} disabled={busy} />

          {hasAlpha && (
            <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              GIF supports only on/off transparency — soft edges may look hard.
            </p>
          )}
          {mixedSizes && (
            <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Your images differ in size. The GIF uses {first.width}×{first.height} from the first
              image; the rest are scaled to fit and centered.
            </p>
          )}

          <div className="grid gap-5 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pg-delay" className="text-sm font-semibold">
                Frame delay (ms)
              </label>
              <input
                id="pg-delay"
                type="number"
                min={10}
                max={5000}
                step={10}
                value={delayMs}
                disabled={images.length < 2}
                onChange={(e) => {
                  setDelayMs(Math.max(10, Math.min(5000, Number(e.target.value) || 100)));
                  clearResult();
                }}
                className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {images.length < 2
                  ? "One image makes a still GIF, so delay does not apply."
                  : `${delayMs}ms per frame — about ${(1000 / delayMs).toFixed(1)} frames per second.`}
              </p>
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
                      name="png-loop-mode"
                      className="size-4"
                      checked={loopMode === l.id}
                      onChange={() => {
                        setLoopMode(l.id);
                        clearResult();
                      }}
                    />
                    {l.label}
                  </label>
                ))}
              </div>
              {loopMode === "custom" && (
                <div className="mt-2">
                  <label htmlFor="pg-loops" className="text-xs font-medium text-muted-foreground">
                    Number of loops
                  </label>
                  <input
                    id="pg-loops"
                    type="number"
                    min={1}
                    max={100}
                    value={loopCount}
                    onChange={(e) => {
                      setLoopCount(Math.max(1, Number(e.target.value) || 1));
                      clearResult();
                    }}
                    className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => void convert()}
                disabled={busy}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
              >
                {status === "working" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Converting…{" "}
                    {progress}%
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" aria-hidden="true" /> Convert to GIF
                  </>
                )}
              </button>
              {status === "working" && (
                <p role="status" aria-live="polite" className="mt-2 text-xs text-muted-foreground">
                  Encoding frame data in your browser — {progress}% done.
                </p>
              )}
            </div>
          </div>

          {result && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">Your GIF is ready</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,240px)_1fr]">
                <img
                  src={result.url}
                  alt="Animated preview of the converted GIF"
                  className="w-full rounded-xl border border-border bg-muted/40 object-contain"
                />
                <div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">Dimensions</dt>
                      <dd className="font-semibold">
                        {result.width}×{result.height}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Frames</dt>
                      <dd className="font-semibold">{result.frames}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Looping</dt>
                      <dd className="font-semibold">
                        {result.frames > 1 ? loopLabel(loop) : "Still image"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">File size</dt>
                      <dd className="font-semibold">{formatBytes(result.size)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={download}
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Download className="size-4" aria-hidden="true" /> Download GIF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
