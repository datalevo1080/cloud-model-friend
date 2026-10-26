import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPost } from "@/lib/blog-posts";

const post = getPost("/blog/how-to-crop-a-gif");

const SRC = {
  spec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  gifsicle: "https://manpages.debian.org/bullseye/gifsicle/gifsicle.1.en.html",
  discordFiles: "https://support.discord.com/hc/en-us/articles/25444343291031-File-Attachments-FAQ",
  discordEmoji: "https://discord.com/blog/beginners-guide-to-custom-emojis",
};

const toc = [
  ["three-jobs", "Crop, resize, trim: three different jobs"],
  ["how-to", "How to crop a GIF with ZipGIF"],
  ["frames", "What happens to the frames, the loop, and the timing"],
  ["shapes", "Aspect ratios and shapes: which preset for which job"],
  ["file-size", "How cropping affects file size: the maths, not a promise"],
  ["mistakes", "Seven mistakes people make when cropping a GIF"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Does cropping a GIF keep the animation?",
    a: "It should, if the tool crops every frame to the same rectangle. ZipGIF's cropper does: it expands each frame back to a full picture, applies one identical crop to all of them, and re-applies optimization afterwards, so frame delays, loop count, and transparency come through untouched. A tool that crops only the first frame, or crops each frame's stored rectangle independently, is what produces a frozen still or a smeared animation.",
  },
  {
    q: "How do I crop a GIF to a square?",
    a: "Pick the 1:1 preset and drag the square box over the part you want to keep. Square is the shape profile pictures, avatars, and Discord emotes want, so cropping to 1:1 yourself means you decide what stays in frame instead of letting a platform's auto-crop guess for you — and it usually guesses dead centre.",
  },
  {
    q: "How do I crop a GIF for a Discord emoji?",
    a: "Use the cropper's Discord Emoji preset, which takes a centred square crop up to 128×128 pixels. Cropping only fixes the shape, not the weight: Discord's emoji guidance is 256 KB at 128×128, so if the cropped file is still over that, run it through the GIF compressor afterwards. Shape first, size second.",
  },
  {
    q: "Will cropping my GIF make the file smaller?",
    a: "Almost always, but not in proportion to the pixels you remove. Fewer pixels per frame means fewer bytes, but the palette, headers, and per-frame overhead stay put. ZipGIF's own 20-GIF crop test found a median of 36% of pixels removed and 22% of bytes saved; tight square avatar crops did best at 44–47% smaller, while cutting empty letterbox bars saved the least. Treat those as measurements of those files, not a promise for yours.",
  },
  {
    q: "Can I crop a GIF on my phone without an app?",
    a: "Yes. The ZipGIF cropper runs in the browser, so Windows, macOS, Linux, Android, and iOS all work the same way: open the page, drop the file, drag the crop box, download. Nothing installs and nothing is uploaded — the work happens on your own device through a WebAssembly build of Gifsicle.",
  },
  {
    q: "Why does my cropped GIF look smeared, with ghost trails?",
    a: "That is the signature of a naive crop on a frame-optimized GIF. Most GIFs store each frame as only the rectangle that changed since the last one, positioned with an offset. Crop those stored rectangles blindly and you cut different regions out of different frames, so pixels smear across the loop. The fix is to expand every frame to a full picture before cropping — which is what ZipGIF's cropper does — so if another tool gives you ghost trails, that step is what it skipped.",
  },
  {
    q: "Can I crop just one part of the animation in time, like the middle three seconds?",
    a: "No — cropping is spatial, not temporal. A crop applies to every frame of the whole animation. To keep only part of the timeline, use the GIF trimmer, which drops frames from the start or end and leaves the picture untouched. If you need both — a tighter frame and a shorter clip — crop first, then trim, and check the result after each step.",
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

function HowToCropAGif() {
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
                How to crop a GIF
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
            Cropping a GIF means cutting the same rectangle out of every frame: the picture gets
            smaller, the animation stays exactly as it was. The two things that go wrong are
            choosing the wrong job — crop when you meant resize or trim — and using a tool that
            crops one frame instead of all of them. Get those two right and the rest is framing.
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

          <H2 id="three-jobs">Crop, resize, trim: three different jobs</H2>
          <P>
            People say &ldquo;cut a GIF&rdquo; for three completely different operations, and
            picking the wrong one is the most common reason a cropped GIF disappoints. They differ
            in what changes: cropping changes space, trimming changes time, and resizing changes
            scale. A GIF is a stack of frames plus a colour palette and a set of delays (
            <Cite href={SRC.spec}>GIF89a specification</Cite>), so each operation attacks a
            different part of that stack.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className={th}>What you want</th>
                  <th className={th}>What it is called</th>
                  <th className={th}>What changes</th>
                  <th className={th}>What stays the same</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Remove borders or reframe the subject</td>
                  <td className={td}>Crop</td>
                  <td className={td}>Width and height shrink; the canvas gets smaller</td>
                  <td className={td}>Every frame, the timing, and the loop</td>
                </tr>
                <tr>
                  <td className={td}>Make the GIF shorter in time</td>
                  <td className={td}>Trim</td>
                  <td className={td}>Frame count and duration drop</td>
                  <td className={td}>Dimensions and the kept frames</td>
                </tr>
                <tr>
                  <td className={td}>Make the whole picture smaller, same content</td>
                  <td className={td}>Resize</td>
                  <td className={td}>Every frame is scaled down</td>
                  <td className={td}>Nothing is cut away; framing is unchanged</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Figure
            src="/blog/crop-vs-trim-resize.svg"
            alt="Three panels: cropping cuts the edges off every frame, trimming cuts frames off the timeline, resizing scales the whole picture down"
            w={960}
            h={420}
            caption="Crop cuts space, trim cuts time, resize scales everything. Only the first one reframes the picture."
          />
          <P>
            A concrete example: a screen recording with browser tabs across the top and a taskbar
            at the bottom. Cropping removes the tabs and taskbar from every frame and leaves the
            demo itself untouched — that is a crop. Cutting the first five seconds, where you were
            still finding the right window, is a trim: use the{" "}
            <In to="/gif-trimmer">GIF trimmer</In>. Shrinking the whole recording so it loads
            faster on a web page, tabs and all, is a resize: use the{" "}
            <In to="/gif-resizer">GIF resizer</In>. And if the cropped GIF is still too heavy to
            upload, that is a compression job for the{" "}
            <In to="/gif-compressor">GIF compressor</In> — cropping alone was never the whole
            answer. The companion guide on{" "}
            <In to="/blog/how-to-make-a-gif-size-smaller">making a GIF smaller</In> walks through
            how to choose between all five shrinking methods.
          </P>

          <H2 id="how-to">How to crop a GIF with ZipGIF</H2>
          <P>
            Cropping here takes three moves, and everything happens in your browser — the file
            never leaves your device, there is no signup, no watermark, and no export limit. The
            cropper accepts GIFs up to 200 MB each, and you can queue up to 20 files and apply one
            crop region across the whole batch.
          </P>
          <H3>1. Add your GIF</H3>
          <P>
            Drop a GIF onto the <In to="/gif-cropper">GIF cropper</In>, paste one from your
            clipboard, or paste a direct image URL. The crop box sits over a live, playing preview
            rather than a still thumbnail, and that matters more than it sounds: the subject moves,
            and a crop that looks perfect on frame 1 can slice the punchline off frame 40. Watch
            at least one full loop before you commit.
          </P>
          <H3>2. Set the crop area</H3>
          <P>
            Drag the crop box and its handles over the part you want to keep, or pick an aspect
            ratio preset to lock the box to a shape (the presets are covered in the next section
            but one). If the GIF has plain borders — letterbox bars, a uniform margin — the
            auto-trim button snaps the box to the content: it scans every frame for the bounding
            box of pixels that actually carry content and trims the rest. Note that auto-trim only
            finds plain borders; it will not remove a bookmark bar or a notification that slid in
            mid-recording, because those are content as far as the scan is concerned. For those,
            drag the box yourself.
          </P>
          <H3>3. Download the cropped GIF</H3>
          <P>
            Press Crop GIF, check the before-and-after, then download the file — or grab a .zip if
            you cropped a batch. The downloaded file is named after the crop, for example{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              clip-cropped-300x200.gif
            </code>
            , so the result is easy to tell apart from the original. If the cropped GIF still
            needs to be lighter for an upload limit, run it through the{" "}
            <In to="/gif-compressor">GIF compressor</In> afterwards: crop first for framing, then
            compress for weight.
          </P>

          <H2 id="frames">What happens to the frames, the loop, and the timing</H2>
          <P>
            A proper GIF crop cuts the identical rectangle out of every frame and rewrites the
            canvas size, so the picture gets smaller but the timeline does not change: same number
            of frames, same delays, same loop count, same transparency. That is the whole promise,
            and it is also where cheap tools break it.
          </P>
          <P>
            The breakage has a specific cause. Most GIFs in the wild are frame-optimized: each
            frame stores only the rectangle that changed since the last one, positioned with an
            offset, with transparency standing in for the pixels that did not move. Crop those
            stored rectangles blindly and you are cutting different regions out of different
            frames, which is how you end up with ghost trails and pixels that smear across the
            loop. The correct sequence — the one ZipGIF's cropper follows — is to expand every
            frame back to a full picture first (Gifsicle calls this{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">--unoptimize</code>), apply
            the crop to all of them equally, and then put the inter-frame optimization back
            afterwards (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">-O3</code>) so
            the output does not balloon (
            <Cite href={SRC.gifsicle}>Gifsicle manual</Cite>). Delays, loop count, and
            transparency are carried through by Gifsicle untouched.
          </P>
          <P>
            This is also why the most common cropping mistake is not really a crop at all: opening
            a GIF in a still-image editor and cropping it there. A still editor sees one image —
            usually the first frame — and saves one image back. The animation is gone, and no
            setting will bring it back. If a tool cannot show you the animation playing inside the
            crop box, it is not cropping your GIF; it is cropping a screenshot of it.
          </P>

          <H2 id="shapes">Aspect ratios and shapes: which preset for which job</H2>
          <P>
            The cropper's aspect ratio presets lock the crop box to a fixed shape while you drag
            it. Each one exists for a real job, and the list below is exactly what the tool offers
            — no more, no less:
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className={th}>Preset</th>
                  <th className={th}>Shape</th>
                  <th className={th}>Use it for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Freeform</td>
                  <td className={td}>Any rectangle</td>
                  <td className={td}>
                    Banner crops, odd sizes, and any job where no fixed ratio fits — including
                    vertical crops, since there is no 9:16 preset
                  </td>
                </tr>
                <tr>
                  <td className={td}>Square 1:1</td>
                  <td className={td}>Square</td>
                  <td className={td}>Profile pictures, avatars, and feed posts</td>
                </tr>
                <tr>
                  <td className={td}>Circle Preview</td>
                  <td className={td}>Square, shown round</td>
                  <td className={td}>
                    Previewing how an avatar will look behind a platform's round mask — the
                    downloaded GIF itself stays rectangular, because a GIF file is always a
                    rectangle
                  </td>
                </tr>
                <tr>
                  <td className={td}>Discord Emoji</td>
                  <td className={td}>Centred square, up to 128×128</td>
                  <td className={td}>
                    Discord emotes: the preset centres the square for you, then check the 256 KB
                    emoji limit separately (see below)
                  </td>
                </tr>
                <tr>
                  <td className={td}>Profile Picture</td>
                  <td className={td}>Centred square</td>
                  <td className={td}>
                    Avatars where you want the subject centred without dragging the box yourself
                  </td>
                </tr>
                <tr>
                  <td className={td}>16:9</td>
                  <td className={td}>Widescreen</td>
                  <td className={td}>Screen recordings and video-style clips</td>
                </tr>
                <tr>
                  <td className={td}>4:3</td>
                  <td className={td}>Classic TV shape</td>
                  <td className={td}>Older captures and photo-style framing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            Two shape facts save people the most confusion. First, nearly every platform crops an
            avatar to a square before it displays it, and if you upload a widescreen GIF the
            platform's auto-crop decides what stays — usually dead centre, which is rarely where a
            face is. Doing the 1:1 crop yourself keeps that decision with you. Second, there is no
            such thing as a round GIF file: a &ldquo;circle GIF&rdquo; is either a square GIF
            sitting behind a platform's round mask, or a square GIF with a transparent background
            in the corners. Crop to 1:1 and the round version takes care of itself on any site that
            displays avatars as circles.
          </P>
          <P>
            On platform sizes, one honest warning: platforms change their numbers, and this guide
            will not invent them. The one figure stated here is Discord's, because it is both in
            the tool's own preset and in Discord's documentation: Discord's emoji guidance is
            256 KB at 128×128 (<Cite href={SRC.discordEmoji}>Discord custom emoji guide</Cite>),
            while its free attachment limit is a separate, larger number (
            <Cite href={SRC.discordFiles}>Discord File Attachments FAQ</Cite>). An emoji limit is
            not an attachment limit — confirm which one applies to your upload before you crop,
            and check the platform's current page if an upload fails. For other platforms, crop to
            the ratio (usually 1:1 for avatars) and let the platform's own size page, not this
            guide, supply the pixel numbers.
          </P>

          <H2 id="file-size">How cropping affects file size: the maths, not a promise</H2>
          <P>
            Cropping shrinks a file for a simple reason: a GIF's size is roughly pixels per frame
            × number of frames × how hard each frame is to compress, and cropping cuts the first
            factor. The maths of the pixel part is exact. An 800×600 frame holds 480,000 pixels;
            crop it to 400×300 and it holds 120,000 — a quarter of the pixels, because pixel count
            follows area, not width. Halve both dimensions and you quarter the pixels; crop away
            half the area and you halve them.
          </P>
          <Figure
            src="/blog/crop-area-math.svg"
            alt="A wide GIF frame with a smaller crop rectangle inside it: the kept area is a fraction of the original pixels, but the palette, headers, and per-frame overhead stay the same"
            w={960}
            h={480}
            caption="Pixels fall with the kept area. Bytes fall more slowly, because the overhead does not shrink with the picture."
          />
          <P>
            But bytes do not follow pixels one-for-one, because part of every GIF is overhead that
            does not shrink when the canvas does: the colour palette, the headers, and the
            per-frame bookkeeping. That is why a crop that removes 14% of the pixels might only
            save 8% of the bytes, and why small crops save proportionally less than large ones.
            What you crop away matters as much as how much: busy, detailed regions cost far more
            bytes than empty ones, so cutting a noisy background saves more than cutting the same
            area of flat colour — and cutting empty letterbox bars saves the least, because those
            pixels were already nearly free to store.
          </P>
          <P>
            ZipGIF's own 20-GIF crop test, published on the cropper page, measured exactly this
            pattern: across the 20 files, the median crop removed 36% of the pixels and 22% of the
            bytes. Tight square avatar crops did best, giving back 44–47% for 44% of the pixels
            removed, because the discarded region was busy background. Letterbox crops paid the
            least, at 33% of the pixels for only 11–16% of the file. Those are measurements of
            those files, not a promise for yours — the only number worth trusting for your file is
            the one the tool shows you after your own crop. And if the cropped file is still too
            big, the remaining levers are the ones in the smaller-GIF guide: trim, resize, fewer
            frames, or compression, in that order of visible cost.
          </P>

          <H2 id="mistakes">Seven mistakes people make when cropping a GIF</H2>
          <H3>1. Cropping a still instead of the animation</H3>
          <P>
            A still-image editor keeps one frame and discards the rest. If the result does not
            move, the tool was wrong, not the GIF. Crop in a tool that plays the animation inside
            the crop box.
          </P>
          <H3>2. Framing on the first frame only</H3>
          <P>
            Subjects drift, cameras pan, and reactions move across the frame. A crop that fits
            frame 1 can decapitate frame 40. Watch a full loop in the preview before downloading,
            and frame for the whole movement, not the opening pose.
          </P>
          <H3>3. Letting the platform's auto-crop decide</H3>
          <P>
            Upload a widescreen GIF as an avatar and the platform crops it for you, usually from
            the centre. If the subject is off-centre — and interesting subjects usually are — crop
            to 1:1 yourself first.
          </P>
          <H3>4. Cropping when the problem is time or scale</H3>
          <P>
            A GIF that is too long needs trimming, not cropping; a GIF that is shown smaller than
            its stored size needs resizing, not cropping. Cropping either one throws away picture
            without fixing the actual problem.
          </P>
          <H3>5. Expecting bytes to fall as fast as pixels</H3>
          <P>
            Palette, headers, and per-frame overhead stay put, so a 30% pixel cut is not a 30%
            byte cut. Judge the crop by the tool's reported output size, not by the area you
            removed — and compress afterwards if the target is still out of reach.
          </P>
          <H3>6. Cropping smaller than the display size</H3>
          <P>
            A GIF cropped to 200 pixels wide and then displayed at 400 will be upscaled, and
            upscaling softens everything. Crop to the size the GIF will actually be shown at, never
            below it. If you need both a small file and a large display, you need compression, not
            a smaller crop.
          </P>
          <H3>7. Cropping empty bars and expecting a big saving</H3>
          <P>
            Letterbox bars look wasteful, but flat black pixels compress to almost nothing, so
            removing them saves less than the area suggests. Crop the bars anyway for framing —
            just do not be surprised when the file barely moves, and reach for trim or compression
            for the actual saving.
          </P>
          <P>
            The routine that avoids all seven: decide which job it is (crop, trim, or resize),
            frame the crop over the full playing loop, crop to the display size, check the reported
            output size, and compress only if the target is still out of reach. The{" "}
            <In to="/gif-cropper">GIF cropper</In> does the framing and the arithmetic; the
            judgement about what to keep is still yours, and it is the only part no tool can do
            for you.
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
              <Cite href={SRC.gifsicle}>
                Gifsicle manual: optimization, cropping, and lossy options
              </Cite>
            </li>
            <li>
              <Cite href={SRC.discordFiles}>Discord: File Attachments FAQ</Cite>
            </li>
            <li>
              <Cite href={SRC.discordEmoji}>Discord: Beginner&apos;s guide to custom emojis</Cite>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Platform rules change. The Discord figures were taken from the linked pages in October
            2026; if an upload fails, check the platform&apos;s current page before assuming the
            numbers above still hold. The 20-GIF crop figures come from ZipGIF&apos;s own crop
            test published on the cropper page, and the pixel maths in the file-size section is
            arithmetic, not a measurement — the byte savings on any particular GIF can only be
            read from that GIF&apos;s own result.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToCropAGif;
