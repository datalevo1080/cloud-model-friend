import { makeRouteOptions } from "@/i18n/route-options";
import { L } from "@/components/l";
import { useEffect } from "react";

import {
  ArrowRight,
  Crop,
  Gauge,
  Images,
  Maximize2,
  Scissors,
  ShieldCheck,
  Sparkles,
  Split,
  Timer,
  Wand2,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/home/reveal";
import { CompressionDemo } from "@/components/home/compression-demo";
import { ScrollFilm } from "@/components/home/scroll-film";
import { DrawLine } from "@/components/home/draw-line";

const SITE = "https://zipgif.com";
const TITLE = "ZipGIF — Free Online GIF Tools That Never Upload Your Files";
const DESCRIPTION =
  "Compress, crop, resize, speed up, split, trim and convert GIFs online for free. Every ZipGIF tool runs in your browser, with no uploads, no watermark and no signup.";
const OG_IMAGE = `${SITE}/og-image.jpg`;
const LAST_UPDATED = "August 16, 2026";

const tools = [
  {
    icon: Zap,
    name: "GIF Compressor",
    href: "/gif-compressor" as const,
    blurb: "Cut file size by up to 70% with smart lossy settings or an exact target size.",
    tag: "Most used",
  },
  {
    icon: Crop,
    name: "GIF Cropper",
    href: "/gif-cropper" as const,
    blurb: "Drag a crop box, snap to presets, and cut every frame at once.",
  },
  {
    icon: Maximize2,
    name: "GIF Resizer",
    href: "/gif-resizer" as const,
    blurb: "Scale to exact pixels, a percentage, or a platform preset like a Twitch emote.",
  },
  {
    icon: Gauge,
    name: "GIF Speed Changer",
    href: "/gif-speed-changer" as const,
    blurb: "Speed up or slow down a GIF from 0.25x to 4x and set how it loops.",
  },
  {
    icon: Split,
    name: "GIF Splitter",
    href: "/gif-splitter" as const,
    blurb: "Explode a GIF into every frame and download them as PNGs in one zip.",
  },
  {
    icon: Scissors,
    name: "GIF Trimmer",
    href: "/gif-trimmer" as const,
    blurb: "Pick a start and end point on a visual timeline and keep only that part.",
  },
  {
    icon: Images,
    name: "PNG to GIF",
    href: "/png-to-gif" as const,
    blurb: "Turn one image into a GIF, or several into an animation with your own delay.",
  },
  {
    icon: Sparkles,
    name: "GIF to PNG",
    href: "/gif-to-png" as const,
    blurb: "Pull the first frame, or every frame, out of a GIF as clean PNG files.",
  },
];

const steps = [
  {
    n: "01",
    title: "Drop the file in",
    body: "Drag a GIF onto the tool, paste it from your clipboard, or point it at an image URL. It loads straight into the page.",
  },
  {
    n: "02",
    title: "The work happens here",
    body: "A WebAssembly build of Gifsicle runs inside a Web Worker on your own machine. Nothing is sent anywhere, so nothing waits on a queue.",
  },
  {
    n: "03",
    title: "Compare, then download",
    body: "Drag the before and after divider, check the numbers, and save the result. Batches come back as a single zip.",
  },
];

const proof = [
  { value: "0", label: "Bytes uploaded" },
  { value: "70%", label: "Typical size cut" },
  { value: "20", label: "GIFs per batch" },
  { value: "8", label: "Free tools" },
];

const objections = [
  {
    q: "Free tools usually mean a watermark.",
    a: "There is no watermark and no export limit here. The engine writes a plain GIF, byte for byte the format you started with.",
  },
  {
    q: "I cannot send client work to a random website.",
    a: "You are not sending it anywhere. Open the network tab while you compress: the only requests are for the page itself and the engine file.",
  },
  {
    q: "Browser tools are slow.",
    a: "A 5 MB GIF finishes in a couple of seconds on a laptop. Nothing waits in a queue behind other people's files.",
  },
];

const faqs = [
  {
    q: "Is ZipGIF really free?",
    a: "Yes. Every tool is free with no signup, no watermark, and no daily cap. The processing runs on your computer, so there are no server bills to pass on to you.",
  },
  {
    q: "Do my files get uploaded to a server?",
    a: "No. ZipGIF loads a WebAssembly build of Gifsicle into your browser and does the work there. Your GIF never leaves your device, which is why the tools also work with the network switched off after the first load.",
  },
  {
    q: "How much smaller can a GIF get?",
    a: "Screen recordings and flat-colour animations usually drop 40% to 70%. Photographic GIFs give back less, often 15% to 30%, because their frames share fewer repeated colours.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes. The tools run in mobile Safari and Chrome. Very large files take longer on a phone because the work is limited by your device, not by us.",
  },
];

export const options = makeRouteOptions("/", {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "ZipGIF — free browser-based GIF tools with zero uploads",
      },
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
          "@type": "WebSite",
          name: "ZipGIF",
          url: `${SITE}/`,
          description: DESCRIPTION,
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
          founder: { "@type": "Person", name: "Shafiullah Tareen" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "ZipGIF tools",
          itemListElement: tools.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.name,
            url: `${SITE}${t.href}`,
          })),
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
    ],
  }),
  component: Home,
});

