# Audit dipendenze — 27 novembre 2026

Eseguito `npm audit --json --fetch-timeout=20000 --fetch-retries=0` sul lockfile della PR: **55 pacchetti segnalati** (2 critici, 24 alti, 28 moderati, 1 basso). Il conteggio comprende propagazioni di vulnerabilità e non equivale a 55 vulnerabilità indipendenti sfruttabili. La sfruttabilità effettiva di ciascun advisory non è stata provata.

Confronto delle versioni nel lockfile con `origin/main` e76d5ef: unica aggiunta Nodemailer 10.4.0, non segnalata nell'audit. Le versioni di tutti gli altri pacchetti sono identiche a main: il debito è preesistente. Nessun aggiornamento automatico o `npm audit fix --force` applicato. Non è prudente dichiarare il progetto sicuro perché il modulo supera i test.

**Blocco al GO pubblico**: valutare e correggere gli advisory runtime di Next.js (16.1.6, gravità critica aggregata) e le dipendenze effettivamente esposte; triage separato delle librerie CLI/build Sanity e tar (gravità critica aggregata). L'audit non dimostra che ogni advisory sia applicabile alla configurazione Vercel. Il collaudo può restare locale; per Preview usare accesso protetto, dati sintetici e una valutazione del rischio prima di esporla.

Proposta separata: aggiornare Next/React e relativo tooling a versioni corrette compatibili, rifare build e regressioni dell'intero sito; aggiornare il ramo Sanity/toolchain con verifica delle eventuali migrazioni major. L'aggiornamento esteso di Sanity non appartiene al completamento del modulo contatti.

Fonti dirette dell'audit: [advisory Next.js](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [advisory tar](https://github.com/advisories/GHSA-23hp-3jrh-7fpw). Dettagli completi conservati localmente in `.test-build/security-audit.json` (non committato).

| Pacchetto | Versione principale nel lockfile | Gravità aggregata | Relazione |
| --- | --- | --- | --- |
| @babel/core | 7.29.0 | low | transitiva |
| @babel/plugin-transform-modules-systemjs | 7.29.0 | high | transitiva |
| @humanfs/node | 0.16.7 | moderate | transitiva |
| @oclif/core | 4.9.0 | moderate | transitiva |
| @oclif/plugin-help | 6.2.38 | moderate | transitiva |
| @sanity/cli | 4.22.0 | high | transitiva |
| @sanity/codegen | 4.22.0 | high | transitiva |
| @sanity/preview-url-secret | 3.0.0 | moderate | transitiva |
| @sanity/runtime-cli | 12.4.0 | high | transitiva |
| @sanity/uuid | 3.0.2 | moderate | transitiva |
| @sanity/visual-editing | vedi lockfile | moderate | transitiva |
| @typescript-eslint/eslint-plugin | 8.56.1 | moderate | transitiva |
| @typescript-eslint/parser | 8.56.1 | moderate | transitiva |
| @typescript-eslint/type-utils | 8.56.1 | moderate | transitiva |
| @typescript-eslint/typescript-estree | 8.56.1 | moderate | transitiva |
| @typescript-eslint/utils | 8.56.1 | moderate | transitiva |
| adm-zip | 0.5.16 | high | transitiva |
| archiver | 7.0.1 | moderate | transitiva |
| archiver-utils | 5.0.2 | moderate | transitiva |
| baseline-browser-mapping | 2.10.8 | moderate | transitiva |
| brace-expansion | 5.0.4 | high | transitiva |
| browserslist | 4.28.1 | high | transitiva |
| dompurify | 3.3.3 | moderate | transitiva |
| flatted | 3.4.1 | high | transitiva |
| follow-redirects | 1.15.11 | moderate | transitiva |
| form-data | 4.0.5 | high | transitiva |
| glob | 10.5.0 | moderate | transitiva |
| i18next | 25.8.18 | moderate | transitiva |
| js-yaml | 4.1.1 | high | transitiva |
| json-2-csv | 5.5.10 | moderate | transitiva |
| linkify-it | 5.0.0 | high | transitiva |
| lodash | 4.17.23 | high | transitiva |
| lodash-es | 4.17.23 | high | transitiva |
| markdown-it | 14.1.1 | high | transitiva |
| minimatch | 3.1.5 | moderate | transitiva |
| nanoid | 3.3.11 | high | transitiva |
| next | 16.1.6 | critical | diretta |
| next-sanity | 11.6.12 | moderate | diretta |
| picomatch | 4.0.3 | high | transitiva |
| postcss | 8.5.8 | high | diretta |
| rimraf | 5.0.10 | moderate | transitiva |
| sanity | 4.22.0 | high | diretta |
| sharp | 0.34.5 | high | transitiva |
| source-map-js | 1.2.1 | high | transitiva |
| styled-components | 6.3.11 | moderate | diretta |
| tar | 7.5.11 | critical | transitiva |
| typescript-eslint | 8.56.1 | moderate | transitiva |
| undici | 6.24.1 | high | transitiva |
| uuid | 8.3.2 | moderate | transitiva |
| valibot | 1.2.0 | moderate | transitiva |
| vite | 7.3.1 | high | transitiva |
| ws | 8.19.0 | high | transitiva |
| yaml | 2.8.2 | moderate | transitiva |
| zip-stream | 6.0.1 | moderate | transitiva |
| zod | 4.3.6 | high | transitiva |
