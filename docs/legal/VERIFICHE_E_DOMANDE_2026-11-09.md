# Pagine legali — verifiche tecniche, fonti e dati da confermare (9 novembre 2026)

> Documento di lavoro, non pubblicato sul sito. Sostituisce `BOZZA_PAGINE_LEGALI_2026-11-08.md`. Non è consulenza legale e non attesta conformità: i testi vanno rivisti da un professionista qualificato.

## 1. Stato tecnico verificato

### Newsletter (Brevo)
- Il modulo (`NewsletterMini.tsx`) invia solo l'email a `/api/newsletter`, che chiama `POST https://api.brevo.com/v3/contacts` con `listIds` e `updateEnabled: true` (`src/app/api/newsletter/route.ts`).
- **Nessuna casella di consenso specifico**: sotto il modulo c'è solo "Niente spam…" e, in questa PR, un rimando alla Privacy Policy.
- **Nessuna conferma di iscrizione (double opt-in)**: la documentazione Brevo descrive la conferma come endpoint separato (`/v3/contacts/doubleOptinConfirmation`) che richiede un modello di email "DOI" (`templateId`) e un indirizzo di destinazione (`redirectionUrl`); la pagina dell'endpoint "Create a contact" non menziona alcuna email di conferma. Il codice non usa quell'endpoint.
- **Il messaggio mostrato ("Controlla la tua email per confermare") non risulta corretto** rispetto al codice. Resta da verificare se nell'account Brevo esiste un'automazione che invia comunque un'email: questo si controlla solo dall'account (non accessibile e non è stata inviata alcuna email di prova).
- Non viene registrata alcuna prova del consenso (data, testo accettato) oltre a quanto Brevo salva sul contatto.
- Il modulo di contatto rimanda alla Privacy Policy (nota sopra il pulsante "Invia richiesta", in questa PR).

### Modulo di contatto (FormSubmit)
- `action="https://formsubmit.co/contatti@dentroleparole.com"`, invio `multipart/form-data`; campi obbligatori solo nome ed email.
- `_captcha=false` (nessun reCAPTCHA), campo `_honey` anti-spam, redirect a `/grazie`.
- Dalla documentazione di FormSubmit: gli invii sono conservati **30 giorni**, i file allegati **non** vengono conservati, limite totale allegati 10 MB (il sito ne ammette 8), l'email destinataria va attivata alla prima conferma.
- Il fornitore è "Devro LABS". La sua informativa (`formsubmit.co/privacy.pdf`, in vigore dal 17 gennaio 2019) è **molto breve**: nessun riferimento al GDPR, a contratti di nomina a responsabile, a sede legale, a trasferimenti extra-UE o a sub-responsabili. **Questo è il punto più critico**: i manoscritti e i dati dei clienti transitano da un servizio senza garanzie documentate. Vedi la domanda 8.

