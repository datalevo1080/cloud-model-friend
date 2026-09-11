import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./compress-gif-for-discord.view"));

const SITE = "https://zipgif.com";
const PATH = "/compress-gif-for-discord";
const TITLE = "Compress GIF for Discord — Fit the 10 MiB Limit Free";
const DESCRIPTION =
  "Compress a GIF for Discord in seconds. Verified limits for attachments, emoji and stickers, plus the exact target sizes that always upload.";
const LAST_UPDATED = "August 2026";
const MODIFIED = "2026-08-12";

const limits = [
  {
    thing: "Attachment, default for all users",
    limit: "10 MiB",
    target: "8 MB",
    href: "https://discord.com/developers/docs/reference",
  },
  {
    thing: "Custom emoji, static or animated",
    limit: "256 KiB",
    target: "256 KB at 128×128",
    href: "https://discord.com/developers/docs/resources/emoji",
  },
  {
    thing: "Sticker (PNG, APNG, GIF, Lottie)",
    limit: "512 KiB",
    target: "512 KB at 320×320",
    href: "https://discord.com/developers/docs/resources/sticker",
  },
];

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
        content: "ZipGIF — compress a GIF for Discord and fit the 10 MiB limit",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/og-discord.jpg` },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}${PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to compress a GIF for Discord",
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
            { "@type": "ListItem", position: 1, name: "GIF Compressor", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Compress GIF for Discord", item: `${SITE}${PATH}` },
          ],
        }),
      },
    ],
  }),
  component: Page,
});
