import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, RotateCcw, Scissors } from "lucide-react";
import { DropZone } from "./drop-zone";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import { fetchGifFromUrl } from "@/lib/gif-url";
import { EngineLoadError, warmupEngine } from "@/lib/gif-engine";
import { MAX_BYTES } from "@/lib/gif-types";
import {
  baseName,
  explodeGifFrames,
  formatMs,
  frameFileName,
  gifFrameToPng,
  revokeFrames,
  type GifFrame,
} from "@/lib/gif-frames";

const HEAVY_BYTES = 30 * 1024 * 1024;

type Format = "gif" | "png";

export function Splitter() {
  const [file, setFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<Format>("png");
  const [status, setStatus] = useState<"idle" | "splitting" | "ready" | "downloading">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const framesRef = useRef<GifFrame[]>([]);
  framesRef.current = frames;

  useEffect(() => () => revokeFrames(framesRef.current), []);

  const reset = useCallback(() => {
    revokeFrames(framesRef.current);
    setFrames([]);
    setSelected(new Set());
    setFile(null);
    setStatus("idle");
    setError(null);
    setMessage(null);
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
      setMessage(`"${picked.name}" — not a real GIF, so there are no frames to split.`);
      return;
    }
    if (list.length > 1) {
      setMessage("The splitter handles one GIF at a time — we kept the first one.");
    }
    revokeFrames(framesRef.current);
    setFrames([]);
    setSelected(new Set());
    setFile(picked);
    setStatus("splitting");
    void warmupEngine();
    try {
      const result = await explodeGifFrames(picked);
      setFrames(result);
      setSelected(new Set(result.map((f) => f.index)));
      setStatus("ready");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof EngineLoadError
          ? err.message
          : "That GIF couldn't be split into frames. Try another file.",
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

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const chosen = useMemo(
    () => frames.filter((f) => selected.has(f.index)),
    [frames, selected],
  );

  const download = async () => {
    if (!file || !chosen.length) return;
    setStatus("downloading");
    setError(null);
    try {
      const total = frames.length;
      const make = async (frame: GifFrame) =>
        format === "png" ? await gifFrameToPng(frame) : frame.blob;

      if (chosen.length === 1) {
        const blob = await make(chosen[0]!);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = frameFileName(chosen[0]!.index, format, total);
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      } else {
        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();
        for (const frame of chosen) {
          const blob = await make(frame);
          zip.file(frameFileName(frame.index, format, total), blob);
        }
        const out = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(out);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${baseName(file.name)}-frames.zip`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }
    } catch {
      setError("The download couldn't be prepared. Try fewer frames or the GIF format.");
    } finally {
      setStatus("ready");
    }
  };

  const busy = status === "splitting" || status === "downloading";

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
              <span className="mr-2 font-semibold text-primary">2.</span>Pick the frames you want.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">3.</span>Download as PNG or GIF.
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

      {file && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="break-words text-sm text-muted-foreground">
              {file.name} — {formatBytes(file.size)}
              {frames.length ? ` · ${frames.length} frames` : ""}
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <RotateCcw className="size-4" aria-hidden="true" /> Start over
            </button>
          </div>

          {file.size > HEAVY_BYTES && (
            <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              This file is over 30 MB. Splitting may be slow on this device — the tab stays usable
              while it runs.
            </p>
          )}

          {status === "splitting" && (
            <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Splitting into frames…
            </p>
          )}

          {frames.length > 0 && (
            <>
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div role="group" aria-label="Frame selection" className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(new Set(frames.map((f) => f.index)))}
                    className="min-h-11 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(new Set())}
                    className="min-h-11 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Select none
                  </button>
                </div>

                <div role="group" aria-label="Download format" className="flex gap-2">
                  {(["png", "gif"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={format === f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        "min-h-11 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        format === f
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-accent",
                      )}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
                  {chosen.length} of {frames.length} frames selected
                </p>

                <button
                  type="button"
                  onClick={() => void download()}
                  disabled={busy || !chosen.length}
                  className="ml-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
                >
                  {status === "downloading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Preparing…
                    </>
                  ) : (
                    <>
                      <Download className="size-4" aria-hidden="true" />
                      {chosen.length > 1
                        ? `Download ${chosen.length} frames (zip)`
                        : "Download frame"}
                    </>
                  )}
                </button>
              </div>

              <ul
                className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6"
                aria-label="GIF frames"
              >
                {frames.map((frame) => {
                  const on = selected.has(frame.index);
                  return (
                    <li key={frame.index}>
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`Frame ${frame.index + 1}, ${formatMs(frame.delayMs)}${
                          on ? ", selected" : ""
                        }`}
                        onClick={() => toggle(frame.index)}
                        className={cn(
                          "w-full overflow-hidden rounded-xl border-2 bg-card text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          on ? "border-primary" : "border-border hover:bg-accent",
                        )}
                      >
                        <img
                          src={frame.url}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="aspect-square w-full bg-muted/40 object-contain"
                        />
                        <span className="block px-2 py-1.5 text-xs text-muted-foreground">
                          #{frame.index + 1} — {formatMs(frame.delayMs)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {status === "ready" && !frames.length && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scissors className="size-4" aria-hidden="true" /> This GIF has no separable frames.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
