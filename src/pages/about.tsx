import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./about.view"));

export const options = makeRouteOptions("/about", {
  head: () => ({
    meta: [
      { title: "About ZipGIF — Browser-Based GIF Tools, Zero Uploads" },
      {
        name: "description",
        content:
          "ZipGIF compresses, crops, resizes and converts GIFs entirely in your browser with WebAssembly. Meet the maker and learn how the no-upload architecture works.",
      },
      { property: "og:title", content: "About ZipGIF — Browser-Based GIF Tools" },
      {
        property: "og:description",
        content: "How ZipGIF processes GIFs locally with WebAssembly — no servers, no uploads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/about" }],
  }),
  component: Page,
});
