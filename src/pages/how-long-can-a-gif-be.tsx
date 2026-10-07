import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-long-can-a-gif-be.view"));

const post = getPost("/blog/how-long-can-a-gif-be");
export const PUBLISHED = post.published;

export const options = {
  head: () => blogPostHead(post, ["/blog/gif-loop-timeline.svg"]),
  component: Page,
};
