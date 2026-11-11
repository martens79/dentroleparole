# Piano di collaudo del nuovo modulo contatti

> **Stato:** la parte automatica e quella locale con SMTP simulato sono **eseguite e superate** (§1). Il collaudo **reale** è preparato ma **non eseguito**: nessuna email vera è stata inviata e nessuna partirà senza un'autorizzazione esplicita. Il modulo in produzione resta FormSubmit.

## 1. Collaudo già eseguito (nessuna email reale)

| Cosa | Esito |
|---|---|
| `npm run test:contact`: 55 test con SMTP simulato (validatori, token, rate limiting, configurazione, trasporto, intero percorso della richiesta, **controlli statici di sicurezza**) | 55/55 |
| Controlli statici: nessun `.env`/chiave tracciati; nessun segreto letterale nel codice; `.env.example` con valori vuoti; il codice dell'endpoint non scrive su disco né su archivi; i log sono solo `{ event, code }`; interruttore predefinito = FormSubmit e nessun file lo imposta su `api` | superati (provati anche con 4 violazioni inserite apposta: tutte intercettate) |
| `npm run collaudo:contact -- local …`: **19 casi** contro un build locale con server SMTP finto su loopback; **8 email** ricevute dal server finto, ciascuna con allegato identico (SHA-256), compreso il file alla soglia di 4.461.210 byte, oggetto invariato, avviso per il PDF con contenuti attivi, nessuna intestazione `Bcc` creata dall'iniezione | tutto come atteso |
| `npm run collaudo:contact -- ratelimit …`: con i limiti predefiniti la richiesta n. 4 dallo stesso IP riceve 429 (le prime 3 passano); nessuna email (richieste "trappola") | OK |
| Log del sito durante tutta la matrice (19 richieste, 8 invii, rifiuti inclusi) e durante la prova del limite | **nessun dato personale, nessun segreto, nessun nome file** |
| Modulo in modalità predefinita: markup identico a quello in produzione (3.220 caratteri, confronto carattere per carattere) | identico |

## 2. Il collaudo reale (preparato, NON eseguito)

