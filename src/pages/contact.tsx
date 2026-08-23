import { makeRouteOptions } from "@/i18n/route-options";
import { L } from "@/components/l";
import { useState } from "react";

import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Facebook, Linkedin, Loader2, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitContactMessage } from "@/lib/contact.functions";

export const options = makeRouteOptions("/contact", {
  head: () => ({
    meta: [
      { title: "Contact ZipGIF — Feedback, Bugs and Feature Requests" },
      {
        name: "description",
        content:
          "Get in touch about bugs, feature requests, or questions on ZipGIF's client-side, no-upload GIF tools. Email Shafiullah Tareen directly.",
      },
      { property: "og:title", content: "Contact ZipGIF" },
      {
        property: "og:description",
        content: "Report a bug or request a feature for ZipGIF's browser-based GIF tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://zipgif.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://zipgif.com/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const send = useServerFn(submitContactMessage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await send({ data: { name, email, subject, message, company } });
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setAccepted(false);
      toast.success("Message sent — thanks! We'll reply to your email.");
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please email contact@zipgif.com directly.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Contact 1 */}
        <section className="px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Get in touch
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact us</h1>
              <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
                Bugs, feature requests and questions are all welcome. Send the form and your
                message lands straight in our inbox at contact@zipgif.com — we reply to the
                address you enter.
              </p>

              <dl className="mt-10 space-y-6 text-[15px]">
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="font-semibold text-foreground">Email</dt>
                    <dd className="mt-1">
                      <a
                        href="mailto:shafitareen431@gmail.com"
                        className="break-all text-muted-foreground underline hover:text-foreground"
                      >
                        shafitareen431@gmail.com
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Linkedin className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="font-semibold text-foreground">LinkedIn</dt>
                    <dd className="mt-1">
                      <a
                        href="https://www.linkedin.com/in/shafiullah-tareen-507857268"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-muted-foreground underline hover:text-foreground"
                      >
                        Shafiullah Tareen
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Facebook className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="font-semibold text-foreground">Facebook</dt>
                    <dd className="mt-1">
                      <a
                        href="https://www.facebook.com/shafi.sami.336"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-muted-foreground underline hover:text-foreground"
                      >
                        shafi.sami.336
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Bug report, feature request, something else"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Include your browser, operating system, and the file size and dimensions if a GIF will not process."
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="contact-accept"
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(v === true)}
                  required
                />
                <Label htmlFor="contact-accept" className="text-sm font-normal text-muted-foreground">
                  I accept the{" "}
                  <a href="/terms" className="text-primary underline">
                    Terms
                  </a>
                </Label>
              </div>
              <Button type="submit" size="lg" disabled={!accepted || sending}>
                {sending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
              <p className="text-sm text-muted-foreground" role="status">
                {sent
                  ? "Thanks — your message is on its way to contact@zipgif.com."
                  : "Replies are best effort, usually within a few business days. Please do not attach your GIF unless we ask for it."}
              </p>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
