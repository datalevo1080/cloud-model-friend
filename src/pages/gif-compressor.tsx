import { makeRouteOptions } from "@/i18n/route-options";
import { L } from "@/components/l";
import {
  BadgeCheck,
  Cpu,
  Download,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Compressor } from "@/components/tool/compressor";
import { Faq, faqs } from "@/components/faq";

const SITE = "https://zipgif.com";
const TITLE = "GIF Compressor — Compress GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF compressor. Reduce GIF file size without losing quality — for Discord, email and the web. No signup, no watermark, nothing uploaded.";
const OG_IMAGE = `${SITE}/og-image.jpg`;
const LAST_UPDATED = "August 14, 2026";
const MODIFIED = "2026-08-12";

const howToSteps = [
  {
    icon: Upload,
    title: "Add your GIF",
    body: "Drop your GIF onto the box above, paste it from your clipboard, or click to browse — up to 20 files at once.",
  },
  {
    icon: Sparkles,
    title: "Pick your settings (or don't)",
    body: "Leave Smart Compress on to let the tool read your frames and choose, or open Advanced settings and drive the lossy slider yourself.",
  },
  {
    icon: Download,
    title: "Compare and download",
    body: "Drag the before/after divider to check quality, then download the smaller GIF or grab the whole batch as a .zip.",
  },
];

const methods = [
  {
    method: "Lossy LZW compression",
    what: "Nudges pixels toward neighbouring palette colours so the LZW encoder finds longer repeated runs.",
    saving: "15–50%",
    impact: "Invisible up to ~80. Faint noise in gradients above ~120.",
  },
  {
    method: "Colour palette reduction",
    what: "Cuts the palette from 256 colours to 128, 64 or 32, shrinking both the palette table and the frame data.",
    saving: "10–45%",
    impact: "None on flat art or UI. Banding on photographic GIFs.",
  },
  {
    method: "Transparency optimization (-O3)",
    what: "Stores only the rectangle of pixels that changed between frames and marks the rest transparent.",
    saving: "10–40%",
    impact: "None. It's completely lossless.",
  },
  {
    method: "Remove duplicate frames",
    what: "Deletes frames identical to the one before them and extends the previous frame's delay instead.",
    saving: "5–65%",
    impact: "None. The animation plays the same.",
  },
  {
    method: "Frame rate reduction",
    what: "Keeps every second or third frame and doubles or triples the delay to hold the same duration.",
    saving: "35–60%",
    impact: "Slightly choppier motion. Fine for chat and README clips.",
  },
  {
    method: "Scaling dimensions",
    what: "Lowers GIF resolution — a 1200px-wide capture rarely needs to stay 1200px in a chat window.",
    saving: "40–75%",
    impact: "Sharpness drops. Text can get mushy below 50% scale.",
  },
];

const discordLimits = [
  { thing: "Attachment (default, all users)", limit: "10 MiB", note: "Higher with Nitro or server Boost Tier" },
  { thing: "Custom emoji (static or animated)", limit: "256 KiB", note: "128×128 renders best" },
  { thing: "Sticker (PNG, APNG, GIF, Lottie)", limit: "512 KiB", note: "320×320 canvas" },
];

const socialLimits = [
  {
    where: "X (Twitter) — web upload",
    limit: "15 MB",
    target: "5 MB",
    why: "Also capped at 1280×1080 and 350 frames",
  },
  {
    where: "X (Twitter) — iOS / Android app",
    limit: "5 MB",
    target: "5 MB",
    why: "The mobile cap, and the safe number everywhere",
  },
  {
    where: "WhatsApp — photo & video in chat",
    limit: "16 MB",
    target: "12 MB",
    why: "WhatsApp re-encodes to MP4 and compresses again",
  },
  {
    where: "WhatsApp — sent as a document",
    limit: "2 GB",
    target: "No limit in practice",
    why: "No re-encode, but no inline autoplay either",
  },
  {
    where: "WhatsApp — animated sticker",
    limit: "500 KB",
    target: "500 KB",
    why: "512×512 animated WebP",
  },
];

