import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GifToPng } from "@/components/tool/gif-to-png";

const SITE = "https://zipgif.com";
const PATH = "/gif-to-png";
const TITLE = "GIF to PNG — Convert GIF to PNG Online Free";
const DESCRIPTION =
  "Convert a GIF to PNG in your browser. Export the first frame as a single PNG, or every frame as numbered PNGs in one zip, with transparency kept intact.";

export const Route = createFileRoute("/gif-to-png")({
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
          name: "GIF to PNG Converter",
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
  component: GifToPngPage,
});

function GifToPngPage() {
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
                GIF to PNG
              </li>
            </ol>
          </nav>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            GIF to PNG Converter
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Export the first frame as a single PNG, or every frame as numbered PNGs in one zip.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Runs entirely in your browser · free · no watermark, no signup.
          </p>

          <div className="mt-8">
            <GifToPng />
          </div>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to convert GIF to PNG
          </h2>
          <p className="mt-4 leading-relaxed">
            Drop one GIF onto the tool above, press Convert to PNG, and download the result.
          </p>
        </section>

        <section aria-labelledby="which-frames" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="which-frames" className="text-3xl font-bold tracking-tight">
            First frame or every frame
          </h2>
          <p className="mt-4 leading-relaxed">
            First frame gives you one PNG for a thumbnail or a static replacement; all frames gives
            you a zip numbered in playback order.
          </p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="faqs" className="text-3xl font-bold tracking-tight">
            FAQs
          </h2>
          <p className="mt-4 leading-relaxed">
            Every frame is rebuilt into a full image before export, so transparency is kept and no
            frame comes out as a partial sliver.
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Need the other direction?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Build a GIF out of still images with the PNG to GIF converter.
            </p>
            <Link
              to="/png-to-gif"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Open the PNG to GIF converter
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
