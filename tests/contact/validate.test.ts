import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanMultiLine,
  cleanSingleLine,
  inspectAttachment,
  isValidEmail,
  listZipEntries,
  sanitizeFilename,
  validateFields,
} from "../../src/lib/contact/validate";
import { MAX_FILE_BYTES } from "../../src/lib/contact/limits";
import { makeDoc, makeDocx, makePdf, makeZip } from "./helpers";

const form = (o: Record<string, string>) => ({ get: (k: string) => (k in o ? o[k] : null) });

test("email: formati validi e non validi", () => {
  assert.equal(isValidEmail("mario.rossi@example.org"), true);
  assert.equal(isValidEmail("a+b@sub.example.it"), true);
  for (const bad of ["", "mario", "mario@", "@example.org", "a@b", "a b@example.org", "a@example..org", "a@x.org\r\nBcc: x@y.z", "<a@b.co>"]) {
    assert.equal(isValidEmail(bad), false, bad);
  }
});

test("campi: i caratteri di controllo e gli a capo vengono neutralizzati", () => {
  assert.equal(cleanSingleLine("Mario\r\nBcc: spia@example.org", 120), "Mario Bcc: spia@example.org");
  assert.equal(cleanSingleLine("x".repeat(121), 120), null);
  assert.equal(cleanSingleLine(null, 10), "");
  assert.equal(cleanSingleLine({}, 10), null);
  assert.equal(cleanMultiLine("riga1\r\nriga2\u0000", 100), "riga1\nriga2");
});

test("campi: validazione completa", () => {
  const ok = validateFields(form({ name: "Mario Rossi", email: "m@example.org", words: "1200", message: "ciao" }));
  assert.equal(ok.ok, true);
  const bad = validateFields(form({ name: "", email: "no", words: "abc", message: "x".repeat(5001) }));
  assert.deepEqual(bad.ok === false && bad.invalid.sort(), ["email", "message", "name", "words"]);
});

test("nome file: percorso rimosso, caratteri sicuri, estensione coerente", () => {
  assert.equal(sanitizeFilename("C:\\Users\\mario\\Il mio libro (bozza 2).docx", "docx"), "Il mio libro (bozza 2).docx");
  assert.equal(sanitizeFilename("../../etc/passwd.pdf", "pdf"), "passwd.pdf");
  // La "/" è un separatore di percorso: resta solo l'ultimo segmento, ripulito dai caratteri non sicuri.
  assert.equal(sanitizeFilename("<script>alert(1)</script>.pdf", "pdf"), "script_.pdf");
  assert.equal(sanitizeFilename("<b>grassetto</b>.pdf".replace("/", ""), "pdf"), "_b_grassetto_b_.pdf");
  assert.equal(sanitizeFilename("....pdf", "pdf"), "manoscritto.pdf");
  assert.ok(sanitizeFilename("a".repeat(300) + ".pdf", "pdf").length <= 80);
});

test("allegato PDF valido", () => {
  const r = inspectAttachment({ filename: "Bozza.PDF", size: 100, bytes: makePdf() });
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.kind, "pdf");
  assert.equal(r.ok && r.contentType, "application/pdf");
});

test("allegato PDF con elementi attivi: accettato ma segnalato", () => {
  const r = inspectAttachment({ filename: "a.pdf", size: 100, bytes: makePdf(0, "/JavaScript (app.alert(1))") });
  assert.equal(r.ok && r.warnings.length, 1);
});

test("allegato DOCX valido, con macro rifiutato, con oggetti incorporati segnalato", () => {
  const ok = inspectAttachment({ filename: "libro.docx", size: 100, bytes: makeDocx() });
  assert.equal(ok.ok && ok.kind, "docx");

  const macro = inspectAttachment({ filename: "libro.docx", size: 100, bytes: makeDocx(["word/vbaProject.bin"]) });
  assert.deepEqual(macro, { ok: false, reason: "macro" });

  const emb = inspectAttachment({ filename: "libro.docx", size: 100, bytes: makeDocx(["word/embeddings/oleObject1.bin"]) });
  assert.equal(emb.ok && emb.warnings.length, 1);
});

test("allegato DOC valido e con possibili macro segnalato", () => {
  assert.equal(inspectAttachment({ filename: "v.doc", size: 100, bytes: makeDoc() }).ok, true);
  const m = inspectAttachment({ filename: "v.doc", size: 100, bytes: makeDoc(true) });
  assert.equal(m.ok && m.warnings.length, 1);
});

test("allegato: estensione non consentita, doppia estensione, contenuto falsificato", () => {
  const txt = new Uint8Array(Buffer.from("questo è solo testo".repeat(40)));
  assert.deepEqual(inspectAttachment({ filename: "x.exe", size: 10, bytes: txt }), { ok: false, reason: "bad_extension" });
  assert.deepEqual(inspectAttachment({ filename: "x.txt", size: 10, bytes: txt }), { ok: false, reason: "bad_extension" });
  assert.deepEqual(inspectAttachment({ filename: "libro.exe.pdf", size: 10, bytes: makePdf() }), { ok: false, reason: "bad_name" });
  assert.deepEqual(inspectAttachment({ filename: "libro.pdf\u0000.exe", size: 10, bytes: makePdf() }), { ok: false, reason: "bad_name" });
  // contenuto che non corrisponde all'estensione dichiarata
  assert.deepEqual(inspectAttachment({ filename: "falso.pdf", size: 10, bytes: txt }), { ok: false, reason: "bad_content" });
  assert.deepEqual(inspectAttachment({ filename: "falso.docx", size: 10, bytes: makePdf() }), { ok: false, reason: "bad_content" });
  assert.deepEqual(inspectAttachment({ filename: "falso.doc", size: 10, bytes: txt }), { ok: false, reason: "bad_content" });
  // zip qualunque che non è un DOCX
  assert.deepEqual(inspectAttachment({ filename: "z.docx", size: 10, bytes: makeZip([{ name: "foto.png" }]) }), { ok: false, reason: "bad_content" });
});

test("allegato: vuoto e troppo grande", () => {
  assert.deepEqual(inspectAttachment({ filename: "a.pdf", size: 0, bytes: new Uint8Array(0) }), { ok: false, reason: "empty" });
  const big = makePdf(MAX_FILE_BYTES);
  assert.deepEqual(inspectAttachment({ filename: "a.pdf", size: big.length, bytes: big }), { ok: false, reason: "too_large" });
});

test("ZIP: un archivio corrotto non manda in errore il parser", () => {
  const z = Buffer.from(makeDocx());
  assert.equal(listZipEntries(new Uint8Array(z.subarray(0, 40))), null);
  assert.equal(listZipEntries(new Uint8Array(Buffer.from("PK\u0003\u0004" + "x".repeat(200)))), null);
  const names = listZipEntries(new Uint8Array(z));
  assert.deepEqual(names, ["[Content_Types].xml", "word/document.xml"]);
});
