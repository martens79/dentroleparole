export type PublicationItem = {
  title: string;
  year: string;
  publisher: string;
  type: "Romanzo" | "Spin-off" | "Traduzione" | "Antologia" | "Racconto" | "Magazine" | "Premio";
  desc: string;
  cover?: string;
};

export const novels: PublicationItem[] = [
  {
    title: "S the Reset - Il Risveglio",
    year: "2019",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Primo capitolo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-il-risveglio.jpg",
  },
  {
    title: "S the Reset - L'inizio della fine",
    year: "2021",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Secondo romanzo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-linizio-della-fine.jpg",
  },
  {
    title: "S the Reset - L'incubo continua",
    year: "2021",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Terzo capitolo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-lincubo-continua.jpg",
  },
  {
    title: "S the Reset - Il giorno della Libertà",
    year: "2022",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Quarto romanzo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-il-giorno-della-liberta.jpg",
  },
  {
    title: "L'Alba del Destino - S the Reset spin off 1",
    year: "2023",
    publisher: "Edizioni Amazon",
    type: "Spin-off",
    desc: "Spin-off ambientato nell'universo narrativo di S the Reset.",
    cover: "/images/publications/lalba-del-destino.jpg",
  },
  {
    title: "Aurora contro il Tempo - S the Reset spin off 2",
    year: "2024",
    publisher: "Edizioni Amazon",
    type: "Spin-off",
    desc: "Secondo spin-off della saga S the Reset.",
    cover: "/images/publications/aurora-contro-il-tempo.jpg",
  },
  {
    title: "Un sorriso maledetto",
    year: "2021",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Romanzo autonomo pubblicato fuori dalla serie S the Reset.",
    cover: "/images/publications/un-sorriso-maledetto.jpg",
  },
  {
    title: "S the Reset - The Awakening",
    year: "2022",
    publisher: "Edizioni Amazon",
    type: "Traduzione",
    desc: "Traduzione inglese di S the Reset - Il Risveglio.",
    cover: "/images/publications/s-the-reset-the-awakening.jpg",
  },
  {
    title: "S the Reset - Anthology",
    year: "2022",
    publisher: "Edizioni Amazon",
    type: "Antologia",
    desc: "Antologia collegata all'universo narrativo di S the Reset.",
    cover: "/images/publications/s-the-reset-anthology.jpg",
  },
];

export const shortStories: PublicationItem[] = [
  {
    title: "Incubi, paure e deliri",
    year: "2024",
    publisher: "Edizioni Amazon",
    type: "Racconto",
    desc: "Pubblicato all'interno dell'antologia 'Cronache dei Dimenticati vol.1: Fiamme Oscure'.",
    cover: "/images/publications/cronache-dei-dimenticati-vol1.jpg",
  },
  {
    title: "Oltre l'eternità",
    year: "2024",
    publisher: "Edizioni Amazon",
    type: "Racconto",
    desc: "Pubblicato all'interno dell'antologia 'Cronache dei Dimenticati vol.2: Cuori in tempesta'.",
    cover: "/images/publications/cronache-dei-dimenticati-vol2.jpg",
  },
  {
    title: "21 dicembre: solstizio d'inverno",
    year: "2025",
    publisher: "Edizioni Amazon",
    type: "Racconto",
    desc: "Pubblicato all'interno dell'antologia 'Cronache dei Dimenticati vol.3: C'era una volta'.",
    cover: "/images/publications/cronache-dei-dimenticati-vol3.jpg",
  },
  {
    title: "Un regalo inaspettato",
    year: "2024",
    publisher: "Blueberry Edizioni",
    type: "Racconto",
    desc: "Pubblicato all'interno dell'antologia 'Un amore sotto l'albero - Novelle natalizie'.",
    cover: "/images/publications/un-amore-sotto-lalbero.jpg",
  },
  {
    title: "Jupiter: l'uragano perfetto",
    year: "2025",
    publisher: "Land Editore",
    type: "Racconto",
    desc: "Pubblicato all'interno dell'antologia 'Our Last Land anno 2: Next Solutions'.",
    cover: "/images/publications/our-last-land-anno-2.jpg",
  },
  {
    title: "Matilde, l'angelo infernale",
    year: "2024",
    publisher: "Eclissi Edizioni / Infernalia",
    type: "Premio",
    desc: "Vincitore del 3° posto al Premio Blatty per il genere horror di Eclissi Edizioni e pubblicato nel numero 3 della rivista horror dark magazine 'Infernalia'.",
    cover: "/images/publications/infernalia-numero-3.jpg",
  },
  {
    title: "Luc e Angie, un amore dannato",
    year: "2025",
    publisher: "Winter Edizioni",
    type: "Magazine",
    desc: "Pubblicato all'interno del magazine 'Psycho Winter - Viaggi, misteri e passioni'. Ottobre 2025.",
    cover: "/images/publications/psycho-winter.jpg",
  },
   {
  title: "Radici di sangue",
  year: "2025",
  publisher: "Edizioni Amazon",
  type: "Racconto",
  desc: "Racconto selezionato nell'ambito del concorso 'La Soglia Oscura' e pubblicato nell'antologia 'Storie nel Buio vol. 2 - Racconti del Terrore'.",
  cover: "/images/publications/radici_di_sangue.jpg",
},
];