# Modifiche suggerite ai testi legali della PR #5 (anteprima facoltativa)

> **Solo proposte.** La PR #5 non è stata toccata (resta Draft all'ultimo commit `2ff630b`). Il lavoro è pensato per essere integrato separatamente. I testi vanno rivisti da un professionista qualificato e **non attestano conformità**.

## Regola di pubblicazione
- **Finché il modulo in produzione usa FormSubmit** (oggi) vale la **Variante A**: l'informativa descrive FormSubmit.
- Il nuovo invio via **SMTP Register.it** va descritto **solo quando sarà effettivamente attivato** (`NEXT_PUBLIC_CONTACT_BACKEND=api` in Production): in quel momento si passa alla **Variante B**, nello stesso rilascio.
- I punti marcati **[COMUNE]** valgono in entrambe le varianti.
- **Nessun tempo di conservazione è stato inventato**: dove manca resta "[DA CONFERMARE]".

Riferimenti: righe della PR #5 `src/app/privacy-policy/page.tsx` e `src/app/termini-di-servizio/page.tsx` all'ultimo commit (`2ff630b`).

---

## 1. Privacy Policy

### 1.1 Introduzione (righe 26-33) — [COMUNE]
**Oggi:** «…si iscrive alla newsletter o invia un estratto o un manoscritto per una valutazione.»
**Proposto:** «…si iscrive alla newsletter o allega un’anteprima del proprio testo per una valutazione.»

