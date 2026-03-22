// Home.tsx (o page.tsx) — Server Component safe (Next App Router)
import React from "react";
import {
  PenTool,
  SpellCheck,
  Feather,
  GraduationCap,
  Mic,
} from "lucide-react";

import Section from "../components/Section";
import Card from "../components/Card";
import PremiumBox from "../components/PremiumBox";
import PublicationRow from "../components/PublicationRow";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import NewsTicker from "@/components/NewsTicker";
import FaqAccordion from "@/components/FaqAccordion";
import PromoPopup from "@/components/PromoPopup";

const services = [
  {
    id: "editing-narrativo",
    title: "Editing narrativo",
    icon: PenTool,
    shortDesc:
      "Editing narrativo. Analisi e miglioramento di struttura, trama, personaggi, ritmo e stile per romanzi e racconti.",
    desc:
      "Analisi di struttura, trama, personaggi, ritmo e stile. Note operative e indicazioni pratiche per la riscrittura, con esempi direttamente sul testo.",
  },
  {
    id: "correzione-bozze",
    title: "Correzione di bozze",
    icon: SpellCheck,
    shortDesc:
      "Correzione di errori grammaticali, ortografici e sintattici, con controllo dell'uniformità tipografica e della coerenza editoriale prima della pubblicazione.",
    desc:
      "Controllo grammaticale, ortografico, sintattico e uniformità tipografica. Pulizia finale prima della pubblicazione, senza snaturare la tua voce.",
  },
  {
    id: "ghostwriting",
    title: "Ghostwriting",
    icon: Feather,
    shortDesc:
      "Scrittura completa dell'opera a partire da un'idea, appunti o materiali preliminari.",
    desc:
      "Sviluppo completo di opere narrative da un’idea o materiale preliminare. Struttura, scrittura e revisione con riservatezza e confronto costante.",
  },
  {
    id: "writing-coach",
    title: "Scrittura creativa & Writing Coach",
    icon: GraduationCap,
    shortDesc:
      "Percorso guidato per migliorare tecnica narrativa, metodo e consapevolezza  nella scrittura.",
    desc:
      "Percorso personalizzato per migliorare tecnica e stile: esercizi mirati, feedback sui capitoli, revisione guidata e metodo per arrivare alla fine del libro.",
  },
  {
    id: "saggistica",
    title: "Editing e correzione di bozze per testi di saggistica",
    icon: PenTool,
    shortDesc:
      "Editing e revisione linguistica di saggi, testi divulgativi e contenuti di non-fiction.",
    desc:
      "Revisione editoriale di saggi, testi divulgativi e contenuti di non-fiction. Intervento su struttura, chiarezza espositiva, coerenza argomentativa, grammatica e uniformità stilistica.",
  },
  {
    id: "articoli-tesi",
    title: "Revisione di articoli, relazioni e tesi",
    icon: GraduationCap,
    shortDesc:
      "Revisione di articoli, relazioni e tesi. Revisione linguistica e strutturale per articoli, relazioni, tesi e testi professionali",
    desc:
      "Supporto nella revisione linguistica e strutturale di articoli, relazioni e tesi scolastiche o universitarie. Miglioramento della chiarezza espositiva, correzione grammaticale e controllo della coerenza del testo.",
  },
];

const manuscriptAssessmentService: {
  title: string;
  icon: React.ElementType;
  desc: string;
  badge: string;
} = {
  title: "Valutazione manoscritto",
  icon: PenTool,
  desc:
    "Valutazione editoriale dell’estratto (5–10 pagine) con indicazioni sui punti di forza, eventuali criticità e suggerimenti di sviluppo. Il riscontro sull’estratto è gratuito e consente di capire se procedere con una valutazione completa o con un intervento di editing.",
  badge: "VALUTAZIONE",
};

const audiobookService = {
  title: "Realizzazione Audiolibri",
  icon: Mic,
  desc:
    "Trasformazione di opere narrative in audiolibri pronti per la distribuzione digitale. Il servizio include adattamento del testo alla lettura, registrazione, editing audio professionale, pulizia del suono e preparazione dei file secondo gli standard delle principali piattaforme.",
  badge: "AUDIO",
};

