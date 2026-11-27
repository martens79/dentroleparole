import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MAX_FILE_BYTES, formatMaxFileMb } from "../../src/lib/contact/limits";

/**
 * Il modulo serve al primo approccio: l'allegato è solo un'anteprima facoltativa.
 * Questi controlli verificano che i testi siano presenti, uguali nelle due modalità
 * (FormSubmit e endpoint SMTP) e che nessun limite di pagine o parole sia imposto dal codice.
 */

const form = readFileSync(join(process.cwd(), "src/components/ContactForm.jsx"), "utf8");
const flat = form.replace(/\s+/g, " ");

test("testi dell'anteprima: titolo, accompagnamento e definizione di cartella editoriale", () => {
  assert.ok(flat.includes("Anteprima del manoscritto (facoltativa)"));
  assert.ok(
    flat.includes(
      "Allega, se desideri, le prime 5–10 cartelle editoriali del tuo testo in formato PDF, DOC o DOCX. " +
        "Non è necessario inviare il manoscritto completo: potremo concordarne l’invio successivamente via email.",
    ),
  );
  assert.ok(flat.includes("Una cartella editoriale corrisponde indicativamente a 1.800 battute, spazi inclusi."));
  assert.ok(flat.includes("Allega anteprima"));
  // il vecchio testo non deve restare
  assert.equal(flat.includes("Estratto (PDF, DOC, DOCX)"), false);
  assert.equal(flat.includes("Carica estratto"), false);
});

test("i testi non dipendono dalla modalità: nessun ramo USE_API attorno al titolo o all'aiuto", () => {
  const start = form.indexOf("anteprima-titolo");
  const end = form.indexOf('name="attachment"');
  assert.ok(start > 0 && end > start);
  const block = form.slice(start, end);
  assert.equal(/USE_API/.test(block), false, "il blocco dell'anteprima non deve cambiare con l'interruttore");
});

test("nessun limite di pagine, cartelle o parole sul documento: il consiglio 5–10 cartelle è solo indicativo", () => {
  // il codice del modulo e dell'endpoint non conta pagine né battute del file allegato
  for (const f of [
    "src/components/ContactForm.jsx",
    "src/lib/contact/validate.ts",
    "src/lib/contact/handler.ts",
    "src/lib/contact/limits.ts",
  ]) {
    const text = readFileSync(join(process.cwd(), f), "utf8");
    assert.equal(/maxPages|MAX_PAGES|pageCount|numPages|maxCartelle|MAX_CARTELLE|battute\s*[<>]/i.test(text), false, `limite di pagine in ${f}`);
  }
  // l'unico limite sul file è la dimensione
  assert.ok(MAX_FILE_BYTES > 0);
});

test("limite di dimensione mostrato: 4,4 MB con l'endpoint, 8 MB con FormSubmit (invariato)", () => {
  assert.equal(formatMaxFileMb(), "4,4");
  assert.match(form, /const MAX_FILE_SIZE_MB = USE_API \? formatMaxFileMb\(\) : 8;/);
  assert.match(form, /const MAX_FILE_SIZE_BYTES = USE_API \? API_MAX_FILE_BYTES : 8 \* 1024 \* 1024;/);
});

test("l'allegato resta facoltativo: nessun controllo lo rende obbligatorio e il campo mantiene il nome 'attachment'", () => {
  assert.match(form, /name="attachment"/);
  assert.match(form, /accept="\.pdf,\.doc,\.docx"/);
  // il campo file non ha "required"
  const input = form.slice(form.indexOf('name="attachment"') - 120, form.indexOf('name="attachment"') + 200);
  assert.equal(/\brequired\b/.test(input), false);
});

test("tutti i campi del modulo sono ancora presenti", () => {
  for (const name of ["name", "email", "title", "genre", "words", "goal", "message", "attachment"]) {
    assert.ok(form.includes(`name="${name}"`), `campo mancante: ${name}`);
  }
});
