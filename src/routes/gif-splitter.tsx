import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/gif-splitter";

export const Route = createFileRoute("/gif-splitter")(options("en"));
