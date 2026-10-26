import { lazyRouteComponent } from "@tanstack/react-router";
import { makeRouteOptions } from "@/i18n/route-options";

export const Page = lazyRouteComponent(() => import("./contact.view"));

export const options = makeRouteOptions("/contact", {
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Contact ZipGIF — Feedback, Bugs and Feature Requests" },
      {
        name: "description",
        content:
          "Get in touch about bugs, feature requests, or questions on ZipGIF's client-side, no-upload GIF tools. Email Shafiullah Tareen directly.",
      },
      { property: "og:title", content: "Contact ZipGIF" },
      {
        property: "og:description",
        content: "Report a bug or request a feature for ZipGIF's browser-based GIF tools.",
      },
      { property: "og:type", content: "website" },
\1      { name: \"twitter:image\", content: \"https://zipgif.com/og-image.jpg\" },\n\1      { property: \"og:image\", content: \"https://zipgif.com/og-image.jpg\" },\n      { property: \"og:image:alt\", content: \"ZipGIF — free online GIF tools\" },\n    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/contact" }],
  }),
  component: Page,
});
