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

export const legal = {
  /** Data mostrata come "Ultimo aggiornamento" (da aggiornare alla pubblicazione). */
  updated: "10 novembre 2026",

  titolare: {
    nome: "Donatella Tamburini",
    /** Recapito già pubblicato nel footer e destinatario del modulo di contatto. */
    email: "contatti@dentroleparole.com",

    /**
     * ┌─ DA INSERIRE PRIVATAMENTE ─────────────────────────────────────────────────────────┐
     * │ Domicilio o sede professionale della titolare (art. 13 GDPR; art. 7 D.Lgs. 70/2003). │
     * │ Sostituire `null` con una stringa, ad esempio "via Esempio 1, 00100 Città (XX)", poi │
     * │ eseguire `node scripts/check-legal-placeholders.mjs`.                                │
     * │ Finché è `null` il sito NON mostra alcun indirizzo né segnaposto (la frase viene    │
     * │ semplicemente omessa) e il controllo pre-pubblicazione resta in errore.             │
     * └──────────────────────────────────────────────────────────────────────────────────────┘
     */
    indirizzo: null as Confirmable,

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
     * Conservazione dei dati nell'account Google Analytics. NON verificabile dal codice
     * (è un'impostazione dell'account, non presente nel sito): `null` finché la titolare non la
     * controlla nel pannello (percorso in docs/legal/STATO_E_DOMANDE_2026-11-10.md).
     * La Cookie Policy usa una formulazione neutra finché il valore non è noto.
     */
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
