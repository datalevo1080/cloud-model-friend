import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional().default(""),
});

const GENERIC_ERROR =
  "Something went wrong - email us directly at contact@zipgif.com";

// Max 3 submissions per minute per visitor.
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot filled — pretend success, send nothing.
    if (data.company) return { ok: true as const };

    const ip =
      getRequestIP({ xForwardedFor: true }) ??
      getRequestHeader("cf-connecting-ip") ??
      "unknown";

    if (rateLimited(ip)) {
      throw new Error("Too many messages. Please wait a minute and try again.");
    }

    const page = getRequestHeader("referer") ?? "https://zipgif.com/contact";
    const sentAt = new Date().toUTCString();

    const body = [
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      `Subject: ${data.subject || "(none)"}`,
      `Sent:    ${sentAt}`,
      `Page:    ${page}`,
      "",
      "Message:",
      data.message,
    ].join("\n");

    try {
      const { sendSmtpMail } = await import("@/lib/smtp.server");
      await sendSmtpMail({
        fromName: "ZipGIF Contact",
        fromAddress: "contact@zipgif.com",
        to: "contact@zipgif.com",
        replyTo: data.email,
        subject: `New message from ${data.name} - ZipGIF`,
        text: body,
      });
    } catch (error) {
      // Real error stays server-side only.
      console.error("[contact] SMTP send failed:", error);
      throw new Error(GENERIC_ERROR);
    }

    return { ok: true as const };
  });
