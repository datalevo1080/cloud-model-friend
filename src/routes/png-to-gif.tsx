import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PngToGif } from "@/components/tool/png-to-gif";

const SITE = "https://zipgif.com";
const PATH = "/png-to-gif";
const TITLE = "PNG to GIF — Convert PNG to GIF Online Free";
const DESCRIPTION =
  "Convert PNG to GIF in your browser. One image becomes a still GIF, several become an animated GIF with your own frame delay and loop count. Free, no signup.";
const MODIFIED = "2026-08-16";
const UPDATED = "August 16, 2026";

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop your images on the tool",
    text: "Drop one or more PNG files onto the tool above. JPG and WebP are accepted too. The files are read on your device and never uploaded.",
  },
  {
    name: "Order the frames and set the timing",
    text: "Drag the numbered thumbnails into the order you want, set the frame delay in milliseconds, and choose the loop count: forever, once, or a custom number.",
  },
  {
    name: "Convert and download the GIF",
    text: "Press Convert to GIF, check the preview in the results card, and download the file. One image gives you a still GIF; several give you an animation.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I convert PNG to GIF?",
    a: "Drop the PNG on this page, press Convert to GIF, and download the result. Nothing is uploaded, so the file stays on your machine. Add several images instead of one and they become frames of an animation, in the order you drag them, at the delay you set.",
  },
  {
    q: "Can I make an animated GIF from PNG images?",
    a: "Yes. Add two or more images and each one becomes a frame. Drag the thumbnails to fix the order, set the delay per frame, and choose whether the GIF loops forever, plays once, or repeats a set number of times. The preview plays before you download.",
  },
  {
    q: "Does converting PNG to GIF lose quality?",
    a: "Some. A PNG can hold unlimited colors and 256 levels of alpha; a GIF frame holds at most 256 colors and on/off transparency. Flat graphics, text, and line art survive untouched. Photos get their colors reduced to a 256-color palette, so gradients band slightly.",
  },
  {
    q: "How to make a transparent GIF?",
    a: "Start from a PNG that already has a transparent background. This tool keeps pixels above 50% alpha opaque and makes everything at or below 50% fully transparent, because GIF has no partial transparency. A 512x512 transparent sticker PNG of 5 KB came out as a 3 KB transparent GIF.",
  },
  {
    q: "Can I convert APNG to GIF?",
    a: "Not yet. APNG is animated PNG, a separate format from the still PNG this tool reads today, so an APNG here converts as a single frame. An APNG converter is planned. For now, export your animation as separate PNG frames and drop them in together.",
  },
];

const MEASURED: { input: string; output: string; size: string; time: string }[] = [
  {
    input: "12 PNG stills, 400x300, 26 KB total",
    output: "Animated GIF, 1.2 s loop at 100 ms per frame",
    size: "15 KB",
    time: "0.1 s",
  },
  {
    input: "1 photo-style PNG, 800x600, 1,030 KB",
    output: "Static GIF (256 colors)",
    size: "403 KB",
    time: "0.3 s",
  },
  {
    input: "1 transparent sticker PNG, 512x512, 5 KB",
    output: "Transparent GIF",
    size: "3 KB",
    time: "under 0.1 s",
  },
];

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
          dateModified: MODIFIED,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to convert PNG to GIF",
          url: `${SITE}${PATH}`,
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: PngToGifPage,
});

