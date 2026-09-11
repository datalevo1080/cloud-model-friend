import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";
import { Cropper } from "@/components/tool/cropper";
import { cropFaqs } from "@/components/crop-faq";

export const Page = lazyRouteComponent(() => import("./gif-cropper.view"));

const SITE = "https://zipgif.com";
const PATH = "/gif-cropper";
const TITLE = "GIF Cropper — Crop GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF cropper. Crop animated GIFs in your browser — keep the animation, lose the borders. Square, 16:9 and PFP presets. No signup, no watermark.";
const LAST_UPDATED = "August 14, 2026";
const DATE_MODIFIED = "2026-08-12";

const HOW_TO_STEPS = [
  {
    name: "Add your GIF",
    text: "Drop a GIF onto the tool, paste one from your clipboard, or paste a direct image URL. Files stay on your device.",
  },
  {
    name: "Set the crop area",
    text: "Drag the crop box and its handles over the part you want to keep, or pick an aspect ratio preset like 1:1 or 16:9. Auto-trim snaps the box to the content if the GIF has borders.",
  },
  {
    name: "Download the cropped GIF",
    text: "Press Crop GIF, check the before and after, then download the file — or grab a .zip if you cropped a batch.",
  },
];

const CROP_TEST = [
  {
    kind: "Screen recording (browser chrome + taskbar removed)",
    dims: "1024×640 → 1600×900 sources",
    pixels: "12–14%",
    bytes: "6–9%",
  },
  {
    kind: "Meme or reaction GIF with dead space around the subject",
    dims: "640×640 → 1000×600 sources",
    pixels: "39–61%",
    bytes: "27–30%",
  },
  {
    kind: "Letterboxed clip (black bars top and bottom)",
    dims: "640×480 → 1280×960 sources",
    pixels: "33%",
    bytes: "11–16%",
  },
  {
    kind: "PFP-style 1:1 crop out of a widescreen GIF",
    dims: "640×360 → 1280×720 sources",
    pixels: "44%",
    bytes: "44–47%",
  },
];

export const options = makeRouteOptions("/gif-cropper", {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
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
          name: "ZipGIF GIF Cropper",
          url: `${SITE}${PATH}`,
          description: DESCRIPTION,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          browserRequirements: "Requires a modern browser with WebAssembly support",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Crop a GIF",
          description:
            "Crop an animated GIF in the browser so every frame is cropped identically and the animation stays intact.",
          totalTime: "PT1M",
          tool: [{ "@type": "HowToTool", name: "ZipGIF GIF Cropper" }],
          step: HOW_TO_STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
            url: `${SITE}${PATH}#how-to-crop-a-gif`,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: cropFaqs.map((f) => ({
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
          "@type": "Article",
          headline: "GIF Cropper — Crop GIFs Without Losing the Animation",
          description: DESCRIPTION,
          author: { "@type": "Person", name: "Shafiullah Tareen" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
          dateModified: DATE_MODIFIED,
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}${PATH}` },
        }),
      },
    ],
  }),
  component: Page,
});
