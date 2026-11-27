import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { legal, recapitoPubblico } from "@/content/legal";
import {
  LegalList,
  LegalPage,
  LegalSection,
  RelatedLegalLinks,
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
  const { titolare, primoContatto } = legal;

  return (
    <LegalPage
      title="Termini di Servizio"
      updated={legal.updated}
      solidBackground
    >
      <p>
        Questi Termini regolano l’uso del sito “Dentro le Parole”
        (dentroleparole.com) e il primo contatto con la titolare. Non
        disciplinano gli incarichi editoriali veri e propri, che nascono con un
        preventivo o un accordo individuale (punti 8 e 9). Accedendo al sito e
        utilizzandolo dichiari di aver letto questi Termini.
      </p>

      <LegalSection title="1. Titolare del sito">
        <p>
          Il sito è gestito da{" "}
          <strong className="text-ivory">{titolare.nome}</strong>
          {recapitoPubblico(titolare.indirizzo) ? (
            <>
              , con domicilio o sede professionale in{" "}
              {recapitoPubblico(titolare.indirizzo)}
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

      <LegalSection title="2. Utilizzo del sito">
        <p>
          Il sito ha finalità informative e promozionali: presenta servizi
          editoriali, di scrittura, revisione testi, coaching e realizzazione
          audiolibri, il portfolio, le pubblicazioni e gli articoli del blog. I
          contenuti hanno carattere descrittivo e non costituiscono un’offerta
          contrattuale vincolante.
        </p>
        <p>L’utente si impegna a usare il sito in modo lecito e corretto, evitando:</p>
        <LegalList>
          <li>usi fraudolenti o lesivi dei diritti altrui;</li>
          <li>l’invio di contenuti illeciti, offensivi o dannosi;</li>
          <li>tentativi di compromettere la sicurezza o la funzionalità del sito.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Richiesta iniziale di informazioni o preventivo">
        <p>
          Inviare una richiesta tramite il modulo, via email o con qualsiasi
          altro recapito indicato sul sito è una semplice richiesta di contatto,
          informazioni o preventivo: non comporta la conclusione di un contratto
          né l’accettazione dell’incarico, da parte di nessuna delle due parti. I
          dati che invii sono trattati come descritto nella{" "}
          <Link href="/privacy-policy" className={legalLink}>
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Anteprima facoltativa del manoscritto">
        <p>
          Nel primo contatto puoi allegare un’anteprima del tuo testo di{" "}
          {primoContatto.anteprima}, in formato PDF, DOC o DOCX. L’anteprima è
          facoltativa e serve a un primo riscontro orientativo, senza impegno per
          le parti.
        </p>
        <p>
          <strong className="text-ivory">
            Non è necessario inviare il manoscritto completo.
          </strong>{" "}
          Se sarà utile, la titolare potrà chiederlo successivamente via email,
          dopo il primo contatto.
        </p>
        <p>
          Se invii un’anteprima o un manoscritto dichiari di esserne l’autore o
          di avere il diritto di inviarlo, e sei responsabile del suo contenuto.
        </p>
      </LegalSection>

      <LegalSection title="5. Proprietà intellettuale">
        <p>
          <strong className="text-ivory">Il tuo testo resta tuo.</strong> Il testo
          è di proprietà dell’autore: l’invio dell’anteprima, o di qualsiasi altro
          materiale, non trasferisce alla titolare alcun diritto di sfruttamento
          dell’opera. Per i servizi che prevedono la scrittura di testi, come il
          ghostwriting, la titolarità dei diritti è regolata nell’accordo
          relativo all’incarico.
        </p>
        <p>
          I contenuti del sito (testi, grafiche, immagini, marchi, logo e
          struttura) sono protetti dalla normativa sul diritto d’autore e sulla
          proprietà intellettuale e non possono essere copiati, riprodotti o
          utilizzati senza autorizzazione, salvo diversa indicazione. Le
          copertine e i riferimenti alle opere del portfolio e delle
          pubblicazioni appartengono ai rispettivi titolari.
        </p>
      </LegalSection>

      <LegalSection title="6. Riservatezza dei testi">
        <p>
          I testi che invii sono trattati in modo riservato e usati solo per
          valutare la richiesta e per il lavoro editoriale: non vengono
          pubblicati né condivisi con editori, agenti o altri soggetti senza il
          tuo consenso. Restano i passaggi tecnici necessari a far arrivare il
          messaggio alla titolare (servizi di trasmissione e di posta elettronica
          indicati nella{" "}
          <Link href="/privacy-policy" className={legalLink}>
            Privacy Policy
          </Link>
          ).
        </p>
        {legal.strumentiIA === false ? (
          <p>
            La titolare non utilizza strumenti di intelligenza artificiale sui
            manoscritti dei clienti.
          </p>
        ) : null}
        <p>
          I tempi di conservazione di richieste, anteprime e manoscritti sono
          indicati nella Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="7. Tempi di risposta">
        <p>
          La titolare risponde alle richieste iniziali{" "}
          <strong className="text-ivory">
            entro {primoContatto.risposta}
          </strong>{" "}
          dal ricevimento. Il tempo indicato riguarda soltanto la prima risposta:
          non comprende la lettura completa o la valutazione dei testi né la
          lavorazione, che hanno i tempi stabiliti nell’incarico (punto 9).
        </p>
      </LegalSection>

      <LegalSection title="8. Servizi editoriali concordati con preventivo o accordo">
        <p>
          Un incarico editoriale (ad esempio editing, correzione di bozze,
          ghostwriting, valutazione completa del manoscritto o audiolibro) nasce
          solo quando il preventivo o l’accordo individuale proposto viene
          accettato per iscritto. Il preventivo o l’accordo prevale sui contenuti
          descrittivi del sito.
        </p>
        <p>
          Per gli incarichi conclusi a distanza con consumatori restano ferme le
          tutele previste dal Codice del consumo, comprese, quando spettano, le
          informazioni precontrattuali e il diritto di recesso.
        </p>
      </LegalSection>

      <LegalSection title="9. Tempi di lavorazione, compensi e condizioni dell’incarico">
        <p>
          Servizio richiesto, tempi di lavorazione e di consegna, compenso,
          modalità di lavoro e di pagamento e ogni altra condizione di un
          incarico sono stabiliti nel singolo preventivo o accordo. Questi Termini
          non fissano compensi, penali o condizioni di recesso: per ciascun
          incarico valgono quelle concordate per iscritto, fatte salve le
          tutele previste dalla legge.
        </p>
      </LegalSection>

      <LegalSection title="10. Natura del servizio e assenza di garanzie sul risultato">
        <p>
          I servizi editoriali sono un supporto professionale per migliorare il
          testo. Nessun editor può garantire la pubblicazione, l’accettazione da
          parte di case editrici o agenti, né risultati di vendita o di
          riscontro del pubblico.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitazione di responsabilità">
        <p>
          La titolare si impegna a mantenere le informazioni del sito aggiornate
          e corrette, ma non garantisce l’assenza di errori, interruzioni o
          indisponibilità temporanee. Salvo dolo o colpa grave, non risponde dei
          danni derivanti dall’uso del sito o dall’impossibilità temporanea di
          accedervi. Restano ferme le tutele inderogabili previste dalla legge,
          in particolare per i consumatori.
        </p>
      </LegalSection>

      <LegalSection title="12. Link esterni e affiliazione Amazon">
        <p>
          Il sito contiene collegamenti a siti di terzi (ad esempio negozi
          online, editori e social network). La titolare non controlla questi
          siti e non risponde dei loro contenuti o delle loro politiche.
        </p>
        {legal.affiliazioneAmazon === false ? null : (
          <p>
            <Val
              v={legal.affiliazioneAmazon}
              todo="se i link amzn.to della pagina Pubblicazioni sono link di affiliazione Amazon"
            />
          </p>
        )}
      </LegalSection>

      <LegalSection title="13. Modifiche ai Termini">
        <p>
          La titolare può modificare questi Termini in qualsiasi momento. Le
          modifiche hanno effetto dalla pubblicazione su questa pagina, con la
          data di ultimo aggiornamento.
        </p>
      </LegalSection>

      <LegalSection title="14. Legge applicabile">
        <p>
          Questi Termini sono regolati dalla legge italiana. Restano ferme le
          norme inderogabili a tutela dei consumatori.
        </p>
      </LegalSection>

      <LegalSection title="15. Contatti">
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
