import { BarChart3, FlaskConical, LockKeyhole, RefreshCw } from "lucide-react";
import { L } from "@/components/l";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const findings = [
  { value: "16", label: "GIFs tested" },
  { value: "37.0%", label: "Average reduction" },
  { value: "69.4%", label: "Best observed reduction" },
] as const;

const chart = [
  { label: "Average reduction", value: 37 },
  { label: "Best observed reduction", value: 69.4 },
] as const;

function GifCompressionTest() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <article>
          <header className="border-b border-border px-4 py-14 sm:px-6 md:py-20">
            <div className="mx-auto max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                ZipGIF Research
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                GIF Compression Test: Results From 16 GIFs
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                In this small test of 16 GIFs, the established ZipGIF compressor workflow reduced
                file size by 37.0% on average. The best observed reduction was 69.4%. These results
                describe this test only; they are not a promise that every GIF will shrink by the
                same amount.
              </p>
              <p className="mt-5 text-sm font-medium text-foreground">
                Published September 21, 2026 · Shafiullah Tareen
              </p>
            </div>
          </header>

          <section aria-labelledby="findings" className="px-4 py-14 sm:px-6 md:py-16">
            <div className="mx-auto max-w-4xl">
              <h2 id="findings" className="text-3xl font-bold tracking-tight">
                Verified findings
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {findings.map((finding) => (
                  <div key={finding.label} className="rounded-xl border border-border bg-card p-6">
                    <p className="text-3xl font-bold text-primary">{finding.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{finding.label}</p>
                  </div>
                ))}
              </div>

              <figure className="mt-10 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
                <figcaption className="flex items-center gap-2 font-semibold">
                  <BarChart3 className="size-5 text-primary" aria-hidden="true" />
                  Reduction observed in the test
                </figcaption>
                <div className="mt-7 space-y-6">
                  {chart.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-end justify-between gap-4 text-sm">
                        <span>{item.label}</span>
                        <strong>{item.value.toFixed(1)}%</strong>
                      </div>
                      <div
                        className="h-4 overflow-hidden rounded-full bg-muted"
                        role="img"
                        aria-label={`${item.label}: ${item.value.toFixed(1)} percent`}
                      >
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">
                  The chart contains aggregate values only. No individual file results are shown
                  because they are not part of the verified findings for this report.
                </p>
              </figure>
            </div>
          </section>

          <section aria-labelledby="method" className="border-y border-border bg-muted/30 px-4 py-14 sm:px-6 md:py-16">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-3">
                <FlaskConical className="size-6 text-primary" aria-hidden="true" />
                <h2 id="method" className="text-3xl font-bold tracking-tight">Methodology</h2>
              </div>
              <p className="mt-5 leading-7 text-muted-foreground">
                Sixteen GIFs were processed with the established ZipGIF compressor workflow. The
                tested optimization used Gifsicle with the following settings:
              </p>
              <pre className="mt-5 overflow-x-auto rounded-lg border border-border bg-background p-4 text-sm"><code>gifsicle -O3 --lossy=120 --colors=64</code></pre>
              <p className="mt-5 leading-7 text-muted-foreground">
                The reported percentage is file-size reduction. This page does not add assumptions
                about the individual files, their categories, dimensions, frame counts, starting
                sizes, or visual quality because those details are not included in the verified
                findings.
              </p>
            </div>
          </section>

          <section className="px-4 py-14 sm:px-6 md:py-16">
            <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">What can affect results</h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  A GIF’s pixels, palette, dimensions, frame count, timing, and repeated visual
                  information can affect its output. Different input files can therefore respond
                  differently to the same settings. The observed average and best result should not
                  be applied to a GIF that was not part of this test.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Limits of this report</h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  This is a small test of 16 GIFs, not a universal benchmark or performance promise.
                  It does not claim that every GIF shrinks by 37.0%, that 69.4% is a guaranteed
                  maximum, or that compression occurs without quality loss. Results should be
                  checked on the finished file.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="privacy" className="border-y border-border bg-muted/30 px-4 py-14 sm:px-6 md:py-16">
            <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-3">
                  <LockKeyhole className="size-6 text-primary" aria-hidden="true" />
                  <h2 id="privacy" className="text-2xl font-bold tracking-tight">Privacy and processing</h2>
                </div>
                <p className="mt-4 leading-7 text-muted-foreground">
                  ZipGIF runs GIF processing in the browser. Files selected in the tool are processed
                  locally rather than uploaded to an API or file-processing server.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="size-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold tracking-tight">Reproducibility notes</h2>
                </div>
                <p className="mt-4 leading-7 text-muted-foreground">
                  To repeat the tested workflow, use Gifsicle optimization level <code>-O3</code>,
                  lossy value <code>120</code>, and a <code>64</code>-color palette. Record each
                  finished file’s byte size before calculating its reduction. A repeat test may
                  differ when the input GIFs or processing environment differ.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="next-step" className="px-4 py-14 sm:px-6 md:py-16">
            <div className="mx-auto max-w-4xl">
              <h2 id="next-step" className="text-3xl font-bold tracking-tight">Use the right workflow</h2>
              <div className="mt-6 space-y-4 leading-7 text-muted-foreground">
                <p>
                  Run your own file through the <L to="/gif-compressor" className="font-medium text-primary underline underline-offset-4">browser-based GIF compressor</L> and judge the measured output rather than this test average.
                </p>
                <p>
                  For a specific platform limit, use the <L to="/compress-gif-for-discord" className="font-medium text-primary underline underline-offset-4">Discord target-size presets</L>. If dimensions are the main issue, <L to="/gif-resizer" className="font-medium text-primary underline underline-offset-4">resize the animated GIF</L>. If duration is driving file size, <L to="/gif-trimmer" className="font-medium text-primary underline underline-offset-4">trim unneeded GIF frames</L> first.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export const Page = GifCompressionTest;
export default GifCompressionTest;