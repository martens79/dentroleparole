import { CONTACT_FALLBACK_EMAIL } from "./limits";

/**
 * Configurazione dell'endpoint, letta SOLO da variabili d'ambiente di Vercel
 * (tipo Secret per SMTP_PASS e CONTACT_FORM_SECRET). Nessun valore sensibile nel codice.
 *
 *   SMTP_USER           utente SMTP = indirizzo completo della casella che invia (obbligatorio)
 *   SMTP_PASS           password della casella (obbligatorio, Secret)
 *   CONTACT_FORM_SECRET chiave per firmare i token del modulo (obbligatorio, Secret, 32+ caratteri)
 *   SMTP_HOST           predefinito: authsmtp.securemail.pro (parametri ufficiali Register.it)
 *   SMTP_PORT           predefinito: 465 (SSL/TLS implicito)
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
};

export type ConfigResult =
  | { ok: true; config: ContactConfig }
  | { ok: false; missing: string[] };

type Env = Record<string, string | undefined>;

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
      secure: port === 465,
      user,
      pass,
      to: env.CONTACT_TO?.trim() || CONTACT_FALLBACK_EMAIL,
      from: env.CONTACT_FROM?.trim() || user,
      secret,
    },
  };
}
