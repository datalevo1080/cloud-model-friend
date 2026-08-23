/**
 * Minimal SMTP client that works both on Node (vite dev / SSR) and on the
 * Cloudflare Workers runtime used in production.
 *
 * Server-only. Never import from client code.
 */

interface Duplex {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  startTls?: () => Duplex;
  close: () => Promise<void> | void;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

function isWorkerRuntime(): boolean {
  // navigator.userAgent === 'Cloudflare-Workers' in workerd
  const nav = (globalThis as { navigator?: { userAgent?: string } }).navigator;
  return typeof nav?.userAgent === "string" && nav.userAgent.includes("Cloudflare");
}

async function openConnection(
  host: string,
  port: number,
  mode: "tls" | "starttls",
): Promise<Duplex> {
  if (isWorkerRuntime()) {
    const specifier = "cloudflare:sockets";
    const { connect } = (await import(/* @vite-ignore */ specifier)) as {
      connect: (addr: string, opts: { secureTransport: string; allowHalfOpen: boolean }) => Duplex;
    };
    const socket = connect(`${host}:${port}`, {
      secureTransport: mode === "tls" ? "on" : "starttls",
      allowHalfOpen: false,
    });
    return socket;
  }

  const [{ default: net }, { default: tls }, { Duplex: NodeDuplex }] = await Promise.all([
    import(/* @vite-ignore */ "node:net"),
    import(/* @vite-ignore */ "node:tls"),
    import(/* @vite-ignore */ "node:stream"),
  ]);

  const toDuplex = (socket: unknown): Duplex => {
    const web = (NodeDuplex as unknown as { toWeb: (s: unknown) => Duplex }).toWeb(socket);
    return {
      readable: web.readable,
      writable: web.writable,
      close: () => {
        (socket as { destroy: () => void }).destroy();
      },
    };
  };

  if (mode === "tls") {
    const socket = await new Promise<unknown>((resolve, reject) => {
      const s = tls.connect({ host, port, servername: host }, () => resolve(s));
      s.once("error", reject);
    });
    return toDuplex(socket);
  }

  const raw = await new Promise<unknown>((resolve, reject) => {
    const s = net.connect({ host, port }, () => resolve(s));
    s.once("error", reject);
  });
  const plain = toDuplex(raw);
  plain.startTls = () => {
    throw new Error("startTls handled by upgradeNode");
  };
  // Node STARTTLS upgrade is performed by the caller through upgradeNodeTls.
  (plain as Duplex & { __nodeSocket?: unknown }).__nodeSocket = raw;
  (plain as Duplex & { __upgrade?: () => Promise<Duplex> }).__upgrade = async () => {
    const socket = await new Promise<unknown>((resolve, reject) => {
      const s = tls.connect({ socket: raw as never, servername: host }, () => resolve(s));
      s.once("error", reject);
    });
    return toDuplex(socket);
  };
  return plain;
}

class SmtpSession {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private buffer = "";

  constructor(private conn: Duplex) {
    this.reader = conn.readable.getReader();
    this.writer = conn.writable.getWriter();
  }

  async read(): Promise<{ code: number; text: string }> {
    for (;;) {
      const match = /^(\d{3})(?: [^\n]*)?\r?\n?$/m.exec(this.buffer);
      const lines = this.buffer.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1];
      if (last && /^\d{3} /.test(last)) {
        const text = this.buffer;
        this.buffer = "";
        return { code: Number(last.slice(0, 3)), text };
      }
      void match;
      const { value, done } = await this.reader.read();
      if (done) {
        const text = this.buffer;
        this.buffer = "";
        return { code: 0, text };
      }
      this.buffer += dec.decode(value, { stream: true });
    }
  }

  async send(line: string): Promise<void> {
    await this.writer.write(enc.encode(line + "\r\n"));
  }

