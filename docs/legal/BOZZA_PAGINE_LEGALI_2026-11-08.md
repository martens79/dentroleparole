# Pagine legali — dati da confermare e bozza (8 novembre 2026)

> **Documento di lavoro, non pubblicato sul sito.** Contiene solo informazioni tecniche verificate nel codice e sul sito online, più elenchi di dati che **può fornire soltanto la titolare**. Non è una consulenza legale e non attesta alcuna conformità: le pagine vanno riviste da un professionista qualificato prima di considerarle definitive.

## 1. Servizi esterni effettivamente presenti (verificati)

| Servizio | Cosa fa nel sito | Dati coinvolti | Cookie / archiviazione nel browser | Dove verificato |
|---|---|---|---|---|
| Google Analytics 4 (ID `G-Z8PEVWKQVB`) | Statistiche di utilizzo | Dati di navigazione, identificativi online | `_ga`, `_ga_Z8PEVWKQVB`. **Prima di questa PR venivano impostati al primo caricamento, senza consenso** (verificato dal vivo). Ora solo dopo "Accetta" | `src/components/Analytics.tsx` |
| FormSubmit (`formsubmit.co`) | Il form di contatto invia dati e allegati (PDF/DOC/DOCX, max 8 MB) a questo servizio, che li inoltra via email a `contatti@dentroleparole.com` | Nome, email, titolo, genere, parole, obiettivo, messaggio, allegato | Nessuno verificato | `src/components/ContactForm.jsx` |
| Brevo | Iscrizione newsletter, chiamata fatta dal server del sito (`/api/newsletter`) | Indirizzo email | Nessuno nel browser | `src/app/api/newsletter/route.ts` |
| Vercel | Hosting | Dati tecnici di connessione (es. IP nei log) | Nessuno verificato | Header `Server: Vercel` |
| Sanity | CMS del blog; le immagini passano dal server del sito (`/_next/image`) | Nessun dato dei visitatori trasmesso dal browser | Nessuno | HTML del sito online |
| Google Fonts | **Non contattato a runtime**: i font sono incorporati in fase di build e serviti dal sito | — | — | HTML del sito online (nessuna richiesta a `fonts.googleapis.com`) |
| Link esterni (Amazon, Instagram, editori, MartensLab) | Solo link in uscita; nessun incorporamento | — | Cookie eventuali solo dopo il click, sui siti di destinazione | Codice |

Altri tracciamenti: nessun pixel pubblicitario, nessun iframe, video o mappa incorporati (ricerca nel codice).

Archiviazione tecnica nel browser: `dlp_cookie_consent` (localStorage, scelta sui cookie, 180 giorni) e `promo_seen_<mese>` (sessionStorage, per non ripetere il popup promozionale nella stessa sessione).

## 2. Cosa è stato sistemato nelle pagine

- Email di contatto compilata con `contatti@dentroleparole.com` (indirizzo già pubblicato nel footer e destinatario del form). **Da confermare** che sia anche il recapito privacy.
- Cookie Policy: descritto Google Analytics, il consenso preventivo, la revoca, la conservazione della scelta e l'assenza di cookie di profilazione/marketing propri (verificata tecnicamente). Rimosso il testo generico su mappe, video e plugin social non presenti.
- Privacy Policy: aggiunta sezione "Servizi di terze parti" (FormSubmit, Brevo, Google Analytics, Vercel) e rimando alla Cookie Policy. Nessun dato inventato.
- Collegamenti incrociati tra Privacy, Cookie e Termini; canonical e metadati.
- Link all'informativa sotto il modulo di contatto e la newsletter.

## 3. Dati che solo la titolare può fornire

**Indispensabili**
1. **Indirizzo o sede professionale** del titolare (resta il segnaposto `[inserire indirizzo o sede professionale]` nella Privacy Policy, volutamente non compilato).
2. **Conferma del recapito privacy** (`contatti@dentroleparole.com` o un altro indirizzo).
3. **Forma giuridica e dati fiscali**, se richiesti per la sua attività (es. partita IVA / regime): non presenti nelle pagine e non inventati. Verificare con il commercialista se vanno indicati sul sito.

**Da definire per completare l'informativa (art. 13 GDPR)** — nessuno di questi è presente oggi
4. **Base giuridica** per ciascuna finalità (richieste dell'utente, adempimenti di legge, newsletter, statistiche).
5. **Tempi di conservazione**: messaggi e allegati ricevuti dal form, email inviate, iscritti alla newsletter, eventuali manoscritti ricevuti.
6. **Destinatari e responsabili del trattamento** (FormSubmit, Brevo, Vercel, provider email ecc.) e **eventuali trasferimenti verso Paesi extra-UE** con le relative garanzie (da verificare sui contratti/DPA dei fornitori).
7. **Diritti dell'interessato** e modalità di esercizio; diritto di reclamo al Garante.
8. **Trattamento dei manoscritti e degli allegati**: chi li legge, dove vengono conservati, per quanto tempo, se vengono cancellati a fine incarico; clausola di riservatezza (il sito afferma già "riservatezza garantita").
9. **Newsletter**: testo di consenso, finalità, modalità di disiscrizione, mittente.

**Incoerenze da risolvere**
- La Privacy Policy cita il **numero di telefono** tra i dati trattati, ma il form non lo richiede (potrebbe arrivare solo nel testo del messaggio): confermare se tenerlo.
- Il messaggio dopo l'iscrizione alla newsletter dice "Controlla la tua email per confermare", ma il codice aggiunge il contatto a Brevo senza conferma esplicita (double opt-in): verificare la configurazione di Brevo oppure correggere il messaggio.
- I Termini di servizio non trattano la proprietà dei manoscritti inviati, i limiti dell'attività editoriale, compensi/preventivi: eventuale contenuto da concordare.
- Il sito di FormSubmit va "attivato" con l'email destinataria: verificare che le richieste arrivino davvero (non testato: nessun form inviato).

## 4. Aspetti da sottoporre a un consulente legale

- Se la formula del banner, i testi e i 180 giorni di durata della scelta sono adeguati (si è scelto un rinnovo semestrale in linea con le prassi diffuse: va confermato).
- Se l'uso di Google Analytics 4 (con eventuale trasferimento dati verso gli USA) richieda ulteriori accorgimenti o una configurazione specifica (es. durata di conservazione, IP, Consent Mode).
- Adeguatezza dell'informativa privacy completa e dei contratti con i fornitori (DPA).
- Eventuale informativa sull'uso dei link di affiliazione Amazon (`amzn.to`) presenti nella pagina Pubblicazioni: da valutare se serve una dichiarazione di affiliazione.

## 5. Bozza di struttura per l'informativa completa (da compilare)

1. Titolare del trattamento — nome, sede **[DA CONFERMARE]**, email **[DA CONFERMARE]**.
2. Tipologie di dati trattati — (già presente; verificare il telefono).
3. Finalità e basi giuridiche — **[DA CONFERMARE per ciascuna finalità]**.
4. Destinatari e responsabili — FormSubmit, Brevo, Vercel, Google (analytics) **[DA CONFERMARE ruoli e DPA]**.
5. Trasferimenti extra-UE — **[DA CONFERMARE]**.
6. Periodo di conservazione — **[DA CONFERMARE]**.
7. Diritti dell'interessato e reclamo al Garante — **[testo da validare]**.
8. Cookie — rimando alla Cookie Policy (presente).
9. Aggiornamenti dell'informativa — (presente nelle altre pagine).
