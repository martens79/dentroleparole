import Link from "next/link";
import Section from "@/components/Section";
import PremiumBox from "@/components/PremiumBox";
import { updates } from "@/data/updates";

export default function NewsPage() {
  return (
    <main className="min-h-screen text-ivory">
      {/* sfondi come home */}
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      {/* contenuto */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        {/* breadcrumb */}
        <div className="text-xs tracking-[0.18em] uppercase text-ivory/65">
          <Link href="/" className="hover:text-ivory transition">
            Home
          </Link>
          <span className="mx-2 text-ivory/35">/</span>
          <span className="text-ivory/55">News</span>
        </div>

        <Section
          id="news-page"
          title="News & In lavorazione"
          subtitle="Aggiornamenti su progetti in corso, risorse e novità."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {updates.map((n) => (
              <PremiumBox key={`${n.date}-${n.title}`}>
                <div className="text-xs uppercase tracking-[0.18em] text-ivory/60">
                  {n.date}
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="font-semibold text-gold">{n.title}</div>

                  {n.status ? (
                    <span className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-gold">
                      {n.status}
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-ivory/88 leading-relaxed">{n.desc}</p>
              </PremiumBox>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}