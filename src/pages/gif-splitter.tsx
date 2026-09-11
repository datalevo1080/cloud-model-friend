import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

import { Splitter } from "@/components/tool/splitter";

export const Page = lazyRouteComponent(() => import("./gif-splitter.view"));

const SITE = "https://zipgif.com";
const PATH = "/gif-splitter";
const TITLE = "GIF Splitter — Split a GIF into Frames Online Free";
const DESCRIPTION =
  "Free GIF splitter. Split an animated GIF into its individual frames, pick the ones you need, and download them as PNG or GIF. Runs in your browser, no upload.";
const MODIFIED = "2026-08-15";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I split a GIF into frames?",
    a: "Drop the GIF on the splitter above, wait for the frame grid, click Select all, pick PNG or GIF, and download. You get every frame as a separate numbered image in one zip. It works on any GIF, runs entirely in your browser, and takes a few seconds for typical files.",
  },
  {
    q: "Can I save GIF frames as PNG?",
    a: "Yes - PNG is the default output here. Each frame is converted losslessly in your browser: a GIF frame stores at most 256 colors and PNG preserves all of them, so the PNG is pixel-identical to the frame you saw in the grid.",
  },
  {
    q: "How do I extract just one frame from a GIF?",
    a: "Drop the GIF in, click the single frame you want in the grid, and download. One selected frame saves directly as its own file - no zip, no extracting everything first. The delay label under each thumbnail helps you find the exact moment.",
  },
  {
    q: "How many frames does a GIF have?",
    a: "Whatever its creator gave it - there is no fixed number. Most GIFs play 10 to 25 frames per second, so a three-second loop usually lands between 30 and 75 frames. The grid gives you the exact count the moment you drop a file in.",
  },
  {
    q: "Does splitting a GIF reduce quality?",
    a: "No. Splitting just reads out the frames the GIF already contains - nothing is recompressed. PNG output is lossless, and GIF output keeps the original palette. The frames you download are exactly the pixels that were in the animation.",
  },
];

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop a GIF onto the tool",
    text: "Drop a GIF onto the tool above. It is decoded on your device - the file never leaves your browser.",
  },
  {
    name: "Pick the frames you want",
    text: "The frame grid appears: every frame with its number and its delay, like #12 - 40ms. Click frames to pick a few, or hit Select all.",
  },
  {
    name: "Choose a format and download",
    text: "Choose PNG or GIF as the output, then download. One frame saves directly; several arrive as a single zip, named frame-001, frame-002, and so on in playback order.",
  },
];

export const options = makeRouteOptions("/gif-splitter", {
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
          name: "ZipGIF GIF Splitter",
          url: `${SITE}${PATH}`,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: DESCRIPTION,
          dateModified: MODIFIED,
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to split a GIF into frames",
          url: `${SITE}${PATH}`,
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }),
      },
    ],
  }),
  component: Page,
});
