import { ArrowRight, Clock } from "lucide-react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const posts = [
  {
    href: "/blog/how-long-can-a-gif-be",
    title: "How Long Can a GIF Be? Duration, Loops and Upload Limits",
    excerpt:
      "How frame delays add up, why a short GIF can loop forever, and what to do when a GIF is too long or too large to upload.",
    date: "October 3, 2026",
    iso: "2026-10-03",
    read: "9 min read",
    tag: "GIF length",
    image: "/og-how-long-can-a-gif-be.jpg",
    alt: "How long can a GIF be: GIF duration, frame delay and loop count explained by ZipGIF",
  },
];

function Blog() {
  const [featured, ...rest] = posts;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">ZipGIF Blog</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Guides to GIF size and length
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Short, practical explanations for people whose GIF is too long, too large or will not upload.
            </p>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            {featured && (
              <article className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2">
                <L to={featured.href} className="block overflow-hidden bg-muted" aria-hidden="true" tabIndex={-1}>
                  <img
                    src={featured.image}
                    alt={featured.alt}
                    width={1200}
                    height={630}
                    loading="eager"
                    fetchPriority="high"
                    className="aspect-[1200/630] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </L>
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{featured.tag}</span>
                    <time dateTime={featured.iso}>{featured.date}</time>
                    <span className="inline-flex items-center gap-1"><Clock className="size-4" />{featured.read}</span>
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                    <L to={featured.href} className="hover:text-primary">{featured.title}</L>
                  </h2>
                  <p className="mt-4 leading-7 text-muted-foreground">{featured.excerpt}</p>
                  <L to={featured.href} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                    Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </L>
                </div>
              </article>
            )}

            {rest.length > 0 && (
              <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <li key={p.href} className="group overflow-hidden rounded-2xl border border-border bg-card">
                    <img src={p.image} alt={p.alt} width={1200} height={630} loading="lazy" className="aspect-[1200/630] w-full object-cover" />
                    <div className="p-6">
                      <time dateTime={p.iso} className="text-sm text-muted-foreground">{p.date}</time>
                      <h2 className="mt-2 text-xl font-bold tracking-tight">
                        <L to={p.href} className="hover:text-primary">{p.title}</L>
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.excerpt}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default Blog;
