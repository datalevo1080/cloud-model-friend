import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — ZipGIF Free GIF Compressor" },
      {
        name: "description",
        content:
          "Plain-language terms for using ZipGIF, the free browser-based GIF compressor that never uploads your files.",
      },
      { property: "og:title", content: "Terms of Use — ZipGIF" },
      {
        property: "og:description",
        content: "Plain-language terms for the free, client-side ZipGIF compressor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/terms" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms of Use" subtitle="Plain language, no surprises.">
      <h2>Using ZipGIF</h2>
      <p>
        You may use ZipGIF free of charge, for personal or commercial work, with no account and no
        usage cap. Compression runs on your own device, so "usage" costs us nothing and we impose
        no artificial limits beyond what your browser can handle.
      </p>

      <h2>Your content</h2>
      <p>
        You keep every right to the GIFs you process. Because files never reach our servers, we
        acquire no licence, no copy, and no claim over your content. You are responsible for having
        the right to process the files you open in the tool.
      </p>

      <h2>No warranty</h2>
      <p>
        ZipGIF is provided "as is", without warranty of any kind. Compression is a lossy process
        and results depend on your file, your browser, and your device's available memory. Always
        keep your original file until you are happy with the output — the tool never modifies or
        deletes your source file, but you should still keep a backup.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for any loss arising from use of
        ZipGIF, including quality loss, lost time, or a browser tab running out of memory on a very
        large file. If a result is unsatisfactory, adjust the settings and try again.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not use ZipGIF to process content that is illegal where you live, and do not attempt to
        disrupt the site for other visitors. Since processing is local, misuse mostly affects your
        own device.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated as the product grows — for example when the Resize, Crop, and
        Convert tools ship. The current version always lives on this page.
      </p>
    </LegalPage>
  );
}
