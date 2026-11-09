/**
 * Limiti del modulo contatti con endpoint server-side.
 * Nessun import da Node: questo file è usato anche dal browser (ContactForm).
 *
 * DIMENSIONE DEGLI ALLEGATI
 * Il vincolo che comanda è il corpo massimo di una richiesta a una Vercel Function
 * (documentato come 4,5 MB). Il valore effettivo in produzione va MISURATO su un
 * deployment Vercel (vedi docs/contact-form/README.md): non è un numero scelto a caso
 * e non va aumentato senza una nuova misura.
 */

/** Soglia di rifiuto della piattaforma, misurata sul deployment (byte del corpo della richiesta). */
export const PLATFORM_BODY_LIMIT_BYTES = 4_500_000;

/** Margine per l'intestazione multipart e i campi di testo (messaggio incluso). */
export const MULTIPART_OVERHEAD_BYTES = 100_000;

/** Corpo massimo accettato dall'endpoint. */
export const MAX_REQUEST_BYTES = PLATFORM_BODY_LIMIT_BYTES;

/** Dimensione massima del file allegato. */
export const MAX_FILE_BYTES = PLATFORM_BODY_LIMIT_BYTES - MULTIPART_OVERHEAD_BYTES;

/** Dimensione massima mostrata all'utente, in MB decimali con una cifra (es. "4,4"). */
export function formatMaxFileMb(bytes: number = MAX_FILE_BYTES): string {
  return (Math.floor(bytes / 100_000) / 10).toFixed(1).replace(".", ",");
}

export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  title: 200,
  genre: 60,
  goal: 60,
  message: 5_000,
  wordsMax: 100_000_000,
  filenameMax: 80,
} as const;

/** Tempo minimo e massimo tra il caricamento della pagina e l'invio del modulo. */
export const TOKEN_MIN_AGE_MS = 3_000;
export const TOKEN_MAX_AGE_MS = 3 * 60 * 60 * 1000;

/** Rate limiting best effort per istanza (vedi docs: la protezione solida è la regola WAF di Vercel). */
export const RATE_LIMIT = {
  perIp: { windowMs: 10 * 60 * 1000, max: 3 },
  perInstance: { windowMs: 60 * 60 * 1000, max: 40 },
  maxKeys: 5_000,
} as const;

export const ALLOWED_EXTENSIONS = ["pdf", "docx", "doc"] as const;
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

export const CONTACT_FALLBACK_EMAIL = "contatti@dentroleparole.com";
