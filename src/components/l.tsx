import { Link, type LinkProps } from "@tanstack/react-router";
import { useLocalePath } from "@/i18n";

type LProps = Omit<LinkProps, "to"> & {
  to: string;
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
  onClick?: () => void;
};

/**
 * Locale-aware <Link>. Keeps internal links inside the current language version:
 * on /fr/* pages `to="/gif-cropper"` resolves to /fr/gif-cropper.
 */
export function L({ to, ...rest }: LProps) {
  const lp = useLocalePath();
  return <Link {...(rest as LinkProps)} to={lp(to) as LinkProps["to"]} />;
}