### 1.2 Sezione 2, punto «Modulo di contatto» (righe 70-74)
**Oggi:** «…obiettivo del libro, messaggio e un eventuale file allegato (PDF, DOC o DOCX, fino a 8 MB).»
- **Variante A (oggi):** «…obiettivo del libro, messaggio e un’eventuale **anteprima del manoscritto in allegato, facoltativa** (PDF, DOC o DOCX, fino a 8 MB).»
- **Variante B (dopo l'attivazione):** stesso testo con **«fino a 4,4 MB»**.

### 1.3 Sezione 2, paragrafo finale (righe 95-98) — [COMUNE]
**Oggi:** «Gli estratti e i manoscritti possono contenere anche dati di altre persone: vedi il punto successivo.»
**Proposto:** «Le anteprime allegate possono contenere anche dati di altre persone: vedi il punto successivo.»

### 1.4 Sezione 3 — titolo e testo (righe 101-134)
**Titolo oggi:** «3. Estratti, manoscritti e allegati» → **proposto:** «**3. Anteprima del manoscritto e allegati**»

**Primo paragrafo — [COMUNE]**, da sostituire con:
> L’anteprima del manoscritto è **facoltativa**: nel modulo puoi allegare, se lo desideri, le prime 5–10 cartelle editoriali del tuo testo (indicativamente 1.800 battute ciascuna, spazi inclusi) in formato PDF, DOC o DOCX; non è necessario inviare il manoscritto completo. L’anteprima viene utilizzata per valutare la tua richiesta di servizio editoriale e per risponderti e, se affidi l’incarico, per lo svolgimento del lavoro concordato. **Il testo resta di tua proprietà**: non viene pubblicato né utilizzato per finalità estranee alla tua richiesta, né condiviso con editori, agenti o altri soggetti senza il tuo consenso. Se, dopo il primo contatto, fosse utile leggere il manoscritto completo, ti verrà chiesto **separatamente**, con una comunicazione via email.

*(sostituisce il testo attuale «Gli estratti e i manoscritti che invii possono contenere dati personali tuoi e, talvolta, di altre persone… Non vengono pubblicati né condivisi…»; la parte sui dati di altre persone si conserva nel paragrafo successivo.)*

**Secondo paragrafo — [COMUNE]**, ritocco minimo: «Ti chiedo di non inviare, se non strettamente necessario, informazioni su salute, … e di inviare soltanto **anteprime** di testi di cui sei autore o per i quali hai il diritto di farlo. **L’anteprima può contenere dati personali tuoi o di altre persone (ad esempio se il testo si ispira a fatti reali).**»

**Paragrafo sull'intelligenza artificiale — [COMUNE]**: invariato (resta il segnaposto finché la titolare non risponde).

**Ultimo paragrafo (righe 131-134)**, descrizione del percorso dell'allegato:
- **Variante A (oggi):** invariato: «Il file allegato al modulo di contatto viene trasmesso tramite il servizio FormSubmit e recapitato via email alla titolare (vedi il punto sui destinatari).» *(+ vedi 1.7: la titolare riceve i messaggi anche sul proprio Gmail.)*
- **Variante B (dopo l'attivazione):** «Le richieste e gli allegati inviati tramite il modulo vengono ricevuti dal server del sito (ospitato da Vercel, con elaborazione in regione europea), trattati solo in memoria per il tempo necessario all’invio e consegnati via email alla casella contatti@dentroleparole.com, il cui servizio di posta è fornito da Register.it. Il sito non conserva copie dei messaggi né dei file. La titolare riceve i messaggi anche sul proprio account Gmail personale, a cui la casella è inoltrata automaticamente.»

### 1.5 Sezione 5, «Natura del conferimento» (righe 176-186) — [COMUNE]
**Oggi:** «…Gli altri campi del modulo e l’allegato sono facoltativi ma aiutano a formulare un preventivo preciso.»
**Proposto:** «…Gli altri campi del modulo sono facoltativi ma aiutano a formulare un preventivo preciso. **L’anteprima allegata è facoltativa: non è necessario inviare il manoscritto completo.**»

### 1.6 Sezione 6 «A chi vengono comunicati i dati» — voce FormSubmit
- **Variante A (oggi):** invariata (FormSubmit, gestito da Devro LABS: riceve i dati e gli allegati, conserva gli invii 30 giorni e non conserva i file, secondo la sua documentazione).
- **Variante B (dopo l'attivazione):** **eliminare** la voce FormSubmit; la voce **Vercel Inc.** diventa «hosting del sito ed elaborazione in memoria delle richieste inviate dal modulo»; la voce Register.it («provider della posta elettronica in ingresso del dominio») resta con la stessa formulazione prudente.

### 1.7 Sezione 6 — voce da aggiungere **già oggi** (entrambe le varianti)
Il flusso reale prevede l'inoltro automatico verso un account Gmail personale. Aggiungere:
> **Google Ireland Limited** — account Gmail personale della titolare, su cui i messaggi ricevuti vengono inoltrati.

*(La sezione sui trasferimenti continua a rimandare alla verifica delle garanzie di Google: nessuna dichiarazione non verificata.)*

### 1.8 Sezione 7 «Trasferimenti» — Variante B
Eliminare il riferimento a FormSubmit nel segnaposto: «[DA CONFERMARE: sede e garanzie di trasferimento di Google (Analytics) e Brevo…]». In Variante A resta invariata.

### 1.9 Sezione 8 «Conservazione»
- **Variante A (oggi):** invariata (riga «Invii tramite FormSubmit: 30 giorni, secondo quanto dichiara il fornitore; gli allegati non vengono conservati»). Le righe «Richieste, preventivi ed estratti…» e «Manoscritti, allegati e materiali di un incarico» mantengono i **segnaposto** `legal.retention.*`. Ritocco di vocabolario: «…ed **anteprime** non seguiti da un incarico».
- **Variante B (dopo l'attivazione):** eliminare la riga su FormSubmit; aggiungere: «**Messaggi e anteprime ricevuti via email:** nella casella di posta e nell’account Gmail della titolare per **[DA CONFERMARE]**.» *(Non è definito: lo decide la titolare.)*
- Il **manoscritto completo**, se richiesto in seguito, **non rientra in questo modulo**: serve una nota separata (chi lo legge, dove viene conservato, per quanto tempo) quando verrà scelto lo strumento di invio (Gmail o collegamento privato). **Da definire.**

---

## 2. Termini di servizio

### 2.1 Sezione 4 (righe 97-114) — [COMUNE] (cambia solo il limite di dimensione)
**Titolo oggi:** «4. Invio di estratti e manoscritti» → **proposto:** «**4. Invio dell’anteprima del manoscritto**»

**Primo paragrafo, da sostituire con:**
> Il modulo di contatto serve al **primo contatto**. Puoi allegare, se vuoi, un’**anteprima del tuo testo** (indicativamente le prime 5–10 cartelle editoriali, circa 1.800 battute ciascuna, spazi inclusi) in formato PDF, DOC o DOCX: l’allegato è facoltativo e non è necessario inviare il manoscritto completo, che potrà essere richiesto successivamente via email. Se invii un’anteprima dichiari di esserne l’autore o di avere il diritto di inviarla, e sei responsabile del suo contenuto. Il file può pesare al massimo **8 MB** *(Variante A)* / **4,4 MB** *(Variante B)*. I materiali inviati sono trattati in modo riservato e usati solo per valutare la tua richiesta, come descritto nella Privacy Policy.

**Secondo paragrafo:** «La prima lettura **dell’anteprima** e i tempi di risposta indicati sul sito sono forniti a titolo orientativo e senza impegno per le parti.» *(Prima della pubblicazione va risolta l'incoerenza dei tempi di risposta nel sito: «3–5 giorni» nella home, «24–48 ore» in «Chi sono» e nel menu.)*

### 2.2 Sezione 5, secondo paragrafo (righe 125-128) — [COMUNE]
**Oggi:** «Inviando un testo non cedi alcun diritto sul tuo manoscritto. …»
**Proposto:** «Inviando un’anteprima non cedi alcun diritto sul tuo testo, che **resta di tua proprietà** e non viene pubblicato né utilizzato per finalità estranee alla tua richiesta. Per i servizi che prevedono la scrittura di testi, come il ghostwriting, la titolarità dei diritti è regolata nell’accordo relativo all’incarico.» *(La titolare deve confermare che condivide queste affermazioni.)*

### 2.3 Sezione 3 (righe 74-92) — nessuna modifica
Il testo sulla "valutazione completa del manoscritto" come servizio a incarico resta corretto: distingue già l'invio iniziale dall'incarico.

---

## 3. Descrizioni degli allegati in altre parti (fuori dalla PR #5)

| Dove | Stato |
|---|---|
| Modulo (`ContactForm.jsx`, PR #7) | già "Anteprima del manoscritto (facoltativa)", limite 8 MB (FormSubmit) / 4,4 MB (endpoint) |
| Home, menu, «Chi sono», servizi, blog, pagina Grazie (PR #7) | uniformati a «Anteprima facoltativa: 5–10 cartelle editoriali (circa 1.800 battute ciascuna, spazi inclusi)» |
| `docs/contact-form/README.md` §9 (PR #7) | proposta di informativa già allineata; questo documento la sostituisce nel dettaglio (le due varianti) |
| `docs/legal/VERIFICHE_E_DOMANDE_2026-11-09.md` (PR #5, sezione 7-8) | contiene ancora le formule «estratti e manoscritti»; **aggiornare nella stessa integrazione** |
| `src/content/legal.ts` (PR #5) | nessun campo da cambiare; i segnaposto `retention.richieste` e `retention.materiali` vanno riformulati come «richieste e anteprime» e «materiali di un incarico» nelle domande per la titolare |

## 4. Informazioni ancora da confermare (nessuna inventata)
1. Per quanto tempo si conservano richieste e anteprime quando non nasce un incarico, e nelle caselle (Register.it, Gmail) dopo l'attivazione.
2. Come e dove si conserverà un eventuale manoscritto completo richiesto dopo il primo contatto (Gmail o collegamento privato): serve una nota separata.
3. Se la titolare conferma le affermazioni «resta di tua proprietà», «non viene condiviso con editori o agenti senza consenso» e «utilizzato per finalità estranee».
4. Uso di strumenti di intelligenza artificiale sui testi (segnaposto già presente).
5. Il resto dei dati della PR #5 (indirizzo, partita IVA, collaboratori, impostazioni di Google Analytics, link Amazon, consumatori).
