import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Cropper } from "@/components/tool/cropper";

const SITE = "https://zipgif.com";
const PATH = "/gif-cropper";
const TITLE = "GIF Cropper — Crop GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF cropper. Crop animated GIFs right in your browser — no upload, no watermark, no signup. Aspect ratio presets and pixel-exact cropping.";
const LAST_UPDATED = "August 2026";

export const Route = createFileRoute("/gif-cropper")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
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
          name: "ZipGIF GIF Cropper",
          url: `${SITE}${PATH}`,
          description: DESCRIPTION,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          browserRequirements: "Requires a modern browser with WebAssembly support",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
        }),
      },
    ],
  }),
  component: GifCropperPage,
});

function GifCropperPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            GIF Cropper — crop GIFs without losing the animation
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Crop an animated GIF to any frame or aspect ratio, free and entirely in your browser —
            every frame stays in sync and nothing is ever uploaded.
          </p>

          <div className="mt-8">
            <Cropper />
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-xl border border-border bg-card p-4">
              Nothing is uploaded — cropping runs on your device.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              No watermark, no signup, no daily limit.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              200&nbsp;MB per GIF, as many GIFs as you like.
            </li>
          </ul>

          <p className="mt-8 max-w-2xl leading-relaxed">
            This GIF cropper cuts an animated GIF down to the region you choose and applies that
            same crop to every frame, so the animation, frame delays, loop count and transparency
            all survive intact. The whole job runs in your browser with WebAssembly — your file
            never leaves your device, and nothing is stored anywhere.
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED} — Built and maintained by Shafiullah Tareen. Need a smaller
            file too?{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              GIF compressor
            </Link>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
