import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-make-a-gif-into-a-sticker.view"));

const post = getPost("/blog/how-to-make-a-gif-into-a-sticker");
export const PUBLISHED = post.published;

export const options = {
  head: () => blogPostHead(post, ["/blog/sticker-decision-tree.svg", "/blog/sticker-formats.svg"]),
  component: Page,
};
