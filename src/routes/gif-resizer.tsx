import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/gif-resizer";

export const Route = createFileRoute("/gif-resizer")(options("en"));
