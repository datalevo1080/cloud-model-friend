import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfter({
  beforeUrl,
  afterUrl,
  alt,
}: {
  beforeUrl: string;
  afterUrl: string;
  alt: string;
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
          className="absolute inset-0 size-full object-contain"
        />
      </div>


      <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-foreground/80 px-2 py-1 text-xs font-medium text-background">
        Original
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
        Compressed
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-background shadow-[0_0_0_1px_var(--color-border)]"
        style={{ left: `${pos}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare original and compressed GIF"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
        }}
        className="absolute top-1/2 z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background shadow-soft"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="size-5 text-foreground" aria-hidden="true" />
      </div>
    </div>
  );
}
