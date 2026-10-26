import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SRC = {
  ezgifVideoToGif: "https://ezgif.com/video-to-gif",
  giphyGifMaker: "https://giphy.com/create/gifmaker",
  gifSpec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
};

const toc = [
  ["short-answer", "The short answer"],
  ["honest-start", "The honest starting point: ZipGIF has no video converter"],
  ["direct", "Route 1: a direct video-to-GIF converter"],
  ["frames", "Route 2: extract frames, then build the GIF with ZipGIF"],
  ["clip", "Choosing the clip"],
  ["small", "Keeping the file small"],
  ["choose", "Which route should you pick?"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const faqs = [
  {
    q: "Can ZipGIF convert an MP4 to a GIF directly?",
    a: "No. ZipGIF has no video-to-GIF tool: its tools accept GIF files or still images. The PNG to GIF converter accepts PNG, JPG, and WebP images only. To use ZipGIF for a video, extract the video's frames as images first, then feed those frames to the converter — or use a direct converter such as EZGIF or Giphy for the whole job.",
  },
  {
    q: "Do GIFs have sound?",
    a: "No. GIF is an image format: it stores frames and timing, not audio. Any sound in the source video is dropped when it becomes a GIF. Pick a moment that works silently, and if the sound is the point, keep the video instead of converting it.",
  },
  {
    q: "How long should a GIF made from a video be?",
    a: "A few seconds is the sweet spot. A GIF shows every frame it contains, so a long clip means many frames and a large file. Cut to the single moment you want — a reaction, a step in a tutorial, a punchline — and let the loop do the rest.",
  },
  {
    q: "What frame rate should I extract frames at?",
    a: "Start at 10 frames per second. That is smooth enough for most reactions and demonstrations, and it keeps the frame count — and therefore the file size — manageable. Raise it toward 15 or 20 only if the motion visibly stutters, and expect a larger file in return.",
  },
  {
    q: "Can I make a GIF from a YouTube video?",
    a: "Only from video you own or have permission to use. Giphy's GIF maker accepts media URLs, including YouTube and Vimeo links, but a link input does not grant you rights to someone else's video. Use your own footage, or footage you are licensed to reuse.",
  },
  {
    q: "Will the GIF look as good as the video?",
    a: "No, and that is normal. A GIF frame holds at most 256 colours, while video holds millions, so gradients and photographs band slightly. GIFs also usually end up smaller in dimensions than the source video. If pixel-perfect quality matters, a short video clip in MP4 or WebM is the better format; GIF wins on compatibility and looping, not fidelity.",
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

function HowToMakeAGifFromVideo() {
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
                How to make a GIF from a video
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How to Make a GIF From a Video
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
              src="/og-how-to-make-a-gif-from-video.svg"
              alt="How to make a GIF from a video: a video clip becoming a looping GIF, explained by ZipGIF"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full object-cover"
            />
          </figure>

          <p className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-lg leading-8">
            A GIF is a silent loop of still frames, so turning a video into one always means the
            same thing: pick a short moment, take its frames, and store them with timing. There
            are two honest ways to do it. A direct converter takes the video file and hands back
            a GIF in one step. The frames route splits the job in two: extract the frames, then
            build the GIF from those images — which is also how you can use ZipGIF, even though
            ZipGIF itself does not accept video files.
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
            If you want the fastest path, use a direct video-to-GIF converter: upload the video,
            choose the start and end of the moment, set the size and frame rate, and download the
            GIF. EZGIF and Giphy both do this, and their current pages are linked in the sources
            below.
          </P>
          <P>
            If you want privacy, or you want to control every frame before the GIF is built, use
            the frames route: extract the moment as a numbered sequence of PNG or JPG images,
            then <In to="/png-to-gif">convert those images to a GIF</In> with ZipGIF in your
            browser, where nothing is uploaded. The rest of this guide walks through both routes,
            then covers how to pick the clip and keep the file small.
          </P>

          <H2 id="honest-start">The honest starting point: ZipGIF has no video converter</H2>
          <P>
            This needs saying plainly, because many sites imply otherwise: ZipGIF cannot convert
            a video file. There is no video-to-GIF tool on the site, and dropping an MP4, MOV, or
            WebM file onto a ZipGIF tool will not work. The GIF tools accept GIF files, and the
            image-to-GIF converter accepts still images only — PNG, JPG, and WebP. A video file
            is neither, so it is rejected before anything happens.
          </P>
          <P>
            That is a limitation, not a trick, and it shapes the advice below. If a one-step
            conversion is what you need, use a direct converter. If you are happy to extract
            frames first, ZipGIF's image-to-GIF converter finishes the job entirely in your
            browser, with no upload, no account, and no watermark. Both routes end with a real
            GIF; they differ in privacy, control, and effort.
          </P>
          <Figure
            src="/blog/video-to-gif-routes.svg"
            alt="Two routes from video to GIF: the direct route converts the video file in one step with an online converter, while the frames route extracts still images first and then builds the GIF from those images"
            w={960}
            h={520}
            caption="One step or two steps: the direct route is faster, the frames route keeps the file on your device."
          />

          <H2 id="direct">Route 1: a direct video-to-GIF converter</H2>
          <P>
            A direct converter is the right choice when you want a GIF quickly and the footage is
            not private. You upload the video, trim it to the moment, and download the result.
            Two well-known free options, with facts verified from their own pages on October 26,
            2026:
          </P>
          <H3>EZGIF's video-to-GIF converter</H3>
          <P>
            EZGIF accepts a wide range of video formats — MP4, WebM, AVI, MPEG, MKV, FLV, OGG,
            MOV, M4V, WMV, ASF, and 3GP among others — with a maximum file size of 200 MB, and it
            says uploaded files are automatically deleted one hour after upload (
            <Cite href={SRC.ezgifVideoToGif}>EZGIF: MP4 video to GIF converter</Cite>). After
            upload you set the start and end times of the part you want; if you select nothing,
            it makes a GIF from the first five seconds of the clip. You can also set the loop
            count, where 0 means looping forever.
          </P>
          <P>
            One limit is worth knowing before you start: the longest section you can convert
            depends on the frame rate you choose. EZGIF states a maximum of 60 seconds at 5 frames
            per second, dropping to 30 seconds at 10 frames per second, and so on. In practice,
            most GIFs are far shorter than that, so the limit rarely bites — but a long clip at a
            high frame rate will be refused, and the fix is a shorter section or a lower frame
            rate.
          </P>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>Open EZGIF's video-to-GIF converter and upload the video file, or paste a video URL.</li>
            <li>Set the start and end times to the exact moment you want.</li>
            <li>Choose the size and frame rate, and the loop count if you want anything other than looping forever.</li>
            <li>Convert, preview the result, and download it. If it is too large, use EZGIF's crop, resize, or optimization tools on the finished GIF — or ZipGIF's compressor, below.</li>
          </ol>
          <H3>Giphy's GIF maker</H3>
          <P>
            Giphy's GIF maker takes a different approach: it is built around creating and sharing.
            Its GIF option accepts JPG, PNG, GIF, MP4, MOV, and WebM files, and it also accepts
            media URLs, including YouTube and Vimeo links, and it lets you decorate the result
            with captions, filters, and stickers (
            <Cite href={SRC.giphyGifMaker}>Giphy: GIF Maker</Cite>). That makes it a good pick
            when you want text on the GIF or you plan to share it through Giphy anyway.
          </P>
          <P>
            The trade-off is that your file goes to Giphy's service and the workflow is built
            around publishing. For a quick personal GIF that is fine; for private footage, prefer
            the frames route below, where the file never leaves your device.
          </P>

          <H2 id="frames">Route 2: extract frames, then build the GIF with ZipGIF</H2>
          <P>
            The frames route has one extra step, and it buys you two things: privacy and control.
            Because ZipGIF's converter works on still images, you decide exactly which frames go
            in, in what order, and at what timing, before anything is encoded.
          </P>
          <H3>Step 1: extract the frames</H3>
          <P>
            First, trim the video to the moment you want in any video editor, then export that
            moment as an image sequence: one still image per frame. Most video editors offer an
            image-sequence or stills export; check yours for that option before reaching for
            anything else.
          </P>
          <P>
            If you are comfortable with a command line, the free tool FFmpeg does the same job in
            one command. This example takes a clip and saves one PNG per frame at 10 frames per
            second:
          </P>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 text-sm leading-6">
            <code>ffmpeg -i clip.mp4 -vf fps=10 frame%03d.png</code>
          </pre>
          <P>
            The <code>fps=10</code> part sets how many frames are taken each second, and{" "}
            <code>frame%03d.png</code> names them frame001, frame002, and so on. The zero-padding
            matters: without it, frame-10 sorts before frame-2 and the animation scrambles. If
            the moment is 4 seconds long at 10 frames per second, you get 40 images — a sensible
            number to work with.
          </P>
          <H3>Step 2: build the GIF with ZipGIF's PNG to GIF converter</H3>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              Open <In to="/png-to-gif">convert PNG to GIF</In> and drop the extracted frames
              onto it. PNG, JPG, and WebP are all accepted.
            </li>
            <li>
              Drag the thumbnails into playback order. The first image also sets the canvas size
              for the frames that follow, so put your largest or most important image first if
              the frames differ in size — ideally, make them all the same size before you start.
            </li>
            <li>
              Set the frame delay in milliseconds. The default is 100 ms per frame, which plays
              at 10 frames per second — matching the extraction rate above, so a 40-frame
              sequence loops for 4 seconds. Lengthen the delay on a frame you want the eye to
              rest on.
            </li>
            <li>
              Choose the loop: forever, once, or a custom repeat count. Then preview the
              animation and download the GIF. Nothing was uploaded at any point.
            </li>
          </ol>
          <P>
            Two behaviours are worth knowing before you start. First, GIF transparency is on or
            off for each pixel: the converter keeps pixels above 50% alpha opaque and makes
            pixels at or below 50% fully transparent, because GIF has no partial transparency.
            Second, a GIF frame holds at most 256 colours, so photographs and gradients from
            video will band slightly — that is the format, not a fault in the conversion. If the
            finished GIF is too large for its destination,{" "}
            <In to="/gif-compressor">reduce GIF file size</In> with the compressor rather than
            re-extracting at lower quality by guesswork.
          </P>

          <H2 id="clip">Choosing the clip</H2>
          <P>
            The clip matters more than the tool. A GIF loops, so the best source moments are
            short, self-contained, and easy to read at a glance: a reaction, one step of a
            process, a before-and-after. A 30-second scene with dialogue will not survive as a
            GIF — it becomes a huge file that nobody watches to the end, and the dialogue is lost
            anyway, because GIFs carry no sound.
          </P>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              Cut to one moment. Two to six seconds is a good range for most purposes; longer
              only if the action genuinely needs it.
            </li>
            <li>
              Watch the loop point. A GIF repeats, so check where the end meets the start: a
              hard cut back to the beginning reads as a jump. If the action returns naturally to
              its starting position, the loop feels seamless.
            </li>
            <li>
              Make sure it works without sound. If the joke or the instruction depends on audio,
              keep it as a video clip instead.
            </li>
            <li>
              Use video you own or have permission to use. This matters most with other
              people's clips, and a converter accepting a link does not grant you rights to the
              footage.
            </li>
          </ol>

          <H2 id="small">Keeping the file small</H2>
          <P>
            A GIF from video can easily balloon past what a chat app or a web page accepts,
            because every frame is stored in the file. Three levers control the size, and they
            multiply: duration, dimensions, and frame rate. Halving any one of them roughly
            halves the frame data; halving two quarters it. That is why the advice above keeps
            coming back to short clips, modest dimensions, and 10 frames per second.
          </P>
          <Figure
            src="/blog/video-to-gif-size.svg"
            alt="What makes a GIF from video large: longer duration, larger dimensions, and higher frame rate each multiply the amount of frame data stored in the file"
            w={960}
            h={460}
            caption="Duration, dimensions, and frame rate multiply. Trim one before you reach for quality settings."
          />
          <P>
            When a finished GIF is still too large, work through the fixes in order:{" "}
            <In to="/gif-trimmer">trim</In> the least important frames,{" "}
            <In to="/gif-resizer">resize</In> to smaller dimensions, and only then compress.
            How frame delays relate to playback speed is explained in{" "}
            <In to="/blog/how-many-fps-are-gifs">how many FPS GIFs are</In>, and the full set
            of shrinking methods is covered in{" "}
            <In to="/blog/how-to-make-a-gif-size-smaller">how to make a GIF smaller</In>. If
            the animation plays too fast or too slowly after conversion,{" "}
            <In to="/blog/how-to-slow-down-a-gif">slowing a GIF down</In> explains which
            adjustment actually changes the speed and which ones only add or remove frames.
          </P>

          <H2 id="choose">Which route should you pick?</H2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm text-muted-foreground">
                Direct converter versus the frames route
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>
                    Question
                  </th>
                  <th scope="col" className={th}>
                    Direct converter (EZGIF, Giphy)
                  </th>
                  <th scope="col" className={th}>
                    Frames route (ZipGIF PNG to GIF)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>Steps</td>
                  <td className={td}>One: upload, trim, download</td>
                  <td className={td}>Two: extract frames, then build</td>
                </tr>
                <tr>
                  <td className={td}>Privacy</td>
                  <td className={td}>File is uploaded to the service</td>
                  <td className={td}>Nothing leaves your device</td>
                </tr>
                <tr>
                  <td className={td}>Frame control</td>
                  <td className={td}>Trim points and frame rate only</td>
                  <td className={td}>Every frame chosen, ordered, and timed by you</td>
                </tr>
                <tr>
                  <td className={td}>Text and stickers</td>
                  <td className={td}>Yes, in Giphy's maker</td>
                  <td className={td}>No — add those before extracting, or after with an editor</td>
                </tr>
                <tr>
                  <td className={td}>Best for</td>
                  <td className={td}>A quick GIF from non-private footage</td>
                  <td className={td}>Private footage, or a GIF you want frame-perfect</td>
                </tr>
              </tbody>
            </table>
          </div>

          <H2 id="troubleshooting">Troubleshooting</H2>
          <H3>ZipGIF rejected my video file</H3>
          <P>
            That is expected: ZipGIF's tools accept GIF files or still images, not video. Extract
            the frames first, or use a direct converter for the whole job.
          </P>
          <H3>The GIF is far too large</H3>
          <P>
            Shorten the clip, reduce the dimensions, or lower the frame rate — in that order.
            Each roughly halves the frame data. Then compress the finished GIF rather than
            re-extracting by guesswork.
          </P>
          <H3>The motion looks choppy</H3>
          <P>
            The extraction frame rate is probably too low for fast movement. Re-extract at a
            higher rate, such as 15 frames per second, and accept the larger file — or accept
            slight choppiness for a smaller one. There is no setting that adds motion that was
            never extracted.
          </P>
          <H3>Frames play out of order</H3>
          <P>
            Check the file names. Without zero-padding, alphabetical order puts frame-10 before
            frame-2. Rename with equal-width numbers and rebuild.
          </P>
          <H3>The loop jumps at the end</H3>
          <P>
            The last frame does not flow back into the first. Pick a clip whose action returns
            to its starting position, or trim the end so the cut lands on a similar pose.
          </P>
          <H3>The GIF has no sound</H3>
          <P>
            GIFs never carry audio. If the sound matters, share the video clip instead, or accept
            the silent loop.
          </P>
          <H3>Colours look banded or posterised</H3>
          <P>
            That is the 256-colour limit per frame. Simplify the source if you can, or accept it:
            flat graphics survive video-to-GIF far better than photographs and gradients.
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
              <Cite href={SRC.ezgifVideoToGif}>
                EZGIF: MP4 video to GIF converter (checked October 26, 2026)
              </Cite>
            </li>
            <li>
              <Cite href={SRC.giphyGifMaker}>Giphy: GIF Maker (checked October 26, 2026)</Cite>
            </li>
            <li>
              <Cite href={SRC.gifSpec}>W3C: Graphics Interchange Format, Version 89a</Cite>
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Tool behaviour described here follows ZipGIF's own PNG to GIF page. Platform rules
            change; check the destination's current documentation before relying on a limit.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default HowToMakeAGifFromVideo;
