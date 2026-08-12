import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ZipGIF — Feedback, Bugs and Feature Requests" },
      {
        name: "description",
        content:
          "Get in touch with the ZipGIF team about bugs, feature requests, or questions on our client-side, no-upload GIF compressor.",
      },
      { property: "og:title", content: "Contact ZipGIF" },
      {
        property: "og:description",
        content: "Report a bug or request a feature for ZipGIF's browser-based GIF tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <LegalPage title="Contact" subtitle="Bugs, feature requests, and questions are all welcome.">
      <h2>Email</h2>
      <p>
        Write to{" "}
        <a href="mailto:hello@zipgif.com">hello@zipgif.com</a> and we will read it. There is no
        contact form here on purpose: a form would need a backend, and ZipGIF deliberately has
        none.
      </p>

      <h2>Reporting a GIF that will not compress</h2>
      <p>
        Include your browser, operating system, and the file's size and dimensions — that is
        usually enough to reproduce the issue. Please do not email the GIF itself unless we ask;
        most failures are reproducible from a description, and we would rather not receive your
        files.
      </p>

      <h2>Feature requests</h2>
      <p>
        Resize, Crop, and Convert are already on the roadmap and will ship with the same
        no-upload architecture. If you need something else — batch renaming, specific target
        presets, or an API-free workflow for your team — tell us which step of your work is slow
        today and we will look at it.
      </p>

      <h2>Response time</h2>
      <p>
        We usually reply within a few business days. ZipGIF is free and has no support tier, so
        replies are best-effort rather than guaranteed.
      </p>
    </LegalPage>
  );
}
