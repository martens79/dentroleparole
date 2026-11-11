# Guida alla configurazione sicura (Register.it e Vercel)

> **Nulla di questa guida è stato eseguito.** Nessuna casella, DNS, credenziale o variabile d'ambiente è stata creata o modificata. Ogni passo lo fa il proprietario del dominio, **direttamente nei pannelli di Register.it e Vercel**.
>
> **Regola d'oro: nessuna password o chiave va scritta in chat, in email, in un file del repository o in uno screenshot.** Si generano nel proprio computer (o in un gestore di password), si copiano negli appunti e si incollano direttamente nel campo del pannello. Se un segreto finisce in un posto sbagliato, va considerato compromesso e sostituito (§6).

I nomi dei pulsanti sono quelli letti dalla documentazione ufficiale di Register.it e dal pannello Vercel il 9 novembre 2026; possono cambiare nel tempo.

## 0. Prima di iniziare
1. Servono: accesso all'**Area Clienti Register.it** e all'account **Vercel** del progetto `dentroleparole`.
2. Attiva l'**autenticazione a due fattori** sull'Area Clienti (l'accesso a caselle email e DNS è un'area sensibile: Register.it chiede un codice OTP via email/WhatsApp o un'app Authenticator; guida: `register.it/help/autenticazione-a-due-fattori/`) e su Vercel.
3. Tieni a portata un **gestore di password** per conservare la password della casella.
4. Decidi **chi riceve i messaggi di prova** (vedi `COLLAUDO.md`): un indirizzo del proprietario, non quello di Donatella, finché il collaudo non è concluso.

## 1. Register.it: creare la casella di invio

Scopo: una casella **dedicata solo all'invio** dal sito (es. `form@dentroleparole.com`), distinta dalla casella `contatti@` e dall'account Gmail di Donatella. Così, se la password esce, si cambia senza toccare la posta vera.

**Quante caselle hai?** Con il dominio Register.it include 3 caselle da 2 GB. Controlla in Area Clienti > dominio > **Email** quante ne sono già usate. Se sono tutte occupate, una quarta è a pagamento (prezzi sulla pagina Email di Register.it: non verificati qui) oppure si può riutilizzare la terza assegnando il nuovo uso.

**Passi** (da `register.it/assistenza/attivare-email/`):
1. Entra nell'**Area Clienti**.
2. Nella colonna di destra, in *Domini e prodotti*, clicca sul dominio `dentroleparole.com`.
3. Clicca l'icona **Email**.
4. Clicca **Crea**, scrivi il nome della casella (`form`) e la password, poi **Crea** di nuovo. *L'indirizzo non si può modificare dopo la creazione.*

**Password** (regola Register.it per le caselle: almeno 8 caratteri, lettere e numeri, almeno una maiuscola; simboli consigliati `! @ . = , - %`). Scegline una **lunga e casuale (24 caratteri)**. Per generarla senza mostrarla a schermo, in PowerShell 7:

```powershell
$a = [char[]]('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@.=,-%')
-join (1..24 | ForEach-Object { $a[[System.Security.Cryptography.RandomNumberGenerator]::GetInt32($a.Length)] }) | Set-Clipboard
```

Incolla subito la password nel campo di Register.it e **salvala nel gestore di password**. Poi svuota gli appunti (copia una parola qualsiasi).

**Verifica del login** (facoltativa, senza inviare nulla): accedi al webmail con la nuova casella per controllare che la password funzioni.

**Non** attivare inoltri, filtri o risposte automatiche su questa casella. **Non** modificare l'inoltro esistente di `contatti@` verso Gmail.

## 2. Register.it: autenticazione dei messaggi (SPF, DKIM, DMARC)

Gmail può rifiutare messaggi senza autenticazione (errore `550-5.7.26`): servono SPF e/o DKIM. Il dominio ha già SPF corretto per Register.it (`v=spf1 include:spf.webapps.net ~all`). Passi nel pannello (`register.it/help/spf-dkim-gmail/`, `…/email-configurazione-dmarc/`). **Sono modifiche DNS: farle solo dopo aver deciso**, una alla volta.

1. **SPF**: Area Clienti > dominio > **Email** > **Azioni** > **SPF**. Deve dire "Spf impostato correttamente". Se dice "diverso dallo standard Register", non modificarlo e segnalalo all'assistenza.
2. **DKIM**: **Email** > **Azioni** > **DKIM** > sposta l'interruttore su **ON** e chiudi il popup. (Register.it non dichiara il nome del selettore né se firma automaticamente: vedi le domande per l'assistenza.)
3. **DMARC**: **Email** > **Azioni** > **DMARC**. Per iniziare, il valore base consigliato da Register.it è `v=DMARC1; p=none; pct=100; ri=86400` (solo osservazione: non blocca nulla). Non passare a `p=quarantine` o `p=reject` finché i report non mostrano che tutto è allineato.

## 3. Vercel: variabili d'ambiente (prima solo Preview)

Percorso: Vercel > progetto **dentroleparole** > **Settings** > **Environment Variables** > **Add Environment Variable**.

