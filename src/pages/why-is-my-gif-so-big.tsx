import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./why-is-my-gif-so-big.view"));

const post = getPost("/blog/why-is-my-gif-so-big");

export const options = {
  head: () => blogPostHead(post),
  component: Page,
};
