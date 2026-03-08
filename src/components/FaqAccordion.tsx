"use client";

import { useState } from "react";

type FaqItem = {
  q: string;
  a: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-3xl border border-gold/20 bg-midnight/55 backdrop-blur transition hover:border-gold/40"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-semibold text-gold">{item.q}</span>

              <span
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-night/20 text-gold transition",
                  isOpen ? "rotate-45" : "",
                ].join(" ")}
              >
                +
              </span>
            </button>

            <div
              className={[
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <div className="border-t border-gold/10 px-6 pb-5 pt-4 text-ivory/88 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}