/**
 * Dati delle pagine legali (Privacy Policy, Cookie Policy, Termini di servizio).
 *
 * Convenzione per i campi che solo la titolare può confermare:
 *   - `null`   = dato ancora da confermare
 *   - `false`  = non applicabile / nessuno (la riga viene omessa o riformulata)
 *   - stringa  = valore confermato, mostrato così com'è
 *
 * Prima della pubblicazione definitiva nessun campo deve restare `null`:
 * `node scripts/check-legal-placeholders.mjs` lo verifica e fallisce finché ce n'è uno.
 * I campi `null` NON mostrano segnaposto sul sito pubblico: la clausola corrispondente viene
 * omessa o espressa in forma neutra, in attesa del dato.
 */

type Confirmable = string | null | false;

/** Segnaposto INTERNO del recapito professionale: non deve mai comparire nell'HTML pubblico. */
export const RECAPITO_PLACEHOLDER = "[RECAPITO PROFESSIONALE DA COMPLETARE]";

/** Recapito da mostrare sulle pagine pubbliche: `null` finché è ancora il segnaposto interno. */
export function recapitoPubblico(value: Confirmable): string | null {
  return typeof value === "string" && value !== RECAPITO_PLACEHOLDER ? value : null;
}

export const legal = {
  /** Data mostrata come "Ultimo aggiornamento" (da aggiornare alla pubblicazione). */
  updated: "10 novembre 2026",

  titolare: {
    nome: "Donatella Tamburini",
    /** Recapito già pubblicato nel footer e destinatario del modulo di contatto. */
    email: "contatti@dentroleparole.com",

    /**
     * ┌─ RECAPITO PROFESSIONALE: PUNTO SOSPESO ─────────────────────────────────────────────┐
     * │ La titolare non vuole inserire ora un indirizzo nel repository pubblico.            │
     * │ Finché il valore è il segnaposto interno RECAPITO_PLACEHOLDER, le pagine pubbliche  │
     * │ NON mostrano né l'indirizzo né il segnaposto (la frase viene omessa): restano il    │
     * │ nome della titolare e l'email professionale. Il recapito va completato prima della  │
     * │ pubblicazione definitiva: sostituire il valore con il recapito scelto dalla titolare │
     * │ e lanciare `node scripts/check-legal-placeholders.mjs --strict`.                    │
     * │ Se ne servirà la pubblicazione, tenere presente che il repository è pubblico.       │
     * └──────────────────────────────────────────────────────────────────────────────────────┘
     */
    indirizzo: RECAPITO_PLACEHOLDER as Confirmable,

    /**
     * Partita IVA. La titolare ha dichiarato (10 novembre 2026) di non averne attualmente una:
     * `false` = riga omessa. Non indica una valutazione sulla posizione fiscale dell'attività
     * (vedi docs/legal/STATO_E_DOMANDE_2026-11-10.md, punto sulla situazione fiscale).
     */
    partitaIva: false as Confirmable,
  },

  /** Decisioni già confermate dalla titolare sul primo contatto (valgono per tutte le pagine). */
  primoContatto: {
    /** Formula ufficiale del tempo di risposta alle richieste iniziali. */
    risposta: "3–5 giorni lavorativi",
    /** Anteprima facoltativa del manoscritto. */
    anteprima: "5–10 cartelle editoriali (circa 1.800 battute ciascuna, spazi inclusi)",
  },

  /**
   * Tempi di conservazione confermati dalla titolare il 10 novembre 2026.
   * Non esiste alcuna cancellazione automatica: la titolare cancella manualmente seguendo
   * docs/legal/PROCEDURA_CONSERVAZIONE_DATI.md. Le pagine non devono dire il contrario.
   */
  retention: {
    /** Richieste di informazioni e anteprime senza incarico. Decorre dalla chiusura della richiesta. */
    richieste: "90 giorni dalla chiusura della richiesta" as Confirmable,
    /** Manoscritti, anteprime e copie di lavoro di un incarico. Decorre dalla conclusione dell'incarico. */
    materiali: "180 giorni dalla conclusione dell’incarico" as Confirmable,
  },

  /** Provider della posta in ingresso del dominio (record MX verificato: 10 mail.register.it). */
  emailProvider: "Register.it" as Confirmable,

  /**
   * Collaboratori che accedono ai manoscritti per svolgere il lavoro editoriale.
   * `false` = nessuno (dichiarazione della titolare, 10 novembre 2026). Riguarda solo le persone:
   * i fornitori tecnici (hosting, posta, trasmissione del modulo) restano elencati a parte.
   */
  collaboratori: false as Confirmable,

  /**
   * Uso di strumenti di intelligenza artificiale sui manoscritti dei clienti.
   * `false` = non utilizzati dalla titolare (dichiarazione del 10 novembre 2026). Non è una
   * garanzia sulle tecnologie dei fornitori esterni.
   */
  strumentiIA: false as Confirmable,

  analytics: {
    /**
     * Conservazione dei dati nell'account Google Analytics: è un'impostazione dell'account, non
     * verificabile dal codice. Decisione della titolare (10 novembre 2026): NON dichiarare una
     * durata; le pagine usano la formulazione neutra concordata e rimandano alla documentazione
     * Google. `false` = nessuna durata dichiarata. Se in futuro la durata verrà verificata, basta
     * inserirla qui come stringa (es. "14 mesi").
     */
    conservazione: false as Confirmable,
    /** Documentazione ufficiale Google sulla conservazione dei dati (verificata: pagina in italiano). */
    docsConservazioneUrl: "https://support.google.com/analytics/answer/7667196?hl=it",
  },

  /**
   * Link di affiliazione Amazon: verificato il 10 novembre 2026, tutti i 9 link amzn.to del sito
   * rimandano ad Amazon con il tag di affiliazione Associates. La dichiarazione è già presente
   * anche nella pagina Pubblicazioni.
   */
  affiliazioneAmazon:
    "In qualità di Affiliato Amazon, la titolare riceve un guadagno dagli acquisti idonei effettuati tramite i link presenti nella pagina Pubblicazioni, senza costi aggiuntivi per chi acquista." as Confirmable,
} as const;
