import { crc32 } from "node:zlib";
import { createRateLimiter } from "../../src/lib/contact/ratelimit";
import { RATE_LIMIT } from "../../src/lib/contact/limits";
import { issueToken } from "../../src/lib/contact/token";
import type { Deps } from "../../src/lib/contact/handler";
import type { MailOptions } from "../../src/lib/contact/mail";

export const SECRET = "test-secret-".padEnd(48, "x");
export const SITE = "https://www.dentroleparole.com";

export const TEST_ENV = {
  SMTP_USER: "form@example.test",
  SMTP_PASS: "not-a-real-password",
  CONTACT_FORM_SECRET: SECRET,
  CONTACT_TO: "contatti@example.test",
};

/* ---------- file di prova sintetici ---------- */

export function makePdf(extraBytes = 0, body = ""): Uint8Array {
  const text = `%PDF-1.4\n1 0 obj<<>>endobj\n${body}\n%%EOF\n`;
  const b = Buffer.alloc(text.length + extraBytes, 0x20);
  b.write(text, 0, "latin1");
  return new Uint8Array(b);
}

export function makeZip(entries: { name: string; data?: string }[]): Uint8Array {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const data = Buffer.from(e.data ?? "x", "utf8");
    const crc = crc32(data);

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(data.length, 18);
    lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(name.length, 26);
    locals.push(lh, name, data);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(data.length, 20);
    ch.writeUInt32LE(data.length, 24);
    ch.writeUInt16LE(name.length, 28);
    ch.writeUInt32LE(offset, 42);
    centrals.push(ch, name);

    offset += lh.length + name.length + data.length;
  }

  const cd = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return new Uint8Array(Buffer.concat([...locals, cd, eocd]));
}

export function makeDocx(extraEntries: string[] = []): Uint8Array {
  return makeZip([
    { name: "[Content_Types].xml" },
    { name: "word/document.xml" },
    ...extraEntries.map((name) => ({ name })),
  ]);
}

export function makeDoc(withMacro = false): Uint8Array {
  const b = Buffer.alloc(2048, 0);
  Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]).copy(b, 0);
  if (withMacro) Buffer.from("_VBA_PROJECT", "utf16le").copy(b, 600);
  return new Uint8Array(b);
}

/* ---------- richieste e dipendenze simulate ---------- */

export type FormInput = Record<string, string>;

export function baseFields(token: string, overrides: FormInput = {}): FormInput {
  return {
    name: "Mario Rossi",
    email: "mario.rossi@example.org",
    title: "Il mio romanzo",
    genre: "Fantasy",
    words: "85000",
    goal: "Self publishing",
    message: "Buongiorno, vorrei una valutazione.",
    form_token: token,
    website: "",
    ...overrides,
  };
}

export function makeRequest(options: {
  fields: FormInput;
  file?: { name: string; type?: string; bytes: Uint8Array } | "empty";
  headers?: Record<string, string>;
  method?: string;
}): Request {
  const form = new FormData();
  for (const [k, v] of Object.entries(options.fields)) form.set(k, v);
  if (options.file === "empty") {
    form.set("attachment", new File([], ""));
  } else if (options.file) {
    form.set(
      "attachment",
      new File([options.file.bytes as BlobPart], options.file.name, {
        type: options.file.type ?? "application/octet-stream",
      }),
    );
  }
  return new Request(`${SITE}/api/contatti`, {
    method: options.method ?? "POST",
    body: form,
    headers: { origin: SITE, "x-forwarded-for": "203.0.113.7", ...options.headers },
  });
}

export type Harness = {
  deps: Deps;
  sent: MailOptions[];
  clock: { t: number };
  token(): string;
  logs: string[];
  restore(): void;
};

export function makeHarness(options: { env?: Record<string, string | undefined>; fail?: unknown } = {}): Harness {
  const clock = { t: 1_800_000_000_000 };
  const sent: MailOptions[] = [];
  const logs: string[] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  const now = () => clock.t;
  const deps: Deps = {
    now,
    env: () => options.env ?? TEST_ENV,
    transportFor: () => ({
      async sendMail(o: MailOptions) {
        if (options.fail) throw options.fail;
        sent.push(o);
        return {};
      },
    }),
    ipLimiter: createRateLimiter({ ...RATE_LIMIT.perIp, maxKeys: RATE_LIMIT.maxKeys, now }),
    instanceLimiter: createRateLimiter({ ...RATE_LIMIT.perInstance, maxKeys: 4, now }),
  };

  // Token emesso 10 secondi prima dell'invio, per superare il controllo "troppo veloce".
  const issuedAt = clock.t;
  clock.t += 10_000;

  return {
    deps,
    sent,
    clock,
    token: () => issueToken(SECRET, issuedAt),
    logs,
    restore: () => {
      console.error = original;
    },
  };
}
