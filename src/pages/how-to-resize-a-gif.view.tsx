import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPost } from "@/lib/blog-posts";

const post = getPost("/blog/how-to-resize-a-gif");

const SRC = {
  discordEmoji: "https://discord.com/developers/docs/resources/emoji",
  twitchEmotes: "https://help.twitch.tv/s/article/emote-guidelines",
};

const toc = [
  ["answer", "How to resize a GIF, in short"],
  ["math", "Dimensions vs file size: the maths that matters"],
  ["three-ways", "Three ways to pick a new size"],
  ["aspect", "Aspect ratio: keep it, or stretch it on purpose"],
  ["upscale", "Can you make a GIF bigger without losing quality?"],
  ["resize-vs", "Resize vs compress vs crop"],
  ["platforms", "GIF sizes for the platforms people actually use"],
  ["quality", "Getting a clean result"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Will resizing a GIF make the file smaller too?",
    a: "Usually, yes, because fewer pixels means less picture to store — halving both sides leaves a quarter of the pixel area. But the file does not shrink by exactly that amount: headers, colour palettes, and per-frame overhead do not scale with the picture. If a platform rejects your file for its weight in KB or MB rather than its width in pixels, resizing alone may not be enough, and that is a job for the GIF compressor.",
  },
  {
    q: "Does resizing change how fast a GIF plays?",
    a: "No. Resizing changes the pixels in each frame; it does not touch the delay values that set the timing. The resized GIF plays at exactly the same speed and loops exactly as before. If the animation feels too fast or too slow, that is a speed problem, not a size problem.",
  },
  {
    q: "Why does my resized GIF look stretched?",
    a: "Almost always because the aspect lock was off, or a square preset was applied with stretch instead of fit. With the lock off, width and height are set independently, so a wide GIF forced into a square gets squashed. Redo the resize with the aspect lock on, or use the fit option for square presets, and the proportions come back.",
  },
  {
    q: "Can I make a small GIF bigger without losing quality?",
    a: "Not really. Enlarging a GIF means inventing pixels that were never recorded, so the picture gets bigger and softer at the same time. ZipGIF's resizer shows a warning when your target is larger than the source, and it will still do the resize if you ask — sometimes a preset genuinely needs a small GIF nudged up. If sharpness matters, re-export from the original video or image at the larger size instead.",
  },
  {
    q: "Why is my GIF still too big after resizing it?",
    a: "Because dimensions and file weight are different problems. If the GIF is long, has hundreds of frames, or is full of photographic noise, it can stay heavy even at small dimensions. After resizing to the size you actually need, run the GIF compressor, which works on the file weight directly.",
  },
  {
    q: "What is the difference between resizing and cropping a GIF?",
    a: "Resizing scales the whole picture: everything stays in frame, just at fewer (or more) pixels. Cropping cuts part of the frame away: the remaining area keeps its original scale, but the edges are gone. Resize when the picture is right but the size is wrong; crop when the framing is wrong.",
  },
];

function Cite({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  );
}

function In({ to, children }: { to: string; children: ReactNode }) {
  return (
    <L to={to} className="font-medium text-primary underline underline-offset-2">
      {children}
    </L>
  );
}

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-28 text-3xl font-bold tracking-tight">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-xl font-semibold tracking-tight">{children}</h3>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 leading-7 text-muted-foreground">{children}</p>;
}

