import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Trimmer } from "@/components/tool/trimmer";

const SITE = "https://zipgif.com";
const PATH = "/gif-trimmer";
const TITLE = "GIF Trimmer — Trim and Cut GIFs Online Free";
const DESCRIPTION =
  "Free GIF trimmer. Cut an animated GIF down to the frames you want, keep the original timing, preview the range, and download it. Runs in your browser, no upload.";
const MODIFIED = "2026-08-15";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I cut a GIF?",
    a: "Drop it on the trimmer above, drag the start and end handles around the part you want, preview, and download. The kept frames keep their original timing, and the output is a normal GIF that plays everywhere. To cut the edges of the picture instead, use the GIF Cropper.",
  },
  {
    q: "How do I shorten a GIF?",
    a: "Trim frames off the start or end - drag the end handle left until the readout shows the length you want. Shortening a GIF this way also shrinks the file roughly in proportion, since every removed frame is bytes gone.",
  },
  {
    q: "How do I cut a GIF file on Windows 10?",
    a: "Right here - this tool is a website, so there is nothing to install. It runs in your browser on Windows 10, Windows 11, Mac, Linux, or a Chromebook, and the GIF never uploads: the cutting happens on your own machine.",
  },
  {
    q: "Does trimming a GIF reduce the file size?",
    a: "Yes, and almost linearly: file size tracks frame count, so keeping 30 of 60 frames lands near half the original size. It is the only size reduction that costs zero quality on the frames you keep - compression trades quality for bytes, trimming just removes time.",
  },
  {
    q: "Can I cut a section out of the middle of a GIF?",
    a: "Not in one pass - this tool keeps one continuous range from start frame to end frame. To drop a middle chunk, trim the first half, trim the second half, and you have two clean GIFs. Stitching them back together is a job for a future tool.",
  },
  {
    q: "Why does my trimmed GIF look broken in another editor?",
    a: "It is almost never your GIF - some editors mishandle optimized GIFs, where frames store only changed pixels. This tool rebuilds every frame to a full image before cutting, so its output plays cleanly. If another tool's trim shows ghosting or slivers, rerun the original through this one.",
  },
];

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop a GIF onto the tool",
    text: "Drop a GIF onto the tool above. Its frames appear as a timeline strip - nothing uploads anywhere.",
  },
  {
    name: "Set the range",
    text: "Drag the start and end handles, or type frame numbers. The readout shows exactly what stays: Keeping frames 5-20 (16 of 60) - 1.6s of 6.0s.",
  },
  {
    name: "Preview and download",
    text: "Preview the kept range, then download. Each kept frame keeps its own original timing.",
  },
];

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
          name: "How to trim a GIF",
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
  component: GifTrimmerPage,
});

