import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { filesFromDataTransfer } from "@/lib/gif-validate";

export function DropZone({
  onFiles,
  disabled,
}: {
  onFiles: (files: File[]) => void | Promise<void>;
  disabled?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Add GIF files: drop them here, paste from clipboard, or press Enter to browse"
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
      <p className="mt-2 text-sm text-muted-foreground">
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
  );
}
