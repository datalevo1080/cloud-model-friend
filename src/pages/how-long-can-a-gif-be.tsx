import { lazyRouteComponent } from "@tanstack/react-router";

export const Page = lazyRouteComponent(() => import("./how-long-can-a-gif-be.view"));

const SITE = "https://zipgif.com";
const PATH = "/blog/how-long-can-a-gif-be";
const URL = `${SITE}${PATH}`;
const IMAGE = `${SITE}/og-how-long-can-a-gif-be.jpg`;
const TITLE = "How Long Can a GIF Be? Duration, Loops and Upload Limits";
const DESCRIPTION =
  "Learn how long a GIF can be, how frame delays and loops affect duration, and when trimming, compression or video is the better choice.";
export const PUBLISHED = "2026-10-03";

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
      { property: "og:image:alt", content: "How long can a GIF be? ZipGIF guide" },
      { property: "article:published_time", content: PUBLISHED },
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
          "@type": "BlogPosting",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: URL,
          image: [IMAGE, `${SITE}/blog/gif-loop-timeline.svg`],
          author: { "@type": "Person", name: "Shafiullah Tareen", url: `${SITE}/about` },
          publisher: { "@type": "Organization", name: "ZipGIF", url: SITE },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
            { "@type": "ListItem", position: 3, name: TITLE, item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
};
