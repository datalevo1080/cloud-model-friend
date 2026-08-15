import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Splitter } from "@/components/tool/splitter";

const SITE = "https://zipgif.com";
const PATH = "/gif-splitter";
const TITLE = "GIF Splitter — Split a GIF into Frames Online Free";
const DESCRIPTION =
  "Free GIF splitter. Split an animated GIF into its individual frames, pick the ones you need, and download them as PNG or GIF. Runs in your browser, no upload.";

export const Route = createFileRoute("/gif-splitter")({
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
          name: "ZipGIF GIF Splitter",
          url: `${SITE}${PATH}`,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: GifSplitterPage,
});

function GifSplitterPage() {
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
                GIF Splitter
              </li>
            </ol>
          </nav>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">GIF Splitter</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Break an animated GIF into its individual frames and keep the ones you want.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Free, runs entirely in your browser, and never adds a watermark.
          </p>

          <div className="mt-8">
            <Splitter />
          </div>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to split a GIF into frames
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Drop one GIF on the tool above, click the frames you want in the grid, and download a
            single frame or every selected frame as a zip.
          </p>
        </section>

        <section aria-labelledby="formats" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="formats" className="text-3xl font-bold tracking-tight">
            Download frames as PNG or GIF
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            PNG gives you a plain still image for editing, while GIF keeps each frame exactly as
            Gifsicle wrote it, palette and all.
          </p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 id="faqs" className="text-3xl font-bold tracking-tight">
            FAQs
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Answers coming soon.</p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
