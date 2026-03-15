export type PortfolioItem = {
  title: string;
  category:
    | "Editing narrativo"
    | "Correzione di bozze"
    | "Ghostwriting"
    | "Writing coach";
  year?: string;
  client?: string;
  status?: "concluso" | "in corso" | "pubblicato";
  desc: string;
  highlights?: string[];
  link?: string;
  cover?: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Oltre il confine dei sogni",
    category: "Editing narrativo",
    client: "Sylvie De Santis",
    status: "pubblicato",
    desc: "Thriller psicologico. Intervento editoriale completo: editing strutturale, editing stilistico e correzione di bozze.",
    highlights: [
      "Editing strutturale",
      "Editing stilistico",
      "Correzione di bozze",
      "Coerenza della trama",
      "Ritmo narrativo",
      "Costruzione della tensione psicologica",
      "Revisione linguistica finale",
    ],
    cover: "/images/portfolio/oltre-il-confine-dei-sogni.jpg",
  },
  {
    title: "Il ragazzo occhi cielo",
    category: "Correzione di bozze",
    client: "Olimpia Rausa",
    status: "pubblicato",
    desc: "Romanzo introspettivo costruito attraverso pensieri poetici e riflessioni intime, che esplora i temi della resilienza e della rinascita dopo il dolore.",
    highlights: [
      "Correzione ortografica",
      "Revisione della punteggiatura",
      "Uniformità tipografica",
      "Rispetto della voce autoriale",
    ],
    cover: "/images/portfolio/il-ragazzo-occhi-cielo.jpg",
  },
  {
    title: "Ragazzi Nudi",
    category: "Editing narrativo",
    client: "Daniele Di Stefano",
    status: "pubblicato",
    desc: "Narrativa contemporanea. Revisione stilistica e correzione di bozze svolte per conto di Write Up Edizioni, con interventi mirati a migliorare la fluidità della prosa, l’uniformità linguistica e la precisione tipografica del testo.",
    highlights: [
      "Revisione stilistica",
      "Correzione di bozze",
      "Fluidità della prosa",
      "Uniformità linguistica",
      "Precisione tipografica",
      "Lavoro svolto per Write Up Edizioni",
    ],
    cover: "/images/portfolio/ragazzi-nudi.jpg",
  },
  {
    title: "L’ombra del rimorso. A mio padre",
    category: "Editing narrativo",
    client: "Simone Squaiella",
    status: "pubblicato",
    desc: "Autobiografia. Editing stilistico con interventi mirati a migliorare la fluidità della narrazione, la chiarezza espressiva e la coerenza linguistica del testo, preservando il carattere intimo e personale del racconto autobiografico.",
    highlights: [
      "Editing stilistico",
      "Fluidità narrativa",
      "Chiarezza espressiva",
      "Coerenza linguistica",
      "Rispetto del tono autobiografico",
    ],
    cover: "/images/portfolio/lombra-del-rimorso.jpg",
  },
  {
    title: "Mela Glassata",
    category: "Correzione di bozze",
    client: "Giovanni Neri",
    status: "pubblicato",
    desc: "Romanzo surreale. Correzione di bozze con revisione ortografica, controllo della punteggiatura e uniformità tipografica del testo, nel rispetto dello stile originale e dell’atmosfera surreale della narrazione.",
    highlights: [
      "Revisione ortografica",
      "Controllo della punteggiatura",
      "Uniformità tipografica",
      "Rispetto dello stile originale",
      "Mantenimento dell’atmosfera surreale",
    ],
    cover: "/images/portfolio/mela-glassata.jpg",
  },
  {
    title: "Thriller psicologico con elementi weird",
    category: "Editing narrativo",
    client: "Autore anonimo",
    status: "in corso",
    desc: "Manoscritto inedito. Scheda di valutazione editoriale approfondita con interventi di macroediting su struttura narrativa, costruzione della tensione, gestione dei colpi di scena e coerenza dei personaggi. Attualmente è in corso anche il line editing del manoscritto, presentato al concorso letterario Io Scrittore.",
    highlights: [
      "Scheda di valutazione editoriale approfondita",
      "Macroediting",
      "Struttura narrativa",
      "Costruzione della tensione",
      "Gestione dei colpi di scena",
      "Coerenza dei personaggi",
      "Line editing in corso",
      "Manoscritto candidato a Io Scrittore",
    ],
    cover: "/images/portfolio/opera_inedita.png",
  },
  {
    title: "Valutazione preliminare manoscritto",
    category: "Writing coach",
    client: "Autore anonimo",
    status: "concluso",
    cover: "/images/portfolio/opera_inedita.png",
    desc: "Valutazione preliminare di un manoscritto narrativo svolta tramite piattaforma Addlance. Analisi editoriale di quattro estratti del testo e della sinossi, con osservazioni su voce narrativa, struttura della trama, costruzione dei personaggi e potenziale sviluppo dell’opera.",
    highlights: [
      "Analisi di estratti e sinossi",
      "Valutazione della voce narrativa",
      "Osservazioni sulla struttura della trama",
      "Costruzione dei personaggi",
      "Orientamento editoriale iniziale",
      "Consulenza svolta tramite Addlance",
    ],
  },
  {
    title: "Romanzo autobiografico su resilienza e rivincita personale",
    category: "Editing narrativo",
    client: "Autore anonimo",
    status: "concluso",
    cover: "/images/portfolio/opera_inedita.png",
    desc: "Manoscritto inedito. Intervento di line editing con revisione dello stile e della fluidità del testo, volto a migliorare chiarezza espressiva, scorrevolezza sintattica e coerenza stilistica, nel rispetto della voce narrativa dell’autore.",
    highlights: [
      "Line editing",
      "Revisione dello stile",
      "Fluidità del testo",
      "Chiarezza espressiva",
      "Scorrevolezza sintattica",
      "Coerenza stilistica",
      "Rispetto della voce narrativa",
    ],
  },
  {
    title: "Secondo volume di un romanzo surreale",
    category: "Correzione di bozze",
    client: "Autore anonimo",
    status: "concluso",
    cover: "/images/portfolio/opera_inedita.png",
    desc: "Manoscritto inedito. Intervento di correzione di bozze finale con revisione di ortografia, punteggiatura, refusi e uniformità tipografica, volto a garantire la correttezza formale e la pulizia del testo prima della pubblicazione. Il primo volume della serie è già presente nel portfolio tra le opere pubblicate.",
    highlights: [
      "Correzione di bozze finale",
      "Revisione ortografica",
      "Controllo della punteggiatura",
      "Eliminazione refusi",
      "Uniformità tipografica",
      "Preparazione del testo alla pubblicazione",
    ],
  },
  {
    title: "Due romanzi Harmony – I Grandi Romanzi Storici",
    category: "Correzione di bozze",
    client: "The Bookmakers",
    year: "2026",
    status: "in corso",
    cover: "/images/portfolio/opera_inedita.png",
    desc: "Due manoscritti destinati alla collana Harmony, serie I Grandi Romanzi Storici, con uscita prevista ad aprile 2026. Intervento di correzione di bozze editoriale con revisione di ortografia, punteggiatura, refusi e uniformità tipografica.",
    highlights: [
      "Correzione di bozze editoriale",
      "Due manoscritti",
      "Ortografia e punteggiatura",
      "Revisione refusi",
      "Uniformità tipografica",
      "Lavoro svolto per The Bookmakers",
      "Uscita prevista aprile 2026",
    ],
  },
];