function Figure({
  src,
  alt,
  w,
  h,
  caption,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption: string;
}) {
  return (
    <figure className="mt-8">
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-xl border border-border"
      />
      <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

const th = "border-b border-border px-4 py-3 text-left font-semibold";
const td = "border-b border-border px-4 py-3 text-muted-foreground";

function HowToResizeAGif() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 sm:px-6 md:py-16">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap gap-2">
              <li>
                <L to="/" className="hover:text-foreground">
                  Home
                </L>{" "}
                /
              </li>
              <li>
                <L to="/blog" className="hover:text-foreground">
                  Blog
                </L>{" "}
                /
              </li>
              <li aria-current="page" className="text-foreground">
                How to resize a GIF
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-sm text-foreground">
            By{" "}
            <L to="/about" className="font-medium text-primary underline underline-offset-2">
              Shafiullah Tareen
            </L>
            , creator of ZipGIF · Published <time dateTime={post.published}>{post.date}</time>
          </p>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={post.image}
              alt={post.alt}
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            To resize a GIF, open it in a resizer, pick the new size — exact pixels, a percentage,
            or a platform preset — and download the result with the animation intact. Resizing
            changes how many pixels wide and tall the picture is; it does not change the timing,
            and it is not the same job as compressing or cropping. Keep the aspect lock on unless
            you mean to stretch, and check the result at full size before you upload it.
          </p>

          <nav aria-label="Contents" className="mt-10">
            <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Contents
            </h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted-foreground">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-primary underline-offset-4 hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <H2 id="answer">How to resize a GIF, in short</H2>
          <P>
            The whole job takes about a minute in ZipGIF's{" "}
            <In to="/gif-resizer">GIF resizer</In>, and it runs entirely in your browser — the
            file never leaves your device, there is no signup, and the output has no watermark.
          </P>
          <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Add your GIF.</strong> Drop the file onto the
              tool, paste it from the clipboard, or paste a direct image URL. You can queue up to
              twenty GIFs at once and resize them all to the same size, with a single .zip at the
              end.
            </li>
            <li>
              <strong className="text-foreground">Pick a size.</strong> Use the Dimensions,
              Percentage, or Presets tab — the three options are explained below. The tool shows a
              before-and-after preview, so you can see the new dimensions before anything is
              processed.
            </li>
            <li>
              <strong className="text-foreground">Resize and download.</strong> Press Resize GIF
              and download the result. Every frame is scaled together, so the animation survives
              intact — a resized GIF is still a GIF, with the same timing and loop as the
              original.
            </li>
          </ol>
          <P>
            One thing worth knowing about what happens in between: most GIFs in the wild are
            frame-optimized, meaning each frame stores only the rectangle that changed since the
            previous one. Scaling those rectangles directly would leave ghost trails. The resizer
            rebuilds every frame in full first, scales the complete picture, then re-optimizes the
            file at the end. That is why the output looks right where a naive resize smears.
          </P>

          <H2 id="math">Dimensions vs file size: the maths that matters</H2>
          <P>
            Resizing changes dimensions. File size usually follows, but not by the same number, and
            understanding why saves a lot of confusion later. The key quantity is pixel area:
            width multiplied by height.
          </P>
          <P>
            Take an 800×600 GIF. That is 480,000 pixels per frame. Halve both sides to 400×300 and
            you get 120,000 pixels per frame — a quarter of the area, not a half. This catches
            people out: a 50% resize in each dimension is a 75% cut in pixels. The same maths in the
            other direction: a 640×360 clip (230,400 pixels) at 320×180 is 57,600 pixels, again a
            quarter. And a 25% resize leaves one sixteenth of the area.
          </P>
          <Figure
            src="/resize-dimensions-math.svg"
            alt="Halving both sides of a GIF quarters its pixel area: 800 by 600 becomes 400 by 300"
            w={1200}
            h={520}
            caption="Halving both sides quarters the pixel area. That is why a 50% resize usually shrinks a file far more than 50%."
          />
          <P>
            GIF bytes track pixel area fairly closely, but never exactly. Headers, colour palettes,
            and per-frame overhead do not shrink with the picture, and a GIF with hundreds of
            frames carries more of that fixed weight than a short loop does. So a 50% resize
            normally produces a much lighter file, but the exact saving depends on the GIF itself —
            photographic footage with heavy dithering resists shrinking harder than flat graphics
            or screen recordings. Treat any tool that promises an exact percentage as guessing.
          </P>
          <P>
            The practical consequence: if a platform gives you a pixel number, resize. If it gives
            you a KB or MB number, you need compression as well — or instead. The next sections
            keep those two jobs separate, because mixing them up is the most common reason a GIF
            still fails to upload after twenty minutes of fiddling.
          </P>

          <H2 id="three-ways">Three ways to pick a new size</H2>
          <P>
            ZipGIF's resizer offers three ways to choose a size, and they suit different problems.
            All three feed the same resize engine, so quality is identical whichever you pick.
          </P>
          <H3>Dimensions: when someone handed you a number</H3>
          <P>
            Type an exact width and height in pixels. The aspect lock is on by default, so typing a
            width makes the height follow automatically and the proportions stay correct. Unlock
            it only when you genuinely want to squash or stretch the picture — unlocking is how
            stretched GIFs happen, and it is almost never an accident worth keeping. Typed
            dimensions are clamped to a 5,000px maximum, a guard rail against a typo turning into a
            browser out-of-memory crash rather than a resize.
          </P>
          <H3>Percentage: when you want "about half this"</H3>
          <P>
            The percentage slider runs from 10% to 200% of the original, with quick chips for 75%,
            50%, and 25%. Percentage mode is the fastest way to scale a screen recording down to
            something that fits a chat window, and the aspect ratio is safe by definition — both
            sides scale by the same factor, so nothing can stretch. Most screen recordings captured
            at full width turn out right at 50%.
          </P>
          <H3>Presets: when a platform will reject the file otherwise</H3>
          <P>
            One click each for the sizes platforms actually ask for. The preset chips state the
            dimensions they apply, and a documented byte limit only where an official one exists —
            no invented limits. The full list, with the platform notes that matter, is in the
            platform table below.
          </P>

          <H2 id="aspect">Aspect ratio: keep it, or stretch it on purpose</H2>
          <P>
            Aspect ratio is just the relationship between width and height: a 16:9 clip is nearly
            twice as wide as it is tall, a square is 1:1. Keeping that relationship is what makes a
            resized GIF look like the same picture, only smaller. Breaking it is what makes people
            in frame look wider or taller than they are.
          </P>
          <P>
            Square presets meet rectangular GIFs constantly, and something has to give. The
            resizer offers two answers. "Fit inside" scales the GIF until its longest edge hits
            the target, so a 16:9 clip fitted inside a 128×128 emoji box comes out 128×72 —
            proportions kept, empty space left over, and Discord accepts and renders it with space
            above and below. "Stretch" forces the GIF to the exact square, and everyone in frame
            gets slightly wider. Fit is the honest default; stretch is for when a platform demands
            exact dimensions and you accept the distortion.
          </P>
          <Figure
            src="/resize-fit-vs-stretch.svg"
            alt="Fitting a wide GIF inside a square keeps its proportions with empty space, while stretching forces it square and distorts it"
            w={1200}
            h={520}
            caption="Fit inside keeps proportions and leaves empty space; stretch fills the square but distorts the picture."
          />
          <P>
            If you want a genuine square with no distortion and no empty space, neither option
            gives it to you — that is a cropping job, not a resizing job. Crop to a square first
            with the <In to="/gif-cropper">GIF cropper</In>, then come back and resize. The order
            matters: crop first, resize second, because cropping after resizing throws away pixels
            you already paid to scale.
          </P>

          <H2 id="upscale">Can you make a GIF bigger without losing quality?</H2>
          <P>
            No, and any tool promising otherwise is selling you something. To upscale a GIF,
            software has to invent pixels that were never recorded, guessing each new one from its
            neighbours. You get a bigger GIF with the same amount of real detail, spread thinner.
            The picture gets softer, not better.
          </P>
          <P>
            GIF makes this worse than other formats. Every frame is limited to a 256-colour
            palette, so the smooth gradients an upscaler produces get banded into hard steps.
            Enlarge a GIF by 300% and you can usually count the colour bands on a face. That is why
            the resizer shows a warning the moment your target numbers cross the source
            dimensions: it will still do the resize — sometimes a preset genuinely needs a tiny GIF
            nudged up, and you know your footage better than any tool does — but the warning is
            there so nobody is surprised by the result.
          </P>
          <P>
            Treat "enhance GIF" as marketing language rather than a feature. No upscaler adds
            information that was lost when the GIF was made. If sharpness matters, go back to the
            source: re-export the GIF from the original video at the larger size, and you get real
            detail instead of an educated guess. There is one case where enlarging a GIF is fine:
            pixel art and other hard-edged graphics. Those have no gradients to band and no detail
            to fake, so scaling them up mostly just makes the existing squares bigger. For anything
            filmed, treat upscaling as a last resort rather than a fix.
          </P>

          <H2 id="resize-vs">Resize vs compress vs crop</H2>
          <P>
            Three different jobs, three different tools, and picking the wrong one is the usual
            reason a GIF still does not work after a round of edits. The rule of thumb is simple:
            if a rule quotes a pixel number, resize; if it quotes KB or MB, compress.
          </P>
          <H3>Resizing changes the dimensions</H3>
          <P>
            Resizing changes how many pixels wide and tall the GIF is. A 640×360 clip becomes
            320×180, the whole picture is still there, and every frame scales together. Fewer pixels
            usually means fewer bytes too, but the dimensions are the thing you are choosing.
          </P>
          <H3>Compressing shrinks the file</H3>
          <P>
            Compressing keeps the dimensions exactly as they are and reduces the file size instead,
            by trimming the colour palette, dropping duplicate frames, and applying lossy encoding.
            Reach for the <In to="/gif-compressor">GIF compressor</In> when a platform rejects
            your file for weight rather than width — including when a resized GIF is still over a
            KB limit.
          </P>
          <H3>Cropping cuts part of the frame away</H3>
          <P>
            Cropping throws away the parts of the frame you do not want — browser chrome around a
            screen recording, dead space at the edges, or everything outside a square. What remains
            keeps its original scale. Use the <In to="/gif-cropper">GIF cropper</In> when the
            framing is wrong rather than the size. And if the animation is too long rather than too
            big, trimming — cutting frames from the start or end — is yet another job again, covered
            in the guide to{" "}
            <In to="/blog/how-to-make-a-gif-size-smaller">making a GIF smaller</In>.
          </P>

          <H2 id="platforms">GIF sizes for the platforms people actually use</H2>
          <P>
            Here are the dimensions each platform expects, taken from ZipGIF's resizer presets —
            which in turn use the platforms' own published figures. A byte limit is listed only
            where the platform documents one publicly; everything else is dimensions only, on
            purpose. Guessing at a limit and being wrong wastes more of your time than leaving the
            cell blank.
          </P>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Recommended GIF dimensions and documented size limits by platform
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Platform
                  </th>
                  <th scope="col" className={th}>
                    Dimensions
                  </th>
                  <th scope="col" className={th}>
                    Documented limit
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Discord emoji", "128×128 (fit inside)", "256 KB (Discord developer docs)"],
                  ["Discord sticker", "320×320", "512 KB (Discord developer docs)"],
                  ["Discord avatar", "128×128", "Dimensions only"],
                  ["Twitch emote", "112×112 (scales to 56 and 28)", "Dimensions only in this table — also check Twitch's current emote file-size and frame limits before uploading an animated emote."],
                  ["Slack emoji", "128×128", "Dimensions only"],
                  ["Telegram sticker", "512×512", "Dimensions only"],
                  ["Email", "600px max width", "Dimensions only"],
                  ["HD web", "1280px max width", "Dimensions only"],
                ].map(([platform, dims, limit]) => (
                  <tr key={platform}>
                    <th scope="row" className="border-b border-border px-4 py-3 font-medium text-foreground">
                      {platform}
                    </th>
                    <td className={td}>{dims}</td>
                    <td className={td}>{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            Two platform notes are worth knowing before you upload. Twitch uses three emote sizes
            — 112×112, 56×56, and 28×28, per its official emote guidelines — but you upload the
            largest one and Twitch generates the two smaller versions itself, so the only file you
            need to prepare is a square 112×112 GIF. Design for the small end anyway: an emote that
            reads beautifully at 112px can turn into a few grey pixels at 28px in a fast chat, so
            big shapes, strong contrast, and no thin outlines. And on Discord, remember that
            hitting the dimensions is only half the upload check: a 128×128 emoji still has to come
            in under 256 KB, and a 320×320 sticker under 512 KB. If the resized file is still over
            the limit, dimensions are no longer the problem — compress it.
          </P>
          <P>
            Email is a convention rather than a rule: 600px is the width most clients render without
            horizontal scrolling. HD web at 1280px max width is the same kind of judgement call — a
            GIF wider than most screens is rarely worth its weight. Neither is a platform rule, and
            neither should be treated as one.
          </P>

          <H2 id="quality">Getting a clean result</H2>
          <P>
            A few habits separate a resize that looks native from one that looks processed. First,
            resize in round steps where you can: scaling to 50% or 25% maps neatly onto the source
            pixels and tends to look cleaner than an arbitrary 63%. It is not a rule, and nothing
            breaks if you ignore it, but side by side you can usually tell. Second, judge the result
            at 100% zoom, at the size people will actually see it — a GIF that looks crisp in a
            small preview can show its softness once it fills a chat window. Third, resize to the
            display size before compressing, not after: compressing first and then resizing means
            the compressor spent its effort on pixels you then throw away.
          </P>
          <P>
            Finally, remember what resizing does not do. It does not change the timing, it does not
            remove frames, and it does not fix a GIF that was blurry to begin with — scaling a soft
            source down can hide some softness, but it cannot restore detail that was never there.
            If the source is the problem, the fix is a better source, not a bigger resize. The
            companion guide to <In to="/blog/why-is-my-gif-so-big">why a GIF gets so big</In>{" "}
            walks through the other causes — frame count, colours, and noise — when dimensions are
            not the culprit.
          </P>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>The GIF looks stretched or squashed</H3>
          <P>
            The aspect lock was off, or a square preset was applied with stretch instead of fit.
            Redo the resize with the lock on, or choose fit for square presets. If you actually need
            a true square with no distortion and no empty space, crop to a square first and then
            resize.
          </P>
          <H3>The GIF is the right size but still rejected</H3>
          <P>
            Check whether the rejection is about pixels or bytes. Discord, for example, checks both:
            an emoji must be 128×128 and under 256 KB. If the dimensions are right, the file is still
            too heavy, and that is a compression job. The same applies anywhere a KB or MB number is
            quoted.
          </P>
          <H3>The resized GIF looks blurry</H3>
          <P>
            If you enlarged it, that is upscaling, and softness is the expected result — re-export
            from the source at the larger size if you can. If you shrank it, check the result at the
            size it will actually be displayed: heavy downscaling of fine text or thin lines can
            shimmer, and a gentler step (75% instead of 25%) sometimes reads better.
          </P>
          <H3>Discord says it cannot resize the GIF</H3>
          <P>
            Discord's built-in resizer works on still images and quietly gives up on animated GIFs,
            so instead of a smaller emoji you get an error. Resize the GIF before you open the upload
            dialog — 128×128 for an emoji, 320×320 for a sticker — and the upload check passes on
            dimensions.
          </P>

          <H2 id="faq">FAQ</H2>
          <div className="mt-6 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>

          <H2 id="sources">Sources</H2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-muted-foreground">
            <li>
              <Cite href={SRC.discordEmoji}>
                Discord developer documentation — emoji and sticker limits
              </Cite>
            </li>
            <li>
              <Cite href={SRC.twitchEmotes}>
                Twitch emote guidelines — 28, 56, and 112px emote sizes
              </Cite>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Platform rules change. The Discord and Twitch figures above were taken from the linked
            pages and from ZipGIF's resizer presets, which use the same published figures; if an
            upload fails, check the platform's current page before assuming the numbers above still
            hold. No file-size reduction percentage is quoted in this article, because the saving
            from a resize depends on the individual GIF — headers, palettes, and per-frame overhead
            do not shrink with the picture.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToResizeAGif;
