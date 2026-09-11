import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

import { Resizer } from "@/components/tool/resizer";
import { resizeFaqs } from "@/components/resize-faq";

export const Page = lazyRouteComponent(() => import("./gif-resizer.view"));

const SITE = "https://zipgif.com";
const PATH = "/gif-resizer";
const TITLE = "GIF Resizer — Resize GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF resizer. Resize animated GIFs to exact dimensions, percentages, or platform presets — right in your browser. No uploads, no watermark.";
const UPDATED_ISO = "2026-08-14";
const UPDATED_LABEL = "August 14, 2026";

const DISCORD_DOCS = "https://discord.com/developers/docs/resources/emoji";
const TWITCH_DOCS = "https://help.twitch.tv/s/article/emote-guidelines";

const STEPS = [
  {
    name: "Add your GIF",
    text: "Drop one or more GIFs onto the tool, paste from the clipboard, or paste a direct image URL. The files stay on your device.",
  },
  {
    name: "Pick a size",
    text: "Type exact pixels with the aspect lock on, drag the percentage slider, or hit a preset such as Discord Emoji or Twitch Emote.",
  },
  {
    name: "Resize and download",
    text: "Press Resize GIF, check the before and after preview, then download the file — or grab a .zip if you resized a batch.",
  },
];

export const options = makeRouteOptions("/gif-resizer", {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}${PATH}` },
      { property: "og:site_name", content: "ZipGIF" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}${PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "GIF Resizer",
          url: `${SITE}${PATH}`,
          description: DESCRIPTION,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          browserRequirements: "Requires a modern browser with WebAssembly support",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
          dateModified: UPDATED_ISO,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to resize a GIF",
          dateModified: UPDATED_ISO,
          totalTime: "PT1M",
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          dateModified: UPDATED_ISO,
          mainEntity: resizeFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ZipGIF", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "GIF Resizer", item: `${SITE}${PATH}` },
          ],
        }),
      },
    ],
  }),
  component: Page,
});