### 2.1 Cosa serve prima (autorizzazioni e destinatari)
Compila e conferma **per iscritto**:
- **Destinatario di prova** (`CONTACT_TO` in Preview): un indirizzo del proprietario, non quello di Donatella. Per la prova di recapito fino a Gmail: indicare se si autorizza una sola email di prova su `contatti@dentroleparole.com` (che l'inoltro porta a Gmail di Donatella) e **chi avvisa Donatella**.
- **Indirizzo "mittente" del visitatore di prova** (finirà in Reply-To): un indirizzo del proprietario.
- Quante email di prova sono autorizzate (la matrice ne produce **8**; si possono ridurre).
- Che i prerequisiti di `GUIDA_CONFIGURAZIONE.md` §1-§3 siano stati completati dal proprietario (casella, variabili in **Preview**, DKIM).
- Conferma di Register.it sui punti di `RICHIESTA_ASSISTENZA_REGISTER.md` (almeno invio da applicazioni e quota).

### 2.2 Perché la Preview si prova dal browser
Le Preview di Vercel sono protette da login (Vercel Authentication): un programma da terminale non può raggiungerle senza una "protection bypass" (una configurazione di progetto **non autorizzata**). Perciò il collaudo della Preview si fa **dal browser, da loggato**, usando il modulo vero e gli allegati sintetici.

1. Genera gli allegati: `npm run collaudo:contact -- generate --out collaudo-files` (file con testo inventato e impronta SHA-256 stampata).
2. Apri la Preview del ramo `feat/contact-endpoint-smtp-2026` (con `NEXT_PUBLIC_CONTACT_BACKEND=api` impostata **solo in Preview**).
3. Esegui i casi della tabella §2.3 compilando il modulo e caricando i file indicati nel riquadro **"Anteprima del manoscritto (facoltativa)"** (pulsante "Allega anteprima"). Annota esito e messaggio mostrato.
4. Controlla la casella di prova per i casi che devono inviare.

### 2.3 Casi

| # | Caso | File | Atteso nel browser | Atteso in casella |
|---|---|---|---|---|
| 1 | PDF valido | `pdf__Bozza_di_prova_(v1).pdf` | pagina Grazie | 1 email, allegato apribile, SHA-256 uguale |
| 2 | DOCX valido | `docx__…` | Grazie | 1 email con allegato |
| 3 | DOC valido | `doc__…` | Grazie | 1 email con allegato |
| 4 | Senza allegato | — | Grazie | 1 email senza allegato |
| 5 | File alla soglia (4.461.210 byte) | `limit__…` | Grazie | 1 email, allegato integro |
| 6 | Nome file speciale | `special__…` | Grazie | 1 email, nome ripulito ("è già…"; `—`/`#` sostituiti) |
| 7 | PDF con elementi attivi | `active__…` | Grazie | 1 email con oggetto "[ATTENZIONE: allegato da verificare]" |
| 8 | File oltre la soglia | `over__…` | "Il file è troppo grande. Massimo 4,4 MB." | nessuna |
| 9 | Corpo oltre il limite Vercel | `platform__…` | stesso messaggio (controllo nel browser) | nessuna |
| 10 | Estensione non ammessa / doppia | `exe__…`, `double__…` | "Formato file non valido…" | nessuna |
| 11 | Testo rinominato `.pdf` | `fake__…` | "Il file non risulta un PDF, DOC o DOCX valido." | nessuna |
| 12 | DOCX con macro | `macro__…` | "Il file contiene macro…" | nessuna |
| 13 | Email non valida | — | campi evidenziati | nessuna |
| 14 | Invio ripetuto più di `CONTACT_RATE_IP_MAX` volte in 10 minuti | — | "Troppe richieste…" | nessuna oltre il limite |
| 15 | Password SMTP errata (variabile Preview cambiata di proposito, poi ripristinata) | — | "Non è stato possibile inviare… scrivi a contatti@…" | nessuna; nei log solo `contact_send_failed` + codice `EAUTH` |

### 2.4 Verifica del recapito (a mano, sulla casella di prova e su Gmail)
- Arriva in **posta in arrivo** (non spam)? Allegato apribile e uguale all'impronta SHA-256?
- Aprendo "Mostra originale" in Gmail: **SPF: PASS**, **DKIM: PASS** (se attivato), **DMARC: PASS**.
- `Reply-To` è l'indirizzo del visitatore; il mittente è la casella `form@`; oggetto "Nuova richiesta dal sito Dentro le Parole".
- Nei **log di Vercel** (Observability / Logs del deployment): nessun nome, email, testo o nome di file.
- Quota: dopo il collaudo controlla in Area Clienti/assistenza quanti invii sono stati conteggiati.

### 2.5 Collaudo automatico reale (solo dopo attivazione o con bypass autorizzato)
Dopo l'attivazione in produzione, o se autorizzi una protection bypass per la Preview, lo stesso programma può eseguire la matrice contro il sito reale. **Non parte** senza:

```
COLLAUDO_CONFIRM=INVIA_EMAIL_REALI
COLLAUDO_REPLY_TO=<indirizzo di un destinatario autorizzato>
npm run collaudo:contact -- real --base https://www.dentroleparole.com
```

Il programma rifiuta qualunque altro uso verso siti non locali e stampa, per ogni email attesa, nome, dimensione e SHA-256 dell'allegato da confrontare a mano. **Va autorizzato esplicitamente** perché invia email vere.

## 3. Come ripetere la parte locale (nessuna email reale)
1. Compila e avvia il sito con interruttore `api` e un SMTP locale (valori fittizi, mai reali):
   ```
   NEXT_PUBLIC_CONTACT_BACKEND=api npm run build
   SMTP_HOST=127.0.0.1 SMTP_PORT=47002 SMTP_ALLOW_PLAINTEXT_LOOPBACK=true \
   SMTP_USER=form@example.test SMTP_PASS=<valore finto> CONTACT_TO=contatti@example.test \
   CONTACT_FORM_SECRET=<32+ caratteri finti> CONTACT_RATE_IP_MAX=100 CONTACT_RATE_INSTANCE_MAX=1000 \
   npx next start -p 3199
   ```
2. In un altro terminale: `npm run collaudo:contact -- local --base http://localhost:3199 --smtp-port 47002`.
3. Per il limite di richieste: riavvia **senza** `CONTACT_RATE_IP_MAX`/`CONTACT_RATE_INSTANCE_MAX` ed esegui `… -- ratelimit --base http://localhost:3199`.

## 4. Criteri di accettazione per l'attivazione
- Risposte scritte di Register.it: invio da applicazioni consentito; quota reale sufficiente (almeno qualche decina al giorno); antispam che non blocca gli allegati ammessi; inoltro verso Gmail funzionante.
- Tutti i casi 1-15 come da tabella; recapito in posta in arrivo su Gmail con SPF/DKIM/DMARC PASS.
- Log di Vercel privi di dati personali.
- Regola WAF di rate limiting creata (con tua autorizzazione) oppure rischio accettato per iscritto.
- Informativa aggiornata pronta per essere pubblicata insieme all'attivazione.

**Interrompere e tornare a FormSubmit** se: quota o permessi non confermati; messaggi in spam; allegati bloccati; qualsiasi dato personale nei log.

## 5. Registro del collaudo (da compilare)
| Data | Caso | Esito | Note |
|---|---|---|---|
| | | | |
