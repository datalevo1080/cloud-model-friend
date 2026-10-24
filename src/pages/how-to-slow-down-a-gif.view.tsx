import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SRC = {
  spec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  mdn: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
};

const toc = [
  ["methods", "The four ways to slow a GIF down"],
  ["delays-vs-duplicates", "Longer delays, duplicated frames, or fewer frames?"],
  ["worked-example", "A worked example: halving the speed"],
  ["tradeoffs", "What slowing down costs"],
  ["comparison", "Method comparison"],
  ["tutorial", "How to slow down a GIF, step by step"],
  ["zipgif", "Slowing a GIF with ZipGIF"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Does slowing down a GIF reduce its quality?",
    a: "Not when you scale the delays: the pixels are untouched, so the picture is exactly as sharp as before. What changes is how long each picture stays on screen. Quality only suffers if you also resize, cut colours, or drop frames in the same edit.",
  },
  {
    q: "Can I slow down only part of a GIF?",
    a: "Yes, because delays are stored per frame. In an animation editor you can give longer delays to just the frames you want to linger on and leave the rest alone. ZipGIF's speed control scales the whole animation at once, so for a partial slowdown use an editor that edits frames individually.",
  },
  {
    q: "Why does my slowed GIF look like a slideshow?",
    a: "Slowing down exposes how few frames the source has. A GIF recorded at 10 frames per second already holds each frame for 100 ms; at quarter speed each frame holds for 400 ms, and the eye starts seeing stills instead of motion. Slow less, or accept that the source cannot look smoother than it was captured.",
  },
  {
    q: "Does slowing a GIF make the file bigger?",
    a: "Scaling delays alone does not: the same frames are stored, only their timing values change, so the size stays close to the original. Duplicating frames does make the file bigger, because every copy is stored as another frame. Re-encoding can shift the size slightly either way.",
  },
  {
    q: "What speed should I pick for readable text or subtitles?",
    a: "Start at 0.5x and watch the result at the size it will actually be viewed. If a caption is still unreadable, try 0.25x, but check whether the motion has turned choppy. There is no universal right value: it depends on how fast the text moves and how many frames the source has.",
  },
  {
    q: "Will the slowed GIF play at the same speed everywhere?",
    a: "Not always. Viewers round delays to the format's 10 ms steps and may substitute a slower default for very short delays, and chat apps often convert GIFs to video and retime them. Always test the finished file in the app or browser where it will be seen.",
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
  eager,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption: string;
  eager?: boolean;
}) {
  return (
    <figure className="mt-8">
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-auto w-full rounded-xl border border-border"
      />
      <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

const th = "border-b border-border px-4 py-3 text-left font-semibold";
const td = "border-b border-border px-4 py-3 text-muted-foreground";

function HowToSlowDownAGif() {
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
                How to slow down a GIF
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How to Slow Down a GIF Without Making It Choppy
          </h1>
          <p className="mt-5 text-sm text-foreground">
            By{" "}
            <L to="/about" className="font-medium text-primary underline underline-offset-2">
              Shafiullah Tareen
            </L>
            , creator of ZipGIF · Published <time dateTime="2026-10-24">October 24, 2026</time>
          </p>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src="/og-how-to-slow-down-a-gif.jpg"
              alt="How to slow down a GIF without making it choppy: frame timing, methods, and trade-offs explained by ZipGIF"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            To slow a GIF down, give each frame more time on screen. The cleanest way is to stretch
            the frame delays: the animation keeps every frame, in the same order, and simply plays
            each one longer. Duplicating frames can look similar but stores more data, and deleting
            frames does not slow anything at all — it removes moments instead.
          </p>

          <Figure
            src="/blog/slow-down-timing.svg"
            alt="Timing diagram: 8 frames at 100 milliseconds each last 0.8 seconds, and the same 8 frames at 200 milliseconds each last 1.6 seconds"
            w={960}
            h={380}
            caption="Doubling every delay doubles the loop time. Same frames, same order, twice the time."
          />

          <nav
            aria-labelledby="toc-title"
            className="mt-10 rounded-xl border border-border bg-card p-6"
          >
            <p id="toc-title" className="font-semibold">
              In this guide
            </p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-primary hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <H2 id="methods">The four ways to slow a GIF down</H2>
          <P>
            A GIF has no speed setting of its own. Each frame carries a delay value that says how
            long to show that frame before moving on, and the GIF89a specification stores that delay
            in hundredths of a second (<Cite href={SRC.spec}>GIF89a specification</Cite>). So every
            method of slowing a GIF down is really a way of changing what those delays say, or of
            changing the frames themselves:
          </P>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Scale the frame delays.</strong> Multiply every
              delay by the same factor. At half speed, a 100 ms frame becomes 200 ms. Nothing is
              added or removed.
            </li>
            <li>
              <strong className="text-foreground">Use a tool's speed control.</strong> A speed
              setting such as 0.5x is the same operation, computed for you: the tool rewrites each
              frame's delay so the whole animation plays at the chosen fraction of its original
              speed.
            </li>
            <li>
              <strong className="text-foreground">Duplicate frames.</strong> Show each frame twice
              (or more) at the original delay. The animation takes longer to play through, but the
              file now stores every picture twice.
            </li>
            <li>
              <strong className="text-foreground">Remove frames.</strong> This is the odd one out:
              it does not slow motion. Cutting frames shortens the animation and makes the remaining
              motion jump further between poses. It belongs in a trimming workflow, not a slowing
              one.
            </li>
          </ul>
          <P>
            The first two are the same idea at different levels of convenience, and they are the
            right default. Duplication is a fallback for editors that cannot edit delays directly.
            Removal is included here only because it is so often mistaken for a way to slow things
            down — it is not.
          </P>

          <H2 id="delays-vs-duplicates">Longer delays, duplicated frames, or fewer frames?</H2>
          <P>
            For a GIF where every frame has the same delay, scaling delays and duplicating frames
            look identical on screen. A 100 ms frame shown twice is on screen for 200 ms either way.
            The difference is in the file: delay scaling stores the picture once and waits longer,
            while duplication stores the picture twice. Delay scaling is therefore the better
            default — same visible result, smaller file, fewer frames to decode.
          </P>
          <P>
            The deeper difference is between changing timing and changing content. Scaling delays
            preserves the animation exactly: every pose the original had is still there, in the same
            order, for a proportionally longer time. Deleting frames changes the animation itself. A
            hand wave that took eight frames now takes four, so the hand jumps twice as far between
            poses. The result is shorter and choppier, and no delay adjustment afterwards can
            restore the poses that were thrown away.
          </P>
          <P>
            Variable timing deserves extra care. Many GIFs hold some frames longer than others — a
            pause on the final frame, for example. Scaling each frame's own delay keeps those
            proportions: the pause stays proportionally longer than the other frames. Overwriting
            every frame with one uniform delay flattens that rhythm, so a deliberate pause can
            disappear. If the animation has a rhythm worth keeping, scale the delays rather than
            replacing them. To see what timing a GIF actually uses,{" "}
            <In to="/gif-splitter">inspect its individual frames</In> and read each frame's delay
            before you change anything.
          </P>
          <Figure
            src="/blog/slow-down-methods.svg"
            alt="Comparison diagram: scaling delays gives 8 frames over 1.6 seconds at the same file size, duplicating frames gives 16 frames over 1.6 seconds with a larger file, deleting frames gives 4 frames over 0.4 seconds, shorter rather than slower"
            w={960}
            h={460}
            caption="Three edits, three outcomes. Only the first two slow the animation; deleting frames shortens it."
          />

          <H2 id="worked-example">A worked example: halving the speed</H2>
          <P>
            Take a uniform-delay animation: 40 frames, each held for 50 ms. Its cycle duration is 40
            × 50 ms = 2,000 ms, or 2 seconds. Halving the speed means doubling every delay: 40
            frames × 100 ms = 4,000 ms, or 4 seconds. The frame count is unchanged, the order is
            unchanged, and the loop simply takes twice as long. In nominal frame-rate terms — the
            arithmetic value 1 ÷ delay, not a guaranteed playback rate — the animation goes from 20
            nominal frames per second to 10.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[420px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                Arithmetic examples for the same 40-frame animation, not measured files
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Speed
                  </th>
                  <th scope="col" className={th}>
                    Delay per frame
                  </th>
                  <th scope="col" className={th}>
                    Cycle duration
                  </th>
                  <th scope="col" className={th}>
                    Nominal frame rate
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>1x (original)</td>
                  <td className={td}>50 ms</td>
                  <td className={td}>2.0 s</td>
                  <td className={td}>20 fps</td>
                </tr>
                <tr>
                  <td className={td}>0.75x</td>
                  <td className={td}>70 ms*</td>
                  <td className={td}>2.8 s*</td>
                  <td className={td}>14 fps*</td>
                </tr>
                <tr>
                  <td className={td}>0.5x</td>
                  <td className={td}>100 ms</td>
                  <td className={td}>4.0 s</td>
                  <td className={td}>10 fps</td>
                </tr>
                <tr>
                  <td className={td}>0.25x</td>
                  <td className={td}>200 ms</td>
                  <td className={td}>8.0 s</td>
                  <td className={td}>5 fps</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            The starred row shows the format's timing granularity at work. Delays are stored as
            whole hundredths of a second, so the timing grid has 10 ms steps. Slowing 50 ms frames
            to 0.75x ideally gives 66.7 ms per frame, but the nearest storable value is 70 ms — so
            the real cycle is 40 × 70 ms = 2.8 seconds, slightly slower than the ideal 2.67 seconds.
            The error is small here, but it is a reason to treat scaled timing as approximate: the
            file stores the nearest representable delay, and the viewer then plays that.
          </P>
          <P>
            One more specification detail matters for fast GIFs. The specification defines the delay
            as the wait "if not 0" (<Cite href={SRC.spec}>GIF89a, Graphic Control Extension</Cite>),
            which means a stored delay of 0 does not specify a wait at all — viewers fall back to a
            default instead. A GIF that looks frantically fast may therefore carry 0 delays rather
            than genuinely short ones, and scaling its delays still works: the tool reads the
            effective timing and writes real delays in its place.
          </P>

          <H2 id="tradeoffs">What slowing down costs</H2>
          <P>
            Slowing a GIF down is cheap in bytes and expensive in feel. Three trade-offs decide
            whether the result is usable.
          </P>
          <H3>Motion gets choppier as it gets slower</H3>
          <P>
            Slowing down cannot add information. A source recorded at 10 frames per second holds
            each frame for 100 ms; at quarter speed each frame holds for 400 ms, and the eye starts
            seeing a sequence of stills instead of motion. This is the main reason slowed GIFs look
            bad: the problem is not the slowing, it is the low frame count it exposes. Video tools
            can interpolate new in-between frames to smooth slow motion, but the GIF format has no
            such feature — a slowed GIF commits harder to the frames it already has. If smoothness
            matters more than slowness, slow less.
          </P>
          <H3>The loop gets longer</H3>
          <P>
            At 0.5x, a 2-second loop becomes a 4-second loop, and a loop set to repeat forever now
            takes twice as long to reach any given moment. That matters when the GIF is a tutorial
            or a captioned clip: a viewer who only watches for a few seconds may never reach the end
            of a slowed cycle. The loop count itself is untouched by a speed change, so if the total
            viewing time is the problem, change the loop setting or trim the animation rather than
            the speed.
          </P>
          <H3>File size barely moves — unless you duplicate</H3>
          <P>
            Delay scaling changes timing values, not pixels, so the slowed file stays close to the
            original size; re-encoding can shift it slightly either way, but the slower clock alone
            adds no weight. Duplicating frames is the exception: every copy is stored as another
            frame, so the file grows with the slowdown. And remember that deleting frames shrinks a
            file by removing content, which is a different bargain from slowing it down.
          </P>

          <H2 id="comparison">Method comparison</H2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                General tendencies, not measured results — outcomes vary with the source file
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Method
                  </th>
                  <th scope="col" className={th}>
                    What changes
                  </th>
                  <th scope="col" className={th}>
                    Frames kept
                  </th>
                  <th scope="col" className={th}>
                    Cycle duration
                  </th>
                  <th scope="col" className={th}>
                    File size
                  </th>
                  <th scope="col" className={th}>
                    Best for
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Scale frame delays</td>
                  <td className={td}>Each delay grows</td>
                  <td className={td}>All</td>
                  <td className={td}>Longer</td>
                  <td className={td}>About the same</td>
                  <td className={td}>Most slowdowns</td>
                </tr>
                <tr>
                  <td className={td}>Tool speed control (below 1x)</td>
                  <td className={td}>Each delay scaled for you</td>
                  <td className={td}>All</td>
                  <td className={td}>Longer</td>
                  <td className={td}>About the same</td>
                  <td className={td}>Quick slowdowns with a preview</td>
                </tr>
                <tr>
                  <td className={td}>Duplicate frames</td>
                  <td className={td}>Each picture stored twice</td>
                  <td className={td}>All, plus copies</td>
                  <td className={td}>Longer</td>
                  <td className={td}>Larger</td>
                  <td className={td}>Editors that cannot edit delays</td>
                </tr>
                <tr>
                  <td className={td}>Delete frames</td>
                  <td className={td}>Poses removed</td>
                  <td className={td}>Fewer</td>
                  <td className={td}>Shorter</td>
                  <td className={td}>Smaller</td>
                  <td className={td}>Trimming, not slowing</td>
                </tr>
              </tbody>
            </table>
          </div>

          <H2 id="tutorial">How to slow down a GIF, step by step</H2>
          <P>
            The general workflow is the same in any animation editor that shows per-frame timing:
          </P>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              Open the GIF in an editor that lists frames and their delays, and check whether the
              timing is uniform or variable. Note any deliberate pauses before you change anything.
            </li>
            <li>
              Select all frames. If the editor offers a speed percentage, pick one below 100% — 50%
              is a good first try. If it offers delay values instead, multiply each delay by the
              same factor.
            </li>
            <li>
              Keep variable timing proportional: scale each frame's own delay rather than
              overwriting all of them with one value, so pauses stay pauses.
            </li>
            <li>
              Preview at the size the GIF will actually be viewed. Small previews hide choppiness,
              and a slowed GIF that looks fine as a thumbnail can feel like a slideshow at full
              size.
            </li>
            <li>
              Export as a GIF and check the loop time. If the editor reports it, compare it with
              your target: at 0.5x it should be double the original.
            </li>
          </ol>
          <P>
            From the command line, the same job is a delay rewrite. Gifsicle's delay option writes
            the delay for frames, so a uniform value flattens variable timing while per-frame values
            preserve it — the same distinction as in an editor, just expressed as flags. Whichever
            route you take, check the finished file in the viewer where it will actually be seen,
            not only in the editor: viewers round delays to the format's 10 ms steps and may
            substitute a slower default for very short delays, so encoded timing and observed
            playback are not always identical.
          </P>

          <H2 id="zipgif">Slowing a GIF with ZipGIF</H2>
          <P>
            If you do not want to edit delays by hand,{" "}
            <In to="/gif-speed-changer">change GIF playback speed</In> with ZipGIF's speed changer.
            Drop a GIF in, pick a speed below 1x — presets of 0.25x, 0.5x, and 0.75x, or the slider
            anywhere from 0.1x to 8x — and set how it loops: keep the original loop, loop forever,
            play once, or repeat a custom number of times. The readout shows the loop time before
            and after, so you can see the slowdown before you download. Slowing down never drops
            frames in this tool, each frame keeps its own share of the timing, and no delay is
            written below 2 hundredths of a second. The work runs in your browser, so the GIF is not
            uploaded anywhere. This section is deliberately short: the tool page itself carries the
            full walkthrough.
          </P>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>It still seems too fast</H3>
          <P>
            Check that you picked a speed below 1x — above 1x speeds the GIF up. If the source used
            very short or 0 delays, scale further: a 0.5x slowdown of a 20 ms frame still leaves a
            40 ms frame, which can read as fast. Test the result in a second viewer to rule out one
            app's timing habits.
          </P>
          <H3>It became choppy</H3>
          <P>
            The source frame rate is the limit. Slow less — 0.75x instead of 0.25x — or accept the
            trade-off. Duplicating frames will not help: it repeats the same poses, so the motion
            stays just as stepped.
          </P>
          <H3>It plays differently across viewers</H3>
          <P>
            Delays are rounded to 10 ms steps, viewers may substitute a slower default for very
            short delays, and chat apps often convert GIFs to video and retime them. Keep delays at
            or above 20 ms for the most consistent playback, and always test the finished file on
            its destination.
          </P>
          <H3>The file got bigger</H3>
          <P>
            You probably duplicated frames, or the re-encode stored frames less efficiently than the
            original. Redo the slowdown with delay scaling instead of duplication, and if the file
            is still too large, <In to="/gif-compressor">reduce GIF file size</In> as a separate
            step.
          </P>
          <H3>The loop feels endless now</H3>
          <P>
            Slowing doubles the time each loop takes, so a forever loop can feel much longer. Set
            the loop to play once or a custom count in the speed changer, or{" "}
            <In to="/gif-trimmer">trim a GIF</In> to the section that matters before slowing it.
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
              <Cite href={SRC.spec}>W3C: Graphics Interchange Format, Version 89a</Cite> — frame
              delay stored in the Graphic Control Extension in hundredths of a second; the wait is
              defined "if not 0".
            </li>
            <li>
              <Cite href={SRC.mdn}>MDN: Image file type and format guide</Cite> — GIF as a widely
              supported basic animation format.
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            ZipGIF-specific behaviour described above — speed presets and slider range, loop
            settings, no frame dropping when slowing, and the 2-hundredths minimum delay — reflects
            the site's speed-changer implementation. Viewer behaviour varies by app and version, so
            test the finished file on its destination.
          </p>

          <p className="mt-10 rounded-xl border border-border bg-muted/30 p-5 leading-7 text-muted-foreground">
            Next step: if the animation is right but the file is too big, or the moment needs
            trimming first, work through the method that matches the actual problem — then{" "}
            <In to="/gif-speed-changer">slow it down with the GIF speed changer</In>.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToSlowDownAGif;
