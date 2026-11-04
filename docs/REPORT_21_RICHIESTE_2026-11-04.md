# Aggiornamento Dentro le Parole — 4 novembre 2026

Branch: `work/donatella-21-aggiornamenti-20261104`, base `ac8fc21` (`main`). Nessun merge, deploy, pubblicazione o scrittura CMS autorizzato o eseguito.

## Preflight e criterio di aggiornamento

Next.js 16.1.6 / React 19 / TypeScript / Tailwind. Portfolio: `/portfolio`, `src/data/portfolio.ts`, visualizzazione in `src/components/PortfolioSection.tsx`. Homepage e `/news`: `src/data/updates.ts`, striscia `src/components/NewsTicker.tsx`. Sanity è utilizzato per il blog: nessuna modifica a schemi, documenti o asset Sanity.

17 schede iniziali; 4 aggiornate sul posto, 13 conservate integralmente, 16 aggiunte: 33 schede finali. Le richieste riguardano 19 opere editoriali (8 Harmony), più 1 coaching e 1 striscia homepage; non 21 nuovi libri. Le quattro vecchie schede Harmony hanno copertine di opere differenti: *Promessa di nozze, promessa di passione* (Sarah Mallory), *Un seducente scozzese* (Megan Frampton), *Il gioco di Miss Verity* (Candace Camp), *Un valzer con il visconte* (Laura Martin). Sono state conservate, non sostituite con titoli nuovi.

Le 18 immagini originali sono copiate senza alterazioni; SHA-256 in `docs/copertine-sha256.json`. Distribuzione ottimizzata attraverso Next Image, `sizes`, caricamento differito e contenimento senza ritaglio. La foto del dorso resta una foto, dichiarata in alt e didascalia. Nessuna copertina inventata per Il Custode del Tempo o coaching. Font, colori, sfondi, impaginazione e stile delle schede conservati.

## Esiti delle 21 richieste

Le prove indicate sono riproducibili con `node scripts/verify-editorial-update.mjs`; il controllo confronta anche le schede precedenti con il commit base e i paragrafi con il brief integrale.

| Richiesta | Modifica | Esito | Prova |
| --- | --- | --- | --- |
| 1. Respiro di un salto invisibile | Aggiornata voce autobiografica; Loris Puleo, Santelli, immagine 01; lavoro preesistente conservato. Uscita 22 gennaio 2027. | Completata; anno confermato dall’utente in chat. | Titolo unico, descrizione invariata, data esatta; `CONFERME_2026-11-04.md`. |
| 2. Mela glassata | Aggiornata voce secondo volume con titolo confermato **Mela glassata deluxe**; foto 02 del dorso e didascalia; primo volume conservato. | Completata; titolo chiarito. Nessun autore/editore/data aggiunto senza fonte. | Secondo volume unico; primo volume identico al precedente. |
| 3. La vita e le stelle | Giovanni Covone, HarperCollins, sottotitolo e immagine 03; revisione precedente conservata. | Completata | Confronto automatico della descrizione e degli highlights. |
| 4. The Bad Boy’s Love 4 | Katherine Rhea Angel, Midnight, immagine 04; correzione di bozze precedente conservata. | Completata | Sostituzione della sola voce Young Adult, non dello Sport Romance. |
| 5. Duello di corteggiamento | Eva Shepherd, immagine 05, Londra 1897. | Completata | Titolo/asset unici; dicitura Harmony esatta. |
| 6. Il duca dottore | Sadie King, immagine 06, Inghilterra 1820. | Completata | Titolo/asset unici; dicitura Harmony esatta. |
| 7. Come sposare un duca tentatore | Christine Merrill, immagine 07, Londra inizi 1800. | Completata | Titolo/asset unici; dicitura Harmony esatta. |
| 8. Una seducente sfida per il duca | Eva Shepherd, immagine 08, Inghilterra 1891. | Completata | Titolo/asset unici; dicitura Harmony esatta. |
| 9. La dama che sfidò il duca | Louise Allen, immagine 09, Londra 1815. | Completata; un solo inserimento. | Titolo e asset presenti una sola volta. |
| 10. Come corteggiare un libertino | Bronwyn Scott, immagine 10, Londra 1826. | Completata | Titolo/asset unici; dicitura Harmony esatta. |
| 11. La sirena del Norfolk | Christy Carlyle, immagine 11, Inghilterra 1896. | Completata | Titolo/asset unici; dicitura Harmony esatta. |
| 12. Un bacio proibito con il laird | Laura Martin, immagine 12, Scozia 1816. | Completata | Titolo/asset unici; dicitura Harmony esatta. |
| 13. Dark Sweet Love | Autrici, editore, genere, immagine 13 e due paragrafi integrali. | Completata | Confronto letterale con brief. |
| 14. Deadly Heartbeats – Battiti mortali | Autrice, editore, genere, immagine 14 e intervento integrale. | Completata | Confronto letterale con brief. |
| 15. Silver Sky – Noah (The Carter Brothers 2) | Autrice, editore, genere, immagine 15 e intervento integrale. | Completata | Confronto letterale con brief. |
| 16. Fall in with you – Promesse in cenere | Autrice, editore, genere, immagine 16 e due paragrafi integrali. | Completata | Confronto letterale con brief. |
| 17. 101 modi minchioni per fare soldi | Autore, editore, genere, immagine 17 e due paragrafi integrali. | Completata | Confronto letterale con brief. |
| 18. Il Custode del Tempo | Sylvie De Santis, genere e due paragrafi integrali; presentazione senza immagine. | Completata | Nessun asset associato; nessun editore inventato. |
| 19. Sentieri di carta – Racconti senza confini | AA. VV., genere, immagine 19 e tre paragrafi integrali. Intervento attribuito al solo racconto **Aurora**. | Completata | Confronto letterale e controllo dell’attribuzione. |
| 20. Percorso di Writing Coaching | Scheda di servizio anonima, modalità e tre paragrafi integrali, collaborazione in corso. | Completata | Nessuna copertina; etichetta collaborazione, non editing. |
| 21. Striscia homepage | Due testi esatti, sostituiti i vecchi messaggi; aggiornamento coerente anche su `/news`. | Completata | Controllo stringhe esatte; copie equivalenti per il loop, duplicato nascosto alle tecnologie assistive; pausa hover/focus e movimento ridotto. |

