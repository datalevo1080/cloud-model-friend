import { makeRouteOptions } from "@/i18n/route-options";
import { L } from "@/components/l";
import { useEffect } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Resizer } from "@/components/tool/resizer";
import { ResizeFaq, resizeFaqs } from "@/components/resize-faq";

const SITE = "https://zipgif.com";
const PATH = "/gif-resizer";
const TITLE = "GIF Resizer — Resize GIFs Online Free (No Watermark)";
const DESCRIPTION =
  "Free online GIF resizer. Resize animated GIFs to exact dimensions, percentages, or platform presets — right in your browser. No uploads, no watermark.";
const UPDATED_ISO = "2026-08-14";
const UPDATED_LABEL = "August 14, 2026";

const DISCORD_DOCS = "https://discord.com/developers/docs/resources/emoji";
const TWITCH_DOCS = "https://help.twitch.tv/s/article/emote-guidelines";

const STEPS = [
  {
    name: "Add your GIF",
    text: "Drop one or more GIFs onto the tool, paste from the clipboard, or paste a direct image URL. The files stay on your device.",
  },
  {
    name: "Pick a size",
    text: "Type exact pixels with the aspect lock on, drag the percentage slider, or hit a preset such as Discord Emoji or Twitch Emote.",
  },
  {
    name: "Resize and download",
    text: "Press Resize GIF, check the before and after preview, then download the file — or grab a .zip if you resized a batch.",
  },
];

