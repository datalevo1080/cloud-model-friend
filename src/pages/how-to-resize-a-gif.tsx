import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-resize-a-gif.view"));

const post = getPost("/blog/how-to-resize-a-gif");

export const options = {
  head: () => blogPostHead(post),
  component: Page,
};
