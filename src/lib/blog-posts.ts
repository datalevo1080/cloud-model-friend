/** Single source of truth for blog posts: blog index cards, sitemaps and Article schema. */
export const SITE = "https://zipgif.com";
export const AUTHOR = { name: "Shafiullah Tareen", url: `${SITE}/about` };

export type BlogPost = {
  path: string;
  title: string;
  description: string;
  excerpt: string;
  published: string; // ISO date
  date: string; // display date
  read: string;
  tag: string;
  image: string; // public path, 1200×630-ish cover
  alt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    path: "/blog/why-is-my-gif-so-big",
    title: "Why Is My GIF So Big? 7 Causes and How to Fix Each",
    description:
      "Find out why your GIF file is so big, from dimensions and frame count to noise and colours, and which fix shrinks it fastest without guesswork.",
    excerpt:
      "Dimensions, frame count, colours, noise and missing optimization: what actually makes a GIF heavy, and the fix that matches each cause.",
    published: "2026-10-07",
    date: "October 7, 2026",
    read: "8 min read",
    tag: "GIF size",
    image: "/og-why-is-my-gif-so-big.jpg",
    alt: "Why is my GIF so big: a large GIF file shrinking into a smaller optimized GIF with fewer colours and pixels",
  },
  {
    path: "/blog/how-long-can-a-gif-be",
    title: "How Long Can a GIF Be? Duration, Loops and Upload Limits",
    description:
      "Learn how long a GIF can be, how frame delays and loops affect duration, and when trimming, compression or video is the better choice.",
    excerpt:
      "How frame delays add up, why a short GIF can loop forever, and what to do when a GIF is too long or too large to upload.",
    published: "2026-10-03",
    date: "October 3, 2026",
    read: "9 min read",
    tag: "GIF length",
    image: "/og-how-long-can-a-gif-be.jpg",
    alt: "How long can a GIF be: GIF duration, frame delay and loop count explained by ZipGIF",
  },
];

export function getPost(path: string): BlogPost {
  const p = BLOG_POSTS.find((x) => x.path === path);
  if (!p) throw new Error(`Unknown blog post ${path}`);
  return p;
}

/** Head config for a blog post: meta, canonical, Article + BreadcrumbList JSON-LD. */
export function blogPostHead(post: BlogPost, extraImages: string[] = []) {
  const url = `${SITE}${post.path}`;
  const image = `${SITE}${post.image}`;
  return {
    meta: [
      { title: post.title },
      { name: "description", content: post.description },
      { name: "author", content: AUTHOR.name },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "ZipGIF" },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: post.alt },
      { property: "article:published_time", content: post.published },
      { property: "article:author", content: AUTHOR.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: post.title },
      { name: "twitter:description", content: post.description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.published,
          dateModified: post.published,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          image: [image, ...extraImages.map((i) => `${SITE}${i}`)],
          author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
          publisher: {
            "@type": "Organization",
            name: "ZipGIF",
            url: SITE,
            logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png` },
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ],
        }),
      },
    ],
  };
}
