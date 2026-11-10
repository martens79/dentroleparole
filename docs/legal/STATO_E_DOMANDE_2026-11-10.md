# Pagine legali — stato, conferme e punti aperti (aggiornato con le decisioni della titolare)

> Documento di lavoro, non pubblicato sul sito. Aggiorna `VERIFICHE_E_DOMANDE_2026-11-09.md` (storico). Non è consulenza legale e non attesta la conformità al GDPR: i testi vanno riletti da un professionista qualificato.

## 1. Stato

Le tre pagine (Privacy Policy, Cookie Policy, Termini di servizio) sono tecnicamente complete. **L'unico punto dichiaratamente sospeso è il recapito professionale** (indirizzo): finché non viene completato le pagine legali **non sono complete** e non vanno pubblicate in modo definitivo.

| Punto | Stato |
|---|---|
| **Recapito professionale** | sospeso: in `src/content/legal.ts` vale il segnaposto interno `[RECAPITO PROFESSIONALE DA COMPLETARE]`, che **non compare nelle pagine pubbliche** (restano il nome della titolare e l'email professionale). `node scripts/check-legal-placeholders.mjs` lo segnala come **AVVISO** (exit 0); con `--strict` diventa errore. Non si afferma che l'assenza del recapito sia conforme alle norme: va completato prima della pubblicazione definitiva |
| **Conservazione dati Google Analytics** | deciso: formulazione neutra (nessuna durata dichiarata), con link alla documentazione ufficiale di Google. Nessuna impostazione di Google Analytics è stata toccata |

## 2. Decisioni confermate e come sono state applicate

| Tema | Decisione | Applicazione |
|---|---|---|
| Partita IVA | non ne ha una attualmente | `partitaIva: false` → riga omessa in Privacy e Termini. Nessun numero, forma giuridica o qualifica inventati (vedi §5) |
| Richieste senza incarico | **90 giorni dalla chiusura della richiesta** | Privacy §8; la «chiusura» è definita nel testo (risposta definitiva e nessun incarico avviato) |
| Manoscritti dopo l'incarico | **180 giorni dalla conclusione dell'incarico** | Privacy §8; distinti da contratti, documenti amministrativi e fiscali (termini di legge) |
| Cancellazione | manuale, **non automatica** | scritto esplicitamente in Privacy §8; procedura in `PROCEDURA_CONSERVAZIONE_DATI.md` |
| Collaboratori | nessuno accede ai manoscritti per il lavoro editoriale | Privacy §6: dichiarazione sulle persone, con l'accesso tecnico dei fornitori (modulo, posta, hosting) precisato a parte |
| Intelligenza artificiale | non usata dalla titolare sui manoscritti | Privacy §3 e Termini §6: riferita alla titolare; i sistemi dei fornitori (es. filtri antispam/antivirus della posta) non sono coperti dalla dichiarazione |
| Google Analytics | durata non nota | Cookie Policy §3: i 180 giorni sono la scelta sul dispositivo; i dati Google sono conservati «per il periodo stabilito dalle impostazioni dell'account». Nessun valore inventato |
| Foro competente / recesso / penali | non decisi | Termini §14 ora dice solo «legge italiana» e «restano ferme le norme inderogabili a tutela dei consumatori»; §9 esclude compensi, penali e recesso inventati |

Già confermati in precedenza: anteprima facoltativa di 5–10 cartelle editoriali (circa 1.800 battute, spazi inclusi); manoscritto completo richiedibile dopo; «Rispondo entro 3–5 giorni lavorativi»; testo di proprietà dell'autore; sistema di contatto attuale = FormSubmit (l'SMTP della PR #7 non è descritto come attivo); inoltro verso Gmail personale.

## 3. Come completare il recapito professionale

1. Nella propria copia del repository, sul branch `fix/privacy-cookie-consent-2026`, aprire `src/content/legal.ts`.
2. Sostituire `indirizzo: RECAPITO_PLACEHOLDER as Confirmable,` con il recapito scelto, ad esempio `indirizzo: "…" as Confirmable,`.
3. Eseguire `node scripts/check-legal-placeholders.mjs --strict`: deve finire con «nessun segnaposto residuo».
4. Commit e push sullo stesso branch. **Il repository è pubblico**: il recapito diventa visibile su GitHub dal momento del commit e resta nella cronologia; sul sito compare in chiaro nella Privacy Policy e nei Termini (punto 1). Farlo solo quando si è pronti a pubblicare.

Quale recapito indicare (domicilio, sede, studio) e se sia necessario per la propria situazione senza partita IVA va confermato con un consulente: qui non si afferma che sia obbligatorio né che se ne possa fare a meno.

## 4. Google Analytics: formulazione adottata

Privacy Policy (§8) e Cookie Policy (§3): «I dati raccolti tramite Google Analytics sono trattati e conservati secondo le impostazioni di conservazione configurate per la proprietà Google Analytics e secondo le politiche applicabili di Google. Per maggiori informazioni è possibile consultare la documentazione ufficiale di Google Analytics» (link a support.google.com/analytics/answer/7667196). Non è dichiarata alcuna durata di 2 o 14 mesi. I 180 giorni riguardano solo la scelta sui cookie memorizzata sul dispositivo. Se in futuro la durata verrà verificata nel pannello (Amministrazione → Raccolta e modifica dei dati → Conservazione dei dati), potrà essere inserita in `legal.ts` → `analytics.conservazione`.

## 5. Situazione fiscale: cosa è stato fatto e cosa va chiarito

La titolare ha dichiarato di non avere la partita IVA. Nelle pagine non compare alcun numero, forma giuridica, iscrizione o affermazione sulla regolarità fiscale; nel resto del sito non ci sono riferimenti a partita IVA, ditta o qualifiche (verificato con ricerca nel codice). Non ho cercato dati pubblici sulla titolare.

**Non è stata fatta alcuna valutazione fiscale.** Da chiarire con un consulente fiscale, perché influiscono sui testi:
- se l'attività, così come descritta sul sito (servizi editoriali a pagamento, ripetuti nel tempo), richieda l'apertura della partita IVA o possa essere svolta in altra forma consentita, e con quali documenti si fattura o si rilascia ricevuta; i Termini non indicano nulla in merito;
- il Codice del consumo si applica a chi agisce nell'ambito della propria attività professionale **anche senza partita IVA**: i Termini mantengono quindi la clausola neutra sulle tutele dei consumatori;
- la partita IVA, se in futuro attivata, andrà inserita in `legal.ts` → `titolare.partitaIva` (si mostra in Privacy §1 e Termini §1).

## 6. Dove si trovano le copie dei dati (verifica)

Dettaglio e limiti in `PROCEDURA_CONSERVAZIONE_DATI.md` (§2). In sintesi: **FormSubmit** conserva gli invii 30 giorni (documentazione del fornitore, non verificabile; gli allegati non vengono conservati) → scade prima dei 90 giorni; **Register.it** e **Gmail** sono controllabili dalla titolare (il cestino di Gmail trattiene 30 giorni); **non è noto** se Register conserva una copia dopo l'inoltro, né dove la titolare salva gli allegati sul computer o su servizi cloud/backup. Copie di sicurezza dei fornitori non controllabili possono superare i termini: è dichiarato nella Privacy Policy.

## 7. Procedure manuali per i 90 e 180 giorni

Vedi `PROCEDURA_CONSERVAZIONE_DATI.md`: registro, controllo mensile, cancellazione delle copie, svuotamento dei cestini, gestione delle richieste di cancellazione anticipata. Esito della verifica: **i termini sono rispettabili solo se il registro viene tenuto e il controllo viene fatto**; non esiste automatismo e la Privacy Policy non lo promette.

## 8. Ancora da decidere (non bloccanti)

- **Regola di «chiusura»** di una richiesta quando la persona non risponde più dopo il preventivo (dopo quanto tempo si considera chiusa).
- Dove salva la titolare allegati e copie di lavoro (computer, Drive, Dropbox, iCloud, backup) e se la casella Register conserva una copia dopo l'inoltro.
- Newsletter: link di disiscrizione nelle email? Frequenza? Double opt-in? (vedi §9).
- Come comunica le informazioni precontrattuali e il recesso ai clienti privati; uso di telefono/WhatsApp; cosa si intende per «giorni lavorativi» nei periodi di chiusura.
- Indirizzo da mostrare (vedi §3).

## 9. Newsletter (Brevo): il messaggio non corrisponde al codice

**Verificato nel codice (nessuna modifica):**
- `NewsletterMini.tsx` (footer della home) invia solo l'email a `/api/newsletter`, che chiama `POST /v3/contacts` con `listIds` e `updateEnabled: true`.
- **Nessun double opt-in** (nessuna chiamata a `/v3/contacts/doubleOptinConfirmation`, nessun modello DOI) e **nessuna casella di consenso**.
- Dopo l'iscrizione il sito mostra «…Controlla la tua email per confermare.» Se in Brevo non c'è un'automazione, **nessuna conferma arriverà**: il messaggio è fuorviante (verificabile solo dall'account Brevo; nessuna email di prova inviata). `NewsletterBox.tsx` non è usato.
- Il consenso non è documentato (data, testo accettato, origine): art. 7, par. 1 GDPR.

