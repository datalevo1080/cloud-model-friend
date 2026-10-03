import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/blog";

export const Route = createFileRoute("/blog/")(options);
