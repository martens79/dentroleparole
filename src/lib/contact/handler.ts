import { createHmac } from "node:crypto";
import { loadConfig, readRateLimits, type ContactConfig } from "./config";
import {
  CONTACT_FALLBACK_EMAIL,
  MAX_FILE_BYTES,
  MAX_REQUEST_BYTES,
  RATE_LIMIT,
  formatMaxFileMb,
} from "./limits";
import { buildMailOptions, createSmtpTransport, type AttachmentInfo, type MailTransport } from "./mail";
import { createRateLimiter, type RateLimiter } from "./ratelimit";
import { issueToken, verifyToken } from "./token";
import { inspectAttachment, validateFields } from "./validate";

/**
 * Logica dell'endpoint /api/contatti, separata dal Route Handler per poterla provare
 * con trasporto SMTP simulato. Regole fisse:
 *  - nessun log di contenuti, nomi, email, nomi di file o IP: solo codici d'errore;
 *  - il file vive solo in memoria (Buffer) e non viene mai scritto su disco;
 *  - i messaggi d'errore restituiti al visitatore sono generici.
 */

export type Deps = {
  now: () => number;
  env: () => Record<string, string | undefined>;
  transportFor: (config: ContactConfig) => MailTransport;
  ipLimiter: RateLimiter;
  instanceLimiter: RateLimiter;
};

export type ErrorCode =
  | "unavailable"
  | "forbidden"
  | "invalid_request"
  | "invalid_fields"
  | "too_fast"
  | "expired"
  | "rate_limited"
  | "too_large"
  | "unsupported_type"
  | "bad_content"
  | "macro"
  | "empty_file"
  | "send_failed";

const ERRORS: Record<ErrorCode, { status: number; message: () => string }> = {
  unavailable: {
    status: 503,
    message: () => `Il modulo non è al momento disponibile. Scrivi a ${CONTACT_FALLBACK_EMAIL}.`,
  },
  forbidden: { status: 403, message: () => "Richiesta non consentita." },
  invalid_request: { status: 400, message: () => "Richiesta non valida. Ricarica la pagina e riprova." },
  invalid_fields: { status: 400, message: () => "Controlla i campi evidenziati." },
  too_fast: { status: 429, message: () => "Attendi qualche secondo e riprova." },
  expired: { status: 400, message: () => "La pagina è rimasta aperta a lungo: ricaricala e riprova." },
  rate_limited: {
    status: 429,
    message: () => `Troppe richieste. Riprova tra qualche minuto o scrivi a ${CONTACT_FALLBACK_EMAIL}.`,
  },
  too_large: {
    status: 413,
    message: () => `Il file è troppo grande. Massimo ${formatMaxFileMb()} MB.`,
  },
  unsupported_type: {
    status: 415,
    message: () => "Formato file non valido. Carica solo PDF, DOC o DOCX.",
  },
  bad_content: {
    status: 422,
    message: () => "Il file non risulta un PDF, DOC o DOCX valido.",
  },
  macro: {
    status: 422,
    message: () => "Il file contiene macro e non può essere inviato. Salvalo come DOCX senza macro.",
  },
  empty_file: { status: 422, message: () => "Il file selezionato è vuoto." },
  send_failed: {
    status: 502,
    message: () =>
      `Non è stato possibile inviare il messaggio. Riprova più tardi o scrivi a ${CONTACT_FALLBACK_EMAIL}.`,
  },
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
}

function fail(code: ErrorCode, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}): Response {
  const e = ERRORS[code];
  return json({ ok: false, code, message: e.message(), ...extra }, e.status, headers);
}