Per le nuove Harmony è riportata alla lettera la dicitura **Romanzo Harmony – I Grandi Romanzi Storici** e copiata una descrizione di correzione di bozze già documentata nel repository, senza estendere il lavoro a editing strutturale o altri servizi. Non è stato attribuito un anno o uno stato di pubblicazione non fornito.

## Conferme e limiti editoriali

L’anno di Respiro non è più da confermare: **2027**, risposta esplicita dell’utente del 4 novembre 2026. Anche **Mela glassata deluxe** è confermato in chat. Il brief originale resta immutato come fonte storica; le correzioni prevalenti sono registrate in `CONFERME_2026-11-04.md`. Non risultano ulteriori informazioni editoriali indispensabili da chiarire.

## Verifiche tecniche

- `node scripts/verify-editorial-update.mjs`: PASS. Confronto paragrafi integrali, metadati, 18 SHA-256 originali, conteggi, duplicati, preservazione delle schede e testi esatti della striscia.
- `npx tsc --noEmit`: PASS.
- ESLint sui file modificati e sullo script di verifica: PASS. Include `Header.tsx` dopo la correzione responsive.
- `npm run lint` generale: FAIL per problemi preesistenti fuori ambito (16 errori e 5 warning: `any`, link interni `<a>`, apostrofi JSX, effetto di CookieBanner, import inutilizzati). Nessuna regola disabilitata. La prima esecuzione aveva segnalato anche cinque import CommonJS nel nuovo script, poi convertito a ESM e verificato senza errori. Le pagine originali non sono state riscritte per risolvere il debito tecnico.
- `npm run build -- --webpack`: PASS sia nella prima compilazione completa sia nella build finale dopo la correzione responsive (tutte le 18 pagine generate). Il comando predefinito Turbopack ha incontrato un problema TLS locale nel download dei font Google; il percorso Webpack supportato utilizza i certificati di Windows con `NODE_USE_SYSTEM_CA=1`. Nessuna verifica TLS disabilitata e nessuna configurazione di produzione modificata.
- Browser locale: `/portfolio`, `/`, `/news`; desktop 1280 px e viewport smartphone 360, 390 e 430 px. Verificati leggibilità, proporzioni, assenza di overflow orizzontale, dicitura del dorso, dati confermati, schede senza copertina e navigazione del menu. Non è un test su dispositivo fisico.
- Verifica delle immagini: tutti i percorsi esistono, tutte le immagini fornite corrispondono byte per byte allo ZIP; associazioni controllate anche su tavola visiva delle 18 immagini. Confermato nel browser il caricamento differito e ottimizzato di copertine rappresentative.
- Ticker: due copie da 1504,25 px identiche in anteprima, animazione attiva e pausa `paused` al focus della tastiera verificata; testi completi disponibili su `/news`. Regola CSS `prefers-reduced-motion` controllata nel sorgente; preferenza non emulata nel browser.
- Nel collaudo a 360 px è emerso un difetto preesistente: il logo a dimensione desktop spingeva il pulsante Menu fuori dal bordo. Corretti soltanto due set di classi responsive (dimensione carattere e lunghezza linea del marchio sotto 640 px); font, animazione, colori, navigazione e dimensioni desktop restano invariati. Dopo la correzione il pulsante è interamente nel viewport: bordo destro circa 320 px a viewport 360 px, e circa 342 px a viewport 390 px.
- Le ricompilazioni dell’anteprima dev hanno provocato timeout/chunk temporanei sotto carico; server dev fermato per la verifica finale con build. Il PC disponeva di circa 70 MB di RAM libera, quindi la build finale è stata rilanciata con un worker e limite heap. La build finale con un worker è passata. Questo limite ambientale non ha richiesto modifiche al progetto.

