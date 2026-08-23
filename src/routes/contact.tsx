import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/contact";

export const Route = createFileRoute("/contact")(options("en"));
