"use client";

import { useState } from "react";
import Link from "next/link";

const promos = [
  null, null, null, null,

  {
    label: "PROMO DI MAGGIO",
    text: "-10% sui servizi di correzione di bozze",
    cta: "Richiedi il servizio",
  },
  {
    label: "PROMO DI GIUGNO",
    text: "-10% sull’editing stilistico",
    cta: "Richiedi il servizio",
  },
  {
    label: "PROMO DI LUGLIO",
    text: "-10% su pacchetto editing + correzione di bozze",
    cta: "Richiedi il servizio",
  },
  {
    label: "PROMO DI AGOSTO",
    text: "-10% sulla valutazione del manoscritto",
    cta: "Richiedi valutazione",
  },
  {
    label: "PROMO DI SETTEMBRE",
    text: "-10% sull’editing completo",
    cta: "Richiedi il servizio",
  },
  {
    label: "PROMO DI OTTOBRE",
    text: "-10% sulla realizzazione di audiolibri",
    cta: "Richiedi il servizio",
  },
  {
    label: "PROMO DI NOVEMBRE",
    text: "-10% sul servizio di ghostwriting",
    cta: "Richiedi il servizio",
  },
  {
    label: "PROMO DI DICEMBRE",
    text: "-10% su scrittura creativa e writing coaching",
    cta: "Richiedi il servizio",
  },
];

export default function PromoBanner() {
  const [closed, setClosed] = useState(false);

  const month = new Date().getMonth();
  const promo = promos[month];

  if (closed || !promo) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[140] h-10 border-b border-[#c9a96a]/20 bg-[#090909]/92 text-[#F3E9D2] backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-3 px-4">
        <span className="hidden sm:inline text-[#d6b36a]">🎁</span>

        <p className="truncate text-center text-sm md:text-base text-[#F3E9D2]/92">
          <span className="font-semibold text-[#f4e7c8]">
            {promo.label}
          </span>{" "}
          {promo.text}
        </p>

        <Link
          href="/#contatti"
          className="animate-pulse shrink-0 rounded-full border border-[#c9a96a]/40 px-3 py-1 text-sm font-medium text-[#d6b36a] hover:bg-[#d6b36a]/10"
        >
          {promo.cta}
        </Link>

        <button
          onClick={() => setClosed(true)}
          className="text-[#F3E9D2]/55 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}