**Testi corretti proposti (da applicare in una modifica separata):**
- *Senza double opt-in:* «Grazie, l'iscrizione è registrata. Puoi annullarla in qualsiasi momento scrivendo a contatti@dentroleparole.com.» (aggiungere «o dal link in fondo a ogni email» solo dopo aver verificato che le email lo contengano); sotto il modulo: «Iscrivendoti acconsenti a ricevere la newsletter di Dentro le Parole. Informazioni sul trattamento dei dati nella Privacy Policy.»
- *Con double opt-in (consigliato):* mantenere il messaggio attuale dopo aver creato il modello DOI in Brevo e usato l'endpoint di conferma.

## 10. Cosa cambia nei testi quando si attiverà il modulo SMTP (PR #7)

Le pagine descrivono **solo FormSubmit**. All'attivazione (`NEXT_PUBLIC_CONTACT_BACKEND=api`) vanno aggiornati nello stesso rilascio: Privacy §3 (ultimo paragrafo), §6 (FormSubmit e Vercel: oggi «non riceve i dati del modulo»), §7 e §8 (righe FormSubmit); Cookie Policy §5 (primo paragrafo). Il testo proposto è in `docs/contact-form/README.md` §9 della PR #7. Nella procedura di conservazione scompare la riga FormSubmit e compare il passaggio in memoria sul server (nessuna copia). Resta vero l'inoltro verso Gmail personale.

## 11. Prima del merge
1. Completare il recapito professionale (§3); `check-legal-placeholders --strict` deve finire con «nessun segnaposto residuo».
2. Far leggere i testi a un professionista (basi giuridiche, ruoli dei fornitori, trasferimenti, situazione fiscale e clausole verso i consumatori).
3. Impegnarsi a tenere la procedura di conservazione (§7): le promesse della Privacy Policy sono impegni operativi.
4. Aggiornare la data «Ultimo aggiornamento» in `legal.ts`.
5. Ordine con la PR #7: la nota «Inviando la richiesta…» è posizionata in modo che le due PR si fondano senza conflitti; le pagine parlano di «anteprima», il modulo di `main` dice ancora «estratto» finché non entra la PR #7.
6. Fuori da questa PR: link a Privacy e Cookie nel piè di pagina di tutte le pagine (oggi il footer è solo in home).