const platformLimits = [
  {
    platform: "Discord attachment",
    limit: "10 MiB default",
    target: "8 MB",
    href: "https://discord.com/developers/docs/reference",
  },
  {
    platform: "Discord emoji",
    limit: "256 KiB",
    target: "256 KB",
    href: "https://discord.com/developers/docs/resources/emoji",
  },
  {
    platform: "Discord sticker",
    limit: "512 KiB",
    target: "512 KB",
    href: "https://discord.com/developers/docs/resources/sticker",
  },
  {
    platform: "Gmail attachment (personal)",
    limit: "25 MB",
    target: "10 MB",
    href: "https://support.google.com/mail/answer/6584",
  },
  {
    platform: "Slack file upload",
    limit: "1 GB",
    target: "2 MB for inline playback",
    href: "https://slack.com/help/articles/201330736-Add-files-to-Slack",
  },
];

const comparison = [
  { label: "Price", zip: "Free, unlimited", other: "Free tier with daily caps" },
  { label: "Watermark on output", zip: "Never", other: "Common on free tiers" },
  { label: "Signup or email", zip: "Not required", other: "Often required" },
  { label: "File size limit", zip: "200 MB per GIF", other: "Typically 5–50 MB" },
  { label: "Batch support", zip: "20 GIFs, one .zip", other: "Usually one at a time" },
  { label: "Where files are processed", zip: "Your browser", other: "Their server" },
  { label: "Exact target file size", zip: "Yes, iterative passes", other: "Rare" },
];

const study = [
  { name: "Screen recording, 800×450, 60 frames", before: "100 KB", after: "70 KB", cut: "30.4%" },
  { name: "Screen recording, 1000×560, 90 frames", before: "181 KB", after: "125 KB", cut: "31.2%" },
  { name: "Talking head, 480×480, 48 frames", before: "30 KB", after: "11 KB", cut: "62.4%" },
  { name: "Talking head, 320×320, 30 frames", before: "19 KB", after: "8 KB", cut: "60.0%" },
  { name: "Flat logo loop, 600×300, 30 frames", before: "10 KB", after: "8 KB", cut: "19.9%" },
  { name: "Flat logo loop, 900×300, 40 frames", before: "14 KB", after: "11 KB", cut: "19.6%" },
  { name: "Photographic pan, 640×360, 40 frames", before: "1.68 MB", after: "843 KB", cut: "50.9%" },
  { name: "Photographic pan, 320×180, 25 frames", before: "339 KB", after: "161 KB", cut: "52.5%" },
  { name: "Camera noise, 320×240, 30 frames", before: "881 KB", after: "584 KB", cut: "33.7%" },
  { name: "Camera noise, 480×360, 40 frames", before: "2.54 MB", after: "1.70 MB", cut: "33.0%" },
  { name: "UI capture with cursor, 900×500", before: "8 KB", after: "6 KB", cut: "28.3%" },
  { name: "UI capture with cursor, 600×340", before: "5 KB", after: "4 KB", cut: "28.0%" },
  { name: "Progress bar, 60 frames, many duplicates", before: "6 KB", after: "2 KB", cut: "69.4%" },
  { name: "Progress bar, 800×450, 72 frames", before: "7 KB", after: "2 KB", cut: "67.5%" },
  { name: "Confetti burst, 400×400, 45 frames", before: "174 KB", after: "167 KB", cut: "4.4%" },
  { name: "Confetti burst, 640×640, 60 frames", before: "285 KB", after: "275 KB", cut: "3.6%" },
];

const useCases = [
  {
    icon: Zap,
    title: "Discord and gaming chats",
    body: "The single most common reason people compress a GIF. A 14 MB clip of a clutch round won't send; the same clip at 6 MB posts instantly and still looks fine at chat size.",
  },
  {
    icon: Layers,
    title: "Email signatures and newsletters",
    body: "Mail clients are brutal about weight, and Gmail caps personal attachments at 25 MB. Keep an animated signature under 200 KB and it loads before the reader scrolls past it.",
  },
  {
    icon: Gauge,
    title: "Website speed and Core Web Vitals",
    body: "A hero GIF is often the heaviest thing on a landing page. Shrinking a 4 MB loop to 900 KB pulls your Largest Contentful Paint down on mobile connections where it actually hurts.",
  },
  {
    icon: Sparkles,
    title: "Social posts",
    body: "Platforms re-encode what you upload, and they re-encode a bloated GIF badly. Send a cleaner, smaller file and their encoder has less damage to do to your colours.",
  },
  {
    icon: Cpu,
    title: "Docs, READMEs and tutorials",
    body: "GitHub renders GIFs inline, which makes them perfect for showing a CLI flow. Drop the frame rate to 12 fps and downsize the GIF to 800px wide, and a 9 MB terminal recording lands near 2 MB.",
  },
  {
    icon: ShieldCheck,
    title: "Messaging apps and NDAs",
    body: "If the GIF shows an unreleased product or a client's dashboard, a server-side compressor is a data transfer. This one isn't — the file never leaves your laptop.",
  },
];

