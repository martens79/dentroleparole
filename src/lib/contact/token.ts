import { createHmac, timingSafeEqual } from "node:crypto";
import { TOKEN_MAX_AGE_MS, TOKEN_MIN_AGE_MS } from "./limits";

/**
 * Token firmato con data di emissione, restituito dal GET dell'endpoint e rimandato nel POST.
 * Serve come filtro antispam leggero (un bot deve prima visitare la pagina e attendere):
 * non sostituisce il rate limiting.
 */

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(`dlp-contact:${payload}`).digest("base64url");
}

export function issueToken(secret: string, nowMs: number): string {
  const payload = String(Math.floor(nowMs));
  return `${payload}.${sign(secret, payload)}`;
}

export type TokenCheck = "ok" | "invalid" | "too_fast" | "expired";

export function verifyToken(secret: string, token: unknown, nowMs: number): TokenCheck {
  if (typeof token !== "string" || token.length > 200) return "invalid";
  const parts = token.split(".");
  if (parts.length !== 2 || !/^\d{10,16}$/.test(parts[0])) return "invalid";

  const expected = Buffer.from(sign(secret, parts[0]));
  const actual = Buffer.from(parts[1]);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return "invalid";

  const age = nowMs - Number(parts[0]);
  if (age < TOKEN_MIN_AGE_MS) return "too_fast";
  if (age > TOKEN_MAX_AGE_MS) return "expired";
  return "ok";
}
