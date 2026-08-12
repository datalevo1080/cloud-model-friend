import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const faqs = [
  {
    q: "How do I compress a GIF without losing quality?",
    a: "Start with lossless work: optimize transparency and remove duplicate frames. Both cut bytes without changing a single visible pixel. Then add lossy compression slowly — strength 40 to 80 is invisible on most footage. Check the before/after slider at full size. If you can't spot a difference, you haven't lost anything that matters.",
  },
  {
    q: "How do I make a GIF smaller file size for Discord?",
    a: "Set a target size instead of guessing. Discord's default attachment limit is 10 MiB, so pick 8 MB and let the compressor binary-search the lossy level until your GIF fits. For a custom emoji use 256 KB, and for a sticker use 512 KB. Those three numbers cover almost every Discord upload you'll ever do.",
  },
  {
    q: "How long can a GIF be?",
    a: "There's no length limit in the GIF format itself — a GIF can loop forever and hold thousands of frames. The practical limit is file size, because every frame is a full still image. A 30-second GIF at 25 fps is 750 frames. Trim it to five seconds and you've cut the file by roughly 83% before compressing anything.",
  },
  {
    q: "Why can't I resize a GIF on Discord?",
    a: "Discord doesn't resize or re-encode animated images for you — it accepts or rejects them at the size you upload. That's why an oversized GIF fails instead of shrinking. Emoji must be at most 256 KiB and stickers at most 512 KiB per Discord's developer docs, so resize and compress the GIF before it ever touches the upload dialog.",
  },
  {
    q: "Why is my GIF still too big?",
    a: "Usually it's frame count, not colours. Screen recordings captured at 30 fps carry hundreds of near-identical frames, and lossy compression can only do so much with that. Drop every second frame, remove duplicates, or trim the clip shorter. If your GIF is photographic and long, honestly, MP4 or WebP will beat any GIF optimizer.",
  },
  {
    q: "Is this GIF compressor really free?",
    a: "Yes, and there's no catch we're hiding. No account, no email, no credit system, no watermark, no daily cap. Compression runs on your own CPU rather than our servers, so each file costs us nothing — which is exactly why we can leave it free and unlimited instead of metering it.",
  },
  {
    q: "Are my uploaded GIFs private?",
    a: "Nothing is uploaded, so there's nothing to keep private. Your GIF is read by your browser, compressed by a WebAssembly build of Gifsicle in a background worker, and written back to your disk. Open your network tab while you compress — you'll see no request carrying your file. After the first visit it works offline.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 id="faq" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        GIF compression questions we actually get asked
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Short answers to the things people email us about most: quality loss, Discord limits, GIF
        length, and what to do when a file just won't get small enough.
      </p>
      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((item, i) => {
          const expanded = open === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
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
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
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
  );
}
