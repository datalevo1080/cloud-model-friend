/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DEFAULT_LOCALE, useLocale } from "@/i18n";

type LProps = {
  to: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  [key: string]: any;
};

/**
 * Locale-aware <Link>. Keeps internal links inside the current language version:
 * on /fr/* pages `to="/gif-cropper"` resolves to /fr/gif-cropper.
 */
export function L({ to, ...rest }: LProps) {
  const locale = useLocale();
  if (locale === DEFAULT_LOCALE) {
    return <Link {...(rest as any)} to={to as any} />;
  }
  const target = to === "/" ? "/$lang" : `/$lang${to}`;
  return <Link {...(rest as any)} to={target as any} params={{ lang: locale } as any} />;
}
