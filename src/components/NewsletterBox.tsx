"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.message || "Errore durante l'iscrizione.");
        return;
      }

      setStatus("success");
      setMessage("Grazie per esserti iscritto. Controlla la tua email e conferma l'iscrizione alla newsletter.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Errore di connessione. Riprova tra poco.");
    }
  }

  return (
    <section className="rounded-[28px] border border-gold/25 bg-midnight/65 p-8 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-gold/80">
          Newsletter editoriale
        </p>

        <h2 className="font-serif text-3xl text-ivory md:text-4xl">
          Ricevi consigli su scrittura,
          <span className="text-gold"> editing e pubblicazione</span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ivory/80 md:text-lg">
          Uno spazio dedicato a chi scrive: consigli editoriali, nuovi articoli e
          spunti per lavorare meglio sul proprio manoscritto, con maggiore
          chiarezza e consapevolezza.
        </p>

        {status === "success" ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gold/25 bg-gold/10 px-5 py-4">
            <p className="text-sm leading-relaxed text-gold/90">{message}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="Inserisci la tua email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="h-14 flex-1 rounded-2xl border border-gold/20 bg-black/20 px-5 text-ivory placeholder:text-ivory/45 outline-none transition focus:border-gold/50 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-gold/40 bg-gold/25 px-6 font-semibold text-ivory transition hover:bg-gold/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                  Invio...
                </span>
              ) : (
                "Iscriviti"
              )}
            </button>
          </form>
        )}

        <div className="mt-4 min-h-[24px]">
          {status === "error" && (
            <p className="text-sm text-red-300">{message}</p>
          )}

          {status === "idle" && (
            <p className="text-sm text-ivory/55">
              Niente spam. Solo contenuti utili per chi scrive davvero.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}