import { lazyRouteComponent } from "@tanstack/react-router";
import { blogPostHead, getPost } from "@/lib/blog-posts";

export const Page = lazyRouteComponent(() => import("./how-to-make-a-gif-from-video.view"));

const post = getPost("/blog/how-to-make-a-gif-from-video");
export const PUBLISHED = post.published;

export const options = {
  head: () =>
    blogPostHead(post, ["/blog/video-to-gif-routes.svg", "/blog/video-to-gif-size.svg"]),
  component: Page,
};
