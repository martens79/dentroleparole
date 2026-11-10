// Controllo pre-pubblicazione delle pagine legali.
// Uso: node scripts/check-legal-placeholders.mjs
//
// Fallisce (exit 1) se restano dati "da confermare" in src/content/legal.ts
// (campi `null`) o segnaposto testuali nelle pagine legali.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const problems = [];

// 1) Campi ancora null in legal.ts (ignora i commenti)
const config = read("src/content/legal.ts")
  .split("\n")
  .filter((line) => !/^\s*(\/\/|\/\*|\*)/.test(line));
config.forEach((line) => {
  const m = line.match(/^\s*(\w+):\s*null\b/);
  if (m) problems.push(`legal.ts: campo "${m[1]}" ancora da confermare (null)`);
});

// 2) Segnaposto testuali residui nelle pagine
const pages = [
  "src/app/privacy-policy/page.tsx",
  "src/app/cookie-policy/page.tsx",
  "src/app/termini-di-servizio/page.tsx",
];
for (const page of pages) {
  const src = read(page);
  for (const m of src.matchAll(/\[(inserire|indicare|DA CONFERMARE)[^\]]*\]/gi)) {
    problems.push(`${page}: segnaposto "${m[0].slice(0, 60)}"`);
  }
  // <Todo> scritti direttamente nella pagina
  const todos = (src.match(/<Todo>/g) || []).length;
  if (todos) problems.push(`${page}: ${todos} blocco/i <Todo> ancora presenti`);
}

// 3) Coerenza con le decisioni confermate (tempi di risposta, anteprima, sistema di contatto attuale)
const legalConfig = read("src/content/legal.ts");
if (!legalConfig.includes('risposta: "3–5 giorni lavorativi"')) {
  problems.push('legal.ts: il tempo di risposta ufficiale è «3–5 giorni lavorativi»');
}
// Conservazione confermata il 10 novembre 2026: 90 giorni (richieste senza incarico) e 180 giorni (manoscritti)
if (!/richieste:\s*"90 giorni/.test(legalConfig)) {
  problems.push("legal.ts: la conservazione delle richieste senza incarico confermata è di 90 giorni");
}
if (!/materiali:\s*"180 giorni/.test(legalConfig)) {
  problems.push("legal.ts: la conservazione dei manoscritti dopo l'incarico confermata è di 180 giorni");
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
    if (re.test(text)) problems.push(`${page}: ${why}`);
  }
}

if (problems.length) {
  console.error(`Pagine legali NON pronte: ${problems.length} punti da risolvere\n`);
  for (const p of problems) console.error(" - " + p);
  process.exit(1);
}
console.log("Pagine legali: nessun segnaposto residuo.");
