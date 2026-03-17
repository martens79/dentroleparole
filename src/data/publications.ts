export type PublicationItem = {
  title: string;
  year: string;
  publisher: string;
  type:
    | "Romanzo"
    | "Spin-off"
    | "Traduzione"
    | "Antologia"
    | "Racconto"
    | "Magazine"
    | "Premio";
  desc: string;
  cover?: string;
  role?: string;
  isbn?: string;
  highlights?: string[];
  link?: string;
  amazonUrl?: string;
};

export const novels: PublicationItem[] = [
  {
    title: "S the Reset - Il Risveglio",
    year: "2019",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Primo capitolo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-il-risveglio.jpg",
    amazonUrl: "https://amzn.to/4rztLaA",
  },
  {
    title: "S the Reset - L'inizio della fine",
    year: "2021",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Secondo romanzo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-linizio-della-fine.jpg",
    amazonUrl: "https://amzn.to/41cyVys",
  },
  {
    title: "S the Reset - L'incubo continua",
    year: "2021",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Terzo capitolo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-lincubo-continua.jpg",
    amazonUrl: "https://amzn.to/4t8DDcT",
  },
  {
    title: "S the Reset - Il giorno della Libertà",
    year: "2022",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Quarto romanzo della serie S the Reset.",
    cover: "/images/publications/s-the-reset-il-giorno-della-liberta.jpg",
    amazonUrl: "https://amzn.to/4bqs1dQ",
  },
  {
    title: "L'Alba del Destino - S the Reset spin off 1",
    year: "2023",
    publisher: "Edizioni Amazon",
    type: "Spin-off",
    desc: "Spin-off ambientato nell'universo narrativo di S the Reset.",
    cover: "/images/publications/lalba-del-destino.jpg",
    amazonUrl: "https://amzn.to/473vNbO",
  },
  {
    title: "Aurora contro il Tempo - S the Reset spin off 2",
    year: "2024",
    publisher: "Edizioni Amazon",
    type: "Spin-off",
    desc: "Secondo spin-off della saga S the Reset.",
    cover: "/images/publications/aurora-contro-il-tempo.jpg",
    amazonUrl: "https://amzn.to/4bo4vhv",
  },
  {
    title: "Un sorriso maledetto",
    year: "2021",
    publisher: "Edizioni Amazon / Youcanprint",
    type: "Romanzo",
    desc: "Romanzo autonomo pubblicato fuori dalla serie S the Reset.",
    cover: "/images/publications/un-sorriso-maledetto.jpg",
    amazonUrl: "https://amzn.to/4sSx5Pp",
  },
  {
    title: "S the Reset - The Awakening",
    year: "2022",
    publisher: "Edizioni Amazon",
    type: "Traduzione",
    desc: "Traduzione inglese di S the Reset - Il Risveglio.",
    cover: "/images/publications/s-the-reset-the-awakening.jpg",
    amazonUrl: "https://amzn.to/416WuJ1",
  },
  {
    title: "S the Reset - Anthology",
    year: "2022",
    publisher: "Edizioni Amazon",
    type: "Antologia",
    desc: "Antologia collegata all'universo narrativo di S the Reset.",
    cover: "/images/publications/s-the-reset-anthology.jpg",
    amazonUrl: "https://amzn.to/4lul7c1",
  },
];

export const shortStories: PublicationItem[] = [
  {
  title: "Incubi, paure e deliri",
  year: "2024",
  publisher: "Edizioni Amazon",
  type: "Racconto",
  desc: "Pubblicato nell'antologia 'Cronache dei Dimenticati vol.1: Fiamme Oscure'.",
  cover: "/images/publications/cronache-dei-dimenticati-vol1.jpg",
  link: "https://www.amazon.it/Cronache-dei-dimenticati-Fiamme-oscure/dp/B0D3B8V1TZ",
},
 {
  title: "Oltre l'eternità",
  year: "2024",
  publisher: "Edizioni Amazon",
  type: "Racconto",
  desc: "Pubblicato nell'antologia 'Cronache dei Dimenticati vol.2: Cuori in tempesta'.",
  cover: "/images/publications/cronache-dei-dimenticati-vol2.jpg",
  link: "https://www.amazon.it/dp/B0DLBLBFNR",
},
  {
  title: "21 dicembre: solstizio d'inverno",
  year: "2025",
  publisher: "Edizioni Amazon",
  type: "Racconto",
  desc: "Pubblicato nell'antologia 'Cronache dei Dimenticati vol.3: C'era una volta'.",
  cover: "/images/publications/cronache-dei-dimenticati-vol3.jpg",
  link: "https://www.amazon.it/dp/B0FRXJJX2P",
},
  {
  title: "Un regalo inaspettato",
  year: "2024",
  publisher: "Blueberry Edizioni",
  type: "Racconto",
  desc: "Pubblicato nell'antologia 'Un amore sotto l'albero - Novelle natalizie'.",
  cover: "/images/publications/un-amore-sotto-lalbero.jpg",
  link: "https://www.amazon.it/dp/B0DNN67SH3",
},
  {
  title: "Jupiter: l'uragano perfetto",
  year: "2025",
  publisher: "Land Editore",
  type: "Racconto",
  desc: "Pubblicato nell'antologia 'Our Last Land anno 2: Next Solutions'.",
  cover: "/images/publications/our-last-land-anno-2.jpg",
  link: "https://www.amazon.it/dp/B0F9FTZ85M",
},
  {
  title: "Matilde, l'angelo infernale",
  year: "2024",
  publisher: "Eclissi Edizioni / Infernalia",
  type: "Premio",
  desc: "3° posto al Premio Blatty per il genere horror e pubblicato nel magazine 'Infernalia'.",
  cover: "/images/publications/infernalia-numero-3.jpg",
  link: "https://www.eclissiedizioni.com/infernalia.html",
},
  {
  title: "Luc e Angie, un amore dannato",
  year: "2025",
  publisher: "Winter Edizioni",
  type: "Magazine",
  desc: "Pubblicato nel magazine 'Psycho Winter - Viaggi, misteri e passioni'.",
  cover: "/images/publications/psycho-winter.jpg",
  link: "https://winteredizioni.com/prodotto/psycho-winter-n6-ottobre-2025/",
},
  {
  title: "Radici di sangue",
  year: "2025",
  publisher: "Edizioni Amazon",
  type: "Racconto",
  desc: "Pubblicato nell'antologia 'Storie nel Buio vol.2 - Racconti del Terrore'.",
  cover: "/images/publications/radici_di_sangue.jpg",
  link: "https://www.amazon.it/dp/B0G36LFJ87",
},
];

export const publications: PublicationItem[] = [
  ...novels,
  ...shortStories,
];