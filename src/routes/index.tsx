import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Check,
  Cpu,
  Download,
  Gauge,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Compressor } from "@/components/tool/compressor";
import { Faq, faqs } from "@/components/faq";

const SITE = "https://zipgif.com";
const TITLE = "GIF Compressor — Compress GIF Online Free (No Upload) | ZipGIF";
const DESCRIPTION =
  "Compress GIF files online free — up to 70% smaller in seconds. 100% private: no uploads, no watermark, no signup. AI picks the best settings for you.";
const OG_IMAGE = `${SITE}/og-image.jpg`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "ZipGIF — Every GIF tool. Zero uploads." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ZipGIF — GIF Compressor",
          url: `${SITE}/`,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any (web browser)",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "AI smart compression",
            "Target file size",
            "Batch compression",
            "100% client-side privacy",
          ],
          browserRequirements: "Requires JavaScript and WebAssembly",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
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
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "GIF Compressor", item: `${SITE}/` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ZipGIF",
          url: `${SITE}/`,
          logo: OG_IMAGE,
        }),
      },
    ],
  }),
  component: Index,
});

const badges = ["No uploads", "No watermark", "No signup", "Unlimited & free"];

const steps = [
  {
    icon: Upload,
    title: "Add your GIF",
    body: "Drag and drop, click to browse, or paste from your clipboard. Up to 20 GIFs at once, 200 MB each — nothing is uploaded anywhere.",
  },
  {
    icon: Sparkles,
    title: "Let Smart Compress choose",
    body: "ZipGIF measures motion, palette density and duplicate frames on your device, then picks the strongest settings that still look good. Or open Advanced settings and drive it yourself.",
  },
  {
    icon: Download,
    title: "Compare and download",
    body: "Drag the before/after slider to check quality, see exactly how much you saved, then download a single GIF or a .zip of the whole batch.",
  },
];

const features = [
  {
    icon: Lock,
    title: "Nothing ever leaves your device",
    body: "Compression runs on WebAssembly inside your browser tab. There is no server, no upload, and no copy of your GIF anywhere but your own disk.",
  },
  {
    icon: Cpu,
    title: "Real Gifsicle, not a re-encode",
    body: "ZipGIF ships the same Gifsicle engine trusted by developers for decades, compiled to WebAssembly — so the output is a properly optimized GIF.",
  },
  {
    icon: Sparkles,
    title: "Smart Compress",
    body: "Frame-by-frame analysis detects duplicate frames, flat palettes and motion levels, then explains exactly which settings it picked and why.",
  },
  {
    icon: Gauge,
    title: "Target file size",
    body: "Need it under 256 KB for Discord or 1 MB for email? ZipGIF runs iterative passes until the output fits your limit.",
  },
  {
    icon: Layers,
    title: "Batch of 20",
    body: "Queue up to 20 GIFs, watch per-file progress, then grab everything at once as a .zip archive.",
  },
  {
    icon: ShieldCheck,
    title: "Free, forever, unbranded",
    body: "No account, no credits, no watermark and no daily cap. Your compressed GIF is exactly your GIF, only smaller.",
  },
];

