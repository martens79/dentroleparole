"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_FILE_BYTES as API_MAX_FILE_BYTES,
  formatMaxFileMb,
} from "@/lib/contact/limits";

// Interruttore: "formsubmit" (predefinito, flusso attuale) oppure "api" (endpoint /api/contatti).
// Variabile pubblica letta in fase di build: per tornare a FormSubmit basta rimetterla a
// "formsubmit" (o rimuoverla) e rifare il deploy, oppure usare Instant Rollback su Vercel.
const USE_API = process.env.NEXT_PUBLIC_CONTACT_BACKEND === "api";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE_MB = USE_API ? formatMaxFileMb() : 8;
const MAX_FILE_SIZE_BYTES = USE_API ? API_MAX_FILE_BYTES : 8 * 1024 * 1024;

export default function ContactForm() {
  const inputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    genre: "",
    words: "",
    goal: "",
    message: "",
  });

  const [touched, setTouched] = useState({});

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
    if (error) setError("");
  }

  function touch(key) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  function onPickFile() {
    inputRef.current?.click();
  }

  function clearFile() {
    setFileName("");
    setTouched((p) => ({ ...p, file: false }));
    if (inputRef.current) inputRef.current.value = "";
    if (error) setError("");
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setFileName("");
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Formato file non valido. Carica solo PDF, DOC o DOCX.");
      if (inputRef.current) inputRef.current.value = "";
      setFileName("");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`Il file è troppo grande. Massimo ${MAX_FILE_SIZE_MB} MB.`);
      if (inputRef.current) inputRef.current.value = "";
      setFileName("");
      return;
    }

    setFileName(file.name);
    if (error) setError("");
  }

  useEffect(() => {
    if (!USE_API) return undefined;
    let cancelled = false;
    fetch("/api/contatti", { method: "GET", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && d.token) setToken(d.token);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const errors = useMemo(() => {
    const e = {};

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) e.name = "Inserisci nome e cognome.";
    if (!email) e.email = "Inserisci l'email.";
    else if (!isValidEmail(email)) e.email = "Email non valida.";

    return e;
  }, [form.name, form.email]);

  const hasErrors = Object.keys(errors).length > 0;

  function fieldClass(hasFieldError) {
    return [
      "w-full rounded-2xl bg-night/40 border px-4 py-3 text-sm outline-none transition",
      hasFieldError
        ? "border-red-400/70 focus:border-red-300"
        : "border-gold/20 focus:border-gold/45",
    ].join(" ");
  }

  function onSubmit(e) {
    setTouched((p) => ({ ...p, name: true, email: true }));

    if (hasErrors) {
      e.preventDefault();
      setError("Controlla i campi evidenziati.");
      return;
    }

    const file = inputRef.current?.files?.[0];
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        e.preventDefault();
        setError("Formato file non valido. Carica solo PDF, DOC o DOCX.");
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        e.preventDefault();
        setError(`Il file è troppo grande. Massimo ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }
    }

    if (USE_API) {
      e.preventDefault();
      sendToApi(e.currentTarget);
    }
  }

  async function sendToApi(formEl) {
    if (sending) return;
    setSending(true);
    setError("");
    try {
      const body = new FormData(formEl);
      body.set("form_token", token);
      const res = await fetch("/api/contatti", { method: "POST", body });

      if (res.ok) {
        window.location.assign("/grazie");
        return;
      }

      let message = "Non è stato possibile inviare il messaggio. Riprova più tardi.";
      if (res.status === 413) {
        message = `Il file è troppo grande. Massimo ${MAX_FILE_SIZE_MB} MB.`;
      } else {
        try {
          const data = await res.json();
          if (data && typeof data.message === "string") message = data.message;
        } catch {
          // risposta non JSON: resta il messaggio generico
        }
      }
      setError(message);
    } catch {
      setError("Connessione non riuscita. Controlla la rete e riprova.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
  action={
    USE_API
      ? "/api/contatti"
      : "https://formsubmit.co/contatti@dentroleparole.com"
  }
  method="POST"
  encType="multipart/form-data"
  className="grid gap-3"
  onSubmit={onSubmit}
>
      {USE_API ? (
        <>
          <input type="hidden" name="form_token" value={token} readOnly />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
        </>
      ) : (
        <>
      <input
  type="hidden"
  name="_subject"
  value="Nuova richiesta dal sito Dentro le Parole"
/>
<input type="hidden" name="_captcha" value="false" />
<input type="hidden" name="_template" value="table" />
<input
  type="hidden"
  name="_next"
  value="https://www.dentroleparole.com/grazie"
/>

<input
  type="text"
  name="_honey"
  tabIndex={-1}
  autoComplete="off"
  className="hidden"
/>
        </>
      )}

      {error ? (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-ivory/90">
          {error}
        </div>
      ) : null}

      <input
        name="name"
        value={form.name}
        onChange={(e) => setField("name", e.target.value)}
        onBlur={() => touch("name")}
        className={fieldClass(!!(touched.name && errors.name))}
        placeholder="Nome e cognome"
        autoComplete="name"
        required
      />
      {touched.name && errors.name ? (
        <div className="-mt-1 px-1 text-xs text-red-200/90">{errors.name}</div>
      ) : null}

      <input
        name="email"
        value={form.email}
        onChange={(e) => setField("email", e.target.value)}
        onBlur={() => touch("email")}
        className={fieldClass(!!(touched.email && errors.email))}
        placeholder="Email"
        type="email"
        autoComplete="email"
        required
      />
      {touched.email && errors.email ? (
        <div className="-mt-1 px-1 text-xs text-red-200/90">{errors.email}</div>
      ) : null}

      <input
        name="title"
        value={form.title}
        onChange={(e) => setField("title", e.target.value)}
        className="w-full rounded-2xl border border-gold/20 bg-night/40 px-4 py-3 text-sm outline-none transition focus:border-gold/45"
        placeholder="Titolo del manoscritto (opzionale)"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          name="genre"
          value={form.genre}
          onChange={(e) => setField("genre", e.target.value)}
          className="w-full rounded-2xl border border-gold/20 bg-night/40 px-4 py-3 text-sm outline-none transition focus:border-gold/45"
        >
          <option value="">Genere</option>
          <option>Fantasy</option>
          <option>Fantascienza</option>
          <option>Romanzo</option>
          <option>Thriller</option>
          <option>Racconto</option>
          <option>Giallo</option>
          <option>Saggistica</option>
          <option>Altro</option>
        </select>

        <input
          name="words"
          value={form.words}
          onChange={(e) => setField("words", e.target.value)}
          type="number"
          min={0}
          className="w-full rounded-2xl border border-gold/20 bg-night/40 px-4 py-3 text-sm outline-none transition focus:border-gold/45"
          placeholder="Numero parole"
        />
      </div>

      <select
        name="goal"
        value={form.goal}
        onChange={(e) => setField("goal", e.target.value)}
        className="w-full rounded-2xl border border-gold/20 bg-night/40 px-4 py-3 text-sm outline-none transition focus:border-gold/45"
      >
        <option value="">Obiettivo del libro</option>
        <option>Invio a case editrici</option>
        <option>Self publishing</option>
        <option>Ancora da decidere</option>
      </select>

      <textarea
        name="message"
        value={form.message}
        onChange={(e) => setField("message", e.target.value)}
        className="min-h-[140px] w-full rounded-2xl border border-gold/20 bg-night/40 px-4 py-3 text-sm outline-none transition focus:border-gold/45"
        placeholder="Breve descrizione del progetto o note (opzionale)"
      />

      <div className="mt-2 rounded-2xl border border-gold/20 bg-night/25 p-4">
        <div id="anteprima-titolo" className="text-sm font-medium text-ivory/85">
          Anteprima del manoscritto (facoltativa)
        </div>

        <p id="anteprima-aiuto" className="mt-1 text-xs leading-relaxed text-ivory/60">
          Allega, se desideri, le prime 5–10 cartelle editoriali del tuo testo in
          formato PDF, DOC o DOCX. Non è necessario inviare il manoscritto
          completo: potremo concordarne l’invio successivamente via email.
        </p>

        <p className="mt-1 text-xs leading-relaxed text-ivory/60">
          Una cartella editoriale corrisponde indicativamente a 1.800 battute,
          spazi inclusi.
        </p>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-ivory/60">
              Max <span className="text-gold/80">{MAX_FILE_SIZE_MB} MB</span>.
            </div>

            <div className="mt-3 text-xs">
              {fileName ? (
                <div className="truncate text-gold/80">
                  Selezionato: {fileName}
                </div>
              ) : (
                <div className="text-ivory/50">Nessun file selezionato</div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onPickFile}
              aria-describedby="anteprima-aiuto"
              className="rounded-2xl border border-gold/30 bg-midnight/40 px-4 py-2 text-sm text-ivory/90 transition hover:border-gold/50"
            >
              Allega anteprima
            </button>

            {fileName ? (
              <button
                type="button"
                onClick={clearFile}
                className="rounded-2xl border border-gold/15 bg-night/30 px-3 py-2 text-sm text-ivory/70 transition hover:border-gold/35 hover:text-ivory"
                aria-label="Rimuovi file"
                title="Rimuovi file"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          name="attachment"
          accept=".pdf,.doc,.docx"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className={`mt-2 rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95${
          USE_API ? " disabled:cursor-not-allowed disabled:opacity-60" : ""
        }`}
      >
        {sending ? "Invio in corso..." : "Invia richiesta"}
      </button>
    </form>
  );
}