function PngToGifPage() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("256 colors ought to be enough for anybody.");
  }, []);

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

          <p className="mt-8 max-w-3xl leading-relaxed">
            This png to gif converter turns one PNG (or JPG, or WebP) into a single GIF, and turns
            several images into an animated GIF with a delay you choose. Convert png to gif right in
            the browser tab: the files never leave your device, there is no watermark on the output,
            and nothing costs anything.
          </p>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to convert PNG to GIF
          </h2>
          <p className="mt-4 leading-relaxed">
            Three steps, start to finish. Drop the images in, arrange them and set the timing, then
            download the GIF. The whole run happens on your device, so a batch of small stills is
            usually done before you finish reading this sentence.
          </p>
          <ol className="mt-6 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.name} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">
                  <span className="mr-2 text-primary">{i + 1}.</span>
                  {s.name}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="animated" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="animated" className="text-3xl font-bold tracking-tight">
            Make an animated GIF from PNG images
          </h2>
          <p className="mt-4 leading-relaxed">
            Several stills become frames. Add the images, drag the numbered thumbnails into playback
            order, and the tool writes them as one animation. The default delay is 100 ms per frame,
            which plays at 10 frames per second — a twelve-image png animated gif runs for 1.2
            seconds per loop.
          </p>
          <p className="mt-4 leading-relaxed">
            Timing has one quirk worth knowing. GIF stores frame delays in whole hundredths of a
            second, so 100 ms is stored exactly and an odd value like 35 ms gets rounded to the
            nearest hundredth. To animate a png set that was exported at 24 fps, use about 40 ms and
            accept a small drift; nothing you can do in any format will avoid it.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Order comes from the thumbnails, not from file names — drag until it reads right.</li>
            <li>Loop control: forever, once, or a custom repeat count.</li>
            <li>
              Mixed sizes are handled: images of different sizes are fitted inside the first image
              canvas with transparent padding, centered, never stretched.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed">
            That last rule is why the first image you add matters most. It sets the output
            dimensions for every frame that follows, so put your largest or most important image
            first when you animate png sequences of uneven size.
          </p>
        </section>

        <section aria-labelledby="quality" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="quality" className="text-3xl font-bold tracking-tight">
            What survives the conversion
          </h2>
          <p className="mt-4 leading-relaxed">
            Shape, size, and sharpness survive untouched. Color depth does not. PNG holds unlimited
            colors and 256 levels of soft transparency, while a GIF frame holds at most 256 colors
            with on/off transparency. Flat graphics, screenshots, text, and line art come through
            identical.
          </p>
          <p className="mt-4 leading-relaxed">
            Photos are the honest exception. The 800x600 photo-style PNG in the measured table
            dropped from 1,030 KB to 403 KB, a 61% cut, and that saving is paid for in color: skies
            and skin tones band where a smooth gradient was flattened into 256 steps. If your source
            is a photo and you need every shade, GIF is the wrong container and no png to gif
            conversion will change that.
          </p>
          <p className="mt-4 leading-relaxed">
            If the finished GIF is heavier than the place you want to post it allows, run it through
            the{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              GIF Compressor
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="transparency" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="transparency" className="text-3xl font-bold tracking-tight">
            Transparency: what happens to soft edges
          </h2>
          <p className="mt-4 leading-relaxed">
            A transparent PNG becomes a transparent GIF here, so the page works as a transparent gif
            maker for logos and stickers. The catch is the edges. GIF transparency is on/off per
            pixel: this tool makes pixels at or below 50% alpha fully transparent and keeps the rest
            opaque, so anti-aliased outlines and drop shadows turn hard.
          </p>
          <p className="mt-4 leading-relaxed">
            The fix takes ten seconds in any editor. Flatten soft shadows and feathered edges onto
            the background color the GIF will sit on before converting, then let the tool cut only
            the fully empty area. Hard-edged art needs nothing at all — the 5 KB sticker in the
            table came out as a clean 3 KB transparent GIF.
          </p>
          <p className="mt-4 leading-relaxed">
            One limit stated plainly: animated png to gif is not supported yet. APNG is a separate
            format from still PNG, and the apng to gif converter is the next tool being built.
          </p>
        </section>

        <section aria-labelledby="measured" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="measured" className="text-3xl font-bold tracking-tight">
            PNG to GIF: measured
          </h2>
          <p className="mt-4 leading-relaxed">
            Real runs of this tool at default settings, measured on August 15, 2026. Three inputs, a
            still set, a photo, and a transparent sticker, with the output size and the time each
            one took.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Input images, GIF output, file size, and conversion time measured with this tool
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Input
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Output
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    GIF size
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {MEASURED.map((row) => (
                  <tr key={row.input} className="border-b border-border">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                      {row.input}
                    </th>
                    <td className="py-3 pr-4">{row.output}</td>
                    <td className="py-3 pr-4">{row.size}</td>
                    <td className="py-3">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Read together, the rows show three things: stills stay tiny, photos shrink 61% but drop
            to 256 colors, and transparency survives intact.
          </p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="faqs" className="text-3xl font-bold tracking-tight">
            FAQs
          </h2>
          {FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="mt-6 text-xl font-semibold">{f.q}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
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

        <section aria-label="Sources" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sources: GIF89a specification, W3C - PNG specification, W3C - measurements from this
            tool.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {UPDATED}&nbsp;- Built by Shafiullah Tareen.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
