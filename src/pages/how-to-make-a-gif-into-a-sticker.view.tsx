import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SRC = {
  spec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  mdn: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
  telegram: "https://core.telegram.org/stickers",
  telegramApi: "https://core.telegram.org/api/stickers",
  discord: "https://discord.com/developers/docs/resources/sticker",
};

const toc = [
  ["not-interchangeable", "Three different things"],
  ["three-kinds", "The three sticker kinds"],
  ["decision", "Which kind should you make?"],
  ["what-survives", "What survives the conversion"],
  ["workflow", "The workflow, step by step"],
  ["zipgif", "What ZipGIF can and cannot do"],
  ["errors", "Common errors"],
  ["comparison", "Static versus animated workflows"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Can I upload a GIF directly as a Telegram sticker?",
    a: "No. Telegram's sticker uploads use PNG, WebP, and WebM files, and its animated stickers are vector .TGS files. A GIF is not an accepted sticker upload there. On Discord, by contrast, the developer sticker resource lists GIF among accepted uploads, but Discord's support FAQ for custom stickers lists only PNG (static) and APNG (animated) — so test a GIF sticker in Discord's own upload flow before relying on it, and keep it under 512 KiB at 320×320.",
  },
  {
    q: "Can I turn an animated GIF into an animated Telegram sticker without redrawing it?",
    a: "Not as a vector .TGS sticker, which must be built from vector shapes. The closest path that keeps the motion is a WebM video sticker: trim the GIF to 3 seconds or less, export it as VP9 WebM at 512 pixels with no audio, and keep it under 256 KB.",
  },
  {
    q: "Why does my sticker have a white box behind it?",
    a: "The background was flattened during export, or the source GIF never had transparent pixels. GIF transparency is binary, so a frame either has fully transparent pixels or it does not. Export from a genuinely transparent frame and check the exported file before uploading.",
  },
  {
    q: "Why does my sticker look blurry or stretched?",
    a: "Either the source was small and was scaled up, or the resize stretched it to a square instead of fitting inside one. Start from the largest source you have, keep the aspect ratio, and remember Telegram needs one side at exactly 512 pixels, not necessarily both.",
  },
  {
    q: "My GIF is longer than 3 seconds. What should I do?",
    a: "Trim it to the best moment under 3 seconds for a video sticker, or pick a single frame for a static sticker. Speeding the whole clip up to fit the limit changes the motion and usually makes it harder to read.",
  },
  {
    q: "Do I need a different file for Discord and Telegram?",
    a: "Yes, prepare one export per platform. A GIF under 512 KiB at 320×320 can be tested as a Discord guild sticker, but Discord's support FAQ for custom stickers lists only PNG and APNG, so test it in Discord's own upload flow before relying on it, while Telegram needs a PNG, WebP, WebM, or .TGS export at its own dimensions and size limits. One file rarely satisfies both.",
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

function HowToMakeAGifIntoASticker() {
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
                How to turn a GIF into a sticker
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How to Turn a GIF Into a Sticker: Static vs. Animated
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
              src="/og-how-to-make-a-gif-into-a-sticker.svg"
              alt="How to turn a GIF into a sticker: static, animated, and video sticker paths explained by ZipGIF"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            Short answer: a GIF file is not automatically a sticker. Whether your GIF works as one
            depends on where you send it, and on whether you want it to move. On Discord, the developer sticker resource lists GIF among accepted uploads, but Discord's support FAQ for custom stickers lists only PNG (static) and APNG (animated) — so test a GIF sticker in Discord's own upload flow before relying on it, and keep it under 512 KiB at 320×320. On
            Telegram, it cannot: the GIF must become a static PNG or WebP image, a WebM video, or a
            rebuilt vector animation, each with its own size, dimension, and duration rules. So pick
            the platform, pick static or animated, then export to exactly the format that platform
            accepts.
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

          <H2 id="not-interchangeable">
            A GIF, a static sticker, and an animated sticker are three different things
          </H2>
          <P>
            A GIF is a file format. An animated GIF is a stack of frames, each with its own delay
            stored in hundredths of a second, drawn from a palette of at most 256 colours. Its
            transparency is binary: a pixel is either fully transparent or fully opaque, because the
            format marks one palette entry as transparent and nothing in between (
            <Cite href={SRC.spec}>GIF89a specification</Cite>). A GIF can loop, but the loop
            instruction is extra data attached to the file, not the picture itself.
          </P>
          <P>
            A sticker is a role, not a format: an image or short animation that a chat platform
            displays at a fixed size, usually with a transparent background, and sends as a reaction
            rather than as a file attachment. What counts as a sticker is decided entirely by the
            platform: its accepted formats, dimensions, file-size cap, and duration limit.
          </P>
          <P>
            That is why the same artwork can be a static sticker, an animated sticker, or neither,
            depending on how it is exported: a single frame saved as a PNG is a static sticker, the
            full animation re-encoded as WebM can be a video sticker, and the same animation
            uploaded as a .gif file is a sticker on Discord but not a sticker upload at all on
            Telegram. Nothing about the GIF changes between those outcomes; only the export and the
            destination do.
          </P>
          <P>
            So &ldquo;convert GIF to sticker&rdquo; is not one operation with one button. It is a
            chain of decisions, and skipping any of them is how most failures happen: the wrong
            format, the wrong dimensions, a file over the cap, or motion the destination silently
            drops.
          </P>

          <H2 id="three-kinds">The three sticker kinds</H2>
          <P>
            Static stickers are single images. On Telegram they are PNG or WebP files. One side must
            be exactly 512 pixels and the other 512 pixels or less, so a wide sticker can be 512
            wide and shorter, but never larger. Telegram&apos;s custom emoji are a separate, smaller
            case: exactly 100 by 100 pixels (
            <Cite href={SRC.telegram}>Telegram sticker documentation</Cite>).
          </P>
          <P>
            Animated stickers on Telegram are vector animations in the .TGS format, which is a
            gzipped Lottie animation. The canvas must be 512 by 512 pixels, the animation must loop,
            last at most 3 seconds, run at 60 frames per second, and stay under 64 KB. Because .TGS
            is vector data, not pixels, it cannot be produced by converting a GIF: the artwork must
            be built as vector shapes, typically in After Effects and exported with the Bodymovin-TG
            plugin.
          </P>
          <P>
            Video stickers are the middle path. On Telegram they are WebM files encoded with the VP9
            codec, with no audio stream: one side exactly 512 pixels, duration at most 3 seconds,
            frame rate up to 30 frames per second, size under 256 KB, and looping for the best
            experience. A single Telegram sticker set can even mix static, animated, and video
            stickers (<Cite href={SRC.telegramApi}>Telegram API sticker documentation</Cite>).
          </P>
          <P>
            Discord works differently, which is exactly why platform requirements matter: its guild
            sticker upload accepts PNG, APNG, GIF, and Lottie JSON files up to 512 KiB. A GIF is
            therefore a legitimate Discord sticker file if it fits the cap, while the same GIF
            uploaded to Telegram is not a sticker at all, because Telegram&apos;s sticker uploads
            are PNG, WebP, and WebM files, plus vector animations through its sticker tools (
            <Cite href={SRC.discord}>Discord sticker documentation</Cite>).
          </P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                Telegram&apos;s sticker requirements, from its official documentation. Other
                platforms differ — see the Discord note above.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Kind
                  </th>
                  <th scope="col" className={th}>
                    Format
                  </th>
                  <th scope="col" className={th}>
                    Dimensions
                  </th>
                  <th scope="col" className={th}>
                    Duration
                  </th>
                  <th scope="col" className={th}>
                    Size
                  </th>
                  <th scope="col" className={th}>
                    Motion
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Static sticker</td>
                  <td className={td}>PNG or WebP</td>
                  <td className={td}>One side exactly 512 px, other 512 px or less</td>
                  <td className={td}>None (single image)</td>
                  <td className={td}>No size cap stated in the requirements</td>
                  <td className={td}>None</td>
                </tr>
                <tr>
                  <td className={td}>Animated sticker (.TGS)</td>
                  <td className={td}>.TGS (Lottie vector)</td>
                  <td className={td}>Canvas exactly 512 by 512 px</td>
                  <td className={td}>3 seconds maximum, looped</td>
                  <td className={td}>64 KB maximum</td>
                  <td className={td}>Vector animation at 60 fps</td>
                </tr>
                <tr>
                  <td className={td}>Video sticker</td>
                  <td className={td}>WebM (VP9, no audio)</td>
                  <td className={td}>One side exactly 512 px, other 512 px or less</td>
                  <td className={td}>3 seconds maximum, looped</td>
                  <td className={td}>256 KB</td>
                  <td className={td}>Video up to 30 fps</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Figure
            src="/blog/sticker-formats.svg"
            alt="Three Telegram sticker kinds at a glance: static PNG or WebP with one side 512 pixels, animated TGS vector at 512 by 512 pixels, at most 3 seconds and 64 KB at 60 frames per second, and video WebM VP9 with one side 512 pixels, at most 3 seconds and 256 KB at up to 30 frames per second"
            w={960}
            h={540}
            caption="Telegram's three sticker kinds. Discord, by contrast, accepts GIF files up to 512 KiB."
          />

          <H2 id="decision">Which kind should you make?</H2>
          <P>
            Start from the destination, not from the file. If the GIF&apos;s motion is the joke, a
            static sticker throws it away, leaving a video sticker or a rebuilt vector sticker. If
            one frame reads clearly on its own, static is simpler, smaller, and accepted everywhere.
          </P>
          <P>
            For Telegram, the decision runs like this: does it need to move? If not, export one
            frame as PNG or WebP at 512 pixels. If it does, can the artwork be rebuilt as vector
            shapes? If yes, build a .TGS animation. If not — the usual case for a GIF made from
            video or a screen recording — trim the best 3 seconds and export a WebM video sticker.
            For Discord, check the file first: a GIF under 512 KiB may already be a valid sticker
            with no conversion at all.
          </P>
          <P>
            The figure below follows that logic: every path ends at a format the destination
            actually accepts, and the two dead ends are the mistakes this guide exists to prevent —
            uploading a GIF where GIFs are not accepted, and trying to convert pixels into a vector
            format.
          </P>
          <Figure
            src="/blog/sticker-decision-tree.svg"
            alt="Decision tree: start with a GIF. If it does not need to move, make a static sticker from one frame as PNG or WebP with one side exactly 512 pixels. If it must move, ask whether it can be rebuilt as vectors: yes leads to an animated TGS sticker, no leads to a WebM video sticker. A Discord shortcut notes that a GIF under 512 KiB can be tested as a guild sticker."
            w={960}
            h={800}
            caption="Follow the destination first, then the motion. The two dead ends are uploading a .gif to Telegram and trying to convert GIF pixels into .TGS vectors."
          />

          <H2 id="what-survives">What survives the conversion, and what does not</H2>
          <P>
            Going to a static image loses motion and keeps one frame. Everything else about that
            frame survives intact: its colours, already limited to the GIF&apos;s 256-colour
            palette, and its binary transparency. What does not survive is any soft edge. A GIF has
            no partial transparency, so a glow, shadow, or anti-aliased edge was already fully
            opaque or fully transparent in the source. Saving that frame as a PNG cannot soften
            edges that were never soft, and if the GIF had no transparency at all, the sticker
            carries its background unless an editor cuts it out first.
          </P>
          <P>
            Going to a video sticker keeps the motion but re-encodes it. The 256-colour palette
            limit disappears, because video is not palette-based, and transparency is supported in
            WebM. What changes is timing and weight: the clip must fit 3 seconds and 256 KB on
            Telegram, and a GIF faster than 30 frames per second is retimed to fit the cap. Trimming
            to the best moment is usually what makes an over-long, over-size GIF fit.
          </P>
          <P>
            Going to a vector sticker keeps nothing pixel-based. The .TGS format stores shapes and
            keyframes, not frames of pixels, so a GIF cannot be converted into one by any export
            setting. The animation must be redrawn and re-timed at 60 frames per second, inside a 64
            KB budget that forces simple artwork. That is a rebuild, not a conversion: if someone
            promises one-click GIF-to-TGS conversion, the result will not be a genuine vector
            sticker.
          </P>

          <H2 id="workflow">The workflow, step by step</H2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">
                Identify the platform and the sticker type.
              </strong>{" "}
              Sticker and emoji differ on the same platform: Telegram stickers use a 512-pixel side
              while Telegram emoji are exactly 100 by 100 pixels. Confirm which one you are making
              before resizing anything.
            </li>
            <li>
              <strong className="text-foreground">Decide static or animated.</strong> Pick the frame
              that reads on its own for a static sticker, or the 3-second moment that carries the
              motion for an animated one.
            </li>
            <li>
              <strong className="text-foreground">Prepare the artwork and background.</strong> If
              you want a cut-out look, the background must actually be transparent in the exported
              file; a GIF with a solid background will not become transparent by changing its file
              extension.
            </li>
            <li>
              <strong className="text-foreground">
                Trim, resize, or convert only as required, and only with tools that support the
                operation.
              </strong>{" "}
              Trimming to 3 seconds, resizing to 512 pixels, and exporting one frame as a PNG are
              three separate operations, each needing a tool that really does it.
            </li>
            <li>
              <strong className="text-foreground">
                Check the exported file against the destination&apos;s official requirements.
              </strong>{" "}
              Format, dimensions, duration, file size, and, for video, no audio stream. Check the
              numbers, not your memory of them — platforms change their limits.
            </li>
            <li>
              <strong className="text-foreground">
                Upload through the platform&apos;s own process.
              </strong>{" "}
              The @Stickers mini app on Telegram, which accepts PNG, WebP, and WebM uploads, or the
              guild&apos;s sticker upload on Discord. A file that never goes through the
              platform&apos;s sticker flow is just a file, however good it looks.
            </li>
          </ol>

          <H2 id="zipgif">What ZipGIF can and cannot do</H2>
          <P>
            ZipGIF has no sticker exporter, and this article does not pretend otherwise: there is no
            button here that turns a GIF into a Telegram or Discord sticker, uploads it, or builds a
            vector animation. What ZipGIF does have is the preparation steps around that gap, all
            running in your browser with no upload.
          </P>
          <P>
            To trim a GIF to the 3 seconds a video sticker allows, use the{" "}
            <In to="/gif-trimmer">GIF trimmer</In>: drag the start and end handles around the moment
            you want, and the kept frames keep their original timing. To set the dimensions, use the{" "}
            <In to="/gif-resizer">GIF resizer</In>, which has a Telegram Sticker preset at 512 by
            512 pixels; the preset sets dimensions only, so the output is still a GIF until you
            convert it elsewhere. To make a static sticker, pick the best frame with the{" "}
            <In to="/gif-splitter">GIF splitter</In>, which shows every frame with its number and
            delay, then export it as a PNG with the <In to="/gif-to-png">GIF to PNG converter</In>,
            which keeps the GIF&apos;s transparency. To fit a size cap, use the{" "}
            <In to="/gif-compressor">GIF compressor</In> to shrink the file before export.
          </P>
          <P>
            What remains outside ZipGIF is the format step itself: encoding a WebM video, rebuilding
            a vector animation, cutting out a background, and uploading to the platform. Those need
            a video editor, a vector animation tool, an image editor, and the platform&apos;s own
            upload flow, in that order.
          </P>

          <H2 id="errors">Common errors</H2>
          <H3>Uploading an unsupported format</H3>
          <P>
            The most common failure is uploading the .gif file itself where GIF stickers are not
            accepted. Telegram lists PNG, WebP, and WebM for sticker uploads; a GIF is not among
            them. On Discord the same file is valid, which is why the error confuses people: the
            file is fine, the destination is wrong.
          </P>
          <H3>Exceeding a file-size limit</H3>
          <P>
            Discord guild stickers are capped at 512 KiB, Telegram video stickers at 256 KB, and
            Telegram vector stickers at 64 KB. A GIF that plays perfectly in chat can still be far
            over those caps, so compress, trim, or resize first, and check the exported file&apos;s
            size rather than the original&apos;s.
          </P>
          <H3>Losing transparency</H3>
          <P>
            If a sticker arrives with a white or black box behind it, the background was flattened
            during export: either the source GIF had no transparent pixels, or the export filled
            them in. Go back to a genuinely transparent frame and confirm transparency in the
            exported file before uploading.
          </P>
          <H3>Wrong dimensions</H3>
          <P>
            Telegram requires one side of exactly 512 pixels for stickers, so a 500- or 600-pixel
            export fails even if it looks right. Also watch fitting inside a square versus
            stretching to it: fitting keeps proportions but leaves one side shorter, while
            stretching forces the exact square and distorts the picture.
          </P>
          <H3>Too long</H3>
          <P>
            A video sticker over 3 seconds on Telegram does not fit the specification. Trim to the
            best moment instead of speeding the whole clip up, which changes the motion you chose it
            for.
          </P>
          <H3>Audio in a video export</H3>
          <P>
            Telegram video stickers must have no audio stream. GIFs carry no audio, so this only
            bites when the source is a video file — but a video editor&apos;s default export often
            includes an empty or silent audio track, which still counts.
          </P>

          <H2 id="comparison">Static versus animated sticker workflows</H2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                The same artwork, two different jobs. Telegram formats are shown; Discord accepts
                GIF files directly, up to 512 KiB.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Step
                  </th>
                  <th scope="col" className={th}>
                    Static sticker
                  </th>
                  <th scope="col" className={th}>
                    Animated sticker
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Starting point</td>
                  <td className={td}>One frame that reads on its own</td>
                  <td className={td}>A moment of motion, 3 seconds or less</td>
                </tr>
                <tr>
                  <td className={td}>Output format (Telegram)</td>
                  <td className={td}>PNG or WebP</td>
                  <td className={td}>WebM video, or .TGS vector if rebuilt</td>
                </tr>
                <tr>
                  <td className={td}>Motion</td>
                  <td className={td}>Lost by design</td>
                  <td className={td}>Kept, re-encoded or redrawn</td>
                </tr>
                <tr>
                  <td className={td}>Transparency</td>
                  <td className={td}>Binary transparency from the GIF, kept</td>
                  <td className={td}>Supported in WebM; vector shapes define their own edges</td>
                </tr>
                <tr>
                  <td className={td}>Hardest limit</td>
                  <td className={td}>One side exactly 512 px</td>
                  <td className={td}>
                    3 seconds and 256 KB for video; 64 KB and vector-only for .TGS
                  </td>
                </tr>
                <tr>
                  <td className={td}>Preparation tools</td>
                  <td className={td}>
                    Splitter to pick the frame, GIF to PNG to export it, resizer for dimensions
                  </td>
                  <td className={td}>
                    Trimmer for duration, compressor for size, video or vector editor for the format
                  </td>
                </tr>
                <tr>
                  <td className={td}>Best for</td>
                  <td className={td}>Reactions, logos, and single expressive frames</td>
                  <td className={td}>Jokes and gestures that only work in motion</td>
                </tr>
              </tbody>
            </table>
          </div>

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
              <Cite href={SRC.telegram}>Telegram: Stickers</Cite> — static stickers in PNG or WebP
              with one side exactly 512 pixels, video stickers in WebM VP9 with no audio, at most 3
              seconds and 256 KB, animated stickers in .TGS at 512 by 512 pixels, at most 3 seconds,
              64 KB and 60 frames per second, and the @Stickers mini app for uploads.
            </li>
            <li>
              <Cite href={SRC.telegramApi}>Telegram API: Stickers and masks</Cite> — static stickers
              as WebP images, animated stickers as Lottie .TGS files, video stickers as VP9 WebM,
              and sticker sets that can mix all three kinds.
            </li>
            <li>
              <Cite href={SRC.discord}>Discord: Sticker resource</Cite> — guild sticker uploads
              accept PNG, APNG, GIF, and Lottie JSON files, with a maximum size of 512 KiB.
            </li>
            <li>
              <Cite href={SRC.spec}>W3C: Graphics Interchange Format, Version 89a</Cite> — frame
              delays in hundredths of a second, the transparency flag and index in the Graphic
              Control Extension, and the 256-colour palette limit.
            </li>
            <li>
              <Cite href={SRC.mdn}>MDN: Image file type and format guide</Cite> — GIF as a widely
              supported basic animation format, WebP as an animated format with transparency, and
              APNG as a lossless animation format.
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            ZipGIF-specific behaviour described above — the trimmer&apos;s start and end handles,
            the resizer&apos;s Telegram Sticker preset, the splitter&apos;s per-frame delay labels,
            and GIF-to-PNG transparency handling — reflects the site&apos;s implementation as found
            in the repository. Platform requirements change, so verify the numbers above against the
            official documentation linked here before uploading.
          </p>

          <p className="mt-10 rounded-xl border border-border bg-muted/30 p-5 leading-7 text-muted-foreground">
            Next step: if one frame says it all,{" "}
            <In to="/gif-to-png">export that frame as a PNG</In> and check it against your
            platform&apos;s sticker requirements before uploading.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToMakeAGifIntoASticker;
