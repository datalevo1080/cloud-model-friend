import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./terms.view"));

export const options = makeRouteOptions("/terms", {
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Terms of Use — ZipGIF Free GIF Compressor" },
      {
        name: "description",
        content:
          "Plain-language terms for using ZipGIF, the free browser-based GIF compressor that never uploads your files.",
      },
      { property: "og:title", content: "Terms of Use — ZipGIF" },
      {
        property: "og:description",
        content: "Plain-language terms for the free, client-side ZipGIF compressor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://zipgif.com/og-image.jpg" },
      { property: "og:url", content: "https://zipgif.com/terms" },
      { property: "og:image", content: "https://zipgif.com/og-image.jpg" },
      { property: "og:image:alt", content: "ZipGIF — free online GIF tools" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/terms" }],
  }),
  component: Page,
});
