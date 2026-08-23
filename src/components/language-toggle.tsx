import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";

import { HREFLANG, LOCALES, LOCALE_NAMES, useBasePath, useLocale, useT } from "@/i18n";
import { localePath } from "@/i18n/config";
import { cn } from "@/lib/utils";

const SHORT: Record<string, string> = {
  en: "EN",
  id: "ID",
  fr: "FR",
  ja: "JA",
  es: "ES",
  pt: "PT",
};

/**
 * Header language toggle. Real crawlable <a> links to the same page in each
 * language — no IP or Accept-Language redirects, ever.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const basePath = useBasePath();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("footer.languageLabel")}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span>{SHORT[locale]}</span>
        <ChevronDown
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-popover p-1.5 shadow-2xl duration-150 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
          <ul>
            {LOCALES.map((l) => {
              const current = l === locale;
              return (
                <li key={l}>
                  <a
                    href={localePath(l, basePath)}
                    hrefLang={HREFLANG[l]}
                    lang={HREFLANG[l]}
                    aria-current={current ? "true" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      current ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span>{LOCALE_NAMES[l]}</span>
                    {current ? (
                      <Check className="size-4 text-primary" aria-hidden="true" />
                    ) : (
                      <span className="text-xs tracking-wide">{SHORT[l]}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
