import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes, savingsPercent } from "@/lib/format";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import { BeforeAfter } from "@/components/tool/before-after";
import {
  DEFAULT_LIMITS,
  DISCORD_TARGETS,
  LADDER,
  type DiscordTargetId,
  type FitLimits,
  type FitResult,
  discordFileName,
  fitToTarget,
} from "@/lib/discord-fit";

const MAX_BYTES = 200 * 1024 * 1024;

type Unit = "KB" | "MB";

/**
 * Target-size workflow for Discord uploads. Everything runs locally in the
 * browser on the shared WASM engine — no upload, no API call.
 */
export function DiscordFit() {
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<DiscordTargetId>("upload");
  const [customValue, setCustomValue] = useState("2");
  const [customUnit, setCustomUnit] = useState<Unit>("MB");
  const [limits, setLimits] = useState<FitLimits>(DEFAULT_LIMITS);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<FitResult | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canceled = useRef(false);

  useEffect(() => () => {
    if (srcUrl) URL.revokeObjectURL(srcUrl);
  }, [srcUrl]);
  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  const preset = DISCORD_TARGETS.find((t) => t.id === targetId);
  const customBytes = Math.round(
    Math.max(0, Number(customValue) || 0) * (customUnit === "MB" ? 1024 * 1024 : 1024),
  );
  const targetBytes = preset ? preset.bytes : customBytes;
  const targetLabel = preset ? preset.label : `${customValue || 0} ${customUnit}`;

  const clearResult = () => {
    setResult(null);
    setResultUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return null;
    });
  };

  const accept = async (picked: File | null | undefined) => {
    setError(null);
    clearResult();
    if (!picked) return;
    if (picked.size === 0) return setError("That file is empty.");
    if (picked.size > MAX_BYTES) return setError("That file is larger than 200 MB.");
    if (!(await hasGifMagicBytes(picked))) {
      return setError("That doesn't look like a GIF — pick a real .gif file.");
    }
    setSrcUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return URL.createObjectURL(picked);
    });
    setFile(picked);
  };

  const run = async () => {
    if (!file || busy) return;
    if (targetBytes <= 0) return setError("Enter a target size first.");
    setError(null);
    clearResult();
    canceled.current = false;
    setBusy(true);
    setStep(1);
    try {
      const res = await fitToTarget(
        file,
        targetBytes,
        { ...limits, maxDim: preset?.maxDim },
        (s) => setStep(s),
        () => canceled.current,
      );
      setResult(res);
      setResultUrl(URL.createObjectURL(res.blob));
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Compression failed. Try another GIF.");
      }
    } finally {
      setBusy(false);
      setStep(0);
    }
  };

  const saved = result && file ? savingsPercent(file.size, result.blob.size) : 0;

  return (
    <section
      id="discord-target-tool"
      aria-labelledby="discord-target-heading"
      className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-7"
    >
      <h2 id="discord-target-heading" className="text-2xl font-bold tracking-tight">
        Hit a Discord size target, in your browser
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Pick the limit you need, add a GIF, and ZipGIF tries progressively stronger settings —
        optimization first, then colours, dimensions and frames only if they're needed. The file
        never leaves your device.
      </p>

      {/* Targets */}
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">Target</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...DISCORD_TARGETS, { id: "custom" as const, label: "Custom KB/MB" }].map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={targetId === t.id}
              onClick={() => {
                setTargetId(t.id as DiscordTargetId);
                clearResult();
              }}
              className={cn(
                "min-h-11 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                targetId === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {preset && <p className="mt-2 text-xs text-muted-foreground">{preset.note}</p>}
        {targetId === "custom" && (
          <div className="mt-3 flex items-center gap-2">
            <label htmlFor="discord-custom" className="text-sm">
              Target size
            </label>
            <input
              id="discord-custom"
              type="number"
              min={1}
              step={1}
              inputMode="decimal"
              value={customValue}
              onChange={(e) => {
                setCustomValue(e.target.value);
                clearResult();
              }}
              className="h-11 w-24 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <select
              aria-label="Unit"
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value as Unit)}
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="KB">KB</option>
              <option value="MB">MB</option>
            </select>
          </div>
        )}
      </fieldset>

      {/* Manual controls */}
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">What ZipGIF may change</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(
            [
              ["allowColorReduction", "Reduce colours"],
              ["allowResize", "Reduce dimensions"],
              ["allowFrameReduction", "Reduce frames"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={limits[key]}
                onChange={(e) => {
                  setLimits((l) => ({ ...l, [key]: e.target.checked }));
                  clearResult();
                }}
                className="size-4 accent-[var(--color-primary)]"
              />
              {label}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Lossless optimization and lossy compression are always allowed. Nothing is ever enlarged.
        </p>
      </fieldset>

      {/* File */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-sm font-semibold transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void accept(e.dataTransfer.files?.[0]);
          }}
        >
          <UploadCloud className="size-5 text-primary" aria-hidden="true" />
          {file ? `${file.name} · ${formatBytes(file.size)}` : "Choose or drop a GIF"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/gif,.gif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            void accept(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void run()}
          disabled={!file || busy}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {busy ? `Trying setting ${step} of ${LADDER.length}…` : `Fit to ${targetLabel}`}
        </button>
        {busy && (
          <button
            type="button"
            onClick={() => {
              canceled.current = true;
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="size-4" aria-hidden="true" /> Cancel
          </button>
        )}
        <span className="text-xs text-muted-foreground">
          We can't promise a size before we've actually compressed it — the result below is measured,
          not estimated.
        </span>
      </div>

      <p aria-live="polite" className="sr-only">
        {busy ? `Trying setting ${step} of ${LADDER.length}` : result ? "Compression finished" : ""}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {result && file && resultUrl && srcUrl && (
        <div className="mt-6 rounded-xl border border-border p-4 sm:p-5">
          <div
            className={cn(
              "flex items-start gap-2 text-sm font-semibold",
              result.hitTarget ? "text-success" : "text-destructive",
            )}
          >
            {result.hitTarget ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {result.hitTarget
                ? result.keptOriginal
                  ? `Already under ${targetLabel} — ${formatBytes(result.blob.size)}, kept as-is.`
                  : `Target passed — ${formatBytes(result.blob.size)} is under ${targetLabel}.`
                : `Target missed. The smallest safe result is ${formatBytes(result.blob.size)}, still over ${targetLabel}.`}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Original</dt>
              <dd className="font-semibold">{formatBytes(file.size)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Result</dt>
              <dd className="font-semibold">{formatBytes(result.blob.size)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Saved</dt>
              <dd className="font-semibold">{savingsPercent(file.size, result.blob.size)}%</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Output</dt>
              <dd className="font-semibold">
                {result.width}×{result.height} · {result.frames} frames
              </dd>
            </div>
          </dl>

          <h3 className="mt-4 text-sm font-semibold">What was changed</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {result.changes.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>
              Reached on attempt {result.attempts.length} of {LADDER.length}.
            </li>
          </ul>

          {!result.hitTarget && (
            <p className="mt-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
              This GIF can't reach {targetLabel} without wrecking it. Shorten it with the{" "}
              <a className="text-primary underline underline-offset-4" href="/gif-trimmer">
                GIF trimmer
              </a>{" "}
              or cut dead space with the{" "}
              <a className="text-primary underline underline-offset-4" href="/gif-cropper">
                GIF cropper
              </a>
              , then run this again. Duration is almost always the real problem.
            </p>
          )}

          <div className="mt-5">
            <BeforeAfter
              beforeUrl={srcUrl}
              afterUrl={resultUrl}
              alt={file.name}
              beforeLabel={formatBytes(file.size)}
              afterLabel={formatBytes(result.blob.size)}
              savingLabel={saved > 0 ? `−${saved}% smaller` : ""}
            />
          </div>

          <a
            href={resultUrl}
            download={discordFileName(file.name)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Download className="size-4" aria-hidden="true" /> Download this GIF
          </a>
        </div>
      )}
    </section>
  );
}
