"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");

    if (!accepted) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieAccepted", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[200] w-[90%] max-w-3xl -translate-x-1/2 rounded-2xl border border-gold/20 bg-black/85 p-4 text-sm text-ivory backdrop-blur">
      
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        
        <p className="text-ivory/85">
          Questo sito utilizza cookie tecnici per migliorare l'esperienza di navigazione.
          Continuando a navigare accetti il loro utilizzo.
        </p>

        <button
          onClick={acceptCookies}
          className="rounded-xl bg-gold px-4 py-2 text-night font-semibold hover:opacity-90 transition"
        >
          Accetta
        </button>

      </div>
    </div>
  );
}