# Modulo contatti: endpoint server-side al posto di FormSubmit

> **Stato: bozza in PR Draft. Non in produzione.** Il modulo continua a usare FormSubmit finché l'interruttore `NEXT_PUBLIC_CONTACT_BACKEND` non viene portato a `api`. Nessuna credenziale reale è stata inserita, nessuna email reale è stata inviata, nessuna impostazione globale di Vercel è stata modificata.

**Documenti collegati:** [GUIDA_CONFIGURAZIONE.md](GUIDA_CONFIGURAZIONE.md) (casella Register.it e variabili Vercel, passo per passo), [RICHIESTA_ASSISTENZA_REGISTER.md](RICHIESTA_ASSISTENZA_REGISTER.md) (bozza di messaggio, non inviata), [COLLAUDO.md](COLLAUDO.md) (piano di collaudo e registro).

## 1. Flusso

```
Browser: stesso modulo di oggi (stessi campi, stessa grafica)
   │  POST multipart (fetch) → /api/contatti
   ▼
Route Handler Next.js, runtime Node.js, regione fra1 (Vercel)
   │  validazione, antispam, rate limiting; il file resta in memoria, mai su disco
   │  SMTP: authsmtp.securemail.pro:465, TLS implicito verificato
   ▼
Casella Register.it (contatti@dentroleparole.com)
   │  inoltro esistente verso Gmail: NON modificato
   ▼
Gmail personale di Donatella
```

Il mittente tecnico è una casella dedicata (es. `form@dentroleparole.com`, da creare). L'email del visitatore è in **Reply-To**: Donatella risponde dal proprio Gmail come oggi. L'oggetto è identico a quello usato con FormSubmit ("Nuova richiesta dal sito Dentro le Parole"); se l'allegato presenta elementi sospetti viene anteposto "[ATTENZIONE: allegato da verificare]".

## 1b. Anteprima facoltativa del manoscritto (testi del modulo)

Il modulo serve per il **primo approccio** tra autore e professionista: l'autore non invia il manoscritto completo dal sito. Se serve, Donatella lo richiede dopo, via email (Gmail) o con un collegamento privato. **Non è stato introdotto alcun servizio di archiviazione o caricamento file.**

**Testi mostrati nel riquadro dell'allegato** (uguali nelle due modalità, `src/components/ContactForm.jsx`):

