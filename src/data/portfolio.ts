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

];