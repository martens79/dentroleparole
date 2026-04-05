"use client";

import { useState } from "react";
import Link from "next/link";

export default function PromoBanner() {
  const [closed, setClosed] = useState(false);

  const now = new Date();
  const end = new Date("2026-03-31T23:59:59");
  const isActive = now <= end;

  if (closed || !isActive) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[140] h-10 border-b border-[#c9a96a]/20 bg-[#090909]/92 text-[#F3E9D2] backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-3 px-4">
        <span className="hidden sm:inline text-[#d6b36a]">🎁</span>

       <p className="truncate text-center text-[13px] text-[#F3E9D2]/92 md:text-[15px]">
  <span className="font-semibold text-[#f4e7c8]">
    Promo Aprile — il più veloce avrà una correzione di bozze a prezzo scontato!
  </span>
  {" "}
  valutazione gratuita • sample audiolibro • coaching
</p>

      <Link
  href="/#contatti"
  className="shrink-0 rounded-full border border-[#c9a96a]/40 px-3 py-1 text-[13px] font-medium text-[#d6b36a] 
  animate-pulse transition hover:border-[#d6b36a]/70 hover:bg-[#d6b36a]/10 hover:text-[#f3d79a]"
>
  Richiedi valutazione
</Link>

        <button
          onClick={() => setClosed(true)}
          aria-label="Chiudi banner promozionale"
          className="shrink-0 text-[#F3E9D2]/55 transition hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}