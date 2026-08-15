import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Cropper } from "@/components/tool/cropper";
import { CropFaq, cropFaqs } from "@/components/crop-faq";

const SITE = "https://zipgif.com";
const PATH = "/gif-cropper";
const TITLE = "GIF Cropper — Crop GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF cropper. Crop animated GIFs in your browser — keep the animation, lose the borders. Square, 16:9 and PFP presets. No signup, no watermark.";
const LAST_UPDATED = "August 2026";
const DATE_MODIFIED = "2026-08-12";

const HOW_TO_STEPS = [
  {
    name: "Add your GIF",
    text: "Drop a GIF onto the tool, paste one from your clipboard, or paste a direct image URL. Files stay on your device.",
  },
  {
    name: "Set the crop area",
    text: "Drag the crop box and its handles over the part you want to keep, or pick an aspect ratio preset like 1:1 or 16:9. Auto-trim snaps the box to the content if the GIF has borders.",
  },
  {
    name: "Download the cropped GIF",
    text: "Press Crop GIF, check the before and after, then download the file — or grab a .zip if you cropped a batch.",
  },
];

const CROP_TEST = [
  {
    kind: "Screen recording (browser chrome + taskbar removed)",
    dims: "1024×640 → 1600×900 sources",
    pixels: "12–14%",
    bytes: "6–9%",
  },
  {
    kind: "Meme or reaction GIF with dead space around the subject",
    dims: "640×640 → 1000×600 sources",
    pixels: "39–61%",
    bytes: "27–30%",
  },
  {
    kind: "Letterboxed clip (black bars top and bottom)",
    dims: "640×480 → 1280×960 sources",
    pixels: "33%",
    bytes: "11–16%",
  },
  {
    kind: "PFP-style 1:1 crop out of a widescreen GIF",
    dims: "640×360 → 1280×720 sources",
    pixels: "44%",
    bytes: "44–47%",
  },
];

