import { useEffect, useRef, useState } from "react";

/**
 * A thin brand line that draws itself once it scrolls into view.
 * Purely decorative, hidden from assistive tech, and static when the
 * visitor asks for reduced motion.
 */
export function DrawLine({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={`pointer-events-none h-12 w-full ${className}`}
    >
      <path
        d="M0 46 C 200 46, 260 12, 440 12 S 720 46, 900 30 S 1120 8, 1200 20"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="zg-draw"
        data-on={on}
      />
    </svg>
  );
}
