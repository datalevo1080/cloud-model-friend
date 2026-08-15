import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, Pause, Play, RotateCcw, Scissors } from "lucide-react";
import { DropZone } from "./drop-zone";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import { fetchGifFromUrl } from "@/lib/gif-url";
import { EngineLoadError, warmupEngine } from "@/lib/gif-engine";
import { MAX_BYTES } from "@/lib/gif-types";
import { explodeGifFrames, revokeFrames, type GifFrame } from "@/lib/gif-frames";
import {
  clampRange,
  formatDuration,
  keptCount,
  rangeDurationMs,
  trimGif,
  trimmedFileName,
  type TrimRange,
} from "@/lib/gif-trim";

const HEAVY_BYTES = 30 * 1024 * 1024;

export function Trimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const [range, setRange] = useState<TrimRange>({ start: 0, end: 0 });
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "working">("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; range: TrimRange } | null>(null);
  const [playing, setPlaying] = useState(true);
  const [cursor, setCursor] = useState(0);

  const framesRef = useRef<GifFrame[]>([]);
  framesRef.current = frames;
  const resultRef = useRef<typeof result>(null);
  resultRef.current = result;

  useEffect(
    () => () => {
      revokeFrames(framesRef.current);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    },
    [],
  );

  const delaysMs = useMemo(() => frames.map((f) => f.delayMs), [frames]);
  const totalMs = useMemo(() => delaysMs.reduce((s, d) => s + d, 0), [delaysMs]);
  const keptMs = useMemo(() => rangeDurationMs(delaysMs, range), [delaysMs, range]);

  // Preview plays only the kept range.
  useEffect(() => {
    if (!playing || !frames.length) return;
    if (cursor < range.start || cursor > range.end) {
      setCursor(range.start);
      return;
    }
    const delay = Math.max(20, frames[cursor]?.delayMs ?? 100);
    const t = window.setTimeout(() => {
      setCursor((c) => (c >= range.end ? range.start : c + 1));
    }, delay);
    return () => window.clearTimeout(t);
  }, [playing, frames, cursor, range]);

  const reset = useCallback(() => {
    revokeFrames(framesRef.current);
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    setFrames([]);
    setFile(null);
    setResult(null);
    setStatus("idle");
    setError(null);
    setMessage(null);
    setCursor(0);
  }, []);

  const addFiles = useCallback(async (list: File[]) => {
    const picked = list[0];
    if (!picked) return;
    setMessage(null);
    setError(null);
    if (picked.size === 0) {
      setMessage(`"${picked.name}" — that file is empty.`);
      return;
    }
    if (picked.size > MAX_BYTES) {
      setMessage(`"${picked.name}" — larger than 200 MB, which browsers can't hold safely.`);
      return;
    }
    if (!(await hasGifMagicBytes(picked))) {
      setMessage(`"${picked.name}" — not a real GIF, so there's no timeline to trim.`);
      return;
    }
    if (list.length > 1) {
      setMessage("The trimmer handles one GIF at a time — we kept the first one.");
    }
    revokeFrames(framesRef.current);
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    setResult(null);
    setFrames([]);
    setFile(picked);
    setStatus("loading");
    void warmupEngine();
    try {
      const result = await explodeGifFrames(picked);
      setFrames(result);
      setRange({ start: 0, end: Math.max(0, result.length - 1) });
      setCursor(0);
      setStatus("ready");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof EngineLoadError
          ? err.message
          : "That GIF's timeline couldn't be read. Try another file.",
      );
    }
  }, []);

  const addFromUrl = useCallback(
    async (url: string) => {
      const fetched = await fetchGifFromUrl(url);
      await addFiles([fetched]);
    },
    [addFiles],
  );

  const setStart = (v: number) => setRange((r) => clampRange({ start: v, end: r.end }, frames.length));
  const setEnd = (v: number) => setRange((r) => clampRange({ start: r.start, end: v }, frames.length));

  const run = async () => {
    if (!file || !frames.length) return;
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    setResult(null);
    setError(null);
    setStatus("working");
    setProgress(8);
    const timer = window.setInterval(() => setProgress((p) => Math.min(92, p + 6)), 300);
    try {
      const blob = await trimGif(file, range);
      setResult({ url: URL.createObjectURL(blob), size: blob.size, range });
      setProgress(100);
    } catch (err) {
      setError(
        err instanceof EngineLoadError
          ? err.message
          : "That GIF couldn't be trimmed. Try another range or another file.",
      );
    } finally {
      window.clearInterval(timer);
      setStatus("ready");
    }
  };

  const download = () => {
    if (!file || !result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = trimmedFileName(file.name, result.range);
    a.click();
  };

  const busy = status === "working";
  const kept = frames.length ? keptCount(range) : 0;

  return (
    <div className="space-y-6">
      {!file && (
        <>
          <DropZone onFiles={addFiles} onUrl={addFromUrl} />
          <ol className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">1.</span>Drop one GIF.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">2.</span>Set the start and end
              frames.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">3.</span>Preview the range and
              download.
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

      {file && status === "loading" && (
        <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Reading the timeline…
        </p>
      )}

      {file && frames.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <div className="relative w-full overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
              <img
                src={result?.url ?? frames[Math.min(Math.max(cursor, range.start), range.end)]?.url}
                alt={
                  result
                    ? `Preview of the trimmed ${file.name}`
                    : `Preview of frame ${cursor + 1} of ${file.name}`
                }
                decoding="async"
                className="mx-auto max-h-[26rem] w-full object-contain"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {playing ? (
                  <>
                    <Pause className="size-4" aria-hidden="true" /> Pause preview
                  </>
                ) : (
                  <>
                    <Play className="size-4" aria-hidden="true" /> Play range
                  </>
                )}
              </button>
              <p className="break-words text-sm text-muted-foreground">
                {file.name} — {formatBytes(file.size)} · {frames.length} frames
              </p>
            </div>

            <p
              role="status"
              aria-live="polite"
              className="mt-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
            >
              Keeping frames {range.start + 1}–{range.end + 1} ({kept} of {frames.length}) —{" "}
              {formatDuration(keptMs)} of {formatDuration(totalMs)}
            </p>

            {/* timeline strip */}
            <div
              className="mt-3 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-2"
              aria-label="Frame timeline"
            >
              {frames.map((f) => {
                const inside = f.index >= range.start && f.index <= range.end;
                return (
                  <img
                    key={f.index}
                    src={f.url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "h-14 w-14 shrink-0 rounded-md border object-cover transition-opacity",
                      inside ? "border-primary opacity-100" : "border-border opacity-35",
                    )}
                  />
                );
              })}
            </div>

            {file.size > HEAVY_BYTES && (
              <p className="mt-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                This file is over 30 MB. Trimming may be slow on this device — the tab stays usable
                while it runs.
              </p>
            )}

            {busy && (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
                  Trimming… {progress}%
                </p>
              </div>
            )}

            {result && (
              <div className="mt-4 rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">Result</h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">Frames kept</dt>
                    <dd className="font-medium text-foreground">
                      {frames.length} → {keptCount(result.range)} frames
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Duration</dt>
                    <dd className="font-medium text-foreground">
                      {formatDuration(totalMs)} → {formatDuration(rangeDurationMs(delaysMs, result.range))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">File size</dt>
                    <dd className="font-medium text-foreground">
                      {formatBytes(file.size)} → {formatBytes(result.size)}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={download}
                  aria-label={`Download ${trimmedFileName(file.name, result.range)}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Download className="size-4" aria-hidden="true" /> Download GIF
                </button>
              </div>
            )}
          </div>

          {/* controls */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-5">
            <div>
              <label htmlFor="tr-start" className="block text-sm font-semibold">
                Start frame
              </label>
              <input
                id="tr-start"
                type="range"
                min={1}
                max={frames.length}
                value={range.start + 1}
                aria-valuetext={`Start at frame ${range.start + 1}`}
                onChange={(e) => setStart(Number(e.target.value) - 1)}
                className="mt-2 w-full accent-[var(--color-primary)]"
              />
              <input
                type="number"
                min={1}
                max={frames.length}
                value={range.start + 1}
                aria-label="Start frame number"
                onChange={(e) => setStart((Number(e.target.value) || 1) - 1)}
                className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </div>

            <div>
              <label htmlFor="tr-end" className="block text-sm font-semibold">
                End frame
              </label>
              <input
                id="tr-end"
                type="range"
                min={1}
                max={frames.length}
                value={range.end + 1}
                aria-valuetext={`End at frame ${range.end + 1}`}
                onChange={(e) => setEnd(Number(e.target.value) - 1)}
                className="mt-2 w-full accent-[var(--color-primary)]"
              />
              <input
                type="number"
                min={1}
                max={frames.length}
                value={range.end + 1}
                aria-label="End frame number"
                onChange={(e) => setEnd((Number(e.target.value) || 1) - 1)}
                className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
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
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Trimming…
                  </>
                ) : (
                  <>
                    <Scissors className="size-4" aria-hidden="true" /> Trim GIF
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
