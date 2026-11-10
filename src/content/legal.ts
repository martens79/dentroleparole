/**
 * Dati delle pagine legali (Privacy Policy, Cookie Policy, Termini di servizio).
 *
 * Convenzione per i campi che solo la titolare può confermare:
 *   - `null`   = dato ancora da confermare (la pagina mostra un'evidenza "DA CONFERMARE")
 *   - `false`  = non applicabile (la riga viene omessa)
 *   - stringa  = valore confermato, mostrato così com'è
 *
 * Prima della pubblicazione definitiva nessun campo deve restare `null`:
 * `node scripts/check-legal-placeholders.mjs` lo verifica.
 */

type Confirmable = string | null | false;

export const legal = {
  /** Data mostrata come "Ultimo aggiornamento" (da aggiornare alla pubblicazione). */
  updated: "10 novembre 2026",

  titolare: {
    nome: "Donatella Tamburini",
    /** Recapito già pubblicato nel footer e destinatario del modulo di contatto. */
    email: "contatti@dentroleparole.com",
    /** Domicilio o sede professionale (art. 13 GDPR; art. 7 D.Lgs. 70/2003). */
    indirizzo: null as Confirmable,
    /** Partita IVA, se esercita un'attività soggetta a imposta (art. 7 D.Lgs. 70/2003). */
    partitaIva: null as Confirmable,
  },

  /** Decisioni già confermate dalla titolare sul primo contatto (valgono per tutte le pagine). */
  primoContatto: {
    /** Formula ufficiale del tempo di risposta alle richieste iniziali. */
    risposta: "3–5 giorni lavorativi",
    /** Anteprima facoltativa del manoscritto. */
    anteprima: "5–10 cartelle editoriali (circa 1.800 battute ciascuna, spazi inclusi)",
  },

  /** Tempi di conservazione (testo libero, es. "12 mesi dall'ultimo contatto"). */
  retention: {
    /** Richieste, preventivi e anteprime non seguiti da un incarico. */
    richieste: null as Confirmable,
    /** Manoscritti, allegati e materiali di un incarico concluso. */
    materiali: null as Confirmable,
  },

  /** Provider della posta in ingresso del dominio (record MX verificato: 10 mail.register.it). */
  emailProvider: "Register.it" as Confirmable,
  /** Collaboratori o fornitori che possono accedere ai manoscritti. `false` = nessuno. */
  collaboratori: null as Confirmable,
  /** Uso di strumenti di intelligenza artificiale sui manoscritti. `false` = nessuno. */
  strumentiIA: null as Confirmable,

  analytics: {
    /** Conservazione dei dati in Google Analytics (impostazione del suo account: 2 o 14 mesi). */
    conservazione: null as Confirmable,
  },

  /**
   * Link di affiliazione Amazon: verificato il 10 novembre 2026, tutti i 9 link amzn.to del sito
   * rimandano ad Amazon con il tag di affiliazione Associates. La dichiarazione è già presente
   * anche nella pagina Pubblicazioni.
   */
  affiliazioneAmazon:
    "In qualità di Affiliato Amazon, la titolare riceve un guadagno dagli acquisti idonei effettuati tramite i link presenti nella pagina Pubblicazioni, senza costi aggiuntivi per chi acquista." as Confirmable,
} as const;
