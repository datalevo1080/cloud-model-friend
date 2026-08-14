import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SpeedChanger } from "@/components/tool/speed-changer";

const SITE = "https://zipgif.com";
const PATH = "/gif-speed-changer";
const TITLE = "GIF Speed Changer — Speed Up or Slow Down GIFs Free";
const DESCRIPTION =
  "Free GIF speed changer. Speed up or slow down an animated GIF from 0.1x to 8x, set how it loops, and download it. Runs in your browser, no watermark.";

export const Route = createFileRoute("/gif-speed-changer")({
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
          name: "GIF Speed Changer",
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
  component: GifSpeedChangerPage,
});

function GifSpeedChangerPage() {
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
                GIF Speed Changer
              </li>
            </ol>
          </nav>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            GIF Speed Changer
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Speed up or slow down any animated GIF, from 0.1× to 8×, and choose how it loops.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Free, runs entirely in your browser, and never adds a watermark.
          </p>

          <div className="mt-8">
            <SpeedChanger />
          </div>
        </section>

        <section
          aria-labelledby="how-to"
          className="mx-auto max-w-3xl px-4 pb-10 sm:px-6"
        >
          <h2 id="how-to" className="text-2xl font-bold tracking-tight">
            How to change a GIF's speed
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Drop in one GIF, pick a speed chip or drag the slider, then press Change speed and
            download the result.
          </p>
        </section>

        <section aria-labelledby="why-skip" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="why-skip" className="text-2xl font-bold tracking-tight">
            Why very fast GIFs skip frames
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Browsers won't render frame delays under 20ms, so past a certain speed the only honest
            way to go faster is to keep every second or third frame.
          </p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <h2 id="faqs" className="text-2xl font-bold tracking-tight">
            FAQs
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">Answers coming soon.</p>
        </section>

        <section aria-labelledby="related-speed" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 id="related-speed" className="text-xl font-bold tracking-tight">
              Need a different size instead?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The{" "}
              <Link to="/gif-resizer" className="text-primary underline-offset-4 hover:underline">
                GIF resizer
              </Link>{" "}
              scales an animated GIF to exact pixels, a percentage, or a platform preset — same
              engine, same browser-only privacy.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
