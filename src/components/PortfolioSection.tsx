import Image from "next/image";
import { portfolioItems } from "@/data/portfolio";

export default function PortfolioSection() {
  return (
    <div className="grid gap-6">
      {portfolioItems.map((item) => (
        <article
          key={item.title}
          className="group overflow-hidden rounded-[2rem] border border-gold/20 bg-midnight/55 backdrop-blur transition hover:border-gold/40"
        >
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:p-7">
            {/* copertina piccola */}
            <div className="w-full md:w-[150px] shrink-0">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-gold/15 bg-night/30">
                {item.cover ? (
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-sm text-ivory/40">
                    Copertina in arrivo
                  </div>
                )}
              </div>
            </div>

            {/* contenuto */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-gold/25 bg-midnight/65 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ivory/90 backdrop-blur">
                  {item.category}
                </span>

                {item.status ? (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-emerald-300 backdrop-blur">
                    {item.status}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-4 font-serif text-2xl leading-tight text-gold">
                {item.title}
              </h3>

              {item.client ? (
                <div className="mt-2 text-base text-ivory/72">{item.client}</div>
              ) : null}

              {item.year ? (
                <div className="mt-1 text-sm text-ivory/52">{item.year}</div>
              ) : null}

              <p className="mt-5 leading-relaxed text-ivory/86">{item.desc}</p>

              {item.highlights?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full border border-gold/15 bg-night/20 px-3 py-1.5 text-sm text-ivory/78"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}

              {item.link ? (
                <div className="mt-6">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-2xl border border-gold/25 bg-night/20 px-4 py-2.5 text-sm text-ivory/90 transition hover:border-gold/45 hover:text-ivory"
                  >
                    Scopri di più
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}