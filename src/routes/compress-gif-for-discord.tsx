import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SITE = "https://zipgif.com";
const PATH = "/compress-gif-for-discord";
const TITLE = "Compress GIF for Discord — Fit the 10 MiB Limit Free";
const DESCRIPTION =
  "Compress a GIF for Discord in seconds. Verified limits for attachments, emoji and stickers, plus the exact target sizes that always upload.";
const LAST_UPDATED = "August 2026";
const MODIFIED = "2026-08-12";

const limits = [
  {
    thing: "Attachment, default for all users",
    limit: "10 MiB",
    target: "8 MB",
    href: "https://discord.com/developers/docs/reference",
  },
  {
    thing: "Custom emoji, static or animated",
    limit: "256 KiB",
    target: "256 KB at 128×128",
    href: "https://discord.com/developers/docs/resources/emoji",
  },
  {
    thing: "Sticker (PNG, APNG, GIF, Lottie)",
    limit: "512 KiB",
    target: "512 KB at 320×320",
    href: "https://discord.com/developers/docs/resources/sticker",
  },
];

export const Route = createFileRoute("/compress-gif-for-discord")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Shafiullah Tareen" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}${PATH}` },
      { property: "og:site_name", content: "ZipGIF" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}${PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to compress a GIF for Discord",
          description: DESCRIPTION,
          dateModified: MODIFIED,
          mainEntityOfPage: `${SITE}${PATH}`,
          author: {
            "@type": "Person",
            name: "Shafiullah Tareen",
            description: "Developer and maintainer of ZipGIF, a browser-based GIF toolbox.",
          },
          publisher: { "@type": "Organization", name: "ZipGIF", url: `${SITE}/` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "GIF Compressor", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Compress GIF for Discord", item: `${SITE}${PATH}` },
          ],
        }),
      },
    ],
  }),
  component: DiscordGuide,
});

function DiscordGuide() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex gap-2">
              <li>
                <Link to="/" className="underline underline-offset-2 hover:text-foreground">
                  GIF compressor
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Compress GIF for Discord</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            How to compress a GIF for Discord
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            By Shafiullah Tareen · Last updated: {LAST_UPDATED}
          </p>

          <p className="mt-6 text-lg leading-relaxed">
            Discord's default upload limit is 10 MiB for every user, and it goes higher only with
            Nitro or a server's Boost Tier. Discord never re-encodes your animation, so an oversized
            GIF simply fails. Compress it to roughly 8 MB — or 256 KB for an emoji, 512 KB for a
            sticker — and it uploads first time.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">Discord size limits, verified</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            These are the numbers Discord publishes in its own developer documentation. We recheck
            them monthly, because platform limits move and stale advice is worse than none.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <caption className="sr-only">Discord upload limits and recommended targets</caption>
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">Upload type</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Limit</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Target to set</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {limits.map((l) => (
                  <tr key={l.thing} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 font-normal">{l.thing}</th>
                    <td className="px-4 py-3 font-medium text-primary">{l.limit}</td>
                    <td className="px-4 py-3">{l.target}</td>
                    <td className="px-4 py-3">
                      <a
                        className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
                        href={l.href}
                        rel="noopener nofollow"
                        target="_blank"
                      >
                        Discord docs
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Three steps that always work
          </h2>
          <ol className="mt-4 space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Trim first.</strong> Most failed Discord uploads
              are duration problems. Ten seconds of build-up plus two seconds of payoff should be two
              seconds of payoff.
            </li>
            <li>
              <strong className="text-foreground">2. Set a target, not a slider.</strong> Enter 8 MB
              (or 256 KB for an emoji) and let the tool search for the highest quality that fits.
            </li>
            <li>
              <strong className="text-foreground">3. Check at chat size.</strong> Discord renders
              GIFs small in a channel. Artifacts you can only see at 200% zoom don't exist to anyone
              scrolling past.
            </li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Why can't I resize a GIF on Discord?
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Because Discord has no editor. It validates the file you hand it and rejects anything
            over the limit for that upload type. Emoji and stickers are strictest, which is why a
            perfectly good 900 KB animation gets refused as a sticker. Shrink it before you open the
            upload dialog.
          </p>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">About the author</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Shafiullah Tareen builds ZipGIF, a browser-based GIF toolbox that compresses files
              locally with WebAssembly. He wrote this page after compressing several thousand GIFs
              while testing the engine — and after losing an embarrassing number of Discord uploads
              to that 10 MiB wall.
            </p>
          </div>

          <p className="mt-8 text-lg">
            Ready? Go{" "}
            <Link to="/" className="font-medium text-primary underline underline-offset-4">
              compress a GIF for Discord
            </Link>{" "}
            with the free GIF compressor — it runs in your browser and nothing gets uploaded.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
