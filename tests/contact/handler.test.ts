import test from "node:test";
import assert from "node:assert/strict";
import { handleGet, handlePost } from "../../src/lib/contact/handler";
import { MAX_FILE_BYTES } from "../../src/lib/contact/limits";
import { TEST_ENV, baseFields, makeDoc, makeDocx, makeHarness, makePdf, makeRequest } from "./helpers";

async function body(res: Response) {
  return (await res.json()) as { ok: boolean; code?: string; message?: string; fields?: string[]; token?: string };
}

test("senza configurazione l'endpoint è indisponibile e non invia nulla (503)", async () => {
  const h = makeHarness({ env: {} });
  try {
    const res = await handlePost(makeRequest({ fields: baseFields(h.token()) }), h.deps);
    assert.equal(res.status, 503);
    assert.equal((await body(res)).code, "unavailable");
    assert.equal(h.sent.length, 0);
    const get = await handleGet(new Request("https://www.dentroleparole.com/api/contatti"), h.deps);
    assert.equal(get.status, 503);
  } finally {
    h.restore();
  }
});

test("GET restituisce un token firmato senza salvare nulla", async () => {
  const h = makeHarness();
  try {
    const res = await handleGet(new Request("https://www.dentroleparole.com/api/contatti"), h.deps);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("cache-control"), "no-store");
    assert.match((await body(res)).token ?? "", /^\d+\.[\w-]+$/);
  } finally {
    h.restore();
  }
});

test("invio riuscito con PDF: un'email, allegato identico, destinatario e Reply-To corretti", async () => {
  const h = makeHarness();
  try {
    const pdf = makePdf(1000);
    const res = await handlePost(
      makeRequest({ fields: baseFields(h.token()), file: { name: "Il mio libro (bozza).pdf", type: "application/pdf", bytes: pdf } }),
      h.deps,
    );
    assert.equal(res.status, 200);
    assert.deepEqual(await body(res), { ok: true });
    assert.equal(h.sent.length, 1);
    const mail = h.sent[0];
    assert.equal(mail.to, "contatti@example.test");
    assert.equal(mail.from.address, "form@example.test");
    assert.deepEqual(mail.replyTo, { name: "Mario Rossi", address: "mario.rossi@example.org" });
    assert.equal(mail.attachments?.length, 1);
    assert.equal(mail.attachments?.[0].filename, "Il mio libro (bozza).pdf");
    assert.ok(Buffer.compare(mail.attachments![0].content, Buffer.from(pdf)) === 0, "allegato diverso dall'originale");
  } finally {
    h.restore();
  }
});

test("invio senza allegato (il browser manda un file vuoto senza nome) e con DOCX/DOC", async () => {
  const h = makeHarness();
  try {
    const r1 = await handlePost(makeRequest({ fields: baseFields(h.token()), file: "empty" }), h.deps);
    assert.equal(r1.status, 200);
    assert.equal(h.sent[0].attachments, undefined);

    h.clock.t += 1000;
    const r2 = await handlePost(makeRequest({ fields: baseFields(h.token()), file: { name: "libro.docx", bytes: makeDocx() }, headers: { "x-forwarded-for": "203.0.113.8" } }), h.deps);
    assert.equal(r2.status, 200);
    h.clock.t += 1000;
    const r3 = await handlePost(makeRequest({ fields: baseFields(h.token()), file: { name: "libro.doc", bytes: makeDoc() }, headers: { "x-forwarded-for": "203.0.113.9" } }), h.deps);
    assert.equal(r3.status, 200);
    assert.equal(h.sent.length, 3);
  } finally {
    h.restore();
  }
});

test("rifiuti dell'allegato: tipo, contenuto, macro, vuoto, troppo grande", async () => {
  const cases: { name: string; file: { name: string; bytes: Uint8Array }; status: number; code: string }[] = [
    { name: "estensione non ammessa", file: { name: "virus.exe", bytes: makePdf() }, status: 415, code: "unsupported_type" },
    { name: "doppia estensione", file: { name: "libro.exe.pdf", bytes: makePdf() }, status: 415, code: "unsupported_type" },
    { name: "contenuto falso", file: { name: "falso.pdf", bytes: new Uint8Array(Buffer.from("solo testo".repeat(50))) }, status: 422, code: "bad_content" },
    { name: "DOCX con macro", file: { name: "macro.docx", bytes: makeDocx(["word/vbaProject.bin"]) }, status: 422, code: "macro" },
    { name: "troppo grande", file: { name: "enorme.pdf", bytes: makePdf(MAX_FILE_BYTES) }, status: 413, code: "too_large" },
  ];
  for (const c of cases) {
    const h = makeHarness();
    try {
      const res = await handlePost(makeRequest({ fields: baseFields(h.token()), file: c.file }), h.deps);
      assert.equal(res.status, c.status, c.name);
      assert.equal((await body(res)).code, c.code, c.name);
      assert.equal(h.sent.length, 0, c.name);
    } finally {
      h.restore();
    }
  }
});

test("richiesta troppo grande dichiarata in Content-Length: rifiutata prima di leggere il corpo", async () => {
  const h = makeHarness();
  try {
    const res = await handlePost(makeRequest({ fields: baseFields(h.token()), headers: { "content-length": "9000000" } }), h.deps);
    assert.equal(res.status, 413);
    assert.equal(h.sent.length, 0);
  } finally {
    h.restore();
  }
});

test("campi non validi: elenco dei campi e nessun invio", async () => {
  const h = makeHarness();
  try {
    const res = await handlePost(makeRequest({ fields: baseFields(h.token(), { email: "non-valida", name: "" }) }), h.deps);
    assert.equal(res.status, 400);
    const b = await body(res);
    assert.equal(b.code, "invalid_fields");
    assert.deepEqual([...(b.fields ?? [])].sort(), ["email", "name"]);
    assert.equal(h.sent.length, 0);
  } finally {
    h.restore();
  }
});

