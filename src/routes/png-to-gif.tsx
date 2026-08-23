import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/png-to-gif";

export const Route = createFileRoute("/png-to-gif")(options("en"));
