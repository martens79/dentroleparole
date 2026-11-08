import type { MetadataRoute } from "next";
import { publicClient } from "@/lib/sanity/publicClient";
import { POST_SLUGS_QUERY } from "@/lib/sanity/queries";
import { absoluteUrl } from "@/lib/site";

// Rigenera la sitemap periodicamente, così i nuovi articoli compaiono senza nuovo deploy.
export const revalidate = 3600;

type PostSlug = {
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
};

// Pagine pubbliche e indicizzabili. Escluse di proposito: /studio (Sanity Studio),
// /grazie (pagina di ringraziamento, noindex) e /contatti (non esiste).
const STATIC_PATHS = [
  "/",
  "/servizi",
  "/chi-sono",
  "/portfolio",
  "/pubblicazioni",
  "/testimonianze",
  "/news",
  "/privacy-policy",
  "/cookie-policy",
  "/termini-di-servizio",
];

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function getPosts(): Promise<PostSlug[]> {
  try {
    const posts = await publicClient.fetch<PostSlug[]>(POST_SLUGS_QUERY);
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    // Se Sanity non risponde la build non deve fallire: la sitemap conterrà le sole pagine statiche.
    console.error("[sitemap] Impossibile recuperare gli articoli da Sanity:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getPosts()).filter((post) => post.slug);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${encodeURIComponent(post.slug as string)}`),
    // Date reali dal CMS: ultima modifica, altrimenti data di pubblicazione. Mai inventate.
    lastModified: toDate(post.updatedAt) ?? toDate(post.publishedAt),
  }));

  // L'indice del blog cambia quando cambia l'articolo più recente.
  const latestPostDate = postEntries
    .map((entry) => entry.lastModified as Date | undefined)
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
  }));

  const blogIndexEntry: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/blog"), lastModified: latestPostDate },
  ];

  return [...staticEntries, ...blogIndexEntry, ...postEntries];
}