test("iniezione di intestazioni: a capo nel nome o nell'email non creano intestazioni", async () => {
  const h = makeHarness();
  try {
    const res = await handlePost(
      makeRequest({ fields: baseFields(h.token(), { name: "Mario\r\nBcc: spia@example.org", message: "ok" }) }),
      h.deps,
    );
    assert.equal(res.status, 200);
    assert.equal(h.sent[0].replyTo.name.includes("\n"), false);
    assert.equal(h.sent[0].replyTo.name.includes("\r"), false);
    assert.equal(h.sent[0].subject.includes("\n"), false);

    const h2 = makeHarness();
    try {
      const bad = await handlePost(makeRequest({ fields: baseFields(h2.token(), { email: "a@example.org\r\nBcc: spia@example.org" }) }), h2.deps);
      assert.equal(bad.status, 400);
      assert.equal(h2.sent.length, 0);
    } finally {
      h2.restore();
    }
  } finally {
    h.restore();
  }
});

test("antispam: campo trappola, token mancante o falso, troppo veloce, scaduto", async () => {
  // campo trappola: risposta di successo apparente, nessun invio
  let h = makeHarness();
  try {
    const res = await handlePost(makeRequest({ fields: baseFields(h.token(), { website: "http://spam.example" }) }), h.deps);
    assert.equal(res.status, 200);
    assert.equal(h.sent.length, 0);
  } finally {
    h.restore();
  }

  h = makeHarness();
  try {
    assert.equal((await handlePost(makeRequest({ fields: baseFields("") }), h.deps)).status, 400);
    assert.equal((await handlePost(makeRequest({ fields: baseFields("1800000000000.AAAA") }), h.deps)).status, 400);
    assert.equal(h.sent.length, 0);
  } finally {
    h.restore();
  }

  // troppo veloce: invio 1 secondo dopo l'emissione
  h = makeHarness();
  try {
    h.clock.t -= 9_000;
    const res = await handlePost(makeRequest({ fields: baseFields(h.token()) }), h.deps);
    assert.equal((await body(res)).code, "too_fast");
  } finally {
    h.restore();
  }

  // scaduto
  h = makeHarness();
  try {
    const t = h.token();
    h.clock.t += 4 * 60 * 60 * 1000;
    assert.equal((await body(await handlePost(makeRequest({ fields: baseFields(t) }), h.deps))).code, "expired");
  } finally {
    h.restore();
  }
});

test("rate limiting: dopo 3 richieste dallo stesso IP la quarta è bloccata con Retry-After", async () => {
  const h = makeHarness();
  try {
    for (let i = 0; i < 3; i++) {
      const r = await handlePost(makeRequest({ fields: baseFields(h.token()) }), h.deps);
      assert.equal(r.status, 200, `richiesta ${i + 1}`);
    }
    const blocked = await handlePost(makeRequest({ fields: baseFields(h.token()) }), h.deps);
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers.get("retry-after")) >= 1);
    assert.equal(h.sent.length, 3);

    // un altro IP non è bloccato
    const other = await handlePost(makeRequest({ fields: baseFields(h.token()), headers: { "x-forwarded-for": "198.51.100.9" } }), h.deps);
    assert.equal(other.status, 200);
  } finally {
    h.restore();
  }
});

test("origine: richieste da altri siti o senza Origin/Referer sono rifiutate", async () => {
  const h = makeHarness();
  try {
    const other = makeRequest({ fields: baseFields(h.token()), headers: { origin: "https://sito-malevolo.example" } });
    assert.equal((await handlePost(other, h.deps)).status, 403);

    const form = new FormData();
    for (const [k, v] of Object.entries(baseFields(h.token()))) form.set(k, v);
    const noOrigin = new Request("https://www.dentroleparole.com/api/contatti", { method: "POST", body: form });
    assert.equal((await handlePost(noOrigin, h.deps)).status, 403);

    const json = new Request("https://www.dentroleparole.com/api/contatti", {
      method: "POST",
      body: "{}",
      headers: { origin: "https://www.dentroleparole.com", "content-type": "application/json" },
    });
    assert.equal((await handlePost(json, h.deps)).status, 400);
    assert.equal(h.sent.length, 0);
  } finally {
    h.restore();
  }
});

test("guasto SMTP: errore generico al visitatore e nessun dato personale nei log", async () => {
  const secretName = "Giuseppina Verdi";
  const secretEmail = "giuseppina.verdi@example.org";
  const secretFile = "Segretissimo romanzo inedito.pdf";
  const h = makeHarness({ fail: Object.assign(new Error(`550 mailbox ${secretEmail} rejected`), { code: "EAUTH" }) });
  try {
    const res = await handlePost(
      makeRequest({
        fields: baseFields(h.token(), { name: secretName, email: secretEmail, message: "Testo riservato del messaggio" }),
        file: { name: secretFile, type: "application/pdf", bytes: makePdf() },
      }),
      h.deps,
    );
    assert.equal(res.status, 502);
    const b = await body(res);
    assert.equal(b.code, "send_failed");
    assert.match(b.message ?? "", /contatti@dentroleparole\.com/);
    assert.equal(JSON.stringify(b).includes(secretEmail), false);

    const logged = h.logs.join("\n");
    assert.match(logged, /contact_send_failed/);
    assert.match(logged, /EAUTH/);
    for (const forbidden of [secretName, secretEmail, secretFile, "Testo riservato", TEST_ENV.SMTP_PASS, "203.0.113.7"]) {
      assert.equal(logged.includes(forbidden), false, `il log contiene: ${forbidden}`);
    }
  } finally {
    h.restore();
  }
});
