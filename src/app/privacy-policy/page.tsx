import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { legal } from "@/content/legal";
import {
  LegalList,
  LegalPage,
  LegalSection,
  RelatedLegalLinks,
  Val,
  legalLink,
} from "@/components/legal/LegalLayout";

export const metadata = pageMetadata({
  title: "Privacy Policy | Dentro le Parole",
  description:
    "Informativa privacy del sito Dentro le Parole di Donatella Tamburini.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const { titolare, retention, primoContatto } = legal;

  return (
    <LegalPage title="Privacy Policy" updated={legal.updated}>
      <p>
        Questa informativa spiega come vengono trattati i dati personali di chi
        visita il sito “Dentro le Parole” (dentroleparole.com), compila il modulo
        di contatto, scrive via email, si iscrive alla newsletter o invia
        un’anteprima del proprio manoscritto. È resa ai sensi degli articoli 13
        e 14 del Regolamento (UE) 2016/679 (GDPR).
      </p>

      <LegalSection title="1. Titolare del trattamento">
        <p>
          Titolare del trattamento è{" "}
          <strong className="text-ivory">{titolare.nome}</strong>
          {typeof titolare.indirizzo === "string" ? (
            <>, con domicilio o sede professionale in {titolare.indirizzo}</>
          ) : null}
          {titolare.partitaIva !== false ? (
            <>
              , partita IVA{" "}
              <Val v={titolare.partitaIva} todo="partita IVA, se presente" />
            </>
          ) : null}
          .
        </p>
        <p>
          Per qualsiasi richiesta sul trattamento dei dati puoi scrivere a{" "}
          <a href={`mailto:${titolare.email}`} className={legalLink}>
            {titolare.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Quali dati vengono trattati">
        <LegalList>
          <li>
            <strong className="text-ivory">Dati di navigazione.</strong> Il
            server che ospita il sito registra automaticamente dati tecnici di
            connessione (ad esempio indirizzo IP, data e ora, pagina richiesta,
            tipo di browser) necessari al funzionamento e alla sicurezza del
            servizio.
          </li>
          <li>
            <strong className="text-ivory">Modulo di contatto.</strong> Nome e
            cognome e indirizzo email (obbligatori); titolo, genere e numero di
            parole del testo, obiettivo del libro e messaggio (facoltativi);
            un’eventuale anteprima del manoscritto in allegato, in formato PDF,
            DOC o DOCX.
          </li>
          <li>
            <strong className="text-ivory">Email.</strong> I dati contenuti nei
            messaggi che scrivi direttamente a {titolare.email} e nelle risposte,
            compresi gli eventuali file che invii in seguito, ad esempio il
            manoscritto completo se ti viene richiesto.
          </li>
          <li>
            <strong className="text-ivory">Newsletter.</strong> L’indirizzo email
            che inserisci nel modulo di iscrizione.
          </li>
          <li>
            <strong className="text-ivory">Cookie e strumenti analoghi.</strong>{" "}
            Descritti nella{" "}
            <Link href="/cookie-policy" className={legalLink}>
              Cookie Policy
            </Link>
            . Le statistiche di Google Analytics si attivano solo se accetti i
            cookie analitici.
          </li>
        </LegalList>
        <p>
          I dati sono raccolti direttamente da te. Le anteprime e i manoscritti
          possono contenere anche dati di altre persone: vedi il punto
          successivo.
        </p>
      </LegalSection>

      <LegalSection title="3. Anteprima facoltativa e manoscritti">
        <p>
          Per un primo contatto puoi allegare, se lo desideri, un’anteprima del
          testo di {primoContatto.anteprima}. È facoltativa e{" "}
          <strong className="text-ivory">
            non è necessario inviare il manoscritto completo
          </strong>
          : se serve, la titolare potrà chiedertelo successivamente via email,
          dopo il primo contatto.
        </p>
        <p>
          Le anteprime e i manoscritti possono contenere dati personali tuoi e,
          talvolta, di altre persone (ad esempio se il testo si ispira a fatti
          reali). Vengono utilizzati esclusivamente per valutare la richiesta,
          formulare un preventivo e, se affidi l’incarico, svolgere il lavoro
          editoriale concordato. Non vengono pubblicati né condivisi con editori,
          agenti o altri soggetti senza il tuo consenso. Il testo resta di tua
          proprietà: l’invio non trasferisce alla titolare alcun diritto di
          sfruttamento dell’opera.
        </p>
        <p>
          Ti chiedo di non inviare, se non strettamente necessario, informazioni
          su salute, vita sessuale, origine, opinioni o altre categorie
          particolari di dati riferite a persone reali identificabili, e di
          inviare soltanto testi di cui sei autore o per i quali hai il diritto
          di farlo.
        </p>
        {legal.strumentiIA === false ? (
          <p>
            La titolare non utilizza strumenti di intelligenza artificiale sui
            manoscritti dei clienti. Questa dichiarazione riguarda il lavoro
            editoriale svolto dalla titolare: i fornitori indicati al punto 6
            trattano i dati secondo le proprie condizioni e possono
            usare sistemi automatici propri, ad esempio i filtri antispam e
            antivirus dei servizi di posta.
          </p>
        ) : (
          <p>
            <Val
              v={legal.strumentiIA}
              todo="se il contenuto dei manoscritti viene elaborato con strumenti di intelligenza artificiale o altri servizi esterni, e quali"
            />
          </p>
        )}
        <p>
          L’anteprima allegata al modulo di contatto viene trasmessa tramite il
          servizio FormSubmit e recapitata via email alla casella{" "}
          {titolare.email}, come descritto al punto sui destinatari.
        </p>
      </LegalSection>

      <LegalSection title="4. Finalità e basi giuridiche">
        <LegalList>
          <li>
            <strong className="text-ivory">
              Rispondere alle richieste e predisporre preventivi
            </strong>{" "}
            — esecuzione di misure precontrattuali adottate su tua richiesta
            (art. 6, par. 1, lett. b GDPR).
          </li>
          <li>
            <strong className="text-ivory">
              Svolgere l’incarico editoriale concordato
            </strong>{" "}
            — esecuzione del contratto (art. 6, par. 1, lett. b).
          </li>
          <li>
            <strong className="text-ivory">
              Adempiere a obblighi fiscali, contabili e di legge
            </strong>{" "}
            — obbligo legale (art. 6, par. 1, lett. c).
          </li>
          <li>
            <strong className="text-ivory">Inviare la newsletter</strong> —
            consenso (art. 6, par. 1, lett. a), revocabile in qualsiasi momento.
          </li>
          <li>
            <strong className="text-ivory">
              Statistiche di utilizzo del sito (Google Analytics)
            </strong>{" "}
            — consenso, espresso tramite il banner dei cookie (art. 122 del
            Codice privacy e art. 6, par. 1, lett. a GDPR).
          </li>
          <li>
            <strong className="text-ivory">
              Sicurezza e corretto funzionamento del sito, tutela di un diritto
            </strong>{" "}
            — legittimo interesse della titolare (art. 6, par. 1, lett. f).
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Natura del conferimento">
        <p>
          Per rispondere a una richiesta sono necessari almeno nome e indirizzo
          email: senza questi dati non è possibile risponderti. Gli altri campi
          del modulo e l’anteprima allegata sono facoltativi ma aiutano a
          formulare un preventivo preciso. L’iscrizione alla newsletter e
          l’accettazione dei cookie analitici sono facoltative e non condizionano
          l’uso del sito.
        </p>
      </LegalSection>

      <LegalSection title="6. A chi vengono comunicati i dati">
        <p>
          I dati non vengono venduti né diffusi. Per il funzionamento del sito e
          dei servizi collegati intervengono i seguenti soggetti:
        </p>
        <LegalList>
          <li>
            <strong className="text-ivory">FormSubmit</strong> (formsubmit.co,
            gestito da Devro LABS): il modulo di contatto invia i dati e
            l’eventuale anteprima direttamente dal tuo browser a questo servizio,
            che li inoltra via email alla titolare; il server del sito non li
            riceve. Nella propria documentazione FormSubmit indica di conservare
            gli invii per 30 giorni e di non conservare i file allegati.
          </li>
          <li>
            <strong className="text-ivory">{legal.emailProvider}</strong>:
            fornisce la posta elettronica del dominio dentroleparole.com; i
            messaggi indirizzati a {titolare.email} arrivano nella casella
            gestita da questo provider.
          </li>
          <li>
            <strong className="text-ivory">Google (Gmail)</strong>: i messaggi
            ricevuti a {titolare.email} vengono inoltrati automaticamente
            all’account Gmail personale della titolare, dove li riceve e li legge.
            Il servizio è soggetto alle condizioni di Google per gli
            account personali.
          </li>
          <li>
            <strong className="text-ivory">Brevo</strong>: riceve l’indirizzo
            email di chi si iscrive alla newsletter, gestisce l’elenco degli
            iscritti e l’invio delle email. L’indirizzo transita dal server del
            sito prima di essere inviato a Brevo; il sito non ne conserva copia.
          </li>
          <li>
            <strong className="text-ivory">Vercel Inc.</strong>: ospita il sito e
            tratta i dati tecnici di navigazione. Non riceve i dati del modulo di
            contatto.
          </li>
          <li>
            <strong className="text-ivory">Google (Analytics)</strong>: fornisce
            Google Analytics, attivo solo con il tuo consenso.
          </li>
          <li>
            <strong className="text-ivory">Collaboratori o fornitori</strong>
            :{" "}
            {legal.collaboratori === false ? (
              <>
                nessun collaboratore accede ai manoscritti per svolgere il
                lavoro editoriale. Restano l’accesso tecnico dei fornitori sopra
                indicati (trasmissione del modulo, posta elettronica, hosting),
                necessario al funzionamento dei rispettivi servizi.
              </>
            ) : (
              <Val
                v={legal.collaboratori}
                todo="se altre persone (collaboratori, fornitori per audiolibri o altri servizi) possono accedere ai materiali, e a quale titolo"
              />
            )}
          </li>
          <li>
            Professionisti incaricati degli adempimenti fiscali e contabili, ove
            presenti, e le autorità competenti nei casi previsti dalla legge.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="7. Trasferimenti verso Paesi extra UE">
        <p>
          Alcuni fornitori hanno sede o usano infrastrutture fuori dallo Spazio
          economico europeo, in particolare negli Stati Uniti.
        </p>
        <LegalList>
          <li>
            <strong className="text-ivory">Vercel</strong> dichiara nella propria
            informativa di aderire all’EU-U.S. Data Privacy Framework e di
            ricorrere, ove necessario, alle clausole contrattuali standard
            approvate dalla Commissione europea.
          </li>
          <li>
            <strong className="text-ivory">Google</strong> dichiara nella propria
            documentazione di aderire all’EU-U.S. Data Privacy Framework per i
            trasferimenti di dati verso gli Stati Uniti.
          </li>
          <li>
            <strong className="text-ivory">FormSubmit</strong> non indica
            pubblicamente la sede dei propri server né le garanzie applicate a
            eventuali trasferimenti extra UE: i dati inviati con il modulo di
            contatto possono quindi essere trattati fuori dallo Spazio economico
            europeo senza che sia possibile indicare qui le garanzie adottate.
            Se preferisci evitarlo puoi scrivere direttamente a {titolare.email}.
          </li>
          <li>
            Per <strong className="text-ivory">Brevo</strong> le garanzie
            applicabili a eventuali trasferimenti extra UE sono quelle previste
            dalle condizioni contrattuali del fornitore; puoi chiedere alla
            titolare le informazioni disponibili scrivendo a {titolare.email}.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Per quanto tempo vengono conservati i dati">
        <LegalList>
          <li>
            <strong className="text-ivory">
              Richieste di informazioni e anteprime non seguite da un incarico:
            </strong>{" "}
            <Val
              v={retention.richieste}
              todo="tempo di conservazione delle richieste senza incarico"
            />
            . La richiesta si considera chiusa quando ha ricevuto risposta
            definitiva e non viene avviato un incarico (ad esempio perché il
            preventivo non viene accettato o la richiesta viene ritirata).
          </li>
          <li>
            <strong className="text-ivory">
              Manoscritti, anteprime e copie di lavoro di un incarico:
            </strong>{" "}
            <Val
              v={retention.materiali}
              todo="tempo di conservazione dei manoscritti dopo l’incarico"
            />
            . Se un incarico viene avviato, il termine di 180 giorni sostituisce
            quello previsto per le richieste.
          </li>
          <li>
            <strong className="text-ivory">
              Documenti contrattuali, amministrativi e fiscali:
            </strong>{" "}
            per i termini previsti dalla legge, che possono essere diversi da
            quelli indicati sopra: i termini di 90 e 180 giorni riguardano i
            manoscritti, le anteprime, le richieste e le relative copie di lavoro, non
            questi documenti.
          </li>
          <li>
            <strong className="text-ivory">Newsletter:</strong> fino alla
            cancellazione dell’iscrizione o alla revoca del consenso.
          </li>
          <li>
            <strong className="text-ivory">Dati di navigazione:</strong> per il
            tempo tecnicamente necessario, secondo le impostazioni del fornitore
            di hosting.
          </li>
          <li>
            <strong className="text-ivory">Invii tramite FormSubmit:</strong> 30
            giorni, secondo quanto dichiara il fornitore; gli allegati non
            vengono conservati.
          </li>
          <li>
            <strong className="text-ivory">Cookie e statistiche:</strong> vedi
            la{" "}
            <Link href="/cookie-policy" className={legalLink}>
              Cookie Policy
            </Link>
            .
          </li>
        </LegalList>
        <p>
          Trascorsi questi periodi la titolare cancella i dati dalle caselle di
          posta e dagli archivi che controlla direttamente (account Gmail,
          casella di posta del dominio, computer ed eventuali servizi di
          archiviazione). La cancellazione viene fatta dalla titolare, non è
          automatica. Restano ferme la conservazione imposta o consentita dalla
          legge, ad esempio per tutelare un diritto in sede giudiziaria, e le
          copie tecniche dei fornitori (cestino, copie di sicurezza), che
          possono persistere per periodi non controllabili dalla titolare: ad
          esempio i messaggi eliminati restano nel cestino di Gmail per 30
          giorni prima della cancellazione definitiva.
        </p>
        <p>
          Puoi chiedere la cancellazione anticipata dei tuoi dati scrivendo a{" "}
          {titolare.email}: sarà accolta salvo che la legge imponga di
          conservarli o che servano per tutelare un diritto.
        </p>
      </LegalSection>

      <LegalSection title="9. I tuoi diritti">
        <p>
          Puoi chiedere in qualsiasi momento l’accesso ai tuoi dati, la loro
          rettifica o cancellazione, la limitazione del trattamento, la
          portabilità dei dati e opporti al trattamento fondato sul legittimo
          interesse (artt. 15-22 GDPR). Se il trattamento si basa sul consenso
          puoi revocarlo in ogni momento, senza che ciò pregiudichi i trattamenti
          già effettuati; per la newsletter puoi anche chiedere la cancellazione
          dell’iscrizione scrivendo a {titolare.email}.
        </p>
        <p>
          Per esercitare i tuoi diritti scrivi a{" "}
          <a href={`mailto:${titolare.email}`} className={legalLink}>
            {titolare.email}
          </a>
          . Se ritieni che il trattamento violi la normativa puoi proporre
          reclamo al Garante per la protezione dei dati personali
          (www.garanteprivacy.it).
        </p>
      </LegalSection>

      <LegalSection title="10. Decisioni automatizzate e profilazione">
        <p>
          Il sito non utilizza processi decisionali automatizzati né attività di
          profilazione.
        </p>
      </LegalSection>

      <LegalSection title="11. Cookie">
        <p>
          Informazioni sui cookie e sulla gestione delle preferenze sono
          disponibili nella{" "}
          <Link href="/cookie-policy" className={legalLink}>
            Cookie Policy
          </Link>
          . Le condizioni di uso del sito e dei servizi sono nei{" "}
          <Link href="/termini-di-servizio" className={legalLink}>
            Termini di servizio
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="12. Aggiornamenti">
        <p>
          Questa informativa può essere aggiornata, ad esempio in caso di
          modifiche tecniche del sito o dei fornitori. La versione in vigore è
          sempre quella pubblicata su questa pagina, con la data di ultimo
          aggiornamento.
        </p>
      </LegalSection>

      <RelatedLegalLinks current="/privacy-policy" />
    </LegalPage>
  );
}
