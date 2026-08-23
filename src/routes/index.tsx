import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/index";

export const Route = createFileRoute("/")(options("en"));