  async command(line: string, expect: number[]): Promise<{ code: number; text: string }> {
    await this.send(line);
    const res = await this.read();
    if (!expect.includes(res.code)) {
      throw new Error(`SMTP command rejected (${res.code}): ${res.text.trim()}`);
    }
    return res;
  }

  async expect(codes: number[]): Promise<{ code: number; text: string }> {
    const res = await this.read();
    if (!codes.includes(res.code)) {
      throw new Error(`Unexpected SMTP reply (${res.code}): ${res.text.trim()}`);
    }
    return res;
  }

  release() {
    try {
      this.reader.releaseLock();
      this.writer.releaseLock();
    } catch {
      /* ignore */
    }
  }

  async close() {
    this.release();
    try {
      await this.conn.close();
    } catch {
      /* ignore */
    }
  }
}

function b64(input: string): string {
  const bytes = enc.encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** RFC 2047 encoded-word so non-ASCII headers survive. */
function encodeHeader(value: string): string {
  const clean = value.replace(/[\r\n]+/g, " ").trim();
  // eslint-disable-next-line no-control-regex
  return /^[\x20-\x7E]*$/.test(clean) ? clean : `=?UTF-8?B?${b64(clean)}?=`;
}

function wrap(input: string, width = 76): string {
  const out: string[] = [];
  for (let i = 0; i < input.length; i += width) out.push(input.slice(i, i + width));
  return out.join("\r\n");
}

export interface SmtpMessage {
  fromName: string;
  fromAddress: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

async function deliver(
  message: SmtpMessage,
  auth: { host: string; port: number; user: string; pass: string; mode: "tls" | "starttls" },
): Promise<void> {
  let conn = await openConnection(auth.host, auth.port, auth.mode);
  let session = new SmtpSession(conn);

  try {
    await session.expect([220]);
    await session.command("EHLO zipgif.com", [250]);

    if (auth.mode === "starttls") {
      await session.command("STARTTLS", [220]);
      session.release();
      const upgrade = (conn as Duplex & { __upgrade?: () => Promise<Duplex> }).__upgrade;
      conn = upgrade ? await upgrade() : (conn.startTls as () => Duplex)();
      session = new SmtpSession(conn);
      await session.command("EHLO zipgif.com", [250]);
    }

    await session.command("AUTH LOGIN", [334]);
    await session.command(b64(auth.user), [334]);
    await session.command(b64(auth.pass), [235]);

    await session.command(`MAIL FROM:<${auth.user}>`, [250]);
    await session.command(`RCPT TO:<${message.to}>`, [250, 251]);
    await session.command("DATA", [354]);

    const headers = [
      `From: ${encodeHeader(message.fromName)} <${message.fromAddress}>`,
      `To: <${message.to}>`,
      ...(message.replyTo ? [`Reply-To: <${message.replyTo}>`] : []),
      `Subject: ${encodeHeader(message.subject)}`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
    ].join("\r\n");

    await session.send(`${headers}\r\n\r\n${wrap(b64(message.text))}\r\n.`);
    await session.expect([250]);
    await session.command("QUIT", [221, 250]);
  } finally {
    await session.close();
  }
}

/**
 * Sends one plain-text email through Hostinger SMTP.
 * Tries 465 (implicit TLS) first, then 587 (STARTTLS).
 */
export async function sendSmtpMail(message: SmtpMessage): Promise<void> {
  const pass = process.env["SMTP_PASSWORD"];
  if (!pass) throw new Error("SMTP_PASSWORD is not configured");

  const host = "smtp.hostinger.com";
  const user = "contact@zipgif.com";

  const attempts: Array<{ port: number; mode: "tls" | "starttls" }> = [
    { port: 465, mode: "tls" },
    { port: 587, mode: "starttls" },
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      await deliver(message, { host, user, pass, port: attempt.port, mode: attempt.mode });
      return;
    } catch (error) {
      lastError = error;
      console.error(`[smtp] send failed on port ${attempt.port}:`, error);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("SMTP send failed");
}
