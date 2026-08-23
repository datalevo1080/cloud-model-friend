import { LOCALES, LOCALE_NAMES, localePath, useBasePath, useLocale, useT } from "@/i18n";

/**
 * Footer language switcher: real crawlable <a> links to the SAME page in each
 * language. No IP or Accept-Language redirects — ever.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const basePath = useBasePath();
  const t = useT();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <h2 className="text-sm font-semibold text-foreground">{t("footer.language")}</h2>
      <nav aria-label={t("footer.languageLabel")} className="flex flex-wrap gap-x-4 gap-y-2">
        {LOCALES.map((l) => {
          const href = localePath(l, basePath);
          const current = l === locale;
          return (
            <a
              key={l}
              href={href}
              hrefLang={l === "pt" ? "pt-BR" : l}
              lang={l === "pt" ? "pt-BR" : l}
              aria-current={current ? "true" : undefined}
              className={
                current
                  ? "text-sm font-semibold text-foreground underline underline-offset-4"
                  : "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              }
            >
              {LOCALE_NAMES[l]}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
