import Link from "next/link";
import PublicationsSection from "@/components/PublicationsSection";
import Image from "next/image";

export const metadata = {
  title: "Chi sono | Dentro le Parole",
  description:
    "Donatella Tamburini — consulente editoriale specializzata in narrativa. Editing narrativo, metodo chiaro e rispetto della voce dell’autore.",
};

export default function ChiSonoPage() {
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
          <span className="text-ivory/55">Chi sono</span>
        </div>

        {/* HERO */}
<header className="mt-6 rounded-3xl border border-gold/25 bg-midnight/65 p-8 backdrop-blur transition hover:border-gold/45 md:p-10">

  <div className="grid gap-10 md:grid-cols-[1fr_220px] md:items-start">

    {/* TESTO */}
    <div>

      <div className="text-xs uppercase tracking-[0.18em] text-ivory/70">
        Dentro le Parole
      </div>

      <h1 className="mt-3 font-serif text-3xl leading-tight text-gold md:text-5xl">
        Chi sono
      </h1>

      <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-ivory/90">
        <p>
          Mi chiamo{" "}
          <span className="font-semibold text-ivory">
            Donatella Tamburini
          </span>{" "}
          e sono una{" "}
          <span className="text-gold">
            consulente editoriale specializzata in narrativa
          </span>.
        </p>

        <p>
          Affianco autori emergenti e già pubblicati nella revisione di
          romanzi e racconti, lavorando su struttura, stile, ritmo e
          coerenza narrativa.
        </p>

        <p>
          Sono anche autrice di narrativa fantasy, distopica e horror:
          l’esperienza diretta di scrittura mi permette di comprendere a
          fondo le sfide creative degli autori e di offrire un supporto
          editoriale concreto e mirato.
        </p>

        <p>
          Mi sono formata nell’ambito dell’editing e della revisione del
          testo presso{" "}
          <span className="font-semibold text-ivory">
            Herzog Agenzia Letteraria
          </span>{" "}
          e{" "}
          <span className="font-semibold text-ivory">
            Scuola Holden
          </span>.
        </p>

        <p>
          Il mio approccio unisce competenza editoriale ed esperienza
          narrativa: ogni intervento è accompagnato da note operative
          sul testo e da indicazioni chiare per aiutarti a far crescere
          la tua storia{" "}
          <span className="font-semibold text-ivory">
            senza snaturare la tua voce
          </span>.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="/#contatti"
          className="btn-shine rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95"
        >
          Richiedi una valutazione
        </a>

        <Link
          href="/servizi"
          className="rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/85 transition hover:border-gold/45 hover:text-ivory"
        >
          Vedi i servizi
        </Link>
      </div>

    </div>

    {/* FOTO DONATELLA */}
    <div className="relative mx-auto w-[200px] md:mx-0">

      <div className="overflow-hidden rounded-2xl border border-gold/30 bg-night/20">
        <Image
          src="/images/foto_donatella.jpg"
          alt="Donatella Tamburini"
          width={400}
          height={500}
          className="object-cover"
        />
      </div>

    </div>

  </div>

</header>
        {/* METODO DI LAVORO */}
        <section className="mt-10 rounded-3xl border border-gold/20 bg-midnight/55 p-8 backdrop-blur md:p-10">
          <div className="inline-flex items-center rounded-full border border-gold/20 bg-night/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ivory/70">
            Metodo di lavoro
          </div>

          <h2 className="mt-4 font-serif text-2xl text-gold md:text-3xl">
            I principi del mio metodo
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Metodo chiaro",
                desc: "Un percorso ordinato e trasparente: analisi del testo, definizione delle priorità, intervento editoriale e revisione finale.",
              },
              {
                title: "Rispetto della voce",
                desc: "L’editing non deve uniformare. Il suo obiettivo è valorizzare il tono, lo stile e l’intenzione narrativa dell’autore.",
              },
              {
                title: "Confronto costante",
                desc: "Non consegno semplici correzioni: spiego le scelte editoriali e ti accompagno nel miglioramento del testo.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-gold/20 bg-night/20 p-7 transition hover:border-gold/40"
              >
                <h3 className="font-serif text-xl text-gold">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-ivory/85">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COME LAVORO */}
        <section
          id="come-lavoro"
          className="mt-10 rounded-3xl border border-gold/20 bg-midnight/55 p-8 backdrop-blur md:p-10"
        >
          <div className="inline-flex items-center rounded-full border border-gold/20 bg-night/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ivory/70">
            Come lavoro
          </div>

          <h2 className="mt-4 font-serif text-2xl text-gold md:text-3xl">
            Un processo strutturato, chiaro e rispettoso del testo
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-ivory/90">
            Ogni progetto segue un processo strutturato, pensato per migliorare
            il testo senza snaturare la voce dell’autore.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                n: "1",
                title: "Valutazione iniziale",
                desc: "Mi invii un estratto del manoscritto e l’obiettivo del tuo progetto. Analizzo il testo per individuare punti di forza e aree di miglioramento.",
              },
              {
                n: "2",
                title: "Intervento editoriale",
                desc: "Lavoro direttamente sul testo con una revisione strutturata: trama, ritmo narrativo, costruzione dei personaggi e stile.",
              },
              {
                n: "3",
                title: "Revisione finale",
                desc: "Controllo complessivo del manoscritto per garantire chiarezza, coerenza e uniformità stilistica.",
              },
              {
                n: "4",
                title: "Consegna e supporto",
                desc: "Ricevi il testo revisionato insieme alle indicazioni operative. Se necessario, è possibile un confronto per chiarire interventi e scelte editoriali.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-gold/15 bg-night/20 p-6 transition hover:border-gold/35"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-ivory/65">
                  Step {s.n}
                </div>

                <h3 className="mt-2 font-serif text-xl text-gold/95">
                  {s.title}
                </h3>

                <p className="mt-3 leading-relaxed text-ivory/85">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PER CHI È PENSATO / COSA NON FACCIO */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gold/20 bg-midnight/55 p-8 backdrop-blur">
            <h2 className="font-serif text-2xl text-gold">
              Questo metodo è pensato per
            </h2>

            <ul className="mt-4 space-y-3 leading-relaxed text-ivory/85">
              <li>
                • autori che vogliono proporre il loro testo alle case editrici
                o che desiderano autopubblicarsi
              </li>
              <li>
                • chi ha un manoscritto pronto e intende perfezionarlo
              </li>
              <li>
                • chi desidera migliorare tecnica narrativa e stile
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-midnight/55 p-8 backdrop-blur">
            <h2 className="font-serif text-2xl text-gold">Cosa non faccio</h2>

            <p className="mt-4 leading-relaxed text-ivory/85">
              Per mantenere un lavoro editoriale serio e rispettoso del testo:
            </p>

            <ul className="mt-4 space-y-3 leading-relaxed text-ivory/85">
              <li>
                • non riscrivo testi cancellando o modificando la voce
                dell’autore
              </li>
              <li>• non eseguo interventi frettolosi</li>
              <li>• non lavoro senza un obiettivo narrativo chiaro</li>
            </ul>
          </div>
        </section>

        {/* PERCORSO AUTORIALE */}
<section className="mt-10 rounded-3xl border border-gold/20 bg-midnight/55 p-8 backdrop-blur md:p-10">
  <h2 className="font-serif text-2xl text-gold md:text-3xl">
    Percorso autoriale
  </h2>

  <p className="mt-4 max-w-3xl leading-relaxed text-ivory/90">
    Accanto al lavoro editoriale, la scrittura è una parte essenziale del mio
    percorso. Negli anni ho pubblicato romanzi e racconti in diversi ambiti
    narrativi, tra cui fantasy, distopia e horror.
  </p>

  <p className="mt-3 max-w-3xl leading-relaxed text-ivory/85">
    Per mantenere questa pagina chiara e focalizzata sul lavoro editoriale,
    ho raccolto le pubblicazioni e le tappe del mio percorso in una sezione dedicata.
  </p>

  <div className="mt-7">
    <Link
      href="/percorso-autoriale"
      className="inline-flex items-center rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/90 transition hover:border-gold/45 hover:text-ivory"
    >
      Esplora il percorso autoriale
    </Link>
  </div>
</section>

        {/* CTA FINALE */}
        <section className="mt-10 rounded-3xl border border-gold/25 bg-midnight/60 p-8 backdrop-blur md:p-10">
          <h2 className="font-serif text-2xl text-gold md:text-3xl">
            Vuoi capire da dove partire?
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-ivory/85">
            Inviami un estratto e dimmi qual è il tuo obiettivo. Ti rispondo
            entro 24–48 ore con indicazioni chiare.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/#contatti"
              className="btn-shine rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95"
            >
              Richiedi una valutazione
            </a>

            <Link
              href="/blog"
              className="rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/85 transition hover:border-gold/45 hover:text-ivory"
            >
              Leggi il blog
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}