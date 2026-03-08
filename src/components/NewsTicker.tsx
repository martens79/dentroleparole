"use client";

import Link from "next/link";
import { updates } from "@/data/updates";

export default function NewsTicker() {
  if (!updates.length) return null;

  const tickerItems = [...updates, ...updates];

  return (
    <div className="relative overflow-hidden border-y border-gold/15 bg-midnight/55 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#070b16] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#070b16] to-transparent" />

      <div className="whitespace-nowrap py-2">
        <div className="inline-flex min-w-full animate-news-ticker items-center">
          {tickerItems.map((item, index) => (
            <Link
              href="/news"
              key={`${item.title}-${index}`}
              className="mx-5 inline-flex items-center gap-3 text-sm text-ivory/85 transition hover:text-ivory"
            >
              <span className="text-gold/80">✦</span>

              <span className="inline-flex items-center gap-3">
                <span className="font-medium text-ivory">{item.title}</span>

                {item.status ? (
                  <span className="rounded-full border border-gold/15 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-gold">
                    {item.status}
                  </span>
                ) : null}

                <span className="max-w-[520px] truncate text-ivory/65">
                  — {item.desc}
                </span>
              </span>
            </Link>
          ))}

          <Link
            href="/news"
            className="ml-6 inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-gold transition hover:bg-gold/15"
          >
            Tutte le news
          </Link>
        </div>
      </div>
    </div>
  );
}