| Elemento | Testo |
|---|---|
| Titolo | **Anteprima del manoscritto (facoltativa)** |
| Accompagnamento | Allega, se desideri, le prime 5–10 cartelle editoriali del tuo testo in formato PDF, DOC o DOCX. Non è necessario inviare il manoscritto completo: potremo concordarne l’invio successivamente via email. |
| Definizione | Una cartella editoriale corrisponde indicativamente a 1.800 battute, spazi inclusi. |
| Dimensione | Max 4,4 MB. (con l'endpoint) — Max 8 MB. (con FormSubmit, invariato) |
| Pulsante | Allega anteprima *(prima: "Carica estratto")* |

Sostituiscono il titolo "Estratto (PDF, DOC, DOCX)". Il consiglio delle 5–10 cartelle è **indicativo**: il codice non conta pagine, cartelle, battute o parole del file. L'unico limite sul file è la dimensione (e il formato). Se l'autore non allega nulla il modulo funziona normalmente (campo facoltativo, nessun `required`). Tutti i campi restano: nome, email, titolo, genere, numero di parole, obiettivo del libro, messaggio, allegato. *Nota: nel modulo attuale non esiste un campo "tipo di servizio richiesto": il campo equivalente è il menu "Obiettivo del libro" (Invio a case editrici / Self publishing / Ancora da decidere), lasciato invariato.*

**Differenze tra le due modalità (da conoscere):**

| | FormSubmit (predefinita) | Endpoint SMTP (`api`) |
|---|---|---|
| Testi dell'anteprima | uguali | uguali |
| Dimensione massima del file | **8 MB** (limite del modulo attuale; FormSubmit dichiara 10 MB totali) | **4,4 MB** (limite di Vercel, misurato) |
| Controllo del formato PDF/DOC/DOCX | solo nel browser (tipo dichiarato dal browser) | browser **e server** (estensione, contenuto reale, macro) |
| Protezioni sugli allegati, antispam, rate limiting | quelle di FormSubmit (campo trappola `_honey`) | del nuovo endpoint |
| Dove passa il file | FormSubmit → Register.it → Gmail | sito (solo memoria) → Register.it → Gmail |

La differenza di limite (8 MB contro 4,4 MB) è voluta: **non si è ridotto il limite di FormSubmit** per non cambiarne il funzionamento. Il testo "Max N MB." mostra sempre il limite della modalità attiva. Al passaggio all'endpoint il limite scende a 4,4 MB; per 5–10 cartelle (circa 9.000–18.000 battute) è ampiamente sufficiente.

## 2. Interruttore e rollback

| Variabile | Valore | Effetto |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_BACKEND` | `formsubmit` oppure assente | Flusso attuale, invariato (limite file 8 MB, FormSubmit) |
| | `api` | Nuovo endpoint `/api/contatti` (limite file 4,4 MB) |

La variabile è letta **in fase di build**: cambiarla richiede un nuovo deploy.

**Rollback rapido, in ordine di velocità:**
1. *Instant Rollback* di Vercel al deployment precedente (nessun codice, pochi secondi);
2. riportare la variabile a `formsubmit` e rifare il deploy (circa 40 secondi);
3. revert del merge.

FormSubmit resta nel codice, invariato, finché il nuovo flusso non è stabile.

## 3. Variabili d'ambiente

Si impostano su Vercel (Settings > Environment Variables), **mai nel repository** (vedi `.env.example`, che contiene solo i nomi).

| Nome | Tipo consigliato | Note |
|---|---|---|
| `SMTP_USER` | Config | indirizzo completo della casella che invia |
| `SMTP_PASS` | **Secret** | password della casella (in sola scrittura dopo il salvataggio) |
| `CONTACT_FORM_SECRET` | **Secret** | almeno 32 caratteri casuali; firma i token antispam |
| `SMTP_HOST` | facoltativa | predefinito `authsmtp.securemail.pro` |
| `SMTP_PORT` | facoltativa | predefinito `465` |
| `CONTACT_TO` | facoltativa | predefinito `contatti@dentroleparole.com` |
| `CONTACT_FROM` | facoltativa | predefinito = `SMTP_USER` |
| `CONTACT_RATE_IP_MAX` / `CONTACT_RATE_IP_WINDOW_SEC` / `CONTACT_RATE_INSTANCE_MAX` | facoltative, **solo per il collaudo** | allargano i limiti entro intervalli fissi (1-100, 60-3600 s, 1-1000); fuori intervallo si torna ai predefiniti (3 richieste / 10 minuti per IP, 40 all'ora per istanza). In produzione vanno lasciate assenti |
| `SMTP_ALLOW_PLAINTEXT_LOOPBACK` | **solo sviluppo locale** | `true` consente il collegamento in chiaro soltanto verso `127.0.0.1`/`localhost` e viene ignorata su Vercel e verso qualunque host reale (coperta da test) |

Ambiti: impostare prima **Preview** (con una casella di prova), poi Production. Senza `SMTP_USER`, `SMTP_PASS` e `CONTACT_FORM_SECRET` l'endpoint risponde 503 e non invia nulla.

## 4. Limiti effettivi (verificati, non promessi)

### Vercel
| Limite | Valore | Come è stato ottenuto |
|---|---|---|
| Corpo massimo della richiesta | **4.493.210 byte** accettati, **4.493.211 rifiutati** (413 `FUNCTION_PAYLOAD_TOO_LARGE`) | **Misurato** il 9 novembre 2026 su una Preview del progetto (piano Pro, funzione in fra1) con ricerca binaria; la documentazione parla di "4,5 MB" |
| Intestazione multipart | 380 byte per un modulo minimo | misurato; caso peggiore del modulo completo ~24.500 byte (messaggio da 5.000 caratteri a 4 byte), margine impostato a 32.000 |
| **Dimensione massima del file** | **4.461.210 byte (mostrati come "4,4 MB")** | 4.493.210 − 32.000 |
| Regione della funzione | **fra1** | verificato: la funzione è girata in fra1 e il rifiuto 413 riporta `fra1`; impostata **solo per questa funzione** in `vercel.json` (`functions`). `preferredRegion` di Next.js è deprecato e **non ha effetto** sul runtime Node.js (verificato: la funzione girava in iad1) |
| Memoria / durata | 2 GB, `maxDuration` 30 s | impostazioni del progetto / codice |
| Runtime | Node.js 24 (Preview) | SMTP non è supportato dal runtime Edge |

**Non è supportato** inviare file oltre 4,4 MB dal modulo: il rifiuto avviene prima del codice. Il modulo lo impedisce nel browser con un messaggio chiaro. Per manoscritti più grandi: invio concordato per email, oppure una futura estensione con storage UE (non inclusa). La soglia va **rimisurata** a ogni cambio di piano o di runtime (vedi §7).

### SMTP Register.it
| Dato | Valore | Fonte |
|---|---|---|
| Host, porta | `authsmtp.securemail.pro`, 465 (TLS implicito) | parametri ufficiali Register.it |
| Raggiungibilità da Vercel | **sì**: connessione e saluto SMTP (`220 … ESMTP server ready`) in **43 ms** da fra1 | prova dalla Preview, senza credenziali |
| TLS | **verifica del certificato riuscita da Vercel**: TLS 1.3, catena Sectigo → USERTrust valida, il certificato copre `*.securemail.pro` | prova dalla Preview (con verifica attiva) |
| Autenticazione | `AUTH LOGIN PLAIN` (solo dopo TLS) | risposta EHLO del server |
| Dimensione dichiarata dal server | `SIZE 2000000000` (2 GB) | EHLO: non è un limite operativo |
| Dimensione massima del messaggio | **30 MB, allegati compresi** (non distinta per direzione) | pagina di confronto di Register.it |
| Destinatari per messaggio | 100 | stessa pagina |
| Invii giornalieri | **contraddittori nelle pagine ufficiali**: 500 al giorno per le caselle Personal (articolo *Invii SMTP da client consentiti*) contro 50 per casella (articolo *Aumenta i limiti di invio*, che dice anche che oltre il limite "l'SMTP si blocca"; nessun codice d'errore né orario di ripristino indicati). Ogni destinatario conta come un invio | **da chiedere al supporto** |
| Limiti per minuto/ora, connessioni, blocco dopo autenticazioni errate | non indicati | da chiedere |
| Invio da sito/script/applicazione | **non trattato** (né permesso né vietato); le condizioni vietano solo lo spam | da chiedere |
| Inoltro verso Gmail | **nessuna pagina pubblica** (configurazione, copia nella casella, mittente, conteggio nella quota) | da chiedere (la funzione è già attiva) |
| SPF / DKIM / DMARC | SPF `v=spf1 include:spf.webapps.net ~all` (già presente); DKIM: Email > Azioni > DKIM > ON (selettore non dichiarato; non dichiarato se la firma sia automatica); DMARC base `v=DMARC1; p=none; pct=100; ri=86400`. Gmail rifiuta i messaggi senza autenticazione (`550-5.7.26`) | pagine di Register.it; da confermare |
| Rete | nessuna lista di IP consentiti; la porta 25 è bloccata da Vercel ma la 465 è aperta | docs Vercel + prova |

Il certificato ha rinnovi frequenti (scade il 25 gennaio 2027): **non si fa pinning** del certificato, si usa la catena pubblica.

### Gmail
Ricezione fino a 25 MB (non è il limite che comanda). Un allegato di 4,4 MB diventa circa 5,9 MB nel messaggio (base64): ampiamente sotto i 30 MB di Register.it.

## 5. Sicurezza

**Allegati** (`src/lib/contact/validate.ts`)
- un solo file; estensioni consentite: `pdf`, `docx`, `doc`; nessuna doppia estensione pericolosa (`.exe.pdf`, ecc.) e nessun byte nullo;
- il contenuto deve corrispondere al tipo: PDF con `%PDF-`; DOCX = ZIP con `[Content_Types].xml` e `word/document.xml` (si legge solo l'elenco dei file, **senza decomprimere**: nessuna zip bomb); DOC con firma OLE2;
- DOCX con macro (`vbaProject.bin`) **rifiutato**; PDF con JavaScript/avvio programmi, DOCX con oggetti incorporati e DOC con possibili macro **segnalati** nell'oggetto e nel testo dell'email;
- nome file riscritto (senza percorso, caratteri sicuri, max 80);
- **il file vive solo in memoria** (Buffer) e non viene mai scritto su disco né conservato sul sito;
- **nessuna scansione antivirus** è possibile su Vercel: restano come protezioni il controllo dei tipi, l'antivirus di Register.it (da confermare se incluso in ingresso) e quello di Gmail. È lo stesso rischio residuo di oggi.

**Antispam e abusi**
- campo trappola (`website`) e token firmato con orario (minimo 3 s, massimo 3 ore) ottenuto con una GET all'apertura del modulo;
- controllo di `Origin`/`Referer` (solo il sito stesso);
- **rate limiting nel codice: best effort per istanza** (3 richieste ogni 10 minuti per IP, 40 all'ora per istanza). Le funzioni serverless non condividono la memoria: **la protezione solida è la regola WAF di Vercel** (§6, da configurare dal proprietario);
- l'IP non viene conservato: in memoria resta solo un hash con chiave segreta.

**Dati e log**
- nessun contenuto, nome, email, nome di file o IP nei log: solo un codice tecnico (es. `EAUTH`, `ECONNECTION`);
- messaggi d'errore generici al visitatore, con l'indirizzo di contatto come alternativa;
- campi di testo ripuliti da caratteri di controllo e a capo (protezione dall'iniezione di intestazioni email).

## 6. Operazioni manuali prima del collaudo reale (a cura del proprietario)

Nessuna è stata eseguita.
1. **Register.it, per iscritto al supporto:** (a) invio SMTP da un sito/script consentito? (b) quota giornaliera reale della casella; (c) l'antispam/antivirus in ingresso è incluso per le 3 caselle? (d) come funziona l'inoltro verso Gmail (copia nella casella? mittente?); (e) nomina a responsabile del trattamento.
2. **Creare la casella di invio** (es. `form@dentroleparole.com`, una delle 3 incluse) con password lunga e casuale; non usare la casella personale di Donatella.
3. **DNS (pannello Register.it):** attivare DKIM e una politica DMARC iniziale `p=none` con report; SPF esiste già (`include:spf.webapps.net`).
4. **Variabili su Vercel** (§3): prima in **Preview**, con `SMTP_PASS` e `CONTACT_FORM_SECRET` di tipo Secret.
5. **Regola di rate limiting WAF** (Vercel > Firewall): percorso `/api/contatti`, metodo POST, chiave IP, finestra 10 minuti, soglia 10 richieste, azione blocco; da tarare dopo i primi giorni.
6. Decidere l'antispam aggiuntivo (BotID o Turnstile) **solo se** compaiono bot nonostante quanto sopra.
7. **Collaudo con file sintetici** e non con manoscritti veri, prima verso una casella di prova, poi un invio reale concordato fino a Gmail.
8. Solo dopo: `NEXT_PUBLIC_CONTACT_BACKEND=api` in Production, nuovo deploy e pubblicazione dell'informativa aggiornata (§9).

## 7. Collaudo, misura del limite e migrazione

**Matrice di collaudo su Preview/produzione** (con file sintetici): PDF, DOCX, DOC validi; file alla soglia misurata e +1 byte; estensione non ammessa; doppia estensione; testo rinominato `.pdf`; DOCX con macro; file vuoto; due file; email non valida; campi troppo lunghi; a capo nei campi; nome file con caratteri non ASCII; campo trappola; invio troppo rapido; token scaduto; superamento del rate limit; password SMTP errata (solo Preview) → messaggio generico e nessun dato nei log; arrivo su Register e su **Gmail** (posta in arrivo o spam, allegato apribile); aspetto del modulo e mobile.

**Misura del limite del corpo (senza inviare email):** una richiesta con `Content-Type` diverso da `multipart/form-data` viene rifiutata dall'endpoint (400) *prima* di qualunque invio; inviare corpi di dimensione crescente e osservare dove la risposta passa da 400/503 (raggiunge il codice) a 413 `FUNCTION_PAYLOAD_TOO_LARGE` (rifiutata dalla piattaforma). Se la soglia cambia, aggiornare `PLATFORM_BODY_LIMIT_BYTES` in `src/lib/contact/limits.ts`.

**Migrazione:** il nuovo flusso si prova in Preview mentre la produzione resta su FormSubmit; il passaggio è l'interruttore (§2). FormSubmit va rimosso solo in una PR separata, dopo almeno una settimana di funzionamento.

## 8. Test eseguiti

- **47 test automatici** (`npm run test:contact`, `node:test`, nessuna libreria di test aggiuntiva) con **SMTP simulato**: nessuna email reale. Coprono validatori (email, campi, nomi di file, PDF/DOCX/DOC, macro, zip corrotti), token, rate limiting, configurazione e opzioni del trasporto (TLS verificato, TLS 1.2 minimo, timeout), costruzione del messaggio, e l'intero percorso della richiesta: successo, senza allegato, rifiuti, Content-Length eccessivo, iniezione di intestazioni, antispam, rate limit, origine, guasto SMTP con verifica che **nessun dato personale compaia nei log**; più un server SMTP finto locale per l'autenticazione rifiutata, il server non raggiungibile e l'integrità dell'allegato, e **7 controlli statici di sicurezza** (nessun segreto o `.env` tracciato, nessuna scrittura su disco, log solo con codici tecnici, interruttore predefinito = FormSubmit).
- **Collaudo completo in locale** (build con `NEXT_PUBLIC_CONTACT_BACKEND=api`, browser integrato, server SMTP finto su loopback): modulo compilato con allegato PDF → pagina `/grazie`; messaggio ricevuto con mittente, destinatario, Reply-To, oggetto, testo con accenti e virgolette e allegato **identico** (300.034 byte); messaggi d'errore nel browser per file troppo grande ("Massimo 4,4 MB"), formato non valido e contenuto falso (rifiutato dal server, nulla inviato).
- **Anteprima facoltativa (9 novembre 2026)**: 6 test sui testi (presenti, uguali nelle due modalità, nessun limite di pagine o parole, campo facoltativo, tutti i campi presenti, 4,4 MB con l'endpoint e 8 MB con FormSubmit); matrice e invio dal modulo (senza allegato e con anteprima DOCX) ripetuti dopo la modifica; confronto con la produzione in modalità FormSubmit: cambia solo il riquadro dell'allegato; controllo a 375 px senza scorrimento orizzontale.
- **Matrice di collaudo automatica** (`npm run collaudo:contact -- local`): 19 casi contro un build locale e un SMTP finto, 8 email con allegati identici (SHA-256) e prova del limite di richieste; dettagli in [COLLAUDO.md](COLLAUDO.md).
- **Su Vercel (Preview)**: regione fra1; TLS con verifica attiva verso Register.it; saluto SMTP in 43 ms; soglia del corpo misurata.
- **Non eseguito**: invio reale a Register.it (nessuna credenziale), recapito su Gmail, DKIM/DMARC, comportamento dell'inoltro, regola WAF, prova con file vicino al limite in produzione.
- Nota sull'ambiente di prova: sul PC usato un antivirus intercetta il TLS (anche locale), perciò la consegna TLS verso un server locale non è stata provata lì; la verifica TLS reale è stata fatta dall'infrastruttura Vercel.

## 9. Proposta di informativa aggiornata (NON pubblicata)

Da pubblicare **solo al passaggio in produzione**, perché finché resta FormSubmit il testo attuale è quello corretto. Da rivedere con un professionista.

*Privacy Policy, sezione 3 (manoscritti e allegati):* «Le richieste e gli allegati inviati tramite il modulo vengono ricevuti dal server del sito (ospitato da Vercel, con elaborazione in regione europea), trattati solo in memoria per il tempo necessario all'invio e consegnati via email alla casella contatti@dentroleparole.com, il cui servizio di posta è fornito da Register.it. Il sito non conserva copie dei messaggi né dei file. La titolare riceve i messaggi anche sul proprio account Gmail personale, a cui la casella è inoltrata automaticamente.»

*Sezione 6 (destinatari):* eliminare FormSubmit; elencare **Register.it** (posta elettronica del dominio), **Google Ireland Limited** (account Gmail personale della titolare su cui vengono inoltrati i messaggi) e **Vercel** (hosting ed elaborazione della richiesta).

*Sezione 7 (trasferimenti):* eliminare FormSubmit; restano Vercel (clausole contrattuali standard e Data Privacy Framework dichiarati dal fornitore) e Google (garanzie da verificare).

*Sezione 8 (conservazione):* eliminare la riga su FormSubmit; aggiungere «Messaggi e allegati: nella casella di posta e nell'account Gmail della titolare per [DA CONFERMARE] mesi».

*Cookie Policy:* eliminare i riferimenti a FormSubmit; nessun nuovo cookie (il token antispam è nel contenuto della pagina, non in un cookie).

**Da non nascondere:** finché i manoscritti arrivano su un Gmail personale (nessun accordo sul trattamento dati con Google, Termini "uso personale") la Privacy Policy deve dirlo e restano valide le criticità descritte nel report di audit (PR #5, `docs/legal/VERIFICHE_E_DOMANDE_2026-11-09.md`, sezione 7).

### Aggiornamento per l'anteprima facoltativa (proposta, NON pubblicata)

Il modulo non riceve il manoscritto completo ma, al più, un'anteprima. Testo proposto per la Privacy Policy (sezione 3, "Estratti, manoscritti e allegati", da sostituire a quello attuale al passaggio in produzione; nessuna modifica è stata fatta alla PR #5):

> **Anteprima del manoscritto (facoltativa).** Nel modulo puoi allegare, se lo desideri, un’anteprima del tuo testo (indicativamente le prime 5–10 cartelle editoriali) in formato PDF, DOC o DOCX. L’allegato è facoltativo e non è necessario inviare il manoscritto completo. L’anteprima viene utilizzata per valutare la tua richiesta di servizio editoriale e per risponderti. Il testo resta di tua proprietà: non viene pubblicato né utilizzato per finalità estranee alla tua richiesta. Se, dopo il primo contatto, fosse utile leggere il manoscritto completo, ti verrà chiesto separatamente con un’altra comunicazione via email.

Coerenze da riportare altrove, **al passaggio in produzione** (non modificate ora):
- *Finalità e basi giuridiche*: invariata (richiesta e misure precontrattuali su richiesta dell'interessato).
- *Termini di servizio (bozza nella PR #5), sezione 4*: oggi parla di "estratti e manoscritti" e di "file fino a 8 MB". Con il nuovo flusso va riscritta come "anteprima facoltativa" con il limite della modalità attiva (4,4 MB con l'endpoint) e il rimando al manoscritto completo da concordare separatamente.
- *Conservazione*: **non è definita e non è stata inventata**: resta il segnaposto "[DA CONFERMARE]" già previsto (per quanto tempo si conservano richieste e anteprime quando non nasce un incarico).
- *Rimandi*: il testo "Il testo resta di tua proprietà" corrisponde alla clausola già proposta nei Termini ("Inviando un testo non cedi alcun diritto sul tuo manoscritto"): la titolare deve confermare che la condivide.
- *Invio del manoscritto completo*: se verrà chiesto per email o con un collegamento privato, va prevista una nota specifica (chi lo legge, dove viene conservato, per quanto tempo), **da definire** insieme alla scelta dello strumento: non è parte di questo modulo.

**Incoerenza di contenuto non toccata (fuori dal modulo):** nella home compaiono "Estratto 5–10 pagine (gratuito)" e "Invia 5–10 pagine", mentre il modulo ora parla di "cartelle editoriali" (1 cartella ≈ 1.800 battute): conviene allineare l'unità di misura quando si rivedono i testi della home.

## 10. Rischi residui

| Rischio | Gravità | Note |
|---|---|---|
| File oltre 4,4 MB non inviabili dal modulo | Media | limite della piattaforma, misurato; messaggio chiaro |
| Register.it non conferma l'invio da script / quota ambigua (50 o 500) | Alta se negato | chiedere conferma scritta prima del collaudo |
| Esaurimento della quota da spam → richieste vere bloccate | Media | trappola, token, limiti nel codice e **regola WAF** |
| Antispam in uscita di Register.it blocca un messaggio con allegato | Media | provare con i tipi ammessi; l'utente vede un errore e l'indirizzo email |
| Recapito su Gmail via inoltro (spam, mittente) | Media | prova; DKIM e DMARC |
| Nessuna scansione antivirus dei file | Media | tipi ammessi, niente macro, antivirus di Register/Gmail |
| Gmail personale senza accordo sul trattamento dei dati | Alta (scelta consapevole) | da dichiarare nell'informativa |
| Rate limiting nel codice valido per singola istanza | Media | regola WAF necessaria |
| Credenziali SMTP esposte | Alta | Secret, casella dedicata, nessun log, rotazione |

## 11. Osservazioni non legate a questa modifica
- Il pulsante "Invia richiesta" ha sfondo trasparente anche **oggi in produzione** (`bg-gold` non produce un colore di sfondo): è così nel modulo attuale e non è stato toccato.
- Nella cronologia del branch compaiono commit di una diagnostica temporanea di sola lettura (`/api/diag-smtp`, solo Preview, senza credenziali) usata per misurare TLS, regione e limiti: **è stata rimossa** e non è nel codice finale.
