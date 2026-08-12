import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ZipGIF — Browser-Based GIF Tools, Zero Uploads" },
      {
        name: "description",
        content:
          "ZipGIF compresses GIFs entirely in your browser with WebAssembly. Learn how the no-upload architecture works and why we built it.",
      },
      { property: "og:title", content: "About ZipGIF — Browser-Based GIF Tools" },
      {
        property: "og:description",
        content: "How ZipGIF compresses GIFs locally with WebAssembly — no servers, no uploads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/about" }],
  }),
  component: About,
});

function About() {
  return (
    <LegalPage title="About ZipGIF" subtitle="Every GIF tool. Zero uploads.">
      <h2>What ZipGIF is</h2>
      <p>
        ZipGIF is a free online GIF compressor that runs completely inside your web browser. When
        you add a GIF, nothing is uploaded: the file is read from your device into browser memory,
        processed there, and handed straight back to you as a download.
      </p>

      <h2>How the no-upload architecture works</h2>
      <p>
        The compression engine is Gifsicle — a long-established open-source GIF optimiser —
        compiled to WebAssembly. WebAssembly lets that native code execute at near-native speed
        inside your browser tab. ZipGIF loads that module once, runs it in a background Web Worker
        so the interface stays responsive, and passes your GIF to it as raw bytes.
      </p>
      <p>
        Because every step happens locally, ZipGIF has no file-processing backend, no upload
        endpoint, and no storage bucket. There is no queue, because you are the only person using
        your own CPU. If you disconnect from the internet after the page loads, compression still
        works.
      </p>

      <h2>What that means in practice</h2>
      <p>
        Practically, it means your GIFs stay private and the tool is fast for small files and
        limited only by your own device for large ones. A 200&nbsp;MB GIF on a modern laptop
        compresses in seconds; the same file on an old phone may take longer or run out of memory,
        which is a trade-off we accept in exchange for never touching your data.
      </p>

      <h2>Honest limitations</h2>
      <p>
        Browser-based processing has real limits, and we would rather state them than hide them.
        Very large files can exhaust the memory a browser tab is allowed to use. Extremely long
        GIFs take longer to analyse. And compression is fundamentally lossy above a certain point —
        no tool can shrink a detailed 30-second GIF to 256&nbsp;KB without visible quality loss.
      </p>
    </LegalPage>
  );
}
