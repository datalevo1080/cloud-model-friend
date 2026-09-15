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

/** Visible FAQ copy lives in the .view file; keep these answers identical to it. */
export const discordFaqs = [
  {
    q: "How do I compress a GIF to under 10 MB for Discord?",
    a: "Pick the Under 10 MB Upload preset and drop your GIF in. The tool tries optimization first, then gradually reduces colours, size and frames until the file fits. Everything runs in your browser, so nothing is uploaded anywhere.",
  },
  {
    q: "How do I make a GIF under 256 KB for a Discord emoji?",
    a: "Use the Under 256 KB Emoji preset. Discord also caps emoji at 128×128 pixels, so the preset resizes to that too. Most GIFs fit after colour reduction and a little lossy compression.",
  },
  {
    q: "What if my GIF still won't reach 256 KB?",
    a: "Long or photographic GIFs sometimes can't get that small without falling apart. Try trimming the clip shorter with the GIF trimmer or cropping to just the action with the GIF cropper, then compress again.",
  },
  {
  q: "Are my GIFs uploaded to a server?",
    a: "No. Compression happens on your own device with a WebAssembly build of Gifsicle. Your file never leaves your browser, and the tool works offline after the first visit.",
  },
  {
    q: "Does compressing a GIF for Discord reduce its quality?",
    a: "It can, but the tool always starts with invisible savings and only increases compression until the target is met. Use the compare slider to check the result before you download it.",
  },
  {
    q: "Is this Discord GIF compressor free?",
    a: "Yes. No account, no signup, no watermark and no daily limit. Because the work happens on your device instead of our servers, we can keep it free.",
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
