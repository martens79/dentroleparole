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
config.forEach((line, i) => {
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

if (problems.length) {
  console.error(`Pagine legali NON pronte: ${problems.length} punti da risolvere\n`);
  for (const p of problems) console.error(" - " + p);
  process.exit(1);
}
console.log("Pagine legali: nessun segnaposto residuo.");
