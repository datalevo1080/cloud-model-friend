import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes, savingsPercent } from "@/lib/format";
import { hasGifMagicBytes } from "@/lib/gif-validate";
import { BeforeAfter } from "@/components/tool/before-after";
import {
  DEFAULT_LIMITS,
  LADDER,
  type FitLimits,
  type FitResult,
  fitToTarget,
} from "@/lib/discord-fit";

const MAX_BYTES = 200 * 1024 * 1024;
const MAX_FILES = 10;

type Unit = "KB" | "MB";

type Preset = { id: string; label: string; bytes: number };

/** Generic size targets for the compressor page. */
export const SIZE_PRESETS: Preset[] = [
  { id: "256kb", label: "256 KB", bytes: 256 * 1024 },
  { id: "512kb", label: "512 KB", bytes: 512 * 1024 },
  { id: "1mb", label: "1 MB", bytes: 1024 * 1024 },
  { id: "5mb", label: "5 MB", bytes: 5 * 1024 * 1024 },
  { id: "10mb", label: "10 MB", bytes: 10 * 1024 * 1024 },
];

type Entry = {
  id: string;
  file: File;
  url: string;
  result?: FitResult;
  resultUrl?: string;
  error?: string;
};

let counter = 0;

function outName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/[\\/:*?"<>|]+/g, "_") || "gif";
  return `${base}-zipgif.gif`;
}

/**
 * Optional "Target file size" mode for /gif-compressor. Same tested ladder
 * engine as the Discord page, batch-capable, 100% in the browser.
 */
