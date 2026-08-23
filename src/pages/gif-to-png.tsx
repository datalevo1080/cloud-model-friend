import { makeRouteOptions } from "@/i18n/route-options";
import { L } from "@/components/l";
import { useEffect } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GifToPng } from "@/components/tool/gif-to-png";

const SITE = "https://zipgif.com";
const PATH = "/gif-to-png";
const TITLE = "GIF to PNG — Convert GIF to PNG Online Free";
const DESCRIPTION =
  "Convert GIF to PNG in your browser. Save the first frame as one PNG, or every frame as numbered PNGs in a zip, with transparency kept. Free, nothing uploaded.";
const MODIFIED = "2026-08-16";
const UPDATED = "August 16, 2026";

const STEPS: { name: string; text: string }[] = [
  {
    name: "Drop one GIF onto the tool",
    text: "Drop a single GIF onto the tool above, or paste a direct image link. The file is decoded on your device and is never uploaded.",
  },
  {
    name: "Keep First frame or switch to All frames",
    text: "First frame is selected by default and gives you one PNG. Switch to All frames to export every frame as numbered PNGs in one zip.",
  },
  {
    name: "Convert and download",
    text: "Press Convert to PNG, then download the single PNG or the numbered zip from the results card. Frame count, dimensions, and output size are listed there.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I convert a GIF to PNG?",
    a: "Drop the GIF on this page, leave the First frame option selected, press Convert to PNG, and download the image. The conversion runs in your browser, so the file is never uploaded. Switch to All frames if you want every frame instead of one.",
  },
  {
    q: "Can I save every frame of a GIF as a PNG?",
    a: "Yes. Choose All frames and the tool exports frame-001.png, frame-002.png and so on, in playback order, packed into a single zip. A 60-frame test animation produced a 123 KB zip in 0.2 seconds. Nothing is recompressed on the way out.",
  },
  {
    q: "How to turn a GIF into a sticker?",
    a: "Export one frame as a PNG, crop it to the subject, and upload it wherever stickers are accepted. Check the size cap first: Discord caps emoji at 256 KB and stickers at 512 KB. Simple graphic frames land far under both, often only a couple of kilobytes.",
  },
  {
    q: "Does GIF to PNG keep transparency?",
    a: "Yes. GIF marks one palette entry as transparent, on or off per pixel, and those pixels stay transparent in the PNG. No white box appears behind the image. PNG can store softer alpha than GIF ever recorded, so nothing is lost in the move.",
  },
  {
    q: "Why is my PNG bigger than the GIF?",
    a: "PNG is lossless and stores one full image, while a GIF spreads its data across frames and reuses a 256-color palette. A photographic frame from a 1,488 KB GIF came out as a 78 KB PNG, about 60 KB inside the GIF. Detail costs bytes.",
  },
  {
    q: "What is a PNG sequence?",
    a: "A PNG sequence is a folder of numbered still images, one per frame, in playback order. Video editors and animation tools import them directly as footage. Choosing All frames here gives you exactly that: frame-001.png onward, zipped, ready to import.",
  },
];

const MEASURED: { input: string; output: string; size: string; time: string }[] = [
  {
    input: "test-animation.gif, 400x300, 60 frames, 300 KB",
    output: "First frame PNG",
    size: "2 KB",
    time: "under 0.1 s",
  },
  {
    input: "photo-style.gif, 480x360, 25 frames, 1,488 KB (about 60 KB per stored frame)",
    output: "First frame PNG",
    size: "78 KB",
    time: "under 0.1 s",
  },
  {
    input: "test-animation.gif, all 60 frames",
    output: "Numbered PNG zip",
    size: "123 KB",
    time: "0.2 s",
  },
];

export const options = makeRouteOptions("/gif-to-png", {
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
          dateModified: MODIFIED,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to convert GIF to PNG",
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
  component: GifToPngPage,
});