export const Route = createFileRoute("/gif-cropper")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
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
          name: "ZipGIF GIF Cropper",
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
          "@type": "HowTo",
          name: "How to Crop a GIF",
          description:
            "Crop an animated GIF in the browser so every frame is cropped identically and the animation stays intact.",
          totalTime: "PT1M",
          tool: [{ "@type": "HowToTool", name: "ZipGIF GIF Cropper" }],
          step: HOW_TO_STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
            url: `${SITE}${PATH}#how-to-crop-a-gif`,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: cropFaqs.map((f) => ({
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
          "@type": "Article",
          headline: "GIF Cropper — Crop GIFs Without Losing the Animation",
          description: DESCRIPTION,
          author: { "@type": "Person", name: "Shafiullah Tareen" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
          dateModified: DATE_MODIFIED,
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}${PATH}` },
        }),
      },
    ],
  }),
  component: GifCropperPage,
});

function GifCropperPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: "<!-- Every pixel you see survived the crop. The rest had it coming. -->",
        }}
      />
      <SiteHeader />

      <main id="main">
        {/* Section 1 — hero + tool */}
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            GIF Cropper — Crop GIFs Without Losing the Animation
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Crop an animated GIF to any frame or aspect ratio, free and entirely in your browser —
            every frame stays in sync and nothing is ever uploaded.
          </p>

          <div className="mt-8">
            <Cropper />
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-xl border border-border bg-card p-4">
              Nothing is uploaded — cropping runs on your device.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              No watermark, no signup, no daily limit.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              200&nbsp;MB per GIF, as many GIFs as you like.
            </li>
          </ul>
        </section>

        {/* Section 2 — answer-first */}
        <section aria-labelledby="crop-a-gif" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="crop-a-gif" className="text-3xl font-bold tracking-tight">
            Crop a GIF right in your browser
          </h2>
          <p className="mt-4 leading-relaxed">
            This GIF cropper cuts the same rectangle out of every frame of an animated GIF, so the
            motion, frame delays, loop count and transparency all survive the crop. It runs on your
            own machine with WebAssembly — your file never leaves the device, nothing is stored, and
            there's no signup, watermark or export limit. Crop freehand or to a preset ratio.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We built the compressor first. Then we watched people feed it 1280px screen recordings
            where a third of the picture was browser tabs and desktop wallpaper, and realised half
            of them didn't need smaller bytes — they needed a tighter frame. So here's the cropper.
          </p>
        </section>

        {/* Section 3 — how to */}
        <section
          aria-labelledby="how-to-crop-a-gif"
          className="mx-auto max-w-3xl px-4 py-12 sm:px-6"
        >
          <h2 id="how-to-crop-a-gif" className="text-3xl font-bold tracking-tight">
            How to Crop a GIF
          </h2>
          <p className="mt-4 leading-relaxed">
            Cropping a GIF here takes three moves: add the file, set the crop area, download the
            result. There's nothing to install and no queue to wait in, because the work happens in
            your browser. Batch cropping works the same way — add several GIFs and apply one crop
            region across the whole queue.
          </p>
          <ol className="mt-6 space-y-4">
            {HOW_TO_STEPS.map((s, i) => (
              <li key={s.name} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">
                  <span className="mr-2 text-primary">{i + 1}.</span>
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Pro tip: play the animation before you commit. The subject moves, and a crop that looks
            perfect on frame 1 can slice the punchline off frame 40. That's the whole reason the
            crop box sits over a live preview instead of a still thumbnail.
          </p>
        </section>

        {/* Section 4 — what cropping does */}
        <section aria-labelledby="what-cropping-does" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="what-cropping-does" className="text-3xl font-bold tracking-tight">
            What cropping an animated GIF actually does to the file
          </h2>
          <p className="mt-4 leading-relaxed">
            A GIF is a stack of frames plus a colour palette and a set of delays. Cropping an
            animated GIF cuts the identical rectangle out of every one of those animation frames and
            rewrites the canvas size, so the picture gets smaller but the timeline doesn't change.
            Fewer pixels per frame means fewer bytes, which is why a crop usually shrinks the file
            too.
          </p>
          <h3 className="mt-8 text-xl font-semibold">Why naive croppers smear the animation</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Most GIFs in the wild are frame-optimized: each frame stores only the rectangle that
            changed since the last one, positioned with an offset. Crop that blindly and you're
            cutting different regions out of different frames, which is how you end up with ghost
            trails and pixels that smear across the loop.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            So we coalesce first. Every frame is expanded back to a full picture, the crop is applied
            to all of them equally, then the inter-frame optimization is put back afterwards so the
            output doesn't balloon. You get a clean cut and a file that's still tidy.
          </p>
          <h3 className="mt-8 text-xl font-semibold">Cropping cuts bytes as well as pixels</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Take a 1280×720 screen recording at 98 KB. Cut the browser chrome and taskbar and it
            becomes 1280×616 at 90 KB — 14% of the pixels gone, 8% of the bytes. The saving lags the
            pixel count because the palette, headers and per-frame overhead don't shrink with the
            picture. Cut more picture, save more bytes, but never quite one-for-one.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <caption className="mb-3 text-left text-sm text-muted-foreground">
                What you crop away → what happens to the file (measured on our own test set)
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    What you crop away
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Pixels removed
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    File size saved
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    Browser chrome and taskbars from a screen recording
                  </th>
                  <td className="py-3 pr-4">12–14%</td>
                  <td className="py-3">6–9%</td>
                </tr>
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    Letterbox bars above and below the picture
                  </th>
                  <td className="py-3 pr-4">33%</td>
                  <td className="py-3">11–16%</td>
                </tr>
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    Dead space and margins around the subject
                  </th>
                  <td className="py-3 pr-4">39–61%</td>
                  <td className="py-3">27–30%</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-4 font-normal">
                    Everything outside a square crop for an avatar
                  </th>
                  <td className="py-3 pr-4">44%</td>
                  <td className="py-3">44–47%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5 — crop vs trim vs resize */}
        <section aria-labelledby="crop-vs-cut" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="crop-vs-cut" className="text-3xl font-bold tracking-tight">
            Cropper, GIF cutter or trimmer — which one do you need?
          </h2>
          <p className="mt-4 leading-relaxed">
            Cropping a GIF cuts space: pixels off the edges of every frame. Trimming or shortening a
            GIF cuts time: whole frames off the start or end. Resizing scales the entire picture
            down without removing anything. People say "cut a gif" for all three, which is why
            searching for a GIF cutter turns up three different kinds of tool.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    What you want
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    What it's called
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    What changes
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    Remove borders or reframe the subject
                  </th>
                  <td className="py-3 pr-4">Crop</td>
                  <td className="py-3">Width and height shrink; every frame stays</td>
                </tr>
                <tr className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    Make the GIF shorter
                  </th>
                  <td className="py-3 pr-4">Trim / cut GIF frames</td>
                  <td className="py-3">Frame count drops; dimensions stay</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 pr-4 font-normal">
                    Make the file smaller, same picture
                  </th>
                  <td className="py-3 pr-4">Resize or compress</td>
                  <td className="py-3">Bytes drop; nothing is cut away</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="mt-6 space-y-3 leading-relaxed text-muted-foreground">
            <li>
              This tool crops. It changes the GIF dimensions and leaves the animation frames alone.
            </li>
            <li>
              To shorten a GIF's length or cut GIF frames off the ends, you want a GIF trimmer — ours
              is on the roadmap alongside a GIF resizer and a GIF splitter.
            </li>
            <li>
              To shrink the file without changing what's visible, run it through our{" "}
              <Link to="/" className="text-primary underline-offset-4 hover:underline">
                GIF compressor
              </Link>{" "}
              after you crop.
            </li>
          </ul>
        </section>

        {/* Section 6 — shapes */}
        <section aria-labelledby="crop-to-square" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="crop-to-square" className="text-3xl font-bold tracking-tight">
            Crop a GIF to square, 16:9, or PFP size
          </h2>
          <p className="mt-4 leading-relaxed">
            The aspect ratio presets lock the crop box to a fixed shape while you drag it: Free for
            no constraint, 1:1 for a square GIF, 16:9 for widescreen, 9:16 for vertical, and 4:3 or
            3:2 for older captures and photo framing. Pick a preset, position the box, and the width
            and height stay in proportion the whole time.
          </p>
          <h3 className="mt-8 text-xl font-semibold">Cropping a GIF for a profile picture</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Nearly every platform crops an avatar to a square before it displays it. If you upload a
            widescreen GIF, the platform's auto-crop decides what stays — and it usually picks dead
            centre, which is rarely where your face is. Do the pfp crop yourself at 1:1 and you keep
            that decision.
          </p>
          <h3 className="mt-8 text-xl font-semibold">About "circle" GIFs</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A GIF file is always a rectangle. There's no round GIF in the format, so a circle GIF is
            either a square GIF sitting behind a platform's round mask, or a square GIF with a
            transparent background in the corners. Crop to 1:1 and the round version takes care of
            itself on any site that displays avatars as circles.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Banner crop is the same idea in the other direction: wide and short, usually 3:1 or
            wider, so use Free and type exact numbers into the width and height fields.
          </p>
        </section>

        {/* Section 7 — data block */}
        <section aria-labelledby="crop-data" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="crop-data" className="text-3xl font-bold tracking-tight">
            We cropped 20 GIFs and measured every one
          </h2>
          <p className="mt-4 leading-relaxed">
            To find out how much cropping a GIF really saves, we built 20 test GIFs across four
            shapes of problem — screen recordings with browser chrome, memes with dead space,
            letterboxed clips and widescreen sources cropped to a square avatar — and ran each one
            through the exact crop pipeline this page uses. Here's what came out.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="mb-3 text-left text-sm text-muted-foreground">
                Crop test, 20 GIFs, five per category. Last tested: August 2026.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Category (5 GIFs each)
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Source dimensions
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Pixels removed
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    File size saved
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {CROP_TEST.map((r) => (
                  <tr key={r.kind} className="border-b border-border last:border-0">
                    <th scope="row" className="py-3 pr-4 font-normal">
                      {r.kind}
                    </th>
                    <td className="py-3 pr-4">{r.dims}</td>
                    <td className="py-3 pr-4">{r.pixels}</td>
                    <td className="py-3">{r.bytes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 leading-relaxed">
            Across all 20 files the median crop removed 36% of the pixels and 22% of the bytes —
            about 0.6 bytes saved for every pixel cut. The gap is palette and header overhead, which
            doesn't shrink when the canvas does.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The square avatar crops were the outlier, giving back 44 to 47% for 44% of the pixels,
            because the discarded region was busy background. Cropping quiet black letterbox bars
            paid the least: 33% of the pixels, only 11 to 16% of the file. Empty pixels were already
            nearly free.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Last tested: August 2026.</p>
        </section>

        {/* Section 8 — use cases */}
        <section aria-labelledby="crop-use-cases" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="crop-use-cases" className="text-3xl font-bold tracking-tight">
            What people are actually cropping GIFs for
          </h2>
          <p className="mt-4 leading-relaxed">
            Cropping an animated GIF is almost never about art direction. It's about a platform that
            wants a particular shape, or a recording that caught more of your desktop than you
            meant. These six jobs cover nearly every GIF that goes through this cropper, and each
            one has a preset that fits it.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Profile pictures and avatars</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Crop to 1:1 and put the face or logo dead centre of the box, not the frame. Whatever
                sits in the corners is gone the moment a site rounds the picture off anyway.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Discord emotes and stickers</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Emotes render tiny, so crop tight to 1:1 first — a full scene is unreadable at 32px.
                Then check it against{" "}
                <Link
                  to="/compress-gif-for-discord"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Discord's emote and sticker size limits
                </Link>
                .
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Screen recordings</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Tabs, bookmarks bar, dock, and the notification that slid in at second four. Auto-trim
                won't catch those, so drag the crop box down to the app window and keep the demo.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Memes and reaction GIFs</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Most reaction GIFs carry a lot of room around the bit that's funny. Tighten the frame
                on the reaction and it reads faster in a chat window — and gets smaller as a bonus.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">README and demo GIFs</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                GitHub renders your demo at a few hundred pixels wide. Crop to just the app window so
                the text inside it is still legible instead of a grey smear.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Social formats</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                1:1 for feed posts, 9:16 for stories and reels. Crop to the ratio before you upload
                and you avoid the platform's own crop, which never asks your opinion.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9 — FAQ */}
        <section aria-labelledby="crop-faq" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="crop-faq" className="text-3xl font-bold tracking-tight">
            Questions we get about cropping GIFs
          </h2>
          <p className="mt-4 leading-relaxed">
            The same handful of questions turn up in our inbox every week: whether the animation
            survives, how to get a square, whether Windows needs an app, and where the file size
            goes. Short honest answers below, including the one thing this tool deliberately
            doesn't do.
          </p>
          <CropFaq />
        </section>

        <section aria-labelledby="related-speed" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 id="related-speed" className="text-xl font-bold tracking-tight">
              Need it faster or slower instead?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The{" "}
              <Link to="/gif-speed-changer" className="text-primary underline-offset-4 hover:underline">
                GIF speed changer
              </Link>{" "}
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
              <Link to="/gif-resizer" className="text-primary underline-offset-4 hover:underline">
                GIF resizer
              </Link>{" "}
              scales an animated GIF to exact pixels, a percentage, or a platform preset — same
              engine, same browser-only privacy.
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-card p-6">
            <h2 id="related-trimmer" className="text-xl font-bold tracking-tight">
              Need to cut the timeline instead?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The{" "}
              <Link to="/gif-trimmer" className="text-primary underline-offset-4 hover:underline">
                GIF trimmer
              </Link>{" "}
              keeps only the frames you pick and leaves their timing alone — same engine, same
              browser-only privacy.
            </p>
          </div>
        </section>


        {/* Section 10 — CTA */}
        <section aria-labelledby="crop-cta" className="mx-auto max-w-3xl px-4 pb-20 pt-4 sm:px-6">
          <h2 id="crop-cta" className="text-2xl font-bold tracking-tight">
            Go crop something
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Scroll back up, drop a file in, and the GIF cropper will have your crop ready before you
            finish reading this sentence. If the result still needs to be lighter, the compressor is
            one click away.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED} — written and maintained by Shafiullah Tareen.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
