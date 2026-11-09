import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { legal } from "@/content/legal";
import {
  LegalList,
  LegalPage,
  LegalSection,
  RelatedLegalLinks,
  Todo,
  Val,
  legalLink,
} from "@/components/legal/LegalLayout";

export const metadata = pageMetadata({
  title: "Termini di Servizio | Dentro le Parole",
  description:
    "Termini di utilizzo del sito Dentro le Parole di Donatella Tamburini.",
  path: "/termini-di-servizio",
});

export default function TerminiDiServizioPage() {
  const { titolare } = legal;

  return (
    <LegalPage
      title="Termini di Servizio"
      updated={legal.updated}
      solidBackground
    >
      <p>
        Questi Termini regolano l’uso del sito “Dentro le Parole”
        (dentroleparole.com). Accedendo al sito e utilizzandolo dichiari di
        averli letti. Non disciplinano gli incarichi editoriali veri e propri,
        che seguono le regole descritte al punto 3.
      </p>

      <LegalSection title="1. Titolare del sito">
        <p>
          Il sito è gestito da{" "}
          <strong className="text-ivory">{titolare.nome}</strong>
          {titolare.indirizzo !== false ? (
            <>
              , con domicilio o sede professionale in{" "}
              <Val v={titolare.indirizzo} todo="indirizzo o sede professionale" />
            </>
          ) : null}
          {titolare.partitaIva !== false ? (
            <>
              , partita IVA{" "}
              <Val v={titolare.partitaIva} todo="partita IVA, se presente" />
            </>
          ) : null}
          . Contatto:{" "}
          <a href={`mailto:${titolare.email}`} className={legalLink}>
            {titolare.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Oggetto del sito">
        <p>
          Il sito ha finalità informative e promozionali: presenta servizi
          editoriali, di scrittura, revisione testi, coaching e realizzazione
          audiolibri, il portfolio, le pubblicazioni e gli articoli del blog. I
          contenuti hanno carattere descrittivo e non costituiscono un’offerta
          contrattuale vincolante.
        </p>
      </LegalSection>

      <LegalSection title="3. Uso del sito e incarichi editoriali">
        <p>
          Inviare una richiesta tramite il modulo, via email o con qualsiasi
          altro recapito indicato sul sito è una semplice richiesta di contatto,
          informazioni o preventivo: non comporta la conclusione di un contratto
          né l’accettazione dell’incarico, da parte di nessuna delle due parti.
        </p>
        <p>
          Un incarico editoriale (ad esempio editing, correzione di bozze,
          ghostwriting, valutazione completa del manoscritto o audiolibro) nasce
          solo quando il preventivo o l’accordo proposto viene accettato per
          iscritto. Servizio, compenso, tempi di consegna, modalità di lavoro e
          di pagamento di ciascun incarico sono definiti in quel preventivo o
          accordo, che prevale sui contenuti descrittivi del sito.
        </p>
        <p>
          Per gli incarichi conclusi a distanza con consumatori si applicano le
          norme del Codice del consumo, comprese le informazioni precontrattuali
          e il diritto di recesso, quando spettano.{" "}
          <Todo>
            come vengono fornite le informazioni precontrattuali e le condizioni
            di recesso ai clienti consumatori (nel preventivo o nell’accordo)
          </Todo>
        </p>
      </LegalSection>

      <LegalSection title="4. Invio di estratti e manoscritti">
        <p>
          Se invii un estratto o un manoscritto dichiari di esserne l’autore o di
          avere il diritto di inviarlo, e sei responsabile del suo contenuto. Sono
          accettati file PDF, DOC e DOCX fino a 8 MB. I materiali inviati sono
          trattati in modo riservato e usati solo per la valutazione e per il
          lavoro editoriale, come descritto nella{" "}
          <Link href="/privacy-policy" className={legalLink}>
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          La prima lettura dell’estratto e i tempi di risposta indicati sul sito
          sono forniti a titolo orientativo e senza impegno per le parti.
        </p>
      </LegalSection>

      <LegalSection title="5. Proprietà intellettuale">
        <p>
          I contenuti del sito (testi, grafiche, immagini, marchi, logo e
          struttura) sono protetti dalla normativa sul diritto d’autore e sulla
          proprietà intellettuale e non possono essere copiati, riprodotti o
          utilizzati senza autorizzazione, salvo diversa indicazione. Le
          copertine e i riferimenti alle opere del portfolio e delle
          pubblicazioni appartengono ai rispettivi titolari.
        </p>
        <p>
          Inviando un testo non cedi alcun diritto sul tuo manoscritto. Per i
          servizi che prevedono la scrittura di testi, come il ghostwriting, la
          titolarità dei diritti è regolata nell’accordo relativo all’incarico.
        </p>
      </LegalSection>

      <LegalSection title="6. Natura del servizio e assenza di garanzie sul risultato">
        <p>
          I servizi editoriali sono un supporto professionale per migliorare il
          testo. Nessun editor può garantire la pubblicazione, l’accettazione da
          parte di case editrici o agenti, né risultati di vendita o di
          riscontro del pubblico.
        </p>
      </LegalSection>

      <LegalSection title="7. Obblighi dell’utente">
        <p>L’utente si impegna a usare il sito in modo lecito e corretto, evitando:</p>
        <LegalList>
          <li>usi fraudolenti o lesivi dei diritti altrui;</li>
          <li>l’invio di contenuti illeciti, offensivi o dannosi;</li>
          <li>tentativi di compromettere la sicurezza o la funzionalità del sito.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Limitazione di responsabilità">
        <p>
          La titolare si impegna a mantenere le informazioni del sito aggiornate
          e corrette, ma non garantisce l’assenza di errori, interruzioni o
          indisponibilità temporanee. Salvo dolo o colpa grave, non risponde dei
          danni derivanti dall’uso del sito o dall’impossibilità temporanea di
          accedervi. Restano ferme le tutele inderogabili previste dalla legge,
          in particolare per i consumatori.
        </p>
      </LegalSection>

      <LegalSection title="9. Link esterni">
        <p>
          Il sito contiene collegamenti a siti di terzi (ad esempio negozi
          online, editori e social network). La titolare non controlla questi
          siti e non risponde dei loro contenuti o delle loro politiche.
        </p>
        {legal.affiliazioneAmazon === false ? null : (
          <p>
            <Val
              v={legal.affiliazioneAmazon}
              todo="se i link amzn.to della pagina Pubblicazioni sono link di affiliazione Amazon; in tal caso va inserita la dichiarazione prevista dal programma"
            />
          </p>
        )}
      </LegalSection>

      <LegalSection title="10. Modifiche ai Termini">
        <p>
          La titolare può modificare questi Termini in qualsiasi momento. Le
          modifiche hanno effetto dalla pubblicazione su questa pagina, con la
          data di ultimo aggiornamento.
        </p>
      </LegalSection>

      <LegalSection title="11. Legge applicabile e foro">
        <p>
          Questi Termini sono regolati dalla legge italiana. Per le controversie
          con consumatori resta competente il giudice del luogo di residenza o
          domicilio del consumatore, come previsto dalla legge.
        </p>
      </LegalSection>

      <LegalSection title="12. Contatti">
        <p>
          Per informazioni su questi Termini puoi scrivere a{" "}
          <a href={`mailto:${titolare.email}`} className={legalLink}>
            {titolare.email}
          </a>
          .
        </p>
      </LegalSection>

      <RelatedLegalLinks current="/termini-di-servizio" />
    </LegalPage>
  );
}
