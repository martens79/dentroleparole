# Stato operativo e attivazione SMTP — 27 novembre 2026

Questo documento prevale sulle indicazioni storiche del README, della guida e di `MODIFICHE_SUGGERITE_PR5.md` quando divergono. La PR #5 è integrata (`4083522`); non è più una bozza da completare. Nessuna impostazione reale è stata cambiata da questa attività. FormSubmit resta il backend predefinito.

## Deploy automatici del solo branch

Per aggiornare la PR senza avviare build/deploy cloud, `vercel.json` disabilita gli auto-deploy Git esclusivamente per `feat/contact-endpoint-smtp-2026`. Nessuna impostazione globale del progetto è cambiata. Quando il proprietario autorizzerà il collaudo Preview, dovrà predisporre un deployment Preview manuale oppure rimuovere questa singola esclusione nel branch e ricontrollare gli ambienti selezionati; non usare Production. [Configurazione ufficiale](https://vercel.com/docs/project-configuration/git-configuration).

## Prima del collaudo reale: Register.it

Il proprietario deve ottenere conferma scritta di: invio autenticato da funzioni serverless Vercel; host/porta TLS del proprio prodotto (documentazione: `authsmtp.securemail.pro:465`); quote effettive giornaliere/orarie e connessioni simultanee; mittente ammesso; eventuali blocchi IP; dimensione MIME comprensiva della codifica base64; filtri antivirus/antispam e loro limiti; comportamento dell'inoltro verso Gmail, SRS/ARC e DKIM; disponibilità e ambito del contratto sul trattamento dati e conservazione/backup. Usare la bozza `RICHIESTA_ASSISTENZA_REGISTER.md`, senza credenziali.

La casella di invio dedicata è consigliata se già disponibile nel contratto. Numero di caselle incluse e costi non sono stati verificati sul contratto attuale: non assumere che crearla sia gratuito. Non acquistare prodotti o cambiare DNS senza decisione del proprietario.

## Credenziali e variabili: solo Preview del branch #7

Impostare direttamente nel pannello, senza chat o repository:

| Variabile | Valore/scopo |
| --- | --- |
| `SMTP_USER` | Casella di invio autenticata, completa di dominio |
| `SMTP_PASS` | Password della casella, Sensitive/Secret |
| `CONTACT_FORM_SECRET` | Almeno 32 caratteri casuali, Sensitive/Secret |
| `CONTACT_TO` | Destinatario di collaudo esplicitamente autorizzato |
| `CONTACT_FROM` | Facoltativo; normalmente assente, usa SMTP_USER |
| `SMTP_HOST`, `SMTP_PORT` | Normalmente assenti: default sopra; confermare per il prodotto |
| `SMTP_SECURE` | Assente per default 465/TLS; non disabilitare TLS |
| `NEXT_PUBLIC_CONTACT_BACKEND` | `api`, esclusivamente Preview e questo branch |
| `CONTACT_RATE_IP_MAX` | Facoltativo, 50 solo per matrice sintetica; rimuovere per verificare limite predefinito |

Non impostare `SMTP_ALLOW_PLAINTEXT_LOOPBACK` su Vercel. Usare una Preview con accesso protetto; concedere l'accesso soltanto a chi collauda. Non copiare variabili Production né esporle con `NEXT_PUBLIC_`. La variabile pubblica del backend viene incorporata nel build: cambiare il pannello senza ricostruire non cambia il modulo.

## DNS e autenticazione: procedura futura, non eseguita

1. Leggere SPF attuale e tutti i servizi autorizzati: un solo record SPF, senza sovrascrivere configurazioni di altri mittenti. Confermare con Register.it include e limiti DNS.
2. Chiedere il selettore DKIM e verificare che i messaggi SMTP siano realmente firmati con dominio allineato al From.
3. DMARC inizialmente in osservazione se concordato con chi gestisce il dominio; configurare una destinazione report soltanto se autorizzata. `p=none` senza destinatario report non produce monitoraggio utile.
4. Dopo eventuali modifiche autorizzate verificare gli header originali al destinatario e dopo inoltro: SPF, DKIM e DMARC, allineamento e assenza di duplicati. Non irrigidire la policy prima dell'analisi dei flussi legittimi. Nessuna modifica DNS è inclusa nella PR.

## Limiti e protezione distribuita

Conservati i limiti precedenti: corpo 4.493.210 byte, file 4.461.210 byte, mostrato come 4,4 MB. Sono misure storiche del 9 novembre, da ricontrollare sulla Preview effettiva; il test locale non misura il proxy Vercel. FormSubmit resta a 8 MiB, etichettati 8 MB come prima. La documentazione Vercel ora presenta anche una beta opt-in da 20 MiB con requisiti diversi: non abilitarla, non aumentare memoria né limite in questa PR.

Il rate limiting nel codice è in memoria per istanza: 3 richieste/IP/10 minuti e 40/ora/istanza. Non è distribuito, non sopravvive ai riavvii e non è una quota SMTP globale. Gli IP sono hash HMAC; la fiducia negli header dipende dal proxy Vercel (fuori da Vercel è necessaria configurazione del proxy). Token temporale e honeypot sono filtri antispam, non autenticazione né protezione completa da bot.

Prima dell'esposizione pubblica predisporre una regola WAF per POST `/api/contatti`, per IP, per esempio 10 richieste/10 minuti, verificando che copra gli host previsti e testando un 429. Sul collaudo protetto può restare una verifica manuale da eseguire prima del GO pubblico. La regola non è stata creata. Il rate limiting WAF può essere fatturato a consumo: verificare piano, franchigie e prezzo nel pannello e approvare eventuali costi prima di attivarlo. Nessun Redis o servizio di archiviazione viene introdotto.

## Collaudo autorizzato

Solo dopo autorizzazione all'invio reale: nuovo build Preview con le variabili sopra, dati inventati e file sintetici. Non usare manoscritti reali o account di terzi. Il comando `npm run collaudo:contact -- real ...` richiede anche `COLLAUDO_CONFIRM=INVIA_EMAIL_REALI` e un Reply-To autorizzato: non impostarli durante i test locali.

- Verificare invio senza allegato, PDF/DOC/DOCX, nome lungo, file vicino alla soglia e rifiuto sopra soglia; registrare versione/deployment e risultati, mai credenziali.
- Controllare mittente, destinatario, Reply-To, oggetto, accenti e una sola copia ricevuta; scaricare allegati sintetici e confrontare SHA-256 con gli originali.
- Verificare prima la casella destinataria Register.it, poi l'inoltro Gmail soltanto se esplicitamente autorizzato. Controllare spam e header originali di entrambe le copie. Accettazione SMTP non significa recapito in casella.
- Provare errore SMTP senza esporre password e indisponibilità; verificare messaggio generico, possibilità di riprovare e log privi di dati del modulo. Non abilitare debug SMTP del provider nei log applicativi.
- Ripristinare limiti predefiniti, provare la quarta richiesta bloccata e controllare il WAF prima del rilascio pubblico.
- Registrare gli esiti reali in un verbale distinto: nessun risultato locale vale come prova di consegna Register.it/Gmail, DNS o WAF.

## Allegati e privacy: decisioni prima della pubblicazione

Il codice applicativo mantiene file e contenuti in memoria fino all'invio, senza scrittura su disco o archivio. Le copie email e i metadati infrastrutturali hanno un ciclo distinto. I controlli su firma/estensione/struttura non sono antivirus né certificazione di validità del documento: PDF e DOC possono contenere contenuti attivi non rilevati, DOCX viene controllato senza decompressione e non viene aperto con Office. Aprire allegati con strumenti aggiornati, macro disabilitate e scansione del dispositivo; confermare le garanzie del provider. Non inviare manoscritti a scanner pubblici. Nessun nuovo servizio antivirus a pagamento è stato introdotto.

L'inoltro a Gmail personale è un punto aperto: informare l'utente non rende automaticamente adeguato il trattamento. Verificare con un professionista ruoli, base giuridica, contratto art. 28 quando richiesto, trasferimenti, sicurezza/accessi e cancellazione delle copie. Non presumere che il DPA Google Workspace si applichi a Gmail consumer. Prima di dati reali decidere se il flusso è utilizzabile o va sostituito; nessun acquisto o modifica dell'inoltro è autorizzato qui.

## Modifiche alle informative, contestuali alla futura attivazione

La precedente `MODIFICHE_SUGGERITE_PR5.md` si riferisce a versioni pre-merge e non va applicata letteralmente. Usare questa checklist sui file attuali:

- Privacy (`src/app/privacy-policy/page.tsx`): limite a 4,4 MB; flusso HTTPS Vercel → SMTP Register.it → casella e eventuale inoltro; eliminare FormSubmit dal flusso corrente solo quando effettivamente disattivato. Precisare assenza di archivio applicativo, senza promettere assenza di copie email o backup. Rivedere destinatari, contratti e trasferimenti: fra1 non garantisce tutti i trattamenti in UE.
- Conservazione: preservare 90 giorni per richieste chiuse senza incarico e 180 giorni per materiali dopo incarico già decisi in `src/content/legal.ts`; applicare la procedura manuale a Register.it, Gmail, cestini e copie locali, verificando backup. Gestire anche gli invii storici FormSubmit.
- Termini (`src/app/termini-di-servizio/page.tsx`): cambiare limite e riferimenti al sistema di invio; preservare proprietà del testo, anteprima facoltativa 5–10 cartelle e risposta 3–5 giorni lavorativi.
- Cookie Policy (`src/app/cookie-policy/page.tsx`): aggiornare eventuali riferimenti al modulo. SMTP e token non introducono cookie applicativi; verificare il rilascio reale. GA4 e sistema di consenso restano invariati.
- Aggiornare data/versione legale soltanto nel rilascio futuro; eseguire controllo segnaposto anche sull'HTML compilato. Completare separatamente il recapito professionale sospeso; il segnaposto interno non deve apparire pubblicamente.

## Rollback e GO/NO-GO

FormSubmit resta nel codice. Prima del rilascio conservare l'identificativo di un deployment funzionante FormSubmit e verificare disponibilità/limiti di Instant Rollback per il piano. In emergenza tornare a quel deployment, comprensivo delle informative precedenti; in alternativa impostare backend `formsubmit` (o rimuovere la variabile), ripristinare informative FormSubmit e ricostruire. La sola modifica della variabile non è immediata. Non effettuare reinvii automatici dei messaggi: evitare duplicati dopo esiti incerti.

GO al collaudo sintetico reale solo con: test tecnici verdi, conferme Register.it, casella e destinatari autorizzati, credenziali solo Preview, accesso Preview protetto, budget approvato se necessario e autorizzazione all'invio. NO-GO se manca uno di questi punti. GO pubblico richiede inoltre triage/correzione delle vulnerabilità preesistenti documentate in `AUDIT_DIPENDENZE_2026-11-27.md`, WAF verificato, valutazione Gmail/privacy risolta, recapito professionale completato, consegna/inoltro provati, informative aggiornate e autorizzazione distinta a merge/rilascio. La PR resta Draft fino a decisione del proprietario.

## Fonti ufficiali consultate

- [Register.it: parametri email](https://www.register.it/assistenza/parametri-email/)
- [Vercel: payload e beta opt-in](https://vercel.com/docs/errors/function_payload_too_large)
- [Vercel: costi WAF](https://vercel.com/docs/vercel-firewall/vercel-waf/usage-and-pricing)
- [Vercel: header e proxy](https://vercel.com/docs/headers/request-headers)
- [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj), [Google DPA](https://cloud.google.com/terms/data-processing-addendum/)

## Proposta separata Tailwind v4 (non implementata)

`globals.css` importa Tailwind ma non carica `tailwind.config.ts`: le utility personalizzate night/gold/ivory e shadow-glow possono mancare. Intervento futuro: scegliere migrazione dei token a `@theme` oppure caricamento esplicito della configurazione legacy con `@config`; confrontare tutte le pagine, hover/focus e responsive perché la riattivazione cambia la grafica globale. Qui restano solo i valori espliciti del pulsante e le classi strutturali del modulo. [Direttive Tailwind](https://tailwindcss.com/docs/functions-and-directives).

## Ripetere i test locali

`npm run test:contact`, `npx tsc --noEmit` e `npm run build -- --webpack` verificano codice e build. Per il build servono gli identificativi pubblici Sanity del progetto; non servono password SMTP o chiavi Brevo reali. Il lint globale ha debito preesistente documentato nel report; il lint mirato dei file contatti deve restare pulito.

Il nuovo `scripts/contact-browser.cjs` richiede Playwright e Chromium già disponibili nell'ambiente di collaudo (non aggiunti alle dipendenze dell'app). Se il modulo non è risolvibile, impostare `CONTACT_TEST_PLAYWRIGHT` al percorso del modulo installato. Prima compilare le fixture con `npm run test:contact`.

- `CONTACT_TEST_PRODUCTION=1 node scripts/contact-browser.cjs formsubmit`: usa il build locale FormSubmit già completato; in PowerShell impostare le variabili con `$env:NOME="valore"` e poi eseguire il comando Node.
- `node scripts/contact-browser.cjs api`: avvia Next in sviluppo, matrice SMTP locale e browser su 320/375/390/1280 px. Rimuovere prima `CONTACT_TEST_PRODUCTION` se si è eseguito il comando precedente.
- `CONTACT_TEST_RATELIMIT=1 node scripts/contact-browser.cjs api`: avvia il server con i limiti predefiniti e controlla il 429 alla quarta richiesta, senza email.

Non eseguire questi comandi contemporaneamente né durante un build: condividono la copia di lavoro e il test API usa la porta locale 3199/SMTP 47002. Gli artefatti sintetici sono in `.test-build/browser/`. Il programma pulisce l'ambiente del server, usa SMTP esclusivamente su loopback e blocca le richieste browser esterne; FormSubmit viene intercettato prima di qualsiasi invio. Nessun servizio esterno di invio viene usato.
