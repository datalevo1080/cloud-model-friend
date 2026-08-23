import { useRouterState } from "@tanstack/react-router";

import en from "./locales/en.json";
import id from "./locales/id.json";
import fr from "./locales/fr.json";
import ja from "./locales/ja.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  localePath,
  stripLocale,
} from "./config";

export * from "./config";

type Dict = Record<string, string>;

const DICTS: Record<Locale, Dict> = {
  en: en as Dict,
  id: id as Dict,
  fr: fr as Dict,
  ja: ja as Dict,
  es: es as Dict,
  pt: pt as Dict,
};

/** Translate a key for a locale. Falls back to English until Phase 2 fills the file. */
export function translate(locale: Locale, key: string, vars?: Record<string, string>): string {
  const raw = DICTS[locale]?.[key] ?? DICTS[DEFAULT_LOCALE][key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (m, name: string) => vars[name] ?? m);
}

export function dictionaryKeyCount(): number {
  return Object.keys(DICTS[DEFAULT_LOCALE]).length;
}

export function availableLocales(): readonly Locale[] {
  return LOCALES;
}

/** Current locale, derived from the URL prefix (never from IP or Accept-Language). */
export function useLocale(): Locale {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return stripLocale(pathname).locale;
}

/** Current page path without the language prefix. */
export function useBasePath(): string {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return stripLocale(pathname).path;
}

export function useT() {
  const locale = useLocale();
  return (key: string, vars?: Record<string, string>) => translate(locale, key, vars);
}

/** Locale-aware href helper for use inside components. */
export function useLocalePath() {
  const locale = useLocale();
  return (path: string) => localePath(locale, path);
}
