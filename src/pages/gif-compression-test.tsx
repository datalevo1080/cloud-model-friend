import { lazyRouteComponent } from "@tanstack/react-router";

export const Page = lazyRouteComponent(() => import("./gif-compression-test.view"));

const SITE = "https://zipgif.com";
const PATH = "/research/gif-compression-test";
const URL = `${SITE}${PATH}`;
const IMAGE = `${SITE}/og-gif-compression-test.jpg`;
const TITLE = "GIF Compression Test: 16-GIF Results — ZipGIF Research";
const DESCRIPTION =
  "A small ZipGIF test of 16 GIFs found a 37.0% average file-size reduction and a 69.4% best observed reduction using Gifsicle -O3, lossy 120 and 64 colors.";
const PUBLISHED = "2026-09-21";

export const options = {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "ZipGIF GIF compression test aggregate results" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "GIF Compression Test: Results From 16 GIFs",
          description: DESCRIPTION,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: URL,
          image: IMAGE,
          author: { "@type": "Person", name: "Shafiullah Tareen" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "ZipGIF 16-GIF Compression Test Aggregate Results",
          description: DESCRIPTION,
          url: URL,
          datePublished: PUBLISHED,
          creator: { "@type": "Person", name: "Shafiullah Tareen" },
          measurementTechnique: "Gifsicle -O3 --lossy=120 --colors=64",
          variableMeasured: [
            { "@type": "PropertyValue", name: "GIFs tested", value: 16 },
            { "@type": "PropertyValue", name: "Average file-size reduction", value: 37.0, unitText: "percent" },
            { "@type": "PropertyValue", name: "Best observed file-size reduction", value: 69.4, unitText: "percent" },
          ],
        }),
      },
    ],
  }),
  component: Page,
};