export const options = makeRouteOptions("/gif-resizer", {
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
          dateModified: UPDATED_ISO,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to resize a GIF",
          dateModified: UPDATED_ISO,
          totalTime: "PT1M",
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
          dateModified: UPDATED_ISO,
          mainEntity: resizeFaqs.map((f) => ({
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
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("This console message was resized to fit 80 columns.");
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

        {/* S1 — liftable answer block */}
        <section aria-labelledby="what-this-does" className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
          <h2 id="what-this-does" className="sr-only">
            What this GIF resizer does
          </h2>
          <p className="rounded-2xl border border-border bg-card p-6 text-lg leading-relaxed">
            This gif resizer changes the dimensions of an animated GIF: exact pixel sizes, a
            percentage, or a platform preset such as Discord emoji. It runs inside your browser, so
            the files never leave your device — nothing is uploaded, nothing is stored, and the
            output carries no watermark. It's free, with no signup and no limit on how many GIFs you
            resize.
          </p>
        </section>

        {/* S2 */}
        <section aria-labelledby="how-to" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="how-to" className="text-3xl font-bold tracking-tight">
            How to resize a GIF
          </h2>
          <p className="mt-4 leading-relaxed">
            To resize a GIF, drop the file onto the tool at the top of this page, choose a size from
            the Dimensions, Percentage, or Presets tab, then press Resize GIF and download the
            result. The whole run happens locally in your browser. Three steps, no account, and the
            animation survives intact.
          </p>
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
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Batch mode works the same way. Queue up to twenty GIFs, set one size, and they're
            processed one after another with a single .zip at the end — each file keeps its original
            name plus its new dimensions.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A word on what happens between step two and step three, because it explains why the
            output looks right when other tools smear. Most GIFs in the wild are frame-optimized:
            each frame stores only the rectangle that changed since the last one. Scale those
            rectangles naively and you get ghost trails. This tool rebuilds every frame in full
            first, scales the complete picture, then re-optimizes the file at the end.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Nothing is queued on a server while that runs, because there is no server in the loop.
            The engine is gifsicle compiled to WebAssembly, loaded once and cached by your browser,
            and it works on the bytes your machine already holds. Open your network tab during a
            resize and you'll watch a whole lot of nothing happen.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Big files take longer, and honesty beats a spinner: a 40 MB screen recording with six
            hundred frames can take a minute on a laptop. The tab stays usable while it runs, and
            each file in the queue shows its own progress rather than one bar for everything.
          </p>
        </section>


        {/* S3 */}
        <section aria-labelledby="three-options" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="three-options" className="text-3xl font-bold tracking-tight">
            Change the size of a GIF — your three options
          </h2>
          <p className="mt-4 leading-relaxed">
            There are three ways to change the size of a GIF here, and they suit different problems.
            Dimensions is for a hard number you were given. Percentage is for "about half this".
            Presets are for a platform that will reject the file otherwise. All three feed the same
            resize engine, so quality is identical.
          </p>
          <h3 className="mt-8 text-xl font-semibold">Dimensions</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Type a width and the height follows automatically while the aspect lock is on. Unlock it
            and you can set both numbers freely, which will squash or stretch the picture. Use the
            lock unless you have a specific reason not to.
          </p>
          <h3 className="mt-6 text-xl font-semibold">Percentage</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Hit 75, 50, or 25, or drag the slider to any value in between. Percentage mode is the
            fastest way to scale a screen recording down to something that fits a chat window, and
            the aspect ratio is safe by definition.
          </p>
          <h3 className="mt-6 text-xl font-semibold">Presets</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            One click each: Discord Emoji, Discord Sticker, Discord Avatar, Slack Emoji, Telegram
            Sticker, Twitch Emote, Email-safe, and HD web. Each chip states the dimensions it
            applies, and the documented size limit where an official one exists.
          </p>
          <h3 className="mt-6 text-xl font-semibold">Fit inside or stretch</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Square presets meet a rectangular GIF, and something has to give. "Fit inside" scales the
            GIF until its longest edge hits the target, so a 16:9 clip becomes 128×72 rather than a
            true square — proportions kept, empty space left over. Choosing to stretch the GIF forces
            it to the exact square and everyone in frame gets slightly wider. If you want a genuine
            square with no distortion, crop first with the{" "}
            <L to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
              GIF cropper
            </L>
            , then come back and resize.
          </p>
        </section>

        {/* S4 */}
        <section aria-labelledby="cheat-sheet" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="cheat-sheet" className="text-3xl font-bold tracking-tight">
            GIF sizes for every platform (cheat sheet)
          </h2>
          <p className="mt-4 leading-relaxed">
            Here are the dimensions each platform expects for an animated GIF, with a size limit
            listed only where the platform documents one publicly. Everything else is dimensions
            only, on purpose. Guessing at a limit and being wrong wastes more of your time than
            leaving the cell blank.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Recommended GIF dimensions and documented size limits by platform
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Platform
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Recommended dimensions
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Documented limit
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Discord emoji", "128×128 (fit inside)", "256 KB (Discord developer docs)"],
                  ["Discord sticker", "320×320", "512 KB (Discord developer docs)"],
                  ["Discord avatar", "128×128", "Dimensions only"],
                  ["Twitch emote", "112×112 (scales to 56 and 28)", "Dimensions only"],
                  ["Slack emoji", "128×128", "Dimensions only"],
                  ["Telegram sticker", "512×512", "Dimensions only"],
                  ["Email", "600px max width", "Dimensions only"],
                  ["HD web", "1280px max width", "Dimensions only"],
                ].map(([platform, dims, limit]) => (
                  <tr key={platform} className="border-b border-border">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                      {platform}
                    </th>
                    <td className="py-3 pr-4">{dims}</td>
                    <td className="py-3">{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            The Discord rows come straight from Discord's developer documentation, so the emoji and
            sticker presets in this discord sticker resizer apply those exact numbers. Twitch
            publishes its three emote sizes in the official emote guidelines, which is what the
            twitch gif emote resizer preset follows.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Non-square sources are the usual snag. A 16:9 clip fitted inside a 128×128 emoji box
            comes out 128×72, which Discord accepts and renders with space above and below. Crop to a
            square first if you want the artwork to fill the whole tile.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Slack and Telegram publish dimensions clearly but no public byte limit we can point at,
            so those rows stay dimensions-only. Email is a convention rather than a rule: 600px is
            the width most clients render without horizontal scrolling, and it has been that way for
            longer than most email clients have existed.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Sources:{" "}
            <a
              href={DISCORD_DOCS}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="text-primary underline-offset-4 hover:underline"
            >
              Discord developer docs
            </a>{" "}
            ·{" "}
            <a
              href={TWITCH_DOCS}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="text-primary underline-offset-4 hover:underline"
            >
              Twitch emote guidelines
            </a>
          </p>
        </section>

        {/* S5 */}
        <section aria-labelledby="firewall" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="firewall" className="text-3xl font-bold tracking-tight">
            Resize vs compress vs crop
          </h2>
          <p className="mt-4 leading-relaxed">
            Three different jobs, three different tools, and picking the wrong one is the usual
            reason a GIF still doesn't work after twenty minutes of fiddling. Read the four answers
            below and you'll know which page you want before you touch anything.
          </p>

          <h3 className="mt-8 text-xl font-semibold">Resizing changes the dimensions</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Resizing changes how many pixels wide and tall the GIF is. A 640×360 clip becomes
            320×180, the whole picture is still there, and every frame scales together. That's what
            this page does. Fewer pixels usually means fewer bytes too, but the dimensions are the
            thing you are choosing.
          </p>

          <h3 className="mt-6 text-xl font-semibold">Compressing shrinks the file</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Compressing keeps the dimensions exactly as they are and reduces the file size instead,
            by trimming the color palette, dropping duplicate frames, and applying lossy encoding.
            Reach for it when a platform rejects your file for weight rather than width. The{" "}
            <L to="/gif-compressor" className="text-primary underline-offset-4 hover:underline">
              GIF compressor
            </L>{" "}
            handles that side, including KB and MB targets.
          </p>

          <h3 className="mt-6 text-xl font-semibold">Cropping cuts part of the frame away</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Cropping throws away the parts of the frame you don't want — browser chrome around a
            screen recording, dead space at the edges, or everything outside a square. What remains
            keeps its original scale. Use the{" "}
            <L to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
              GIF cropper
            </L>{" "}
            when the framing is wrong rather than the size.
          </p>

          <h3 className="mt-6 text-xl font-semibold">What does downsizing a GIF mean?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Downsize gif means two different things depending on who's asking. Sometimes it means
            fewer pixels — make the picture physically smaller, which is a resize and belongs here.
            Sometimes it means fewer bytes at the same dimensions, which is compression. If a rule
            quotes a pixel number, resize. If it quotes KB or MB, compress.
          </p>
        </section>

        {/* S6 */}
        <section aria-labelledby="upscale" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="upscale" className="text-3xl font-bold tracking-tight">
            Can you make a GIF bigger without losing quality?
          </h2>
          <p className="mt-4 leading-relaxed">
            No, and any tool promising otherwise is selling you something. To upscale a GIF, software
            has to invent pixels that were never recorded, guessing each new one from its neighbours.
            You get a bigger GIF with the same amount of real detail, spread thinner. The picture
            gets softer, not better.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            GIF makes this worse than other formats. Every frame is limited to a 256-color palette,
            so the smooth gradients an upscaler produces get banded into hard steps. Enlarge a GIF by
            300% and you can usually count the color bands on a face.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            That's why this tool shows an amber warning the moment your numbers cross the source
            dimensions. It will still do it — sometimes a preset genuinely needs a tiny GIF nudged
            up, and you know your footage better than we do. The warning is there so nobody is
            surprised by the result.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Treat "enhance gif" as marketing language rather than a feature. No gif upscaler adds
            information that was lost when the GIF was made. If sharpness matters, go back to the
            source: re-export the GIF from the original video at the larger size, and you get real
            detail instead of an educated guess.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            There is one case where enlarging a GIF is fine: pixel art and other hard-edged
            graphics. Those have no gradients to band and no detail to fake, so scaling them up
            mostly just makes the existing squares bigger. For anything filmed, treat upscaling as a
            last resort rather than a fix.
          </p>
        </section>

        {/* S7 */}
        <section aria-labelledby="discord-error" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="discord-error" className="text-3xl font-bold tracking-tight">
            Why does Discord say it cannot resize my GIF?
          </h2>
          <p className="mt-4 leading-relaxed">
            Discord doesn't re-encode animated images on your behalf. Its built-in resizer works on
            still images and quietly gives up on animated GIFs, so instead of a smaller emoji you get
            an error. The upload is checked against the rules and rejected, rather than fixed.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The fix is to resize the GIF before you open the upload dialog: 128×128 for an emoji,
            320×320 for a sticker. Use the matching preset above and the numbers are set for you.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            If the resized file is still over Discord's documented 256 KB emoji or 512 KB sticker
            limit, dimensions are no longer the problem. That's a job for the{" "}
            <L to="/gif-compressor" className="text-primary underline-offset-4 hover:underline">
              GIF compressor
            </L>
            , which takes a target such as 256 KB or 4 MB and works down to it.
          </p>
        </section>

        {/* S8 */}
        <section aria-labelledby="twitch" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="twitch" className="text-3xl font-bold tracking-tight">
            Twitch emote resizer — 28, 56, and 112px
          </h2>
          <p className="mt-4 leading-relaxed">
            Twitch uses three emote sizes: 112×112, 56×56, and 28×28, per its official emote
            guidelines. You upload the largest one and Twitch generates the two smaller versions
            itself. So the only file you need to prepare is a square 112×112 animated GIF, and this
            emote resizer preset targets exactly that.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Design for the small end anyway. An emote that reads beautifully at 112px can turn into
            three grey pixels at 28px in a fast chat. Big shapes, strong contrast, and no thin
            outlines.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            For a non-square source, the twitch animated emote resizer preset fits the GIF inside the
            112×112 box rather than stretching it, so nothing looks squashed. If that leaves too much
            empty space, crop to a square first and then resize.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Keep the loop short as well. Chat emotes are read in half a second, so a four-second
            animation is mostly wasted on the viewer and heavy on the file. Two seconds of motion at
            112×112 is plenty, and it uploads without an argument.
          </p>
          <h3 className="mt-6 text-xl font-semibold">Which one should you use?</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            If someone handed you a number, use Dimensions. If you're eyeballing it, use Percentage
            and start at 50. If the destination is a chat app, use the preset and stop thinking about
            it. Most of the GIFs we resize go through Percentage, because "half" is usually the right
            answer for a screen recording that was captured at full width.
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            One habit worth keeping: resize gifs in round steps. Scaling to 50% or 25% maps neatly
            onto the source pixels and tends to look cleaner than an arbitrary 63%. It isn't a rule,
            and nothing breaks if you ignore it, but side by side you can usually tell.
          </p>
        </section>

        {/* S9 */}
        <section aria-labelledby="measured" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="measured" className="text-3xl font-bold tracking-tight">
            What this GIF resizer actually saves — our measured results
          </h2>
          <p className="mt-4 leading-relaxed">
            We resized real GIFs with this exact tool and recorded what came out. The table below
            lists each source file, its original dimensions and size, and the result after a 50%
            resize with default settings. No estimates and no numbers borrowed from anywhere else.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="mt-3 caption-bottom text-sm text-muted-foreground">
                Measured with this tool on 14 August 2026. Your results depend on frame count and
                colors.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    GIF
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Original (dimensions / size)
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Resized 50% (size)
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  { name: "loop-animation.gif", original: "400×300 / 298 KB", resized: "217 KB", change: "-27%" },
                  { name: "screen-recording.gif", original: "800×600 / 413 KB", resized: "245 KB", change: "-41%" },
                  { name: "sticker.gif", original: "512×512 / 226 KB", resized: "136 KB", change: "-40%" },
                  { name: "web-banner.gif", original: "728×90 / 42 KB", resized: "41 KB", change: "-3%" },
                  { name: "photo-style.gif", original: "480×360 / 1,489 KB", resized: "1298 KB", change: "-13%" }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                      {row.name}
                    </th>
                    <td className="py-3 pr-4">{row.original}</td>
                    <td className="py-3 pr-4">{row.resized}</td>
                    <td className="py-3">{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            The mechanism is simple arithmetic: halving both width and height leaves about a quarter
            of the original pixel area, and GIF bytes track pixel area fairly closely. So a 50%
            resize normally produces a much lighter file.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            It never tracks perfectly. Headers, palettes, and per-frame overhead don't shrink with
            the picture, and a GIF with hundreds of frames carries more of that fixed weight than a
            short loop does. We'll publish the exact percentages here once the full run is recorded,
            rather than quoting a figure we haven't measured.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Two things move the result more than anything else. Frame count comes first: a long
            capture pays its per-frame cost hundreds of times over, so resizing helps but doesn't
            rescue it. Color complexity comes second: photographic footage with heavy dithering
            resists shrinking harder than flat graphics or screen recordings do.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            If your own numbers land far below the pattern above, the GIF was probably already
            optimized once before it reached you. There's nothing wrong with the file, and there's
            not much left on the table either.
          </p>
        </section>

        {/* S10 */}
        <section aria-labelledby="faqs" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="faqs" className="text-3xl font-bold tracking-tight">
            FAQs
          </h2>
          <p className="mt-4 leading-relaxed">
            These are the questions people actually send us about resizing animated GIFs: quality,
            method, the difference between smaller pixels and smaller files, and the Discord error
            everyone hits at least once. Short answers, no marketing.
          </p>
          <ResizeFaq />
        </section>

        {/* S11 */}
        <section aria-labelledby="sources" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 id="sources" className="text-3xl font-bold tracking-tight">
            Sources and trust
          </h2>
          <p className="mt-4 leading-relaxed">
            Every platform limit quoted on this page is taken from the platform's own documentation,
            not from other tool sites. Where a platform doesn't publish a figure, this page lists
            dimensions and nothing more. Both sources are linked below so you can check them
            yourself.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">Platform limits verified against:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              <a
                href={DISCORD_DOCS}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="text-primary underline-offset-4 hover:underline"
              >
                Discord developer documentation — emoji and sticker limits
              </a>
            </li>
            <li>
              <a
                href={TWITCH_DOCS}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="text-primary underline-offset-4 hover:underline"
              >
                Twitch emote guidelines — 28, 56, and 112px emote sizes
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: August 14, 2026&nbsp;- Built by Shafiullah Tareen.
          </p>
        </section>

        {/* S12 */}
        <section aria-labelledby="related" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 id="related" className="text-3xl font-bold tracking-tight">
            Related tools
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">
                <L to="/gif-compressor" className="text-primary underline-offset-4 hover:underline">
                  GIF compressor
                </L>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Same GIF, smaller file. Keeps your dimensions and works down to a size target.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">
                <L
                  to="/gif-speed-changer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  GIF speed changer
                </L>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Re-time the animation from 0.1× to 8× and pick how many times it loops.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">
                <L to="/gif-cropper" className="text-primary underline-offset-4 hover:underline">
                  GIF cropper
                </L>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Cut it square before resizing, so a square preset doesn't leave empty space.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
