import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SpeedChanger } from "@/components/tool/speed-changer";

const SITE = "https://zipgif.com";
const PATH = "/gif-speed-changer";
const TITLE = "GIF Speed Changer — Speed Up or Slow Down GIFs Free";
const DESCRIPTION =
  "Free GIF speed changer. Speed up or slow down an animated GIF from 0.1x to 8x, set how it loops, and download it. Runs in your browser, no watermark.";
const MODIFIED = "2026-08-15";
const GOOGLE_ADS_SPECS = "https://support.google.com/google-ads/answer/1722096";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How to slow down a GIF",
    a: "Open the speed changer, drop the GIF in, and pick anything under 1x — 0.5x is half speed, 0.25x is quarter speed. Every frame's delay is multiplied, no frames are removed, and the preview shows the new loop time before you download. Slowing down never triggers frame-skipping.",
  },
  {
    q: "How to speed up a GIF",
    a: "Drop the GIF in and pick anything above 1x, or drag the slider up to 8x. Delays shrink proportionally; if they'd fall under the 20ms browser floor, the tool drops frames evenly to reach your speed legally. The readout shows the old and new loop time before you commit.",
  },
  {
    q: "How many FPS are GIFs?",
    a: "There's no standard — each frame carries its own delay. Most GIFs in the wild run between 10 and 25fps. The format writes delays in whole hundredths of a second and browsers ignore anything under 20ms, so 50fps is the effective maximum a GIF can play in a browser.",
  },
  {
    q: "What frame rate for GIFs for web banners?",
    a: "Slower than you'd think. Google's display ad specs require animated GIF ads to run slower than 5 FPS, stop animating within 30 seconds, and stay at or under 150 KB. Slow the GIF until one loop fits those limits, and if weight is the problem, run it through the GIF Compressor.",
  },
  {
    q: "Can you pause a GIF?",
    a: "Not really — the format has no pause button; a GIF plays its frames and loops. The closest moves: set the loop to play once so it stops on the last frame, or slow it dramatically so the frame you care about hangs around long enough to read.",
  },
  {
    q: "Why does my GIF still play slowly after speeding it up?",
    a: "Almost always the 20ms floor. If the frames were already short, halving their delays pushed them under 20ms, and browsers replace those with roughly 100ms — slower than what you started with. Rerun it here: this tool detects the floor and drops frames instead, so the speed you pick is the speed you get.",
  },
];

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
          dateModified: MODIFIED,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
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
          name: "How to change a GIF's speed",
          url: `${SITE}${PATH}`,
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Drop a GIF onto the tool",
              text: "Drop a GIF onto the tool above. Processing happens on your device — the file never uploads anywhere.",
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Pick a speed",
              text: "Pick a preset from 0.25x to 4x, or drag the slider anywhere between 0.1x and 8x. The readout shows the loop time before and after — say, 3.2s to 1.6s.",
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Preview and download",
              text: "Preview the new timing, then download. Same pixels, same colors, new clock.",
            },
          ],
        }),
      },
    ],
  }),
  component: GifSpeedChangerPage,
});

