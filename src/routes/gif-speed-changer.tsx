import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/gif-speed-changer";

export const Route = createFileRoute("/gif-speed-changer")(options("en"));
