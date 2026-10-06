import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SRC = {
  spec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  giphy: "https://support.giphy.com/hc/en-us/articles/360019914771-GIF-Creation-Best-Practices",
  discordFiles: "https://support.discord.com/hc/en-us/articles/25444343291031-File-Attachments-FAQ",
  discordEmoji: "https://support.discord.com/hc/en-us/articles/360036479811-How-to-Add-Custom-Emojis-on-Discord",
};

const toc = [
  ["max-duration", "Is there a maximum GIF duration?"],
  ["cycle-vs-loop", "One cycle versus a looping GIF"],
  ["calculate", "How to calculate GIF duration"],
  ["platforms", "Platform duration limits versus recommendations"],
  ["size", "Why longer GIFs often become larger"],
  ["shorten", "How to shorten a GIF"],
  ["example", "A worked example: trimming a synthetic GIF"],
  ["video", "When MP4 or WebP makes more sense"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Can a GIF be 30 seconds?",
    a: "Yes. The format allows it. A 30-second GIF is usually large, though, so check the destination's duration and file-size rules first. GIPHY, for example, limits uploads to 15 seconds.",
  },
  {
    q: "Can a GIF be one minute?",
    a: "The file format can hold a minute of frames, but the result is often many megabytes and slow to decode. For a minute of footage, a short MP4 or WebM is usually the better choice.",
  },
  {
    q: "Does looping increase the number of stored frames?",
    a: "No. A loop replays the frames already in the file. A 3-second cycle set to loop forever still stores only those 3 seconds of frames.",
  },
  {
    q: "How do I check a GIF's duration?",
    a: "Add up the delay of every frame. A frame viewer that lists each frame and its delay makes this easy; if every frame has the same delay, multiply the frame count by that delay.",
  },
  {
    q: "Does speeding up a GIF make it smaller?",
    a: "Not by itself. Shorter delays change playback time but keep the same frames, so the file size barely moves. Size drops when frames are removed, the canvas gets smaller or colours are reduced.",
  },
  {
    q: "Is a platform recommendation a file-format limit?",
    a: "No. A rule such as GIPHY's 15-second upload limit belongs to that service. It says nothing about what the GIF format itself can store.",
  },
];

