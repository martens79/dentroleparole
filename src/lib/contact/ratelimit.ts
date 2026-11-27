/**
 * Rate limiter a finestra scorrevole, in memoria.
 *
 * LIMITE NOTO: le funzioni serverless non condividono la memoria tra istanze, quindi questo
 * limite è "best effort" per istanza. La protezione solida contro i picchi è la regola di
 * rate limiting del Vercel WAF (da configurare dal proprietario, vedi docs/contact-form).
 */

export type RateLimiter = {
  /** Registra un tentativo per la chiave; restituisce se è consentito. */
  hit(key: string): { allowed: boolean; retryAfterSec: number };
};

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  maxKeys: number;
  now: () => number;
}): RateLimiter {
  const { windowMs, max, maxKeys, now } = options;
  const hits = new Map<string, number[]>();

  return {
    hit(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);

      if (recent.length >= max) {
        hits.set(key, recent);
        const retryAfterSec = Math.max(1, Math.ceil((recent[0] + windowMs - t) / 1000));
        return { allowed: false, retryAfterSec };
      }

      recent.push(t);
      hits.delete(key); // riposiziona la chiave in coda (ordine di inserimento = più recente)
      hits.set(key, recent);

      // Memoria limitata: elimina le chiavi più vecchie.
      while (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest === undefined) break;
        hits.delete(oldest);
      }
      return { allowed: true, retryAfterSec: 0 };
    },
  };
}
