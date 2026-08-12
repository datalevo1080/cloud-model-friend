import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-primary">Zip</span>
            <span className="-ml-2 text-foreground">GIF</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          ZipGIF runs entirely in your browser — your files never leave your device.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          © {new Date().getFullYear()} ZipGIF. Every GIF tool. Zero uploads.
        </p>
      </div>
    </footer>
  );
}
