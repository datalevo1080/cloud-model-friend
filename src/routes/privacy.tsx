import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/privacy";

export const Route = createFileRoute("/privacy")(options("en"));
