import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/about";

export const Route = createFileRoute("/about")(options("en"));
