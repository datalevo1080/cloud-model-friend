import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { DEFAULT_LOCALE, LOCALE_NAMES, useBasePath, useLocale, useT } from "@/i18n";
import { localePath } from "@/i18n/config";

const STORAGE_KEY = "zipgif.locale-bar.dismissed";

/**
 * One-line, dismissible bar naming the language the page is written in, with a
 * link back to the English original. Never redirects — it only informs.
 */
export function LocaleBar() {
  const locale = useLocale();
  const basePath = useBasePath();
  const t = useT();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Read after hydration so SSR and client markup match.
    try {
      setHidden(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);

  if (locale === DEFAULT_LOCALE || hidden) return null;

  return (
    <div
      role="status"
      className="border-b border-border/70 bg-muted/50 text-foreground"
      lang={locale === "pt" ? "pt-BR" : locale}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm sm:px-6">
        <p className="min-w-0 flex-1 truncate text-muted-foreground">
          {t("langBar.viewing", { language: LOCALE_NAMES[locale] })}{" "}
          <a
            href={localePath(DEFAULT_LOCALE, basePath)}
            hrefLang="en"
            lang="en"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("langBar.action")}
          </a>
        </p>
        <button
          type="button"
          onClick={() => {
            setHidden(true);
            try {
              window.localStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* storage blocked — dismissal is session-only */
            }
          }}
          aria-label={t("langBar.dismiss")}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
