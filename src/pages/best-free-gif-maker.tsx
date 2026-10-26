import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./best-free-gif-maker.view"));

const post = getPost("/blog/best-free-gif-maker");

export const options = {
  head: () => blogPostHead(post),
  component: Page,
};
