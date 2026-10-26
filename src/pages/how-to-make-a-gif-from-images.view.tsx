import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SRC = {
  gifSpec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  mdnFormats: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
};

const toc = [
  ["short-answer", "The short answer"],
  ["before", "Before you start: what you need"],
  ["steps", "Step by step with ZipGIF"],
  ["timing", "Timing: delays, frame rates, and holds"],
  ["canvas", "Canvas size and mixed image sizes"],
  ["colour", "Colour and transparency: what changes"],
  ["finishing", "Finishing touches"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "What image formats can I use?",
    a: "PNG, JPG, and WebP. Files are accepted by their type or their extension, so a correctly named .png, .jpg, .jpeg, or .webp file works. Other formats, including BMP, AVIF, and GIF itself, are skipped with a note telling you so.",
  },
  {
    q: "How many images can I turn into one GIF?",
    a: "Up to 20 images in one run, and each file must be under 200 MB. One image on its own exports as a still GIF; two or more make an animation. If you have more than 20 frames, split the sequence into two GIFs or drop some in-between frames first.",
  },
  {
    q: "Can I set a different delay for each frame?",
    a: "Not in this tool: one delay applies to every frame. To hold a frame on screen longer, add the same image again in a row — three copies at 100 ms each hold that picture for 300 ms. If you need fully independent per-frame timing, an editor that exports GIFs is the better choice.",
  },
  {
    q: "Are my images uploaded anywhere?",
    a: "No. The conversion runs in your browser tab: the images are decoded on your device, encoded into a GIF, and optimised there. Nothing is sent to a server, there is no signup, and the output carries no watermark.",
  },
  {
    q: "Why is my GIF bigger than the images I started from?",
    a: "Usually because of dimensions, frame count, or colour complexity. A GIF stores every frame as pixels with at most 256 colours, so a long, large, photographic sequence adds up fast. Shrink the canvas, drop frames, or run the result through the GIF compressor rather than re-exporting at a lower delay, which changes speed, not size.",
  },
  {
    q: "Can I make a GIF from a video this way?",
    a: "Not directly: this tool takes still images, not video files. Export the video's frames as images first — most video editors and many free tools offer an image-sequence export — then feed those images in as a sequence, in order, at the delay that matches the original frame rate.",
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

function HowToMakeAGifFromImages() {
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
                How to make a GIF from images
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How to Make a GIF From Images
          </h1>
          <p className="mt-5 text-sm text-foreground">
            By{" "}
            <L to="/about" className="font-medium text-primary underline underline-offset-2">
              Shafiullah Tareen
            </L>
            , creator of ZipGIF · Published <time dateTime="2026-10-26">October 26, 2026</time>
          </p>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src="/og-how-to-make-a-gif-from-images.svg"
              alt="How to make a GIF from images: three still images becoming one animated GIF, explained by ZipGIF"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            Making a GIF from images takes four decisions: which images, in which order, how long
            each one stays on screen, and whether the animation loops. Get those four right and the
            export itself is one click — and with ZipGIF's converter it all happens in your browser,
            with nothing uploaded.
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

          <H2 id="short-answer">The short answer</H2>
          <P>
            A GIF made from images is just a stack of still pictures played in order, each shown
            for a set time. Pick your images — PNG, JPG, or WebP — put them in playback order, set
            one frame delay that applies to every frame, choose whether the GIF loops forever,
            plays once, or repeats a set number of times, and export. One image on its own becomes
            a still GIF; two or more become an animation.
          </P>
          <P>
            The two things most people get wrong are order and timing. Order is decided by the
            sequence you feed the tool, not by file names alone, so check the thumbnails before you
            export. Timing is a duration per frame, not a frame rate setting: a delay of 100
            milliseconds per frame plays at about 10 frames per second, and 500 milliseconds plays
            at about 2. Everything else in this guide is detail around those two decisions.
          </P>

          <H2 id="before">Before you start: what you need</H2>
          <P>
            You need a set of still images and a rough idea of the motion. Common sources are
            photos taken in burst mode, screenshots of a process, frames exported from an editor or
            a video, and artwork drawn frame by frame. If you are starting from a single still
            image and need to invent motion from scratch, that is a different job —{" "}
            <In to="/blog/how-to-animate-a-png">animating a PNG image</In> covers creating frames
            before you convert them.
          </P>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
            <li>
              Formats: PNG, JPG, or WebP. Anything else is skipped with a note, so check the
              message if a file seems to vanish.
            </li>
            <li>
              Count and size: up to 20 images per run, each under 200 MB. Twenty frames is plenty
              for a short loop; longer sequences should be trimmed to the essential motion first.
            </li>
            <li>
              Order: name files so that sorting matches playback order — frame-001, frame-002,
              and so on. Without zero-padding, frame-10 sorts before frame-2 and the animation
              scrambles. You can still fix the order by dragging thumbnails in the tool.
            </li>
            <li>
              Size: ideally every image has the same dimensions. Mixed sizes still work — the
              first image sets the canvas and the rest are fitted inside it — but matching sizes
              avoids surprises, as explained below.
            </li>
            <li>
              One caveat: an animated PNG (APNG) dropped in converts as a single frame, because
              the tool reads still images and does not unpack APNG animation. Export an APNG's
              frames as separate images first.
            </li>
          </ul>

          <H2 id="steps">Step by step with ZipGIF</H2>
          <Figure
            src="/blog/images-to-gif-steps.svg"
            alt="Four steps: pick PNG, JPG, or WebP images; drag thumbnails into playback order; set one delay and a loop count; export and download the GIF"
            w={960}
            h={420}
            caption="Pick, order, time, export. The whole job is those four steps."
          />
          <ol className="mt-8 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              Drop your images on the <In to="/png-to-gif">PNG to GIF converter</In>. Files are
              read on your device and never uploaded, and each one appears as a numbered
              thumbnail.
            </li>
            <li>
              Drag the thumbnails into playback order. This order — not the file names — is what
              the GIF will play, so watch the sequence once in your head before moving on.
            </li>
            <li>
              Set the frame delay in milliseconds. The default is 100 ms per frame, about 10
              frames per second. The tool shows the nominal frame rate next to the delay as you
              change it, which saves you the arithmetic.
            </li>
            <li>
              Choose the loop setting: loop forever, play once, or repeat a custom number of
              times. Forever suits reaction GIFs and looping graphics; once suits an animation
              that should play and stop.
            </li>
            <li>
              Press Convert to GIF, check the preview in the results card, and download. If
              anything looks off — order, speed, or framing — fix that one setting and convert
              again. Each run is fast and costs nothing.
            </li>
          </ol>
          <P>
            If the preview plays too fast, raise the delay rather than deleting frames: deleting
            frames removes motion, while a longer delay keeps every frame and simply shows each
            one longer. If it plays too slowly, lower the delay — but remember the delay cannot go
            below 10 ms in this tool, and very short delays can make viewers drop frames anyway.
          </P>

          <H2 id="timing">Timing: delays, frame rates, and holds</H2>
          <P>
            A GIF has no single frame rate. Each frame carries its own delay, and the nominal frame
            rate is just 1000 divided by the delay in milliseconds. That is why guides that say
            "GIFs are 10 fps" are misleading: a GIF's speed is whatever its delays add up to, and
            two GIFs with the same frame count can play at completely different speeds.{" "}
            <In to="/blog/how-many-fps-are-gifs">How GIF frame delays relate to FPS</In> explains
            this in full.
          </P>
          <Figure
            src="/blog/images-frame-delay.svg"
            alt="Delay and nominal frame rate: 100 ms is about 10 fps, 200 ms about 5 fps, 500 ms about 2 fps, 1000 ms about 1 fps; 12 frames at 100 ms run for 1.2 seconds per loop"
            w={960}
            h={400}
            caption="Delay is a duration; frame rate is derived from it. Total loop time is frames times delay."
          />
          <P>
            Total loop time is just as easy: frames multiplied by delay. Twelve frames at 100 ms
            each run for 1.2 seconds per loop; the same twelve frames at 500 ms run for 6 seconds.
            Decide the loop length you want first, then divide by your frame count to get the
            delay. A reaction GIF usually feels right at 100 to 200 ms; a step-by-step demo or
            slideshow reads better at 500 to 1000 ms, giving the eye time to absorb each image.
          </P>
          <H3>One delay for every frame — and the workaround</H3>
          <P>
            This tool sets a single delay for all frames, so you cannot give one frame a longer
            pause than the others directly. The practical workaround is duplication: to hold a
            frame on screen longer, add the same image again in a row. Three copies at 100 ms hold
            that picture for 300 ms, and the viewer sees a deliberate pause rather than a frozen
            glitch. It costs a little file size, but for a title card or a punchline frame it is
            the simplest honest fix.
          </P>
          <P>
            One more rounding detail: GIF stores delays in hundredths of a second (
            <Cite href={SRC.gifSpec}>GIF89a specification</Cite>), so a delay you type is rounded
            to the nearest 10 ms on export. 100 ms is stored exactly; an odd value like 35 ms
            becomes 40 ms. For ordinary delays this drift is invisible, but do not rely on
            millisecond-perfect timing in a GIF — the format cannot express it.
          </P>

          <H2 id="canvas">Canvas size and mixed image sizes</H2>
          <P>
            The first image you add sets the output dimensions for the whole GIF. Every later
            image is fitted inside that canvas, centred, and never stretched: a smaller or
            differently shaped image keeps its proportions and the leftover space becomes
            transparent padding. That rule is why the first image matters most — put your largest
            or most important image first when your sources are uneven.
          </P>
          <Figure
            src="/blog/images-canvas-fit.svg"
            alt="The first image sets the GIF canvas size; later images are fitted inside it, centred, never stretched, with transparent padding"
            w={960}
            h={420}
            caption="First image sets the canvas. Everything else is fitted inside it, never stretched."
          />
          <P>
            If you would rather have no padding at all, fix the sources before converting:{" "}
            <In to="/gif-resizer">resize</In> or <In to="/gif-cropper">crop</In> the odd images to
            a common size first, then convert. And if the finished GIF is too large for its
            destination, the size fix usually comes after export — see the finishing touches
            below — not from shrinking the delay, which only changes speed.
          </P>

          <H2 id="colour">Colour and transparency: what changes</H2>
          <P>
            Shape and sharpness survive conversion untouched. Colour depth does not. A PNG or WebP
            source can hold millions of colours, while a GIF frame holds at most 256 colours — 255
            when the GIF is transparent, because one palette slot is reserved for transparency.
            Flat graphics, text, screenshots, and line art come through essentially identical.
            Photographs are the honest exception: skies and skin tones band slightly where a
            smooth gradient is flattened into 256 steps. If your sequence is photographic and
            every shade matters, GIF is the wrong container and no converter will change that.
          </P>
          <P>
            Transparency follows the same on-or-off rule. GIF has no partial transparency, so the
            converter makes pixels less than half opaque fully transparent and keeps the rest
            opaque. Soft shadows, glows, and feathered edges therefore turn into hard edges, and
            can show a light halo against a dark background. The fix takes seconds in any editor:
            flatten soft shadows onto the background colour the GIF will sit on before
            converting, so only the fully empty area is cut away. Hard-edged logos and stickers
            need nothing at all.
          </P>
          <P>
            After encoding, the tool runs an optimisation pass over the GIF bytes and keeps the
            optimised result when it is smaller, which squeezes out redundancy between frames.
            That is free size saving with no quality cost, and one reason to export here rather
            than in a tool that skips optimisation.
          </P>

          <H2 id="finishing">Finishing touches</H2>
          <P>
            The exported GIF is rarely the final file. Four follow-up steps cover almost every
            case: if it is too large for its destination,{" "}
            <In to="/gif-compressor">compress the GIF</In> — trimming, palette, and compression
            choices are covered in{" "}
            <In to="/blog/how-to-make-a-gif-size-smaller">making a GIF smaller</In>. If the
            framing is off, <In to="/gif-cropper">crop it</In>; if the dimensions are wrong,{" "}
            <In to="/gif-resizer">resize it</In>. If the timing feels off after export, the{" "}
            <In to="/gif-speed-changer">speed changer</In> adjusts the delays of an existing GIF
            without rebuilding it from the images. And if you want to check what actually ended
            up in the file, the <In to="/gif-splitter">splitter</In> shows every frame.
          </P>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>Frames play out of order</H3>
          <P>
            Check the thumbnail order in the tool, not just the file names. Drag thumbnails until
            the sequence reads correctly, then convert again. For next time, rename with
            zero-padded numbers so sorting matches playback.
          </P>
          <H3>The animation is too fast or too slow</H3>
          <P>
            Adjust the delay, not the frame count. Raise it to slow down, lower it to speed up,
            and remember the 10 ms floor and the rounding to hundredths of a second.
          </P>
          <H3>One frame stays on screen too briefly</H3>
          <P>
            Duplicate that image in a row. Each copy adds one more delay-length hold, so three
            copies at 100 ms hold the picture for 300 ms.
          </P>
          <H3>The GIF has transparent bars or padding</H3>
          <P>
            Your images have mixed sizes and the first image set a larger canvas. Either reorder
            so the largest image is first, or resize the sources to a common size before
            converting.
          </P>
          <H3>Soft edges turned hard or haloed</H3>
          <P>
            That is GIF's on-or-off transparency, not a conversion error. Flatten soft shadows
            onto the destination background colour before converting, or accept the hard edge
            for flat artwork.
          </P>
          <H3>The GIF is much larger than the images were</H3>
          <P>
            Check dimensions, frame count, and colour complexity first. Fewer frames, a smaller
            canvas, or compression help more than changing the delay, which affects speed, not
            size.
          </P>
          <H3>A file was skipped</H3>
          <P>
            The tool skips files that are not PNG, JPG, or WebP, files that are empty, and files
            over 200 MB, and tells you which ones and why. Convert the rejected file to an
            accepted format, or split a large sequence, and try again.
          </P>
          <H3>An APNG came out as a single frame</H3>
          <P>
            That is expected: the tool reads still images and does not unpack APNG animation.
            Export the APNG as separate PNG frames in an APNG-aware editor first, then convert
            the sequence.
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
              <Cite href={SRC.gifSpec}>W3C: Graphics Interchange Format, Version 89a</Cite>
            </li>
            <li>
              <Cite href={SRC.mdnFormats}>MDN: Image file type and format guide</Cite>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Tool behaviour described here follows ZipGIF's own PNG to GIF tool code and page:
            accepted formats, the 20-image and 200 MB limits, first-image canvas sizing,
            centred fitting, the single uniform delay, loop options, and the 50% transparency
            threshold. Platform rules change; check the destination's current documentation
            before relying on a limit.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToMakeAGifFromImages;
