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
  title: "Privacy Policy | Dentro le Parole",
  description:
    "Informativa privacy del sito Dentro le Parole di Donatella Tamburini.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const { titolare, retention } = legal;

  return (
    <LegalPage title="Privacy Policy" updated={legal.updated}>
      <p>
        Questa informativa spiega come vengono trattati i dati personali di chi
        visita il sito “Dentro le Parole” (dentroleparole.com), compila il modulo
        di contatto, scrive via email, si iscrive alla newsletter o invia un
        estratto o un manoscritto per una valutazione. È resa ai sensi degli
        articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR).
      </p>

      <LegalSection title="1. Titolare del trattamento">
        <p>
          Titolare del trattamento è{" "}
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
            cognome e indirizzo email (obbligatori), titolo, genere e numero di
            parole del testo, obiettivo del libro, messaggio e un eventuale file
            allegato (PDF, DOC o DOCX, fino a 8 MB).
          </li>
          <li>
            <strong className="text-ivory">Email.</strong> I dati contenuti nei
            messaggi che scrivi direttamente a {titolare.email} e nelle risposte.
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
          I dati sono raccolti direttamente da te. Gli estratti e i manoscritti
          possono contenere anche dati di altre persone: vedi il punto
          successivo.
        </p>
      </LegalSection>

      <LegalSection title="3. Estratti, manoscritti e allegati">
        <p>
          Gli estratti e i manoscritti che invii possono contenere dati personali
          tuoi e, talvolta, di altre persone (ad esempio se il testo si ispira a
          fatti reali). Vengono utilizzati esclusivamente per valutare la
          richiesta, formulare un preventivo e, se affidi l’incarico, svolgere il
          lavoro editoriale concordato. Non vengono pubblicati né condivisi con
          editori, agenti o altri soggetti senza il tuo consenso.
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
            Per il lavoro editoriale non vengono utilizzati strumenti di
            intelligenza artificiale che elaborano il contenuto dei manoscritti.
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
          Il file allegato al modulo di contatto viene trasmesso tramite il
          servizio FormSubmit e recapitato via email alla titolare (vedi il punto
          sui destinatari).
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
          del modulo e l’allegato sono facoltativi ma aiutano a formulare un
          preventivo preciso. L’iscrizione alla newsletter e l’accettazione dei
          cookie analitici sono facoltative e non condizionano l’uso del sito.
        </p>
      </LegalSection>

      <LegalSection title="6. A chi vengono comunicati i dati">
        <p>
          I dati non vengono venduti né diffusi. Per il funzionamento del sito e
          dei servizi collegati vengono utilizzati i seguenti fornitori:
        </p>
        <LegalList>
          <li>
            <strong className="text-ivory">FormSubmit</strong> (formsubmit.co,
            gestito da Devro LABS): riceve i dati del modulo di contatto e gli
            eventuali allegati e li inoltra via email alla titolare. Nella
            propria documentazione indica di conservare gli invii per 30 giorni e
            di non conservare i file allegati.
          </li>
          <li>
            <strong className="text-ivory">Brevo</strong>: gestisce l’elenco di
            iscrizione alla newsletter e l’invio delle email.
          </li>
          <li>
            <strong className="text-ivory">Vercel Inc.</strong>: fornisce
            l’hosting del sito.
          </li>
          <li>
            <strong className="text-ivory">Google</strong>: fornisce Google
            Analytics, attivo solo con il tuo consenso.
          </li>
          <li>
            <strong className="text-ivory">
              <Val
                v={legal.emailProvider}
                todo="nome del provider della posta in ingresso"
              />
            </strong>
            : provider della posta elettronica in ingresso del dominio
            dentroleparole.com.
          </li>
          <li>
            <strong className="text-ivory">Collaboratori o fornitori</strong>
            :{" "}
            {legal.collaboratori === false ? (
              <>
                nessun collaboratore o fornitore esterno accede ai manoscritti.
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
          economico europeo, in particolare negli Stati Uniti. Vercel Inc.
          dichiara nella propria informativa di aderire all’EU-U.S. Data Privacy
          Framework e di ricorrere, ove necessario, alle clausole contrattuali
          standard approvate dalla Commissione europea.
        </p>
        <p>
          <Todo>
            sede e garanzie di trasferimento di Google (Analytics), FormSubmit e
            Brevo: da verificare nella documentazione contrattuale dei fornitori
            prima della pubblicazione
          </Todo>
        </p>
      </LegalSection>

      <LegalSection title="8. Per quanto tempo vengono conservati i dati">
        <LegalList>
          <li>
            <strong className="text-ivory">
              Richieste, preventivi ed estratti non seguiti da un incarico:
            </strong>{" "}
            <Val
              v={retention.richieste}
              todo="per quanto tempo si conservano le richieste e gli estratti quando non nasce un incarico"
            />
          </li>
          <li>
            <strong className="text-ivory">
              Manoscritti, allegati e materiali di un incarico:
            </strong>{" "}
            <Val
              v={retention.materiali}
              todo="per quanto tempo si conservano i manoscritti e i materiali dopo la conclusione dell’incarico"
            />
          </li>
          <li>
            <strong className="text-ivory">Documenti fiscali e contabili:</strong>{" "}
            per i termini previsti dalla normativa fiscale e contabile.
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
          Trascorsi questi periodi i dati vengono cancellati o resi anonimi,
          salvo che la legge ne imponga o consenta la conservazione, ad esempio
          per tutelare un diritto in sede giudiziaria.
        </p>
      </LegalSection>

      <LegalSection title="9. I tuoi diritti">
        <p>
          Puoi chiedere in qualsiasi momento l’accesso ai tuoi dati, la loro
          rettifica o cancellazione, la limitazione del trattamento, la
          portabilità dei dati e opporti al trattamento fondato sul legittimo
          interesse (artt. 15-22 GDPR). Se il trattamento si basa sul consenso
          puoi revocarlo in ogni momento, senza che ciò pregiudichi i trattamenti
          già effettuati.
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