/** Origine ammessa: stesso host della richiesta o dominio del sito. */
function originAllowed(request: Request): boolean {
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;
  let sourceHost: string;
  try {
    sourceHost = new URL(source).host;
  } catch {
    return false;
  }
  const host = request.headers.get("host") ?? new URL(request.url).host;
  return sourceHost === host || sourceHost === "www.dentroleparole.com" || sourceHost === "dentroleparole.com";
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** L'IP non viene conservato: in memoria resta solo un hash con chiave segreta. */
function ipKey(ip: string, secret: string): string {
  return createHmac("sha256", secret).update(`ip:${ip}`).digest("hex").slice(0, 32);
}

/** GET: restituisce il token firmato usato come filtro antispam. */
export async function handleGet(_request: Request, deps: Deps): Promise<Response> {
  const cfg = loadConfig(deps.env());
  if (!cfg.ok) return fail("unavailable");
  return json({ ok: true, token: issueToken(cfg.config.secret, deps.now()) });
}

export async function handlePost(request: Request, deps: Deps): Promise<Response> {
  const cfg = loadConfig(deps.env());
  if (!cfg.ok) {
    console.error(JSON.stringify({ event: "contact_unavailable", missing: cfg.missing }));
    return fail("unavailable");
  }
  const config = cfg.config;

  if (!originAllowed(request)) return fail("forbidden");

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) return fail("invalid_request");

  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_REQUEST_BYTES) return fail("too_large");

  // Rate limiting prima di leggere il corpo. Vedi docs: best effort per istanza.
  const ip = deps.ipLimiter.hit(ipKey(clientIp(request), config.secret));
  const inst = deps.instanceLimiter.hit("instance");
  if (!ip.allowed || !inst.allowed) {
    return fail("rate_limited", {}, { "Retry-After": String(Math.max(ip.retryAfterSec, inst.retryAfterSec)) });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("invalid_request");
  }

  // Campo trappola: i bot lo compilano. Risposta di successo apparente, nessun invio.
  const trap = form.get("website");
  if (typeof trap === "string" && trap.trim() !== "") return json({ ok: true });

  const tokenState = verifyToken(config.secret, form.get("form_token"), deps.now());
  if (tokenState === "invalid") return fail("invalid_request");
  if (tokenState === "too_fast") return fail("too_fast");
  if (tokenState === "expired") return fail("expired");

  const parsed = validateFields(form);
  if (!parsed.ok) return fail("invalid_fields", { fields: parsed.invalid });

  // Allegato (opzionale). Un browser senza file invia un File vuoto con nome vuoto.
  let attachment: AttachmentInfo | null = null;
  const file = form.get("attachment");
  if (file instanceof File && !(file.size === 0 && file.name === "")) {
    if (file.size > MAX_FILE_BYTES) return fail("too_large");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = inspectAttachment({ filename: file.name, size: file.size, bytes });
    if (!result.ok) {
      const map = {
        empty: "empty_file",
        too_large: "too_large",
        bad_name: "unsupported_type",
        bad_extension: "unsupported_type",
        bad_content: "bad_content",
        macro: "macro",
      } as const;
      return fail(map[result.reason]);
    }
    attachment = {
      safeName: result.safeName,
      contentType: result.contentType,
      content: Buffer.from(bytes),
      warnings: result.warnings,
    };
  }

  try {
    await deps.transportFor(config).sendMail(buildMailOptions(config, parsed.fields, attachment));
  } catch (error) {
    // Solo il codice tecnico dell'errore (es. EAUTH, ECONNECTION): il messaggio potrebbe contenere indirizzi.
    const code = typeof (error as { code?: unknown })?.code === "string" ? (error as { code: string }).code : "UNKNOWN";
    console.error(JSON.stringify({ event: "contact_send_failed", code }));
    return fail("send_failed");
  }

  return json({ ok: true });
}

/** Dipendenze reali: i limiti restano in memoria per tutta la vita dell'istanza. */
export function createDefaultDeps(): Deps {
  const now = () => Date.now();
  const limits = readRateLimits(process.env);
  return {
    now,
    env: () => process.env,
    transportFor: createSmtpTransport,
    ipLimiter: createRateLimiter({ ...limits.perIp, maxKeys: RATE_LIMIT.maxKeys, now }),
    instanceLimiter: createRateLimiter({ ...limits.perInstance, maxKeys: 4, now }),
  };
}
