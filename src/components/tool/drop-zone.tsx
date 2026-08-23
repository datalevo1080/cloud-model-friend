import { L } from "@/components/l";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link2, Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { filesFromDataTransfer } from "@/lib/gif-validate";

export function DropZone({
  onFiles,
  onUrl,
  disabled,
}: {
  onFiles: (files: File[]) => unknown;
  /** Resolves when the remote GIF was added; rejects with a friendly message. */
  onUrl?: (url: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [urlBusy, setUrlBusy] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const urlErrorId = useId();

  const handle = useCallback(
    (list: FileList | File[] | null) => {
      if (!list) return;
      const files = Array.from(list);
      if (files.length) void onFiles(files);
    },
    [onFiles],
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length) handle(files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handle]);

  const submitUrl = async () => {
    if (!onUrl || disabled || urlBusy) return;
    setUrlError(null);
    setUrlBusy(true);
    try {
      await onUrl(url);
      setUrl("");
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : "That link couldn't be loaded.");
    } finally {
      setUrlBusy(false);
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Add GIF files: drop them here, paste from clipboard, or press Enter to browse"
        aria-describedby={hintId}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (disabled) return;
          // Dropped folders arrive as directory entries — walk them for GIFs.
          const dt = e.dataTransfer;
          void filesFromDataTransfer(dt)
            .then((files) => handle(files))
            .catch(() => handle(dt.files));
        }}
        className={cn(
          "group relative flex min-h-52 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors",
          "hover:border-primary/60 hover:bg-primary/5",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          dragging && "zg-dropzone-active border-primary bg-primary/10",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UploadCloud className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-4 text-base font-semibold">
          <span className="hidden sm:inline">Drop GIFs or a folder here, or </span>
          <span className="text-primary underline-offset-4 group-hover:underline">
            <span className="sm:hidden">Tap to select GIFs</span>
            <span className="hidden sm:inline">click to browse</span>
          </span>
        </p>
        <p id={hintId} className="mt-2 text-sm text-muted-foreground">
          .gif only · up to 20 files · 200&nbsp;MB each · paste with Ctrl/Cmd&nbsp;+&nbsp;V
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Drop a folder or a mixed selection — we pick out the GIFs and list anything skipped.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/gif,.gif"
          multiple
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            handle(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {onUrl && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submitUrl();
          }}
        >
          <label htmlFor="gif-url" className="text-sm font-medium">
            Or enter direct image URL
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <L2
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="gif-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder="https://example.com/animation.gif"
                value={url}
                disabled={disabled || urlBusy}
                aria-invalid={urlError ? true : undefined}
                aria-describedby={urlError ? urlErrorId : undefined}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={disabled || urlBusy || !url.trim()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              {urlBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Fetching…
                </>
              ) : (
                "Add from URL"
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            The download happens in your browser, straight from the image host — ZipGIF has no
            server to send it through. Links must point directly at a .gif file.
          </p>
          {urlError && (
            <p
              id={urlErrorId}
              role="alert"
              className="mt-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {urlError}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
