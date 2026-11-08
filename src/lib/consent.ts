"use client";

import { useSyncExternalStore } from "react";

/**
 * Gestione della scelta sui cookie non necessari (analitici).
 *
 * - La scelta è memorizzata in localStorage solo dopo un'azione esplicita dell'utente
 *   (Accetta / Rifiuta). La semplice navigazione NON costituisce consenso.
 * - La scelta scade dopo CONSENT_TTL_DAYS giorni: alla scadenza il banner viene riproposto.
 * - Se localStorage non è disponibile (es. navigazione privata restrittiva) la scelta
 *   vale solo per la sessione di pagina corrente.
 */

export const CONSENT_STORAGE_KEY = "dlp_cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_TTL_DAYS = 180;
export const OPEN_PREFERENCES_EVENT = "dlp:open-cookie-preferences";

const CHANGE_EVENT = "dlp:consent-change";

/** "unknown" = non ancora letto (server / idratazione), "unset" = nessuna scelta valida. */
export type ConsentState = "unknown" | "unset" | "granted" | "denied";

type StoredConsent = {
  v: number;
  analytics: boolean;
  ts: number;
};

// Fallback in memoria, usato solo se localStorage lancia un errore.
let memoryConsent: StoredConsent | null = null;

function isValid(value: unknown): value is StoredConsent {
  if (!value || typeof value !== "object") return false;
  const c = value as Partial<StoredConsent>;
  if (c.v !== CONSENT_VERSION) return false;
  if (typeof c.analytics !== "boolean") return false;
  if (typeof c.ts !== "number") return false;
  const age = Date.now() - c.ts;
  return age >= 0 && age < CONSENT_TTL_DAYS * 24 * 60 * 60 * 1000;
}

function readStored(): StoredConsent | null {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return isValid(memoryConsent) ? memoryConsent : null;
  }
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getConsentState(): ConsentState {
  const stored = readStored();
  if (!stored) return "unset";
  return stored.analytics ? "granted" : "denied";
}

export function saveConsent(analytics: boolean): void {
  const value: StoredConsent = { v: CONSENT_VERSION, analytics, ts: Date.now() };
  memoryConsent = value;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage non disponibile: la scelta resta valida solo in memoria.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  // Aggiorna anche tra schede diverse dello stesso browser.
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useConsentState(): ConsentState {
  return useSyncExternalStore<ConsentState>(subscribe, getConsentState, () => "unknown");
}

export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
