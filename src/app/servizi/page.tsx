import Link from "next/link";
import {
  PenTool,
  SpellCheck,
  Feather,
  GraduationCap,
  BookOpen,
  FileText,
  Search,
  Mic,
} from "lucide-react";

export const metadata = {
  title: "Servizi editoriali | Dentro le Parole",
  description:
    "Editing narrativo, correzione di bozze, ghostwriting, writing coach, saggistica, revisione tesi e realizzazione audiolibri. Servizi editoriali su misura per autori e professionisti.",
};

const services = [
  {
    id: "editing-narrativo",
    title: "Editing narrativo",
    icon: PenTool,
    intro: "Intervento strutturale su romanzi e racconti.",
    text1:
      "Analizzo trama, sviluppo dei personaggi, ritmo narrativo, coerenza interna e stile, individuando punti deboli e potenzialità del testo.",
    text2:
      "Riceverai indicazioni editoriali concrete per rendere la storia più solida, coinvolgente e pronta per la pubblicazione.",
  },
  {
    id: "correzione-bozze",
    title: "Correzione di bozze",
    icon: SpellCheck,
    intro: "Revisione linguistica e tipografica prima della pubblicazione.",
    text1:
      "Correggo errori ortografici, grammaticali e sintattici, uniformo la punteggiatura e verifico la coerenza tipografica del testo.",
    text2:
      "L’obiettivo è consegnarti un manoscritto pulito, professionale e pronto per la stampa o l’auto-pubblicazione.",
  },
  {
    id: "ghostwriting",
    title: "Ghostwriting",
    icon: Feather,
    intro: "Sviluppo completo dell’opera a partire da un’idea.",
    text1:
      "Trasformo appunti, progetti narrativi o concept iniziali in un libro strutturato e coerente, lavorando su trama, personaggi e stile.",
    text2:
      "Il risultato è un testo scritto professionalmente, fedele alla tua visione e pronto per il mercato editoriale.",
  },
  {
    id: "writing-coach",
    title: "Scrittura creativa & Writing Coach",
    icon: GraduationCap,
    intro: "Percorso personalizzato per migliorare la tua scrittura.",
    text1:
      "Ti aiuto a sviluppare tecnica narrativa, metodo di lavoro e consapevolezza stilistica attraverso esercizi, analisi dei testi e confronto diretto.",
    text2:
      "Un accompagnamento pensato per autori che vogliono crescere e portare avanti i propri progetti narrativi.",
  },
  {
    id: "editing-saggistica",
    title: "Editing e correzione di bozze per testi di saggistica",
    icon: BookOpen,
    intro: "Revisione linguistica e strutturale per saggi e testi divulgativi.",
    text1:
      "Intervengo su chiarezza espositiva, organizzazione dei contenuti, fluidità del discorso e correttezza linguistica.",
    text2:
      "Il risultato è un testo più leggibile, coerente e adatto alla pubblicazione o alla divulgazione.",
  },
  {
    id: "tesi-articoli",
    title: "Revisione di articoli, relazioni e tesi",
    icon: FileText,
    intro: "Supporto linguistico e strutturale per testi accademici e professionali.",
    text1:
      "Correggo la forma, miglioro la chiarezza argomentativa e verifico coerenza e precisione espositiva.",
    text2:
      "Un servizio pensato per studenti, ricercatori e professionisti che vogliono presentare lavori curati e rigorosi.",
  },
  {
    id: "valutazione-manoscritto",
    title: "Valutazione manoscritto",
    icon: Search,
    intro: "Analisi editoriale dell’estratto o del manoscritto.",
    text1:
      "Riceverai una scheda di lettura con punti di forza, criticità e suggerimenti di sviluppo su trama, personaggi, stile e struttura narrativa.",
    text2:
      "Uno strumento utile per capire come migliorare il testo prima di procedere con editing o pubblicazione.",
  },
  {
    id: "audiolibri",
    title: "Realizzazione audiolibri",
    icon: Mic,
    intro: "Trasformo il tuo libro in un’esperienza d’ascolto.",
    text1:
      "Mi occupo di adattamento del testo per la lettura, registrazione, editing audio e preparazione dei file per la distribuzione sulle piattaforme di audiolibri.",
    text2:
      "Un modo professionale per dare nuova vita alla tua storia e raggiungere nuovi lettori.",
  },
];

