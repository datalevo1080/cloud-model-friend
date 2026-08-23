import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/gif-compressor";

export const Route = createFileRoute("/gif-compressor")(options("en"));
