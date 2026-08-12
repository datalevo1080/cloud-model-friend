import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

/**
 * Before/after comparison. Fully keyboard operable: arrows nudge, Page keys
 * jump, Home/End snap to either edge, and the handle exposes a labelled
 * slider role so screen readers announce the split position.
 */
export function BeforeAfter({
  beforeUrl,
  afterUrl,
  alt,
  beforeLabel,
  afterLabel,
  savingLabel,
}: {
  beforeUrl: string;
  afterUrl: string;
  alt: string;
  /** original file size, shown on the "Original" chip */
  beforeLabel?: string;
  /** compressed file size, shown on the "Compressed" chip */
  afterLabel?: string;
  /** e.g. "−67% smaller", shown under the compressed side */
  savingLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const clamp = (n: number) => Math.min(100, Math.max(0, n));
    const keys: Record<string, number> = {
      ArrowLeft: -4,
      ArrowRight: 4,
      ArrowDown: -4,
      ArrowUp: 4,
      PageDown: -20,
      PageUp: 20,
    };
    if (e.key in keys) {
      e.preventDefault();
      setPos((p) => clamp(p + keys[e.key]!));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  const rounded = Math.round(pos);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-video w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]"
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
    >
      <img
        src={afterUrl}
        alt={`Compressed preview of ${alt}`}
        width={1280}
        height={720}
        decoding="async"
        className="absolute inset-0 size-full object-contain"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden={pos < 5}
      >
        <img
          src={beforeUrl}
          alt={`Original preview of ${alt}`}
          width={1280}
          height={720}
          decoding="async"
          className="absolute inset-0 size-full object-contain"
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-foreground/80 px-2 py-1 text-xs font-medium text-background">
        Original{beforeLabel ? ` · ${beforeLabel}` : ""}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
        Compressed{afterLabel ? ` · ${afterLabel}` : ""}
      </span>
      {savingLabel && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-success px-2 py-1 text-xs font-semibold text-success-foreground">
          {savingLabel}
        </span>
      )}

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-background shadow-[0_0_0_1px_var(--color-border)]"
        style={{ left: `${pos}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Compare original and compressed ${alt}`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={`${rounded}% original, ${100 - rounded}% compressed. Arrow keys move the divider, Home and End jump to the edges.`}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="size-5 text-foreground" aria-hidden="true" />
      </div>
    </div>
  );
}
