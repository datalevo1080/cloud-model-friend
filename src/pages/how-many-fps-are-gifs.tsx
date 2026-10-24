import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-many-fps-are-gifs.view"));

const post = getPost("/blog/how-many-fps-are-gifs");
export const PUBLISHED = post.published;

export const options = {
  head: () =>
    blogPostHead(post, [
      "/blog/fps-equal-delay-timeline.svg",
      "/blog/fps-variable-delay-timeline.svg",
      "/blog/fps-encoded-vs-observed.svg",
    ]),
  component: Page,
};