### Google Analytics 4
- Caricato solo dopo consenso (PR #6, già in produzione e verificata).
- Dalla documentazione Google: cookie `_ga` e `_ga_<ID>` con durata predefinita 2 anni; conservazione dei dati impostabile a 2 o 14 mesi; per utenti SEE "non registra né conserva indirizzi IP".
- Non verificato: l'entità Google contraente per il SEE, lo stato di certificazione al Data Privacy Framework, le impostazioni dell'account (conservazione, segnali Google).

### Hosting (Vercel) e CMS (Sanity)
- Vercel Inc. è la controparte contrattuale, agisce come responsabile per i dati dei clienti; DPA con clausole contrattuali standard; l'informativa di Vercel dichiara l'adesione all'EU-U.S. Data Privacy Framework. Non è documentata una durata esatta di conservazione dei log di rete con IP.
- Sanity: gestisce i contenuti del blog; il browser dei visitatori non lo contatta (le immagini passano dal server del sito).

### Altre verifiche
- Nessun altro tracciamento (nessun pixel, iframe, video, mappa). Font serviti dal sito.
- `Garante – Linee guida cookie 10 giugno 2021`: il rifiuto esplicito non è obbligatorio ma il banner con "Accetta" e "Rifiuta" è coerente; la scelta va rispettata per **almeno 6 mesi** (il sito usa 180 giorni); il collegamento all'informativa dovrebbe essere raggiungibile anche da un link a piè di pagina su ogni pagina (oggi il piè di pagina esiste solo in home: vedi punto 3).
- Garante, provvedimenti del 9 giugno e 7 luglio 2022 su Google Analytics: basati sulla sentenza Schrems II. Dal 10 luglio 2023 esiste la decisione di adeguatezza della Commissione sul Data Privacy Framework. Non ho trovato aggiornamenti successivi del Garante su Google Analytics: va verificato con il consulente.

## 2. Cosa contengono ora le pagine (nel branch della PR #5)
- **Privacy Policy** completa in 12 sezioni (titolare, dati trattati, manoscritti e allegati, basi giuridiche, natura del conferimento, destinatari, trasferimenti, conservazione, diritti, decisioni automatizzate, cookie, aggiornamenti).
- **Cookie Policy** allineata al sistema di consenso della PR #6 (banner, 180 giorni, pulsante permanente, cookie tecnici e analitici, riferimenti normativi).
- **Termini di servizio** che separano l'uso del sito dagli incarichi editoriali (che nascono solo con accettazione scritta del preventivo/accordo).
- I dati ancora mancanti sono evidenziati come "DA CONFERMARE" e raccolti in `src/content/legal.ts`. `node scripts/check-legal-placeholders.mjs` elenca cosa manca (oggi 10 punti) e fallisce finché non sono risolti.

## 3. Segnalazioni non legali ma rilevanti
- **Tempi di risposta incoerenti sul sito**: "3-5 giorni" in home, "24–48 ore" in Chi sono e nel menu.
- **Piè di pagina**: contiene le pagine legali solo in home. Per i link a Privacy/Cookie su ogni pagina (indicazione del Garante) serve un piè di pagina minimo su tutte le pagine (modifica di layout, non inclusa).
- **Estratto "gratuito"**: indicato in home; va coerente con le condizioni dei preventivi.

## 4. Domande per la titolare (perché servono)

1. **Indirizzo (domicilio o sede professionale)** — obbligatorio per l'informativa (art. 13 GDPR) e tra le informazioni da rendere accessibili sul sito (art. 7 D.Lgs. 70/2003).
2. **Ha la partita IVA?** Se sì, quale — stesso art. 7 D.Lgs. 70/2003. Se esercita come professionista iscritta a un albo o registro, anche quello.
3. **Per quanto tempo conserva** (a) richieste/estratti quando non nasce un incarico, (b) manoscritti e materiali dopo la fine di un incarico? — è un contenuto obbligatorio dell'informativa. Esempi (da scegliere, non decisi da me): 12 mesi dall'ultimo contatto; 12–24 mesi dopo la consegna.
4. ~~Quale provider di posta usa~~ — **risolto**: la posta in ingresso di dentroleparole.com è gestita da Register.it (record MX verificato tramite Google DNS: `10 mail.register.it`, confermato dalla titolare il 9 novembre 2026). Nella Privacy Policy è indicato solo come provider della posta in ingresso, senza attribuirgli altri servizi o trattamenti (conservazione, casella di invio, sede, garanzie), non ancora verificati.
5. **Altre persone accedono ai manoscritti** (collaboratori, voci per audiolibri, ecc.)? — destinatari dei dati e riservatezza.
6. **Usa strumenti di intelligenza artificiale sul contenuto dei manoscritti?** — i clienti devono saperlo prima di inviare il testo.
7. **Impostazioni di Google Analytics** (Admin > Impostazioni dati > Conservazione dei dati: 2 o 14 mesi) — vanno scritte nella Cookie Policy.
8. **FormSubmit** e posta: aggiornato dall'audit del 9 novembre — vedi la sezione 7 (flusso reale, alternative, raccomandazione e decisioni aperte).
9. **Newsletter**: (a) quanto spesso scrive e che contenuti; (b) vuole la conferma via email (double opt-in, consigliata) — richiede di creare un modello "DOI" in Brevo e darmi l'ID e la pagina di destinazione; (c) nelle email di Brevo c'è il link per disiscriversi?
10. **I link amzn.to** nella pagina Pubblicazioni sono di affiliazione Amazon? — in tal caso serve la dichiarazione prevista dal programma.
11. **Clienti consumatori** (privati): come fornisce le informazioni precontrattuali e le condizioni di recesso (nel preventivo)? — obbligo del Codice del consumo per contratti a distanza. Se lavora solo con professionisti, lo scrivo diversamente.
12. **Telefono/WhatsApp**: viene richiesto o usato per contattare i clienti? (L'informativa non lo cita più perché il modulo non lo chiede.)
13. **Tempi di risposta**: 24–48 ore o 3–5 giorni? (coerenza del sito)

## 5. Da far verificare a un professionista
Basi giuridiche, elenco destinatari e ruoli (responsabili o autonomi titolari), trasferimenti extra-UE (Google, FormSubmit, Brevo), uso di Google Analytics 4 alla luce dei provvedimenti del Garante del 2022 e del Data Privacy Framework, durata di 180 giorni della scelta sui cookie, clausole dei Termini verso consumatori.

## 6. Fonti consultate
- Garante: Linee guida cookie 10.6.2021 (doc. web 9677876); provv. 9.6.2022 (doc. web 9782890) e 7.7.2022 (doc. web 9806053); pagina trasferimenti di dati all'estero.
- Regolamento (UE) 2016/679 (EUR-Lex); D.Lgs. 196/2003 art. 122; D.Lgs. 70/2003 art. 7; D.Lgs. 206/2005 (Codice del consumo) — testi su Normattiva. Alcuni articoli del Codice del consumo sono stati letti solo in sintesi: da verificare sul testo vigente.
- Brevo: developers.brevo.com (Create a contact; Create DOI contact). Pagine legali Brevo non raggiungibili: sede, hosting e DPA non verificati.
- FormSubmit: formsubmit.co (documentazione, help, privacy.pdf).
- Google: pagine di assistenza Google Analytics (cookie GA4, conservazione dati, privacy). Vercel: DPA e informativa privacy.


---

# 7. Audit del flusso reale: modulo contatti e manoscritti (9 novembre 2026)

> Audit di **sola lettura**: nessun manoscritto o modulo di prova inviato, nessuna modifica al form né a FormSubmit. Dove non è stato possibile verificare un dato è indicato. Non è consulenza legale.

## 7.1 Flusso effettivo (confermato dalla titolare + codice + DNS)

```
Visitatore (browser)
   │  POST multipart direttamente a formsubmit.co  (ContactForm.jsx; allegato PDF/DOC/DOCX, max 8 MB lato sito)
   ▼
FormSubmit (Devro LABS; dietro Cloudflare; sede/origine dei server non dichiarate)
   │  inoltro via email a contatti@dentroleparole.com
   ▼
Register.it (record MX: 10 mail.register.it; server in Italia, datacenter Settimo Milanese)
   │  inoltro automatico
   ▼
Gmail personale gratuito di Donatella (Google Ireland Limited; NON Google Workspace)
```

Il sito stesso (Vercel) **non vede** i dati del modulo: il browser li invia direttamente a FormSubmit. Dopo l'invio il visitatore viene riportato a `/grazie`.

Una stessa email con il manoscritto può quindi esistere in **quattro sistemi** (FormSubmit per 30 giorni, Register.it, Gmail, più eventuali copie locali): più copie significa più superficie di rischio e più conservazione da governare (minimizzazione, art. 5 GDPR).

## 7.2 Esito per fornitore

| Fornitore | Ruolo | Garanzie e accordi trovati | Conservazione | Trasferimenti extra SEE | Giudizio |
|---|---|---|---|---|---|
| **FormSubmit** (Devro LABS) | Trasmette dati e allegati per conto del sito (probabile responsabile, art. 28) | Nessun DPA/nomina a responsabile, nessun riferimento al GDPR, nessuna sede dichiarata. Informativa del 17 gennaio 2019, poche righe. Sito dietro Cloudflare (richiesta servita da Milano, ma l'origine dei server è ignota). Imposta cookie propri (`XSRF-TOKEN`, `formsubmit_session`) sul proprio sito | Invii conservati **30 giorni**; gli allegati "non vengono conservati" (documentazione). Nessuna data di cancellazione verificabile | **Non determinabili**: operatore e sede non dichiarati | **Critico**: dati e manoscritti passano da un soggetto senza garanzie documentate |
| **Register.it** (Register SpA, socio unico Combell NV, Belgio) | Posta in ingresso del dominio; per i contenuti dei clienti agisce come **responsabile** (ODS email, art. 7) | Ruolo di responsabile dichiarato nelle condizioni del servizio email. Il testo della nomina è nelle Condizioni Generali (PDF non leggibile dall'audit: **da verificare**). Server in Italia (Settimo Milanese), backup a Milano, TLS 1.2, antivirus/antispam | Casella a tua cura. Backup giornalieri conservati 6 giorni | Nessuno dichiarato per il servizio email (server italiani) | **Accettabile**, da completare chiedendo la nomina scritta |
| **Gmail personale** (Google Ireland Limited) | Per gli account consumer Google è **titolare autonomo**, non responsabile | **Nessun DPA** per Gmail gratuito: l'addendum sul trattamento dei dati vale per Workspace/Cloud. Per i Termini Google "consumatore" = uso personale e non commerciale. I contenuti sono analizzati (spam, malware, personalizzazione servizi); Google dichiara di non usare Gmail per annunci personalizzati | Finché non cancelli | Il trattamento può avvenire in qualsiasi Paese in cui Google ha sedi; garanzie per account consumer non verificate | **Critico**: ricevere manoscritti di clienti su un account personale è un uso fuori dal perimetro "non commerciale" dei Termini e non ha un contratto di responsabile |
| **Vercel** (sito) | Hosting; non tratta il modulo | DPA con clausole contrattuali standard, adesione al Data Privacy Framework (informativa Vercel). Il DPA è indicato per i piani Enterprise e Pro | Log tecnici | Funzioni di default in USA (iad1) | Non coinvolto nel flusso del modulo oggi |

## 7.3 Criticità GDPR (in ordine di gravità)

1. **Nessun accordo ex art. 28 con FormSubmit** e nessuna informazione su sede, sicurezza e sub-responsabili. I manoscritti possono contenere dati di terzi o dati particolari.
2. **Gmail personale come destinazione dei manoscritti**: nessun DPA, titolarità autonoma di Google, uso commerciale non previsto dai Termini consumer, contenuti analizzati dal fornitore.
3. **Moltiplicazione delle copie e conservazione non governata**: Gmail e la casella Register conservano a tempo indefinito; non c'è una regola di cancellazione.
4. **Informativa incompleta rispetto al flusso reale**: oggi la Privacy Policy nomina FormSubmit ma non cita Google/Gmail come destinatario della posta; la Cookie Policy dice che l'unico servizio terzo che installa cookie è Google Analytics, mentre FormSubmit imposta cookie sul proprio sito (da verificare cosa accade al momento dell'invio, senza inviare nulla).
5. **Trasferimenti extra SEE non dimostrabili** per FormSubmit e non verificati per Gmail personale.
6. **Minori, ma da sistemare**: dall'interrogazione DNS non risulta una politica DMARC (c'è solo SPF `include:spf.webapps.net ~all`); riduce la protezione contro l'invio di email false a nome del dominio.

Punti a favore: il traffico è cifrato (HTTPS verso FormSubmit; TLS 1.2 su Register), FormSubmit dichiara di non conservare gli allegati, il sito non registra i dati del modulo, Register.it ha server in Italia e un ruolo di responsabile dichiarato.

## 7.4 Alternative a confronto

Requisito comune: mantenere il caricamento di allegati e tutelare la riservatezza. "Impegno" = lavoro tecnico stimato.

| # | Soluzione | Costo | Allegati | Riservatezza / GDPR | Svantaggi | Impegno |
|---|---|---|---|---|---|---|
| **A** | **Stato attuale** (FormSubmit → Register → Gmail personale) | 0 € | fino a 8 MB | Debole: due anelli senza accordo (FormSubmit, Gmail) | Vedi criticità 1-5 | — |
| **B** | **Togliere Gmail dalla catena**: niente inoltro automatico, lettura dalla webmail Register o da un client IMAP (la posta resta a Register) | **0 €** | invariato | Migliora molto: resta FormSubmit, ma sparisce l'account consumer | FormSubmit resta senza DPA; la titolare deve usare la webmail/client | 10-30 min, nessun codice (decisione e configurazione della titolare) |
| **C** | **Google Workspace Business Starter** come destinazione, con DPA | ~6,80 €/utente/mese in listino annuale (≈ 82 €/anno; promozioni temporanee, IVA da verificare); 30 GB; email personalizzata inclusa | 25 MB | Gmail con DPA e responsabile | Costo; FormSubmit resta; Gmail continua a essere un'ulteriore copia | 1-2 ore |
| **D** | **Endpoint proprio sul sito + invio SMTP via Register.it**, senza FormSubmit né Gmail | **0 €** (Vercel già in uso; 3 caselle Register incluse con il dominio) | **max ~4 MB per invio** (limite 4,5 MB del corpo richiesta delle funzioni Vercel) | Buona: catena ridotta a Vercel + Register (Italia, responsabile); nessun fornitore sconosciuto | Richiede la dipendenza `nodemailer` (nuova libreria); funzioni Vercel di default in USA → serve impostare la regione `fra1` (modifica di configurazione); invio SMTP da script non esplicitamente previsto da Register (da chiedere); estratti ok, manoscritti completi no | ½-1 giorno |
| **E** | **Upload diretto su storage UE** (Cloudflare R2, giurisdizione UE) + email con solo il link | 0 € entro 10 GB e senza costi di uscita dati; oltre ~0,015 $/GB/mese | Anche file grandi | Ottima: il file non passa da email né da Gmail; scadenza automatica possibile; DPA Cloudflare con clausole standard | Più complessa (URL firmati, CORS, regole di cancellazione); serve un account Cloudflare (carta di pagamento da verificare); un nuovo fornitore | 1-2 giorni |
| **F** | Togliere l'allegato: modulo solo testo, manoscritto richiesto dopo il primo contatto | 0 € | nessuno | Massima semplicità | Non soddisfa il requisito di mantenere il caricamento | ½ giornata |

Non adatte: **Supabase** (piano gratuito 1 GB, regione UE ma progetti sospesi dopo 1 settimana di inattività: poco affidabile per un modulo di contatto); **Vercel Blob** (regioni UE possibili, ma 1 GB gratuito e DPA indicato per i piani Pro/Enterprise); **Brevo transactional** (già usato per la newsletter, ma limiti degli allegati, piano gratuito e DPA **non verificabili** dalle pagine pubbliche consultate).

## 7.5 Raccomandazione

> **Aggiornamento:** la titolare ha deciso di mantenere Gmail e di eliminare FormSubmit. Questa raccomandazione è superata dalla **sezione 8** (proposta implementativa).

**Fase 1 — subito, senza costi né codice: opzione B.** Interrompere l'inoltro verso Gmail personale e leggere la posta dalla webmail di Register.it (o da un client IMAP). In più: chiedere a Register.it la nomina a responsabile del trattamento, verificare limite degli allegati e filtro antispam in ingresso, e decidere cosa fare delle email con manoscritti già presenti in Gmail (conservare, spostare, cancellare). È il passo che riduce di più il rischio al costo più basso.

**Fase 2 — soluzione definitiva, gratuita: opzione D.** Sostituire FormSubmit con un endpoint del sito che inoltra la richiesta via SMTP alla casella Register.it, con un tetto di circa 4 MB per allegato (l'estratto da 5-10 pagine ci sta; per un manoscritto completo si propone un invio dedicato). Ha pochi anelli, tutti europei o con contratto, nessun costo e mantiene il caricamento. Condizioni da verificare prima: (a) Register.it consente l'invio SMTP da script; (b) piano Vercel e regione delle funzioni (`fra1`); (c) disponibilità della nomina da Register.it.

**Fase 3 — solo se servono manoscritti completi dal form: opzione E** (storage UE con scadenza automatica).

L'opzione C (Workspace) è la scelta se la titolare vuole continuare a lavorare dentro Gmail: risolve il contratto con Google ma non elimina FormSubmit e costa circa 82 €/anno.

## 7.6 Decisioni aperte (a cura della titolare / del proprietario del sito)

1. **Inoltro verso Gmail**: interromperlo (opzione B)? Cosa fare delle email con manoscritti già presenti su Gmail?
2. **Direzione**: B + D (consigliata), B + E, C oppure restare con FormSubmit (A) con informativa corretta?
3. **Limite allegati**: va bene ~4 MB nel form (opzione D)? Come gestire i manoscritti completi: invio concordato, link di caricamento, altro?
4. **Register.it**: richiedere (a) la nomina a responsabile del trattamento, (b) conferma che l'invio SMTP da un sito è consentito, (c) il limite reale degli allegati e se il filtro antispam in ingresso è incluso.
5. **Vercel**: quale piano usa il sito (Hobby o Pro)? Autorizzazione a impostare la regione delle funzioni su `fra1` (modifica di configurazione, non fatta).
6. **Nuova dipendenza** (`nodemailer`) per l'opzione D: autorizzata?
7. **Regola di conservazione** per posta e allegati: per quanto tempo si tengono le email con manoscritti, e chi le cancella.
8. **Informativa**: dopo la decisione verranno aggiornate Privacy Policy (flusso reale, destinatari, conservazione) e Cookie Policy (cookie di FormSubmit, se resta). **Non modificate in questo audit.**
9. **DMARC**: aggiungere una politica DMARC al dominio (gestita su Register.it)?

## 7.7 Cosa non è stato verificato
- Sede, origine dei server e sub-responsabili di FormSubmit; esistenza di un DPA non pubblicato.
- Testo della nomina a responsabile di Register.it e sede legale (PDF non leggibili in questo audit); limite effettivo degli allegati per le caselle incluse; conflitti nelle pagine Register sul filtro antispam in ingresso (incluso o a pagamento) e sui limiti di invio SMTP (500 al giorno o 20 gratuiti).
- Cosa fa Gmail personale ai contenuti oltre quanto scritto nei Termini; eventuale revisione umana.
- Se FormSubmit imposta cookie al momento dell'invio (verificato solo sulla pagina iniziale del servizio, non con un invio).
- Limiti degli allegati, piano gratuito e DPA di Brevo (pagine non leggibili senza JavaScript).
- Per leggere le intestazioni di FormSubmit ho eseguito una richiesta OPTIONS (preflight) verso un indirizzo fittizio non valido: nessun dato inviato, nessun invio del modulo.

## 7.8 Fonti principali
- FormSubmit: formsubmit.co, /documentation, /help, /privacy.pdf (17.1.2019).
- Google: Privacy Policy (policies.google.com/privacy, in vigore dal 16.10.2026), Termini (in vigore dal 30.7.2026), Cloud Data Processing Addendum (cloud.google.com/terms/data-processing-addendum), prezzi Workspace (workspace.google.com/intl/it/pricing), limiti allegati (support.google.com/mail/answer/8770).
- Register.it: pagine Email, Email personale, parametri email, ODS email (art. 3, 5, 6, 7, 8), home (ragione sociale).
- Vercel: docs/functions/limitations (limite 4,5 MB), configuring-functions/region, vercel-blob, legal/dpa.
- Cloudflare R2: developers.cloudflare.com/r2/pricing e /reference/data-location; Cloudflare DPA. Supabase: supabase.com/pricing, /regions, /legal/dpa.
- DNS pubblico: MX, SPF e DMARC di dentroleparole.com (interrogazione DNS).


---

# 8. Proposta implementativa: modulo contatti senza FormSubmit (9 novembre 2026)

> **Solo analisi e proposta.** Nessun codice, DNS, credenziale, inoltro o impostazione di produzione è stato modificato. La PR #5 resta Draft. Dove un dato non è stato verificato è scritto.

## 8.0 Decisione ricevuta e conseguenze

- **Gmail personale di Donatella resta** come oggi (inoltro esistente dalla casella Register, invariato). Resta quindi aperto il rischio descritto in 7.2 e 7.3 (nessun accordo sul trattamento dei dati con Google, Termini "uso personale"): non è risolto da questa architettura, va **dichiarato nell'informativa** (vedi 8.6) ed è una scelta consapevole del titolare del sito.
- **FormSubmit viene eliminato**; il caricamento dei manoscritti resta nel modulo.
- Le opzioni B (webmail Register) e D con tetto fisso di 4 MB della sezione 7 sono superate da questa sezione. **Correzione**: le pagine Register non riportano "20 invii gratuiti" ma 50 o 500 invii al giorno a seconda della pagina (vedi 8.1).

Architettura scelta:

```
Modulo esistente (stessa grafica)
   │  POST multipart (fetch) → https://www.dentroleparole.com/api/contatti
   ▼
Route Handler Next.js (runtime Node.js, regione fra1) su Vercel
   │  validazione + antispam; file solo in memoria, mai scritto su disco
   │  SMTP con TLS implicito: authsmtp.securemail.pro:465
   ▼
Casella Register.it (contatti@dentroleparole.com)
   │  inoltro esistente, invariato
   ▼
Gmail personale di Donatella
```

## 8.1 Compatibilità SMTP Register.it con Vercel e credenziali

**Vercel.** Dalla guida ufficiale (kb "serverless functions and SMTP", agg. 29.9.2026): Vercel blocca solo la porta 25; **465 (TLS implicito) e 587 (STARTTLS) sono aperte**; il runtime Node.js supporta SMTP, il runtime Edge no. Con Fluid compute il lavoro in background si ferma dopo la risposta: l'invio va atteso (`await sendMail`) prima di rispondere. → **Tecnicamente compatibile**, runtime Node.js.

**Register.it** (parametri ufficiali): server `authsmtp.securemail.pro`, porta **465 con SSL**, utente = indirizzo completo, password della casella; TLS 1.2 dichiarato (ODS art. 8.8). Nessuna lista di IP consentiti: gli IP dinamici di Vercel non sono un problema, **non serve l'opzione "Static IP" di Vercel (100 $/mese)**.

**Punti non confermati da Register** (da chiedere per iscritto al supporto):
1. L'invio **da un sito/script** non è né permesso né vietato nelle pagine lette; la sola clausola pertinente vieta lo spam e consente la sospensione del servizio. Va chiesta conferma scritta.
2. **Quota giornaliera**: le pagine Register si contraddicono (500 al giorno, ma anche "50 invii gratuiti al giorno" per casella). Ogni destinatario conta come un invio. Per un modulo che invia un solo messaggio a richiesta basta anche 50, ma una raffica di spam la esaurisce e blocca anche le richieste vere → serve un buon antispam (8.3).
3. **Inoltro verso Gmail**: nelle pagine pubbliche non ho trovato come funziona (se resta una copia nella casella, come viene gestito il mittente, controlli SPF/DKIM). Poiché l'inoltro resta invariato, va solo **provato** con un messaggio di test (arrivo in posta in arrivo o spam, allegato integro).
4. **Antispam/antivirus in ingresso**: le pagine non concordano (incluso per le 3 caselle o solo in uscita). Quello in uscita non è disattivabile e può bloccare un messaggio: va provato con i tipi di file ammessi.

**Mittente consigliato.** Usare una casella **dedicata solo all'invio** (es. `form@dentroleparole.com`), non quella personale di Donatella: Register include 3 caselle con il dominio (le caselle aggiuntive hanno un costo non verificato). Il messaggio parte da `form@` verso `contatti@`; l'email del visitatore va in **Reply-To**, così Donatella risponde dal suo Gmail come oggi. SPF del dominio (`include:spf.webapps.net`) è quello indicato da Register per i suoi invii SMTP. In più: attivare **DKIM** dal pannello (Email > Azioni > DKIM) e una politica **DMARC** iniziale `p=none` con report (modifica DNS: la fa il proprietario, non io).

**Credenziali.** Variabili d'ambiente di Vercel di tipo **Secret** (in sola scrittura dopo il salvataggio; valore mai in repository, mai con prefisso `NEXT_PUBLIC_`), ambiti separati per Production e Preview (in Preview una casella di prova). Variabili: host, porta, utente, password, destinatario, mittente. Password lunga e casuale, cambiata se emerge un sospetto di fuga. Nel codice: nessun log di credenziali né di contenuto del messaggio.

## 8.2 Dimensione massima reale degli allegati

Non si usa un valore arbitrario: è il minore tra più limiti reali.

| Vincolo | Valore | Fonte |
|---|---|---|
| **Corpo della richiesta a una funzione Vercel** | **4,5 MB**, rifiuto automatico con errore 413 prima che il codice giri | docs Vercel, limiti delle funzioni |
| Overhead multipart e campi di testo | circa 10-20 KB (+ messaggio) | indicazione della documentazione Next.js (Server Actions) |
| Messaggio Register (allegati compresi) | 30 MB | pagina di confronto Register |
| Ricezione Gmail | 25 MB | Google |
| Memoria della funzione | 2 GB | docs Vercel |

Il limite che comanda è quello di Vercel: **la dimensione utile del file è poco sotto 4,5 MB**. Il valore preciso (4,5 MB decimali o binari, e il comportamento con il multipart) **non è documentato**: va **misurato** su una preview con file di prova di dimensione crescente, e il limite del modulo impostato un po' sotto la soglia misurata. Il controllo va fatto sia nel browser (messaggio chiaro) sia sul server.

Cosa significa in pratica (stima, non misura): un romanzo in DOCX solo testo pesa in genere da poche centinaia di KB a pochi MB, quindi **rientra**; i PDF con molte immagini o scansioni possono superare il limite.

**Oltre il limite** non c'è modo di restare nell'architettura richiesta senza archiviare il file: la soluzione tecnica ufficiale di Vercel è il caricamento diretto dal browser su Vercel Blob, che però **conserva il file** (da cancellare dopo l'invio) e cambia la privacy. Proposta: **non farlo ora**; per manoscritti più grandi indicare nel modulo "scrivimi e concordiamo l'invio". Valutare Blob solo se emerge la necessità reale.

## 8.3 Sicurezza degli upload, antispam e rate limiting

**Validazione server-side** (il controllo del browser non basta, resta solo per l'esperienza d'uso):
- Solo POST, solo `multipart/form-data`, controllo `Origin`/`Host` del sito.
- Campi: nome ed email obbligatori (formato e lunghezza), tutti gli altri con tetti di lunghezza; rifiuto di caratteri di controllo (**iniezione di intestazioni email** con a capo nei campi usati in `Reply-To` o oggetto); testo del messaggio inserito nel corpo come testo semplice, mai come HTML non filtrato.
- **Un solo file**, estensione ammessa (lista consentita: `.pdf`, `.docx`, e `.doc` solo se la titolare lo vuole mantenere), **una sola estensione** (rifiuto di `nome.pdf.exe`, byte nulli, caratteri di percorso).
- **Verifica del contenuto** oltre al tipo dichiarato (il tipo MIME inviato dal browser si può falsificare): firma `%PDF-` per PDF; per DOCX firma ZIP `PK\x03\x04` più lettura dell'elenco interno dei file con voci `[Content_Types].xml` e `word/document.xml`, **senza decomprimere** (nessun rischio di zip-bomb); per DOC firma OLE2 `D0 CF 11 E0 A1 B1 1A E1`. La sola firma non basta (lo dice anche OWASP): serve come filtro, non come garanzia.
- **Contenuto attivo**: rifiuto dei DOCX con `vbaProject.bin` (macro); per i PDF, segnalazione nell'oggetto dell'email se compaiono marcatori come `/JavaScript` o `/Launch` (scelta: segnalare o rifiutare).
- Nome file riscritto: senza percorso, solo caratteri sicuri, lunghezza massima, estensione coerente col tipo verificato.
- **Antivirus**: su Vercel non è praticabile una scansione. Resta come protezione la verifica dei tipi, l'antivirus di Register (se attivo in ingresso, da confermare) e la scansione di Gmail. **È un rischio residuo, non diverso da oggi**, e va dichiarato.

**Antispam senza nuovi fornitori.**
1. Campo trappola nascosto (honeypot) e **token firmato con orario** (rifiuto se troppo veloce o troppo vecchio).
2. **Rate limiting della piattaforma** (Vercel WAF): disponibile su tutti i piani; Pro permette 40 regole, finestre da 10 secondi a 10 minuti, chiave per IP e impronta JA4. Regola proposta sul percorso `/api/contatti`, solo POST, con soglia bassa per IP (da tarare). Serve perché le funzioni non hanno memoria condivisa e un contatore "fatto in casa" non è affidabile. È una **modifica di configurazione Vercel: va autorizzata**.
3. **Vercel BotID** (Basic gratuito su tutti i piani; Deep Analysis a pagamento: 1 $ ogni 1000 verifiche sul piano Pro). Da decidere se usarlo; il costo è trascurabile ma **cresce con i tentativi dei bot**, quindi va dietro al rate limiting.
4. **Cloudflare Turnstile** (gratuito) solo come ripiego se lo spam persiste: aggiunge uno script di un terzo, con aggiornamento di Cookie Policy e Privacy Policy.
5. Messaggio di errore sempre generico; **nessun contenuto del modulo nei log**; in caso di guasto SMTP il visitatore vede un avviso con l'indirizzo email di contatto come alternativa.

## 8.4 Funzioni Vercel: limiti, memoria, conservazione

- **Runtime Node.js** (non Edge); memoria predefinita 2 GB, durata fino a 300 s con Fluid compute (sufficiente).
- Il file viene letto in memoria (`request.formData()`), inoltrato e scartato: **nessuna scrittura su disco** e nessun archivio. Non è documentato come Vercel gestisca la memoria del multipart: con file da pochi MB su 2 GB non è un problema pratico, ma si verifica nella prova di carico.
- Le istanze possono essere riutilizzate tra richieste: il codice non deve mantenere dati dei visitatori in variabili globali.
- I log di Vercel non devono contenere nome, email, testo o nome del file.
- **Regione**: il default per i nuovi progetti è `iad1` (Washington). Per tenere l'elaborazione in UE impostare `fra1` (impostazione del progetto o `vercel.json`; Pro permette fino a 5 regioni). **Modifica di configurazione: da autorizzare.** Anche con `fra1`, Vercel Inc. è un fornitore statunitense: restano il contratto con clausole contrattuali standard e l'adesione al Data Privacy Framework dichiarati da Vercel.
- **Piano effettivo verificato (9 novembre 2026, dashboard, sola lettura):** il team ha il piano **Pro**, attivo (periodo 25 ottobre - 25 novembre 2026, credito incluso usato 11,65 $ su 20 $, budget di spesa 200 $). Quindi: uso commerciale consentito, accordo sul trattamento dei dati di Vercel applicabile, regole WAF fino a 40, fino a 5 regioni. Impostazioni del progetto `dentroleparole`: **Fluid compute attivo**, CPU "Standard" (2 GB), **regione delle funzioni attuale `iad1` (Washington)**: per l'UE va portata a `fra1` (modifica da autorizzare; vale per i nuovi deployment). Firewall: nessun avviso, nessuna azione persistente; non ho aperto l'elenco delle regole personalizzate.

## 8.5 Costi aggiuntivi reali

| Voce | Costo |
|---|---|
| Vercel Pro (già pagato) | 20 $/mese, invariato |
| Funzioni, banda, rate limiting WAF | nessun costo aggiuntivo atteso a questi volumi (il prezzo per richiesta del rate limiting non è pubblicato nelle pagine lette) |
| BotID Deep Analysis (opzionale) | 1 $ ogni 1000 verifiche; a poche centinaia di invii al mese pochi centesimi, ma cresce con i bot |
| Static IP Vercel | **non necessario** (100 $/mese evitati) |
| Register.it: casella di invio dedicata | compresa se si usa una delle 3 caselle incluse; costo di caselle addizionali non verificato |
| Register.it: invii SMTP aggiuntivi | non necessari (3,14 €/mese per +1000 al giorno) |
| Cloudflare Turnstile | 0 € (solo se serve) |
| Libreria `nodemailer` | 0 € (licenza libera, senza dipendenze); **nuova dipendenza da autorizzare** |
| Sviluppo e test | stima 1,5-2 giorni (endpoint, validazioni, test, integrazione nel modulo, informativa) |

Costo ricorrente aggiuntivo atteso: **0 €**; caso peggiore realistico: pochi euro al mese se si adotta BotID in presenza di molti bot.

## 8.6 Privacy Policy e Cookie Policy: testo proposto (non applicato)

Da pubblicare **solo al passaggio in produzione**, perché fino ad allora FormSubmit resta in uso. Wording da rivedere con un professionista.

*Sezione 3 (manoscritti e allegati)*: «Le richieste e gli allegati inviati tramite il modulo vengono ricevuti dal server del sito (ospitato da Vercel), elaborati solo in memoria per il tempo necessario all'invio e consegnati via email alla casella contatti@dentroleparole.com, il cui servizio di posta è fornito da Register.it. Il sito non conserva copie dei messaggi né dei file. La titolare riceve i messaggi anche sul proprio account Gmail personale, a cui la casella è inoltrata automaticamente.»

*Sezione 6 (destinatari)*: eliminare FormSubmit; indicare **Register.it** (posta elettronica del dominio), **Google Ireland Limited** (account Gmail personale della titolare su cui vengono inoltrati i messaggi) e **Vercel** (hosting ed elaborazione della richiesta, regione UE se confermata).

*Sezione 7 (trasferimenti)*: eliminare FormSubmit; mantenere Vercel (clausole contrattuali standard / Data Privacy Framework dichiarati dal fornitore) e Google (da verificare).

*Sezione 8 (conservazione)*: eliminare la riga su FormSubmit; aggiungere «Messaggi e allegati: nella casella di posta e nell'account Gmail della titolare per [DA CONFERMARE] mesi». **Resta da definire**.

*Cookie Policy*: eliminare i riferimenti a FormSubmit (che oggi imposta cookie sul proprio sito); aggiungere Turnstile solo se adottato.

**Punto da non nascondere**: finché i manoscritti arrivano su un Gmail personale, la Privacy Policy deve dirlo (come sopra) e restano valide le criticità 2 e 3 di 7.3. L'alternativa (Workspace, circa 82 €/anno) è disponibile quando si vorrà.

## 8.7 Piano di test, migrazione e rollback (senza interrompere il modulo attuale)

**Principio**: il modulo con FormSubmit resta attivo finché il nuovo non è provato; il passaggio è un interruttore, non una sostituzione.

1. **Prerequisiti (azioni del proprietario, nessun mio intervento)**: verificare il piano Vercel; scrivere a Register.it (conferma invio da sito, quota reale, antispam in ingresso, nomina a responsabile); creare la casella `form@`; attivare DKIM e DMARC `p=none`.
2. **Implementazione in una PR nuova** (non la #5), con l'endpoint `/api/contatti` accanto al modulo esistente e un **interruttore** (variabile pubblica `NEXT_PUBLIC_CONTACT_BACKEND`, predefinito `formsubmit`). Senza modifiche al codice FormSubmit finché non serve.
3. **Prova in Preview** con variabili di Preview (casella di prova come destinatario) e solo **file sintetici**, mai manoscritti veri. Matrice di test:
   - esito: PDF, DOCX, DOC; file alla soglia misurata e appena sopra (verifica 413 e messaggio nel browser); integrità dell'allegato (confronto con l'hash);
   - rifiuti: estensione non ammessa, doppia estensione, testo rinominato `.pdf`, DOCX con macro, file vuoto, due file;
   - campi: email non valida, nome vuoto, campi troppo lunghi, a capo nei campi (iniezione intestazioni), caratteri non ASCII nel nome file;
   - antispam: honeypot compilato, invio troppo rapido, token scaduto, superamento del rate limit;
   - guasto: password SMTP errata (in Preview) → messaggio generico + email alternativa, nessun dato nei log;
   - recapito: arrivo su Register e poi su **Gmail** (posta in arrivo o spam, allegato apribile);
   - esperienza: stesso aspetto del modulo, mobile, e funzionamento senza JavaScript (reindirizzamento a `/grazie`).
   - Test automatici dei soli validatori con `node --test` (nessuna dipendenza di test nuova).
4. **Messa in produzione con interruttore su `api`** solo dopo la tua autorizzazione, insieme al nuovo testo di Privacy e Cookie Policy. Primo invio reale concordato con la titolare. Osservare i log di Vercel e la casella per 48 ore.
5. **Rollback immediato**: *Instant Rollback* di Vercel al deployment precedente (nessun codice), oppure interruttore su `formsubmit` con nuovo deploy (circa 40 secondi), oppure revert del merge. FormSubmit resta nel codice finché il nuovo flusso non è stabile.
6. **Pulizia (PR separata, dopo almeno una settimana di funzionamento)**: rimuovere FormSubmit e l'interruttore, aggiornare la documentazione.

## 8.8 Rischi e limiti (riepilogo)

| Rischio / limite | Gravità | Mitigazione |
|---|---|---|
| Limite di 4,5 MB per richiesta: PDF grandi non passano | Media | Misura reale, messaggio chiaro, invio concordato; Blob solo se necessario |
| Register non conferma l'invio da script, quota ambigua (50 o 500 al giorno) | Alta se negata | Conferma scritta prima di iniziare; alternativa solo in quel caso (8.9) |
| Esaurimento della quota da spam → richieste vere bloccate | Media | Honeypot, token, rate limiting WAF, avviso con email alternativa |
| Messaggio bloccato dall'antispam in uscita di Register | Media | Prova con i tipi ammessi; segnalazione a Register |
| Recapito su Gmail tramite inoltro (spam, mittente) | Media | Prova; DKIM e DMARC; Reply-To |
| Nessuna scansione antivirus dei file | Media | Tipi ammessi, no macro, antivirus Register/Gmail; rischio dichiarato |
| Gmail personale senza accordo sul trattamento dei dati | **Alta** (decisione consapevole) | Dichiarazione in informativa; Workspace come opzione futura |
| Piano Vercel | — | **Risolto**: Pro (verificato in dashboard) |
| Credenziali SMTP esposte | Alta | Variabili Secret, casella dedicata, nessun log, rotazione |
| Regione di elaborazione predefinita USA | Media | Regione `fra1` (da autorizzare); clausole standard di Vercel |

## 8.9 Alternative (solo se emerge un impedimento concreto)

Nessun impedimento tecnico è emerso: Vercel permette SMTP sulla 465 e Register offre il server SMTP. L'unico punto aperto è **la conferma di Register all'invio da script**. Solo se Register la negasse: (a) servizio di posta transazionale europeo con contratto sul trattamento dei dati, da valutare e verificare (Brevo è già usato per la newsletter, ma le pagine pubbliche consultate non permettono di verificare limite degli allegati, piano gratuito e accordo); (b) caricamento diretto su storage in UE (Cloudflare R2, vedi 7.4, opzione E) se servono file più grandi di quanto Vercel consenta.

## 8.10 Decisioni e autorizzazioni da darmi

1. ~~Piano Vercel~~ — **verificato: Pro** (vedi 8.4). Resta da autorizzare la regione `fra1`.
2. Autorizzi la modifica della **regione delle funzioni** a `fra1` e la regola di **rate limiting WAF** (configurazioni Vercel, da fare solo dopo il tuo via)?
3. Chi scrive a **Register.it** (invio da sito, quota, antispam in ingresso, nomina a responsabile) e chi crea la casella `form@` e attiva DKIM/DMARC (DNS)?
4. Antispam: honeypot + token + rate limiting (consigliato); aggiungere BotID? Turnstile solo come ripiego?
5. Tipi di file: mantenere `.doc` oltre a `.pdf` e `.docx`? Per i PDF con contenuto attivo: segnalare o rifiutare?
6. Autorizzi la nuova dipendenza `nodemailer`?
7. Autorizzi l'implementazione in una **nuova PR** (non la #5), con interruttore, senza merge né deploy?
8. Autorizzi i **messaggi di prova** (solo file sintetici) alla casella di prova e, per la prova di recapito, a `contatti@` e quindi al Gmail di Donatella?
9. Approvi il testo di informativa proposto in 8.6, da far rivedere a un professionista, e la scelta consapevole di mantenere Gmail personale?
10. Tempo di conservazione di email e allegati (casella Register e Gmail).

## 8.11 Fonti e verifiche
- Vercel: docs/functions/limitations (4,5 MB, memoria, durata), kb/guide/serverless-functions-and-smtp, docs/vercel-firewall/vercel-waf/rate-limiting, docs/botid, docs/environment-variables (Secret/Config), docs/networking/static-ips, docs/limits/fair-use-guidelines, docs/functions/configuring-functions/region.
- Register.it: parametri email, ODS Email (art. 3, 5, 6, 8), ODS invii aggiuntivi, pagine di assistenza su invii SMTP inclusi, SPF/DKIM/DMARC, pagina di confronto (30 MB, 100 destinatari).
- Next.js: documentazione dei Route Handler e dei limiti del corpo (1 MB predefinito per le Server Actions; nessun limite documentato per i Route Handler). OWASP: File Upload Cheat Sheet. Firme dei file: elenco delle firme (PDF, ZIP, OLE2).
- Nodemailer: homepage (zero dipendenze, TLS/STARTTLS; Node 20 o successivo per la v10). Pagine su opzioni SMTP e allegati non raggiungibili: **opzioni di TLS e invio di allegati da memoria da verificare nei test**.
- Cloudflare Turnstile: gratuito, token valido 300 s, uso singolo, verifica lato server; uso di cookie e archiviazione locale non documentato.
- **Non verificato**: invio da script ammesso da Register; funzionamento dell'inoltro verso Gmail; comportamento esatto del limite 4,5 MB con multipart; gestione della memoria del multipart; nessun test eseguito.
