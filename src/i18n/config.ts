export const SITE = "https://zipgif.com";

export const LOCALES = ["en", "id", "fr", "ja", "es", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Locales that get a URL prefix (English stays at the root — never move it). */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** hreflang code emitted for each locale. */
export const HREFLANG: Record<Locale, string> = {
  en: "en",
  id: "id",
  fr: "fr",
  ja: "ja",
  es: "es",
  pt: "pt-BR",
};

/** <html lang> value. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  id: "id",
  fr: "fr",
  ja: "ja",
  es: "es",
  pt: "pt-BR",
};

/** Native language names for the switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  fr: "Français",
  ja: "日本語",
  es: "Español",
  pt: "Português (Brasil)",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Every crawlable page path, without a language prefix. */
export const PAGE_PATHS = [
  "/",
  "/gif-compressor",
  "/compress-gif-for-discord",
  "/gif-cropper",
  "/gif-resizer",
  "/gif-speed-changer",
  "/gif-splitter",
  "/gif-trimmer",
  "/png-to-gif",
  "/gif-to-png",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const;

/** Prefix a root-relative English path with a locale. English is unchanged. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Strip a locale prefix from a pathname, returning the English path. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const match = /^\/([a-z]{2})(?=\/|$)/.exec(pathname);
  const candidate = match?.[1];
  if (candidate && isLocale(candidate) && candidate !== DEFAULT_LOCALE) {
    const rest = pathname.slice(candidate.length + 1) || "/";
    return { locale: candidate, path: rest === "" ? "/" : rest };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

export function absoluteUrl(locale: Locale, path: string): string {
  const p = localePath(locale, path);
  return `${SITE}${p === "/" ? "/" : p}`;
}
