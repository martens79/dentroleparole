import Link from "next/link";

export const metadata = {
  title: "Testimonianze | Dentro le Parole",
  description:
    "Dicono del mio lavoro: parole, messaggi e riscontri di autori e autrici che hanno scelto il mio supporto editoriale.",
};

export default function TestimonianzePage() {
  const testimonials = [
    {
      quote:
        "Mi ritengo fortunata ad averti incontrata. Non sei solo un editor brava, attenta e precisa, ma molto di più. Sono orgogliosa del lavoro che abbiamo fatto insieme.",
      author: "Silvia De Santis",
      role: "Autrice",
    },
    {
      quote:
        "Ti ringrazio per la delicatezza con cui ti sei occupata del mio libro e per la bellissima persona che sei.",
      author: "Olimpia Rausa",
      role: "Autrice",
    },
    {
      quote:
        "Il libro ha raggiunto 110 copie vendute e ho ricevuto molti commenti positivi. Grazie per il tuo aiuto.",
      author: "Simone Squaiella",
      role: "Autore",
    },
    {
      quote:
        "Grazie per il supporto sul testo e per aver accompagnato questo libro con grande cura.",
      author: "Daniele Di Stefano",
      role: "Autore",
    },
    {
      quote:
        "Sono molto soddisfatto del lavoro svolto. Anche questa seconda correzione di bozze è stata precisa e accurata.",
      author: "Giovanni Neri",
      role: "Autore",
    },
  ];

  return (
    <main className="min-h-screen text-ivory">
      {/* sfondi come home / chi sono */}
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      {/* contenuto */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        {/* breadcrumb */}
        <div className="text-xs uppercase tracking-[0.18em] text-ivory/65">
          <Link href="/" className="transition hover:text-ivory">
            Home
          </Link>
          <span className="mx-2 text-ivory/35">/</span>
          <span className="text-ivory/55">Testimonianze</span>
        </div>

        {/* HERO */}
        <header className="mt-6 rounded-3xl border border-gold/25 bg-midnight/65 p-8 backdrop-blur transition hover:border-gold/45 md:p-10">
          <div className="text-xs uppercase tracking-[0.18em] text-ivory/70">
            Testimonianze
          </div>

          <h1 className="mt-3 font-serif text-3xl leading-tight text-gold md:text-5xl">
            Dicono del mio lavoro
          </h1>

          <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-ivory/90">
            <p>
              Nel tempo ho ricevuto messaggi, parole di gratitudine e riscontri
              sinceri da parte di autori e autrici con cui ho lavorato.
            </p>

            <p>
              Ho scelto di raccoglierne alcuni qui, perché credo che nulla
              racconti meglio un percorso editoriale della fiducia di chi lo ha
              vissuto in prima persona.
            </p>
          </div>
        </header>

        {/* GRID TESTIMONIANZE */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <article
              key={`${item.author}-${item.quote.slice(0, 24)}`}
              className="rounded-3xl border border-gold/20 bg-midnight/55 p-8 backdrop-blur transition hover:border-gold/40"
            >
              <div className="font-serif text-4xl leading-none text-gold/70">
                “
              </div>

              <blockquote className="mt-4 leading-relaxed text-ivory/88">
                {item.quote}
              </blockquote>

              <div className="mt-6 border-t border-gold/10 pt-4">
                <p className="text-base font-medium text-ivory">
                  {item.author}
                </p>
                <p className="mt-1 text-sm text-ivory/60">{item.role}</p>
              </div>
            </article>
          ))}
        </section>

        {/* CTA FINALE */}
        <section className="mt-10 rounded-3xl border border-gold/25 bg-midnight/60 p-8 backdrop-blur md:p-10">
          <h2 className="font-serif text-2xl text-gold md:text-3xl">
            Vuoi affidarmi il tuo manoscritto?
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-ivory/85">
            Se hai bisogno di un editing, di una correzione di bozze o di una
            prima valutazione del testo, puoi scrivermi e raccontarmi il tuo
            progetto.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/#contatti"
              className="btn-shine rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95"
            >
              Richiedi una valutazione
            </a>

            <Link
              href="/portfolio"
              className="rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/85 transition hover:border-gold/45 hover:text-ivory"
            >
              Vedi il portfolio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}