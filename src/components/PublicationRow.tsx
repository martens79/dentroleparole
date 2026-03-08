import type { Publication } from "@/data/publications";

export default function PublicationRow({ p }: { p: Publication }) {
  return (
    <div className="relative p-6 md:p-8">
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-gold/40 via-gold/15 to-transparent" />
      <div className="absolute -left-[5px] top-8 h-3 w-3 rounded-full bg-gold shadow-[0_0_14px_rgba(212,175,55,0.35)]" />

      <div className="pl-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="font-serif text-xl leading-tight text-gold md:text-2xl">
                {p.title}
              </h3>

              <span className="rounded-full border border-gold/15 bg-night/25 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-ivory/65">
                {p.type}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ivory/60">
              <span>{p.year}</span>
              <span className="text-ivory/30">•</span>
              <span>{p.publisher}</span>
              {p.role ? (
                <>
                  <span className="text-ivory/30">•</span>
                  <span>{p.role}</span>
                </>
              ) : null}
              {p.isbn ? (
                <>
                  <span className="text-ivory/30">•</span>
                  <span>ISBN {p.isbn}</span>
                </>
              ) : null}
            </div>

            {p.desc ? (
              <p className="mt-4 max-w-3xl leading-relaxed text-ivory/88">
                {p.desc}
              </p>
            ) : null}

            {p.highlights && p.highlights.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-gold/20 bg-night/30 px-3 py-1 text-xs text-ivory/80"
                  >
                    {h}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-gold/25 bg-night/25 px-4 py-2 text-sm text-ivory/85 transition hover:border-gold/45 hover:text-ivory"
              >
                Dettagli
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}