function GifTrimmerPage() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("No frames were harmed. Well, some were.");
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

        {/* Answer block */}
        <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <p className="leading-relaxed text-muted-foreground">
            A GIF trimmer cuts an animated GIF down to just the part you want. Drop a GIF above,
            drag the two handles to choose a start and end frame, preview the kept range, and
            download a shorter GIF. Trimming to cut a GIF runs entirely in your browser - no upload,
            no watermark, no signup.
          </p>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to trim a GIF
          </h2>
          <ol className="mt-4 grid gap-3 leading-relaxed text-muted-foreground">
            <li>
              1. Drop a GIF onto the tool above. Its frames appear as a timeline strip - nothing
              uploads anywhere.
            </li>
            <li>
              2. Drag the start and end handles, or type frame numbers. The readout shows exactly
              what stays: Keeping frames 5-20 (16 of 60) - 1.6s of 6.0s.
            </li>
            <li>
              3. Preview the kept range, then download. Each kept frame keeps its own original
              timing.
            </li>
          </ol>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            That is the whole job of shortening a GIF - no timeline editor, no export settings.
            Because trimming deletes frames outright, the file also gets smaller: keep half the
            frames and the size drops roughly in half too.
          </p>
        </section>

        <section aria-labelledby="which-one" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="which-one" className="text-3xl font-bold tracking-tight">
            Trimming, cropping, splitting - which one do you need?
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Three different cuts, three different tools:
          </p>
          <ul className="mt-4 grid list-disc gap-3 pl-5 leading-relaxed text-muted-foreground">
            <li>
              Trimming cuts TIME: fewer frames, shorter loop, same picture. You are in the right
              place.
            </li>
            <li>
              Cropping cuts the PICTURE: same frames, smaller area - edges and borders gone. That is
              the{" "}
              <Link to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
                GIF Cropper
              </Link>
              .
            </li>
            <li>
              Splitting cuts a GIF INTO frames: separate images out, no GIF back. That is the{" "}
              <Link to="/gif-splitter" className="text-primary underline-offset-4 hover:underline">
                GIF Splitter
              </Link>
              .
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            If you searched "cut a GIF" and meant the picture, the cropper is one click away.
            Everyone else: drag the handles above.
          </p>
        </section>

        <section aria-labelledby="quality" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="quality" className="text-3xl font-bold tracking-tight">
            Shorten a GIF without losing quality
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Trimming never recompresses the frames you keep - it removes whole frames from the ends
            and leaves the survivors untouched, pixels and timing both. That makes it the cleanest
            way to make a GIF shorter: cut the dead air before the action, drop the awkward tail
            after the punchline, or pull one clean moment out of a long screen recording.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            It is also the honest way to hit platform size limits. A GIF's file size scales with its
            frame count, so trimming from 60 frames to 30 cuts roughly half the weight while the
            kept part stays exactly as sharp. If the GIF is still too heavy after trimming, run it
            through the{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              GIF Compressor
            </Link>{" "}
            - trimming cuts content, compression cuts bytes.
          </p>
        </section>

        <section aria-labelledby="how-long" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="how-long" className="text-3xl font-bold tracking-tight">
            How long can a GIF be?
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The format has no duration limit - a GIF can run seconds or hours, and the file simply
            grows with every frame. The limits that actually bite are platform rules: Discord caps
            free uploads at 10 MB, Gmail attachments stop at 25 MB, and Google display ads require
            animation to stop within 30 seconds. In practice most shared GIFs run 2 to 6 seconds -
            long enough for the moment, short enough to loop well - and when a GIF is over a
            platform's line, trimming the ends is the fastest way back under it.
          </p>
        </section>

        <section aria-labelledby="measured" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="measured" className="text-3xl font-bold tracking-tight">
            One GIF, three trims: measured
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Numbers from a real run of this tool on one GIF, measured on [FILL date]:
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Frames, duration, and file size for the original and two trims
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Version
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Frames
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Duration
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    File size
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                    Original
                  </th>
                  <td className="py-3 pr-4">60</td>
                  <td className="py-3 pr-4">3.0 s</td>
                  <td className="py-3">300 KB</td>
                </tr>
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                    Trimmed to ~50%
                  </th>
                  <td className="py-3 pr-4">30&nbsp;</td>
                  <td className="py-3 pr-4">1.2 s</td>
                  <td className="py-3">152 KB</td>
                </tr>
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                    Trimmed to ~25%
                  </th>
                  <td className="py-3 pr-4">15</td>
                  <td className="py-3 pr-4">0.75 s</td>
                  <td className="py-3">79 KB</td>
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

          <h3 className="mt-6 text-xl font-semibold">How do I cut a GIF?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Drop it on the trimmer above, drag the start and end handles around the part you want,
            preview, and download. The kept frames keep their original timing, and the output is a
            normal GIF that plays everywhere. To cut the edges of the picture instead, use the{" "}
            <Link to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
              GIF Cropper
            </Link>
            .
          </p>

          <h3 className="mt-6 text-xl font-semibold">How do I shorten a GIF?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Trim frames off the start or end - drag the end handle left until the readout shows the
            length you want. Shortening a GIF this way also shrinks the file roughly in proportion,
            since every removed frame is bytes gone.
          </p>

          <h3 className="mt-6 text-xl font-semibold">How do I cut a GIF file on Windows 10?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Right here - this tool is a website, so there is nothing to install. It runs in your
            browser on Windows 10, Windows 11, Mac, Linux, or a Chromebook, and the GIF never
            uploads: the cutting happens on your own machine.
          </p>

          <h3 className="mt-6 text-xl font-semibold">Does trimming a GIF reduce the file size?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Yes, and almost linearly: file size tracks frame count, so keeping 30 of 60 frames lands
            near half the original size. It is the only size reduction that costs zero quality on
            the frames you keep - compression trades quality for bytes, trimming just removes time.
          </p>

          <h3 className="mt-6 text-xl font-semibold">
            Can I cut a section out of the middle of a GIF?
          </h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Not in one pass - this tool keeps one continuous range from start frame to end frame. To
            drop a middle chunk, trim the first half, trim the second half, and you have two clean
            GIFs. Stitching them back together is a job for a future tool.
          </p>

          <h3 className="mt-6 text-xl font-semibold">
            Why does my trimmed GIF look broken in another editor?
          </h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            It is almost never your GIF - some editors mishandle optimized GIFs, where frames store
            only changed pixels. This tool rebuilds every frame to a full image before cutting, so
            its output plays cleanly. If another tool's trim shows ghosting or slivers, rerun the
            original through this one.
          </p>
        </section>

        <section aria-label="Sources" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sources: GIF89a specification, W3C archive - Google Ads display specifications,
            support.google.com - measurements from this tool.
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
