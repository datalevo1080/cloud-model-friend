import { L } from "@/components/l";

type ToolPath =
  | "/gif-compressor"
  | "/gif-cropper"
  | "/gif-resizer"
  | "/gif-speed-changer"
  | "/gif-splitter"
  | "/gif-trimmer"
  | "/png-to-gif"
  | "/gif-to-png"
  | "/compress-gif-for-discord";

const TOOLS: Record<ToolPath, { name: string; blurb: string }> = {
  "/gif-compressor": {
    name: "GIF compressor",
    blurb: "Same GIF, smaller file. Smart mode or an exact size target, still no upload.",
  },
  "/gif-cropper": {
    name: "GIF cropper",
    blurb: "Drag a crop box, snap to a preset, and cut every frame at once.",
  },
  "/gif-resizer": {
    name: "GIF resizer",
    blurb: "Scale to exact pixels, a percentage, or a platform preset.",
  },
  "/gif-speed-changer": {
    name: "GIF speed changer",
    blurb: "Re-time the animation and decide how many times it loops.",
  },
  "/gif-splitter": {
    name: "GIF splitter",
    blurb: "Explode a GIF into every frame and download them as PNGs in one zip.",
  },
  "/gif-trimmer": {
    name: "GIF trimmer",
    blurb: "Pick a start and end point on the timeline and keep only that part.",
  },
  "/png-to-gif": {
    name: "PNG to GIF",
    blurb: "Turn one image into a GIF, or several into an animation with your own delay.",
  },
  "/gif-to-png": {
    name: "GIF to PNG",
    blurb: "Pull the first frame, or every frame, out of a GIF as clean PNG files.",
  },
  "/compress-gif-for-discord": {
    name: "Compress a GIF for Discord",
    blurb: "Hit the 10 MB attachment, 256 KB emoji and 512 KB sticker limits.",
  },
};

/**
 * Hub-and-spoke internal linking block. The compressor is always first (it is
 * the money page) and every block links back to the homepage hub, so any page
 * reaches any other page in at most two clicks.
 */
export function RelatedTools({
  current,
  picks,
}: {
  current: ToolPath;
  picks?: ReadonlyArray<ToolPath>;
}) {
  const chosen = (
    picks ?? (["/gif-compressor", "/gif-cropper", "/gif-resizer"] as ToolPath[])
  ).filter((p) => p !== current);
  const list = chosen.includes("/gif-compressor")
    ? chosen
    : (["/gif-compressor", ...chosen] as ToolPath[]);

  return (
    <section aria-labelledby="related" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 id="related" className="text-3xl font-bold tracking-tight">
        Related tools
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.slice(0, 4).map((href) => (
          <div key={href} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">
              <L to={href} className="text-primary underline-offset-4 hover:underline">
                {TOOLS[href].name}
              </L>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {TOOLS[href].blurb}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Or head back to the{" "}
        <L to="/" className="text-primary underline underline-offset-4">
          ZipGIF homepage
        </L>{" "}
        to see all eight tools in one place.
      </p>
    </section>
  );
}
