import type { ReactNode } from "react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPost } from "@/lib/blog-posts";

const post = getPost("/blog/why-is-my-gif-so-big");

const SRC = {
  spec: "https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
  gifsicle: "https://www.lcdf.org/gifsicle/man.html",
  discordFiles: "https://support.discord.com/hc/en-us/articles/25444343291031-File-Attachments-FAQ",
};

const toc = [
  ["how-gif-stores", "How a GIF stores its pixels"],
  ["causes", "The 7 most common causes of a big GIF"],
  ["check", "How to check which cause applies to yours"],
  ["fix-order", "The fix order that wastes the least quality"],
  ["example", "What a real test showed"],
  ["when-video", "When a GIF is the wrong format"],
  ["faq", "FAQ"],
  ["sources", "Sources"],
] as const;

const causes: { title: string; why: ReactNode; fix: ReactNode }[] = [
  {
    title: "1. The dimensions are larger than they need to be",
    why: "File size follows pixel count, and pixel count grows with the square of the width. A 1000 × 1000 GIF has four times the pixels of a 500 × 500 one, on every single frame.",
    fix: <>Scale it to the size it will actually be shown at with the <In to="/gif-resizer">GIF resizer</In>. A GIF shown at 400 px wide gains nothing from being 1200 px wide.</>,
  },
  {
    title: "2. It has too many frames",
    why: "Every frame is stored as its own image. Screen recordings and clips converted from video often run at 30 frames per second or more, which doubles or triples the frames compared with a typical 10 to 15 fps GIF.",
    fix: <>Cut the parts nobody needs with the <In to="/gif-trimmer">GIF trimmer</In>, or drop every second frame. Ten to fifteen frames per second is usually smooth enough for a GIF.</>,
  },
  {
    title: "3. It is long",
    why: "Length and frame count go together. A 12-second clip at 15 fps holds 180 frames; the same moment trimmed to 4 seconds holds 60.",
    fix: "Keep the moment, not the whole scene. Trimming the start and end is often the biggest single saving.",
  },
  {
    title: "4. The footage is noisy or photographic",
    why: "GIF uses LZW compression, which works by finding repeated runs of identical pixels. Film grain, camera noise, gradients and dithering break those runs, so each frame compresses poorly.",
    fix: "Lossy GIF compression and a smaller colour palette remove most of that noise. On photo-style GIFs this usually saves far more than on flat graphics.",
  },
  {
    title: "5. Every frame uses a full 256-colour palette",
    why: "A GIF frame can use up to 256 colours. More colours mean more distinct pixel values and longer compression codes.",
    fix: "Many GIFs look almost the same at 64 or 128 colours. Reduce colours step by step and stop as soon as banding becomes visible.",
  },
  {
    title: "6. Frames are not optimized",
    why: "An unoptimized GIF stores the whole canvas for each frame even when only a small area changes. Many export tools, and some converters, skip this step.",
    fix: <>Run it through an optimizer. The <In to="/gif-compressor">ZipGIF compressor</In> uses Gifsicle optimization, which stores only the changed area of each frame where it can.</>,
  },
  {
    title: "7. The whole scene moves",
    why: "When the camera pans or the background moves, almost every pixel changes on every frame. Frame optimization then has little to remove.",
    fix: <>Crop to the part that matters with the <In to="/gif-cropper">GIF cropper</In>, or keep the background still when recording.</>,
  },
];

