import { CONTACT_FALLBACK_EMAIL, RATE_LIMIT } from "./limits";

/**
 * Configurazione dell'endpoint, letta SOLO da variabili d'ambiente di Vercel
 * (tipo Secret per SMTP_PASS e CONTACT_FORM_SECRET). Nessun valore sensibile nel codice.
 *
 *   SMTP_USER           utente SMTP = indirizzo completo della casella che invia (obbligatorio)
 *   SMTP_PASS           password della casella (obbligatorio, Secret)
 *   CONTACT_FORM_SECRET chiave per firmare i token del modulo (obbligatorio, Secret, 32+ caratteri)
 *   SMTP_HOST           predefinito: authsmtp.securemail.pro (parametri ufficiali Register.it)
 *   SMTP_PORT           predefinito: 465 (SSL/TLS implicito)
 *   SMTP_SECURE         facoltativo ("true"/"false"): predefinito true solo sulla porta 465; serve per le
 *                       prove con un server SMTP locale. La verifica del certificato resta sempre attiva.
 *   SMTP_ALLOW_PLAINTEXT_LOOPBACK  SOLO per sviluppo locale: "true" consente la connessione in chiaro
 *                       a un server SMTP di prova su 127.0.0.1/localhost. Viene ignorata se l'host non è
 *                       un indirizzo di loopback o se l'ambiente è Vercel (variabile VERCEL presente).
 *   CONTACT_RATE_IP_MAX            facoltativa (1-100): richieste per IP nella finestra. Predefinito 3.
 *   CONTACT_RATE_IP_WINDOW_SEC     facoltativa (60-3600): finestra in secondi. Predefinito 600.
 *   CONTACT_RATE_INSTANCE_MAX      facoltativa (1-1000): richieste totali all'ora per istanza. Predefinito 40.
 *                       Servono ad allargare i limiti durante un collaudo (es. solo in Preview): in produzione
 *                       vanno lasciate assenti.
 *   CONTACT_TO          destinatario, predefinito contatti@dentroleparole.com
 *   CONTACT_FROM        mittente, predefinito = SMTP_USER (deve essere la casella autenticata)
 */

export type ContactConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
  secret: string;
  /** Vero solo per prove locali verso un server di loopback (vedi sopra). */
  allowPlaintextLoopback: boolean;
};

export type ConfigResult =
  | { ok: true; config: ContactConfig }
  | { ok: false; missing: string[] };

type Env = Record<string, string | undefined>;

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

export function loadConfig(env: Env): ConfigResult {
  const missing: string[] = [];
  const user = env.SMTP_USER?.trim() ?? "";
  const pass = env.SMTP_PASS ?? "";
  const secret = env.CONTACT_FORM_SECRET ?? "";

  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (secret.length < 32) missing.push("CONTACT_FORM_SECRET");

  const host = env.SMTP_HOST?.trim() || "authsmtp.securemail.pro";
  const port = Number(env.SMTP_PORT || 465);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) missing.push("SMTP_PORT");

  if (missing.length > 0) return { ok: false, missing };

  return {
    ok: true,
    config: {
      host,
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE.trim().toLowerCase() === "true" : port === 465,
      user,
      pass,
      to: env.CONTACT_TO?.trim() || CONTACT_FALLBACK_EMAIL,
      from: env.CONTACT_FROM?.trim() || user,
      secret,
      allowPlaintextLoopback:
        env.SMTP_ALLOW_PLAINTEXT_LOOPBACK === "true" &&
        LOOPBACK_HOSTS.has(host.toLowerCase()) &&
        !env.VERCEL,
    },
  };
}

export type RateLimits = {
  perIp: { windowMs: number; max: number };
  perInstance: { windowMs: number; max: number };
};

function intInRange(value: string | undefined, min: number, max: number, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
}

/** Limiti di richieste: predefiniti prudenti, modificabili solo entro intervalli fissi. */
export function readRateLimits(env: Env): RateLimits {
  return {
    perIp: {
      windowMs: intInRange(env.CONTACT_RATE_IP_WINDOW_SEC, 60, 3600, RATE_LIMIT.perIp.windowMs / 1000) * 1000,
      max: intInRange(env.CONTACT_RATE_IP_MAX, 1, 100, RATE_LIMIT.perIp.max),
    },
    perInstance: {
      windowMs: RATE_LIMIT.perInstance.windowMs,
      max: intInRange(env.CONTACT_RATE_INSTANCE_MAX, 1, 1000, RATE_LIMIT.perInstance.max),
    },
  };
}
