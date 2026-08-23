import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/gif-to-png";

export const Route = createFileRoute("/gif-to-png")(options("en"));
