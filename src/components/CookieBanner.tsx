"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  OPEN_PREFERENCES_EVENT,
  saveConsent,
  useConsentState,
} from "@/lib/consent";

// Stesso stile per i due pulsanti: rifiutare deve essere facile quanto accettare.
const choiceButton =
  "flex-1 rounded-xl border border-gold/50 bg-gold/15 px-4 py-2 font-semibold text-ivory transition hover:bg-gold/25 md:flex-none";

export default function CookieBanner() {
  const consent = useConsentState();
  const [reopened, setReopened] = useState(false);

  // Permette di riaprire il banner da "Preferenze cookie" per modificare o revocare la scelta.
  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  const visible = consent === "unset" || (reopened && consent !== "unknown");

  // Accesso permanente alle preferenze: piccolo pulsante sempre disponibile quando il banner è chiuso.
  if (!visible) {
    if (consent === "unknown") return null;
    return (
      <button
        type="button"
        onClick={() => setReopened(true)}
        className="fixed bottom-3 left-3 z-[150] rounded-full border border-gold/30 bg-black/60 px-3 py-1 text-xs text-ivory/70 backdrop-blur transition hover:border-gold/50 hover:text-gold"
      >
        Preferenze cookie
      </button>
    );
  }

  const choose = (analytics: boolean) => {
    saveConsent(analytics);
    setReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-4 left-1/2 z-[200] w-[90%] max-w-3xl -translate-x-1/2 rounded-2xl border border-gold/20 bg-black/85 p-4 text-sm text-ivory backdrop-blur"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-ivory/85">
          <p id="cookie-banner-title" className="font-semibold text-ivory">
            Preferenze cookie
          </p>
          <p className="mt-1">
            Questo sito usa cookie tecnici necessari al funzionamento. Con il tuo
            consenso usa anche cookie analitici (Google Analytics) per statistiche
            sull&apos;utilizzo delle pagine. Puoi accettare o rifiutare: il rifiuto non
            limita l&apos;uso del sito e puoi cambiare scelta in qualsiasi momento da
            &laquo;Preferenze cookie&raquo;, sempre disponibile in basso a sinistra.{" "}
            <Link href="/cookie-policy" className="text-gold underline underline-offset-4">
              Cookie Policy
            </Link>
            {" · "}
            <Link href="/privacy-policy" className="text-gold underline underline-offset-4">
              Privacy Policy
            </Link>
          </p>
          {reopened && consent !== "unset" ? (
            <p className="mt-1 text-xs text-ivory/60">
              Scelta attuale: cookie analitici{" "}
              {consent === "granted" ? "accettati" : "rifiutati"}.
            </p>
          ) : null}
        </div>

        <div className="flex gap-2 md:shrink-0">
          <button type="button" onClick={() => choose(false)} className={choiceButton}>
            Rifiuta
          </button>
          <button type="button" onClick={() => choose(true)} className={choiceButton}>
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
