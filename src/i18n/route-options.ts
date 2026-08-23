import {
  DEFAULT_LOCALE,
  HREFLANG,
  LOCALES,
  SITE,
  type Locale,
  absoluteUrl,
  localePath,
} from "./config";
import { translate } from "./index";
import { autoTranslateFor } from "./auto";

/** Deep-translate every prose string inside a JSON-LD block. */
function localizeJsonLd(value: unknown, locale: Locale): unknown {
  if (typeof value === "string") {
    if (/^https?:|^[\d.]+$/.test(value)) return value;
    return autoTranslateFor(locale, value);
  }
  if (Array.isArray(value)) return value.map((v) => localizeJsonLd(v, locale));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = k === "@type" || k === "@context" || k === "url" ? v : localizeJsonLd(v, locale);
    }
    return out;
  }
  return value;
}

type MetaEntry = Record<string, string>;
type LinkEntry = Record<string, string>;

export type HeadResult = {
  meta?: MetaEntry[];
  links?: LinkEntry[];
  scripts?: unknown[];
};

/** hreflang set for one page path: every language + x-default → English. */
export function alternateLinks(basePath: string): LinkEntry[] {
  const links: LinkEntry[] = LOCALES.map((l) => ({
    rel: "alternate",
    hrefLang: HREFLANG[l],
    href: absoluteUrl(l, basePath),
  }));
  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: absoluteUrl(DEFAULT_LOCALE, basePath),
  });
  return links;
}

function localizeUrl(value: string, basePath: string, locale: Locale): string {
  const english = `${SITE}${basePath === "/" ? "/" : basePath}`;
  if (value === english || value === english.replace(/\/$/, "")) {
    return absoluteUrl(locale, basePath);
  }
  return value;
}

/**
 * Wraps a route's options so the same page module serves every language:
 * URLs are re-pointed at the localized path, canonical self-references,
 * hreflang alternates are emitted on every version.
 */
export function makeRouteOptions<T extends { head?: () => HeadResult }>(
  basePath: string,
  options: T,
) {
  return (locale: Locale): T => {
    const head = () => {
      const base = options.head?.() ?? {};
      const meta = (base.meta ?? []).map((entry) => {
        const next: MetaEntry = { ...entry };
        for (const key of ["content", "href"]) {
          const v = next[key];
          if (typeof v === "string" && v.startsWith(SITE)) {
            next[key] = localizeUrl(v, basePath, locale);
          }
        }
        return next;
      });

      if (locale !== DEFAULT_LOCALE) {
        const titleKey = `meta.${basePath}.title`;
        const descKey = `meta.${basePath}.description`;
        const title = translate(locale, titleKey);
        const description = translate(locale, descKey);
        if (title !== titleKey && description !== descKey) {
          for (const entry of meta) {
            if (typeof entry["title"] === "string") entry["title"] = title;
            if (entry["name"] === "description" || entry["property"] === "og:description")
              entry["content"] = description;
            if (entry["property"] === "og:title" || entry["name"] === "twitter:title")
              entry["content"] = title;
            if (entry["name"] === "twitter:description") entry["content"] = description;
          }
        }
      }

      const links = (base.links ?? [])
        .filter((l) => l["rel"] !== "alternate")
        .map((l) => {
          const next: LinkEntry = { ...l };
          const href = next["href"];
          if (next["rel"] === "canonical") {
            next["href"] = absoluteUrl(locale, basePath);
          } else if (typeof href === "string" && href.startsWith(SITE)) {
            next["href"] = localizeUrl(href, basePath, locale);
          }
          return next;
        });

      if (!links.some((l) => l["rel"] === "canonical")) {
        links.push({ rel: "canonical", href: absoluteUrl(locale, basePath) });
      }
      links.push(...alternateLinks(basePath));

      const scripts = (base.scripts ?? []).map((script) => {
        if (
          script &&
          typeof script === "object" &&
          typeof (script as { children?: unknown }).children === "string"
        ) {
          const s = script as { children: string };
          let children = s.children
            .split(`${SITE}${basePath}"`)
            .join(`${absoluteUrl(locale, basePath)}"`);
          if (locale !== DEFAULT_LOCALE) {
            try {
              const parsed = localizeJsonLd(JSON.parse(children), locale) as Record<string, unknown>;
              parsed["inLanguage"] = HREFLANG[locale];
              children = JSON.stringify(parsed);
            } catch {
              // Not parseable JSON — leave the block untouched.
            }
          }
          return { ...s, children };
        }
        return script;
      });

      return { ...base, meta, links, scripts };
    };

    return { ...options, head };
  };
}

export function localizedPathFor(locale: Locale, basePath: string) {
  return localePath(locale, basePath);
}
