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
  },
];

function Blog() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">ZipGIF Blog</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Guides to GIF size and length</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Short, practical explanations for people whose GIF is too long, too large or will not upload.
          </p>
          <ul className="mt-12 space-y-6">
            {posts.map((p) => (
              <li key={p.href} className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">{p.date}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  <L to={p.href} className="hover:text-primary">{p.title}</L>
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">{p.excerpt}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default Blog;