function GifToPngPage() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Every GIF is a stack of PNGs in a trench coat.");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <L to="/" className="hover:text-foreground">
                  ZipGIF
                </L>
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

          <p className="mt-8 max-w-3xl leading-relaxed">
            Drop a GIF and this gif to png converter hands back the first frame as a PNG right away,
            or switches to every frame as numbered PNGs in a zip. Transparency is kept, PNG output
            is lossless, and the conversion runs in your browser for free — convert gif to png
            without an upload or an account.
          </p>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to convert GIF to PNG
          </h2>
          <p className="mt-4 leading-relaxed">
            Three steps. Drop the .gif to png in, pick first frame or all frames, download. A
            60-frame animation finished in under a second on the test machine, and the file never
            travels anywhere.
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

        <section aria-labelledby="frames" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="frames" className="text-3xl font-bold tracking-tight">
            First frame or every frame
          </h2>
          <p className="mt-4 leading-relaxed">
            First frame is the default because that is what most people want: a still thumbnail, a
            poster image, a starting point for an edit. All frames turns the same gif into png files
            named frame-001.png onward, in playback order, packed as one zip. That is a PNG
            sequence, and video editors accept it as footage.
          </p>
          <p className="mt-4 leading-relaxed">
            There is a technical step behind that promise. Most GIFs are optimized, meaning later
            frames store only the pixels that changed. Export those raw and you get broken slivers
            on a transparent field. This tool rebuilds every frame into a full image before writing
            the PNG, so a gif to png sequence looks like the animation did, frame for frame.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>First frame: one PNG, named after the source file.</li>
            <li>All frames: numbered PNGs in a single zip, playback order preserved.</li>
            <li>Frame count, dimensions, and output size are shown before you download.</li>
          </ul>
          <p className="mt-4 leading-relaxed">
            To eyeball each frame and pick exact ones from a visual grid instead, use the{" "}
            <L to="/gif-splitter" className="text-primary underline-offset-4 hover:underline">
              GIF Splitter
            </L>
            .
          </p>
        </section>

        <section aria-labelledby="transparency" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="transparency" className="text-3xl font-bold tracking-tight">
            Transparency and file size, honestly
          </h2>
          <p className="mt-4 leading-relaxed">
            Transparency carries over cleanly. GIF marks pixels transparent on an on/off basis, and
            those exact pixels stay transparent in the PNG — no checkerboard, no white box, no
            halo added. PNG supports 256 levels of alpha, far more than the GIF recorded, so
            converting an animated gif to png can only preserve what was there.
          </p>
          <p className="mt-4 leading-relaxed">
            Size moves in both directions, which surprises people. PNG is lossless and stores one
            complete image, so a photographic frame can weigh more as a PNG than it did inside the
            GIF: row 2 of the measured table shows a 78 KB PNG from a frame that occupied about 60
            KB. Row 1 shows the opposite — a simple graphic frame from a 300 KB GIF came out at 2
            KB.
          </p>
        </section>

        <section aria-labelledby="stickers" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="stickers" className="text-3xl font-bold tracking-tight">
            Stickers, naming, and pronunciation
          </h2>
          <p className="mt-4 leading-relaxed">
            Turning a gif to image assets for chat apps is a one-frame job. Export the frame that
            reads best on its own, crop it tight to the subject, and check the cap before uploading:
            Discord caps emoji at 256 KB and stickers at 512 KB. A flat graphic frame lands at a few
            kilobytes, well inside both limits.
          </p>
          <p className="mt-4 leading-relaxed">
            Naming matters once you have more than three files. Single exports keep the source file
            name, and batch exports use frame-001.png onward so sorting by name matches playback
            order in every operating system. Rename the folder, not the files, if you plan to import
            the gif to pictures as a sequence later.
          </p>
          <p className="mt-4 leading-relaxed">
            And for anyone who searched jiff to png: same format, either pronunciation works, the
            tool is not listening.
          </p>
        </section>

        <section aria-labelledby="measured" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 id="measured" className="text-3xl font-bold tracking-tight">
            GIF to PNG: measured
          </h2>
          <p className="mt-4 leading-relaxed">
            Real runs of this tool at default settings, measured on August 15, 2026. Two single-frame
            exports and one full-sequence export, with the output size and the time each took.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Input GIF, PNG output, size, and time measured with this tool
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Input GIF
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Output
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    PNG size
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {MEASURED.map((row) => (
                  <tr key={`${row.input}-${row.output}`} className="border-b border-border">
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
            The gap between rows 1 and 2 is the whole story: a simple frame becomes a 2 KB PNG,
            while a photographic frame of similar dimensions becomes a 78 KB PNG.
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
              Build a GIF out of still images with the PNG to GIF converter.
            </p>
            <L
              to="/png-to-gif"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Open the PNG to GIF converter
            </L>
          </div>
        </section>

        <section aria-label="Sources" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sources: GIF89a specification, W3C - PNG specification, W3C - Discord developer
            documentation - measurements from this tool.
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
