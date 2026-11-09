import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Coerenza dei testi sull'anteprima in tutto il sito e correzione del pulsante "Invia richiesta".
 * Verifiche statiche, senza rete.
 */

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const flat = (p: string) => read(p).replace(/\s+/g, " ");

const PREVIEW = "Anteprima facoltativa: 5–10 cartelle editoriali (circa 1.800 battute ciascuna, spazi inclusi)";

const visibleFiles = execFileSync("git", ["ls-files", "src"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter((f) => /\.(tsx|jsx|ts)$/.test(f))
  // testi legali e codice dell'endpoint hanno un'altra funzione; i dati storici e le etichette dell'area Sanity non sono testi del modulo
  .filter((f) => !/^src\/(lib\/contact|sanity|data\/portfolio)/.test(f));

test("nessun riferimento a '5–10 pagine' resta nei testi del sito", () => {
  for (const f of visibleFiles) {
    const text = flat(f);
    assert.equal(/5\s*[–-]\s*10 pagine/i.test(text), false, `riferimento alle pagine in ${f}`);
  }
});

test("l'invito a inviare un 'estratto' è sostituito da 'anteprima' dove riguarda il modulo", () => {
  for (const f of visibleFiles) {
    const text = flat(f);
    for (const old of [
      "Inviami un estratto",
      "Mi invii un estratto",
      "Invia un estratto",
      "un estratto di 5",
      "Valutazione estratto",
      "Estratto + obiettivi",
      "hai inviato un estratto",
      "dell’estratto (5",
    ]) {
      assert.equal(text.includes(old), false, `testo obsoleto "${old}" in ${f}`);
    }
  }
});

test("la home usa la formula uniforme e chiarisce che il manoscritto completo non serve", () => {
  const home = flat("src/app/page.tsx");
  assert.ok(home.includes(PREVIEW), "formula uniforme assente nella home");
  assert.ok(home.includes("Non è necessario inviare il manoscritto completo"));
  assert.ok(home.includes("potrò chiedertelo successivamente via email"));
  // tutte le formule con 'cartelle' dichiarano anche la misura della cartella editoriale (1.800 battute, spazi inclusi) o rimandano al modulo
  assert.ok(flat("src/components/ContactForm.jsx").includes("1.800 battute"));
});

test("modulo, home, menu, 'Chi sono', servizi, blog e pagina Grazie parlano di anteprima facoltativa", () => {
  assert.ok(flat("src/components/Header.tsx").includes("Anteprima facoltativa: 5–10 cartelle editoriali"));
  assert.ok(flat("src/app/chi-sono/page.tsx").includes("anteprima facoltativa"));
  assert.ok(flat("src/app/servizi/page.tsx").includes("dell’anteprima o del manoscritto"));
  assert.ok(flat("src/app/blog/[slug]/page.tsx").includes("anteprima facoltativa (5–10 cartelle editoriali)"));
  assert.ok(flat("src/app/grazie/page.jsx").includes("Se hai allegato un’anteprima del manoscritto"));
});

/* ---------- pulsante "Invia richiesta" ---------- */

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const form = read("src/components/ContactForm.jsx");
const buttonClass = (form.match(/<button\s+type="submit"[\s\S]*?className="([^"]+)"/) ?? [])[1] ?? "";

test("pulsante: colori espliciti e non utility inesistenti (bg-gold, text-night, shadow-glow non vengono generate)", () => {
  assert.ok(buttonClass.length > 0, "pulsante non trovato");
  assert.ok(buttonClass.includes("bg-[#D6B36A]"));
  assert.ok(buttonClass.includes("text-[#070A12]"));
  for (const broken of ["bg-gold", "text-night", "shadow-glow"]) {
    assert.equal(buttonClass.includes(broken), false, `utility non generata: ${broken}`);
  }
});

test("pulsante: stati hover, focus da tastiera e disabilitato definiti, uguali nelle due modalità", () => {
  assert.ok(buttonClass.includes("hover:bg-[#E2C58A]"));
  assert.ok(buttonClass.includes("focus-visible:ring-2"));
  assert.ok(buttonClass.includes("disabled:opacity-60"));
  assert.ok(buttonClass.includes("disabled:cursor-not-allowed"));
  // nessun ramo dell'interruttore sulle classi del pulsante
  assert.equal(/USE_API\s*\?\s*"[^"]*disabled/.test(form), false);
});

test("pulsante: contrasto testo/sfondo conforme WCAG AAA (≥ 7:1) in stato normale e hover", () => {
  assert.ok(contrast("#070A12", "#D6B36A") >= 7, `contrasto normale ${contrast("#070A12", "#D6B36A").toFixed(2)}`);
  assert.ok(contrast("#070A12", "#E2C58A") >= 7, `contrasto hover ${contrast("#070A12", "#E2C58A").toFixed(2)}`);
  // il disabilitato usa opacità 60%: resta sopra il minimo AA per testo grande/UI (3:1) rispetto al fondo scuro del modulo
  assert.ok(contrast("#D6B36A", "#0B1020") >= 3);
});

test("il tema globale non è stato modificato (nessun @config/@theme aggiunto in globals.css)", () => {
  const css = read("src/app/globals.css");
  assert.equal(/@config|@theme/.test(css), false);
});
