import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Are my GIFs uploaded to a server?",
    a: "No. ZipGIF loads a WebAssembly build of Gifsicle into your browser and does all the work locally. Open your network tab while compressing — you will not see your file go anywhere. After the first visit the tool even works offline.",
  },
  {
    q: "How much smaller will my GIF get?",
    a: "Most GIFs shrink by 40–70%. GIFs exported from video, screen recordings and anything with duplicate frames tend to be at the top of that range. A GIF that has already been optimized may only lose a few percent.",
  },
  {
    q: "Will the quality drop?",
    a: "Lossy compression always trades some fidelity for size, but Smart Compress tunes the strength to your content so the change is hard to see. Use the before/after slider on the result to judge for yourself, and lower the strength in Advanced settings if you want to be conservative.",
  },
  {
    q: "What is the maximum file size?",
    a: "200 MB per GIF, and up to 20 GIFs in one batch. The real ceiling is your device's memory: very large GIFs on a phone may run out of RAM, in which case ZipGIF tells you instead of crashing.",
  },
  {
    q: "Does it add a watermark or require a signup?",
    a: "Never. There is no account, no email, no credit system and no watermark. The output is your GIF, unbranded.",
  },
  {
    q: "How does the target file size mode work?",
    a: "You give ZipGIF a limit — say 256 KB — and it compresses repeatedly, binary-searching the lossy strength to find the highest quality that still fits. If even the strongest setting cannot reach your target it hands back the smallest version it managed and tells you.",
  },
  {
    q: "Can I compress animated stickers or WebP files?",
    a: "Not yet. ZipGIF currently accepts .gif files only. Resize, crop and format conversion tools are on the way.",
  },
  {
    q: "Is ZipGIF really free?",
    a: "Yes, and unlimited. Because there are no servers processing your files, there are no per-file costs to pass on to you.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 id="faq" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Frequently asked questions
      </h2>
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
              {expanded && (
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