const comparison = [
  { label: "Files uploaded to a server", zip: false, other: true },
  { label: "Works offline after first load", zip: true, other: false },
  { label: "Watermark on output", zip: false, other: true },
  { label: "Signup or email required", zip: false, other: true },
  { label: "Daily limits or file caps under 100 MB", zip: false, other: true },
  { label: "Automatic settings based on real frame analysis", zip: true, other: false },
  { label: "Target file size mode", zip: true, other: false },
  { label: "Batch download as .zip", zip: true, other: false },
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-primary)_0%,transparent_70%)] opacity-[0.13]"
          />
          <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6 sm:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Zap className="size-3.5 text-primary" aria-hidden="true" />
                Every GIF tool. Zero uploads.
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                GIF Compressor — <span className="gradient-text">Compress GIFs Online Free</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
                Shrink GIF file size by up to 70% in seconds. 100% private — your files never leave
                your device.
              </p>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {badges.map((b) => (
                  <li key={b} className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="size-4 text-success" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
              <Compressor />
            </div>
          </div>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="how-to" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            How to compress a GIF
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="features" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="features" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Built for people who care about their GIFs
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article key={f.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="compare" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 id="compare" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            ZipGIF vs typical online compressors
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Feature comparison between ZipGIF and typical server-based GIF compressors
              </caption>
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Feature
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-primary">
                    ZipGIF
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-muted-foreground">
                    Typical compressor
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 font-normal">
                      {row.label}
                    </th>
                    <td className="px-4 py-3">
                      <Mark yes={row.zip} />
                    </td>
                    <td className="px-4 py-3">
                      <Mark yes={row.other} muted />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="learn" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 id="learn" className="text-3xl font-bold tracking-tight sm:text-4xl">
              How GIF compression works
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
              <p>
                A GIF is not a video. It is a container of still images — frames — stacked in
                sequence, each one drawn from a colour palette of at most 256 entries, and each one
                squeezed with a lossless algorithm called LZW. That design dates back to 1987, and
                almost everything that makes GIFs large today is a consequence of it. Modern codecs
                like H.264 or AV1 describe motion mathematically: they store how blocks of pixels
                move between frames. GIF cannot do that. It can only store pixels. So a five-second
                screen recording that would be 300 KB as an MP4 can easily be 12 MB as a GIF.
              </p>
              <h3 className="text-xl font-semibold text-foreground">Frames and the palette</h3>
              <p>
                Every frame in a GIF references a palette: either one global palette shared by the
                whole file, or a local palette attached to that single frame. Local palettes give
                better colour fidelity but cost bytes. Reducing the number of colours — from 256
                down to 128, 64 or 32 — shrinks both the palette tables and, more importantly, the
                data each frame has to encode, because fewer distinct colours means longer runs of
                repeated values for LZW to collapse. Flat illustrations, logos, UI recordings and
                line art often look identical at 64 colours and can lose 40% of their file size.
                Photographic or heavily dithered GIFs, on the other hand, band badly when you push
                the palette too far.
              </p>
              <h3 className="text-xl font-semibold text-foreground">Transparency optimization</h3>
              <p>
                The single most effective lossless trick is inter-frame transparency. If two
                consecutive frames share most of their pixels — which is nearly always true for a
                talking head, a screen recording, or a looping animation with a static background —
                the second frame only needs to store the pixels that actually changed. Everything
                else becomes transparent and the previous frame shows through. Gifsicle's{" "}
                <code className="rounded bg-background px-1 py-0.5 text-xs">-O3</code>{" "}
                optimization does exactly this: it computes the minimal rectangle of change per
                frame and marks the rest transparent. It removes no information at all, yet often
                cuts a naive GIF export in half.
              </p>
              <h3 className="text-xl font-semibold text-foreground">Lossy LZW</h3>
              <p>
                LZW compression works best when the same byte sequences repeat. Lossy GIF
                compression exploits that by allowing each pixel to shift to a nearby palette
                colour when doing so creates a longer repeated run. The strength value — 5 to 200
                in ZipGIF — controls how far a pixel is allowed to drift. At low values the change
                is invisible. At high values you start to see faint noise in smooth gradients, but
                the savings can be dramatic: 60 to 80% is common on video-derived GIFs. The key
                insight is that the acceptable strength depends on the content. Fast motion hides
                artifacts, because no single frame is on screen long enough to inspect. A static
                logo with crisp edges shows them immediately. That is precisely the judgement Smart
                Compress automates.
              </p>
              <h3 className="text-xl font-semibold text-foreground">Frames you do not need</h3>
              <p>
                Many GIFs contain frames that are byte-for-byte, or near enough, identical to the
                frame before them. Exporters produce these when a source video holds still, or when
                a recording captures at a fixed rate while nothing happens on screen. Removing a
                duplicate frame and extending the delay of the one before it is completely
                invisible to the viewer and pure profit in file size. When there are no duplicates
                but the GIF runs at a high frame rate over many frames, dropping every second frame
                and doubling the delay halves the frame data at a modest cost in smoothness — a
                trade most people accept for a chat attachment or a README animation.
              </p>
              <h3 className="text-xl font-semibold text-foreground">What Smart Compress measures</h3>
              <p>
                Before touching a single byte, ZipGIF decodes your GIF in a background worker and
                measures four things. Motion average: the share of pixels that change between
                consecutive frames. Motion variance: how uneven that change is across the
                animation. Palette density: how many distinct colours the frames actually use
                relative to the 256 available. And duplicate share: how many frames are
                near-identical to their predecessor. Those four numbers map directly onto the four
                levers above — lossy strength, colour count, transparency optimization and frame
                dropping — which is why the explanation chip can tell you not just what it chose,
                but the measurement that drove the choice.
              </p>
              <h3 className="text-xl font-semibold text-foreground">Hitting a specific size</h3>
              <p>
                Platforms impose hard limits: 256 KB for a Discord emoji, 15 MB for a Twitter GIF,
                whatever your mail server allows for an attachment. There is no formula that turns
                a target size into a lossy value, because the relationship depends entirely on the
                content. The practical approach is search: compress, measure, adjust, repeat.
                ZipGIF binary-searches the lossy range, narrowing in on the highest quality setting
                whose output still fits under your limit, and falls back to palette reduction when
                lossy alone cannot get there. Because everything runs locally, those repeated
                passes cost you nothing but a few seconds of CPU.
              </p>
              <h3 className="text-xl font-semibold text-foreground">When not to use a GIF</h3>
              <p>
                It is worth saying plainly: if your destination supports MP4, WebM or animated WebP,
                those formats will beat an optimized GIF by an order of magnitude. GIF survives
                because it plays everywhere, autoplays silently, and pastes into places video
                cannot. Compression is about making that compatibility affordable — getting the
                file small enough to send, embed or upload without giving up the one thing GIF is
                still uniquely good at.
              </p>
            </div>
          </div>
        </section>

        <Faq />
      </main>

      <SiteFooter />
    </div>
  );
}

function Mark({ yes }: { yes: boolean; muted?: boolean }) {
  return yes ? (
    <span className="inline-flex items-center gap-1.5 font-medium text-success">
      <Check className="size-4" aria-hidden="true" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
      <X className="size-4" aria-hidden="true" />
      No
    </span>
  );
}
