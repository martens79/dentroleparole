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
- I dati ancora mancanti sono evidenziati come "DA CONFERMARE" e raccolti in `src/content/legal.ts`. `node scripts/check-legal-placeholders.mjs` elenca cosa manca (oggi 11 punti) e fallisce finché non sono risolti.

## 3. Segnalazioni non legali ma rilevanti
- **Tempi di risposta incoerenti sul sito**: "3-5 giorni" in home, "24–48 ore" in Chi sono e nel menu.
- **Piè di pagina**: contiene le pagine legali solo in home. Per i link a Privacy/Cookie su ogni pagina (indicazione del Garante) serve un piè di pagina minimo su tutte le pagine (modifica di layout, non inclusa).
- **Estratto "gratuito"**: indicato in home; va coerente con le condizioni dei preventivi.

## 4. Domande per la titolare (perché servono)

1. **Indirizzo (domicilio o sede professionale)** — obbligatorio per l'informativa (art. 13 GDPR) e tra le informazioni da rendere accessibili sul sito (art. 7 D.Lgs. 70/2003).
2. **Ha la partita IVA?** Se sì, quale — stesso art. 7 D.Lgs. 70/2003. Se esercita come professionista iscritta a un albo o registro, anche quello.
3. **Per quanto tempo conserva** (a) richieste/estratti quando non nasce un incarico, (b) manoscritti e materiali dopo la fine di un incarico? — è un contenuto obbligatorio dell'informativa. Esempi (da scegliere, non decisi da me): 12 mesi dall'ultimo contatto; 12–24 mesi dopo la consegna.
4. **Quale provider di posta usa** per contatti@dentroleparole.com (Gmail, Aruba, altro)? — è un destinatario dei dati.
5. **Altre persone accedono ai manoscritti** (collaboratori, voci per audiolibri, ecc.)? — destinatari dei dati e riservatezza.
6. **Usa strumenti di intelligenza artificiale sul contenuto dei manoscritti?** — i clienti devono saperlo prima di inviare il testo.
7. **Impostazioni di Google Analytics** (Admin > Impostazioni dati > Conservazione dei dati: 2 o 14 mesi) — vanno scritte nella Cookie Policy.
8. **FormSubmit**: vuole continuare a usarlo? Il fornitore non offre garanzie documentate (vedi sopra) ma i dati inviati includono manoscritti. Alternative tecniche: inviare il modulo dal sito con un servizio email con contratto di trattamento dati (decisione e costi sua, implementazione mia). Se resta, serve almeno sapere se le email arrivano.
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
