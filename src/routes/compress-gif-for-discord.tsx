import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/compress-gif-for-discord";

export const Route = createFileRoute("/compress-gif-for-discord")(options("en"));
