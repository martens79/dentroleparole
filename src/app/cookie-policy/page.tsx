import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { legal } from "@/content/legal";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import {
  LegalList,
  LegalPage,
  LegalSection,
  RelatedLegalLinks,
  Val,
  legalLink,
} from "@/components/legal/LegalLayout";

export const metadata = pageMetadata({
  title: "Cookie Policy | Dentro le Parole",
  description:
    "Informativa cookie del sito Dentro le Parole di Donatella Tamburini.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  const { titolare, analytics } = legal;

  return (
    <LegalPage
      title="Cookie Policy"
      updated={legal.updated}
      solidBackground
    >
      <p>
        Questa pagina descrive i cookie e gli strumenti analoghi usati dal sito
        “Dentro le Parole” (dentroleparole.com) e come puoi gestire le tue
        scelte. I cookie sono piccoli file di testo che i siti salvano sul
        dispositivo dell’utente; strumenti analoghi, come l’archiviazione locale
        del browser, hanno funzioni simili.
      </p>

      <LegalSection title="1. Come funziona il banner">
        <p>
          Alla prima visita il sito mostra un banner con due pulsanti di pari
          evidenza: “Accetta” e “Rifiuta”. Finché non scegli, non viene caricato
          alcuno strumento di tracciamento non tecnico: scorrere la pagina o
          continuare a navigare non equivale a un consenso.
        </p>
        <p>
          La tua scelta viene ricordata per 180 giorni, poi il banner viene
          riproposto. Se cancelli i dati del browser la scelta viene eliminata e
          il banner ricompare. Puoi modificarla o revocarla in qualsiasi momento
          con il pulsante “Preferenze cookie”, sempre disponibile in basso a
          sinistra su ogni pagina, oppure con il pulsante qui sotto.
        </p>
        <div>
          <CookiePreferencesButton className="rounded-xl border border-gold/50 bg-gold/15 px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-gold/25">
            Modifica preferenze cookie
          </CookiePreferencesButton>
        </div>
      </LegalSection>

      <LegalSection title="2. Cookie tecnici e archiviazione locale">
        <p>
          Sono necessari al funzionamento del sito e non richiedono consenso.
          Il sito ne usa solo due, entrambi non contengono dati personali:
        </p>
        <LegalList>
          <li>
            <strong className="text-ivory">dlp_cookie_consent</strong>{" "}
            (archiviazione locale del browser, gestita dal sito): memorizza la
            tua scelta sui cookie e la data. Durata: 180 giorni.
          </li>
          <li>
            <strong className="text-ivory">promo_seen_&lt;mese&gt;</strong>{" "}
            (archiviazione di sessione, gestita dal sito): evita di mostrare più
            volte nella stessa visita l’avviso promozionale del mese. Durata: la
            sessione del browser.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Cookie analitici: Google Analytics 4">
        <p>
          Il sito usa Google Analytics 4, un servizio di Google, per ottenere
          statistiche sull’utilizzo delle pagine. Viene caricato{" "}
          <strong className="text-ivory">solo dopo il tuo consenso</strong>: se
          rifiuti o revochi la scelta, lo strumento non viene caricato e i cookie
          analitici eventualmente presenti vengono rimossi dal sito.
        </p>
        <LegalList>
          <li>
            <strong className="text-ivory">_ga</strong> — serve a distinguere
            gli utenti. Durata predefinita indicata da Google: 2 anni.
          </li>
          <li>
            <strong className="text-ivory">_ga_Z8PEVWKQVB</strong> — serve a
            mantenere lo stato della sessione. Durata predefinita indicata da
            Google: 2 anni.
          </li>
        </LegalList>
        <p>
          Secondo la documentazione di Google, per gli utenti dello Spazio
          economico europeo Google Analytics non registra né conserva gli
          indirizzi IP. I dati di utilizzo conservati nell’account Google
          Analytics del sito vengono mantenuti per{" "}
          <Val
            v={analytics.conservazione}
            todo="periodo di conservazione impostato nell’account Google Analytics (2 o 14 mesi)"
          />
          .
        </p>
        <p>
          Per le finalità e le basi giuridiche del trattamento consulta la{" "}
          <Link href="/privacy-policy" className={legalLink}>
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Cookie di profilazione e di marketing">
        <p>
          Il sito non utilizza propri cookie di profilazione o di marketing e non
          incorpora contenuti di terze parti (come mappe, video o plugin dei
          social network). I font sono serviti direttamente dal sito.
        </p>
      </LegalSection>

      <LegalSection title="5. Collegamenti verso altri siti">
        <p>
          Il sito contiene collegamenti a siti esterni (ad esempio negozi online,
          editori e social network). Se li apri, quei siti possono usare propri
          cookie secondo le rispettive informative, sulle quali la titolare non
          ha controllo.
        </p>
      </LegalSection>

      <LegalSection title="6. Come gestire i cookie dal browser">
        <p>
          Oltre al pulsante “Preferenze cookie”, puoi bloccare o cancellare i
          cookie dalle impostazioni del tuo browser. Bloccare i cookie tecnici
          può impedire il corretto funzionamento di alcune parti del sito.
        </p>
      </LegalSection>

      <LegalSection title="7. Riferimenti normativi">
        <p>
          Il sito si basa sull’art. 122 del Codice in materia di protezione dei
          dati personali (D.Lgs. 196/2003), sul Regolamento (UE) 2016/679 e sulle
          “Linee guida cookie e altri strumenti di tracciamento” del Garante per
          la protezione dei dati personali del 10 giugno 2021.
        </p>
      </LegalSection>

      <LegalSection title="8. Aggiornamenti e contatti">
        <p>
          Questa Cookie Policy può essere aggiornata in caso di modifiche
          tecniche del sito o dei servizi usati; la versione in vigore è quella
          pubblicata qui. Per informazioni puoi scrivere a{" "}
          <a href={`mailto:${titolare.email}`} className={legalLink}>
            {titolare.email}
          </a>
          .
        </p>
      </LegalSection>

      <RelatedLegalLinks current="/cookie-policy" />
    </LegalPage>
  );
}
