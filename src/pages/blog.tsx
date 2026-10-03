import { lazyRouteComponent } from "@tanstack/react-router";

export const Page = lazyRouteComponent(() => import("./blog.view"));

const URL = "https://zipgif.com/blog";
const TITLE = "ZipGIF Blog — Practical Guides to GIF Size and Length";
const DESCRIPTION =
  "Practical ZipGIF guides about GIF duration, loops, file size and upload limits, written by the creator of ZipGIF.";

export const options = {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Page,
};
