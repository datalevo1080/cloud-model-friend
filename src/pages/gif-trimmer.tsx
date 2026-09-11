import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

import { Trimmer } from "@/components/tool/trimmer";

export const Page = lazyRouteComponent(() => import("./gif-trimmer.view"));

const SITE = "https://zipgif.com";
const PATH = "/gif-trimmer";
const TITLE = "GIF Trimmer — Trim and Cut GIFs Online Free";
const DESCRIPTION =
  "Free GIF trimmer. Cut an animated GIF down to the frames you want, keep the original timing, preview the range, and download it. Runs in your browser, no upload.";
const MODIFIED = "2026-08-15";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I cut a GIF?",
    a: "Drop it on the trimmer above, drag the start and end handles around the part you want, preview, and download. The kept frames keep their original timing, and the output is a normal GIF that plays everywhere. To cut the edges of the picture instead, use the GIF Cropper.",
  },
  {
    q: "How do I shorten a GIF?",
    a: "Trim frames off the start or end - drag the end handle left until the readout shows the length you want. Shortening a GIF this way also shrinks the file roughly in proportion, since every removed frame is bytes gone.",
  },
  {
    q: "How do I cut a GIF file on Windows 10?",
    a: "Right here - this tool is a website, so there is nothing to install. It runs in your browser on Windows 10, Windows 11, Mac, Linux, or a Chromebook, and the GIF never uploads: the cutting happens on your own machine.",
  },
  {
    q: "Does trimming a GIF reduce the file size?",
    a: "Yes, and almost linearly: file size tracks frame count, so keeping 30 of 60 frames lands near half the original size. It is the only size reduction that costs zero quality on the frames you keep - compression trades quality for bytes, trimming just removes time.",
  },
  {
    q: "Can I cut a section out of the middle of a GIF?",
    a: "Not in one pass - this tool keeps one continuous range from start frame to end frame. To drop a middle chunk, trim the first half, trim the second half, and you have two clean GIFs. Stitching them back together is a job for a future tool.",
  },
  {
    q: "Why does my trimmed GIF look broken in another editor?",
    a: "It is almost never your GIF - some editors mishandle optimized GIFs, where frames store only changed pixels. This tool rebuilds every frame to a full image before cutting, so its output plays cleanly. If another tool's trim shows ghosting or slivers, rerun the original through this one.",
  },
];

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop a GIF onto the tool",
    text: "Drop a GIF onto the tool above. Its frames appear as a timeline strip - nothing uploads anywhere.",
  },
  {
    name: "Set the range",
    text: "Drag the start and end handles, or type frame numbers. The readout shows exactly what stays: Keeping frames 5-20 (16 of 60) - 1.6s of 6.0s.",
  },
  {
    name: "Preview and download",
    text: "Preview the kept range, then download. Each kept frame keeps its own original timing.",
  },
];

export const options = makeRouteOptions("/gif-trimmer", {
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
          name: "ZipGIF GIF Trimmer",
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
          name: "How to trim a GIF",
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
