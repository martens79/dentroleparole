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

export { makePdf, makeZip, makeDocx, makeDoc } from "./fixtures";

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
