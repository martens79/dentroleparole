# Sei segnalazioni alte residue: valutazione del runtime pubblico

La valutazione riguarda le versioni bloccate nella PR #10 e i sorgenti invariati di main `e76d5ef`. Le sei voci npm non sono sei difetti distinti: due librerie ricevono advisory propri e quattro genitori ne ereditano la segnalazione. Non vengono escluse dall'audit, né considerate innocue in qualsiasi contesto.

| Voce npm | Versione | Uso / precondizione | Esito per le route pubbliche esaminate |
| --- | --- | --- | --- |
| adm-zip | 0.5.18 | Parser/estrazione di ZIP nelle utility `@sanity/runtime-cli`. Richiede un archivio controllato dall'attaccante; alcuni difetti richiedono estrazione sul filesystem o API async specifiche. | Nessun endpoint del sito riceve ZIP, importa archivi o chiama queste API. Il modulo contatti effettua POST direttamente a FormSubmit, senza parser di allegati sul server Next. |
| zod | 3.25.76 sotto `@sanity/codegen` | Validazione di collezioni sovradimensionate nel codegen; l'advisory ufficiale include `<4.6.6`. La descrizione cita internali della linea 4: il dubbio sul ramo 3 è documentato senza sopprimere il finding. | La route newsletter usa controllo esplicito del consenso e regex email; non importa Zod/codegen. Blog e sitemap leggono dati editoriali da Sanity con GROQ, senza compilare schemi o passare collezioni del visitatore a codegen. |
| @sanity/runtime-cli | 12.4.0 | Aggregato da adm-zip e altre utility. | Non è il server Next. Nessun comando CLI/import eseguito in risposta a richieste pubbliche. |
| @sanity/codegen | 4.22.1 | Aggregato da Zod. | Generazione dei tipi come strumento editoriale/sviluppo, senza endpoint pubblico dedicato. |
| @sanity/cli | 4.22.1 | Aggregato da runtime-cli/codegen. | Presente nel grafo npm di produzione attraverso Sanity; il flag npm `prod` non prova l'esecuzione nel runtime HTTP. |
| sanity | 4.22.1 | Aggregato dai genitori precedenti. Studio è incorporato sotto `/studio`. | Lo Studio viene compilato e la sua pagina risponde, ma non espone automaticamente i comandi locali CLI. La configurazione non registra route ZIP/codegen. Non sono stati effettuati login, import o scritture editoriali. |

## Evidenza e limiti

- Revisione dei sorgenti di `src`, degli import delle route newsletter/blog/sitemap e della configurazione Studio: nessun import di adm-zip, codegen o runtime-cli; nessun ricevitore ZIP/TAR o endpoint di estrazione. Non confondere `@sanity/client` con `@sanity/cli` quando si cercano riferimenti testuali.
- Il gate legge tutte le tracce NFT delle route pubbliche, escludendo lo Studio, e fallisce se contengono file esterni di adm-zip, delle tre CLI o della copia Zod di codegen. Include esplicitamente newsletter e articolo dinamico. Il rapporto completo viene caricato negli artefatti Actions come `runtime-traces-linux.json`.
- Le tracce NFT riguardano file esterni distribuiti; non sono una prova generale di assenza di codice incorporato nei chunk. Le conclusioni dipendono anche dall'assenza di input/operazioni applicative che soddisfino le precondizioni degli advisory e dalle regressioni HTTP/browser.
- I test esercitano le route pubbliche e il rendering dello Studio, non tutte le funzioni amministrative o CLI. Nessun exploit, archivio ostile, carico DoS o tentativo di accesso editoriale è stato eseguito sulla produzione.

**Non è stato individuato un blocco concreto del runtime pubblico dovuto a queste sei voci.** È ragionevole accettare temporaneamente il rischio residuo per integrare le patch del framework, senza attendere una migrazione major di Sanity. La valutazione va riaperta se si aggiungono upload server-side, import ZIP, codegen su input esterno o nuovi plugin editoriali che usino queste API.

Resta un rischio per gli operatori che eseguono CLI/import su archivi o schemi non fidati. Limitare tali operazioni a input editoriali verificati, mantenere la migrazione/backport come intervento distinto e ripetere l'audit prima del rilascio. Range, URL GHSA e patch ufficiali sono in [ADVISORIES.md](ADVISORIES.md); le migrazioni non applicate sono in [MIGRATIONS.md](MIGRATIONS.md).