const faqs = [
  {
    q: "Why is my GIF bigger than the original video?",
    a: "Video formats such as MP4 compare frames and store only motion and changes very efficiently. GIF compresses each frame as a separate image with at most 256 colours, so the same clip is often many times larger as a GIF.",
  },
  {
    q: "Does looping make a GIF bigger?",
    a: "No. The loop setting is a tiny instruction in the file. A GIF set to loop forever stores the same frames as one that plays once.",
  },
  {
    q: "Does changing the speed make a GIF smaller?",
    a: "Not on its own. Faster playback keeps the same frames, so the size barely changes. The file only shrinks when frames are removed.",
  },
  {
    q: "What is a good file size for a GIF?",
    a: "It depends on where it goes. For a chat app, check its upload limit. Discord, for example, lists a 20 MB free upload limit in its File Attachments FAQ. For a web page, smaller is better for loading speed.",
  },
  {
    q: "Can I make a GIF smaller without losing any quality?",
    a: "Sometimes, a little. Lossless frame optimization can shrink badly exported GIFs. Larger savings come from fewer pixels, fewer frames, fewer colours or lossy compression, and each of those changes the image to some degree.",
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

const th = "border-b border-border px-4 py-3 text-left font-semibold";
const td = "border-b border-border px-4 py-3 text-muted-foreground";

function WhyIsMyGifSoBig() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 sm:px-6 md:py-16">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap gap-2">
              <li><L to="/" className="hover:text-foreground">Home</L> /</li>
              <li><L to="/blog" className="hover:text-foreground">Blog</L> /</li>
              <li aria-current="page" className="text-foreground">Why is my GIF so big?</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-sm text-foreground">
            By <L to="/about" className="font-medium text-primary underline underline-offset-2">Shafiullah Tareen</L>, creator of ZipGIF · Published <time dateTime={post.published}>{post.date}</time>
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
            A GIF is big because it stores every frame as a separate image with up to 256 colours and
            older compression. Large dimensions, many frames, long clips, noisy footage and missing
            optimization multiply that cost. Find which of these applies to your GIF, then fix that one
            first: it usually gives the biggest saving.
          </p>

          <nav aria-labelledby="toc-title" className="mt-10 rounded-xl border border-border bg-card p-6">
            <p id="toc-title" className="font-semibold">In this guide</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
              {toc.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="text-primary hover:underline">{label}</a></li>
              ))}
            </ol>
          </nav>

          <H2 id="how-gif-stores">How a GIF stores its pixels</H2>
          <P>
            The GIF format dates from 1989. Each frame is an image made of indexed pixels: every pixel points
            to a colour in a palette of at most 256 entries, and the frame is packed with LZW compression
            (<Cite href={SRC.spec}>W3C: GIF89a specification</Cite>). LZW is lossless. It shrinks data by
            spotting repeated patterns, such as a row of identical blue pixels.
          </P>
          <P>
            That design explains almost every large GIF. Flat cartoons and simple graphics have long runs of
            identical colour and compress well. Real footage has subtle variation in nearly every pixel, so
            LZW finds few patterns. And unlike modern video, GIF has no motion prediction, so it cannot say
            "this frame is the last one shifted two pixels left".
          </P>
          <P>
            A rough way to picture the size of a GIF is: <strong className="text-foreground">pixels per frame × number of frames × how hard each frame is to compress</strong>.
            Reduce any of the three and the file gets smaller.
          </P>

          <H2 id="causes">The 7 most common causes of a big GIF</H2>
          {causes.map((c) => (
            <section key={c.title}>
              <H3>{c.title}</H3>
              <P>{c.why}</P>
              <p className="mt-3 rounded-lg border-l-4 border-primary bg-primary/5 px-4 py-3 leading-7">
                <span className="font-semibold">Fix: </span>
                <span className="text-muted-foreground">{c.fix}</span>
              </p>
            </section>
          ))}

          <H2 id="check">How to check which cause applies to yours</H2>
          <P>You do not need special software. Look at four things and compare them with the table.</P>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr><th className={th}>Check</th><th className={th}>Sign of a problem</th><th className={th}>First fix</th></tr>
              </thead>
              <tbody>
                <tr><td className={td}>Width and height</td><td className={td}>Bigger than where it will be shown</td><td className={td}>Resize</td></tr>
                <tr><td className={td}>Frame count</td><td className={td}>Hundreds of frames, or 25+ per second</td><td className={td}>Trim or drop frames</td></tr>
                <tr><td className={td}>Length</td><td className={td}>Longer than the moment you want</td><td className={td}>Trim</td></tr>
                <tr><td className={td}>Content</td><td className={td}>Real footage, grain, gradients, moving background</td><td className={td}>Lossy compression, fewer colours, crop</td></tr>
              </tbody>
            </table>
          </div>
          <P>
            The <In to="/gif-splitter">GIF splitter</In> shows the frame count and dimensions of any GIF in
            your browser. Divide the frame count by the length in seconds to get frames per second.
          </P>

          <H2 id="fix-order">The fix order that wastes the least quality</H2>
          <P>
            Each fix costs something. Removing pixels or frames you do not need costs nothing visible.
            Removing colours or adding lossy compression slowly changes how the GIF looks. So work from the
            free fixes to the visible ones:
          </P>
          <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Trim</strong> the parts you do not need.</li>
            <li><strong className="text-foreground">Crop</strong> away empty or moving background.</li>
            <li><strong className="text-foreground">Resize</strong> to the real display size.</li>
            <li><strong className="text-foreground">Optimize and compress</strong>, raising lossy strength and lowering colours only until it fits.</li>
          </ol>
          <P>
            If you need to hit a specific size, the compressor's target file size mode tries progressively
            stronger settings and tells you honestly if the target cannot be reached. For chat apps, the
            page to <In to="/compress-gif-for-discord">compress a GIF for Discord</In> has presets for
            uploads, emoji and stickers.
          </P>

          <H2 id="example">What a real test showed</H2>
          <P>
            In a small ZipGIF test of 16 GIFs, Gifsicle optimization at <code className="rounded bg-muted px-1.5 py-0.5 text-sm">-O3</code> with
            lossy 120 and 64 colours reduced file size by 37.0% on average, and by 69.4% at best. The results
            varied a lot from file to file, which is the point of this article: how much a GIF shrinks
            depends on why it was big in the first place. The full method is in the{" "}
            <In to="/research/gif-compression-test">16-GIF compression test</In>.
          </P>
          <P>
            Treat those numbers as one small sample, not a promise. A GIF that is big because of its
            dimensions will shrink far more from resizing than from compression alone.
          </P>

          <H2 id="when-video">When a GIF is the wrong format</H2>
          <P>
            If your clip is long, filmed with a camera, or needs sound, a GIF will stay heavy whatever you
            do. MP4 or WebM video is usually much smaller for the same footage, and a muted looping video
            behaves like a GIF on most websites. GIF remains the right choice where only images are
            accepted, such as emoji, some email clients and older apps.
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

          <P>
            Related guide: <In to="/blog/how-long-can-a-gif-be">how long a GIF can be, and how frame delays and loops work</In>.
          </P>

          <H2 id="sources">Sources</H2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-muted-foreground">
            <li><Cite href={SRC.spec}>W3C: Graphics Interchange Format, Version 89a</Cite></li>
            <li><Cite href={SRC.gifsicle}>Gifsicle manual: optimization, colours and lossy options</Cite></li>
            <li><Cite href={SRC.discordFiles}>Discord: File Attachments FAQ</Cite></li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Platform rules change. The Discord limit was taken from the linked page on the publication date.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export default WhyIsMyGifSoBig;
