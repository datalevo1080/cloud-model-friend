import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
  frameFileName,
  gifFrameToPng,
  revokeFrames,
  type GifFrame,
} from "@/lib/gif-frames";

type Mode = "first" | "all";

type Result = {
  mode: Mode;
  blob: Blob;
  fileName: string;
  frames: number;
  width: number;
  height: number;
  previewUrl: string;
};

export function GifToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const [mode, setMode] = useState<Mode>("first");
  const [status, setStatus] = useState<"idle" | "reading" | "ready" | "working">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const framesRef = useRef<GifFrame[]>([]);
  framesRef.current = frames;
  const resultRef = useRef<Result | null>(null);
  resultRef.current = result;

  useEffect(
    () => () => {
      revokeFrames(framesRef.current);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.previewUrl);
    },
    [],
  );

  const clearResult = useCallback(() => {
    setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }, []);

  const reset = useCallback(() => {
    revokeFrames(framesRef.current);
    setFrames([]);
    setFile(null);
    setStatus("idle");
    setError(null);
    setMessage(null);
    clearResult();
  }, [clearResult]);

  const addFiles = useCallback(
    async (list: File[]) => {
      const picked = list[0];
      if (!picked) return;
      setMessage(null);
      setError(null);
      clearResult();
      if (picked.size === 0) {
        setMessage(`"${picked.name}" — that file is empty.`);
        return;
      }
      if (picked.size > MAX_BYTES) {
        setMessage(`"${picked.name}" — larger than 200 MB, which browsers can't hold safely.`);
        return;
      }
      if (!(await hasGifMagicBytes(picked))) {
        setMessage(`"${picked.name}" — not a real GIF, so there are no frames to export.`);
        return;
      }
      if (list.length > 1) {
        setMessage("This converter handles one GIF at a time — we kept the first one.");
      }
      revokeFrames(framesRef.current);
      setFrames([]);
      setFile(picked);
      setStatus("reading");
      void warmupEngine();
      try {
        // `--unoptimize` inside explodeGifFrames coalesces first, so every PNG
        // is a full image instead of an optimized sliver.
        const result = await explodeGifFrames(picked);
        setFrames(result);
        setStatus("ready");
      } catch (err) {
        setStatus("idle");
        setError(
          err instanceof EngineLoadError
            ? err.message
            : "That GIF couldn't be read. Try another file.",
        );
      }
    },
    [clearResult],
  );

  const addFromUrl = useCallback(
    async (url: string) => {
      const fetched = await fetchGifFromUrl(url);
      await addFiles([fetched]);
    },
    [addFiles],
  );

  const convert = async () => {
    if (!file || !frames.length) return;
    setStatus("working");
    setError(null);
    clearResult();
    try {
      const firstPng = await gifFrameToPng(frames[0]!);
      const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(firstPng);
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
          URL.revokeObjectURL(url);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("The PNG couldn't be measured."));
        };
        img.src = url;
      });

      if (mode === "first") {
        setResult({
          mode,
          blob: firstPng,
          fileName: `${baseName(file.name)}.png`,
          frames: 1,
          width: dims.width,
          height: dims.height,
          previewUrl: URL.createObjectURL(firstPng),
        });
      } else {
        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();
        for (const frame of frames) {
          const png = frame.index === 0 ? firstPng : await gifFrameToPng(frame);
          zip.file(frameFileName(frame.index, "png", frames.length), png);
        }
        const out = await zip.generateAsync({ type: "blob" });
        setResult({
          mode,
          blob: out,
          fileName: `${baseName(file.name)}-png.zip`,
          frames: frames.length,
          width: dims.width,
          height: dims.height,
          previewUrl: URL.createObjectURL(firstPng),
        });
      }
    } catch {
      setError("The PNG export failed. Try a smaller GIF or the first-frame option.");
    } finally {
      setStatus("ready");
    }
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const busy = status === "reading" || status === "working";

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
              <span className="mr-2 font-semibold text-primary">2.</span>Choose first frame or every
              frame.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <span className="mr-2 font-semibold text-primary">3.</span>Download the PNG or the
              zip.
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

          {status === "reading" && (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Reading frames…
            </p>
          )}

          {frames.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">What to export</h3>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="PNG output">
                {(
                  [
                    { id: "first" as const, label: "First frame (one PNG)" },
                    { id: "all" as const, label: `All frames (zip of ${frames.length} PNGs)` },
                  ]
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={mode === option.id}
                    onClick={() => {
                      setMode(option.id);
                      clearResult();
                    }}
                    className={cn(
                      "min-h-11 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      mode === option.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void convert()}
                disabled={busy}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
              >
                {status === "working" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Converting…
                  </>
                ) : (
                  "Convert to PNG"
                )}
              </button>
            </div>
          )}

          {result && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">Your PNG is ready</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,240px)_1fr]">
                <img
                  src={result.previewUrl}
                  alt="Preview of the exported PNG frame"
                  className="w-full rounded-xl border border-border bg-muted/40 object-contain"
                />
                <div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">Frames exported</dt>
                      <dd className="font-semibold">{result.frames}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Dimensions</dt>
                      <dd className="font-semibold">
                        {result.width}×{result.height}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Output size</dt>
                      <dd className="font-semibold">{formatBytes(result.blob.size)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">File</dt>
                      <dd className="break-words font-semibold">{result.fileName}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={download}
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    {result.mode === "all" ? "Download zip" : "Download PNG"}
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                To eyeball every frame and pick exact ones visually, use the{" "}
                <Link
                  to="/gif-splitter"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  GIF Splitter
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
