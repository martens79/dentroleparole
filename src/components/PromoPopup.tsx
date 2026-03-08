"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("promo_seen");

    if (seen) return;

    const handleScroll = () => {
      if (window.scrollY > 120) {
        setOpen(true);
        sessionStorage.setItem("promo_seen", "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* click fuori chiude */}
          <div className="absolute inset-0" onClick={close} />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl rounded-3xl border border-[#D4AF37]/25 bg-[#0a0a0f]/95 p-7 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
          >
            {/* bagliore */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D4AF37]/[0.06] via-transparent to-[#D4AF37]/[0.04]" />

            {/* bottone chiudi */}
            <button
              onClick={close}
              className="absolute right-4 top-4 text-[#F3E9D2]/70 hover:text-[#F3E9D2]"
            >
              ✕
            </button>

            <div className="relative z-10">

              <div className="text-sm uppercase tracking-[0.18em] text-[#D4AF37]">
                Promo di marzo
              </div>

              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-[#F3E9D2]">
                Valutazione gratuita per i primi 3 autori
              </h2>

              <p className="mt-3 text-sm md:text-base text-[#F3E9D2]/80 leading-relaxed">
                Per inaugurare il sito offro una valutazione gratuita del
                manoscritto con indicazioni editoriali iniziali, un sample
                audiolibro e un breve coaching per orientare il progetto.
                Promo valida fino al 31/3 
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#contatti"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/12 px-6 py-3 text-sm font-medium text-[#F3E9D2] transition hover:bg-[#D4AF37]/20"
                >
                  Richiedi valutazione
                </Link>

                <button
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm text-[#F3E9D2]/70 hover:text-[#F3E9D2] hover:bg-white/5 transition"
                >
                  Continua a navigare
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}