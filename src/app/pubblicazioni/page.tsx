import Link from "next/link";
import Image from "next/image";
import { novels, shortStories } from "@/data/publications";

export const metadata = {
  title: "Pubblicazioni | Dentro le Parole",
  description:
    "Romanzi, racconti, antologie e pubblicazioni di Donatella Tamburini.",
};

function PublicationCard({
  title,
  year,
  publisher,
  type,
  desc,
  cover,
}: {
  title: string;
  year: string;
  publisher: string;
  type: string;
  desc: string;
  cover?: string;
}) {
  return (
    <article className="rounded-3xl border border-gold/20 bg-midnight/55 p-6 backdrop-blur transition hover:border-gold/40">
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full md:w-[180px] shrink-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/20 bg-night/30">
            {cover ? (
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-ivory/45 px-4">
                Copertina in arrivo
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-2xl text-gold leading-tight">
              {title}
            </h2>

            <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-gold">
              {type}
            </span>
          </div>

          <div className="mt-3 text-sm text-ivory/70">
            {year} • {publisher}
          </div>

          <p className="mt-4 leading-relaxed text-ivory/85">
            {desc}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function PubblicazioniPage() {
  return (
    <main className="min-h-screen text-ivory">
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <div className="text-xs uppercase tracking-[0.18em] text-ivory/65">
          <Link href="/" className="transition hover:text-ivory">
            Home
          </Link>
          <span className="mx-2 text-ivory/35">/</span>
          <span className="text-ivory/55">Pubblicazioni</span>
        </div>

        <header className="mt-6 rounded-[2rem] border border-gold/25 bg-midnight/60 p-8 backdrop-blur md:p-10">
          <div className="text-xs uppercase tracking-[0.18em] text-ivory/65">
            Dentro le Parole
          </div>

          <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-gold md:text-5xl">
            Pubblicazioni
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ivory/88">
            Una selezione di romanzi, racconti, antologie e pubblicazioni che
            raccontano il mio percorso narrativo tra fantasy,
            distopia, horror e immaginario contemporaneo.
          </p>
        </header>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-gold">Romanzi</h2>
            <p className="mt-2 text-ivory/78 max-w-2xl">
              Opere lunghe, serie narrative, spin-off e pubblicazioni collegate all’universo autoriale.
            </p>
          </div>

          <div className="grid gap-5">
            {novels.map((item) => (
              <PublicationCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-gold">
              Racconti, antologie e magazine
            </h2>
            <p className="mt-2 text-ivory/78 max-w-2xl">
              Racconti pubblicati in antologie collettive, magazine e contesti editoriali dedicati.
            </p>
          </div>

          <div className="grid gap-5">
            {shortStories.map((item) => (
              <PublicationCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-gold/25 bg-midnight/60 p-8 backdrop-blur md:p-10">
          <h2 className="font-serif text-2xl text-gold md:text-3xl">
            Scrittura e lavoro editoriale
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-ivory/85">
            L’esperienza diretta come autrice arricchisce il lavoro editoriale:
            conoscere dall’interno le difficoltà della costruzione narrativa,
            della revisione e della pubblicazione permette di offrire un supporto
            più concreto, consapevole e mirato agli autori.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/chi-sono"
              className="rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/90 transition hover:border-gold/45 hover:text-ivory"
            >
              Scopri chi sono
            </Link>

            <a
              href="/#contatti"
              className="btn-shine rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95"
            >
              Richiedi informazioni
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}