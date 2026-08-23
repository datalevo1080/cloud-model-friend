import { L } from "@/components/l";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Plain-text answers power the FAQPage schema; the JSX answers below render the
 * same words with links. Keep the two in sync word for word.
 */
export const resizeFaqs: { q: string; a: string; jsx: React.ReactNode }[] = [
  {
    q: "How do I resize a GIF without losing quality?",
    a: "Scale down, never up, and keep the aspect ratio locked. Shrinking an animated GIF resamples pixels that already exist, so the result stays sharp. Enlarging invents pixels that were never captured, which is where the mush comes from. Stick to 50% or 25% steps when you can.",
    jsx: (
      <>
        Scale down, never up, and keep the aspect ratio locked. Shrinking an animated GIF resamples
        pixels that already exist, so the result stays sharp. Enlarging invents pixels that were
        never captured, which is where the mush comes from. Stick to 50% or 25% steps when you can.
      </>
    ),
  },
  {
    q: "how do i resize a gif",
    a: "Drop the file on the tool at the top of this page, pick Dimensions, Percentage, or a preset, then press Resize GIF and download the result. It runs in your browser on a WebAssembly build of gifsicle, so the GIF never gets uploaded anywhere and there is no account step.",
    jsx: (
      <>
        Drop the file on the tool at the top of this page, pick Dimensions, Percentage, or a preset,
        then press Resize GIF and download the result. It runs in your browser on a WebAssembly
        build of gifsicle, so the GIF never gets uploaded anywhere and there is no account step.
      </>
    ),
  },
  {
    q: "how to resize animated gif",
    a: "Use a tool that scales every frame together, which is what this one does. Each GIF frame is its own image, so resizing frame by frame in an image editor breaks the timing and the palette. Here the whole file is coalesced, scaled, then re-optimized, and the animation plays exactly as before.",
    jsx: (
      <>
        Use a tool that scales every frame together, which is what this one does. Each GIF frame is
        its own image, so resizing frame by frame in an image editor breaks the timing and the
        palette. Here the whole file is coalesced, scaled, then re-optimized, and the animation
        plays exactly as before.
      </>
    ),
  },
  {
    q: "how to shrink a gif",
    a: "Decide which kind of smaller you mean. Fewer pixels is a resize: set a percentage or exact width here and the GIF gets physically smaller on screen. Fewer bytes at the same dimensions is compression, and the GIF compressor handles that. Doing both, in that order, gives the biggest drop.",
    jsx: (
      <>
        Decide which kind of smaller you mean. Fewer pixels is a resize: set a percentage or exact
        width here and the GIF gets physically smaller on screen. Fewer bytes at the same dimensions
        is compression, and the{" "}
        <L to="/gif-compressor" className="text-primary underline-offset-4 hover:underline">
          GIF compressor
        </L>{" "}
        handles that. Doing both, in that order, gives the biggest drop.
      </>
    ),
  },
  {
    q: "how to enlarge a gif",
    a: "Type a bigger width or set the percentage above 100, and the tool will do it while warning you first. Nothing gets sharper. The upscaled GIF is the same detail spread over more pixels, plus visible palette artifacts. If you still have the source video, re-export the GIF from that instead.",
    jsx: (
      <>
        Type a bigger width or set the percentage above 100, and the tool will do it while warning
        you first. Nothing gets sharper. The upscaled GIF is the same detail spread over more
        pixels, plus visible palette artifacts. If you still have the source video, re-export the
        GIF from that instead.
      </>
    ),
  },
  {
    q: "how do you make gifs smaller",
    a: "Two levers, and they are not the same lever. Resizing cuts pixel area, so a 50% width drops roughly three quarters of the pixels. Compression keeps the dimensions and squeezes colors and frames. Resize first for a screen-size problem, compress after for an upload-limit problem.",
    jsx: (
      <>
        Two levers, and they are not the same lever. Resizing cuts pixel area, so a 50% width drops
        roughly three quarters of the pixels. Compression keeps the dimensions and squeezes colors
        and frames. Resize first for a screen-size problem, compress after for an upload-limit
        problem.
      </>
    ),
  },
  {
    q: "Why does Discord say it cannot resize my GIF?",
    a: "Because Discord does not re-encode animated images for you. It checks the emoji or sticker you uploaded against its own rules and rejects anything outside them. Resize the GIF to 128x128 for an emoji or 320x320 for a sticker before you open the upload dialog, and the message goes away.",
    jsx: (
      <>
        Because Discord does not re-encode animated images for you. It checks the emoji or sticker
        you uploaded against its own rules and rejects anything outside them. Resize the GIF to
        128×128 for an emoji or 320×320 for a sticker before you open the upload dialog, and the
        message goes away.
      </>
    ),
  },
];

export function ResizeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
      {resizeFaqs.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                aria-controls={`resize-faq-panel-${i}`}
                id={`resize-faq-button-${i}`}
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
              id={`resize-faq-panel-${i}`}
              role="region"
              aria-labelledby={`resize-faq-button-${i}`}
              hidden={!expanded}
              className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
            >
              {item.jsx}
            </div>
          </div>
        );
      })}
    </div>
  );
}
