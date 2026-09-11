import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./gif-to-png.view"));

const SITE = "https://zipgif.com";
const PATH = "/gif-to-png";
const TITLE = "GIF to PNG — Convert GIF to PNG Online Free";
const DESCRIPTION =
  "Convert GIF to PNG in your browser. Save the first frame as one PNG, or every frame as numbered PNGs in a zip, with transparency kept. Free, nothing uploaded.";
const MODIFIED = "2026-08-16";
const UPDATED = "August 16, 2026";

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop one GIF onto the tool",
    text: "Drop a single GIF onto the tool above, or paste a direct image link. The file is decoded on your device and is never uploaded.",
  },
  {
    name: "Keep First frame or switch to All frames",
    text: "First frame is selected by default and gives you one PNG. Switch to All frames to export every frame as numbered PNGs in one zip.",
  },
  {
    name: "Convert and download",
    text: "Press Convert to PNG, then download the single PNG or the numbered zip from the results card. Frame count, dimensions, and output size are listed there.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I convert a GIF to PNG?",
    a: "Drop the GIF on this page, leave the First frame option selected, press Convert to PNG, and download the image. The conversion runs in your browser, so the file is never uploaded. Switch to All frames if you want every frame instead of one.",
  },
  {
    q: "Can I save every frame of a GIF as a PNG?",
    a: "Yes. Choose All frames and the tool exports frame-001.png, frame-002.png and so on, in playback order, packed into a single zip. A 60-frame test animation produced a 123 KB zip in 0.2 seconds. Nothing is recompressed on the way out.",
  },
  {
    q: "How to turn a GIF into a sticker?",
    a: "Export one frame as a PNG, crop it to the subject, and upload it wherever stickers are accepted. Check the size cap first: Discord caps emoji at 256 KB and stickers at 512 KB. Simple graphic frames land far under both, often only a couple of kilobytes.",
  },
  {
    q: "Does GIF to PNG keep transparency?",
    a: "Yes. GIF marks one palette entry as transparent, on or off per pixel, and those pixels stay transparent in the PNG. No white box appears behind the image. PNG can store softer alpha than GIF ever recorded, so nothing is lost in the move.",
  },
  {
    q: "Why is my PNG bigger than the GIF?",
    a: "PNG is lossless and stores one full image, while a GIF spreads its data across frames and reuses a 256-color palette. A photographic frame from a 1,488 KB GIF came out as a 78 KB PNG, about 60 KB inside the GIF. Detail costs bytes.",
  },
  {
    q: "What is a PNG sequence?",
    a: "A PNG sequence is a folder of numbered still images, one per frame, in playback order. Video editors and animation tools import them directly as footage. Choosing All frames here gives you exactly that: frame-001.png onward, zipped, ready to import.",
  },
];

const MEASURED: { input: string; output: string; size: string; time: string }[] = [
  {
    input: "test-animation.gif, 400x300, 60 frames, 300 KB",
    output: "First frame PNG",
    size: "2 KB",
    time: "under 0.1 s",
  },
  {
    input: "photo-style.gif, 480x360, 25 frames, 1,488 KB (about 60 KB per stored frame)",
    output: "First frame PNG",
    size: "78 KB",
    time: "under 0.1 s",
  },
  {
    input: "test-animation.gif, all 60 frames",
    output: "Numbered PNG zip",
    size: "123 KB",
    time: "0.2 s",
  },
];

export const options = makeRouteOptions("/gif-to-png", {
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
          name: "GIF to PNG Converter",
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
          name: "How to convert GIF to PNG",
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
