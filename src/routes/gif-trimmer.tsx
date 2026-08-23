import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/gif-trimmer";

export const Route = createFileRoute("/gif-trimmer")(options("en"));
