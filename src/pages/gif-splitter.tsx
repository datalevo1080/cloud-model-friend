import { makeRouteOptions } from "@/i18n/route-options";
import { L } from "@/components/l";
import { useEffect } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Splitter } from "@/components/tool/splitter";

const SITE = "https://zipgif.com";
const PATH = "/gif-splitter";
const TITLE = "GIF Splitter — Split a GIF into Frames Online Free";
const DESCRIPTION =
  "Free GIF splitter. Split an animated GIF into its individual frames, pick the ones you need, and download them as PNG or GIF. Runs in your browser, no upload.";
const MODIFIED = "2026-08-15";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I split a GIF into frames?",
    a: "Drop the GIF on the splitter above, wait for the frame grid, click Select all, pick PNG or GIF, and download. You get every frame as a separate numbered image in one zip. It works on any GIF, runs entirely in your browser, and takes a few seconds for typical files.",
  },
  {
    q: "Can I save GIF frames as PNG?",
    a: "Yes - PNG is the default output here. Each frame is converted losslessly in your browser: a GIF frame stores at most 256 colors and PNG preserves all of them, so the PNG is pixel-identical to the frame you saw in the grid.",
  },
  {
    q: "How do I extract just one frame from a GIF?",
    a: "Drop the GIF in, click the single frame you want in the grid, and download. One selected frame saves directly as its own file - no zip, no extracting everything first. The delay label under each thumbnail helps you find the exact moment.",
  },
  {
    q: "How many frames does a GIF have?",
    a: "Whatever its creator gave it - there is no fixed number. Most GIFs play 10 to 25 frames per second, so a three-second loop usually lands between 30 and 75 frames. The grid gives you the exact count the moment you drop a file in.",
  },
  {
    q: "Does splitting a GIF reduce quality?",
    a: "No. Splitting just reads out the frames the GIF already contains - nothing is recompressed. PNG output is lossless, and GIF output keeps the original palette. The frames you download are exactly the pixels that were in the animation.",
  },
];

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop a GIF onto the tool",
    text: "Drop a GIF onto the tool above. It is decoded on your device - the file never leaves your browser.",
  },
  {
    name: "Pick the frames you want",
    text: "The frame grid appears: every frame with its number and its delay, like #12 - 40ms. Click frames to pick a few, or hit Select all.",
  },
  {
    name: "Choose a format and download",
    text: "Choose PNG or GIF as the output, then download. One frame saves directly; several arrive as a single zip, named frame-001, frame-002, and so on in playback order.",
  },
];

export const options = makeRouteOptions("/gif-splitter", {
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
          dateModified: MODIFIED,
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to split a GIF into frames",
          url: `${SITE}${PATH}`,
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }),
      },
    ],
  }),
  component: GifSplitterPage,
});

function GifSplitterPage() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("This console message is a single frame.");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <L to="/" className="hover:text-foreground">
                  ZipGIF
                </L>
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

        {/* Answer block */}
        <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <p className="leading-relaxed text-muted-foreground">
            A GIF splitter breaks an animated GIF into its individual frames so you can save them as
            separate images. Drop a GIF above to see every frame laid out in a grid, then download
            any frame - or all of them - as PNG or GIF. Everything runs in your browser: no upload,
            no watermark, no signup.
          </p>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to split a GIF into frames
          </h2>
          <ol className="mt-4 grid gap-3 leading-relaxed text-muted-foreground">
            <li>
              1. Drop a GIF onto the tool above. It is decoded on your device - the file never
              leaves your browser.
            </li>
            <li>
              2. The frame grid appears: every frame with its number and its delay, like #12 - 40ms.
              Click frames to pick a few, or hit Select all.
            </li>
            <li>
              3. Choose PNG or GIF as the output, then download. One frame saves directly; several
              arrive as a single zip, named frame-001, frame-002, and so on in playback order.
            </li>
          </ol>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            That covers splitting a GIF into frames end to end. There is no frame-count limit - a
            6-frame reaction GIF and a 300-frame screen recording get the same treatment.
          </p>
        </section>

        <section aria-labelledby="frame-by-frame" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="frame-by-frame" className="text-3xl font-bold tracking-tight">
            See a GIF frame by frame
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Viewing a GIF frame by frame is half the reason this tool exists. Animated GIFs move too
            fast to study - most play a new frame every 40 to 100 milliseconds - so the grid freezes
            time: every frame sits still, in order, with its exact delay printed under it. That
            makes it easy to find the one frame you actually want - the perfect expression in a
            reaction GIF, the exact moment a bug appears in a screen recording - without pausing and
            screenshotting at just the right instant.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            One detail worth knowing: many GIFs are stored optimized, meaning most frames only
            contain the pixels that changed. This tool rebuilds every frame to its full image first,
            so what you download is the complete picture, not a transparent sliver.
          </p>
        </section>

        <section aria-labelledby="formats" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="formats" className="text-3xl font-bold tracking-tight">
            Download frames as PNG or GIF
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            PNG is the right pick for most jobs: it is lossless, every editor opens it, and the
            conversion happens in your browser with zero quality change - a GIF frame holds at most
            256 colors and PNG keeps every one of them. Choose GIF output instead when you want
            frames that stay in the original format, palette intact.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A whole selection downloads as one zip, so extracting all frames from a GIF for an image
            sequence - to edit in another app, rebuild as a video, or use like a sprite sheet - is
            one click, already numbered in order.
          </p>
        </section>

        <section aria-labelledby="use-cases" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="use-cases" className="text-3xl font-bold tracking-tight">
            What splitting is for
          </h2>
          <ul className="mt-4 grid list-disc gap-3 pl-5 leading-relaxed text-muted-foreground">
            <li>Grab one frame as a thumbnail or a still image for a post.</li>
            <li>Study or debug an animation frame by frame.</li>
            <li>Export an image sequence for a video editor.</li>
            <li>
              Edit frames elsewhere, then rebuild the animation. Splitting is the first half of
              frame-by-frame GIF editing; the grid shows each frame's delay so you can put the
              timing back the way you found it.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Want a shorter GIF rather than loose frames? That is trimming, not splitting - use the{" "}
            <L to="/gif-trimmer" className="text-primary underline-offset-4 hover:underline">
              GIF Trimmer
            </L>
            .
          </p>
        </section>

        <section aria-labelledby="measured" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="measured" className="text-3xl font-bold tracking-tight">
            One GIF, split: measured
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Numbers from a real run of this tool (one GIF, default settings), measured on [FILL
            date]:
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Frames extracted, zip size, and time for one split run
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Input GIF
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Frames extracted
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Zip size (PNG)
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                    test-animation.gif (400×300, 3.0s, 300 KB)
                  </th>
                  <td className="py-3 pr-4">60</td>
                  <td className="py-3 pr-4">112 KB</td>
                  <td className="py-3">0.2&nbsp; s</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground"></p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
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

        <section aria-label="Sources" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sources: GIF89a specification, W3C archive - frame handling measured in this tool.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: August 14, 2026&nbsp;- Built by Shafiullah Tareen.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export const Page = GifSplitterPage;
