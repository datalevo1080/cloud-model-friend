import { createFileRoute } from "@tanstack/react-router";
import { options } from "@/pages/gif-cropper";

export const Route = createFileRoute("/gif-cropper")(options("en"));
