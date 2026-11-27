"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterMini() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !consent) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, consent }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.message || "Errore durante l'iscrizione.");
        return;
      }

      setStatus("success");
      setMessage("Grazie! La tua iscrizione alla newsletter è stata registrata. Puoi richiedere la cancellazione in qualsiasi momento scrivendo a contatti@dentroleparole.com.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("Errore di connessione. Riprova.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-4 rounded-xl border border-gold/25 bg-gold/10 px-4 py-3">
        <p className="text-sm leading-relaxed text-gold/90">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <input
        type="email"
        placeholder="La tua email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
        className="h-11 rounded-xl border border-gold/20 bg-black/20 px-4 text-sm text-ivory placeholder:text-ivory/45 outline-none transition focus:border-gold/50 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <label className="flex items-start gap-2 text-xs leading-relaxed text-ivory/75">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          disabled={status === "loading"}
          className="mt-1 shrink-0 accent-[#D6B36A]"
        />
        <span>
          Acconsento a ricevere via email la newsletter di Dentro le Parole.
          Posso revocare il consenso scrivendo a contatti@dentroleparole.com.
          Leggi la <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-gold">Privacy Policy</Link>.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 rounded-xl border border-gold/40 bg-gold/25 px-4 text-sm font-semibold text-ivory transition hover:bg-gold/35 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Invio..." : "Iscriviti"}
      </button>

      {status === "error" && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          <p className="text-xs leading-relaxed text-red-300">{message}</p>
        </div>
      )}
    </form>
  );
}