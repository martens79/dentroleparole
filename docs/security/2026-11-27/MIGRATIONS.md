# Migrazioni non applicate in questa PR

La PR applica le correzioni compatibili e conserva le major Next 16 e Sanity 4. Non usa npm audit fix --force e non elimina segnalazioni con esclusioni o filtri dell’audit.

## Residui al 27 novembre 2026

Le 6 segnalazioni alte sono adm-zip, zod e quattro pacchetti che ne ereditano il rischio: @sanity/runtime-cli, @sanity/codegen, @sanity/cli e sanity. Non sono sei exploit distinti.

| Catena / vincolo attuale | Versione correttiva o percorso da valutare | Perché separato |
| --- | --- | --- |
| @sanity/runtime-cli 12.4.0 → adm-zip ^0.5.16 (risolto 0.5.18) | Upstream che supporti adm-zip >=0.6.1 o sostituzione ufficiale | Fuori dal vincolo 0.5.x; non forzare un cambio API della libreria ZIP. Per GHSA-vwc7-r8mq-g2x9 il campo ufficiale firstPatchedVersion è assente: ricontrollare prima di dichiararlo risolto. |
| @sanity/codegen 4.22.1 → zod ^3.25.76 | Codegen compatibile con Zod >=4.6.6 o backport upstream per 3.x | Zod 4 non è una sostituzione garantita di Zod 3. La descrizione cita internali $ZodArray della linea 4, mentre il range include 3: chiedere chiarimento/backport, senza sopprimere la segnalazione. |
| Sanity 4.22.1 e next-sanity 11.6.13 | L’audit propone Sanity 6.25.0 e next-sanity 13.5.1 | Richiede verifiche coordinate di Studio, Vision, plugin, schema, API e requisiti Node/React. Nessun upgrade major eseguito. |
| i18next 23.16.8 in Sanity e peer 25.10.10 di react-i18next 15.6.1 | >=26.3.4 | Il vincolo Sanity è ^23.16.8. Il peer è stato mantenuto nella major 25 presente su main anziché accettare automaticamente la 27: nessuna migrazione delle traduzioni introdotta qui. |
| @sanity/uuid 3.0.2 → uuid ^8.0.0 | Wrapper SDK compatibile con uuid >=11.1.1 oppure sostituzione ufficiale | Non forzare una major di uuid sotto un wrapper che dichiara 8. Nel pacchetto installato il wrapper re-esporta v4; il difetto riguarda v3/v5/v6 con buffer fornito. |
| Archiver/utility/CLI → glob 10.5.0 e minimatch 9/10 | Genitori che dichiarino glob >=14.0.2 e minimatch >=11.0.1 | Queste versioni sono fuori dai vincoli di parte dei genitori. Glob 14.0.6 e minimatch 11.0.9 sono già risolti dove i genitori li supportano; restano le altre copie. |

## Verifiche richieste prima di una migrazione futura

1. Preferire un backport mantenuto dagli autori quando disponibile; ricontrollare advisory e peer, senza assumere che la versione “latest” azzeri l’audit.
2. Valutare Sanity/next-sanity/Vision insieme, in un intervento dedicato. Controllare le note ufficiali e i requisiti di Node e React.
3. Estrarre lo schema e generare i tipi in un ambiente isolato; confrontare output, GROQ, filtri publishedAt e rendering PortableText.
4. Verificare traduzioni, Structure Tool, Vision, autorizzazioni editoriali e flusso di pubblicazione programmata. Eventuali prove di creazione/modifica su un dataset di test richiedono un’autorizzazione distinta: non sono state effettuate.
5. Verificare import/export e parser ZIP/TAR soltanto con archivi sintetici e limiti di risorse; non eseguire PoC distruttivi sul sito.
6. Ripetere audit completo e production-only, build, typecheck e regressioni; registrare separatamente rischi HTTP, Studio e CLI.

Il codice del sito non espone ricezione ZIP/TAR, compilazione di schemi o caricamento di risorse di traduzione da input del visitatore. Questo riduce la raggiungibilità osservata dei residui, ma non rende innocuo usare le CLI con input non fidati e non equivale a una prova generale di assenza di vulnerabilità.

Fonti puntuali, range, CVE e patch ufficiali sono in [ADVISORIES.md](ADVISORIES.md) e [official-advisories.json](official-advisories.json). Le versioni proposte dall’audit sono in [audit-after.json](audit-after.json).