const method = [
  {
    n: "1",
    title: "Valutazione",
    desc: "Estratto + obiettivi + preventivo dettagliato.",
  },
  {
    n: "2",
    title: "Intervento",
    desc: "Revisione strutturata con note chiare e proposte.",
  },
  {
    n: "3",
    title: "Consegna",
    desc: "File revisionato + sintesi + prossimi passi.",
  },
];

const faq = [
  {
    q: "Quanto costa un intervento editoriale?",
    a: "Il costo dipende dalla lunghezza del manoscritto e dal tipo di intervento richiesto (editing, correzione di bozze o consulenza). Dopo aver letto l’estratto invio sempre un preventivo chiaro e personalizzato.",
  },
  {
    q: "Cosa serve per iniziare?",
    a: "Per una prima valutazione mi servono: titolo e genere del manoscritto, numero indicativo di parole o cartelle, un estratto di 5–10 pagine e l’obiettivo del progetto.",
  },
  {
    q: "L’editing cambierà la mia voce?",
    a: "No. L’obiettivo dell’editing non è uniformare lo stile, ma rafforzarlo. Il lavoro editoriale serve a rendere il testo più chiaro, coerente ed efficace, rispettando sempre la voce dell’autore.",
  },
  {
    q: "Quanto tempo richiede una revisione?",
    a: "Dipende dalla lunghezza del testo e dal tipo di intervento richiesto. Dopo la valutazione iniziale fornisco sempre una stima realistica dei tempi di lavoro.",
  },
  {
    q: "Lavori su tutti i generi?",
    a: "Sì. Lavoro su diversi tipi di testo, tra cui narrativa, saggistica, tesi e articoli. La mia area di maggiore specializzazione resta però la narrativa (romanzi e racconti), dove intervengo su struttura, ritmo, personaggi e stile.",
  },
  {
    q: "Posso inviarti il manoscritto completo?",
    a: "Per iniziare preferisco leggere un estratto. Questo mi permette di capire il tipo di intervento necessario e di formulare un preventivo preciso. In seguito potremo lavorare sull’intero manoscritto.",
  },
  {
    q: "Il mio manoscritto rimane riservato?",
    a: "Sì. Tutti i materiali inviati vengono trattati con massima riservatezza e utilizzati esclusivamente per la valutazione e il lavoro editoriale.",
  },
  {
    q: "L’editing garantisce la pubblicazione?",
    a: "No. Nessun editor può garantire la pubblicazione. L’editing serve a migliorare il testo e a portarlo a uno standard editoriale solido, aumentando le possibilità di presentarlo con successo a editori o agenti.",
  },
  {
    q: "Posso ricevere una prima valutazione prima di decidere?",
    a: "Sì. Puoi inviarmi un estratto di 5–10 pagine del tuo manoscritto. Questa prima lettura mi permette di capire il tipo di intervento necessario e di inviarti un preventivo chiaro e personalizzato, senza alcun impegno.",
  },
];

const news = [
  {
    date: "Mar 2026",
    title: "Editing in corso: romanzo dark fantasy (120k parole)",
    desc:
      "Revisione strutturale + lavoro su ritmo e coerenza dei POV. Consegna prevista a fine mese.",
  },
  {
    date: "Feb 2026",
    title: "Nuova guida: come preparare un estratto efficace per l’editing",
    desc:
      "Mini articolo/risorsa gratuita con checklist per inviare materiale chiaro e completo.",
  },
];

