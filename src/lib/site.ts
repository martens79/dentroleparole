import type { Metadata } from "next";

/**
 * Configurazione centralizzata del dominio canonico.
 *
 * Il dominio è una costante di codice (non una variabile d'ambiente) di proposito:
 * canonical, og:url, sitemap e robots devono puntare sempre al dominio di
 * produzione, anche in preview o in sviluppo, e non devono mai produrre
 * indirizzi localhost.
 */
export const SITE_URL = "https://www.dentroleparole.com";

export const SITE_NAME = "Dentro le Parole";

export const DEFAULT_TITLE = "Donatella Tamburini – Editing e servizi editoriali";

export const DEFAULT_DESCRIPTION =
  "Editing narrativo, correzione di bozze e consulenza per autori. Servizi editoriali professionali.";

/** Restituisce l'URL assoluto canonico per un percorso interno (es. "/servizi"). */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

/**
 * Metadata di pagina con canonical e Open Graph coerenti.
 * Titolo e descrizione restano quelli passati dalla pagina.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "it_IT",
      url,
      title,
      description,
    },
  };
}
