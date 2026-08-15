import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Trimmer } from "@/components/tool/trimmer";

const SITE = "https://zipgif.com";
const PATH = "/gif-trimmer";
const TITLE = "GIF Trimmer — Trim and Cut GIFs Online Free";
const DESCRIPTION =
  "Free GIF trimmer. Cut an animated GIF down to the frames you want, keep the original timing, preview the range, and download it. Runs in your browser, no upload.";

export const Route = createFileRoute("/gif-trimmer")({
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
          name: "ZipGIF GIF Trimmer",
          url: `${SITE}${PATH}`,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: GifTrimmerPage,
});

function GifTrimmerPage() {
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
                GIF Trimmer
              </li>
            </ol>
          </nav>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">GIF Trimmer</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Cut a GIF's timeline down to the frames you actually want to keep.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Free, runs entirely in your browser, and never adds a watermark.
          </p>

          <div className="mt-8">
            <Trimmer />
          </div>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to trim a GIF
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Drop one GIF on the tool above, set the start and end frame, watch the preview play only
            that range, then download it with the original timing intact.
          </p>
        </section>

        <section aria-labelledby="vs" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="vs" className="text-3xl font-bold tracking-tight">
            Trimming vs cropping vs splitting
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Trimming cuts the timeline, {" "}
            <Link to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
              cropping
            </Link>{" "}
            cuts the frame area, and{" "}
            <Link to="/gif-splitter" className="text-primary underline-offset-4 hover:underline">
              splitting
            </Link>{" "}
            hands you every frame as its own image.
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
