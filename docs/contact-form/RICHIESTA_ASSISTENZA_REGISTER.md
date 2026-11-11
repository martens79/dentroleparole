# Richiesta all'assistenza Register.it (BOZZA, NON INVIATA)

> Da inviare **solo dopo la tua autorizzazione** e dall'Area Clienti del titolare del dominio.
> Come: Area Clienti > pannello di controllo > **Richiedi assistenza** > descrizione > **Contatta il team di supporto** (articolo `register.it/help/ticket-assistenza-tecnica/`). In alternativa, telefono 035 5787979 (ogni giorno 9:00-18:00, numero indicato nella pagina "Contattaci"; un'altra pagina riporta 035 630 5561: usa quello della pagina "Contattaci"). La documentazione non indica un indirizzo email di assistenza né un canale preferito per le questioni tecniche sulla posta.
> **Non scrivere nel ticket password o codici**: nessuna è necessaria.

## Perché serve
Le pagine pubbliche di Register.it si contraddicono o tacciono su punti da cui dipende la messa in produzione del nuovo modulo contatti. Contraddizioni trovate:
1. **Quota giornaliera**: "500 invii al giorno" per le caselle Personal (pagina *Invii SMTP da client consentiti*) contro "50 invii gratuiti al giorno" per casella (pagina *Aumenta i limiti di invio*); la stessa pagina riporta nel titolo "50".
2. **Antispam/antivirus in ingresso**: le condizioni del servizio lo dicono incluso per le 3 caselle del dominio; la pagina prodotto dice che nel piano base è solo in uscita.
3. **Dove si imposta SPF**: Email > Azioni > SPF in una guida; Dominio & DNS > Configurazione DNS > Gestione avanzata in un'altra.
4. **DKIM**: una guida lo presenta come alternativa a SPF, un'altra come requisito per Gmail; il selettore non è indicato.
Silenzi: invio da applicazioni/siti web, inoltro automatico, limiti per minuto o connessioni, blocco dopo autenticazioni fallite, dimensione massima in ricezione.

## Testo proposto

**Oggetto:** Uso dell'SMTP autenticato da un modulo di contatto del sito (dentroleparole.com) — chiarimenti su limiti, inoltro e DKIM

Buongiorno,

sono il titolare del dominio **dentroleparole.com** (posta e DNS su Register.it). Stiamo sostituendo un servizio esterno di invio dei moduli con un invio diretto dal nostro sito, usando una casella dedicata del dominio e il vostro SMTP autenticato (`authsmtp.securemail.pro`, porta 465, SSL/TLS). Il sito è ospitato su Vercel (funzioni serverless in regione europea, indirizzi IP dinamici). Prima di attivarlo vorrei conferme scritte sui punti seguenti, perché le pagine di assistenza non sono univoche.

**Come usiamo l'SMTP:** un solo messaggio per ogni richiesta del modulo, **un solo destinatario** (la casella `contatti@dentroleparole.com` dello stesso dominio), con un allegato opzionale (PDF/DOC/DOCX) fino a circa **4,4 MB**. Volume previsto: poche decine di messaggi al mese, con possibili picchi dovuti a spam che cerchiamo di filtrare a monte.

1. **Uso da un'applicazione web.** L'invio via SMTP autenticato da un'applicazione/funzione serverless (non da un client di posta o dal webmail) è consentito dalle condizioni del servizio per le caselle incluse con il dominio? Ci sono restrizioni per provenienza geografica o per indirizzi IP di provider cloud?
2. **Quota giornaliera reale** di invii per la nostra casella: 500, 50 o altro? Come viene conteggiata (per messaggio o per destinatario)? Cosa succede al superamento (errore SMTP restituito? fino a quando dura il blocco?) e come possiamo verificare il valore effettivo dall'Area Clienti?
3. **Limiti di velocità e connessioni:** esistono limiti per minuto/ora, per connessioni simultanee, o un blocco temporaneo dopo tentativi di autenticazione falliti?
4. **Dimensione massima del messaggio (allegati compresi)** per le caselle incluse, in **invio** e in **ricezione**: la pagina di confronto indica 30 MB. Confermate?
5. **Antispam/antivirus**: per le nostre 3 caselle incluse sono attivi in **ingresso** e in **uscita**? Un messaggio con allegato PDF/DOC/DOCX può essere bloccato o messo in quarantena? In quel caso quale errore riceve il mittente e come si sblocca?
6. **Inoltro automatico** della casella `contatti@dentroleparole.com` verso un indirizzo Gmail (già attivo): come si configura e verifica dal pannello? Resta una copia nella casella? Il mittente originale viene preservato o riscritto? Come vengono gestiti SPF/DKIM/ARC per garantire la consegna a Gmail? L'inoltro conta nella quota di invii? Ci sono limiti di dimensione per i messaggi inoltrati?
7. **DKIM**: i messaggi inviati via SMTP dalle caselle del dominio sono firmati automaticamente? Con l'interruttore DKIM su ON, qual è il **selettore** e quale record DNS viene creato? Tempi di propagazione? Confermate che l'SPF `v=spf1 include:spf.webapps.net ~all` è quello corretto per l'invio SMTP e dal webmail?
8. **Certificato del server SMTP:** il server presenta un certificato con CN `smtp.mail.webnode.com` e SAN `*.securemail.pro` (Sectigo). È corretto e stabile per `authsmtp.securemail.pro`? Preferite che ci colleghiamo a un altro nome host?
9. **Trattamento dei dati personali (GDPR):** come possiamo ottenere la **nomina a responsabile del trattamento** (art. 28) per il servizio di posta, e dove sono ubicati i server e i backup? Qual è la sede legale di Register S.p.A.?
10. **Caselle aggiuntive:** se le 3 caselle incluse sono tutte in uso, qual è il costo e la procedura per una quarta casella dedicata all'invio?

Resto a disposizione per ulteriori dettagli. Cordiali saluti,
[nome e cognome del titolare del dominio]
[codice cliente Register.it]

## Cosa devi decidere prima di inviarlo
- Chi lo invia (deve essere il titolare dell'Area Clienti) e se preferisci il ticket o il telefono.
- Se togliere la domanda 10 (solo se hai già una terza casella libera) o la 9 (se la nomina viene richiesta a parte).
- Se nell'oggetto/ticket indicare il nome della casella di invio già creata (non è necessario).

## Come usare le risposte
Annota le risposte in `docs/contact-form/README.md` (§4) e, se i limiti risultano diversi (es. quota 50/giorno, antispam che blocca gli allegati, divieto di invio da applicazioni), **fermati**: l'alternativa tecnica pronta è un servizio di posta transazionale europeo con accordo sul trattamento dei dati (da verificare), senza toccare il resto del flusso.
