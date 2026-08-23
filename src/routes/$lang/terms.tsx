import { createFileRoute, notFound } from "@tanstack/react-router";
import { options, Page } from "@/pages/terms";
import { PREFIXED_LOCALES, type Locale } from "@/i18n/config";

export const Route = createFileRoute("/$lang/terms")({
  beforeLoad: ({ params }) => {
    if (!(PREFIXED_LOCALES as string[]).includes(params.lang)) throw notFound();
  },
  head: (ctx) => options(ctx.params.lang as Locale).head!(),
  component: Page,
});