const publications = [
  {
    title: "Titolo Romanzo 1",
    type: "Romanzo",
    year: "2024",
    publisher: "Casa editrice / Self",
    role: "Autrice",
    isbn: "978-...",
    link: "",
    desc:
      "Una riga di descrizione: tono, tema, ambientazione (senza spoiler).",
    highlights: ["Finalista Premio X", "Selezione Y"],
  },
  {
    title: "Titolo Racconto 1",
    type: "Racconto",
    year: "2023",
    publisher: "Antologia / Rivista",
    role: "Autrice",
    isbn: "",
    link: "",
    desc:
      "Dove è uscito e perché è rilevante (tema o riconoscimento).",
    highlights: [],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen text-ivory">

       <PromoPopup />
      {/* SFONDI FISSI */}
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      {/* HEADER/HERO STICKY SECONDARIO */}
      <header className="top-fixed-hero">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-[0.06em] text-ivory sm:text-lg">
              Donatella Tamburini
            </div>
            <div className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-ivory/70 sm:text-xs">
              Scrittura creativa • Editing • Correzione di bozze • Ghostwriting
              • Realizzazione audiolibri
            </div>
          </div>
        </div>
      </header>

      {/* CONTENUTI */}
      <div className="content-layer">
        <NewsTicker />
        {/* HERO */}
        <section className="hero-spacer mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ivory/70 sm:text-xs">
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1">
                Editing narrativo
              </span>
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1">
                Correzione di bozze
              </span>
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1">
                Writing coach
              </span>
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1">
                Ghostwriting
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
                       Trasforma il tuo romanzo in un testo{" "}
                       <span className="text-gold">pronto per l'editoria</span>,
                               senza snaturare la tua voce.
                                    </h1>

            <p className="mt-2 max-w-prose text-ivory/85">
              Interventi strutturali e stilistici su romanzi e racconti per
              autori emergenti e già pubblicati: trama, personaggi, ritmo,
              stile, coerenza narrativa. Metodo chiaro, note operative,
              confronto costante.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-ivory/75">
              <div className="flex items-center gap-2 rounded-2xl border border-gold/15 bg-midnight/35 px-4 py-2">
                <span className="text-gold">✓</span> Risposta entro 3-5 giorni
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-gold/15 bg-midnight/35 px-4 py-2">
                <span className="text-gold">✓</span> Estratto 5–10 pagine
                (gratuito)
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-gold/15 bg-midnight/35 px-4 py-2">
                <span className="text-gold">✓</span> Riservatezza garantita
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contatti"
              className="btn-shine rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-night shadow-glow transition hover:opacity-95"
            >
              Richiedi una valutazione
            </a>

            <a
              href="#servizi"
              className="rounded-2xl border border-gold/30 bg-midnight/40 px-5 py-3 text-sm text-ivory/95 transition hover:border-gold/50"
            >
              Scopri i servizi
            </a>

            <a
              href="#metodo"
              className="rounded-2xl border border-gold/20 bg-night/20 px-5 py-3 text-sm text-ivory/85 transition hover:border-gold/40 hover:text-ivory"
            >
              Come lavoro
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-gold/25 bg-midnight/55 p-6 backdrop-blur transition hover:border-gold/45 md:col-span-2">
              <div className="text-lg font-semibold tracking-[0.06em] text-ivory">
                Donatella Tamburini
              </div>
              <p className="mt-2 text-ivory/88">
                Editor e consulente editoriale specializzata in narrativa.
                Affianco autori emergenti e già pubblicati nella revisione di romanzi e racconti, lavorando su struttura,
                stile, ritmo e coerenza narrativa.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-ivory/70">
                <span className="rounded-full border border-gold/15 bg-night/20 px-3 py-1">
                  Struttura & trama
                </span>
                <span className="rounded-full border border-gold/15 bg-night/20 px-3 py-1">
                  Personaggi & POV
                </span>
                <span className="rounded-full border border-gold/15 bg-night/20 px-3 py-1">
                  Ritmo & stile
                </span>
                <span className="rounded-full border border-gold/15 bg-night/20 px-3 py-1">
                  Coerenza narrativa
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-gold/25 bg-midnight/55 p-6 backdrop-blur transition hover:border-gold/45">
              <div className="text-xs uppercase tracking-[0.18em] text-ivory/65">
                Da dove si parte
              </div>
              <div className="mt-2 text-lg font-semibold text-gold">
                Valutazione estratto
              </div>
              <p className="mt-2 text-ivory/88">
                Invia 5–10 pagine: ricevi un riscontro su punti di forza,
                criticità e direzione di lavoro.
              </p>

              <div className="mt-4">
                <a
                  href="#contatti"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gold transition hover:text-gold/80"
                >
                  Richiedi ora →
                </a>
              </div>

              <div className="mt-4 text-xs text-ivory/60">
                Form semplice • File opzionale • Nessuna iscrizione
              </div>
            </div>
          </div>
        </section>

      {/* SERVIZI */}
<Section
  id="servizi"
  title="Servizi"
  subtitle="Interventi editoriali su narrativa, testi di saggistica e progetti di scrittura."
  titleClassName="px-6 py-3 text-3xl md:text-[2.6rem]"
>
  {/* preview compatte */}
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {services.map((s) => (
      <Card
        key={s.id}
        title={s.title}
        desc={s.shortDesc}
        icon={s.icon}
        variant="compact"
        cta={
          <a
            href={`/servizi#${s.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gold transition hover:text-gold/80"
          >
            Approfondisci →
          </a>
        }
      />
    ))}
  </div>

  {/* box speciali */}
  <div className="mt-6 grid gap-4 md:grid-cols-2">
    <Card
      title={manuscriptAssessmentService.title}
      desc="Riscontro editoriale sull’estratto con punti di forza, criticità e direzione di lavoro."
      icon={manuscriptAssessmentService.icon}
      badge="VALUTAZIONE"
      full
      cta={
        <a
          href="#contatti"
          className="inline-flex items-center gap-2 text-sm font-medium text-gold transition hover:text-gold/80"
        >
          Richiedi una valutazione →
        </a>
      }
    />

    <Card
      title={audiobookService.title}
      desc="Adattamento, registrazione, editing audio e preparazione dei file per la distribuzione."
      icon={audiobookService.icon}
      badge="AUDIO"
      full
      cta={
        <a
          href="/servizi#audiolibri"
          className="inline-flex items-center gap-2 text-sm font-medium text-gold transition hover:text-gold/80"
        >
          Scopri di più →
        </a>
      }
    />
  </div>

  {/* bottone pagina servizi */}
  <div className="mt-8 flex justify-center">
    <a
      href="/servizi"
      className="rounded-2xl border border-gold/25 bg-midnight/45 px-5 py-3 text-sm text-ivory/90 transition hover:border-gold/45 hover:text-ivory"
    >
      Vedi tutti i servizi
    </a>
  </div>
</Section>
      

        {/* METODO */}
<Section
  id="metodo"
  title="Metodo di lavoro"
  subtitle="Un percorso semplice e trasparente, dall’estratto alla consegna."
  titleClassName="px-6 py-3 text-3xl md:text-[2.6rem]"
>
  <div className="grid gap-4 md:grid-cols-3">
    {method.map((m) => (
      <PremiumBox key={m.n}>
        <div className="text-xs uppercase tracking-[0.18em] text-ivory/65">
          Step {m.n}
        </div>

        <div className="mt-2 font-semibold text-gold">
          {m.title}
        </div>

        <p className="mt-2 text-ivory/88">
          {m.desc}
        </p>
      </PremiumBox>
    ))}
  </div>

  {/* pulsante approfondimento */}
  <div className="mt-8 flex justify-center">
    <a
      href="/chi-sono#come-lavoro"
      className="rounded-2xl border border-gold/25 bg-midnight/45 px-5 py-3 text-sm text-ivory/90 transition hover:border-gold/45 hover:text-gold"
    >
      Scopri
    </a>
  </div>
</Section>

        {/* FAQ */}
       <Section
  id="faq"
  title="FAQ"
  subtitle="Le domande più comuni prima di iniziare."
  titleClassName="px-6 py-3 text-3xl md:text-[2.6rem]"
>
  <FaqAccordion items={faq} />
</Section>

        {/* CONTATTI */}
        <Section
          id="contatti"
          title="Richiedi un preventivo"
          subtitle="Invia titolo, genere, numero parole e un estratto (5–10 pagine)."
        >
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="rounded-3xl border border-gold/25 bg-midnight/55 p-8 backdrop-blur transition hover:border-gold/45">
                <ContactForm />

                <p className="mt-6 text-center text-sm text-ivory/65">
                  Risposta entro{" "}
                  <span className="text-ivory/90">3-5 giorni</span>.
                </p>

               
              </div>
            </div>
          </div>
        </Section>

        <Footer />
      </div>
    </main>
  );
}