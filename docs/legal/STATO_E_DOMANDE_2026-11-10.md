# Pagine legali — stato, conferme necessarie e newsletter (10 novembre 2026)

> Documento di lavoro, non pubblicato sul sito. Aggiorna `VERIFICHE_E_DOMANDE_2026-11-09.md` (che resta come storico). Non è consulenza legale e non attesta la conformità al GDPR: i testi vanno riletti da un professionista qualificato.

## 1. Cosa è stato completato in questa PR

| Pagina | Stato |
|---|---|
| **Privacy Policy** | Completa. Descrive: titolare; dati del modulo e dell'anteprima facoltativa; email; newsletter (Brevo); Google Analytics solo con consenso; FormSubmit; Register.it (posta in ingresso); inoltro verso Gmail personale; Vercel; basi giuridiche; trasferimenti extra UE; conservazione; diritti e reclamo al Garante |
| **Cookie Policy** | Verificata riga per riga sul codice (vedi §2) e completata con FormSubmit e link di affiliazione Amazon |
| **Termini di servizio** | Riscritti nei 9 punti richiesti: utilizzo del sito; richiesta iniziale; anteprima facoltativa; proprietà intellettuale dell'autore; riservatezza; tempi di risposta (3–5 giorni lavorativi); servizi editoriali con preventivo o accordo; tempi, compensi e condizioni nel singolo incarico. Nessun compenso, penale o recesso inventato |

Decisioni usate come definitive (tutte in `src/content/legal.ts`): anteprima facoltativa di 5–10 cartelle editoriali (circa 1.800 battute, spazi inclusi); manoscritto completo non necessario e richiedibile dopo via email; «Rispondo entro 3–5 giorni lavorativi»; il testo resta dell'autore; sistema di contatto attuale = **FormSubmit**; consenso cookie della PR #6 già in produzione.

`node scripts/check-legal-placeholders.mjs` ora controlla anche la coerenza: nessun «24–48», «estratto», «5–10 pagine», nessun SMTP descritto come attivo. Esito attuale: **7 dati ancora da confermare** (non 10), nessun problema di coerenza.

## 2. Verifiche eseguite il 10 novembre (sola lettura)

- **Cookie in produzione**: nessuna intestazione `Set-Cookie` su home, privacy e grazie. Il sito usa solo `dlp_cookie_consent` (archiviazione locale, 180 giorni) e `promo_seen_<mese>` (archiviazione di sessione); nessun altro uso di `localStorage`/`sessionStorage`/`document.cookie` nel codice.
- **Google Analytics**: `G-Z8PEVWKQVB` caricato da `Analytics.tsx` solo con consenso «granted»; con «denied» o nessuna scelta viene impostato `ga-disable` e i cookie `_ga*` rimossi. Coerente con la Cookie Policy.
- **Banner**: «Accetta» e «Rifiuta» con identico stile; pulsante «Preferenze cookie» fisso in basso a sinistra quando il banner è chiuso.
- **Servizi esterni realmente usati**: FormSubmit (azione del modulo), Brevo (`/api/newsletter`), Google Analytics, Vercel (hosting). Nessun altro script, pixel, iframe, font esterno (i font sono serviti dal sito). Sanity non è contattato dal browser.
- **Link Amazon**: tutti i 9 link `amzn.to` rimandano ad Amazon con il tag di affiliazione Associates; la dichiarazione è già nella pagina Pubblicazioni. Ora è anche nei Termini e nella Cookie Policy. I 6 link `amazon.it` diretti non hanno tag.
- **Google**: dichiara l'adesione al Data Privacy Framework (documentazione Google); **Brevo e FormSubmit**: informazioni pubbliche su sede e garanzie non verificabili — i testi lo dicono senza inventare nulla.

## 3. Newsletter (Brevo): il messaggio non corrisponde al codice

