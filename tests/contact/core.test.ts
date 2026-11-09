import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../../src/lib/contact/config";
import { createRateLimiter } from "../../src/lib/contact/ratelimit";
import { issueToken, verifyToken } from "../../src/lib/contact/token";
import { SUBJECT, buildMailOptions, buildTransportOptions } from "../../src/lib/contact/mail";
import { MAX_FILE_BYTES, MAX_REQUEST_BYTES, MULTIPART_OVERHEAD_BYTES, PLATFORM_BODY_LIMIT_BYTES, formatMaxFileMb } from "../../src/lib/contact/limits";
import { SECRET, TEST_ENV } from "./helpers";

test("configurazione: valori obbligatori mancanti e predefiniti ufficiali Register.it", () => {
  const empty = loadConfig({});
  assert.deepEqual(empty, { ok: false, missing: ["SMTP_USER", "SMTP_PASS", "CONTACT_FORM_SECRET"] });

  const short = loadConfig({ ...TEST_ENV, CONTACT_FORM_SECRET: "corto" });
  assert.equal(short.ok, false);

  const ok = loadConfig({ SMTP_USER: "form@example.test", SMTP_PASS: "p", CONTACT_FORM_SECRET: SECRET });
  assert.ok(ok.ok);
  if (ok.ok) {
    assert.equal(ok.config.host, "authsmtp.securemail.pro");
    assert.equal(ok.config.port, 465);
    assert.equal(ok.config.secure, true);
    assert.equal(ok.config.to, "contatti@dentroleparole.com");
    assert.equal(ok.config.from, "form@example.test");
  }
  assert.equal(loadConfig({ ...TEST_ENV, SMTP_PORT: "99999" }).ok, false);
});

test("trasporto SMTP: TLS sempre verificato, TLS 1.2 minimo, timeout, niente accesso a file/URL", () => {
  const cfg = loadConfig(TEST_ENV);
  assert.ok(cfg.ok);
  if (!cfg.ok) return;
  const o = buildTransportOptions(cfg.config);
  assert.equal(o.host, "authsmtp.securemail.pro");
  assert.equal(o.port, 465);
  assert.equal(o.secure, true);
  assert.equal(o.tls?.rejectUnauthorized, true);
  assert.equal(o.tls?.minVersion, "TLSv1.2");
  assert.equal(o.tls?.servername, "authsmtp.securemail.pro");
  assert.equal(o.disableFileAccess, true);
  assert.equal(o.disableUrlAccess, true);
  assert.ok((o.connectionTimeout ?? 0) > 0 && (o.socketTimeout ?? 0) > 0);

  // Su una porta diversa dalla 465 il passaggio a TLS è obbligatorio.
  const c587 = loadConfig({ ...TEST_ENV, SMTP_PORT: "587" });
  assert.ok(c587.ok);
  if (c587.ok) {
    const o2 = buildTransportOptions(c587.config);
    assert.equal(o2.secure, false);
    assert.equal(o2.requireTLS, true);
  }
});

test("token: valido, troppo veloce, scaduto, manomesso, di un'altra chiave", () => {
  const t0 = 1_800_000_000_000;
  const token = issueToken(SECRET, t0);
  assert.equal(verifyToken(SECRET, token, t0 + 10_000), "ok");
  assert.equal(verifyToken(SECRET, token, t0 + 500), "too_fast");
  assert.equal(verifyToken(SECRET, token, t0 + 4 * 60 * 60 * 1000), "expired");
  assert.equal(verifyToken(SECRET, token.replace(/.$/, "A"), t0 + 10_000), "invalid");
  assert.equal(verifyToken("altra-chiave-".padEnd(40, "y"), token, t0 + 10_000), "invalid");
  for (const bad of [undefined, null, "", "abc", "123.456", 42, "x".repeat(300)]) {
    assert.equal(verifyToken(SECRET, bad, t0 + 10_000), "invalid");
  }
});

test("rate limiter: soglia, finestra scorrevole, memoria limitata", () => {
  let t = 0;
  const rl = createRateLimiter({ windowMs: 1000, max: 2, maxKeys: 3, now: () => t });
  assert.equal(rl.hit("a").allowed, true);
  assert.equal(rl.hit("a").allowed, true);
  const blocked = rl.hit("a");
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSec >= 1);
  assert.equal(rl.hit("b").allowed, true); // chiavi indipendenti
  t = 1500;
  assert.equal(rl.hit("a").allowed, true); // la finestra è scaduta

  // Con più chiavi del massimo le più vecchie vengono eliminate (la memoria non cresce senza limite).
  for (const k of ["k1", "k2", "k3", "k4", "k5"]) rl.hit(k);
  t = 1600;
  assert.equal(rl.hit("k1").allowed, true);
});

test("messaggio: oggetto invariato, Reply-To, allegato in memoria, segnalazioni", () => {
  const fields = { name: "Mario Rossi", email: "mario@example.org", title: "T", genre: "Fantasy", words: "100", goal: "Self publishing", message: "ciao" };
  const base = buildMailOptions({ from: "form@example.test", to: "contatti@example.test" }, fields, null);
  assert.equal(base.subject, SUBJECT);
  assert.equal(SUBJECT, "Nuova richiesta dal sito Dentro le Parole");
  assert.equal(base.to, "contatti@example.test");
  assert.equal(base.from.address, "form@example.test");
  assert.deepEqual(base.replyTo, { name: "Mario Rossi", address: "mario@example.org" });
  assert.equal(base.attachments, undefined);
  assert.match(base.text, /Allegato: nessuno/);

  const withFile = buildMailOptions(
    { from: "form@example.test", to: "contatti@example.test" },
    fields,
    { safeName: "libro.pdf", contentType: "application/pdf", content: Buffer.from("%PDF-1.4"), warnings: ["PDF con possibili elementi attivi"] },
  );
  assert.match(withFile.subject, /^\[ATTENZIONE: allegato da verificare\] /);
  assert.equal(withFile.attachments?.[0].filename, "libro.pdf");
  assert.equal(withFile.attachments?.[0].contentDisposition, "attachment");
  assert.match(withFile.text, /ATTENZIONE: il controllo automatico ha segnalato/);
});

test("limiti: la dimensione del file deriva dal limite della piattaforma, senza valori arbitrari", () => {
  assert.equal(MAX_FILE_BYTES, PLATFORM_BODY_LIMIT_BYTES - MULTIPART_OVERHEAD_BYTES);
  assert.equal(MAX_REQUEST_BYTES, PLATFORM_BODY_LIMIT_BYTES);
  assert.ok(MAX_FILE_BYTES < PLATFORM_BODY_LIMIT_BYTES);
  assert.match(formatMaxFileMb(), /^\d+,\d$/);
});
