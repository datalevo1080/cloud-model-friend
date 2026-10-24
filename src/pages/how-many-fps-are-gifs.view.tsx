import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SRC = {
  spec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  mdn: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
  fastestGif: "https://www.biphelps.com/blog/The-Fastest-GIF-Does-Not-Exist",
};

const toc = [
  ["fps-vs-delays", "FPS for video, delays for GIFs"],
  ["frame-delays", "Each frame carries its own delay"],
  ["calculate", "How to calculate nominal FPS"],
  ["variable-delays", "Variable delays: why one FPS number can mislead"],
  ["encoded-vs-observed", "Encoded timing versus observed playback"],
  ["changing-timing", "Changing delays, dropping frames, duplicating frames"],
  ["inspect", "How to inspect a GIF's frames and timing"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Can a GIF be 60 FPS?",
    a: "Not exactly. 60 frames per second needs a frame every 16.7 ms, and GIF delays can only be whole hundredths of a second. The nearest encodable delays are 20 ms (50 nominal FPS) and 10 ms (100 nominal FPS, which browsers typically slow down). A file sold as a “60 FPS GIF” is usually a video in disguise, or a GIF rounded to a nearby rate.",
  },
  {
    q: "What frame delay should I use for a smooth GIF?",
    a: "Start from the motion you already have, not a target number. Smoothness comes from source frames showing small steps of movement; a delay only sets how long each step is shown. As a working range, 20 to 50 ms per frame (50 to 20 nominal FPS) covers most animations, and delays below 20 ms are wasted because viewers slow them down.",
  },
  {
    q: "Does a higher FPS make a GIF file bigger?",
    a: "Not by itself. File size depends on frame count, dimensions, colours and how much changes between frames. Shortening delays raises the nominal FPS but keeps the same frames, so the file barely changes size. Adding frames to raise the frame rate, for example when converting from video, does make the file bigger.",
  },
  {
    q: "Does looping change a GIF's FPS?",
    a: "No. Looping replays the same cycle of frames. A 2-second cycle at 10 nominal FPS still plays at 10 nominal FPS on every loop; looping changes how long the animation keeps going, not how fast each cycle runs.",
  },
  {
    q: "Why does my GIF play at different speeds on different devices?",
    a: "Because stored delays are only a request. Viewers clamp very short delays, screens refresh on their own schedule, and slower devices lag on heavy frames. Some apps also transcode GIFs to video, re-timing them. Delays of 20 ms or more are the most consistent across viewers.",
  },
  {
    q: "Is the FPS shown by a video tool the same as a GIF's FPS?",
    a: "Only loosely. A video tool usually assumes one constant frame rate for the whole clip. A GIF has no such field, so any FPS figure for a GIF is derived from its delays. With variable delays that figure is an average across the cycle, not a promise about how any single moment plays.",
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

function HowManyFpsAreGifs() {
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
                How many FPS are GIFs?
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How Many FPS Are GIFs? Frame Delays Explained
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
              src="/og-how-many-fps-are-gifs.svg"
              alt="How many FPS are GIFs: GIF frame delays and nominal frame rate explained by ZipGIF"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            A GIF has no single frame rate. Unlike a video, which usually plays at one fixed rate
            such as 24 or 30 frames per second, a GIF stores a separate delay for every frame. The
            speed you perceive is just those delays added up. If every frame waits 100 milliseconds,
            the animation runs at a nominal 10 frames per second — but that number is calculated
            from the delays, not stored in the file, and different viewers may not play it at
            exactly that speed.
          </p>

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

          <H2 id="fps-vs-delays">FPS for video, delays for GIFs</H2>
          <P>
            Frames per second (FPS) is a video idea. A video file normally declares one frame rate,
            and the player shows a new frame on a regular schedule: at 30 FPS, a new frame every
            33.3 milliseconds; at 60 FPS, one every 16.7 milliseconds. Every frame gets the same
            slice of time, so the rate fully describes the timing.
          </P>
          <P>
            A GIF works differently. It is a sequence of images, and the file carries no frame-rate
            field at all. Instead, each image can be preceded by a control block that says how long
            that image should stay on screen before the next one appears. Because each frame can
            wait a different amount of time, there is no single number stored in the file that
            answers “how many FPS is this GIF?”. You can only work a number out from the delays —
            and that number is an approximation, not a property of the format.
          </P>
          <P>
            That distinction matters when tools disagree: a video editor reporting “30 FPS” reads a
            declared rate, while a tool reporting a GIF's FPS is doing arithmetic on its delays —
            and two tools can average those delays differently.
          </P>

          <H2 id="frame-delays">Each frame carries its own delay</H2>
          <P>
            The timing lives in the Graphic Control Extension, the block that appears before an
            image in the file. The GIF89a specification defines its Delay Time field as an unsigned
            two-byte number: “If not 0, this field specifies the number of hundredths (1/100) of a
            second to wait before continuing with the processing of the Data Stream,” with the clock
            starting as soon as the image has been rendered (
            <Cite href={SRC.spec}>GIF89a specification, Graphic Control Extension</Cite>).
          </P>
          <P>
            Three consequences follow. First, delays are whole hundredths of a second: a frame can
            wait 10 ms, 20 ms or 30 ms, but never 15 ms or 16.7 ms. Second, the largest two-byte
            value is 65,535 hundredths, about 655 seconds — the maximum delay of one frame, not of
            the whole animation. Third, the specification only defines non-zero delays; a delay of 0
            is left to the viewer, which is one reason playback differs between apps.
          </P>
          <P>
            Because each delay belongs to its own frame, a GIF can hold some frames longer than
            others: a quick flash, a normal step, then a long pause on the final frame. That
            flexibility is exactly what a single FPS figure cannot express.
          </P>

          <H2 id="calculate">How to calculate nominal FPS</H2>
          <P>
            When every frame uses the same delay, the calculation is simple. Divide one second by
            the delay of one frame:
          </P>
          <p className="mt-4 rounded-lg bg-muted px-4 py-3 font-mono text-sm">
            nominal FPS = 1 ÷ frame duration in seconds
          </p>
          <P>
            For a 100 ms delay, that is 1 ÷ 0.1 = 10 nominal FPS. For 50 ms, 1 ÷ 0.05 = 20. For 200
            ms, 1 ÷ 0.2 = 5. The word “nominal” matters: it signals that the figure is calculated
            from the stored delays, not measured during playback and not guaranteed by any viewer.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                Arithmetic examples for equal frame delays, not measured files
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Delay per frame
                  </th>
                  <th scope="col" className={th}>
                    Delay in hundredths
                  </th>
                  <th scope="col" className={th}>
                    Nominal FPS
                  </th>
                  <th scope="col" className={th}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>200 ms</td>
                  <td className={td}>20</td>
                  <td className={td}>5</td>
                  <td className={td}>Slow, readable motion</td>
                </tr>
                <tr>
                  <td className={td}>100 ms</td>
                  <td className={td}>10</td>
                  <td className={td}>10</td>
                  <td className={td}>Common for simple animations</td>
                </tr>
                <tr>
                  <td className={td}>50 ms</td>
                  <td className={td}>5</td>
                  <td className={td}>20</td>
                  <td className={td}>Brisk motion</td>
                </tr>
                <tr>
                  <td className={td}>40 ms</td>
                  <td className={td}>4</td>
                  <td className={td}>25</td>
                  <td className={td}>A frequent video-like rate</td>
                </tr>
                <tr>
                  <td className={td}>30 ms</td>
                  <td className={td}>3</td>
                  <td className={td}>33</td>
                  <td className={td}>Nearest encodable value to 30 FPS</td>
                </tr>
                <tr>
                  <td className={td}>20 ms</td>
                  <td className={td}>2</td>
                  <td className={td}>50</td>
                  <td className={td}>Fastest delay browsers reliably honour</td>
                </tr>
                <tr>
                  <td className={td}>10 ms</td>
                  <td className={td}>1</td>
                  <td className={td}>100 nominal</td>
                  <td className={td}>Viewers typically slow this to about 100 ms</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            The same delays also give you the cycle duration: multiply the frame count by the delay.
            A GIF with 24 frames at 50 ms each runs one cycle of 24 × 0.05 = 1.2 seconds. If it
            loops, that 1.2-second cycle simply repeats; looping does not change the frame rate.
          </P>
          <Figure
            src="/blog/fps-equal-delay-timeline.svg"
            alt="Timeline of 10 frames each shown for 100 milliseconds, adding up to a 1 second cycle at 10 nominal frames per second"
            w={960}
            h={360}
            caption="Equal delays: 10 frames at 100 ms each make a 1-second cycle, which is 10 nominal FPS."
          />
          <H3>Why some frame rates cannot exist</H3>
          <P>
            Because delays snap to whole hundredths, only certain nominal rates are encodable: 100,
            50, 33, 25, 20, 16.7, 14.3, 12.5, 11.1, 10, and so on. A true 60 FPS GIF would need 16.7
            ms per frame, which the format cannot express; the closest options are 20 ms (50 nominal
            FPS) and 10 ms (100 nominal FPS before viewers intervene). Likewise, nominal 30 FPS is
            really 33 FPS at 30 ms, or 25 FPS at 40 ms — there is no exact 30.
          </P>

          <H2 id="variable-delays">Variable delays: why one FPS number can mislead</H2>
          <P>
            The formula above only works when every frame waits the same time. With variable delays,
            you must add the delays up first, and the average that comes out can hide what the
            animation actually does.
          </P>
          <P>
            Take a GIF with eight frames: seven at 50 ms and a final frame held for 500 ms. The
            cycle lasts 7 × 50 + 500 = 850 ms, and 8 frames ÷ 0.85 seconds gives an average of about
            9.4 frames per second. But nothing in the animation moves at 9.4 FPS: seven quick steps
            play at 20 FPS, then the picture freezes for half a second. Describing that file as “9.4
            FPS” is arithmetically correct and practically misleading.
          </P>
          <P>
            The honest description is the delays themselves, or the cycle plus a note about the
            hold: “8 frames, 850 ms cycle, with a 500 ms hold on the last frame.” A single FPS
            figure is only safe when delays are equal, or when you label it as a cycle average.
          </P>
          <Figure
            src="/blog/fps-variable-delay-timeline.svg"
            alt="Timeline of 7 frames at 50 milliseconds followed by one frame held for 500 milliseconds, showing quick motion then a long pause within an 850 millisecond cycle"
            w={960}
            h={360}
            caption="Variable delays: seven 50 ms steps plus a 500 ms hold. The 9.4 FPS average describes neither part."
          />

          <H2 id="encoded-vs-observed">Encoded timing versus observed playback</H2>
          <P>
            The delays in the file are the encoded timing — what the creator asked for. What you see
            is observed playback, and viewers may differ. The gap shows up in a few predictable
            places.
          </P>
          <H3>Very short delays get slowed down</H3>
          <P>
            Delays below 20 ms are the classic case. The only whole-hundredth values under 20 ms are
            0 and 10 ms, and major browsers have long refused to play them at face value: Chromium's
            code uses 100 ms for any frame specifying 10 ms or less, and Firefox normalizes very
            small timeouts the same way, a behaviour documented from browser source comments (
            <Cite href={SRC.fastestGif}>The Fastest GIF Does Not Exist</Cite>). The practical result
            is a trap: setting a 10 ms delay to make a GIF faster makes it play at about 10 FPS
            instead, slower than a 20 ms delay would. That is why 20 ms — 50 nominal FPS — is the
            fastest delay worth using in a browser, and why ZipGIF's own speed tool treats 20 ms as
            the floor below which frames must be dropped rather than sped up further.
          </P>
          <Figure
            src="/blog/fps-encoded-vs-observed.svg"
            alt="Comparison of encoded delays versus observed playback: 10 milliseconds encoded plays back at about 100 milliseconds, while 20 milliseconds and above play back as encoded"
            w={960}
            h={360}
            caption="Encoded versus observed: a 10 ms delay is typically slowed to about 100 ms, while 20 ms and above play as written."
          />
          <H3>Refresh rate and decoding load</H3>
          <P>
            Even with sensible delays, playback is not metronome-precise. A 60 Hz screen can only
            show a new image about every 16.7 ms, so a 20 ms frame may be displayed for one or two
            refresh intervals — a small jitter you would rarely notice. A slow device can also fall
            behind on large frames, and some apps convert GIFs to video or show only the first
            frame. In all these cases the file's nominal FPS has not changed; the viewer's rendering
            of it has.
          </P>
          <P>
            Rule of thumb: nominal FPS describes the file; what one viewer does is an observation
            about that viewer. For consistent playback everywhere, keep delays at 20 ms or above.
          </P>

          <H2 id="changing-timing">Changing delays, dropping frames, duplicating frames</H2>
          <P>
            Three ways to change how fast a GIF feels are not interchangeable. Start from a GIF with
            10 frames at 100 ms: a 1-second cycle at 10 nominal FPS.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                Three ways to retime the same 10-frame, 1-second GIF
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
                    Frames
                  </th>
                  <th scope="col" className={th}>
                    Cycle
                  </th>
                  <th scope="col" className={th}>
                    Effect
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Scale the delays</td>
                  <td className={td}>Every delay × the same factor</td>
                  <td className={td}>10</td>
                  <td className={td}>0.5 s at 50 ms</td>
                  <td className={td}>Faster, same motion steps, size barely changes</td>
                </tr>
                <tr>
                  <td className={td}>Drop frames</td>
                  <td className={td}>Remove every other frame, keep 100 ms</td>
                  <td className={td}>5</td>
                  <td className={td}>0.5 s</td>
                  <td className={td}>Faster and choppier: half the motion steps are gone</td>
                </tr>
                <tr>
                  <td className={td}>Duplicate frames</td>
                  <td className={td}>Show each frame twice at 50 ms</td>
                  <td className={td}>20</td>
                  <td className={td}>1 s</td>
                  <td className={td}>Looks identical, file slightly larger</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            Scaling delays preserves the motion except its speed, because every frame keeps its
            place and its share of the timing. Dropping frames throws motion away: the animation
            jumps between kept frames, so it looks choppier even at the same cycle duration.
            Duplicating frames adds nothing new — each image simply appears twice in a row — so it
            cannot smooth motion, and it costs extra bytes.
          </P>
          <P>
            That is also why changing delays alone barely changes file size, while dropping frames
            usually shrinks a file and duplicating frames grows it. If a GIF plays too fast, scale
            its delays up; if it is also too large, drop frames as a separate step rather than
            expecting the slowdown to shrink it.{" "}
            <In to="/gif-speed-changer">ZipGIF's speed changer</In> works by scaling delays from
            0.1× to 8×, and when a speed-up would push delays under the 20 ms browser floor it drops
            frames evenly instead, so the speed you pick is the speed you get.
          </P>

          <H2 id="inspect">How to inspect a GIF's frames and timing</H2>
          <P>
            Guessing from how a GIF looks is unreliable, because viewers already distort the timing.
            Read the delays from the file instead. <In to="/gif-splitter">ZipGIF's GIF splitter</In>{" "}
            lays every frame out in a grid with its number and its delay printed underneath, such as
            #12 – 40 ms, which makes the arithmetic easy: add the delays for the cycle duration, and
            divide the frame count by that duration if you want the average rate.
          </P>
          <P>
            For example, suppose the grid shows 12 frames: eleven at 40 ms and a final frame at 400
            ms. The cycle is 11 × 40 + 400 = 840 ms, averaging 12 ÷ 0.84 ≈ 14.3 FPS — but the useful
            description is the split one: motion at 25 FPS, then a 400 ms hold. Any editor or frame
            viewer that lists per-frame delays gives you the same raw material; the splitter's grid
            is simply a quick way to see it without installing anything.
          </P>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>The GIF plays much slower than you set it</H3>
          <P>
            Check for 0 ms or 10 ms delays: viewers slow those to about 100 ms, so a GIF built for
            speed ends up ten times slower than intended. Raise short delays to 20 ms or above.
          </P>
          <H3>The same GIF plays at different speeds in different apps</H3>
          <P>
            That is viewer behaviour, not file corruption: clamping, refresh timing and decoding
            speed all vary. Delays of 20 ms or more give the most consistent result.
          </P>
          <H3>A “60 FPS GIF” looks no smoother than a 50 FPS one</H3>
          <P>
            It cannot be 60 FPS: the format cannot express 16.7 ms delays. The file is almost
            certainly playing at 50 FPS, or is a video labelled as a GIF.
          </P>
          <H3>An FPS figure from one tool disagrees with another</H3>
          <P>
            One may average variable delays while the other reports the most common delay, or one
            shows nominal FPS while the other measured playback. Compare the per-frame delays, not
            the headline numbers.
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
              <Cite href={SRC.spec}>W3C: Graphics Interchange Format, Version 89a</Cite> — Graphic
              Control Extension, Delay Time in hundredths of a second.
            </li>
            <li>
              <Cite href={SRC.mdn}>MDN: Image file type and format guide</Cite> — GIF as a basic
              animation format using 8-bit indexed colour.
            </li>
            <li>
              <Cite href={SRC.fastestGif}>The Fastest GIF Does Not Exist</Cite> — browser source
              comments on clamping of sub-20 ms delays, from Chromium 98 and Firefox 97-era code.
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Viewer behaviour changes over time. The clamping details above reflect the linked
            browser-source evidence and ZipGIF's current tool behaviour; a viewer update could
            change observed playback.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Short version: a GIF has no frame rate of its own — it has delays. Add them up for the
            cycle, divide for a nominal FPS, and remember that number is not a promise about
            playback. If your GIF's timing looks wrong, inspect its per-frame delays before assuming
            the file is broken.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowManyFpsAreGifs;