**Verificato nel codice (nessuna modifica fatta):**
- `NewsletterMini.tsx` (nel footer della home) invia solo l'email a `/api/newsletter`, che chiama `POST /v3/contacts` con `listIds` e `updateEnabled: true`.
- **Non esiste double opt-in** (nessuna chiamata a `/v3/contacts/doubleOptinConfirmation`, nessun modello DOI) e **nessuna casella di consenso**.
- Dopo l'iscrizione il sito mostra «Grazie per esserti iscritto. **Controlla la tua email per confermare.**» e l'API risponde «Iscrizione completata. Controlla la tua email.». Se in Brevo non c'è un'automazione che invia comunque un'email, **nessuna conferma arriverà**: il messaggio è fuorviante. Questo si vede solo dall'account Brevo (non accessibile; nessuna email di prova inviata).
- `NewsletterBox.tsx` (con testo «…conferma l'iscrizione alla newsletter») non è usato da nessuna pagina.
- Il consenso non è documentato: non si registrano data, testo accettato né origine oltre a quanto Brevo salva sul contatto (art. 7, par. 1 GDPR: il titolare deve poter dimostrare il consenso). La nota sotto il modulo rimanda alla Privacy Policy ma non chiede un'azione esplicita.
- `updateEnabled: true` aggiorna un contatto già presente invece di segnalarlo: nessun effetto sulla privacy, ma va saputo.

**Testi corretti proposti (da applicare in una modifica separata della newsletter):**
- *Se non si introduce il double opt-in* — conferma: «Grazie, l'iscrizione è registrata. Puoi annullarla in qualsiasi momento scrivendo a contatti@dentroleparole.com.» (aggiungere «o dal link in fondo a ogni email» solo dopo aver verificato che le email di Brevo lo contengano); nota sotto il modulo: «Iscrivendoti acconsenti a ricevere la newsletter di Dentro le Parole. Informazioni sul trattamento dei dati nella Privacy Policy.»
- *Se si introduce il double opt-in (consigliato)* — si può mantenere il messaggio attuale, dopo aver creato il modello DOI in Brevo e usato l'endpoint di conferma; così il consenso risulta documentato.

La Privacy Policy è già scritta in modo valido per entrambi i casi (consenso, revoca scrivendo alla titolare).

## 4. Cosa serve dalla titolare (solo l'indispensabile)

Sono 7 dati, raggruppati in 4 domande. Finché mancano, le pagine mostrano il riquadro giallo «DA CONFERMARE» e lo script di controllo fallisce (blocca il merge).

1. **Identità professionale.** (a) Indirizzo di domicilio o sede professionale; (b) ha partita IVA? Se sì, quale. *(serve per l'informativa e per le informazioni obbligatorie del sito, art. 7 D.Lgs. 70/2003)*
2. **Conservazione.** Per quanto tempo tiene (a) richieste e anteprime quando non nasce un incarico, (b) manoscritti e materiali dopo la fine di un incarico? *(contenuto obbligatorio dell'informativa; non è deciso da me. Esempi che può scegliere: «12 mesi dall'ultimo contatto»; «24 mesi dalla consegna». Se preferisce non fissare un numero, l'alternativa ammessa è indicare il criterio: «per il tempo necessario a gestire la richiesta e l'eventuale incarico, e poi per il tempo richiesto da obblighi di legge o per tutelare un diritto»)*
3. **Chi accede ai testi.** (a) Collaboratori o fornitori (voci per audiolibri, altri editor, ecc.) hanno accesso ai manoscritti: sì o no? (b) Usa strumenti di intelligenza artificiale sul contenuto dei manoscritti: sì o no, e quali?
4. **Google Analytics.** Nel pannello (Admin → Impostazioni dati → Conservazione dei dati) la conservazione è impostata a 2 o a 14 mesi?

**Non bloccanti (consigliati, non necessari alla pubblicazione):** la newsletter ha un link per disiscriversi in ogni email? Con che frequenza si scrive? Si vuole attivare il double opt-in (§3)? Come vengono comunicate le informazioni precontrattuali e il recesso ai clienti privati (nel preventivo)? Il telefono/WhatsApp viene usato per contattare i clienti? Cosa si intende per «giorni lavorativi» in periodi di chiusura?

## 5. Cosa cambia nei testi quando si attiverà il modulo SMTP (PR #7)

Il testo di ora descrive **solo FormSubmit**. All'attivazione (`NEXT_PUBLIC_CONTACT_BACKEND=api`) vanno aggiornati, nello stesso rilascio:
- **Privacy §3 (ultimo paragrafo) e §6**: eliminare FormSubmit; indicare che richiesta e anteprima sono ricevute dal server del sito (Vercel, regione fra1), elaborate solo in memoria e inviate per email a Register.it, senza copie sul sito. Il testo proposto è in `docs/contact-form/README.md` §9 della PR #7.
- **Privacy §6 (Vercel)**: oggi «non riceve i dati del modulo» → diventerebbe falso.
- **Privacy §7 e §8**: eliminare le righe su FormSubmit (trasferimenti, 30 giorni).
- **Cookie Policy §5**: eliminare il primo paragrafo su FormSubmit.
- Il limite dell'allegato cambia da 8 a 4,4 MB (le pagine legali non riportano più la misura, per non doverla aggiornare).

Rimane vero in entrambi i casi l'inoltro verso il Gmail personale (scelta consapevole della titolare, già dichiarata).

## 6. Prima del merge

1. Risolvere i 7 dati del §4 (`node scripts/check-legal-placeholders.mjs` deve finire con «nessun segnaposto residuo»).
2. Far leggere i testi a un professionista (basi giuridiche, ruoli dei fornitori, trasferimenti, clausole verso i consumatori).
3. Decidere l'ordine con la PR #7: la nota «Inviando la richiesta…» sotto il pulsante è stata posizionata in modo che le due PR si fondano senza conflitti (verificato con una simulazione di merge). Le pagine legali parlano di «anteprima»: il modulo di `main` dice ancora «estratto» finché non entra la PR #7.
4. Aggiornare la data «Ultimo aggiornamento» in `legal.ts` al giorno della pubblicazione.
5. Fuori da questa PR: link a Privacy e Cookie nel piè di pagina di tutte le pagine (oggi il footer è solo in home; il pulsante «Preferenze cookie» e il banner rimandano comunque alle policy).
