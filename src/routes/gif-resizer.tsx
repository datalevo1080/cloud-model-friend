import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Resizer } from "@/components/tool/resizer";

const SITE = "https://zipgif.com";
const PATH = "/gif-resizer";
const TITLE = "GIF Resizer — Resize GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF resizer. Resize animated GIFs to exact dimensions, percentages, or platform presets — right in your browser. No uploads, no watermark.";

const STEPS = [
  {
    name: "Add your GIF",
    text: "Drop one or more GIFs onto the tool, paste from the clipboard, or paste a direct image URL. Files stay on your device.",
  },
  {
    name: "Choose a size",
    text: "Type exact pixels with the aspect lock on, pick a percentage, or hit a platform preset like Discord Emoji.",
  },
  {
    name: "Resize and download",
    text: "Press Resize GIF, compare before and after, then download the file — or grab a .zip if you resized a batch.",
  },
];

export const Route = createFileRoute("/gif-resizer")({
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
          name: "GIF Resizer",
          url: `${SITE}${PATH}`,
          description: DESCRIPTION,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          browserRequirements: "Requires a modern browser with WebAssembly support",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ZipGIF", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "GIF Resizer", item: `${SITE}${PATH}` },
          ],
        }),
      },
    ],
  }),
  component: GifResizerPage,
});

function GifResizerPage() {
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
                GIF Resizer
              </li>
            </ol>
          </nav>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">GIF Resizer</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Resize an animated GIF to exact pixels, a percentage, or a platform preset — every frame
            scaled together, animation intact.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Runs entirely in your browser · free · no watermark, no signup.
          </p>

          <div className="mt-8">
            <Resizer />
          </div>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to resize a GIF
          </h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.name} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">
                  <span className="mr-2 text-primary">{i + 1}.</span>
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cheat-sheet" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="cheat-sheet" className="text-3xl font-bold tracking-tight">
            Platform size cheat sheet
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Only limits we can point at in official platform documentation are listed here. Rows for
            other platforms are being verified and will be added once we can cite them.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Platform
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Dimensions
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Documented limit
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                    Discord emoji
                  </th>
                  <td className="py-3 pr-4">128×128</td>
                  <td className="py-3">256 KB (Discord developer docs)</td>
                </tr>
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                    Discord sticker
                  </th>
                  <td className="py-3 pr-4">320×320</td>
                  <td className="py-3">512 KB (Discord developer docs)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="vs" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="vs" className="text-3xl font-bold tracking-tight">
            Resize vs compress vs crop
          </h2>
          <p className="mt-4 leading-relaxed">
            Resizing changes how many pixels the GIF has; compressing keeps the dimensions and
            squeezes the data; cropping throws away the parts of the frame you don't want.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            If the file is still too heavy after resizing, run it through the{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              GIF compressor
            </Link>
            . If the framing is wrong rather than the size, start with the{" "}
            <Link to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
              GIF cropper
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 id="faqs" className="text-3xl font-bold tracking-tight">
            FAQs
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            More answers are coming — we're writing them from the questions people actually send us.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
