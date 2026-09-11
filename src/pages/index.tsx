import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

import {
  ArrowRight,
  Crop,
  Gauge,
  Images,
  Maximize2,
  Scissors,
  ShieldCheck,
  Sparkles,
  Split,
  Timer,
  Wand2,
  Zap,
} from "lucide-react";

export const Page = lazyRouteComponent(() => import("./index.view"));

const SITE = "https://zipgif.com";
const TITLE = "ZipGIF — Free Online GIF Tools That Never Upload Your Files";
const DESCRIPTION =
  "Compress, crop, resize, speed up, split, trim and convert GIFs online for free. Every ZipGIF tool runs in your browser, with no uploads, no watermark and no signup.";
const OG_IMAGE = `${SITE}/og-image.jpg`;
const LAST_UPDATED = "August 16, 2026";

const tools = [
  {
    icon: Zap,
    name: "GIF Compressor",
    href: "/gif-compressor" as const,
    blurb: "Cut file size by up to 70% with smart lossy settings or an exact target size.",
    tag: "Most used",
  },
  {
    icon: Crop,
    name: "GIF Cropper",
    href: "/gif-cropper" as const,
    blurb: "Drag a crop box, snap to presets, and cut every frame at once.",
  },
  {
    icon: Maximize2,
    name: "GIF Resizer",
    href: "/gif-resizer" as const,
    blurb: "Scale to exact pixels, a percentage, or a platform preset like a Twitch emote.",
  },
  {
    icon: Gauge,
    name: "GIF Speed Changer",
    href: "/gif-speed-changer" as const,
    blurb: "Speed up or slow down a GIF from 0.25x to 4x and set how it loops.",
  },
  {
    icon: Split,
    name: "GIF Splitter",
    href: "/gif-splitter" as const,
    blurb: "Explode a GIF into every frame and download them as PNGs in one zip.",
  },
  {
    icon: Scissors,
    name: "GIF Trimmer",
    href: "/gif-trimmer" as const,
    blurb: "Pick a start and end point on a visual timeline and keep only that part.",
  },
  {
    icon: Images,
    name: "PNG to GIF",
    href: "/png-to-gif" as const,
    blurb: "Turn one image into a GIF, or several into an animation with your own delay.",
  },
  {
    icon: Sparkles,
    name: "GIF to PNG",
    href: "/gif-to-png" as const,
    blurb: "Pull the first frame, or every frame, out of a GIF as clean PNG files.",
  },
];

const steps = [
  {
    n: "01",
    title: "Drop the file in",
    body: "Drag a GIF onto the tool, paste it from your clipboard, or point it at an image URL. It loads straight into the page.",
  },
  {
    n: "02",
    title: "The work happens here",
    body: "A WebAssembly build of Gifsicle runs inside a Web Worker on your own machine. Nothing is sent anywhere, so nothing waits on a queue.",
  },
  {
    n: "03",
    title: "Compare, then download",
    body: "Drag the before and after divider, check the numbers, and save the result. Batches come back as a single zip.",
  },
];

const proof = [
  { value: "0", label: "Bytes uploaded" },
  { value: "70%", label: "Typical size cut" },
  { value: "20", label: "GIFs per batch" },
  { value: "8", label: "Free tools" },
];

const objections = [
  {
    q: "Free tools usually mean a watermark.",
    a: "There is no watermark and no export limit here. The engine writes a plain GIF, byte for byte the format you started with.",
  },
  {
    q: "I cannot send client work to a random website.",
    a: "You are not sending it anywhere. Open the network tab while you compress: the only requests are for the page itself and the engine file.",
  },
  {
    q: "Browser tools are slow.",
    a: "A 5 MB GIF finishes in a couple of seconds on a laptop. Nothing waits in a queue behind other people's files.",
  },
];

const faqs = [
  {
    q: "Is ZipGIF really free?",
    a: "Yes. Every tool is free with no signup, no watermark, and no daily cap. The processing runs on your computer, so there are no server bills to pass on to you.",
  },
  {
    q: "Do my files get uploaded to a server?",
    a: "No. ZipGIF loads a WebAssembly build of Gifsicle into your browser and does the work there. Your GIF never leaves your device, which is why the tools also work with the network switched off after the first load.",
  },
  {
    q: "How much smaller can a GIF get?",
    a: "Screen recordings and flat-colour animations usually drop 40% to 70%. Photographic GIFs give back less, often 15% to 30%, because their frames share fewer repeated colours.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes. The tools run in mobile Safari and Chrome. Very large files take longer on a phone because the work is limited by your device, not by us.",
  },
];

export const options = makeRouteOptions("/", {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "ZipGIF — free browser-based GIF tools with zero uploads",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ZipGIF",
          url: `${SITE}/`,
          description: DESCRIPTION,
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
          "@type": "ItemList",
          name: "ZipGIF tools",
          itemListElement: tools.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.name,
            url: `${SITE}${t.href}`,
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
    ],
  }),
  component: Page,
});
