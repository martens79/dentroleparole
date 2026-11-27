# Sicurezza dipendenze DentroLeParole — 27 novembre 2026

## Ambito e decisione

Branch separato `fix/security-dependencies-20261127`, da main aggiornato `e76d5efb03a085afc0d6c06c6b9ecf97533a172c`. Aggiornamento: **gate Ubuntu completato, GO tecnico per merge e successiva pubblicazione**, con i residui documentati sotto. Risultati, workflow e provenienza in [LINUX-GATE.md](LINUX-GATE.md). Non è una certificazione di assenza di vulnerabilità. Il sito pubblicato non beneficia delle patch finché il proprietario non autorizza una successiva integrazione/pubblicazione: nessun merge o deploy eseguito in questo intervento.

Commit delle correzioni e dei test: `1337008cc0eaee7f6946f56060513dcc417359f3`. File modificati: `package.json`, `package-lock.json`, `.gitignore`, `eslint.config.mjs`, `vercel.json`; aggiunti `scripts/security-browser.mjs` e `tests/security/regression.test.mjs`. Le evidenze e questo report sono raccolti nel successivo commit di documentazione.

La migrazione SMTP è sospesa a tempo indeterminato. La PR #7 resta Draft, sullo stesso commit `fe170eeb6c1ad68acd708d8756f450ebbddbf0da`, e non è stata integrata o modificata. FormSubmit, Register.it, Gmail, DNS, credenziali e configurazione della posta restano invariati. Nessuna email reale inviata e nessun servizio acquistato.

La precedente richiesta di compatibilità futura è stata limitata alla lettura dei manifest: #7 aggiunge script di contatto e Nodemailer, mentre questa PR aggiorna le dipendenze condivise e aggiunge script distinti. Un'eventuale ripresa richiederà conservare entrambi i gruppi di script, rigenerare il lockfile sulle versioni sicure e ripetere i test. Non è stata provata una combinazione dei branch e non viene dichiarata compatibilità SMTP collaudata: lo stop del proprietario prevale.

## Audit comparativo

| Audit npm | Critiche | Alte | Moderate | Basse | Totale |
| --- | ---: | ---: | ---: | ---: | ---: |
| Main, completo | 2 | 24 | 28 | 1 | 55 |
| Main, `--omit=dev` | 2 | 23 | 21 | 1 | 47 |
| Correzioni, completo | 0 | 6 | 15 | 0 | 21 |
| Correzioni, `--omit=dev` | 0 | 6 | 15 | 0 | 21 |

Sono conteggi di pacchetti interessati e propagazioni ai genitori, non CVE indipendenti. Dei 55 iniziali, 35 non risultano più segnalati e 20 restano; compare un ulteriore aggregato `react-i18next`, ereditato da i18next. Nessun nuovo advisory foglia introdotto da questo aggregato. Il peer i18next è stato mantenuto nella major 25 già presente su main, evitando l'aggiornamento automatico alla major 27.

Le 2 critiche sono **Next.js e tar**. Le 24 alte sono identificate singolarmente, con versioni, catene e ambito, in [INVENTORY.md](INVENTORY.md). Tutti i 150 GHSA distinti referenziati dagli audit iniziale/finale sono stati letti tramite l'API ufficiale GitHub; nessuno risulta ritirato. I pacchetti inizialmente alti/critici rimandano a 64 GHSA alti/critici. [ADVISORIES.md](ADVISORIES.md) riporta CVE, range e prima patch dichiarata; i JSON degli audit e [audit-comparison.json](audit-comparison.json) rendono il confronto riproducibile.

## Correzioni applicate

- Next **16.1.6 → 16.4.6**, mantenendo la major 16; eslint-config-next allineato a 16.4.6.
- Sanity e Vision **4.22.0 → 4.22.1**, next-sanity **11.6.12 → 11.6.13**, senza migrazioni major.
- PostCSS **8.5.8 → 8.5.34** e override nella stessa major per le copie fissate da Next/styled-components.
- Aggiornamenti mirati delle dipendenze transitive segnalate, nei vincoli dichiarati dai genitori: tra le altre tar **7.5.24**, sharp **0.35.5**, undici **6.29.1**, vite **7.3.8**, ws **8.23.0**, lodash **4.18.1**. Il lockfile contiene le versioni esatte e gli hash di integrità.
- Override circoscritto al peer di `react-i18next@15.6.1`: i18next 25.x, ora **25.10.10**. La copia Sanity 23.16.8 resta distinta e segnalata.
- Test Node e browser, inventario e documentazione. Esclusione degli artefatti locali da Git/lint.
- `vercel.json`: disabilitato il deploy automatico **solo del nuovo branch di sicurezza**, per rispettare il vincolo di non deploy. Nessuna impostazione globale modificata.

Non è stato usato `npm audit fix --force`. React/ReactDOM 19.2.3, Tailwind 4.2.1 e styled-components 6.3.11 restano alle versioni precedenti. I sorgenti in `src`, `sanity.config.ts`, `next.config.js` e `tailwind.config.ts` sono identici a main. Nessuna modifica editoriale, al tema, al consenso, a GA4 o ai moduli di produzione.

