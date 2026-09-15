import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";
import { discordFaqs } from "@/lib/discord-faqs";

export const Page = lazyRouteComponent(() => import("./compress-gif-for-discord.view"));

const SITE = "https://zipgif.com";
const PATH = "/compress-gif-for-discord";
const TITLE = "Compress GIF for Discord — Under 10MB, 256KB or 512KB";
const DESCRIPTION =
  "Free Discord GIF compressor with presets for 10 MB uploads, 256 KB emoji and 512 KB stickers. Runs in your browser: no upload, no signup, no watermark.";
const MODIFIED = "2026-09-15";

export const options = makeRouteOptions("/compress-gif-for-discord", {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}${PATH}` },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: `${SITE}/og-discord.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "ZipGIF — compress a GIF for Discord under 10MB, 256KB or 512KB",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/og-discord.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}${PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Compress GIF for Discord",
          description: DESCRIPTION,
          dateModified: MODIFIED,
          mainEntityOfPage: `${SITE}${PATH}`,
          author: {
            "@type": "Person",
            name: "Shafiullah Tareen",
            description: "Developer and maintainer of ZipGIF, a browser-based GIF toolbox.",
          },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "GIF Compressor", item: `${SITE}/gif-compressor` },
            { "@type": "ListItem", position: 2, name: "Compress GIF for Discord", item: `${SITE}${PATH}` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: discordFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Page,
});
