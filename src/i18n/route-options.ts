import {
  DEFAULT_LOCALE,
  HREFLANG,
  LOCALES,
  SITE,
  type Locale,
  absoluteUrl,
  localePath,
} from "./config";

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
          return {
            ...s,
            children: s.children.split(`${SITE}${basePath}"`).join(`${absoluteUrl(locale, basePath)}"`),
          };
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
