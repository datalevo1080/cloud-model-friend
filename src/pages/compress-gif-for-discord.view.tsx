import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { L } from "@/components/l";
import { DiscordFit } from "@/components/tool/discord-fit";
import { RelatedTools } from "@/components/related-tools";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { discordFaqs } from "@/lib/discord-faqs";
import { cn } from "@/lib/utils";

const LAST_UPDATED = "September 2026";

const limits = [
  {
    thing: "Attachment, default for all users",
    limit: "10 MiB",
    target: "8 MB",
    href: "https://discord.com/developers/docs/reference",
  },
  {
    thing: "Custom emoji, static or animated",
    limit: "256 KiB",
    target: "256 KB at 128×128",
    href: "https://discord.com/developers/docs/resources/emoji",
  },
  {
    thing: "Sticker (PNG, APNG, GIF, Lottie)",
    limit: "512 KiB",
    target: "512 KB at 320×320",
    href: "https://discord.com/developers/docs/resources/sticker",
  },
];

function DiscordGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex gap-2">
              <li>
                <L to="/gif-compressor" className="underline underline-offset-2 hover:text-foreground">
                  GIF compressor
                </L>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Compress GIF for Discord</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Compress GIF for Discord — under 10MB, 256KB or 512KB
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            By Shafiullah Tareen · Last updated: {LAST_UPDATED}
          </p>

          <p className="mt-6 text-lg leading-relaxed">
            Pick your Discord target — upload, emoji or sticker — drop in your GIF, and get a file
            that fits. This GIF compressor for Discord runs entirely in your browser: no upload,
            no signup, no watermark. It only compresses as much as your target actually needs, and
            shows you exactly what changed.
          </p>

          {/* The chooser + tool comes before any long content. */}
          <DiscordFit />

          <h2 className="mt-12 text-2xl font-bold tracking-tight">How it works</h2>
          <ol className="mt-4 space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Choose a target.</strong> Under 10 MB for a
              regular upload, 256 KB for an emoji, 512 KB for a sticker — or set your own custom
              size.
            </li>
            <li>
              <strong className="text-foreground">2. Drop in your GIF.</strong> The tool
              automatically tries stronger settings until the file fits, then stops.
            </li>
            <li>
              <strong className="text-foreground">3. Compare and download.</strong> Check the
              before/after slider, see the size saved, and download the result.
            </li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">Which preset should I choose?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Match the preset to where the GIF is going. These are the limits Discord publishes in
            its own developer documentation.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <caption className="sr-only">Discord upload limits and recommended targets</caption>
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">Upload type</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Limit</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Target to set</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {limits.map((l) => (
                  <tr key={l.thing} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 font-normal">{l.thing}</th>
                    <td className="px-4 py-3 font-medium text-primary">{l.limit}</td>
                    <td className="px-4 py-3">{l.target}</td>
                    <td className="px-4 py-3">
                      <a
                        className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
                        href={l.href}
                        rel="noopener nofollow"
                        target="_blank"
                      >
                        Discord docs
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Posting to a channel? Use Under 10 MB. Making a custom emoji? Use Under 256 KB — this
            Discord emoji compressor preset also caps dimensions at 128×128 for you. Building a
            sticker? Use Under 512 KB, which targets 320×320.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            What the automatic process actually does
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Instead of one fixed recipe, the tool walks a ladder from gentle to strong. It starts
            with optimization and mild lossy compression, then reduces colours, then resizes, and
            only drops frames when nothing else is enough. The moment your GIF fits the target, it
            stops — so a file that already fits is returned untouched, and one that barely needs
            help keeps its full size and frame count. You'll see the original size, result size,
            percentage saved, dimensions, frames, and a list of exactly what was changed. Nothing
            is ever enlarged, and no target is promised before the file is actually processed.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">If 256 KB still fails</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Some GIFs honestly can't reach emoji size at watchable quality — usually because
            they're long, not because they're colourful. When that happens the tool says so instead
            of faking success. The fix is less content:{" "}
            <L to="/gif-trimmer" className="text-primary underline underline-offset-4">
              trim the GIF to just the key moment
            </L>{" "}
            or{" "}
            <L to="/gif-cropper" className="text-primary underline underline-offset-4">
              crop the GIF to the action
            </L>
            , then compress again. Cutting duration in half cuts the file roughly in half before
            compression even starts.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">Your GIFs never leave your device</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Compression runs on your own CPU with a WebAssembly build of Gifsicle. There is no
            upload, no queue, no server copy, and nothing to delete later. Open your network tab
            while you compress — no request carries your file. After the first visit the tool even
            works offline.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">Limitations, honestly</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Very large GIFs process more slowly because your device does all the work. Photographic
            footage compresses less gracefully than flat, cartoon-style art. And Discord never
            re-encodes uploads for you, so a file that's still over the limit will simply be
            rejected — if you need full manual control instead of a target, use the{" "}
            <L to="/gif-compressor" className="text-primary underline underline-offset-4">
              free GIF compressor
            </L>{" "}
            or the{" "}
            <L to="/gif-resizer" className="text-primary underline underline-offset-4">
              GIF resizer
            </L>{" "}
            directly.
          </p>

          <section aria-labelledby="discord-faq" className="mt-12">
            <h2 id="discord-faq" className="text-2xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              {discordFaqs.map((item, i) => {
                const expanded = openFaq === i;
                return (
                  <div key={item.q}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(expanded ? null : i)}
                        aria-expanded={expanded}
                        aria-controls={`discord-faq-panel-${i}`}
                        id={`discord-faq-button-${i}`}
                        className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold"
                      >
                        {item.q}
                        <ChevronDown
                          className={cn(
                            "size-5 shrink-0 text-muted-foreground transition-transform",
                            expanded && "rotate-180",
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>
                    <div
                      id={`discord-faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`discord-faq-button-${i}`}
                      hidden={!expanded}
                      className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
                    >
                      {item.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <p className="mt-10 text-lg">
            Ready? Choose a target above and{" "}
            <strong className="font-semibold">make your GIF smaller for Discord</strong> — free,
            private, and done in seconds.
          </p>
        </article>
        <RelatedTools current="/compress-gif-for-discord" picks={["/gif-compressor", "/gif-resizer", "/gif-cropper"]} />

      </main>
      <SiteFooter />
    </div>
  );
}

export const Page = DiscordGuide;

export default DiscordGuide;
