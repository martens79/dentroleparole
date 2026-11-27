# Gate Linux completato su GitHub Actions

## Esito

**GO tecnico per il merge della PR #10 e la successiva pubblicazione**, mantenendo espliciti i residui sotto descritti. Non è stato effettuato alcun merge o deploy. La PR resta Draft e la decisione operativa rimane al proprietario.

Esecuzione completamente superata: [Security Linux gate — 45993452445](https://github.com/martens79/dentroleparole/actions/runs/45993452445), commit `1d9cb29a3ab9efdb962c268059d55e6c4420af55`. I successivi aggiornamenti di questo report vengono a loro volta verificati dal workflow sullo SHA di testa della PR.

| Runner | Node / npm effettivi | Job | Esito |
| --- | --- | --- | --- |
| Ubuntu 24.04 x64, glibc 2.39 | Node 22.23.5 / npm 10.9.9 | [Node 22](https://github.com/martens79/dentroleparole/actions/runs/45993452445/job/140486827901) | Tutti i controlli superati |
| Ubuntu 24.04 x64, glibc 2.39 | Node 24.22.3 / npm 11.19.1 | [Node 24](https://github.com/martens79/dentroleparole/actions/runs/45993452445/job/140486828363) | Tutti i controlli superati |

Il 27 novembre 2026 `vercel project inspect dentroleparole` ha confermato **Node 24.x**, framework Next.js, root `.`, build predefinita `npm run build`/`next build`. È stata una lettura, senza modifica del progetto, delle variabili o dei deploy. La CI copre quindi la major effettivamente configurata, oltre alla precedente major di sviluppo 22. La [documentazione Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) conferma il supporto a 22 e 24; le patch gestite da Vercel possono differire da quelle del runner. Non si presume equivalenza esatta con l'immagine interna di Vercel.

## Controlli effettivi, su entrambi i job

- **`npm ci` pulito**, con gli script d'installazione normali e i pacchetti opzionali nativi; nessun `--force`, `--legacy-peer-deps` o install di aggiornamenti applicativi.
- **Audit completo e `--omit=dev`: 21 voci**, 0 critiche, 6 alte, 15 moderate. `npm audit` restituisce normalmente 1 per i residui. Il gate conserva il JSON integrale e accetta soltanto pacchetti/advisory già revisionati, senza aumento di gravità; nuove voci/advisory o qualunque critica fanno fallire il job. Un errore di rete/risposta non valida non viene trasformato in successo.
- **11/11 test Node**: newsletter, consenso e invarianti del codice di produzione. Provider/rete simulati, nessuna iscrizione reale.
- **`next typegen` e `tsc --noEmit` superati** da checkout pulito.
- **`npm run build` superato**, usando la build di produzione predefinita di Next 16.4.6 (Turbopack), senza il precedente ripiego locale `--webpack`.
- **19 tracce NFT pubbliche esaminate**, incluse newsletter, articolo dinamico e sitemap; nessun file esterno di adm-zip/CLI/codegen/runtime-cli o della copia Zod di codegen. Limiti e precondizioni in [RUNTIME-RESIDUALS.md](RUNTIME-RESIDUALS.md).
- **42/42 controlli Chromium candidati**, più il confronto live FormSubmit alle quattro larghezze 320/375/390/1280 px. Dodici pagine a desktop/mobile, navigazione client, immagini ottimizzate, robots, blog, sitemap, newsletter, consenso e configurazione GA4.
- Articolo pubblicato: **200**. **9 articoli programmati** oltre un'ora nel futuro: tutti **404** sugli URL diretti e assenti da blog/sitemap. Il CMS è stato solo letto; nessuna scrittura editoriale.
- Invii FormSubmit intercettati e soddisfatti localmente dal browser; richieste Google bloccate, API Brevo assente dall'ambiente del server di test. **Zero mutazioni esterne, zero errori JavaScript non gestiti**.
- Il workflow verifica alla fine che manifest, lock, sorgenti e configurazioni di produzione non siano stati modificati dall'esecuzione. Permessi GitHub `contents: read`, nessun secret del sito, nessun passo di deploy.

## Dipendenze native effettivamente eseguite

Sharp è risolto dal contesto del pacchetto Next, non da una copia esterna. Su entrambi i runner: **sharp 0.35.5, libvips 8.18.7, libheif 1.23.5, librsvg 2.63.2**. Provati caricamento SWC Linux GNU e Tailwind Oxide, trasformazione TypeScript con esbuild e risoluzione nativa con unrs-resolver.

Eseguiti encode/decode **PNG, WebP e AVIF**, con controllo delle dimensioni; PNG e WebP lossless verificati anche tramite **SHA-256 dei pixel decodificati**. SVG sintetico rasterizzato e ridimensionato. Il browser ha inoltre richiesto con successo una vera immagine dell'header attraverso `/_next/image`; un'origine esterna all'allowlist è stata respinta con 400. Le prove sono funzionali su immagini sintetiche/asset pubblici, non exploit delle vulnerabilità native.

Evidenze permanenti in [linux/node-22](linux/node-22) e [linux/node-24](linux/node-24): versioni native, audit integrali, tracce pubbliche, risultati browser, geometrie baseline/candidata e hash dei manifest. La provenienza e tutti i passi CI sono in [linux/run.json](linux/run.json). I log e gli screenshot completi rimangono negli artefatti Actions per 14 giorni.

## Correzioni necessarie al gate, senza nuovi upgrade

1. Il primo tentativo Node 24 ha rilevato metadati opzionali mancanti nel lockfile di `unrs-resolver@1.11.1`. Un job temporaneo Ubuntu ha eseguito `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`, confrontando versioni, URL e integrità di tutte le voci esistenti; [recupero metadata](https://github.com/martens79/dentroleparole/actions/runs/45992775805/job/140484561323). Sono state importate **solo 23 nuove voci opzionali di sviluppo**, non altre modifiche del generatore. Tutte le **1422 voci precedenti sono rimaste identiche nei valori**, non soltanto nella versione. `package.json` è invariato rispetto alla PR precedentemente approvata. Il job temporaneo è stato rimosso: la CI finale usa esclusivamente il lock committato con `npm ci`.
2. Resa esplicita la shell Bash con `-e -o pipefail`, così un errore prima di `tee` interrompe il job. I tentativi diagnostici non sono dichiarati riusciti.
3. Il confronto iniziale con la geometria Windows ha fallito sullo sbordo preesistente del nome allegato. Con lo **stesso Chromium Ubuntu**, produzione e candidata misurano entrambe **1127 px** a 320/375/390 e **1407 px** a 1280. Non è stata aumentata la tolleranza di 2 px: il confronto usa ora una baseline live della stessa piattaforma e attende i font. Il precedente confronto Windows resta documentato come storico. Nessuna modifica al modulo FormSubmit o al CSS.

Il [run diagnostico 45993000674](https://github.com/martens79/dentroleparole/actions/runs/45993000674) aveva già superato build/typecheck/native, ma è correttamente fallito sul confronto geometrico fra piattaforme. I due run precedenti sono stati sostituiti/cancellati durante la preparazione del gate e non contano come pass.

## Rischi residui e raccomandazione

Le sei alte della catena Sanity non costituiscono un blocco concreto osservato per il runtime pubblico: nessun input pubblico ZIP/codegen, tracce coerenti e regressioni superate. Non sono però risolte in senso assoluto; evitare CLI/import su input non fidati e pianificare i backport/migrazioni separatamente. Le tracce NFT non dimostrano da sole assenza di codice incorporato nei chunk. Valutazione completa e condizioni che richiedono riesame in [RUNTIME-RESIDUALS.md](RUNTIME-RESIDUALS.md).

Restano il debito lint preesistente (14 errori/5 warning) e lo sbordo già presente con nomi allegato molto lunghi. Non sono stati ampliati o corretti in questa PR. Consegna reale FormSubmit/Brevo, DebugView GA4, funzioni editoriali autenticate e comportamento dopo un futuro deploy non sono stati collaudati mediante operazioni reali.

**GO tecnico per merge e successiva pubblicazione delle patch**, accettando esplicitamente questi residui; **NO-GO** se si richiede audit a zero o se una modifica successiva introduce upload/estrazione/codegen da input pubblico senza riesame. Il gate deve rimanere verde sullo SHA scelto per il rilascio. Nessun merge/deploy è autorizzato da questa raccomandazione: restano da decidere/eseguire dal proprietario. PR #7, posta, FormSubmit, GA4, consenso e DNS restano invariati.