export function TargetFit() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [presetId, setPresetId] = useState<string>("1mb");
  const [customValue, setCustomValue] = useState("2");
  const [customUnit, setCustomUnit] = useState<Unit>("MB");
  const [limits, setLimits] = useState<FitLimits>(DEFAULT_LIMITS);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [activeName, setActiveName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canceled = useRef(false);
  const entriesRef = useRef<Entry[]>([]);
  entriesRef.current = entries;

  useEffect(
    () => () => {
      entriesRef.current.forEach((e) => {
        URL.revokeObjectURL(e.url);
        if (e.resultUrl) URL.revokeObjectURL(e.resultUrl);
      });
    },
    [],
  );

  const preset = SIZE_PRESETS.find((p) => p.id === presetId);
  const customBytes = Math.round(
    Math.max(0, Number(customValue) || 0) * (customUnit === "MB" ? 1024 * 1024 : 1024),
  );
  const targetBytes = preset ? preset.bytes : customBytes;
  const targetShort = preset ? preset.label : `${customValue || 0} ${customUnit}`;

  const clearResults = () => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.resultUrl) URL.revokeObjectURL(e.resultUrl);
        const { result: _r, resultUrl: _u, error: _e, ...rest } = e;
        return rest;
      }),
    );
  };

  const accept = async (files: FileList | File[] | null | undefined) => {
    if (!files) return;
    const list = Array.from(files);
    const problems: string[] = [];
    const added: Entry[] = [];
    let room = MAX_FILES - entriesRef.current.length;
    for (const file of list) {
      if (room <= 0) {
        problems.push(`Only ${MAX_FILES} GIFs at a time — the rest were skipped.`);
        break;
      }
      if (file.size === 0) {
        problems.push(`Skipped "${file.name}" — the file is empty.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        problems.push(`Skipped "${file.name}" — it's over the 200 MB limit.`);
        continue;
      }
      if (!(await hasGifMagicBytes(file))) {
        problems.push(`Skipped "${file.name}" — that isn't a real GIF file.`);
        continue;
      }
      added.push({
        id: `tf-${++counter}`,
        file,
        url: URL.createObjectURL(file),
      });
      room--;
    }
    setNotice(problems.length ? problems.join(" ") : null);
    if (added.length) setEntries((prev) => [...prev, ...added]);
  };

  const remove = (id: string) => {
    setEntries((prev) => {
      const found = prev.find((e) => e.id === id);
      if (found) {
        URL.revokeObjectURL(found.url);
        if (found.resultUrl) URL.revokeObjectURL(found.resultUrl);
      }
      return prev.filter((e) => e.id !== id);
    });
  };

  const run = async () => {
    if (!entries.length || busy) return;
    if (targetBytes <= 0) {
      setNotice("Enter a target size first.");
      return;
    }
    setNotice(null);
    clearResults();
    canceled.current = false;
    setBusy(true);
    try {
      for (const entry of entriesRef.current) {
        if (canceled.current) break;
        setActiveName(entry.file.name);
        setStep(1);
        try {
          const res = await fitToTarget(
            entry.file,
            targetBytes,
            limits,
            (s) => setStep(s),
            () => canceled.current,
          );
          const url = URL.createObjectURL(res.blob);
          setEntries((prev) =>
            prev.map((e) => (e.id === entry.id ? { ...e, result: res, resultUrl: url } : e)),
          );
        } catch (err) {
          if ((err as Error)?.name === "AbortError") break;
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id
                ? { ...e, error: "Compression failed for this GIF. Try another file." }
                : e,
            ),
          );
        }
      }
    } finally {
      setBusy(false);
      setStep(0);
      setActiveName("");
    }
  };

  return (
    <div>
      <fieldset>
        <legend className="text-sm font-semibold">Target file size</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...SIZE_PRESETS, { id: "custom", label: "Custom", bytes: 0 }].map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={presetId === p.id}
              onClick={() => {
                setPresetId(p.id);
                clearResults();
              }}
              className={cn(
                "min-h-11 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                presetId === p.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        {presetId === "custom" && (
          <div className="mt-3 flex items-center gap-2">
            <label htmlFor="target-custom" className="text-sm">
              Target size
            </label>
            <input
              id="target-custom"
              type="number"
              min={1}
              step={1}
              inputMode="decimal"
              value={customValue}
              onChange={(e) => {
                setCustomValue(e.target.value);
                clearResults();
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
                  clearResults();
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

      <div className="mt-6">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void accept(e.dataTransfer.files);
          }}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-sm font-semibold transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <UploadCloud className="size-5 text-primary" aria-hidden="true" />
          {entries.length ? `Add more GIFs (${entries.length}/${MAX_FILES})` : "Choose or drop GIFs"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/gif,.gif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            void accept(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void run()}
          disabled={!entries.length || busy}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {busy ? `Trying setting ${step} of ${LADDER.length}…` : `Fit to ${targetShort}`}
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
          Sizes below are measured from the finished file, never estimated.
        </span>
      </div>

      <p aria-live="polite" className="sr-only">
        {busy ? `Compressing ${activeName}, setting ${step} of ${LADDER.length}` : ""}
      </p>

      {notice && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {notice}
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-xl border border-border p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold break-all">
                {entry.file.name}{" "}
                <span className="font-normal text-muted-foreground">
                  · {formatBytes(entry.file.size)}
                </span>
              </p>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                aria-label={`Remove ${entry.file.name}`}
                className="rounded-lg border border-border p-2 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>

            {entry.error && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {entry.error}
              </p>
            )}

            {entry.result && entry.resultUrl && (
              <div className="mt-4">
                <div
                  className={cn(
                    "flex items-start gap-2 text-sm font-semibold",
                    entry.result.hitTarget ? "text-success" : "text-destructive",
                  )}
                >
                  {entry.result.hitTarget ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {entry.result.hitTarget
                      ? entry.result.keptOriginal
                        ? `Already under ${targetShort} — ${formatBytes(entry.result.blob.size)}, kept as-is.`
                        : `Target passed — ${formatBytes(entry.result.blob.size)} is under ${targetShort}.`
                      : `Target missed. The smallest safe result is ${formatBytes(entry.result.blob.size)}, still over ${targetShort}.`}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="text-muted-foreground">Original</dt>
                    <dd className="font-semibold">{formatBytes(entry.file.size)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Result</dt>
                    <dd className="font-semibold">{formatBytes(entry.result.blob.size)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Saved</dt>
                    <dd className="font-semibold">
                      {savingsPercent(entry.file.size, entry.result.blob.size)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Output</dt>
                    <dd className="font-semibold">
                      {entry.result.width}×{entry.result.height} · {entry.result.frames} frames
                    </dd>
                  </div>
                </dl>

                <h4 className="mt-4 text-sm font-semibold">Settings applied</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {entry.result.changes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                  {entry.result.attempts.length > 0 && (
                    <li>
                      Reached on attempt {entry.result.attempts.length} of {LADDER.length}.
                    </li>
                  )}
                </ul>

                {!entry.result.hitTarget && (
                  <p className="mt-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                    This GIF can't reach {targetShort} without wrecking it. Shorten it with the{" "}
                    <a className="text-primary underline underline-offset-4" href="/gif-trimmer">
                      GIF trimmer
                    </a>{" "}
                    or cut dead space with the{" "}
                    <a className="text-primary underline underline-offset-4" href="/gif-cropper">
                      GIF cropper
                    </a>
                    , then try again.
                  </p>
                )}

                <div className="mt-5">
                  <BeforeAfter
                    beforeUrl={entry.url}
                    afterUrl={entry.resultUrl}
                    alt={entry.file.name}
                    beforeLabel={formatBytes(entry.file.size)}
                    afterLabel={formatBytes(entry.result.blob.size)}
                    savingLabel={
                      savingsPercent(entry.file.size, entry.result.blob.size) > 0
                        ? `−${savingsPercent(entry.file.size, entry.result.blob.size)}% smaller`
                        : ""
                    }
                  />
                </div>

                <a
                  href={entry.resultUrl}
                  download={outName(entry.file.name)}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Download className="size-4" aria-hidden="true" /> Download this GIF
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
