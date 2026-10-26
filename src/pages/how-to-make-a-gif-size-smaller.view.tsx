import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPost } from "@/lib/blog-posts";

const post = getPost("/blog/how-to-make-a-gif-size-smaller");

const SRC = {
  spec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  mdn: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
  giphy: "https://support.giphy.com/hc/en-us/articles/360019914771-GIF-Creation-Best-Practices",
  gifsicle: "https://manpages.debian.org/bullseye/gifsicle/gifsicle.1.en.html",
  discordFiles: "https://support.discord.com/hc/en-us/articles/25444343291031-File-Attachments-FAQ",
  discordEmoji: "https://discord.com/blog/beginners-guide-to-custom-emojis",
  gmail: "https://support.google.com/mail/answer/6584",
};

const toc = [
  ["five-methods", "The five ways to make a GIF smaller"],
  ["choose", "Choose by your actual problem"],
  ["test", "What a controlled same-file test showed"],
  ["why-vary", "Why the same fix saves 90% on one GIF and 10% on another"],
  ["puzzles", "Two results that confuse people"],
  ["troubleshooting", "Troubleshooting"],
  ["when-video", "When a GIF is the wrong format"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "How much smaller can I expect my GIF to get?",
    a: "There is no honest single number. It depends on what made the GIF big: dimensions, frame count, length, noise, or missing optimization. A separate ZipGIF test of 16 GIFs using Gifsicle optimization with lossy 120 and 64 colours averaged a 37.0% reduction, with 69.4% at best — but that was one small sample, not a promise for your file. Run your own GIF through a compressor and read the measured result.",
  },
  {
    q: "Will compressing my GIF make it look worse?",
    a: "Optimization alone does not change how it looks: it only stops re-storing pixels that did not change. Lossy compression and fewer colours do change the image, gradually. Raise the strength step by step and compare the result with the original before you download it. Flat artwork tolerates far more than gradients and faces.",
  },
  {
    q: "Should I trim my GIF or drop frames?",
    a: "Trim when the animation contains seconds you do not need: the result is shorter but just as smooth. Drop frames when the full duration matters but the motion does not need every frame: the result keeps its length but moves more stiffly. Do not do both by default — each one costs something, and you may only need one.",
  },
  {
    q: "Why is my GIF still too big after trimming it?",
    a: "Trimming removes frames, but every remaining frame still costs what it always cost. If the frames are large, noisy, or never optimized, the trimmed GIF can still be heavy. After trimming, resize to the real display size and run an optimizer before judging the result.",
  },
  {
    q: "Why didn't speeding up my GIF make it smaller?",
    a: "Playback speed in a GIF is set by delay values stored with each frame, and those values cost almost nothing. Changing them changes timing, not content. A file only shrinks when you remove pixels, frames, colours, or detail — or optimize how frames are stored.",
  },
  {
    q: "What file size should I aim for?",
    a: "Aim at the limit of wherever the GIF is going, not at a universal number. Discord's Help Center lists a 20 MB free upload limit (checked October 2026; Discord notes it is experimenting with larger limits for some users), and its emoji guidance is 256 KB at 128×128. Personal Gmail allows 25 MB of attachments in total per message. For a web page there is no limit, only a trade-off: smaller loads faster. GIPHY recommends uploads of 8 MB or less, but that is GIPHY's own guidance, not a general rule.",
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

function HowToMakeAGifSizeSmaller() {
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
                How to make a GIF smaller without ruining quality
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
            A GIF can often be made smaller by changing its dimensions, its frame count, its
            duration, its colour palette, or its encoding settings. The trick is picking the change
            that matches why your GIF is big: free fixes first, visible trade-offs last, and never a
            single promised percentage.
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

          <H2 id="five-methods">The five ways to make a GIF smaller</H2>
          <P>
            A GIF stores a sequence of images. Each frame is an indexed picture: every pixel points
            to a colour in a palette of at most 256 entries, packed with LZW compression, and each
            frame can carry its own delay (<Cite href={SRC.spec}>GIF89a specification</Cite>). So a
            GIF's size is roughly pixels per frame × number of frames × how hard each frame is to
            compress. Every method below attacks one of those three factors. If you want the deeper
            story of what makes a GIF heavy in the first place, read the related guide on{" "}
            <In to="/blog/why-is-my-gif-so-big">why a GIF gets so big</In>.
          </P>

          <H3>1. Shorten the animation by trimming time</H3>
          <P>
            Trimming keeps a start-to-end range of frames and drops the rest. What changes is
            duration and frame count together: a 6-second clip trimmed to 3 seconds at the same
            frame rate holds half the frames. The benefit is usually the largest single saving
            available, and it costs nothing in image quality — the frames you keep are untouched.
            The cost is content: the trimmed part is gone. Use the{" "}
            <In to="/gif-trimmer">GIF trimmer</In> when the moment you want is shorter than the clip
            you have.
          </P>

          <H3>2. Resize the frame dimensions</H3>
          <P>
            Resizing shrinks every frame. Pixel count grows with the square of the width, so halving
            the width and height leaves a quarter of the pixels — which is why resizing beats most
            other single changes. The benefit is large and predictable in direction, though not in
            exact percentage. The cost is detail: small text, faces, and fine lines suffer first,
            and the damage shows most when the GIF is later displayed larger than its new size.
            Resize to the size the GIF will actually be shown at, never smaller than that, with the{" "}
            <In to="/gif-resizer">GIF resizer</In>. Cropping to the part that matters, with the{" "}
            <In to="/gif-cropper">GIF cropper</In>, is the same idea applied to area instead of
            scale: fewer pixels per frame, same content.
          </P>

          <H3>3. Reduce the number of frames</H3>
          <P>
            Dropping frames keeps the animation's duration but shows fewer images per second: the
            remaining frames get longer delays so the total length stays the same. Halving the frame
            rate roughly halves the stored frame data, before optimization. The benefit is a smaller
            file with the same start, end, and length. The cost is smoothness: motion turns choppy,
            which is easy to miss on a slow pan and obvious on fast movement or a bouncing object.
            Ten to fifteen frames per second is usually smooth enough for a GIF; below about five,
            most motion looks like a slideshow. The <In to="/gif-splitter">GIF splitter</In> shows a
            GIF's frames, which helps you judge how many it actually has.
          </P>

          <H3>4. Optimize the palette and compression settings</H3>
          <P>
            This is two related levers. Optimization re-stores frames so that only the changed area
            of each frame is kept, using transparency for pixels that did not move; tools like
            Gifsicle call this <code className="rounded bg-muted px-1.5 py-0.5 text-sm">-O3</code>,
            which tries several optimization methods (
            <Cite href={SRC.gifsicle}>Gifsicle manual</Cite>). It changes nothing visible and is the
            only lever that is free in quality terms — but it only helps if the GIF was not already
            optimized. The second lever, lossy compression and colour reduction, trades small colour
            errors for size: Gifsicle's{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">--lossy</code> option alters
            colours to shrink output, and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">--colors</code> caps the
            palette at anywhere from 2 to 256 colours. Flat artwork often looks the same at 64
            colours; gradients and photographs band and blotch. Raise lossy strength and lower
            colours step by step, and stop as soon as the damage becomes visible. The{" "}
            <In to="/gif-compressor">GIF compressor</In> combines both levers.
          </P>

          <H3>5. Combine several adjustments</H3>
          <P>
            Combining is how strict size targets are met: trim a little, resize a little, drop some
            frames, then compress. The benefit is that no single lever has to do all the damage, so
            the result often looks better than pushing one lever to its extreme. The cost is that
            the savings do not add up neatly — once optimization has removed the redundancy, each
            further lever has less left to save, as the controlled test below shows. Combine in the
            order of this section: free fixes first, visible trade-offs last, and check the finished
            file after each step rather than applying everything at once.
          </P>

          <H2 id="choose">Choose by your actual problem</H2>
          <P>
            Start from what is wrong with your file, not from a favourite setting. Find your row,
            try its first fix, and only move on if the result still is not small enough.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className={th}>Your problem</th>
                  <th className={th}>First fix</th>
                  <th className={th}>Watch out for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Displayed smaller than its stored size</td>
                  <td className={td}>Resize to the display size</td>
                  <td className={td}>Text and detail lost if shown larger later</td>
                </tr>
                <tr>
                  <td className={td}>Longer than the moment you need</td>
                  <td className={td}>Trim the extra seconds</td>
                  <td className={td}>Nothing visual — but the cut content is gone</td>
                </tr>
                <tr>
                  <td className={td}>Far more frames than the motion needs</td>
                  <td className={td}>Drop frames, keep the duration</td>
                  <td className={td}>Choppy motion below about 10 fps</td>
                </tr>
                <tr>
                  <td className={td}>Noisy, photographic, or gradient-heavy</td>
                  <td className={td}>Lossy compression, then fewer colours</td>
                  <td className={td}>Banding on gradients, blotching on faces</td>
                </tr>
                <tr>
                  <td className={td}>A strict upload limit to hit</td>
                  <td className={td}>Combine, then use target-size mode</td>
                  <td className={td}>Some targets are unreachable without visible damage</td>
                </tr>
                <tr>
                  <td className={td}>Already optimized and still too big</td>
                  <td className={td}>Resize or trim — compression has little left</td>
                  <td className={td}>Consider whether a GIF is the right format at all</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Figure
            src="/blog/size-decision-tree.svg"
            alt="Decision tree: trim if the GIF is longer than needed, resize if it is shown smaller than its pixel size, drop frames if it has more frames than the motion needs, compress if it is still too big, and use target-size mode for an exact size"
            w={960}
            h={660}
            caption="Work down the questions. Each 'yes' is a fix; each 'no' moves to the next question."
          />

          <H2 id="test">What a controlled same-file test showed</H2>
          <P>
            Advice about percentages is easy to give and hard to trust, because every GIF responds
            differently. So instead of quoting a generic saving, this section reports one controlled
            test: a single synthetic GIF, changed one factor at a time, with everything else held
            constant. The sample was generated locally with gifenc (a GIF encoder already used by
            this site's codebase): 320×240 pixels, 30 frames at 100 ms each (10 frames per second,
            3.0 seconds total), looping, with a static gradient background, a static flat bar, a
            moving solid circle, and a small square that changes colour each frame. It is labelled
            synthetic because it is not a real recording — but that is also its strength: the same
            file went through every variant, so the differences come from the settings, not from
            different content.
          </P>
          <P>
            Each variant was processed with Gifsicle through the same engine the ZipGIF site uses
            (gifsicle-wasm-browser), using the same command shapes as the site's compressor,
            resizer, and trimmer. The runs happened in a local test harness, not through the site's
            tool pages, so these are local harness measurements — not a ZipGIF benchmark and not a
            promise about any other file. Frame counts, dimensions, and durations below were read
            back from the output files, and quality was judged from the settings used, not from a
            perceptual score.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className={th}>Change</th>
                  <th className={th}>File size</th>
                  <th className={th}>Frames</th>
                  <th className={th}>Canvas</th>
                  <th className={th}>Duration</th>
                  <th className={th}>What it costs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Original (synthetic source)</td>
                  <td className={td}>294,034 bytes</td>
                  <td className={td}>30</td>
                  <td className={td}>320×240</td>
                  <td className={td}>3.0 s</td>
                  <td className={td}>—</td>
                </tr>
                <tr>
                  <td className={td}>
                    Optimize only (<code className="rounded bg-muted px-1 py-0.5 text-xs">-O3</code>
                    )
                  </td>
                  <td className={td}>28,086 (−90.4%)</td>
                  <td className={td}>30</td>
                  <td className={td}>320×240</td>
                  <td className={td}>3.0 s</td>
                  <td className={td}>Nothing visible</td>
                </tr>
                <tr>
                  <td className={td}>Optimize + lossy 80</td>
                  <td className={td}>24,834 (−91.6%)</td>
                  <td className={td}>30</td>
                  <td className={td}>320×240</td>
                  <td className={td}>3.0 s</td>
                  <td className={td}>Slight colour smoothing</td>
                </tr>
                <tr>
                  <td className={td}>Optimize + lossy 120, 64 colours</td>
                  <td className={td}>20,502 (−93.0%)</td>
                  <td className={td}>30</td>
                  <td className={td}>320×240</td>
                  <td className={td}>3.0 s</td>
                  <td className={td}>Banding risk on gradients</td>
                </tr>
                <tr>
                  <td className={td}>Resize to 50%</td>
                  <td className={td}>15,561 (−94.7%)</td>
                  <td className={td}>30</td>
                  <td className={td}>160×120</td>
                  <td className={td}>3.0 s</td>
                  <td className={td}>A quarter of the pixels</td>
                </tr>
                <tr>
                  <td className={td}>Drop every 2nd frame, delays doubled</td>
                  <td className={td}>22,127 (−92.5%)</td>
                  <td className={td}>15</td>
                  <td className={td}>320×240</td>
                  <td className={td}>3.0 s</td>
                  <td className={td}>10 fps → 5 fps motion</td>
                </tr>
                <tr>
                  <td className={td}>Trim to first half</td>
                  <td className={td}>19,343 (−93.4%)</td>
                  <td className={td}>15</td>
                  <td className={td}>320×240</td>
                  <td className={td}>1.5 s</td>
                  <td className={td}>Half the animation is gone</td>
                </tr>
                <tr>
                  <td className={td}>
                    Combined: resize 50% + lossy 120 + 64 colours + every 2nd frame
                  </td>
                  <td className={td}>7,483 (−97.5%)</td>
                  <td className={td}>15</td>
                  <td className={td}>160×120</td>
                  <td className={td}>3.0 s</td>
                  <td className={td}>All of the above at once</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Figure
            src="/blog/size-comparison-chart.svg"
            alt="Bar chart of the controlled test: the synthetic GIF starts at 294,034 bytes, optimization alone cuts it to 28,086 bytes, resize to 50 percent cuts it to 15,561 bytes, and combining all levers cuts it to 7,483 bytes"
            w={960}
            h={540}
            caption="Same file, one change at a time. Percentages are reductions from the 294,034-byte source, not promises for other GIFs."
          />
          <P>
            Three lessons stand out. First, optimization alone did most of the work here — because
            the synthetic source was unoptimized: its encoder had stored every frame as a full
            image, so storing only changed areas removed most of the file. On a GIF that is already
            optimized, that lever saves far less, and the other levers matter more. Second, levers
            interact instead of adding up: dropping half the frames after optimization only moved
            the result from −90.4% to −92.5%, because most of the redundancy was already gone.
            Third, resize beat lossy compression and colour reduction on this sample, and trim and
            frame-dropping landed in a similar place for bytes while costing different things — trim
            shortens the animation, frame-dropping roughens its motion.
          </P>
          <P>
            For a different kind of evidence, ZipGIF's separate{" "}
            <In to="/research/gif-compression-test">16-GIF compression test</In> ran one fixed
            setting (Gifsicle optimization with lossy 120 and 64 colours) across 16 real files and
            averaged a 37.0% reduction, with 69.4% at best. That spread is the point: one setting,
            sixteen files, wildly different results. Treat any single percentage — including the
            ones in the table above — as a measurement of one file, not a property of the method.
          </P>

          <H2 id="why-vary">Why the same fix saves 90% on one GIF and 10% on another</H2>
          <P>
            LZW compression, the method GIF uses, shrinks data by finding repeated patterns in pixel
            values (<Cite href={SRC.spec}>GIF89a specification</Cite>). Flat colours, still
            backgrounds, and repeated frames are full of patterns; camera grain, gradients,
            dithering, and a moving camera break them. That is why content decides the outcome
            before any setting does: a screen recording with a static window compresses
            dramatically, while a shaky phone clip of confetti barely compresses at all, whatever
            you do. The palette matters too — a GIF is limited to 256 colours per frame, so a
            photographic image already dithered down to 256 colours has little left to give, while a
            cartoon with 12 real colours can drop to a small palette for free.
          </P>
          <P>
            History matters as well. A GIF exported by a tool that skipped optimization still
            contains all the redundancy that optimization removes, so the first optimization pass
            looks miraculous. A GIF that already went through an optimizer has nothing left in that
            lever. This is why two people can follow identical steps and report completely different
            savings without either of them being wrong — and why the only number worth trusting for
            your file is the one measured on your file.
          </P>

          <H2 id="puzzles">Two results that confuse people</H2>
          <H3>Why a trimmed GIF can remain large</H3>
          <P>
            Trimming removes frames, but it does not touch the frames that remain, and it does not
            optimize them. If the remaining seconds are still full-size, noisy, and unoptimized, the
            file stays heavy — just shorter. A trimmed GIF can also stay large when the real problem
            was never duration: a 2-second GIF at 1200 pixels wide is still a 2-second GIF at 1200
            pixels wide. When trimming disappoints, check the dimensions and run an optimizer before
            concluding that the GIF cannot shrink.
          </P>
          <H3>Why faster playback does not necessarily mean a smaller file</H3>
          <P>
            Playback speed is controlled by the delay stored with each frame, measured in hundredths
            of a second in the GIF89a specification. Changing a delay from 100 ms to 50 ms doubles
            the speed and changes almost no bytes, because the frames themselves are untouched. A
            file only gets smaller when frames, pixels, colours, or detail are removed. The one
            exception is dropping frames to speed up motion: fewer frames do shrink the file, but
            that is the frame removal doing the work, not the speed change — and if delays are
            lengthened to keep the original duration, the animation is no longer faster at all.
          </P>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>The upload is still rejected</H3>
          <P>
            First, confirm the limit belongs to the destination and the exact upload type: an emoji
            limit is not an attachment limit, and a sticker limit may not accept GIF at all.
            Discord, for example, lists a 20 MB free attachment limit, while its emoji guidance is
            256 KB at 128×128 (<Cite href={SRC.discordFiles}>Discord File Attachments FAQ</Cite>,{" "}
            <Cite href={SRC.discordEmoji}>Discord custom emoji guide</Cite>). Second, check the file
            you are actually uploading — some tools keep the original when the compressed result
            would be larger, and some editors export a second copy. Third, if the target is
            genuinely unreachable at watchable quality, the honest fix is less content: trim,
            resize, or both, then compress again. A target-size mode that tries progressively
            stronger settings and says plainly when it cannot reach the target, like the one in the{" "}
            <In to="/gif-compressor">GIF compressor</In>, beats a tool that silently hands back a
            damaged file.
          </P>
          <H3>The GIF looks worse than expected</H3>
          <P>
            Match the damage to the lever. Banding across skies and gradients points to too few
            colours — step the palette back up. Blotchy or noisy patches point to lossy strength too
            high — step it down. Jerky motion points to too few frames — restore frames and shrink
            somewhere else instead. Softness everywhere points to resizing too far — go back to a
            larger size and accept a bigger file, or trim instead. Change one setting at a time; if
            you change three and the result looks wrong, you will not know which one to undo.
          </P>
          <H3>One GIF shrinks far less than another with the same settings</H3>
          <P>
            That is normal, and it is the content-dependence described above: noise, full-frame
            motion, and photographic detail resist every lever, while flat graphics and still
            backgrounds give in easily. Compare the two files' dimensions, frame counts, and content
            before blaming the settings. If the stubborn file is long camera footage, the next
            section applies.
          </P>

          <H2 id="when-video">When a GIF is the wrong format</H2>
          <P>
            Some GIFs stay heavy whatever you do: long clips, camera footage, and anything needing
            sound or smooth gradients. MDN's image format guide recommends considering WebP or APNG
            for animation sequences and notes that modern formats generally compress better than
            GIF, whose 8-bit indexed colour is a real limitation for full-colour animation (
            <Cite href={SRC.mdn}>MDN image format guide</Cite>). A muted looping video behaves like
            a GIF on most websites at a fraction of the size. GIF remains the right choice where
            only images are accepted, such as emoji, some email clients, and older apps. If your GIF
            cannot reach its target without falling apart, switching format is not giving up — it is
            the correct fix.
          </P>

          <P>
            The practical routine is short: trim what you do not need, resize to the real display
            size, drop frames only if the motion can spare them, then compress — optimization first,
            lossy strength and colours last, checking the result at each step. When you need an
            exact size, let the <In to="/gif-compressor">GIF compressor's</In> target-size mode do
            the passes for you, and judge the finished file on its own numbers, not on any
            percentage you read here.
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
              <Cite href={SRC.spec}>W3C: Graphics Interchange Format, Version 89a</Cite>
            </li>
            <li>
              <Cite href={SRC.mdn}>MDN: Image file type and format guide</Cite>
            </li>
            <li>
              <Cite href={SRC.giphy}>GIPHY: GIF Creation Best Practices</Cite>
            </li>
            <li>
              <Cite href={SRC.gifsicle}>
                Gifsicle manual: optimization, colours and lossy options
              </Cite>
            </li>
            <li>
              <Cite href={SRC.discordFiles}>Discord: File Attachments FAQ</Cite>
            </li>
            <li>
              <Cite href={SRC.discordEmoji}>Discord: Beginner's guide to custom emojis</Cite>
            </li>
            <li>
              <Cite href={SRC.gmail}>Google: Gmail attachment limits</Cite>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Platform rules change. The Discord and Gmail limits were taken from the linked pages in
            October 2026; if an upload fails, check the platform's current page before assuming the
            numbers above still hold. The controlled-test figures in this article come from a local
            harness measurement on one synthetic GIF, described in the test section — not from the
            site's tool pages, and not a promise for any other file.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToMakeAGifSizeSmaller;
