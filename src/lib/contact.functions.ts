import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional().default(""),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true as const };

    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");

    const result = await sendTemplateEmail("contact-message", "contact@zipgif.com", {
      templateData: {
        name: data.name,
        email: data.email,
        subject: data.subject || "ZipGIF enquiry",
        message: data.message,
      },
      replyTo: data.email,
      idempotencyKey: `contact-${crypto.randomUUID()}`,
    });

    if (!result.sent) {
      throw new Error("We could not deliver that message. Please email contact@zipgif.com directly.");
    }

    return { ok: true as const };
  });
