# Ordine editoriale del Portfolio

La pagina `/portfolio` mostra `portfolioItems` nell’ordine dichiarato in `src/data/portfolio.ts`. Non applica `sort`, `reverse` o filtri per categoria/stato.

L’ordine è una priorità editoriale esplicita di presentazione: non certifica le date degli interventi, che non sono disponibili per tutte le schede. I campi `year` e `release` riguardano la pubblicazione dei libri e non vengono usati per ordinare il lavoro di Donatella.

La proposta del 5 novembre 2026 porta in testa le sette nuove opere non Harmony del briefing recente, poi le quattro voci preesistenti aggiornate nella PR #1, gli otto nuovi lavori Harmony e il percorso di coaching. Le altre tredici schede restano integralmente presenti in fondo, nel loro ordine relativo precedente. La scelta all’interno di questi gruppi è editoriale, non una cronologia ricavata da titoli, anni di ambientazione o date di uscita.

## Aggiungere un nuovo lavoro in cima

Inserire il nuovo oggetto subito dopo `export const portfolioItems: PortfolioItem[] = [`, prima delle schede esistenti. Non serve rinumerare, cambiare date, aggiungere un secondo elenco o riorganizzare gli altri lavori. Per modificare una priorità, spostare l’intero oggetto nella posizione desiderata.

Mantenere una sola scheda per lo stesso lavoro. Le quattro voci Harmony storiche condividono il titolo generico ma sono opere diverse, identificabili dalle rispettive copertine: non vanno fuse.

## Prime dieci opere della proposta

1. Dark Sweet Love
2. Deadly Heartbeats – Battiti mortali
3. Silver Sky – Noah (The Carter Brothers 2)
4. Fall in with you – Promesse in cenere
5. 101 modi minchioni per fare soldi
6. Il Custode del Tempo
7. Sentieri di carta – Racconti senza confini
8. Respiro di un salto invisibile
9. Mela Glassata Deluxe
10. La vita e le stelle

The Bad Boy’s Love 4 è all’undicesimo posto: tutte e quattro le schede aggiornate nella PR #1 sono quindi comprese nelle prime undici posizioni.

Nessuna modifica a testi, metadati, categorie, copertine, placeholder o componenti responsive. Nessuna data di lavoro inventata.

## Verifiche della proposta

- Confronto completo con la base `ed9b34a`: 33 oggetti identici nei contenuti, nessuna perdita o duplicazione; le tredici schede precedenti mantengono l’ordine relativo.
- `node scripts/verify-editorial-update.mjs`, `npx eslint src/data/portfolio.ts`, `npx tsc --noEmit`: passati.
- `npm run build -- --webpack`: passata con certificati Windows (`NODE_USE_SYSTEM_CA=1`), heap limitato e un worker (`CIRCLE_NODE_TOTAL=2`). Nessuna modifica alla configurazione di build del progetto.
- HTML prerenderizzato: tutte le 33 schede nello stesso ordine della sorgente.
- Browser sulla build compilata: desktop 1280 px e viewport smartphone 390 e 360 px; ordine delle prime dieci verificato, 33 schede con immagine, nessun overflow orizzontale e nessun errore in console. Non è un test su dispositivo fisico.
- Prove visive: `docs/qa/2026-11-05-order/portfolio-desktop.jpg` e `portfolio-mobile.jpg`.

Nessun merge, deploy o aggiornamento CMS. Il branch della proposta ha i deploy automatici Vercel disabilitati; il server di collaudo è soltanto locale e viene fermato a fine lavoro.
