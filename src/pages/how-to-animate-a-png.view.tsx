import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SRC = {
  gifSpec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  apngSpec: "https://wiki.mozilla.org/APNG_Specification",
  mdnFormats: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
};

const toc = [
  ["short-answer", "The short answer"],
  ["formats", "PNG, APNG, and GIF: three different things"],
  ["situations", "First, work out which situation you are in"],
  ["one-png", "Situation 1: one static PNG"],
  ["frame-sequence", "Situation 2: a set of PNG frames"],
  ["apng", "Situation 3: an APNG you want to convert"],
  ["choose", "APNG or GIF: how to choose"],
  ["zipgif", "Trying it with ZipGIF's PNG to GIF converter"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Can I just rename a PNG to .gif or .apng to animate it?",
    a: "No. Renaming changes the label, not the contents. A renamed PNG still holds one still image, so a viewer has nothing to animate. Real animation needs frames and timing stored in the file, which only an editor or converter can add.",
  },
  {
    q: "Does APNG work everywhere a GIF does?",
    a: "Not quite. Every current major browser plays APNG, but chat apps, social platforms, and email clients vary: some accept it, some convert it, and some show only the still default image. If the destination matters more than quality, GIF is the safer choice.",
  },
  {
    q: "Will converting APNG to GIF keep smooth transparency?",
    a: "No. GIF transparency is on or off for each pixel, so a soft shadow or feathered edge becomes a hard edge, sometimes with a visible halo against a different background. Keep the background colour in mind before converting, or stay with APNG.",
  },
  {
    q: "How many frames do I need for smooth motion?",
    a: "It depends on the movement. Simple slides, fades, and blinks read well at around 10 to 12 frames per second. Fast or detailed motion looks smoother with more frames, but every frame adds size. Start low, preview the result, and add frames only where the motion visibly stutters.",
  },
  {
    q: "Can ZipGIF turn my APNG into a GIF?",
    a: "Not directly. ZipGIF's PNG to GIF converter reads still PNG images, so an APNG dropped in converts as a single frame. Export the APNG as separate PNG frames in an APNG-aware editor first, then feed those frames to the converter.",
  },
  {
    q: "Is APNG better than GIF?",
    a: "For picture quality, usually yes: APNG keeps full colour and smooth transparency, while GIF is limited to 256 colours per frame and on-or-off transparency. For compatibility, GIF still wins. Pick APNG for the web and GIF for wherever the file must play without question.",
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

function HowToAnimateAPng() {
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
                How to animate a PNG image
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How to Animate a PNG Image: APNG, GIF, and Frame Sequences
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
              src="/og-how-to-animate-a-png.svg"
              alt="How to animate a PNG image: one still PNG frame becoming a row of animation frames, explained by ZipGIF"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            A PNG file on its own does not move. To animate a PNG you must either create the frames
            that show the motion, or convert an animation you already have into a format your
            destination accepts. The two animated formats that matter here are APNG, which is PNG
            with animation, and GIF. Which one you pick depends on where the animation will be shown
            and how much colour and transparency quality you need.
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
            There are three different starting points, and they need three different workflows. If
            you have one still PNG, you have to create motion: build a series of frames in which the
            artwork changes slightly from one frame to the next. If you already have a set of PNG
            frames, you only have to order them, set their timing, and export. If you already have
            an animated PNG (APNG) and need a GIF, you are converting, not creating: the motion
            already exists, but the colours, transparency, and timing have to be translated into
            what GIF can hold.
          </P>
          <P>
            The confusion usually comes from the file extension. A PNG and an APNG often both end in
            .png, and a GIF is a different format altogether. The extension is a label. What decides
            whether a file moves is what is stored inside it: one image, or a sequence of images
            with timing.
          </P>

          <H2 id="formats">PNG, APNG, and GIF: three different things</H2>
          <H3>An ordinary PNG is one still image</H3>
          <P>
            PNG is a still-image format with lossless compression, full colour, and full alpha
            transparency, meaning each pixel can be anything from fully opaque to fully transparent,
            with every shade in between (
            <Cite href={SRC.mdnFormats}>MDN: Image file type and format guide</Cite>). Nothing in a
            plain PNG describes a second frame, a delay, or a loop. Renaming it to .gif or .apng
            adds none of those things; at best you get a still image wearing the wrong extension,
            and at worst a file some apps refuse to open.
          </P>
          <H3>APNG is PNG with animation added</H3>
          <P>
            APNG extends PNG with extra chunks that describe the animation: one chunk declares how
            many frames there are and how often they loop, and each frame carries its own size,
            position, and delay, stored as a fraction of a second (
            <Cite href={SRC.apngSpec}>APNG Specification</Cite>). It keeps PNG's strengths,
            including 24-bit colour and 8-bit transparency, so gradients stay smooth and soft edges
            stay soft. APNG was originally a Mozilla extension and has since been incorporated into
            the PNG specification's third edition, which is why the .png extension is still correct
            for it.
          </P>
          <P>
            APNG is also deliberately backwards compatible. A viewer that does not understand the
            animation chunks ignores them and shows a single image: the default image stored in the
            file. That is a useful safety net, and also the reason an APNG can look like a still
            image in the wrong app. It is not broken; the viewer is simply showing the fallback.
            Current major browsers all support APNG: MDN lists Chrome 59, Edge 12, Firefox 3, Opera
            46, and Safari 8 as the versions that introduced it (
            <Cite href={SRC.mdnFormats}>MDN: Image file type and format guide</Cite>).
          </P>
          <H3>GIF is a separate, older animation format</H3>
          <P>
            GIF stores a sequence of frames, each with its own delay measured in hundredths of a
            second (<Cite href={SRC.gifSpec}>GIF89a specification</Cite>). Its limits are the ones
            to remember: each frame can use at most 256 colours, and transparency is a single
            palette colour that is either fully visible or fully transparent, with no partial
            levels. Looping comes from a widely supported application extension rather than the
            original specification text. In exchange, GIF plays almost everywhere: browsers, chat
            apps, email clients, and older software.
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                PNG, APNG, and GIF at a glance
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Property
                  </th>
                  <th scope="col" className={th}>
                    PNG
                  </th>
                  <th scope="col" className={th}>
                    APNG
                  </th>
                  <th scope="col" className={th}>
                    GIF
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Animated?</td>
                  <td className={td}>No, one still image</td>
                  <td className={td}>Yes</td>
                  <td className={td}>Yes</td>
                </tr>
                <tr>
                  <td className={td}>Colours per frame</td>
                  <td className={td}>Full colour</td>
                  <td className={td}>Full colour</td>
                  <td className={td}>At most 256</td>
                </tr>
                <tr>
                  <td className={td}>Transparency</td>
                  <td className={td}>Full alpha, per pixel</td>
                  <td className={td}>Full alpha, per pixel</td>
                  <td className={td}>On or off only</td>
                </tr>
                <tr>
                  <td className={td}>Frame timing</td>
                  <td className={td}>None</td>
                  <td className={td}>Fraction of a second</td>
                  <td className={td}>Hundredths of a second</td>
                </tr>
                <tr>
                  <td className={td}>Looping</td>
                  <td className={td}>Not applicable</td>
                  <td className={td}>Loop count, 0 means forever</td>
                  <td className={td}>Loop count via extension</td>
                </tr>
                <tr>
                  <td className={td}>Viewer without support</td>
                  <td className={td}>Shows the image</td>
                  <td className={td}>Shows the default image</td>
                  <td className={td}>Shows the first frame</td>
                </tr>
                <tr>
                  <td className={td}>Typical extension</td>
                  <td className={td}>.png</td>
                  <td className={td}>.apng or .png</td>
                  <td className={td}>.gif</td>
                </tr>
              </tbody>
            </table>
          </div>

          <H2 id="situations">First, work out which situation you are in</H2>
          <P>
            Everything below follows from one question: what do you already have? A single still
            image, a folder of frames, or a finished animation in the wrong format? Pick your row,
            and ignore the rest until you need it.
          </P>
          <Figure
            src="/blog/png-animation-paths.svg"
            alt="Three paths: one static PNG needs motion created before export as APNG or GIF; a PNG frame sequence needs ordering and timing before export; an APNG needs its frames exported or conversion before it becomes a GIF or still PNG"
            w={960}
            h={520}
            caption="Three starting points, three workflows. Creating motion and converting motion are different jobs."
          />

          <H2 id="one-png">Situation 1: one static PNG</H2>
          <P>
            This is the only situation where motion has to be invented. An animation is a sequence
            of frames, and motion is simply the difference between one frame and the next. If every
            frame is identical, the result is a still image that happens to be stored as an
            animation. So the work is drawing, or arranging, those differences.
          </P>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              Decide what moves, and how far. A logo sliding in, a character blinking, a button
              pulsing: one clear movement beats several competing ones.
            </li>
            <li>
              Build the frames in an animation or image editor. Duplicate the artwork onto each
              frame, then change it a little each time: shift its position, scale it, or fade its
              opacity. Small, even steps look smoother than one big jump.
            </li>
            <li>
              Keep every frame the same canvas size. Frames of different sizes cause cropping,
              padding, or rejection depending on the tool, and the animation will judder.
            </li>
            <li>
              Set a delay for each frame. A uniform 100 milliseconds per frame is a reasonable
              starting point, about 10 frames per second in nominal terms, and you can lengthen the
              delay on a frame you want the eye to rest on.
            </li>
            <li>
              Export as APNG or GIF, then watch the result in a browser before you share it.
              Previewing catches reversed frames and wrong delays that are hard to spot in an editor
              timeline.
            </li>
          </ol>
          <P>
            One tempting shortcut deserves a warning. Animating a PNG with CSS on a web page moves
            the image on that page, but it does not create an animation file. Download or share the
            PNG and the motion stays behind. If you need a file that moves wherever it goes, you
            need frames in the file itself.
          </P>

          <H2 id="frame-sequence">Situation 2: a set of PNG frames</H2>
          <P>
            A frame sequence is a folder of still images, one per frame, in playback order. It is
            the raw material of animation: video editors import it directly, and converters turn it
            into APNG or GIF. If you exported frames from an editor, a screen recording, or another
            animation, this is where you start, and no new artwork is needed.
          </P>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              Check the order first. Name frames so that alphabetical sorting matches playback
              order: frame-001, frame-002, and so on. Without zero-padding, frame-10 sorts before
              frame-2 and the animation scrambles.
            </li>
            <li>
              Check that every frame has the same dimensions, and fix the odd ones out before
              converting rather than hoping the converter guesses correctly.
            </li>
            <li>
              Set the timing. A uniform delay is the simplest choice; vary it only where a pause or
              a held frame is deliberate. Remember that GIF rounds delays to hundredths of a second,
              so very fine APNG timing will not survive a GIF export exactly.
            </li>
            <li>
              Set the loop count: forever for a looping graphic, once for an animation that should
              play and stop.
            </li>
            <li>
              Export as APNG if colour and soft transparency matter, or as GIF if the file must play
              anywhere. Then preview the exported file, not just the editor timeline.
            </li>
          </ol>
          <P>
            A frame sequence is also a useful intermediate format in the other direction. If you
            have a GIF and want its frames as editable stills,{" "}
            <In to="/gif-to-png">converting a GIF to PNG</In> with the all-frames option produces
            exactly such a numbered sequence, which you can edit and re-export.
          </P>

          <H2 id="apng">Situation 3: an APNG you want to convert</H2>
          <P>
            Start by confirming what you actually have. Because APNG files usually carry the .png
            extension, the extension alone proves nothing. Open the file in a browser: if it moves,
            it is animated. If it sits still, it is either a plain PNG or an APNG shown by a viewer
            that only displays the default image. When in doubt, an editor that lists frames will
            settle it.
          </P>
          <H3>APNG to GIF: what changes</H3>
          <P>
            Conversion is translation, and GIF cannot express everything APNG can. Colours are
            reduced to at most 256 per frame, so gradients and photographs band or dither. Smooth
            alpha becomes on-or-off transparency, so soft shadows and feathered edges turn into hard
            edges, sometimes with a light halo against a dark background. Frame delays are rounded
            to hundredths of a second. None of this means the conversion failed; it means the target
            format is narrower. If the result looks wrong, the fix is usually to simplify the
            artwork or accept APNG for that destination, not to run the same conversion again.
          </P>
          <H3>APNG to still PNG</H3>
          <P>
            This direction is simple: take the default image, or the frame you want, and save it as
            a PNG. That is also what viewers without APNG support already show, so if your audience
            sees a still image where you expected motion, check whether their app supports APNG
            before rebuilding anything.
          </P>
          <H3>The ZipGIF limitation to know about</H3>
          <P>
            ZipGIF's PNG to GIF converter reads still PNG images. An APNG dropped into it converts
            as a single frame, because the tool does not unpack APNG animation. The workaround is to
            export the APNG as separate PNG frames in an APNG-aware editor first, then feed those
            frames to the converter as a sequence. That two-step route is honest extra work, but it
            preserves your control over ordering and timing.
          </P>

          <H2 id="choose">APNG or GIF: how to choose</H2>
          <P>
            Choose APNG when quality matters most: gradients, photographs, logos with soft shadows,
            and anything shown on a website in a current browser. Choose GIF when compatibility
            matters most: chat apps, email, and any destination that names GIF as its expected
            format. If you are unsure, export both from the same frames and compare them side by
            side for your actual artwork; there is no universal winner on file size, because it
            depends on colours, dimensions, and frame count.
          </P>
          <Figure
            src="/blog/png-apng-gif-compare.svg"
            alt="Comparison of PNG, APNG and GIF: PNG holds one still image with full colour and full alpha; APNG holds many frames with full colour and soft alpha; GIF holds many frames with at most 256 colours per frame and on-or-off transparency"
            w={960}
            h={460}
            caption="APNG keeps PNG's colour and transparency. GIF trades them for the widest support."
          />
          <P>
            One more distinction matters for the web. An animated image file is self-contained: it
            moves wherever the file goes. A CSS or scripted animation is not a file at all, so it
            cannot be uploaded, attached, or posted as an image. Do not promise a client or a
            platform an "animated PNG" and deliver a web page effect.
          </P>

          <H2 id="zipgif">Trying it with ZipGIF's PNG to GIF converter</H2>
          <P>
            If your frames are ready and GIF is the right target,{" "}
            <In to="/png-to-gif">convert PNG to GIF</In> in your browser, with nothing uploaded.
            Drop one or more PNG images onto the tool (JPG and WebP are accepted too), drag the
            thumbnails into frame order, set the delay in milliseconds, and choose whether the GIF
            loops forever, plays once, or repeats a set number of times. One image produces a still
            GIF; several produce an animation.
          </P>
          <P>
            Two behaviours are worth knowing before you start. First, transparency follows GIF's
            rules: the converter keeps pixels above 50% alpha opaque and makes pixels at or below
            50% fully transparent, because GIF has no partial transparency. Second, as noted above,
            an APNG goes in as a single frame, so export its frames first. If the finished GIF is
            too large for its destination, <In to="/gif-compressor">reduce GIF file size</In> with
            the compressor rather than re-exporting at lower quality by guesswork.
          </P>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>The renamed file does not move</H3>
          <P>
            Renaming never adds frames. Build the frames in an editor, or start from a real frame
            sequence, and export again.
          </P>
          <H3>The APNG shows as a still image</H3>
          <P>
            The viewer or app probably does not support APNG and is showing the default image. Test
            the same file in a current browser; if it moves there, the file is fine and the
            destination is the problem. Use GIF for that destination.
          </P>
          <H3>The GIF looks posterised or banded</H3>
          <P>
            That is the 256-colour limit. Simplify gradients, reduce the number of distinct colours,
            or keep the animation as APNG.
          </P>
          <H3>Transparency has a white or hard edge</H3>
          <P>
            GIF transparency is on or off, so a soft edge cannot survive conversion. Match the edge
            to the background it will sit on, or stay with APNG.
          </P>
          <H3>Frames play out of order</H3>
          <P>
            Check the file names. Without zero-padding, alphabetical order puts frame-10 before
            frame-2. Rename with equal-width numbers and re-export.
          </P>
          <H3>The animation is too fast or too slow</H3>
          <P>
            Adjust the per-frame delays rather than adding or deleting frames. Remember that GIF
            rounds delays to hundredths of a second, so tiny timing differences may vanish on
            export.
          </P>
          <H3>ZipGIF turned my APNG into a single frame</H3>
          <P>
            That is expected: the converter reads still PNG images and does not unpack APNG
            animation. Export the APNG as separate PNG frames first, then convert the sequence.
          </P>
          <H3>The GIF is much larger than the PNGs were</H3>
          <P>
            Check dimensions, frame count, and colour complexity first. Fewer frames, a smaller
            canvas, or compression usually helps more than re-exporting the same frames at a lower
            delay. You can also <In to="/gif-splitter">inspect the GIF's frames</In> to see what is
            actually stored.
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
              <Cite href={SRC.apngSpec}>
                MozillaWiki: APNG Specification (noting its incorporation into the PNG Third Edition
                specification)
              </Cite>
            </li>
            <li>
              <Cite href={SRC.mdnFormats}>MDN: Image file type and format guide</Cite>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Tool behaviour described here follows ZipGIF's own PNG to GIF and GIF to PNG pages.
            Platform rules change; check the destination's current documentation before relying on a
            limit.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToAnimateAPng;