function Cite({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
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

function Figure({ src, alt, w, h, caption, eager }: { src: string; alt: string; w: number; h: number; caption: string; eager?: boolean }) {
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

function HowLongCanAGifBe() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 sm:px-6 md:py-16">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap gap-2">
              <li><L to="/" className="hover:text-foreground">Home</L> /</li>
              <li><L to="/blog" className="hover:text-foreground">Blog</L> /</li>
              <li aria-current="page" className="text-foreground">How long can a GIF be?</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How Long Can a GIF Be? Duration, Loops and Upload Limits
          </h1>
          <p className="mt-5 text-sm text-foreground">
            By <L to="/about" className="font-medium text-primary underline underline-offset-2">Shafiullah Tareen</L>, creator of ZipGIF · Published <time dateTime="2026-10-03">October 3, 2026</time>
          </p>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src="/og-how-long-can-a-gif-be.jpg"
              alt="How long can a GIF be: GIF duration, frame delay and loop count explained by ZipGIF"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            The GIF format sets no short duration cap. One animation cycle lasts as long as its frame
            delays add up to, and a loop can replay that cycle endlessly. The limits you actually hit
            come from platforms, file size, and what browsers and devices can decode comfortably.
          </p>

          <Figure
            src="/blog/gif-loop-timeline.svg"
            alt="Timeline showing one stored 3-second GIF cycle of 60 frames, then the same cycle replayed three times as loops"
            w={960}
            h={360}
            caption="One stored 3-second cycle versus the same cycle replayed as loops. Looping adds viewing time, not stored frames."
          />

          <nav aria-labelledby="toc-title" className="mt-10 rounded-xl border border-border bg-card p-6">
            <p id="toc-title" className="font-semibold">In this guide</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
              {toc.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="text-primary hover:underline">{label}</a></li>
              ))}
            </ol>
          </nav>

          <H2 id="max-duration">Is there a maximum GIF duration?</H2>
          <P>
            Not in the way most people expect. A GIF is a sequence of images, and each image can carry a
            delay value that says how long to wait before showing the next one. The GIF89a specification
            defines that delay in hundredths of a second, stored in a two-byte field
            (<Cite href={SRC.spec}>GIF89a specification</Cite>). The largest value that fits is 65,535
            hundredths, or about 655 seconds.
          </P>
          <P>
            That number is the maximum delay of <em>one frame</em>, not a limit on the whole animation. A
            file can contain many frames, and their delays add together. So the format has no single
            built-in total GIF duration cap. That does not make GIFs literally unlimited: every extra frame
            adds bytes, takes memory to decode, and may hit a rule wherever you upload it.
          </P>
          <H3>Format limits versus platform rules</H3>
          <P>
            When someone asks "how long can GIFs be", the honest answer depends on where the GIF is going.
            The format describes what a file can store. A platform decides what it will accept, and those
            rules differ from service to service and change over time.
          </P>

          <H2 id="cycle-vs-loop">One cycle versus a looping GIF</H2>
          <P>
            How long is a GIF, then? There are two answers. The <strong>cycle duration</strong> is the time
            it takes to play every frame once. The <strong>viewing time</strong> is how long it keeps
            playing, which depends on looping.
          </P>
          <P>
            Looping is controlled by a loop count. It is not part of the original GIF89a text; it comes
            from a widely supported application extension (often called the Netscape loop extension) that
            the specification's extension mechanism allows (<Cite href={SRC.spec}>GIF89a, Application
            Extension</Cite>). A loop count of zero is commonly read as "repeat forever".
          </P>
          <P>
            This is why a three-second animation can appear to run all day. The file holds three seconds of
            frames; the viewer simply starts again at frame one. The GIF loop count changes behaviour, not
            the number of stored frames, so it barely affects file size.
          </P>

          <H2 id="calculate">How to calculate GIF duration</H2>
          <P>The rule is simple:</P>
          <p className="mt-4 rounded-lg bg-muted px-4 py-3 font-mono text-sm">
            total cycle duration = sum of every frame delay
          </p>
          <H3>Constant GIF frame delay</H3>
          <P>
            If every frame uses the same delay, multiply. A GIF with 60 frames at 0.05 seconds (50 ms) each
            lasts 60 × 0.05 = 3 seconds.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[420px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                Arithmetic examples, not measured files
              </caption>
              <thead>
                <tr><th scope="col" className={th}>Frames</th><th scope="col" className={th}>Delay per frame</th><th scope="col" className={th}>Cycle duration</th></tr>
              </thead>
              <tbody>
                <tr><td className={td}>30</td><td className={td}>100 ms</td><td className={td}>3 s</td></tr>
                <tr><td className={td}>60</td><td className={td}>50 ms</td><td className={td}>3 s</td></tr>
                <tr><td className={td}>120</td><td className={td}>50 ms</td><td className={td}>6 s</td></tr>
              </tbody>
            </table>
          </div>
          <H3>Variable delays</H3>
          <P>
            Many GIFs hold some frames longer than others, such as a pause on the last frame. Then you must
            add each delay instead of assuming a frame rate. Example: 10 frames at 50 ms plus one final frame
            at 1,000 ms gives 10 × 0.05 + 1.0 = 1.5 seconds. Treating it as "11 frames at 20 fps" would
            give 0.55 seconds, which is wrong.
          </P>
          <P>
            To see the real delays, <In to="/gif-splitter">inspect individual GIF frames</In> and read the
            timing of each one.
          </P>
          <P>
            One practical note: many browsers treat very small delays (for example 0 or 1 hundredth of a
            second) as a slower default, so the same file can play at different speeds in different apps.
          </P>

          <H2 id="platforms">Platform duration limits versus recommendations</H2>
          <P>
            Here the numbers depend entirely on the service. Keep three things apart: hard limits, softer
            recommendations and file-size limits.
          </P>
          <H3>GIPHY</H3>
          <P>
            GIPHY's creation guidance says uploads are limited to 15 seconds and recommends no more than 6
            seconds. It also limits uploads to 100 MB while recommending 8 MB or less
            (<Cite href={SRC.giphy}>GIPHY: GIF Creation Best Practices</Cite>). These are GIPHY's rules for
            GIPHY uploads only. They are not limits of the GIF format.
          </P>
          <H3>How long can a GIF be on Discord?</H3>
          <P>
            Discord does not publish a separate duration limit for GIFs that we could find. What it does
            publish is a file-size limit for attachments. Its File Attachments FAQ says the free upload limit
            is 20 MB as of August 2026, with larger limits for Nitro subscribers
            (<Cite href={SRC.discordFiles}>Discord: File Attachments FAQ</Cite>). Older Discord pages still
            mention 10 MB, so check the linked page before you rely on a number. Custom emoji must be under
            256 KB (<Cite href={SRC.discordEmoji}>Discord: How to Add Custom Emojis</Cite>).
          </P>
          <P>
            In practice, a long Discord GIF fails because of bytes, not seconds. If yours is rejected,
            <> </><In to="/compress-gif-for-discord">compress a GIF for Discord</In> with a target-size preset.
          </P>
          <H3>Other services</H3>
          <P>
            Messaging apps, social networks and ad platforms each set their own rules and often convert GIFs
            to video. We have not listed their numbers here because we could not verify current official
            values. Check the help page of the service you are using.
          </P>

          <H2 id="size">Why longer GIFs often become larger</H2>
          <P>A longer GIF usually has more frames, and more frames usually means more bytes. But several things decide how much:</P>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Frame count:</strong> each frame adds image data.</li>
            <li><strong className="text-foreground">Dimensions:</strong> a 800×600 frame has four times the pixels of a 400×300 frame.</li>
            <li><strong className="text-foreground">Colours:</strong> each frame can use up to 256 colours; fewer colours compress better.</li>
            <li><strong className="text-foreground">Scene complexity:</strong> noise, gradients and camera movement compress poorly.</li>
            <li><strong className="text-foreground">Frame reuse and optimisation:</strong> a frame can store only the area that changed and leave the rest of the previous frame in place, so static backgrounds cost little.</li>
          </ul>
          <P>
            Because of that last point, GIFs do not always store every frame as a full image, and file size is
            not perfectly linear with length. Doubling the duration of a calm animation may add far less than
            double its size; doubling a shaky phone clip can cost more.
          </P>

          <H2 id="shorten">How to shorten a GIF without confusing crop and trim</H2>
          <P>These four edits are often mixed up:</P>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Trim</strong> removes time: frames at the start or end.</li>
            <li><strong className="text-foreground">Crop</strong> removes area: edges of every frame. The duration stays the same.</li>
            <li><strong className="text-foreground">Change speed</strong> rewrites frame delays. Duration changes, frames stay.</li>
            <li><strong className="text-foreground">Compress</strong> reduces bytes through optimisation, colours or size.</li>
          </ul>
          <Figure
            src="/blog/too-long-or-too-large.svg"
            alt="Decision tree: too long leads to trim, too large leads to compress or resize, unwanted border leads to crop, plays too slowly leads to change speed"
            w={960}
            h={440}
            caption="Too long or too large? Pick the edit that matches the actual problem."
          />
          <H3>A practical ZipGIF workflow</H3>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>Open the trimmer and <In to="/gif-trimmer">trim a GIF</In> by choosing the start and end of the section you want to keep. The new duration is shown before you download.</li>
            <li>If the moment is right but plays too slowly or too quickly, <In to="/gif-speed-changer">change GIF playback speed</In>.</li>
            <li>If the file is still too large, <In to="/gif-compressor">reduce GIF file size</In> using manual settings or a target file size.</li>
            <li>If the canvas is bigger than it needs to be, <In to="/gif-resizer">resize an animated GIF</In>; smaller dimensions usually save the most bytes.</li>
          </ol>
          <P>All of these tools run in your browser, so the GIF is not uploaded to a server.</P>

          <H2 id="example">A worked example: trimming a synthetic GIF</H2>
          <P>
            The numbers below come from an earlier synthetic sample processed in a sandbox: a generated test
            animation, not a real-world clip. They are not new live ZipGIF benchmarks. They show how frame
            count, duration and size relate for one file; your results will vary with content and settings.
          </P>
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_14rem]">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[420px] text-sm">
                <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                  Earlier synthetic example, 400×300 pixels, 50 ms per frame
                </caption>
                <thead>
                  <tr><th scope="col" className={th}>Version</th><th scope="col" className={th}>Frames</th><th scope="col" className={th}>Duration</th><th scope="col" className={th}>Approx. size</th></tr>
                </thead>
                <tbody>
                  <tr><td className={td}>Original</td><td className={td}>60</td><td className={td}>3.0 s</td><td className={td}>~300 KB</td></tr>
                  <tr><td className={td}>First half</td><td className={td}>30</td><td className={td}>1.5 s</td><td className={td}>~152 KB</td></tr>
                  <tr><td className={td}>First quarter</td><td className={td}>15</td><td className={td}>0.75 s</td><td className={td}>~79 KB</td></tr>
                </tbody>
              </table>
            </div>
            <aside className="rounded-xl border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
              <strong className="text-foreground">Limitations:</strong> one generated file with fairly even
              content. Real clips with static backgrounds or heavy motion can shrink more or less than
              this when trimmed.
            </aside>
          </div>
          <P>
            Here, halving the frames roughly halved the size, and a quarter of the frames came to roughly a
            quarter. The arithmetic matches the duration rule: 30 × 50 ms = 1.5 s and 15 × 50 ms = 0.75 s.
          </P>
          <Figure
            src="/blog/trim-example-timeline.svg"
            alt="Bars comparing durations: 60 frames last 3 seconds, 30 frames last 1.5 seconds, 15 frames last 0.75 seconds at 50 milliseconds per frame"
            w={960}
            h={340}
            caption="Duration of the synthetic example after trimming to the first half and first quarter."
          />

          <H2 id="video">When MP4 or WebP makes more sense</H2>
          <P>
            GIF is an old format with a 256-colour palette per frame and no modern video compression. For
            long clips, real footage or anything with sound, a video format such as MP4 or WebM is usually
            far smaller. Many sites already convert uploaded GIFs to video for that reason.
          </P>
          <P>
            On your own website, a muted, looping video element can behave like a GIF. Animated WebP is
            another option supported by current browsers. GIF still wins where compatibility matters most,
            such as some email clients, chat apps and older software that only shows images. ZipGIF works on
            GIFs and does not convert to video, so use a video editor for that step.
          </P>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>The upload is rejected</H3>
          <P>Check the service's size rule first, then its duration rule. Trim the ends, then compress or resize until the file fits.</P>
          <H3>The GIF appears endless</H3>
          <P>It is probably set to loop forever. The stored cycle may be only a few seconds long.</P>
          <H3>It plays at a different speed elsewhere</H3>
          <P>Very short delays are often slowed down by browsers and apps. Use slightly longer delays, such as 20 ms or more, for consistent playback.</P>
          <H3>The animation is missing</H3>
          <P>Some apps show only the first frame, or convert the GIF to a still image or video. Try sending it as a file, or check that the file really contains more than one frame.</P>
          <H3>The trimmed file is still large</H3>
          <P>Trimming only removes time. Large dimensions, noisy footage and many colours keep each remaining frame heavy, so resize or compress as the next step.</P>

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
            <li><Cite href={SRC.spec}>W3C: Graphics Interchange Format, Version 89a</Cite></li>
            <li><Cite href={SRC.giphy}>GIPHY: GIF Creation Best Practices</Cite></li>
            <li><Cite href={SRC.discordFiles}>Discord: File Attachments FAQ</Cite></li>
            <li><Cite href={SRC.discordEmoji}>Discord: How to Add Custom Emojis on Discord</Cite></li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Platform rules change. Numbers above were taken from the linked pages on the publication date.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowLongCanAGifBe;
