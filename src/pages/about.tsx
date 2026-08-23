import { makeRouteOptions } from "@/i18n/route-options";
import { Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import authorImage from "@/assets/shafiullah-tareen.png.asset.json";

export const options = makeRouteOptions("/about", {
  head: () => ({
    meta: [
      { title: "About ZipGIF — Browser-Based GIF Tools, Zero Uploads" },
      {
        name: "description",
        content:
          "ZipGIF compresses, crops, resizes and converts GIFs entirely in your browser with WebAssembly. Meet the maker and learn how the no-upload architecture works.",
      },
      { property: "og:title", content: "About ZipGIF — Browser-Based GIF Tools" },
      {
        property: "og:description",
        content: "How ZipGIF processes GIFs locally with WebAssembly — no servers, no uploads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/about" }],
  }),
  component: About,
});

const stats = [
  { value: "8", label: "GIF tools, all client side" },
  { value: "0", label: "Files ever uploaded" },
  { value: "100%", label: "Processing done in your tab" },
];

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* About 2 — header */}
        <section className="px-4 py-16 sm:px-6 md:py-24 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-start gap-x-12 gap-y-8 md:grid-cols-2 md:gap-x-16">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                  About us
                </p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Every GIF tool. Zero uploads.
                </h1>
              </div>
              <div className="space-y-5 text-[15px] leading-7 text-muted-foreground">
                <p>
                  ZipGIF is a set of free GIF tools that run completely inside your web browser.
                  When you add a GIF, nothing is uploaded: the file is read from your device into
                  browser memory, processed there, and handed straight back to you as a download.
                </p>
                <p>
                  The engine is Gifsicle, a long established open source GIF optimiser, compiled to
                  WebAssembly and run inside a background Web Worker so the interface stays
                  responsive. There is no upload endpoint, no queue, and no storage bucket, because
                  the only CPU involved is your own.
                </p>
              </div>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-muted/40 md:mt-16">
              <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {stats.map((s) => (
                  <div key={s.label} className="px-6 py-8 text-center">
                    <div className="text-4xl font-bold tracking-tight text-foreground">{s.value}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="border-t border-border px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why we built it</h2>
              <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
                Most online GIF tools ask you to hand your file to a stranger's server, wait in a
                queue, and trust a privacy policy you did not read. That felt backwards for
                something a browser can already do. So ZipGIF does the work locally, at native
                speed, and keeps your files on your device.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Honest limitations</h2>
              <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
                Browser based processing has real limits and we would rather state them. Very large
                files can exhaust the memory a tab is allowed to use, long GIFs take longer to
                analyse, and compression is lossy above a certain point. No tool can shrink a
                detailed 30 second GIF to 256 KB without visible quality loss.
              </p>
            </div>
          </div>
        </section>

        {/* Introduce the team */}
        <section className="border-t border-border px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Our team
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Introduce the team</h2>
              <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                ZipGIF is built and maintained by one person who cares a lot about fast tools and
                files that stay where they belong.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="md:col-span-1">
                <img
                  src={authorImage.url}
                  alt="Shafiullah Tareen, creator of ZipGIF"
                  width={480}
                  height={480}
                  loading="lazy"
                  className="aspect-square w-full max-w-xs rounded-2xl object-cover"
                />
                <h3 className="mt-6 text-xl font-semibold">Shafiullah Tareen</h3>
                <p className="text-sm font-medium text-primary">Creator &amp; Maintainer</p>
                <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                  Shafiullah designs, builds and writes every part of ZipGIF, from the WebAssembly
                  compression pipeline to the words on this page. Questions, bug reports and
                  feature ideas are always welcome at{" "}
                  <a href="mailto:shafitareen431@gmail.com" className="text-primary underline">
                    shafitareen431@gmail.com
                  </a>
                  .
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                  <a
                    href="https://www.linkedin.com/in/shafiullah-tareen-507857268"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://www.facebook.com/shafi.sami.336"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline hover:text-foreground"
                  >
                    Facebook
                  </a>
                  <a
                    href="mailto:shafitareen431@gmail.com"
                    aria-label="Email Shafiullah Tareen"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    Email
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-8 md:col-span-2">
                <h3 className="text-xl font-semibold">Working on ZipGIF</h3>
                <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                  Every tool ships with the same rule: if a feature needs a server, it does not get
                  built. That constraint shapes the roadmap. Compression, cropping, resizing, speed
                  changes, splitting, trimming and PNG conversion all run through the same local
                  engine, so anything new has to fit inside a browser tab too.
                </p>
                <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                  If your work depends on a GIF step that is still slow today, say which one. Real
                  workflows decide what gets built next.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
