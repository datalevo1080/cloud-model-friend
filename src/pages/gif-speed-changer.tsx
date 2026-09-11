import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./gif-speed-changer.view"));

const SITE = "https://zipgif.com";
const PATH = "/gif-speed-changer";
const TITLE = "GIF Speed Changer — Speed Up or Slow Down GIFs Free";
const DESCRIPTION =
  "Free GIF speed changer. Speed up or slow down an animated GIF from 0.1x to 8x, set how it loops, and download it. Runs in your browser, no watermark.";
const MODIFIED = "2026-08-15";
const GOOGLE_ADS_SPECS = "https://support.google.com/google-ads/answer/1722096";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How to slow down a GIF",
    a: "Open the speed changer, drop the GIF in, and pick anything under 1x — 0.5x is half speed, 0.25x is quarter speed. Every frame's delay is multiplied, no frames are removed, and the preview shows the new loop time before you download. Slowing down never triggers frame-skipping.",
  },
  {
    q: "How to speed up a GIF",
    a: "Drop the GIF in and pick anything above 1x, or drag the slider up to 8x. Delays shrink proportionally; if they'd fall under the 20ms browser floor, the tool drops frames evenly to reach your speed legally. The readout shows the old and new loop time before you commit.",
  },
  {
    q: "How many FPS are GIFs?",
    a: "There's no standard — each frame carries its own delay. Most GIFs in the wild run between 10 and 25fps. The format writes delays in whole hundredths of a second and browsers ignore anything under 20ms, so 50fps is the effective maximum a GIF can play in a browser.",
  },
  {
    q: "What frame rate for GIFs for web banners?",
    a: "Slower than you'd think. Google's display ad specs require animated GIF ads to run slower than 5 FPS, stop animating within 30 seconds, and stay at or under 150 KB. Slow the GIF until one loop fits those limits, and if weight is the problem, run it through the GIF Compressor.",
  },
  {
    q: "Can you pause a GIF?",
    a: "Not really — the format has no pause button; a GIF plays its frames and loops. The closest moves: set the loop to play once so it stops on the last frame, or slow it dramatically so the frame you care about hangs around long enough to read.",
  },
  {
    q: "Why does my GIF still play slowly after speeding it up?",
    a: "Almost always the 20ms floor. If the frames were already short, halving their delays pushed them under 20ms, and browsers replace those with roughly 100ms — slower than what you started with. Rerun it here: this tool detects the floor and drops frames instead, so the speed you pick is the speed you get.",
  },
];

export const options = makeRouteOptions("/gif-speed-changer", {
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
          name: "GIF Speed Changer",
          url: `${SITE}${PATH}`,
          description: DESCRIPTION,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          browserRequirements: "Requires a modern browser with WebAssembly support",
          dateModified: MODIFIED,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
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
          name: "How to change a GIF's speed",
          url: `${SITE}${PATH}`,
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Drop a GIF onto the tool",
              text: "Drop a GIF onto the tool above. Processing happens on your device — the file never uploads anywhere.",
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Pick a speed",
              text: "Pick a preset from 0.25x to 4x, or drag the slider anywhere between 0.1x and 8x. The readout shows the loop time before and after — say, 3.2s to 1.6s.",
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Preview and download",
              text: "Preview the new timing, then download. Same pixels, same colors, new clock.",
            },
          ],
        }),
      },
    ],
  }),
  component: Page,
});
