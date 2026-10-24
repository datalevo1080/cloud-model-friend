import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-make-a-gif-size-smaller.view"));

const post = getPost("/blog/how-to-make-a-gif-size-smaller");

export const options = {
  head: () => blogPostHead(post),
  component: Page,
};
