import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";
import {
  BadgeCheck,
  Cpu,
  Download,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { faqs } from "@/components/faq";

export const Page = lazyRouteComponent(() => import("./gif-compressor.view"));

const SITE = "https://zipgif.com";
const TITLE = "GIF Compressor — Compress GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF compressor. Reduce GIF file size without losing quality — for Discord, email and the web. No signup, no watermark, nothing uploaded.";
const OG_IMAGE = `${SITE}/og-image.jpg`;
const LAST_UPDATED = "August 14, 2026";
const MODIFIED = "2026-08-12";

const howToSteps = [
  {
    icon: Upload,
    title: "Add your GIF",
    body: "Drop your GIF onto the box above, paste it from your clipboard, or click to browse — up to 20 files at once.",
  },
  {
    icon: Sparkles,
    title: "Pick your settings (or don't)",
    body: "Leave Smart Compress on to let the tool read your frames and choose, or open Advanced settings and drive the lossy slider yourself.",
  },
  {
    icon: Download,
    title: "Compare and download",
    body: "Drag the before/after divider to check quality, then download the smaller GIF or grab the whole batch as a .zip.",
  },
];

const methods = [
  {
    method: "Lossy LZW compression",
    what: "Nudges pixels toward neighbouring palette colours so the LZW encoder finds longer repeated runs.",
    saving: "15–50%",
    impact: "Invisible up to ~80. Faint noise in gradients above ~120.",
  },
  {
    method: "Colour palette reduction",
    what: "Cuts the palette from 256 colours to 128, 64 or 32, shrinking both the palette table and the frame data.",
    saving: "10–45%",
    impact: "None on flat art or UI. Banding on photographic GIFs.",
  },
  {
    method: "Transparency optimization (-O3)",
    what: "Stores only the rectangle of pixels that changed between frames and marks the rest transparent.",
    saving: "10–40%",
    impact: "None. It's completely lossless.",
  },
  {
    method: "Remove duplicate frames",
    what: "Deletes frames identical to the one before them and extends the previous frame's delay instead.",
    saving: "5–65%",
    impact: "None. The animation plays the same.",
  },
  {
    method: "Frame rate reduction",
    what: "Keeps every second or third frame and doubles or triples the delay to hold the same duration.",
    saving: "35–60%",
    impact: "Slightly choppier motion. Fine for chat and README clips.",
  },
  {
    method: "Scaling dimensions",
    what: "Lowers GIF resolution — a 1200px-wide capture rarely needs to stay 1200px in a chat window.",
    saving: "40–75%",
    impact: "Sharpness drops. Text can get mushy below 50% scale.",
  },
];

const discordLimits = [
  { thing: "Attachment (default, all users)", limit: "10 MiB", note: "Higher with Nitro or server Boost Tier" },
  { thing: "Custom emoji (static or animated)", limit: "256 KiB", note: "128×128 renders best" },
  { thing: "Sticker (PNG, APNG, GIF, Lottie)", limit: "512 KiB", note: "320×320 canvas" },
];

const socialLimits = [
  {
    where: "X (Twitter) — web upload",
    limit: "15 MB",
    target: "5 MB",
    why: "Also capped at 1280×1080 and 350 frames",
  },
  {
    where: "X (Twitter) — iOS / Android app",
    limit: "5 MB",
    target: "5 MB",
    why: "The mobile cap, and the safe number everywhere",
  },
  {
    where: "WhatsApp — photo & video in chat",
    limit: "16 MB",
    target: "12 MB",
    why: "WhatsApp re-encodes to MP4 and compresses again",
  },
  {
    where: "WhatsApp — sent as a document",
    limit: "2 GB",
    target: "No limit in practice",
    why: "No re-encode, but no inline autoplay either",
  },
  {
    where: "WhatsApp — animated sticker",
    limit: "500 KB",
    target: "500 KB",
    why: "512×512 animated WebP",
  },
];

const platformLimits = [
  {
    platform: "Discord attachment",
    limit: "10 MiB default",
    target: "8 MB",
    href: "https://discord.com/developers/docs/reference",
  },
  {
    platform: "Discord emoji",
    limit: "256 KiB",
    target: "256 KB",
    href: "https://discord.com/developers/docs/resources/emoji",
  },
  {
    platform: "Discord sticker",
    limit: "512 KiB",
    target: "512 KB",
    href: "https://discord.com/developers/docs/resources/sticker",
  },
  {
    platform: "Gmail attachment (personal)",
    limit: "25 MB",
    target: "10 MB",
    href: "https://support.google.com/mail/answer/6584",
  },
  {
    platform: "Slack file upload",
    limit: "1 GB",
    target: "2 MB for inline playback",
    href: "https://slack.com/help/articles/201330736-Add-files-to-Slack",
  },
];

const comparison = [
  { label: "Price", zip: "Free, unlimited", other: "Free tier with daily caps" },
  { label: "Watermark on output", zip: "Never", other: "Common on free tiers" },
  { label: "Signup or email", zip: "Not required", other: "Often required" },
  { label: "File size limit", zip: "200 MB per GIF", other: "Typically 5–50 MB" },
  { label: "Batch support", zip: "20 GIFs, one .zip", other: "Usually one at a time" },
  { label: "Where files are processed", zip: "Your browser", other: "Their server" },
  { label: "Exact target file size", zip: "Yes, iterative passes", other: "Rare" },
];

const study = [
  { name: "Screen recording, 800×450, 60 frames", before: "100 KB", after: "70 KB", cut: "30.4%" },
  { name: "Screen recording, 1000×560, 90 frames", before: "181 KB", after: "125 KB", cut: "31.2%" },
  { name: "Talking head, 480×480, 48 frames", before: "30 KB", after: "11 KB", cut: "62.4%" },
  { name: "Talking head, 320×320, 30 frames", before: "19 KB", after: "8 KB", cut: "60.0%" },
  { name: "Flat logo loop, 600×300, 30 frames", before: "10 KB", after: "8 KB", cut: "19.9%" },
  { name: "Flat logo loop, 900×300, 40 frames", before: "14 KB", after: "11 KB", cut: "19.6%" },
  { name: "Photographic pan, 640×360, 40 frames", before: "1.68 MB", after: "843 KB", cut: "50.9%" },
  { name: "Photographic pan, 320×180, 25 frames", before: "339 KB", after: "161 KB", cut: "52.5%" },
  { name: "Camera noise, 320×240, 30 frames", before: "881 KB", after: "584 KB", cut: "33.7%" },
  { name: "Camera noise, 480×360, 40 frames", before: "2.54 MB", after: "1.70 MB", cut: "33.0%" },
  { name: "UI capture with cursor, 900×500", before: "8 KB", after: "6 KB", cut: "28.3%" },
  { name: "UI capture with cursor, 600×340", before: "5 KB", after: "4 KB", cut: "28.0%" },
  { name: "Progress bar, 60 frames, many duplicates", before: "6 KB", after: "2 KB", cut: "69.4%" },
  { name: "Progress bar, 800×450, 72 frames", before: "7 KB", after: "2 KB", cut: "67.5%" },
  { name: "Confetti burst, 400×400, 45 frames", before: "174 KB", after: "167 KB", cut: "4.4%" },
  { name: "Confetti burst, 640×640, 60 frames", before: "285 KB", after: "275 KB", cut: "3.6%" },
];

const useCases = [
  {
    icon: Zap,
    title: "Discord and gaming chats",
    body: "The single most common reason people compress a GIF. A 14 MB clip of a clutch round won't send; the same clip at 6 MB posts instantly and still looks fine at chat size.",
  },
  {
    icon: Layers,
    title: "Email signatures and newsletters",
    body: "Mail clients are brutal about weight, and Gmail caps personal attachments at 25 MB. Keep an animated signature under 200 KB and it loads before the reader scrolls past it.",
  },
  {
    icon: Gauge,
    title: "Website speed and Core Web Vitals",
    body: "A hero GIF is often the heaviest thing on a landing page. Shrinking a 4 MB loop to 900 KB pulls your Largest Contentful Paint down on mobile connections where it actually hurts.",
  },
  {
    icon: Sparkles,
    title: "Social posts",
    body: "Platforms re-encode what you upload, and they re-encode a bloated GIF badly. Send a cleaner, smaller file and their encoder has less damage to do to your colours.",
  },
  {
    icon: Cpu,
    title: "Docs, READMEs and tutorials",
    body: "GitHub renders GIFs inline, which makes them perfect for showing a CLI flow. Drop the frame rate to 12 fps and downsize the GIF to 800px wide, and a 9 MB terminal recording lands near 2 MB.",
  },
  {
    icon: ShieldCheck,
    title: "Messaging apps and NDAs",
    body: "If the GIF shows an unreleased product or a client's dashboard, a server-side compressor is a data transfer. This one isn't — the file never leaves your laptop.",
  },
];

export const options = makeRouteOptions("/gif-compressor", {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/gif-compressor` },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "ZipGIF GIF compressor — compress GIFs online free in your browser",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/gif-compressor` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ZipGIF",
          url: `${SITE}/`,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ZipGIF",
          url: `${SITE}/`,
          logo: OG_IMAGE,
          founder: { "@type": "Person", name: "Shafiullah Tareen" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ZipGIF GIF Compressor",
          url: `${SITE}/gif-compressor`,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          dateModified: MODIFIED,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Lossy GIF compression",
            "Colour palette reduction",
            "Duplicate frame removal",
            "Exact target file size",
            "Batch of 20 GIFs",
            "Runs entirely in the browser",
          ],
          browserRequirements: "Requires JavaScript and WebAssembly",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Compress a GIF",
          totalTime: "PT1M",
          step: howToSteps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.body,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
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
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "GIF Compressor", item: `${SITE}/gif-compressor` },
          ],
        }),
      },
    ],
  }),
  component: Page,
});
