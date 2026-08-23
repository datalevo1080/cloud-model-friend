/**
 * Regenerates the sitemap set: one sitemap per locale plus a sitemap index.
 *
 *   bun scripts/gen-sitemap.ts
 *
 * Every URL carries the full hreflang alternate set (all six languages +
 * x-default → English), which is what Google requires for multilingual
 * clustering. No <lastmod> is emitted: nothing in the project tracks a
 * per-page authoritative change date.
 */
import { writeFileSync } from "node:fs";

import { HREFLANG, LOCALES, PAGE_PATHS, SITE, absoluteUrl } from "../src/i18n/config";

const PRIORITY = (path: string) =>
  path === "/" ? "1.0" : ["/about", "/contact", "/privacy", "/terms"].includes(path) ? "0.4" : "0.8";
const CHANGEFREQ = (path: string) =>
  ["/privacy", "/terms"].includes(path) ? "yearly" : path === "/" ? "weekly" : "monthly";

for (const locale of LOCALES) {
  const urls = PAGE_PATHS.map((path) => {
    const alternates = [
      ...LOCALES.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${absoluteUrl(l, path)}" />`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl("en", path)}" />`,
    ].join("\n");
    return [
      "  <url>",
      `    <loc>${absoluteUrl(locale, path)}</loc>`,
      alternates,
      `    <changefreq>${CHANGEFREQ(path)}</changefreq>`,
      `    <priority>${PRIORITY(path)}</priority>`,
      "  </url>",
    ].join("\n");
  });

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
    "",
  ].join("\n");
  writeFileSync(`public/sitemap-${locale}.xml`, xml);
}

const index = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...LOCALES.map((l) => `  <sitemap>\n    <loc>${SITE}/sitemap-${l}.xml</loc>\n  </sitemap>`),
  `</sitemapindex>`,
  "",
].join("\n");
writeFileSync("public/sitemap.xml", index);

const robots = [
  ...["Googlebot", "Bingbot", "Twitterbot", "facebookexternalhit", "GPTBot", "*"].map(
    (ua) => `User-agent: ${ua}\nAllow: /\n`,
  ),
  `Sitemap: ${SITE}/sitemap.xml`,
  ...LOCALES.map((l) => `Sitemap: ${SITE}/sitemap-${l}.xml`),
  "",
].join("\n");
writeFileSync("public/robots.txt", robots);

console.log(
  `wrote ${LOCALES.length} locale sitemaps (${PAGE_PATHS.length} URLs each), sitemap index and robots.txt`,
);
