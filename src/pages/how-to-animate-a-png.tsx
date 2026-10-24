import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-animate-a-png.view"));

const post = getPost("/blog/how-to-animate-a-png");
export const PUBLISHED = post.published;

export const options = {
  head: () =>
    blogPostHead(post, ["/blog/png-animation-paths.svg", "/blog/png-apng-gif-compare.svg"]),
  component: Page,
};
