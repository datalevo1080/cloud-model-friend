import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-slow-down-a-gif.view"));

const post = getPost("/blog/how-to-slow-down-a-gif");
export const PUBLISHED = post.published;

export const options = {
  head: () => blogPostHead(post, ["/blog/slow-down-timing.svg", "/blog/slow-down-methods.svg"]),
  component: Page,
};
