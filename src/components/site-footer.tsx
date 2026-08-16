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
            <Link to="/gif-compressor" className="text-muted-foreground hover:text-foreground">
              GIF Compressor
            </Link>
            <Link to="/gif-cropper" className="text-muted-foreground hover:text-foreground">
              GIF Cropper
            </Link>
            <Link to="/gif-resizer" className="text-muted-foreground hover:text-foreground">
              GIF Resizer
            </Link>
            <Link to="/gif-speed-changer" className="text-muted-foreground hover:text-foreground">
              GIF Speed Changer
            </Link>
            <Link to="/gif-splitter" className="text-muted-foreground hover:text-foreground">
              GIF Splitter
            </Link>
            <Link to="/gif-trimmer" className="text-muted-foreground hover:text-foreground">
              GIF Trimmer
            </Link>
            <Link to="/png-to-gif" className="text-muted-foreground hover:text-foreground">
              PNG to GIF
            </Link>
            <Link to="/gif-to-png" className="text-muted-foreground hover:text-foreground">
              GIF to PNG
            </Link>
            <Link to="/compress-gif-for-discord" className="text-muted-foreground hover:text-foreground">
              Compress GIF for Discord
            </Link>
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
