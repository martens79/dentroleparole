"use client";

import Link from "next/link";
import { updates } from "@/data/updates";

export default function NewsTicker() {
  if (!updates.length) return null;

  return (
    <div className="news-ticker relative overflow-hidden border-y border-gold/15 bg-midnight/55 backdrop-blur" aria-label="Lavori in corso">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#070b16] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#070b16] to-transparent" />
      <div className="news-ticker-window whitespace-nowrap py-2">
        <div className="news-ticker-track inline-flex w-max animate-news-ticker items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="news-ticker-copy inline-flex shrink-0 items-center" aria-hidden={copy === 1 ? true : undefined}>
              {updates.map((item) => (
                <Link href="/news" key={item.title} tabIndex={copy === 1 ? -1 : undefined}
                  className="news-ticker-item mx-5 inline-flex items-center gap-2 text-sm text-ivory/90 transition hover:text-ivory focus-visible:outline focus-visible:outline-gold">
                  <span className="text-gold">✦</span>
                  <span>{item.desc}</span>
                </Link>
              ))}
              <Link href="/news" tabIndex={copy === 1 ? -1 : undefined}
                className="mx-6 inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-gold transition hover:bg-gold/15">
                Tutte le news
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