export default function ServiziPage() {
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
          <span className="text-ivory/55">Servizi</span>
        </div>

        <header className="mt-6 rounded-[2rem] border border-gold/25 bg-midnight/60 p-8 backdrop-blur md:p-10">
          <div className="text-xs uppercase tracking-[0.18em] text-ivory/65">
            Dentro le Parole
          </div>

          <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-gold md:text-5xl">
            Servizi editoriali per dare forza, chiarezza e direzione al tuo testo
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ivory/88">
            Interventi su narrativa, saggistica e progetti di scrittura pensati
            per migliorare struttura, stile e leggibilità, senza cancellare la
            voce dell’autore. Ogni testo ha esigenze diverse: per questo il
            lavoro editoriale va calibrato con attenzione, metodo e ascolto.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/#contatti"
              className="btn-shine rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95"
            >
              Richiedi informazioni
            </a>

            <a
              href="#elenco-servizi"
              className="rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/90 transition hover:border-gold/45 hover:text-ivory"
            >
              Esplora i servizi
            </a>
          </div>
        </header>

        <section
          id="elenco-servizi"
          className="mt-10 rounded-[2rem] border border-gold/20 bg-midnight/45 p-6 backdrop-blur md:p-8"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-ivory/60">
                Panoramica
              </div>
              <h2 className="mt-2 font-serif text-2xl text-gold md:text-3xl">
                Scegli il tipo di intervento più adatto al tuo progetto
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-ivory/72">
              Puoi partire da una valutazione, da una revisione completa oppure
              da un percorso di affiancamento personalizzato.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="group rounded-3xl border border-gold/18 bg-night/20 p-5 transition hover:border-gold/40 hover:bg-night/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/25 bg-midnight/55 text-gold">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-ivory transition group-hover:text-gold">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ivory/72">
                    {service.intro}
                  </p>

                  <div className="mt-4 text-sm font-medium text-gold">
                    Approfondisci →
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-5">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                id={service.id}
                className="scroll-mt-32 rounded-[2rem] border border-gold/22 bg-midnight/55 p-6 backdrop-blur md:p-8"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-night/25 text-gold">
                      <Icon size={22} />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-[0.18em] text-ivory/55">
                        Servizio editoriale
                      </div>

                      <h2 className="mt-2 font-serif text-2xl leading-tight text-gold md:text-3xl">
                        {service.title}
                      </h2>

                      <p className="mt-5 text-lg leading-relaxed text-ivory/92">
                        {service.intro}
                      </p>

                      <p className="mt-4 max-w-3xl leading-relaxed text-ivory/84">
                        {service.text1}
                      </p>

                      <p className="mt-3 max-w-3xl leading-relaxed text-ivory/84">
                        {service.text2}
                      </p>
                    </div>
                  </div>

                  <div className="md:pl-6">
                    <a
                      href="/#contatti"
                      className="inline-flex items-center justify-center rounded-2xl border border-gold/30 bg-night/20 px-4 py-2.5 text-sm text-ivory/90 transition hover:border-gold/50 hover:text-ivory"
                    >
                      Richiedi informazioni
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-gold/20 bg-midnight/50 p-7 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-ivory/60">
              Metodo
            </div>
            <h3 className="mt-2 font-serif text-2xl text-gold">
              Chiarezza
            </h3>
            <p className="mt-3 leading-relaxed text-ivory/84">
              Ogni intervento parte da obiettivi chiari e da un confronto reale
              sul testo, per evitare correzioni generiche o dispersive.
            </p>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-midnight/50 p-7 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-ivory/60">
              Approccio
            </div>
            <h3 className="mt-2 font-serif text-2xl text-gold">
              Rispetto della voce
            </h3>
            <p className="mt-3 leading-relaxed text-ivory/84">
              L’obiettivo non è uniformare il tuo stile, ma valorizzarlo e
              renderlo più efficace, leggibile e coerente.
            </p>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-midnight/50 p-7 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-ivory/60">
              Risultato
            </div>
            <h3 className="mt-2 font-serif text-2xl text-gold">
              Testi più forti
            </h3>
            <p className="mt-3 leading-relaxed text-ivory/84">
              Che si tratti di narrativa, saggistica o testi professionali, il
              lavoro editoriale serve a dare precisione, ordine e maggiore
              impatto.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-gold/25 bg-midnight/60 p-8 backdrop-blur md:p-10">
          <div className="text-xs uppercase tracking-[0.18em] text-ivory/60">
            Contatto
          </div>

          <h2 className="mt-3 max-w-3xl font-serif text-3xl leading-tight text-gold md:text-4xl">
            Vuoi capire quale intervento è più adatto al tuo manoscritto o al tuo progetto?
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-ivory/85">
            Scrivimi raccontandomi il tipo di testo, il punto in cui ti trovi e
            l’obiettivo che vuoi raggiungere. Ti risponderò con indicazioni
            chiare sul servizio più adatto e sul modo migliore per iniziare.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/#contatti"
              className="btn-shine rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95"
            >
              Richiedi informazioni
            </a>

            <Link
              href="/chi-sono"
              className="rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/90 transition hover:border-gold/45 hover:text-ivory"
            >
              Scopri chi sono
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}