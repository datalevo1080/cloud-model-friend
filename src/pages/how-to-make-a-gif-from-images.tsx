import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-make-a-gif-from-images.view"));

const post = getPost("/blog/how-to-make-a-gif-from-images");
export const PUBLISHED = post.published;

export const options = {
  head: () =>
    blogPostHead(post, [
      "/blog/images-to-gif-steps.svg",
      "/blog/images-frame-delay.svg",
      "/blog/images-canvas-fit.svg",
    ]),
  component: Page,
};
