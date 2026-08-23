import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/terms";

export const Route = createFileRoute("/terms")(options("en"));
