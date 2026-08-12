import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ZipGIF Never Uploads Your Files" },
      {
        name: "description",
        content:
          "ZipGIF's privacy policy: no file uploads, no accounts, no tracking pixels. GIF compression happens entirely on your device.",
      },
      { property: "og:title", content: "Privacy Policy — ZipGIF" },
      {
        property: "og:description",
        content: "No uploads, no accounts, no tracking pixels. Your GIFs stay on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" subtitle="Short version: we never receive your files.">
      <h2>Files you compress</h2>
      <p>
        Your GIFs are never uploaded. They are read directly from your device into your browser's
        memory, processed by a WebAssembly build of Gifsicle running in your own browser tab, and
        written back out as a download. ZipGIF operates no upload endpoint and no file storage, so
        there is no copy of your file for us — or anyone else — to access.
      </p>

      <h2>Accounts and personal data</h2>
      <p>
        We do not collect personal data because there is nothing to sign up for. ZipGIF has no
        login, no email capture, and no payment flow. Your compression settings (such as your light
        or dark theme preference) are stored in your browser's local storage and never transmitted.
      </p>

      <h2>Cookies and tracking</h2>
      <p>
        ZipGIF sets no cookies and embeds no tracking pixels, advertising scripts, or third-party
        analytics beacons that profile you. That is also why you do not see a cookie consent banner
        — there is nothing to consent to.
      </p>

      <h2>Server logs</h2>
      <p>
        Serving the page itself involves standard web hosting. Our host may record ordinary request
        metadata such as IP address, timestamp, and user agent for security and reliability
        purposes. That metadata concerns the delivery of the web page — it never contains your GIF
        or anything derived from it.
      </p>

      <h2>Children and third parties</h2>
      <p>
        Because ZipGIF collects no personal information from anyone, it collects none from
        children. We share nothing with third parties, because we hold nothing to share.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy ever changes, the updated version will be published on this page. The
        no-upload architecture is the core of the product, so any change that weakened it would be
        stated plainly and prominently.
      </p>
    </LegalPage>
  );
}
