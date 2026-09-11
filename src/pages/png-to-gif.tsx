import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./png-to-gif.view"));

const SITE = "https://zipgif.com";
const PATH = "/png-to-gif";
const TITLE = "PNG to GIF — Convert PNG to GIF Online Free";
const DESCRIPTION =
  "Convert PNG to GIF in your browser. One image becomes a still GIF, several become an animated GIF with your own frame delay and loop count. Free, no signup.";
const MODIFIED = "2026-08-16";
const UPDATED = "August 16, 2026";

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop your images on the tool",
    text: "Drop one or more PNG files onto the tool above. JPG and WebP are accepted too. The files are read on your device and never uploaded.",
  },
  {
    name: "Order the frames and set the timing",
    text: "Drag the numbered thumbnails into the order you want, set the frame delay in milliseconds, and choose the loop count: forever, once, or a custom number.",
  },
  {
    name: "Convert and download the GIF",
    text: "Press Convert to GIF, check the preview in the results card, and download the file. One image gives you a still GIF; several give you an animation.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I convert PNG to GIF?",
    a: "Drop the PNG on this page, press Convert to GIF, and download the result. Nothing is uploaded, so the file stays on your machine. Add several images instead of one and they become frames of an animation, in the order you drag them, at the delay you set.",
  },
  {
    q: "Can I make an animated GIF from PNG images?",
    a: "Yes. Add two or more images and each one becomes a frame. Drag the thumbnails to fix the order, set the delay per frame, and choose whether the GIF loops forever, plays once, or repeats a set number of times. The preview plays before you download.",
  },
  {
    q: "Does converting PNG to GIF lose quality?",
    a: "Some. A PNG can hold unlimited colors and 256 levels of alpha; a GIF frame holds at most 256 colors and on/off transparency. Flat graphics, text, and line art survive untouched. Photos get their colors reduced to a 256-color palette, so gradients band slightly.",
  },
  {
    q: "How to make a transparent GIF?",
    a: "Start from a PNG that already has a transparent background. This tool keeps pixels above 50% alpha opaque and makes everything at or below 50% fully transparent, because GIF has no partial transparency. A 512x512 transparent sticker PNG of 5 KB came out as a 3 KB transparent GIF.",
  },
  {
    q: "Can I convert APNG to GIF?",
    a: "Not yet. APNG is animated PNG, a separate format from the still PNG this tool reads today, so an APNG here converts as a single frame. An APNG converter is planned. For now, export your animation as separate PNG frames and drop them in together.",
  },
];

const MEASURED: { input: string; output: string; size: string; time: string }[] = [
  {
    input: "12 PNG stills, 400x300, 26 KB total",
    output: "Animated GIF, 1.2 s loop at 100 ms per frame",
    size: "15 KB",
    time: "0.1 s",
  },
  {
    input: "1 photo-style PNG, 800x600, 1,030 KB",
    output: "Static GIF (256 colors)",
    size: "403 KB",
    time: "0.3 s",
  },
  {
    input: "1 transparent sticker PNG, 512x512, 5 KB",
    output: "Transparent GIF",
    size: "3 KB",
    time: "under 0.1 s",
  },
];

export const options = makeRouteOptions("/png-to-gif", {
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
          name: "PNG to GIF Converter",
          url: `${SITE}${PATH}`,
          description: DESCRIPTION,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          browserRequirements: "Requires a modern browser with WebAssembly support",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
          dateModified: MODIFIED,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to convert PNG to GIF",
          url: `${SITE}${PATH}`,
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
          mainEntity: FAQS.map((f) => ({
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