function Home() {
  useEffect(() => {
    console.log("Your GIF never made it into this console. That is the whole product.");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* ---------------- Hero: the scroll film ---------------- */}
        <section
          aria-labelledby="hero-heading"
          className="relative isolate bg-hero text-hero-foreground"
        >
          <a
            href="#tools"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
          >
            Skip the animation
          </a>

          <ScrollFilm
            intro={
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-hero-border bg-hero-elevated/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-hero-muted backdrop-blur-md">
                  <Zap className="size-3.5 text-primary" aria-hidden="true" />
                  Every GIF tool. Zero uploads.
                </span>

                <h1
                  id="hero-heading"
                  className="mt-6 text-[2.4rem] leading-[1.02] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl"
                >
                  Smaller GIFs,
                  <br />
                  <span className="gradient-text">without the upload.</span>
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-base text-hero-muted text-pretty sm:text-xl">
                  Eight GIF tools that run inside this tab. Compress, crop, resize, retime, split
                  and convert, free and without a watermark.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3.5">
                  <L
                    to="/gif-compressor"
                    className="group inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:w-auto"
                  >
                    Compress a GIF free
                    <ArrowRight
                      className="size-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </L>
                  <a
                    href="#tools"
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-hero-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Or browse all 8 tools
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </a>
                </div>

                <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-hero-muted">
                  {[
                    "0 bytes uploaded",
                    "Up to 70% smaller",
                    "Works offline after the first visit",
                  ].map((item) => (
                    <li key={item} className="inline-flex items-center gap-2">
                      <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 font-mono text-[11px] tracking-[0.24em] text-hero-muted uppercase">
                  Scroll to watch a 5 MB GIF lose four fifths of itself
                </p>
              </>
            }
          />
        </section>

        {/* ---------------- The live demo ---------------- */}
        <section
          aria-labelledby="demo-heading"
          className="relative isolate overflow-hidden bg-hero text-hero-foreground"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] zg-aurora" />
          </div>

          <div className="relative mx-auto max-w-2xl px-4 pt-20 pb-16 sm:px-6">
            <Reveal className="text-center">
              <h2 id="demo-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
                See it happen, before you commit
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-hero-muted">
                Drag the divider. Same GIF, two weights, and nothing left your device to make it
                happen.
              </p>
            </Reveal>
            <Reveal delay={140} className="mt-10 block">
              <CompressionDemo />
            </Reveal>
          </div>
        </section>



        {/* ---------------- The settle ---------------- */}
        <section className="relative overflow-hidden bg-hero text-hero-foreground">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 -top-24 size-[30rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px] zg-aurora" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.24em] text-primary uppercase">
                That was the whole journey
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
                It happens in this tab, in about two seconds.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-hero-muted text-pretty">
                No upload bar. No queue. No copy of your file sitting on a machine you have never
                heard of.
              </p>
              <L
                to="/gif-compressor"
                className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
              >
                Try it on your own GIF
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </L>
            </Reveal>
          </div>

          {/* marquee strip */}
          <div className="relative border-t border-hero-border py-4">
            <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <div className="flex shrink-0 gap-10 pr-10 zg-marquee">
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex shrink-0 gap-10 pr-10">
                    {[
                      "Discord 10 MB attachments",
                      "256 KB custom emoji",
                      "512 KB stickers",
                      "5 MB on X",
                      "README screen captures",
                      "Email signatures",
                      "Slack previews",
                      "Twitch emotes",
                    ].map((item) => (
                      <span
                        key={item}
                        className="text-sm font-medium whitespace-nowrap text-hero-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Proof numbers ---------------- */}
        <section aria-labelledby="numbers" className="border-b border-border bg-muted/30">
          <h2 id="numbers" className="sr-only">
            ZipGIF in numbers
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-4 sm:px-6">
            {proof.map((p, i) => (
              <Reveal key={p.label} delay={i * 80} className="text-center">
                <p className="font-mono text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {p.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{p.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- Tools ---------------- */}
        <section id="tools" aria-labelledby="tools-heading" className="relative scroll-mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-10 top-24 size-2 rounded-full bg-primary/60 zg-whisper"
          />
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                The toolbox
              </p>
              <h2
                id="tools-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
              >
                Eight GIF tools, one privacy rule
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                Each tool does one job properly and shares the same engine, so a GIF can move from
                trim to crop to compress without ever touching a server.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool, i) => (
                <Reveal key={tool.name} delay={(i % 4) * 70}>
                  <L
                    to={tool.href}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(50%_60%_at_50%_100%,var(--color-primary)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-20"
                    />
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <tool.icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 flex items-center gap-2 text-base font-semibold">
                      {tool.name}
                      {tool.tag && (
                        <span className="rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-success uppercase">
                          {tool.tag}
                        </span>
                      )}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {tool.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Open tool
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </L>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section aria-labelledby="how" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                How it works
              </p>
              <h2
                id="how"
                className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
              >
                Three steps, and none of them is "wait for the upload"
              </h2>
            </Reveal>

            <DrawLine className="mt-8" />

            <ol className="mt-4 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 110} as="li">
                  <div className="relative h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <span className="font-mono text-4xl font-bold text-primary/25">{s.n}</span>
                    <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Privacy ---------------- */}
        <section aria-labelledby="privacy-heading">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                Privacy by architecture
              </p>
              <h2
                id="privacy-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
              >
                We cannot look at your files, because we never get them
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Most online GIF tools take your file, process it on a machine you know nothing
                about, and hold it for a while afterwards. ZipGIF has no upload endpoint at all.
                The Gifsicle engine is compiled to WebAssembly and loaded into your browser, so
                your GIF is decoded, rewritten and saved on the same device it started on.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "No upload, no server-side storage, no retention window",
                  "No account, no email, no tracking of your file contents",
                  "Works with the network off once the page is cached",
                  "Safe for internal screen recordings and client work",
                ].map((line) => (
                  <li key={line} className="flex gap-3 text-sm">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <L
                to="/privacy"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Read the privacy policy
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </L>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-soft">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl zg-aurora"
                />
                <div className="relative space-y-4">
                  {[
                    { icon: Wand2, k: "Engine", v: "Gifsicle, compiled to WebAssembly" },
                    { icon: Timer, k: "Where it runs", v: "A Web Worker on your device" },
                    { icon: ShieldCheck, k: "Network calls with your file", v: "Zero" },
                    { icon: Gauge, k: "Batch limit", v: "20 GIFs, 200 MB each" },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4"
                    >
                      <row.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                          {row.k}
                        </p>
                        <p className="mt-0.5 text-sm font-medium">{row.v}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Objections ---------------- */}
        <section aria-labelledby="doubts" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                The fair doubts
              </p>
              <h2
                id="doubts"
                className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
              >
                What people say before they try it
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {objections.map((o, i) => (
                <Reveal key={o.q} delay={i * 90}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6">
                    <p className="text-base font-semibold text-balance">{o.q}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <Reveal>
              <h2
                id="faq-heading"
                className="text-3xl font-bold tracking-tight text-balance sm:text-4xl"
              >
                Questions people ask first
              </h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 70}>
                  <details className="group rounded-2xl border border-border bg-card p-5 transition-colors duration-300 open:border-primary/40">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                      {f.q}
                      <span
                        aria-hidden="true"
                        className="text-primary transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section
          aria-labelledby="cta-heading"
          className="relative overflow-hidden bg-hero text-hero-foreground"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 size-[34rem] -translate-x-1/2 rounded-full bg-primary/30 blur-[130px] zg-aurora" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
            <Reveal>
              <h2
                id="cta-heading"
                className="text-3xl font-bold tracking-tight text-balance sm:text-5xl"
              >
                Drop a GIF in and watch it shrink
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-hero-muted text-pretty">
                It takes a few seconds, costs nothing, and your file stays exactly where it is.
              </p>
              <L
                to="/gif-compressor"
                className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
              >
                Start compressing
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </L>
              <p className="mt-8 text-xs text-hero-muted">
                Last updated: {LAST_UPDATED} · Built and maintained by Shafiullah Tareen
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export const Page = Home;
