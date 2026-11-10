# Pagine legali — stato, conferme e punti aperti (aggiornato con le decisioni della titolare)

> Documento di lavoro, non pubblicato sul sito. Aggiorna `VERIFICHE_E_DOMANDE_2026-11-09.md` (storico). Non è consulenza legale e non attesta la conformità al GDPR: i testi vanno riletti da un professionista qualificato.

## 1. Stato

Le tre pagine (Privacy Policy, Cookie Policy, Termini di servizio) sono complete e coerenti con il sito reale e con le decisioni della titolare. **Restano 2 dati** prima del merge; i due sono gestiti senza segnaposto sul sito pubblico (la frase relativa è omessa o neutra) e il controllo `node scripts/check-legal-placeholders.mjs` resta in errore finché non vengono risolti:

| Dato | Stato | Dove inserirlo |
|---|---|---|
| **Indirizzo / sede professionale** | non fornito (la titolare lo inserisce privatamente) | `src/content/legal.ts` → `titolare.indirizzo` |
| **Conservazione dei dati in Google Analytics** | non verificabile dal codice: è un'impostazione dell'account | `src/content/legal.ts` → `analytics.conservazione` |

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

## 3. Come inserire privatamente l'indirizzo

1. Sul proprio computer, nella copia del repository sul branch `fix/privacy-cookie-consent-2026`, aprire `src/content/legal.ts`.
2. Trovare il blocco «DA INSERIRE PRIVATAMENTE» e sostituire `indirizzo: null as Confirmable,` con, ad esempio, `indirizzo: "via Esempio 1, 00100 Città (XX)" as Confirmable,` (via, numero civico, CAP, città, provincia).
3. Eseguire `node scripts/check-legal-placeholders.mjs`: senza l'indirizzo e senza il dato di Google Analytics elenca solo questi due punti.
4. Salvare e inviare la modifica (commit e push) sullo stesso branch: la PR si aggiorna da sola. **Non scriverlo in chat né in documenti del repository**: l'unico posto è `legal.ts`.
5. **Attenzione:** una volta pubblicato, l'indirizzo compare **in chiaro** nella Privacy Policy (punto 1) e nei Termini (punto 1). Se è un domicilio privato e non si vuole mostrarlo, la scelta di quale recapito indicare (sede, studio, altro indirizzo valido) va fatta con il consulente prima di inserirlo.

Finché il campo è `null` il sito non mostra alcun indirizzo né segnaposto: la frase «con domicilio o sede professionale in…» semplicemente non compare. Per questo il dato resta **un blocco al merge**: serve all'informativa (art. 13 GDPR) e tra le informazioni da rendere accessibili sul sito (art. 7 D.Lgs. 70/2003).

## 4. Google Analytics: dove verificare la conservazione

Il valore **non è nel codice** (`Analytics.tsx` carica solo `gtag("config", "G-Z8PEVWKQVB")`, senza parametri di conservazione): dipende dalle impostazioni dell'account. Nessuna impostazione è stata toccata.

Percorso (da una persona con accesso all'account, in sola lettura):
1. Aprire analytics.google.com e scegliere l'account e la proprietà GA4 del sito (la proprietà con flusso dati `G-Z8PEVWKQVB`; il codice si controlla in Amministrazione → Flussi di dati).
2. In basso a sinistra: **Amministrazione** (icona ingranaggio).
3. Nella colonna **Proprietà**: **Raccolta e modifica dei dati** → **Conservazione dei dati** (in inglese: *Admin → Property → Data collection and modification → Data retention*; in alcune interfacce la voce è sotto *Data settings*).
4. Leggere **Conservazione dei dati evento**: sono ammessi **2 mesi** o **14 mesi**. Per le nuove proprietà il valore predefinito indicato dalla documentazione Google è 2 mesi, ma va letto sulla proprietà reale.
5. Annotare il valore (e l'impostazione «Reimposta i dati degli utenti a ogni nuova attività», se presente) e inserirlo in `legal.ts` → `analytics.conservazione`, ad esempio `"14 mesi"`. La Cookie Policy diventa «…conservati da Google nell'account del sito per 14 mesi».

Nota: secondo le guide consultate la conservazione riguarda soprattutto le analisi personalizzate («Esplorazioni»), non i report standard aggregati. Le fonti non concordano sull'effetto retroattivo del cambio: non modificare senza una decisione informata. Fonte principale: pagina di assistenza Google «Conservazione dei dati» (support.google.com/analytics/answer/7667196). I nomi esatti delle voci possono variare con l'interfaccia.

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
- Indirizzo da mostrare (vedi §3, punto 5).

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
1. Inserire l'indirizzo (§3) e il dato di Google Analytics (§4); `check-legal-placeholders` deve finire con «nessun segnaposto residuo».
2. Far leggere i testi a un professionista (basi giuridiche, ruoli dei fornitori, trasferimenti, situazione fiscale e clausole verso i consumatori).
3. Impegnarsi a tenere la procedura di conservazione (§7): le promesse della Privacy Policy sono impegni operativi.
4. Aggiornare la data «Ultimo aggiornamento» in `legal.ts`.
5. Ordine con la PR #7: la nota «Inviando la richiesta…» è posizionata in modo che le due PR si fondano senza conflitti; le pagine parlano di «anteprima», il modulo di `main` dice ancora «estratto» finché non entra la PR #7.
6. Fuori da questa PR: link a Privacy e Cookie nel piè di pagina di tutte le pagine (oggi il footer è solo in home).
