import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PngToGif } from "@/components/tool/png-to-gif";

const SITE = "https://zipgif.com";
const PATH = "/png-to-gif";
const TITLE = "PNG to GIF — Convert PNG to GIF Online Free";
const DESCRIPTION =
  "Convert PNG, JPG, or WebP images to a GIF in your browser. Turn one image into a still GIF or several into an animation with your own frame delay and loop count.";

export const Route = createFileRoute("/png-to-gif")({
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
          name: "PNG to GIF Converter",
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
  component: PngToGifPage,
});

function PngToGifPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-foreground">
                  ZipGIF
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                PNG to GIF
              </li>
            </ol>
          </nav>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            PNG to GIF Converter
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Turn one image into a still GIF, or several into an animation — with your own frame
            delay and loop setting.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Runs entirely in your browser · free · no watermark, no signup.
          </p>

          <div className="mt-8">
            <PngToGif />
          </div>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to convert PNG to GIF
          </h2>
          <p className="mt-4 leading-relaxed">
            Drop your PNG onto the tool above, press Convert to GIF, and download the file.
          </p>
        </section>

        <section aria-labelledby="animated" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="animated" className="text-3xl font-bold tracking-tight">
            Make an animated GIF from multiple PNGs
          </h2>
          <p className="mt-4 leading-relaxed">
            Add several images, drag the thumbnails into the order you want, then set the frame
            delay and how many times the GIF loops.
          </p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="faqs" className="text-3xl font-bold tracking-tight">
            FAQs
          </h2>
          <p className="mt-4 leading-relaxed">
            GIF holds 256 colors per frame and on/off transparency, so photos and soft edges shift
            slightly — everything else converts as-is.
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Need the other direction?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pull still images back out of an animation with the GIF to PNG converter.
            </p>
            <Link
              to="/gif-to-png"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Open the GIF to PNG converter
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
