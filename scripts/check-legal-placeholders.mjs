// Controllo pre-pubblicazione delle pagine legali.
// Uso: node scripts/check-legal-placeholders.mjs [--strict] [--built]
//
//   (nessuna opzione)  ERRORI (exit 1): segnaposto non intenzionali e incoerenze con le decisioni confermate.
//                      AVVISI (exit 0): il recapito professionale è ancora il segnaposto interno
//                      RECAPITO_PLACEHOLDER: ammesso temporaneamente, ma le pagine NON sono complete.
//   --strict           trasforma gli avvisi in errori (da usare prima della pubblicazione definitiva).
//   --built            controlla anche l'HTML già compilato (.next/server/app): il segnaposto interno
//                      non deve comparire nelle pagine pubbliche (richiede `npm run build`).

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const args = new Set(process.argv.slice(2));

const errors = [];
const warnings = [];

const legalConfig = read("src/content/legal.ts");
// righe di configurazione senza commenti
const config = legalConfig.split("\n").filter((line) => !/^\s*(\/\/|\/\*|\*)/.test(line));
const configText = config.join("\n");

// 1) Campi ancora null in legal.ts: dati non confermati e non decisi => errore
config.forEach((line) => {
  const m = line.match(/^\s*(\w+):\s*null\b/);
  if (m) errors.push(`legal.ts: campo "${m[1]}" ancora da confermare (null)`);
});

// 2) Recapito professionale: segnaposto interno ammesso, ma con avviso esplicito
const PLACEHOLDER = "[RECAPITO PROFESSIONALE DA COMPLETARE]";
const placeholderActive = /indirizzo:\s*RECAPITO_PLACEHOLDER\b/.test(configText);
if (placeholderActive) {
  warnings.push(
    `Recapito professionale ancora da completare (${PLACEHOLDER}): le pagine pubbliche indicano solo nome ed email della titolare. Va completato prima della pubblicazione definitiva.`,
  );
}

// 3) Segnaposto non intenzionali nelle pagine
const pages = [
  "src/app/privacy-policy/page.tsx",
  "src/app/cookie-policy/page.tsx",
  "src/app/termini-di-servizio/page.tsx",
];
for (const page of pages) {
  const src = read(page);
  for (const m of src.matchAll(/\[(inserire|indicare|DA CONFERMARE|RECAPITO)[^\]]*\]/gi)) {
    errors.push(`${page}: segnaposto "${m[0].slice(0, 60)}"`);
  }
  const todos = (src.match(/<Todo>/g) || []).length;
  if (todos) errors.push(`${page}: ${todos} blocco/i <Todo> ancora presenti`);
  // il recapito deve passare sempre da recapitoPubblico(): mai stampato direttamente
  if (/\{\s*titolare\.indirizzo\s*\}/.test(src)) {
    errors.push(`${page}: il recapito va mostrato solo tramite recapitoPubblico() (il segnaposto non deve comparire)`);
  }
}

// 4) Coerenza con le decisioni confermate
if (!legalConfig.includes('risposta: "3–5 giorni lavorativi"')) {
  errors.push('legal.ts: il tempo di risposta ufficiale è «3–5 giorni lavorativi»');
}
if (!/richieste:\s*"90 giorni/.test(legalConfig)) {
  errors.push("legal.ts: la conservazione delle richieste senza incarico confermata è di 90 giorni");
}
if (!/materiali:\s*"180 giorni/.test(legalConfig)) {
  errors.push("legal.ts: la conservazione dei manoscritti dopo l'incarico confermata è di 180 giorni");
}
if (!/collaboratori:\s*false\b/.test(configText)) {
  errors.push("legal.ts: confermato che nessun collaboratore accede ai manoscritti (collaboratori: false)");
}
if (!/strumentiIA:\s*false\b/.test(configText)) {
  errors.push("legal.ts: confermato che non si usano strumenti di IA sui manoscritti (strumentiIA: false)");
}
// Google Analytics: formulazione neutra concordata, nessuna durata dichiarata
if (/conservazione:\s*"/.test(configText)) {
  warnings.push(
    "legal.ts: analytics.conservazione contiene una durata: va dichiarata solo se verificata nel pannello Google Analytics.",
  );
}
const neutralGa =
  "secondo le impostazioni di conservazione configurate per la proprietà Google Analytics e secondo le politiche applicabili di Google";
for (const page of ["src/app/privacy-policy/page.tsx", "src/app/cookie-policy/page.tsx"]) {
  if (!read(page).replace(/\s+/g, " ").includes(neutralGa)) {
    errors.push(`${page}: manca la formulazione neutra concordata su Google Analytics`);
  }
}

for (const page of pages) {
  const text = read(page).replace(/\s+/g, " ");
  const forbidden = [
    [
      /cancellazione automatica|cancellat\w+ automaticamente|eliminat\w+ automaticamente|automaticamente cancellat\w+/i,
      "la cancellazione non è automatica (procedura manuale della titolare)",
    ],
    [/\b2 mesi\b|\b14 mesi\b/, "durata di Google Analytics scritta senza verifica dell'account"],
    [/24\s*[–-]\s*48/, "tempo di risposta non ufficiale (24–48)"],
    [/\b48 ore\b/, "tempo di risposta non ufficiale (48 ore)"],
    [/appena possibile/i, "tempo di risposta generico"],
    [/3-5 giorni/, "tempo di risposta scritto con trattino semplice"],
    [/5\s*[–-]\s*10 pagine/i, "anteprima indicata in pagine invece che in cartelle editoriali"],
    [/\bestratto\b/i, "«estratto» al posto di «anteprima»"],
    [/SMTP|Nodemailer|\/api\/contatti/, "sistema SMTP della PR #7 descritto come attivo"],
  ];
  for (const [re, why] of forbidden) {
    if (re.test(text)) errors.push(`${page}: ${why}`);
  }
}

// 5) HTML compilato: il segnaposto interno non deve essere pubblico
if (args.has("--built")) {
  const dir = join(root, ".next", "server", "app");
  const files = ["privacy-policy", "cookie-policy", "termini-di-servizio"].flatMap((n) => [`${n}.html`, `${n}.rsc`]);
  let scanned = 0;
  for (const f of files) {
    const p = join(dir, f);
    if (!existsSync(p)) continue;
    scanned++;
    const body = readFileSync(p, "utf8");
    if (body.includes("RECAPITO PROFESSIONALE") || body.includes("DA CONFERMARE")) {
      errors.push(`.next/server/app/${f}: segnaposto visibile nell'HTML pubblico`);
    }
  }
  if (!scanned) errors.push("--built: nessun file compilato trovato (eseguire prima `npm run build`)");
  else console.log(`HTML compilato controllato (${scanned} file): nessun segnaposto interno nelle pagine pubbliche.`);
}

if (args.has("--strict")) {
  for (const w of warnings) errors.push(`(--strict) ${w}`);
  warnings.length = 0;
}

for (const w of warnings) console.warn(`AVVISO: ${w}`);

if (errors.length) {
  console.error(`Pagine legali NON pronte: ${errors.length} errore/i\n`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
if (warnings.length) {
  console.log(
    `Nessun segnaposto non intenzionale. ${warnings.length} avviso/i aperti: le pagine legali NON sono complete finché il recapito professionale non è inserito.`,
  );
} else {
  console.log("Pagine legali: nessun segnaposto residuo.");
}
