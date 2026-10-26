import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-crop-a-gif.view"));

const post = getPost("/blog/how-to-crop-a-gif");

export const options = {
  head: () => blogPostHead(post),
  component: Page,
};
