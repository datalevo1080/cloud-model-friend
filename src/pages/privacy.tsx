import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./privacy.view"));

export const options = makeRouteOptions("/privacy", {
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Privacy Policy — ZipGIF Never Uploads Your Files" },
      {
        name: "description",
        content:
          "ZipGIF's privacy policy: no file uploads, no accounts, no tracking pixels. GIF compression happens entirely on your device.",
      },
      { property: "og:title", content: "Privacy Policy — ZipGIF" },
      {
        property: "og:description",
        content: "No uploads, no accounts, no tracking pixels. Your GIFs stay on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://zipgif.com/og-image.jpg" },
      { property: "og:url", content: "https://zipgif.com/privacy" },
      { property: "og:image", content: "https://zipgif.com/og-image.jpg" },
      { property: "og:image:alt", content: "ZipGIF — free online GIF tools" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/privacy" }],
  }),
  component: Page,
});