function GifSpeedChangerPage() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("This console message plays at 1x speed.");
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

        {/* Answer block */}
        <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <p className="leading-relaxed text-muted-foreground">
            A GIF speed changer rescales the delay on every frame of an animated GIF so the whole
            thing plays faster or slower. Pick a speed from 0.1x to 8x, watch the loop time update,
            and download the result. Whether you speed up a GIF or slow down a GIF, nothing leaves
            your browser: no upload, no watermark, no queue.
          </p>
        </section>

        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to change a GIF's speed
          </h2>
          <ol className="mt-4 grid gap-3 leading-relaxed text-muted-foreground">
            <li>
              1. Drop a GIF onto the tool above. Processing happens on your device - the file never
              uploads anywhere.
            </li>
            <li>
              2. Pick a preset from 0.25x to 4x, or drag the slider anywhere between 0.1x and 8x.
              The readout shows the loop time before and after - say, 3.2s to 1.6s.
            </li>
            <li>3. Preview the new timing, then download. Same pixels, same colors, new clock.</li>
          </ol>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            That is genuinely all it takes to change GIF speed - no editor timeline, no export
            dialog. Variable-timing GIFs keep their rhythm too: a frame that showed twice as long as
            its neighbor still does afterward, because every frame's own delay is scaled
            individually rather than flattened to one number.
          </p>
        </section>

        <section aria-labelledby="speed-up" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="speed-up" className="text-3xl font-bold tracking-tight">
            Speed up a GIF
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            To speed up a GIF, the tool divides each frame's delay by your chosen factor. At 2x, a
            frame that held for 100ms holds for 50ms, the loop time halves, and the motion reads as
            fast forward. It works the same on a three-frame reaction meme and a 300-frame screen
            recording, and the file size barely moves.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Two honest notes. First, there's a ceiling on how fast browsers will actually play - see
            the frame-skipping section below for why 4x sometimes means fewer frames. Second,
            speeding up makes a GIF play faster but keeps every frame; actually cutting content out
            of the middle is trimming, which is a different job. If your real goal is a
            faster-feeling GIF for chat, somewhere between 1.25x and 2x usually lands right - past
            that, comedy takes over.
          </p>
        </section>

        <section aria-labelledby="slow-down" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="slow-down" className="text-3xl font-bold tracking-tight">
            Slow down a GIF
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            To slow down a GIF, every frame delay is multiplied instead. At 0.5x, a 100ms frame
            becomes 200ms and a two-second loop stretches to four. No frames are dropped when
            slowing GIFs down - the animation simply lingers on each one longer, which is exactly
            what you want for tutorials, subtitles, or catching the frame where everything goes
            wrong.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A word on slow motion: real slow-mo needs frames that were never captured. Big video
            tools can interpolate new in-between frames; the GIF format cannot, so a slow mo GIF
            pushed below about 0.25x starts to feel like a slideshow. If the source ran at 10 frames
            per second, quartering its speed leaves an effective 2.5fps - each frame holding for
            400ms. A slowed GIF doesn't gain drama frames; it just commits harder to the ones it
            has.
          </p>
        </section>

        <section aria-labelledby="frame-rates" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="frame-rates" className="text-3xl font-bold tracking-tight">
            GIF frame rates explained (fps, and the 50fps ceiling)
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            GIFs don't have a frame rate the way video does. Each frame stores its own delay,
            counted in whole hundredths of a second, so "GIF fps" is really shorthand for 1 divided
            by that delay: a 10-hundredths delay plays at 10fps, 4 hundredths at 25fps, 2 hundredths
            at 50fps. In practice, most GIFs you'll meet run somewhere between 10 and 25 frames per
            second.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            That whole-hundredths rule has a consequence almost nobody mentions: a true 60fps GIF
            cannot exist. Sixty frames per second needs 16.7ms per frame, and the format can only
            write 10ms or 20ms - nothing in between. Even a 30fps GIF isn't quite real; the nearest
            legal delays give you 33fps or 25fps. GIF frame rates snap to 100 divided by a whole
            number - 50, 33, 25, 20 - and browsers refuse anything under 20ms anyway. So the fastest
            GIF you'll ever see plays at 50fps, and anything advertised as a 60fps GIF is either
            secretly a video file or rounding up.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            One more thing about smoothness: a GIF gets smoother from having more source frames, not
            from faster delays. Frame count buys smoothness; speed only decides how quickly you
            spend it.
          </p>
        </section>

        <section aria-labelledby="why-skip" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="why-skip" className="text-3xl font-bold tracking-tight">
            Why very fast GIFs skip frames
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Ask a browser for a frame delay under 20 milliseconds and it won't obey - it quietly
            swaps in a default of around 100ms. So shrinking delays past that floor doesn't make a
            GIF faster; it can make it ten times slower. It is the least intuitive rule in the whole
            format.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This tool routes around the floor automatically. When your target speed would need
            sub-20ms delays, it drops frames evenly - keeping every 2nd or 3rd - and rescales the
            survivors so the effective speed lands where you asked, with every delay still legal.
            You'll see an amber note when this kicks in, and the results card shows the new frame
            count (142 to 71 frames, for example). The trade-off is honest: fewer frames means
            slightly steppier motion. Dropping frames is also, incidentally, the only real way to
            reduce a GIF's fps - a GIF fps reducer is just this trick wearing a different name.
          </p>
        </section>

        <section aria-labelledby="loop-settings" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="loop-settings" className="text-3xl font-bold tracking-tight">
            Loop settings
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A GIF's loop count is a single flag written inside the file: play once, loop a set
            number of times, or loop forever. This tool sets it directly - keep the original
            behavior, force an endless loop, stop after one pass, or pick an exact count.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The two requests we hear most: make a GIF loop forever (plenty of exports ship with
            looping switched off), and extend a GIF - for that, either raise the loop count or slow
            the whole thing down; both stretch watch time without touching a pixel. A play-once GIF
            freezes on its final frame, which doubles as a cheap way to end on the punchline.
          </p>
        </section>

        <section aria-labelledby="measured" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="measured" className="text-3xl font-bold tracking-tight">
            One GIF, four speeds: measured
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Numbers from a real run of this tool on one GIF (same source file, default settings),
            measured on August 15, 2026:
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Loop time, frame count, and file size at four speed settings
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Setting
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Loop time
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Frames
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    File size
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {["Original (1x)", "0.5x slower", "2x faster", "4x faster"].map((setting) => (
                  <tr key={setting} className="border-b border-border">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                      {setting}
                    </th>
                    <td className="py-3 pr-4">[FILL]</td>
                    <td className="py-3 pr-4">[FILL]</td>
                    <td className="py-3">[FILL]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            If the 4x row shows fewer frames than the original, that's the 20ms rule at work - see
            the frame-skipping section above.
          </p>
          <p className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
            OWNER NOTE (delete after filling): run one GIF at 0.5x, 2x, and 4x, copy the
            results-card numbers into the table, set the date, then delete this note. Use the visual
            editor - it's free.
          </p>
        </section>

        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 id="faqs" className="text-3xl font-bold tracking-tight">
            FAQs
          </h2>

          <h3 className="mt-6 text-xl font-semibold">How to slow down a GIF</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Open the speed changer, drop the GIF in, and pick anything under 1x - 0.5x is half
            speed, 0.25x is quarter speed. Every frame's delay is multiplied, no frames are removed,
            and the preview shows the new loop time before you download. Slowing down never triggers
            frame-skipping.
          </p>

          <h3 className="mt-6 text-xl font-semibold">How to speed up a GIF</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Drop the GIF in and pick anything above 1x, or drag the slider up to 8x. Delays shrink
            proportionally; if they'd fall under the 20ms browser floor, the tool drops frames
            evenly to reach your speed legally. The readout shows the old and new loop time before
            you commit.
          </p>

          <h3 className="mt-6 text-xl font-semibold">How many FPS are GIFs?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            There's no standard - each frame carries its own delay. Most GIFs in the wild run
            between 10 and 25fps. The format writes delays in whole hundredths of a second and
            browsers ignore anything under 20ms, so 50fps is the effective maximum a GIF can play in
            a browser.
          </p>

          <h3 className="mt-6 text-xl font-semibold">What frame rate for GIFs for web banners?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Slower than you'd think.{" "}
            <a
              href={GOOGLE_ADS_SPECS}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="text-primary underline-offset-4 hover:underline"
            >
              Google's display ad specs
            </a>{" "}
            require animated GIF ads to run slower than 5 FPS, stop animating within 30 seconds, and
            stay at or under 150 KB. Slow the GIF until one loop fits those limits, and if weight is
            the problem, run it through the{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              GIF Compressor
            </Link>
            .
          </p>

          <h3 className="mt-6 text-xl font-semibold">Can you pause a GIF?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Not really - the format has no pause button; a GIF plays its frames and loops. The
            closest moves: set the loop to play once so it stops on the last frame, or slow it
            dramatically so the frame you care about hangs around long enough to read.
          </p>

          <h3 className="mt-6 text-xl font-semibold">
            Why does my GIF still play slowly after speeding it up?
          </h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Almost always the 20ms floor. If the frames were already short, halving their delays
            pushed them under 20ms, and browsers replace those with roughly 100ms - slower than what
            you started with. Rerun it here: this tool detects the floor and drops frames instead,
            so the speed you pick is the speed you get.
          </p>
        </section>

        <section aria-label="Sources" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sources: Google Ads uploaded display ad specifications (
            <a
              href={GOOGLE_ADS_SPECS}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="text-primary underline-offset-4 hover:underline"
            >
              support.google.com/google-ads/answer/1722096
            </a>
            ) - GIF89a specification, W3C archive - frame-drop behavior measured in this tool.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: August 14, 2026&nbsp;- Built by Shafiullah Tareen.
          </p>
        </section>

        <section aria-labelledby="related-speed" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 id="related-speed" className="text-3xl font-bold tracking-tight">
            Related tools
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">
                <Link to="/" className="text-primary underline-offset-4 hover:underline">
                  GIF Compressor
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Same GIF, smaller file. Speed untouched.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">
                <Link to="/gif-resizer" className="text-primary underline-offset-4 hover:underline">
                  GIF Resizer
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Change the dimensions, not the timing.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">
                <Link to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
                  GIF Cropper
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Cut the frame, keep the pace.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
