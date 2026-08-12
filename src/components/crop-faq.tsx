import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const cropFaqs = [
  {
    q: "How do you crop a GIF?",
    a: "Add your GIF, drag the crop box over the part you want to keep (or pick an aspect ratio preset), then download the cropped GIF. The crop box sits over a live preview, so you can watch the animation while you frame it — that's the part that matters, because a subject that's centred on frame 1 often drifts by frame 40.",
  },
  {
    q: "Can you crop a GIF without losing the animation?",
    a: "Yes. Every frame is cropped to the exact same rectangle, so the motion stays in sync from first frame to last. Frame delays, loop count and transparency are carried through untouched, and optimized GIFs are coalesced before the cut so nothing smears. What comes out is the same animation with less picture around it.",
  },
  {
    q: "How do I crop a GIF to a square?",
    a: "Pick the 1:1 preset and the crop box locks to a perfect square you can drag anywhere over the frame. Square is the shape profile pictures, avatars and Discord emotes want, so cropping to 1:1 yourself means you decide what stays in frame instead of letting a platform's auto-crop guess for you.",
  },
  {
    q: "How do I cut a GIF file on Windows 10?",
    a: "You don't need an app. This GIF cropping tool runs in the browser, so Windows 10 and 11, macOS, Linux, Android and iOS all work the same way — open the page, drop the file, crop, download. Nothing installs, nothing uploads, and there's no Windows-only editor to hunt down.",
  },
  {
    q: "How do I blur the edges of a GIF?",
    a: "Blurring edges isn't cropping, and we won't pretend this tool does it. What most people want is a soft vignette or a round avatar. For the avatar case, crop to 1:1 and let the platform apply its round mask. For true feathered edges you need a frame-by-frame editor or a video editor that exports GIF with an alpha matte.",
  },
  {
    q: "Does cropping a GIF reduce its file size?",
    a: "Yes, though not one-for-one with the pixels. Across our 20-GIF test the median crop removed 36% of the pixels and 22% of the bytes — roughly 0.6 bytes saved per pixel cut, because palettes and headers stay put. Tight square crops did best at 44 to 47% smaller. Want more? Compress the cropped GIF afterwards.",
  },
  {
    q: "Is this GIF cropper free?",
    a: "Free, with nothing behind it. No account, no email, no watermark, no daily cap, no export limit. Cropping happens on your own CPU through a WebAssembly build of Gifsicle, so a file costs us nothing to process — which is exactly why we can leave it unmetered instead of charging per export.",
  },
];

export function CropFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
      {cropFaqs.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                aria-controls={`crop-faq-panel-${i}`}
                id={`crop-faq-button-${i}`}
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
              id={`crop-faq-panel-${i}`}
              role="region"
              aria-labelledby={`crop-faq-button-${i}`}
              hidden={!expanded}
              className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