export const options = makeRouteOptions("/gif-compressor", {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/gif-compressor` },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "ZipGIF GIF compressor — compress GIFs online free in your browser",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/gif-compressor` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ZipGIF",
          url: `${SITE}/`,
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
          "@type": "WebApplication",
          name: "ZipGIF GIF Compressor",
          url: `${SITE}/gif-compressor`,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          dateModified: MODIFIED,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Lossy GIF compression",
            "Colour palette reduction",
            "Duplicate frame removal",
            "Exact target file size",
            "Batch of 20 GIFs",
            "Runs entirely in the browser",
          ],
          browserRequirements: "Requires JavaScript and WebAssembly",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Compress a GIF",
          totalTime: "PT1M",
          step: howToSteps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.body,
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "GIF Compressor", item: `${SITE}/gif-compressor` },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

const trustBullets = [
  "Nothing is uploaded — compression runs on your device",
  "No watermark, no signup, no daily limit",
  "200 MB per GIF, 20 GIFs per batch",
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* eslint-disable-next-line react/no-danger */}
      <div
        hidden
        dangerouslySetInnerHTML={{
          __html:
            "<!-- 256 colours ought to be enough for anybody. — the GIF spec, 1989 (paraphrased, badly) -->",
        }}
      />
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
                GIF Compressor — <span className="gradient-text">shrink GIFs without killing quality</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
                Drop a GIF in, get a much smaller one back in seconds — free, no watermark, no
                signup, and your file never leaves your device.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
              <Compressor />
            </div>

            <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {trustBullets.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="size-4 text-success" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Last updated: {LAST_UPDATED} · Built and maintained by Shafiullah Tareen
            </p>
          </div>
        </section>

        <section aria-labelledby="what-it-does" className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 id="what-it-does" className="text-3xl font-bold tracking-tight sm:text-4xl">
            What this GIF compressor does to your file
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            This free online GIF compressor reduces GIF file size directly in your browser using
            Gifsicle compiled to WebAssembly. In our own tests it cut a mixed set of GIFs by 37% on
            average, with the best result at 69%. Nothing is uploaded, nothing is watermarked, and
            there's no signup or limit on how many GIFs you compress.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We built it because every other GIF size reducer we tried wanted an email address, an
            upload of a client's screen recording, or both. So the compression engine here runs on
            your CPU. You can watch your network tab stay empty while a 40 MB file gets crunched.
          </p>
        </section>

        <section aria-labelledby="how-to" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="how-to" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              How to Compress a GIF
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-center text-lg leading-relaxed">
              To compress a GIF, add it to the tool above, keep Smart Compress on or set your own
              lossy strength, then download the result. Most GIFs finish in under five seconds, and
              you can compare the before and after side by side before you keep the smaller file.
            </p>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {howToSteps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <s.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mx-auto mt-8 max-w-3xl leading-relaxed text-muted-foreground">
              Pro tip on the size-versus-quality trade: lossy 80 with transparency optimization is
              the sweet spot for almost everything. If the result is still too heavy, cut frames
              before you cut colours — dropping every second frame usually saves more than going
              from 256 to 64 colours, and viewers notice it less. Only push lossy past 120 on fast
              motion, where nobody can freeze a frame long enough to see the noise.
            </p>
          </div>
        </section>

        <section aria-labelledby="methods" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 id="methods" className="text-3xl font-bold tracking-tight sm:text-4xl">
            What GIF compression actually does
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            GIF compression works on five levers: lossy LZW encoding, the 256 colour palette, frame
            rate, duplicate frames, and GIF dimensions. Each one trades a different kind of fidelity
            for bytes. A good GIF optimizer picks the levers your specific footage tolerates instead
            of applying the same preset to everything.
          </p>

          <h3 className="mt-10 text-xl font-semibold">Lossless first, lossy second</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Two of those levers cost you nothing. Inter-frame transparency stores only the pixels
            that changed since the last frame — on a talking-head clip with a static background,
            that's often half the file, gone, with zero visual difference. Removing duplicate frames
            is equally free. Exporters produce duplicates constantly whenever a source video holds
            still.
          </p>

          <h3 className="mt-8 text-xl font-semibold">The 256 colours problem</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A GIF can only reference 256 colours per palette. That sounds like a constraint on
            quality, and it is, but it's also where savings hide. Fewer distinct colours means
            longer runs of repeated bytes, and LZW compression eats repetition for breakfast. Flat
            illustrations, logos and UI recordings often look identical at 64 colours.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Photographic GIFs are the opposite. Push their palette down and you get visible banding
            in every sky and every skin tone. That's the judgement call Smart Compress makes for you
            by measuring how densely your frames actually use the palette.
          </p>

          <h3 className="mt-8 text-xl font-semibold">Frame rate, duration and resolution</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            When you compress an animated GIF, duration and frame rate drive file size more than
            anything else — every frame is a full still image. Halving 30 fps to 15 fps halves the
            frame data. Cutting GIF
            resolution from 1200px to 600px wide removes three quarters of the pixels. Both feel
            drastic on paper and look completely fine in a chat window.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <caption className="sr-only">
                GIF compression methods, typical size saving and quality impact
              </caption>
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">Method</th>
                  <th scope="col" className="px-4 py-3 font-semibold">What it does</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Typical saving</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Quality impact</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((m) => (
                  <tr key={m.method} className="border-t border-border align-top">
                    <th scope="row" className="px-4 py-3 font-medium">{m.method}</th>
                    <td className="px-4 py-3 text-muted-foreground">{m.what}</td>
                    <td className="px-4 py-3 font-medium text-primary">{m.saving}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Saving ranges are what we see across our own test files; your GIF will land somewhere in
            those bands depending on content.
          </p>
        </section>

        <section aria-labelledby="discord" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <h2 id="discord" className="text-3xl font-bold tracking-tight sm:text-4xl">
              GIF Compressor for Discord
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              Discord's default attachment limit is 10 MiB for all users, higher only with Nitro or a
              server's Boost Tier. GIFs fail to send because Discord won't re-encode them for you —
              it accepts the file or rejects it. Compress the GIF to about 8 MB first and it posts
              on the first try.
            </p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <caption className="sr-only">Discord size limits for attachments, emoji and stickers</caption>
                <thead>
                  <tr className="bg-muted/50">
                    <th scope="col" className="px-4 py-3 font-semibold">Upload type</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Discord limit</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {discordLimits.map((d) => (
                    <tr key={d.thing} className="border-t border-border">
                      <th scope="row" className="px-4 py-3 font-normal">{d.thing}</th>
                      <td className="px-4 py-3 font-medium text-primary">{d.limit}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Figures published by Discord in its{" "}
              <a
                className="underline underline-offset-2 hover:text-foreground"
                href="https://discord.com/developers/docs/reference"
                rel="noopener nofollow"
                target="_blank"
              >
                developer reference
              </a>
              ,{" "}
              <a
                className="underline underline-offset-2 hover:text-foreground"
                href="https://discord.com/developers/docs/resources/emoji"
                rel="noopener nofollow"
                target="_blank"
              >
                emoji docs
              </a>{" "}
              and{" "}
              <a
                className="underline underline-offset-2 hover:text-foreground"
                href="https://discord.com/developers/docs/resources/sticker"
                rel="noopener nofollow"
                target="_blank"
              >
                sticker docs
              </a>
              . Checked {LAST_UPDATED}.
            </p>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Aim below the line, not at it.</strong> Target 8
                MB rather than 10 MiB — Discord counts the whole request, so a caption and embed
                metadata ride along with your file.
              </li>
              <li>
                <strong className="text-foreground">Size emotes properly.</strong> A 128×128 emoji
                under 256 KiB and a 320×320 sticker under 512 KiB will always be accepted; anything
                larger gets rejected at upload with no explanation.
              </li>
              <li>
                <strong className="text-foreground">Trim before you compress.</strong> Discord GIF
                size problems are usually duration problems. Four seconds of the good part beats
                twelve seconds compressed into mush.
              </li>
            </ul>
            <p className="mt-6">
              <L
                to="/compress-gif-for-discord"
                className="font-medium text-primary underline underline-offset-4"
              >
                Read the full guide to compressing a GIF for Discord
              </L>
            </p>
          </div>
        </section>

        <section aria-labelledby="x-whatsapp" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 id="x-whatsapp" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Compress a GIF for X (Twitter) and WhatsApp
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            These two platforms fail in opposite ways. X rejects the upload outright when the file
            is too large — and silently uses a much smaller cap in its mobile apps than on the web.
            WhatsApp accepts almost anything under its media ceiling but re-encodes your GIF to MP4
            on the way, so the quality you send is not the quality that arrives. Compressing to the
            right target first is what keeps both looking clean.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">
                Verified GIF upload limits and recommended ZipGIF target sizes for X and WhatsApp
              </caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Where you post it
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Published limit
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Target size in ZipGIF
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Why
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {socialLimits.map((row) => (
                  <tr key={row.where}>
                    <th scope="row" className="px-4 py-3 font-medium text-foreground">
                      {row.where}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{row.limit}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{row.target}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Sources:{" "}
            <a
              href="https://developer.x.com/en/docs/x-api/v1/media/upload-media/uploading-media/media-best-practices"
              rel="nofollow noopener"
              target="_blank"
              className="underline underline-offset-4"
            >
              X media best practices
            </a>{" "}
            and{" "}
            <a
              href="https://faq.whatsapp.com/"
              rel="nofollow noopener"
              target="_blank"
              className="underline underline-offset-4"
            >
              the WhatsApp Help Center
            </a>
            . Platform limits change; re-check before a launch that depends on them.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Posting to X without the upload failing</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Compress to 5&nbsp;MB even when you are posting from a desktop browser. The 15&nbsp;MB
                allowance only applies on the web, and a thread you start on a laptop is often
                re-shared from a phone. Keep the longest edge at or under 1280&nbsp;px and the frame
                count under 350 — X drops GIFs that exceed either, regardless of file size, and
                converts everything it accepts into a looping MP4 anyway. A 5&nbsp;MB, 1280&nbsp;px
                GIF survives that conversion with far fewer blocking artifacts than a 14&nbsp;MB one
                that gets crushed on the server.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Sending on WhatsApp so it still looks sharp</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                WhatsApp&rsquo;s in-chat media ceiling is 16&nbsp;MB, but the practical target is
                12&nbsp;MB: the app transcodes GIFs to MP4 and applies its own compression on top of
                yours. Every megabyte you remove first is a megabyte WhatsApp does not have to strip
                more aggressively. If quality matters more than the inline autoplay, send the GIF as
                a document instead — that path skips the re-encode entirely and accepts files far
                larger than 16&nbsp;MB. For animated stickers, the hard ceiling is 500&nbsp;KB at
                512×512.
              </p>
            </div>
          </div>
        </section>



        <section aria-labelledby="targets" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 id="targets" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Compress a GIF to 256KB, 512KB, 1MB or 8MB
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Type a number into Target size and the tool compresses repeatedly, binary-searching the
            lossy level until the output fits under your limit. Use 256 KB for a Discord emoji, 512
            KB for a sticker, 1 MB for email-friendly signatures, and 8 MB for a Discord attachment.
            If it can't reach your target, it says so instead of quietly failing.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Hitting an exact size is genuinely a search problem, not a formula. There's no way to
            predict what setting turns a 12 MB screen-recording GIF into a 500 KB one, because it
            depends entirely on what's moving in your frames. So we compress, measure, adjust, and
            repeat — which costs nothing when it's your own CPU doing the passes.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Want a tiny GIF? Under 2 MB is easy for most clips. Making a GIF less KB than about 100
            usually means going small in dimensions too — that's when you resize the GIF rather than
            just squeeze it.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <caption className="sr-only">Verified platform file size limits and the target we recommend</caption>
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">Platform</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Published limit</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Target we'd set</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {platformLimits.map((p) => (
                  <tr key={p.platform} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 font-normal">{p.platform}</th>
                    <td className="px-4 py-3 font-medium">{p.limit}</td>
                    <td className="px-4 py-3 text-primary">{p.target}</td>
                    <td className="px-4 py-3">
                      <a
                        className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
                        href={p.href}
                        rel="noopener nofollow"
                        target="_blank"
                      >
                        Official docs
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Only limits we could verify against official documentation are listed. Checked{" "}
            {LAST_UPDATED}.
          </p>
        </section>

        <section aria-labelledby="why-huge" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 id="why-huge" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why GIF files are so ridiculously huge
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              GIF files are huge because the format stores every frame as a complete still image
              with no motion prediction. The GIF89a specification dates from 1989 and was designed
              for small looping graphics on dial-up, not for five seconds of 30 fps screen capture.
              Modern codecs describe how pixels move; GIF can only describe pixels.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              You can read the{" "}
              <a
                className="underline underline-offset-2 hover:text-foreground"
                href="https://www.w3.org/Graphics/GIF/spec-gif89a.txt"
                rel="noopener nofollow"
                target="_blank"
              >
                original GIF89a specification
              </a>{" "}
              in about twenty minutes. It's a lovely document. It also never once anticipated
              somebody pasting a 4K window recording into it.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The cost lands on page weight. The HTTP Archive's{" "}
              <a
                className="underline underline-offset-2 hover:text-foreground"
                href="https://almanac.httparchive.org/en/2022/page-weight"
                rel="noopener nofollow"
                target="_blank"
              >
                Web Almanac page weight chapter
              </a>{" "}
              tracks how images dominate transferred bytes across the web, and animated GIFs are the
              worst offenders per second of content.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              So here's the honest part. If your destination supports MP4 or WebP, use them — Google's{" "}
              <a
                className="underline underline-offset-2 hover:text-foreground"
                href="https://web.dev/articles/replace-gifs-with-videos"
                rel="noopener nofollow"
                target="_blank"
              >
                replace GIFs with videos
              </a>{" "}
              guide exists for good reason, and the difference is an order of magnitude, not a few
              percent. GIF survives because it autoplays silently and pastes anywhere. Compression is
              how you make that convenience affordable.
            </p>
          </div>
        </section>

        <section aria-labelledby="compare" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 id="compare" className="text-3xl font-bold tracking-tight sm:text-4xl">
            ZipGIF vs other online GIF compressors
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Most animated GIF compressors upload your file to their server, cap free use with daily
            limits, and sometimes stamp output with a watermark. ZipGIF processes files in your
            browser, accepts up to 200 MB per GIF, batches 20 at a time, and never adds branding.
            The table below states what we do; competitor columns describe common free tiers, not any
            named service.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <caption className="sr-only">Feature comparison with typical online GIF compressors</caption>
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">Feature</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-primary">ZipGIF</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-muted-foreground">
                    Typical free compressor
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 font-normal">{row.label}</th>
                    <td className="px-4 py-3 font-medium">{row.zip}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            What genuinely differs is the architecture, not a feature list. Because there's no
            server, there's no queue, no upload wait on a slow connection, no file sitting in someone
            else's bucket, and no reason for us to meter you. It also means the tool keeps working
            when your wifi drops mid-flight.
          </p>
        </section>

        <section aria-labelledby="study" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <h2 id="study" className="text-3xl font-bold tracking-tight sm:text-4xl">
              We compressed 16 test GIFs and published every number
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              Across 16 GIFs covering screen recordings, talking heads, flat animation, photographic
              pans and camera noise, our default settings cut the batch from 6.23 MB to 3.93 MB — a
              37.0% reduction overall, 37.2% on average per file, with a median of 33.0%. The best
              file dropped 69.4%. The worst dropped 3.6%.
            </p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <caption className="sr-only">Per-file results from our GIF compression test</caption>
                <thead>
                  <tr className="bg-muted/50">
                    <th scope="col" className="px-4 py-3 font-semibold">Test GIF</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Before</th>
                    <th scope="col" className="px-4 py-3 font-semibold">After</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Reduction</th>
                  </tr>
                </thead>
                <tbody>
                  {study.map((s) => (
                    <tr key={s.name} className="border-t border-border">
                      <th scope="row" className="px-4 py-3 font-normal">{s.name}</th>
                      <td className="px-4 py-3 text-muted-foreground">{s.before}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.after}</td>
                      <td className="px-4 py-3 font-medium text-success">−{s.cut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Method: 16 GIFs generated to represent common real-world content types, then processed
              with Gifsicle 1.96 — the same engine this tool runs as WebAssembly — using{" "}
              <code className="rounded bg-background px-1 py-0.5 text-xs">-O3 --lossy=120 --colors=64</code>
              . Sizes are the actual bytes on disk before and after. Two takeaways surprised us:
              duplicate-heavy progress bars gave the biggest wins, and dense confetti-style animation
              barely compresses at all.
            </p>
            <p className="mt-2 text-sm font-medium">Last tested: {LAST_UPDATED}</p>
          </div>
        </section>

        <section aria-labelledby="use-cases" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="use-cases" className="text-3xl font-bold tracking-tight sm:text-4xl">
            When people reach for a GIF size reducer
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed">
            Most people compress a GIF for one of six reasons: a chat app rejected the upload, an
            email client choked, a page loaded slowly, a social platform mangled the colours, a
            README needed a demo, or the footage was confidential. Each one wants slightly different
            settings, and all six take about ten seconds here.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u) => (
              <article key={u.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <u.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="coming" className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 id="coming" className="text-3xl font-bold tracking-tight sm:text-4xl">
              What we're building next
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              Compression is the first tool, not the last one. A GIF resizer, a GIF cropper, a GIF
              trimmer and a speed changer are all in progress, and each will run client-side exactly
              like this one. Everything below is honest roadmap, not a live feature.
            </p>
            <ul className="mt-6 grid gap-3 text-muted-foreground sm:grid-cols-2">
              <li>
                <strong className="text-foreground">Resize GIF</strong> — change GIF dimensions for
                emotes and thumbnails, including an animated GIF resizer for Discord sizes.
              </li>
              <li>
                <strong className="text-foreground">Trim GIF</strong> — cut a GIF or shorten a GIF to
                the seconds that matter; a GIF shortener saves more than any slider.
              </li>
              <li>
                <strong className="text-foreground">Crop GIF</strong> — shipped: the{" "}
                <L to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
                  GIF cropper
                </L>{" "}
                is live for removing browser chrome from screen captures.
              </li>
              <li>
                <strong className="text-foreground">Speed and quality</strong> — a GIF speed changer
                to slow down or speed up a GIF, plus a GIF upscaler for tiny sources.
              </li>
            </ul>
          </div>
        </section>

        <Faq />

        <section aria-labelledby="related-speed" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 id="related-speed" className="text-xl font-bold tracking-tight">
              Need it faster or slower instead?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The{" "}
              <L to="/gif-speed-changer" className="text-primary underline-offset-4 hover:underline">
                GIF speed changer
              </L>{" "}
              re-times an animated GIF from 0.1× to 8× and sets how it loops — same engine, same
              browser-only privacy.
            </p>
          </div>
        </section>

        {/* Related tool */}
        <section aria-labelledby="related-resizer" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 id="related-resizer" className="text-xl font-bold tracking-tight">
              Need different dimensions instead?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The{" "}
              <L to="/gif-resizer" className="text-primary underline-offset-4 hover:underline">
                GIF resizer
              </L>{" "}
              scales an animated GIF to exact pixels, a percentage, or a platform preset — same
              engine, same browser-only privacy.
            </p>
          </div>
        </section>

        <section aria-labelledby="cta" className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
          <h2 id="cta" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Go make that GIF smaller
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Scroll back up, drop your file into the GIF compressor, and you'll have a lighter version
            before you've finished reading this sentence. Nothing to install, nothing to sign, and
            nothing leaves your laptop.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Last updated: August 14, 2026&nbsp;- Built by Shafiullah Tareen.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