## Rischio effettivo per il sito

Next è runtime HTTP: il sito usa App Router e ottimizzazione immagini, quindi le sue patch sono prioritarie. Non si presume che Vercel neutralizzi le vulnerabilità. Nel codice non risultano `cacheComponents`/`use cache`, Server Actions applicative, middleware di autenticazione, rewrite o cookie Edge che soddisfino alcune delle specifiche precondizioni degli advisory. Questo non esclude in generale vulnerabilità RSC o del framework.

Tra i record critici ufficiali: [RCE Windows](https://github.com/advisories/GHSA-p293-qw3h-jr36) e [AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), patch 16.3.3; [SVG](https://github.com/advisories/GHSA-2464-fhr4-w9xw) e [typed array/use cache](https://github.com/advisories/GHSA-673q-mjm6-r5xr), patch 16.4.1. Next 16.4.6 supera questi minimi e include le correzioni della [release di sicurezza di novembre](https://nextjs.org/blog/november-2026-security-release) e i successivi [backport 16.4.6](https://github.com/vercel/next.js/releases/tag/v16.4.6). L'RCE Windows non corrisponde alla piattaforma Vercel documentata; le vulnerabilità native delle immagini dipendono anche dal binario effettivamente usato. Non è stata ispezionata l'immagine interna dell'attuale deployment Vercel.

tar era critico per [estrazione senza limiti](https://github.com/advisories/GHSA-23hp-3jrh-7fpw), corretta da 7.5.19, con ulteriori patch successive: è ora 7.5.24. Si trova nella catena import/export/CLI Sanity; non esiste un endpoint pubblico del sito che riceva TAR. Anche quando una CLI è una dipendenza npm di produzione, non è automaticamente una superficie HTTP.

Restano **6 segnalazioni alte**: `adm-zip`, `zod` e i quattro genitori `@sanity/runtime-cli`, `@sanity/codegen`, `@sanity/cli`, `sanity`. Nessun percorso pubblico che estragga ZIP o compili schemi Zod da input del visitatore è stato osservato. Evitare comunque archivi/schemi non fidati nei comandi editoriali/CLI. Le moderate residue riguardano soprattutto globbing, traduzioni, UUID e aggregati. Il wrapper `@sanity/uuid` installato re-esporta v4; l'advisory interessa v3/v5/v6 con buffer fornito. Le traduzioni Studio sono risorse fidate del bundle, senza API pubblica per caricarle.

Questa è una valutazione di raggiungibilità basata su sorgenti, configurazione e precondizioni ufficiali, non un penetration test né una prova di non sfruttabilità. Nessun exploit o carico ostile è stato eseguito sulla produzione. Le tracce NFT delle route newsletter/blog non elencano i parser CLI residui come file esterni; ciò da solo non esclude codice incorporato nei chunk.

Le migrazioni necessarie per eliminare i residui sono separate in [MIGRATIONS.md](MIGRATIONS.md): niente override forzati Zod 3→4, adm-zip 0.5→0.6, UUID 8→11, i18next 23/25→26 o upgrade Sanity 4→6/next-sanity 11→13 in questa PR.

## Prove effettivamente eseguite

| Controllo | Risultato e limiti |
| --- | --- |
| Installazione Windows | `npm ci --ignore-scripts` riuscito; aggiornamento finale del peer i18next riuscito. |
| Typecheck Windows | `tsc --noEmit` superato. |
| Build Windows | `npm run build -- --webpack` superato, Next 16.4.6, 18 pagine generate. |
| Test Node | **11/11**: consenso newsletter mancante/falso/non booleano, email invalida, payload normalizzato, successi/errori provider e rete simulati, config assente, JSON invalido; persistenza/scadenza/versione consenso, storage indisponibile; invarianti sorgenti rispetto a main. Nessun invio reale. |
| Browser Chromium locale | **42 controlli superati**, build ottimizzata; zero errori JS non gestiti. |
| Confronto live in sola lettura | Baseline FormSubmit a 320/375/390/1280 px, invii intercettati localmente. |
| Pagine principali | Home, servizi, chi sono, pubblicazioni, portfolio, blog, news, testimonianze, privacy, cookie, termini, grazie a 1280 e 375 px; navigazione Link client. |
| FormSubmit | 320/375/390/1280 px; action/POST multipart/campi nascosti invariati; limite 8 MB e MIME invalidi; POST nativo intercettato, nessuna verifica di consegna email reale. |
| Immagini e route | Immagine ottimizzata 200; sorgente fuori dall'allowlist già esistente rifiutata 400; robots e sitemap 200. |
| Blog/Sanity | Articolo pubblicato 200; 9 articoli con data oltre un'ora nel futuro: URL diretti 404, assenti da blog/sitemap. Studio incorporato 200, senza login né scritture editoriali. Snapshot del dataset al momento del test. |
| Newsletter | Browser con consenso e successo simulato; vera API HTTP locale: consenso assente 400, email invalida 400, configurazione Brevo isolata/assente 500. Successo/provider/rete coperti con mock Node. Nessuna iscrizione reale, nessuna prova di deliverability. |
| Consenso e GA4 | UI senza scelta/rifiuto/accettazione/revoca; persistenza e configurazione `G-Z8PEVVKQVB` invariata. Richieste Google intercettate: nessun evento inviato, DebugView non verificata. |
| Lint | Completo: **14 errori e 5 warning preesistenti**, nei sorgenti rimasti invariati. Lint mirato di script/test/config nuovi superato. Debito preesistente non corretto ampliando questa PR. |
| Albero npm | `npm ls --all` exit 0, nessun invalid/missing; due avvisi extraneous per pacchetti opzionali già nel lock (`@img/sharp-wasm32`, `@emnapi/runtime`). |

Il test con nome allegato molto lungo rileva **lo stesso sbordo già in produzione**: scrollWidth 1030 a 320/375/390 px e 1310 a 1280 px. Nessun nuovo sbordo senza selezione. Non corretto in questa PR per mantenere FormSubmit invariato e non riprendere lavoro SMTP.

La prova nativa Windows legge realmente sharp 0.35.5, libvips 8.18.7, libheif 1.23.5 e librsvg 2.63.2; evidenza in [native-evidence.json](native-evidence.json). Il lock contiene sharp Linux x64 0.35.5 e libvips package 1.3.4: questo non equivale a una prova di esecuzione su Linux.

### Tentativi Linux locali storici, superati dal gate remoto

Tentata in Docker Desktop locale linux/amd64, Node 22.23.4, immagine `node:22-bookworm-slim` digest `sha256:5ec23b7c622b00547753bc6ffd78085dd868a68aeb41c8e0a1418f033e13d96d`. Sorgenti montati in sola lettura, nessun file `.env` copiato, nessuna porta pubblicata, nessuna credenziale fornita. Il primo `npm ci` si è fermato nei download per un errore di rete. Il secondo, con tarball verificati dal lock in cache isolata, si è fermato con `ENOTCACHED` sui metadati zustand. La successiva preparazione dei metadati pubblici ha incontrato `ENOSPC` sul disco host. Eliminata esclusivamente la cache generata dalla prova, recuperando circa 760 MB; i container di prova sono stati rimossi automaticamente.

In quella fase build/typecheck e lettura dei binari Linux **non erano stati completati e non erano dichiarati superati**. Su richiesta del proprietario non sono stati ripetuti tentativi locali: il successivo [gate GitHub Actions Ubuntu](LINUX-GATE.md) ha completato tutti i controlli con Node 22 e 24, incluso Node 24.x effettivamente configurato in Vercel. È stata inoltre completata la sola metadata opzionale mancante del lock, senza cambiare nessuna versione esistente. Non sono state cambiate configurazioni Docker/globali per aggirare i limiti locali.

## Riproduzione e limiti operativi

Usare Node 22 e le variabili pubbliche Sanity del progetto, senza credenziali Brevo reali per i test. Installare dal lock con `npm ci --ignore-scripts`, poi `npm run test:security`, `npx tsc --noEmit`, `npm run build -- --webpack` e `npm run lint`. Per il browser serve Playwright/Chromium già disponibile nell'ambiente di test; `SECURITY_PLAYWRIGHT` può indicare il percorso del modulo, senza aggiungerlo alle dipendenze di produzione.

Eseguire `npm run test:security:browser -- --baseline-live` per il confronto pubblico in sola lettura, quindi `npm run test:security:browser` sulla build locale. Il runner avvia/chiude un server su 127.0.0.1:3210 con configurazione Brevo vuota e blocca le mutazioni esterne; i POST FormSubmit vengono soddisfatti localmente. Gli artefatti sono in `.security-artifacts/`, ignorata da Git. Non usare il runner per verificare la ricezione reale.

## Checklist decisionale

- [x] Branch distinto da main aggiornato; PR #7 conservata Draft e invariata.
- [x] Nessuna critica nell'audit finale; Next aggiornato, Sharp e codec nativi eseguiti con successo su Windows e Linux.
- [x] Build/typecheck Windows e regressioni Node/browser superati.
- [x] Residui distinti per runtime, Studio e CLI, senza nasconderli con filtri.
- [x] Nessun cambiamento a FormSubmit, posta, consenso o GA4; nessun invio reale.
- [ ] Revisione del proprietario prima di qualsiasi merge/pubblicazione successiva.
- [x] Build predefinita, typecheck, audit, test Node/browser e binari Linux superati su GitHub Actions Ubuntu con Node 22 e 24.
- [ ] Pianificare separatamente backport/migrazioni dei residui Sanity e debito lint.

**GO tecnico per merge e successiva pubblicazione**, con i residui e i limiti esplicitati in [LINUX-GATE.md](LINUX-GATE.md) e [RUNTIME-RESIDUALS.md](RUNTIME-RESIDUALS.md). Non dichiarare l'audit azzerato o la produzione già corretta. Un successivo rilascio richiede comunque una decisione distinta del proprietario. La migrazione SMTP resta esclusa; entrambe le PR restano Draft.