Nel pannello di aggiunta (verificato in sola lettura, senza salvare nulla) i campi sono: **Type** (*Secret*: "non puoi rivelare il valore dopo il salvataggio, per password, chiavi e token"; *Config*: "leggibile dopo il salvataggio, per valori non sensibili"), **Key**, **Value**, **Note**, **Environments** e **Save**.

> ⚠️ **Attenzione:** il menu **Environments** mostra come selezione iniziale **Production**. Per il collaudo deve essere selezionato **solo Preview** (e, se il pannello lo propone, il ramo `feat/contact-endpoint-smtp-2026`). **Non** selezionare Production finché non si decide l'attivazione.

Variabili esistenti oggi nel progetto (non vanno toccate): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `BREVO_API_KEY` (segnalata dal pannello come *Needs Attention*: conviene controllarla, è fuori da questa modifica), `BREVO_LIST_ID`. Nessuna variabile `SMTP_*`, `CONTACT_*` o `NEXT_PUBLIC_CONTACT_BACKEND` esiste: la produzione continua a usare FormSubmit.

### Variabili da creare per il collaudo in Preview

| Key | Type | Value | Environments |
|---|---|---|---|
| `SMTP_USER` | Config | l'indirizzo completo della casella di invio (es. `form@dentroleparole.com`) | Preview |
| `SMTP_PASS` | **Secret** | la password della casella (incollata dagli appunti) | Preview |
| `CONTACT_FORM_SECRET` | **Secret** | chiave casuale (vedi sotto) | Preview |
| `CONTACT_TO` | Config | **l'indirizzo di prova autorizzato** (non quello di Donatella) | Preview |
| `CONTACT_RATE_IP_MAX` | Config | `50` (solo per il collaudo, così non si blocca da solo) | Preview |
| `NEXT_PUBLIC_CONTACT_BACKEND` | Config | `api` | **Preview** (solo per il collaudo) |

`SMTP_HOST` e `SMTP_PORT` **non** vanno impostate: i predefiniti sono già `authsmtp.securemail.pro` e `465`.

**Chiave `CONTACT_FORM_SECRET`** (almeno 32 caratteri casuali). In PowerShell 7, senza mostrarla:

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48)) | Set-Clipboard
```

Incolla nel campo **Value** con Type **Secret**, poi svuota gli appunti.

Dopo il salvataggio **serve un nuovo deployment** della Preview perché le variabili abbiano effetto (basta un nuovo push sul ramo, oppure *Redeploy* dal pannello del deployment).

## 4. Regola di rate limiting nel WAF (solo dopo autorizzazione)

Il limite nel codice vale per singola istanza; quello solido è del WAF. Vercel > progetto > **Firewall** > **Rules** > nuova regola personalizzata (i nomi possono variare):
- condizioni: *Request Path* uguale a `/api/contatti` **e** *Method* uguale a `POST`;
- azione: **Rate Limit**, chiave **IP**, finestra **10 minuti**, soglia **10 richieste**, risposta **429/deny**;
- salva e pubblica solo quando il piano di collaudo lo prevede. Nella documentazione Vercel il rate limiting WAF è disponibile su tutti i piani e il piano Pro consente fino a 40 regole.

## 5. Attivazione in produzione (solo dopo il collaudo e la tua autorizzazione)

Ordine consigliato, tutto a cura del proprietario:
1. Conferma scritta di Register.it e collaudo superato (`COLLAUDO.md`).
2. Crea le stesse variabili per **Production** con `CONTACT_TO` = `contatti@dentroleparole.com` (oppure lascia il valore predefinito). **Non** impostare `CONTACT_RATE_IP_MAX` in produzione.
3. Pubblica l'informativa aggiornata (testo proposto nel README §9) **insieme** all'attivazione.
4. Imposta `NEXT_PUBLIC_CONTACT_BACKEND=api` per **Production** e fai un nuovo deploy.
5. Un invio reale concordato fino a Gmail; osserva i log di Vercel e la casella per 48 ore.

**Rollback**: Instant Rollback al deployment precedente (secondi), oppure rimetti `NEXT_PUBLIC_CONTACT_BACKEND` a `formsubmit` (o eliminala) e rifai il deploy.

## 6. Se un segreto è finito nel posto sbagliato, o a rotazione periodica
1. Register.it: Area Clienti > dominio > **Email** > accanto alla casella **Azioni** > **Modifica password**: scegline una nuova (con il comando del §1).
2. Vercel: modifica la variabile `SMTP_PASS` (i *Secret* non si possono rileggere: si reinserisce il valore) e rifai il deploy.
3. Per `CONTACT_FORM_SECRET`: genera un nuovo valore e rifai il deploy (i moduli aperti in quel momento dovranno essere ricaricati).
4. Se il segreto è finito in un repository, considera la cronologia compromessa anche dopo averlo rimosso: la rotazione è obbligatoria.

## 7. Cosa NON fare
- Non scrivere password, chiavi o codici OTP in chat, ticket, commenti delle PR, screenshot.
- Non usare la casella personale di Donatella per l'invio.
- Non impostare variabili per Production prima dell'autorizzazione; non lasciare `Production` selezionato per errore.
- Non attivare `NEXT_PUBLIC_CONTACT_BACKEND=api` in Production prima del collaudo.
- Non togliere FormSubmit dal codice finché il nuovo flusso non è stabile.