Controllo finale su `next start` della build compilata: homepage e Portfolio HTTP 200, marchio animato visibile, Menu mobile aperto e navigazione verso Portfolio funzionante, copertina di Respiro caricata; zero errori nella console della nuova sessione browser. Le prove definitive di homepage mobile e Respiro desktop provengono da questa build. Il server locale viene fermato a fine lavoro; nessuna anteprima remota è pubblicata.

Prove visive in `docs/qa/`: `respiro-desktop.jpg`, `harmony-desktop.jpg`, `portfolio-mobile.jpg`, `dark-sweet-love-mobile.jpg`, `homepage-mobile.jpg`.

## File modificati

- `src/data/portfolio.ts`: quattro aggiornamenti sul posto, quindici nuove opere e coaching; metadati espliciti.
- `src/components/PortfolioSection.tsx`: metadati, paragrafi, didascalia dorso, alt/sizes e stato coaching.
- `src/data/updates.ts`, `src/components/NewsTicker.tsx`, `src/app/globals.css`: due comunicazioni esatte, loop coerente e accessibilità.
- `src/components/Header.tsx`: sola correzione responsive del marchio per lasciare accessibile il Menu.
- `public/images/portfolio/01_…19_…jpg`: 18 originali, senza immagine 18.
- `scripts/verify-editorial-update.mjs`: controlli riproducibili della consegna.
- `docs/`: brief originale, manifest, SHA-256, conferme, report e prove visive.
- `vercel.json`: disabilitazione dei deploy automatici solo per il branch di lavoro.

Per riprodurre in locale: `npm ci`, `node scripts/verify-editorial-update.mjs`, `npx tsc --noEmit`, `npm run build -- --webpack`, quindi `npm start -- --hostname 127.0.0.1 --port 3104`. Per la build servono le sole variabili pubbliche Sanity già previste dal progetto: `NEXT_PUBLIC_SANITY_PROJECT_ID=odfxsvll`, `NEXT_PUBLIC_SANITY_DATASET=production`. Nessun token di scrittura CMS richiesto. In questo PC `NODE_USE_SYSTEM_CA=1` va mantenuto anche durante `npm start`: senza questa variabile il prefetch del blog Sanity, non modificato, ha registrato errori TLS lato server locale. Homepage e Portfolio hanno comunque risposto 200 e la console browser della verifica finale non ha segnalato errori. Questo limite di certificati locale resta distinto dai controlli editoriali e non è stato risolto cambiando codice o impostazioni del CMS.

## Consegna e pubblicazione

La configurazione del branch in `vercel.json` disabilita il deploy automatico esclusivamente per `work/donatella-21-aggiornamenti-20261104`, usando `git.deploymentEnabled` come da [documentazione Vercel](https://vercel.com/docs/project-configuration/git-configuration). Gli altri branch mantengono il comportamento precedente. Nessuna impostazione del progetto Vercel in produzione è stata modificata.

La PR è una proposta da revisionare. Merge e pubblicazione richiedono autorizzazione esplicita. L’anteprima è soltanto locale.
