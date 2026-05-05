"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const promos = [
  null, null, null, null,

  {
    label: "PROMO DI MAGGIO",
    title: "-10% sui servizi di correzione di bozze",
    description: `Revisione approfondita di refusi, ortografia, grammatica e punteggiatura, con attenzione a coerenza e uniformità del testo.
Intervento mirato per garantire chiarezza, precisione e qualità editoriale.
Promo valida fino al 31/5`,
    cta: "Richiedi il servizio",
  },

  {
    label: "PROMO DI GIUGNO",
    title: "-10% sull’editing stilistico",
    description: `Intervento su stile, fluidità e leggibilità del testo, con miglioramento della costruzione delle frasi e del ritmo narrativo.
Ottimizzazione del linguaggio per una resa più efficace e professionale.
Promo valida fino al 30/6`,
    cta: "Richiedi il servizio",
  },

  {
    label: "PROMO DI LUGLIO",
    title: "-10% su pacchetto editing + correzione di bozze",
    description: `Revisione completa del testo: intervento su struttura stilistica e controllo finale di refusi e errori formali.
Un percorso completo per portare il manoscritto alla versione definitiva.
Promo valida fino al 31/7`,
    cta: "Richiedi il servizio",
  },

  {
    label: "PROMO DI AGOSTO",
    title: "-10% sulla valutazione del manoscritto",
    description: `Scheda di valutazione completa con analisi di trama, personaggi, struttura e criticità, con priorità nella consegna.
Ideale per impostare o correggere il progetto narrativo.
Posti limitati – Promo valida fino al 31/8`,
    cta: "Richiedi valutazione",
  },

  {
    label: "PROMO DI SETTEMBRE",
    title: "-10% sull’editing completo",
    description: `Intervento integrato di macro editing e editing stilistico: revisione di struttura, coerenza narrativa, sviluppo dei personaggi e qualità della scrittura.
Un lavoro approfondito per rendere il testo solido, fluido e professionale.
Promo valida fino al 30/9`,
    cta: "Richiedi il servizio",
  },

  {
    label: "PROMO DI OTTOBRE",
    title: "-10% sulla realizzazione di audiolibri",
    description: `Registrazione, editing e pulizia audio per ottenere un prodotto professionale, pronto per la distribuzione su piattaforme di ascolto.
Controllo qualità finale per garantire chiarezza, uniformità e resa sonora.
Promo valida fino al 31/10`,
    cta: "Richiedi il servizio",
  },

  {
    label: "PROMO DI NOVEMBRE",
    title: "-10% sul servizio di ghostwriting",
    description: `Scrittura su commissione a partire da idee, appunti o concept, con sviluppo strutturato del testo e adattamento allo stile richiesto.
Supporto completo nella costruzione del contenuto, dalla progettazione alla stesura finale.
Promo valida fino al 30/11`,
    cta: "Richiedi il servizio",
  },

  {
    label: "PROMO DI DICEMBRE",
    title: "-10% su scrittura creativa e writing coaching",
    description: `Percorsi personalizzati per migliorare tecnica narrativa, stile e costruzione del testo.
Supporto individuale con analisi, esercizi mirati e feedback sul lavoro.
Promo valida fino al 31/12`,
    cta: "Richiedi il servizio",
  },
];

export default function PromoPopup() {
  const [open, setOpen] = useState(false);

  const month = new Date().getMonth();
  const promo = promos[month];

  useEffect(() => {
    if (!promo) return;

    const key = `promo_seen_${month}`;
    if (sessionStorage.getItem(key)) return;

    const handleScroll = () => {
      if (window.scrollY > 120) {
        setOpen(true);
        sessionStorage.setItem(key, "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [month, promo]);

  if (!promo) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 px-4">
          <div className="absolute inset-0" onClick={() => setOpen(false)} />

          <motion.div className="relative z-10 w-full max-w-xl rounded-3xl border border-[#D4AF37]/25 bg-[#0a0a0f]/95 p-7">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4">
              ✕
            </button>

            <div className="text-sm uppercase text-[#D4AF37]">{promo.label}</div>

            <h2 className="mt-3 text-2xl text-[#F3E9D2]">{promo.title}</h2>

            <p className="mt-3 whitespace-pre-line text-[#F3E9D2]/80">
              {promo.description}
            </p>

            <div className="mt-6">
              <Link href="/#contatti" className="rounded-full border px-6 py-3">
                {promo.cta}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}