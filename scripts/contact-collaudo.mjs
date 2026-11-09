// Collaudo del modulo contatti (endpoint /api/contatti).
//
//   npm run collaudo:contact -- plan                          elenca i casi, senza rete
//   npm run collaudo:contact -- generate --out ./collaudo-files   scrive gli allegati sintetici
//   npm run collaudo:contact -- local --base http://localhost:3199 [--smtp-port 47002]
//        esegue tutta la matrice contro un sito LOCALE con un server SMTP finto su loopback
//        (nessuna email reale). Il sito va avviato con le variabili indicate in docs/contact-form/COLLAUDO.md.
//   npm run collaudo:contact -- ratelimit --base http://localhost:3199
//        verifica il blocco dopo N richieste (con richieste "trappola": nessuna email parte)
//   npm run collaudo:contact -- real --base https://... --out ./collaudo-files
//        INVIA EMAIL VERE. Parte solo con COLLAUDO_CONFIRM=INVIA_EMAIL_REALI e COLLAUDO_REPLY_TO impostati
//        (indirizzo di un destinatario autorizzato). Mai verso l'indirizzo di Donatella senza consenso.
//
// Gli allegati sono sintetici (testo inventato): non usare mai manoscritti reali.

import net from "node:net";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const fixturesPath = new URL("../.test-build/tests/contact/fixtures.js", import.meta.url);
const limitsPath = new URL("../.test-build/src/lib/contact/limits.js", import.meta.url);
if (!existsSync(fixturesPath) || !existsSync(limitsPath)) {
  console.error("Servono i file compilati: esegui `npm run collaudo:contact -- <comando>` (compila da solo).");
  process.exit(2);
}
const { makePdf, makeDocx, makeDoc } = require(fixturesPath.pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const L = require(limitsPath.pathname.replace(/^\/([A-Za-z]:)/, "$1"));

const sha = (b) => createHash("sha256").update(b).digest("hex");
const args = process.argv.slice(2);
const cmd = args[0] ?? "plan";
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : def;
};

/* ---------- allegati sintetici ---------- */
const pdfOk = makePdf(300_000, "contenuto sintetico di collaudo");
const files = {
  pdf: { name: "Bozza di prova (v1).pdf", type: "application/pdf", bytes: pdfOk },
  docx: { name: "Capitolo uno - prova.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", bytes: makeDocx() },
  doc: { name: "Vecchio formato - prova.doc", type: "application/msword", bytes: makeDoc() },
  limit: { name: "Alla soglia - prova.pdf", type: "application/pdf", bytes: makePdf(L.MAX_FILE_BYTES - 120) },
  special: { name: "Il mio romanzo — è già pronto (versione finale) #2.docx", type: "application/octet-stream", bytes: makeDocx() },
  active: { name: "Con elementi attivi - prova.pdf", type: "application/pdf", bytes: makePdf(2000, "/JavaScript (prova)") },
  over: { name: "Sopra la soglia - prova.pdf", type: "application/pdf", bytes: makePdf(L.MAX_FILE_BYTES + 1000) },
  platform: { name: "Oltre la piattaforma - prova.pdf", type: "application/pdf", bytes: makePdf(L.PLATFORM_BODY_LIMIT_BYTES + 5000) },
  exe: { name: "programma.exe", type: "application/octet-stream", bytes: makePdf(100) },
  double: { name: "libro.exe.pdf", type: "application/pdf", bytes: makePdf(100) },
  fake: { name: "falso.pdf", type: "application/pdf", bytes: new Uint8Array(Buffer.from("questo è solo testo ".repeat(60))) },
  macro: { name: "con macro.docx", type: "application/octet-stream", bytes: makeDocx(["word/vbaProject.bin"]) },
  empty: { name: "vuoto.pdf", type: "application/pdf", bytes: new Uint8Array(0) },
};

const base = { name: "Prova Collaudo", email: "collaudo@example.invalid", title: "Romanzo sintetico", genre: "Fantasy", words: "1000", goal: "Self publishing", message: "Messaggio sintetico di collaudo. Accenti: è ù ò — “virgolette”." };

/** sends: il caso deve produrre un'email. flag: l'oggetto deve riportare l'avviso. */
const cases = [
  { id: "pdf_valido", t: "PDF valido con testo", file: files.pdf, status: 200, sends: true },
  { id: "docx_valido", t: "DOCX valido", file: files.docx, status: 200, sends: true },
  { id: "doc_valido", t: "DOC valido", file: files.doc, status: 200, sends: true },
  { id: "senza_allegato", t: "Nessun allegato", file: null, status: 200, sends: true },
  { id: "file_alla_soglia", t: `File alla soglia (${L.MAX_FILE_BYTES} byte)`, file: files.limit, status: 200, sends: true },
  { id: "nome_speciale", t: "Nome file con accenti, trattino lungo, #", file: files.special, status: 200, sends: true },
  { id: "pdf_attivo", t: "PDF con possibile JavaScript (segnalato)", file: files.active, status: 200, sends: true, flag: true },
  { id: "iniezione", t: "A capo e 'Bcc:' nel nome (neutralizzati)", file: null, fields: { name: "Mario\r\nBcc: spia@example.invalid" }, status: 200, sends: true },
  { id: "sopra_soglia", t: "File 1000 byte sopra la soglia", file: files.over, status: 413, code: "too_large" },
  { id: "oltre_piattaforma", t: "Corpo oltre il limite della piattaforma", file: files.platform, status: 413 },
  { id: "estensione", t: "Estensione non ammessa (.exe)", file: files.exe, status: 415, code: "unsupported_type" },
  { id: "doppia_estensione", t: "Doppia estensione (.exe.pdf)", file: files.double, status: 415, code: "unsupported_type" },
  { id: "contenuto_falso", t: "Testo con estensione .pdf", file: files.fake, status: 422, code: "bad_content" },
  { id: "macro", t: "DOCX con macro", file: files.macro, status: 422, code: "macro" },
  { id: "vuoto", t: "File vuoto con nome", file: files.empty, status: 422, code: "empty_file" },
  { id: "email_non_valida", t: "Email non valida", file: null, fields: { email: "non-valida" }, status: 400, code: "invalid_fields" },
  { id: "trappola", t: "Campo trappola compilato (finto successo, nessun invio)", file: null, fields: { website: "http://spam.example" }, status: 200, sends: false },
  { id: "token_falso", t: "Token falso", file: null, token: "1800000000000.AAAA", status: 400, code: "invalid_request" },
  { id: "troppo_veloce", t: "Invio entro 3 secondi dal token", file: null, fresh: true, status: 429, code: "too_fast" },
];

/* ---------- comandi senza rete ---------- */
if (cmd === "plan") {
  console.log(`Soglia misurata: corpo ${L.PLATFORM_BODY_LIMIT_BYTES} byte; file massimo ${L.MAX_FILE_BYTES} byte (${L.formatMaxFileMb()} MB)\n`);
  for (const c of cases) console.log(`${c.sends ? "INVIA " : "      "} ${c.id.padEnd(18)} atteso ${c.status}${c.code ? " " + c.code : ""}  - ${c.t}`);
  console.log(`\nEmail attese: ${cases.filter((c) => c.sends).length}. Altri controlli: comando "ratelimit" (nessuna email).`);
  process.exit(0);
}

if (cmd === "generate") {
  const out = opt("out", "collaudo-files");
  mkdirSync(out, { recursive: true });
  for (const [k, f] of Object.entries(files)) {
    if (f.bytes.length === 0) continue;
    const safe = `${k}__${f.name.replace(/[^A-Za-z0-9._-]+/g, "_")}`;
    writeFileSync(join(out, safe), f.bytes);
    console.log(`${safe.padEnd(60)} ${String(f.bytes.length).padStart(8)} byte  sha256 ${sha(f.bytes).slice(0, 16)}…`);
  }
  process.exit(0);
}

/* ---------- comandi con rete ---------- */
const baseUrl = opt("base", "");
if (!baseUrl) {
  console.error("Manca --base.");
  process.exit(2);
}
const origin = new URL(baseUrl).origin;
const isLoopback = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(new URL(baseUrl).hostname);

if (cmd === "real") {
  if (process.env.COLLAUDO_CONFIRM !== "INVIA_EMAIL_REALI" || !process.env.COLLAUDO_REPLY_TO) {
    console.error("Collaudo REALE non avviato: invierebbe email vere.\nServono COLLAUDO_CONFIRM=INVIA_EMAIL_REALI e COLLAUDO_REPLY_TO (destinatario autorizzato). Nessuna richiesta inviata.");
    process.exit(3);
  }
} else if (!isLoopback) {
  console.error(`Il comando "${cmd}" è consentito solo verso localhost. Per un sito reale usa "real" con le conferme richieste.`);
  process.exit(3);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getToken() {
  const r = await fetch(`${origin}/api/contatti`, { cache: "no-store" });
  if (!r.ok) throw new Error(`GET /api/contatti ha risposto ${r.status}: endpoint non configurato?`);
  return (await r.json()).token;
}

async function post({ fields = {}, file = null, token }) {
  const form = new FormData();
  const all = { ...base, ...fields, form_token: token, website: fields.website ?? "" };
  if (cmd === "real") all.email = process.env.COLLAUDO_REPLY_TO;
  for (const [k, v] of Object.entries(all)) form.set(k, v);
  form.set("attachment", file ? new File([file.bytes], file.name, { type: file.type }) : new File([], ""));
  const r = await fetch(`${origin}/api/contatti`, { method: "POST", body: form, headers: { origin } });
  let body = null;
  try { body = await r.clone().json(); } catch { /* risposta non JSON (es. rifiuto della piattaforma) */ }
  return { status: r.status, code: body?.code ?? null };
}

/* ---------- server SMTP finto (solo loopback) ---------- */
function startFakeSmtp(port) {
  const received = [];
  const server = net.createServer((socket) => {
    let data = ""; let inData = false; let buf = "";
    socket.setEncoding("latin1");
    socket.write("220 fake.local ESMTP\r\n");
    socket.on("data", (chunk) => {
      buf += chunk;
      for (;;) {
        if (inData) {
          const end = buf.indexOf("\r\n.\r\n");
          if (end < 0) return;
          data = buf.slice(0, end); buf = buf.slice(end + 5); inData = false;
          received.push(data);
          socket.write("250 queued\r\n");
          continue;
        }
        const nl = buf.indexOf("\r\n");
        if (nl < 0) return;
        const line = buf.slice(0, nl).toUpperCase(); buf = buf.slice(nl + 2);
        if (line.startsWith("EHLO") || line.startsWith("HELO")) socket.write("250-fake.local\r\n250-AUTH PLAIN LOGIN\r\n250 8BITMIME\r\n");
        else if (line.startsWith("AUTH")) socket.write("235 ok\r\n");
        else if (line === "DATA") { socket.write("354 go\r\n"); inData = true; }
        else if (line === "QUIT") { socket.write("221 bye\r\n"); socket.end(); return; }
        else socket.write("250 ok\r\n");
      }
    });
    socket.on("error", () => {});
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve({ received, close: () => new Promise((r) => server.close(r)) })));
}

function parseMessage(raw) {
  const header = (n) => (raw.match(new RegExp(`^${n}:.*(?:\\r?\\n[ \\t].*)*`, "im")) ?? [""])[0].replace(/\r?\n\s+/g, " ");
  const boundary = raw.match(/boundary="([^"]+)"/)?.[1];
  let attachment = null;
  if (boundary) {
    for (const p of raw.split("--" + boundary).slice(1, -1)) {
      if (/Content-Disposition:\s*attachment/i.test(p) && /base64/i.test(p)) {
        const body = p.split(/\r?\n\r?\n/).slice(1).join("\n");
        attachment = Buffer.from(body.replace(/\s+/g, ""), "base64");
      }
    }
  }
  const disp = (raw.match(/Content-Disposition:\s*attachment;[^\r\n]*(?:\r?\n[ \t][^\r\n]*)*/i) ?? [""])[0].replace(/\r?\n\s+/g, " ");
  return { subject: header("Subject"), replyTo: header("Reply-To"), bcc: /^Bcc:/im.test(raw), attachment, disposition: disp };
}

/* ---------- esecuzione ---------- */
if (cmd === "ratelimit") {
  const r = [];
  const token = await getToken();
  await sleep(3300);
  let blockedAt = 0;
  for (let i = 1; i <= 120; i++) {
    const res = await post({ fields: { website: "http://trappola.example" }, token });
    r.push(res.status);
    if (res.status === 429) { blockedAt = i; break; }
  }
  console.log(blockedAt ? `OK: bloccato con 429 alla richiesta n. ${blockedAt} (le precedenti: ${r.slice(0, blockedAt - 1).join(",")}). Nessuna email inviata (richieste "trappola").` : "FALLITO: nessun blocco entro 120 richieste");
  process.exit(blockedAt ? 0 : 1);
}

const smtp = cmd === "local" ? await startFakeSmtp(Number(opt("smtp-port", "47002"))) : null;
const outDir = opt("out", "collaudo-files");
let failures = 0;
const sentOrder = [];
const token = await getToken();
await sleep(3300);

for (const c of cases) {
  let tk = c.token ?? token;
  if (c.fresh) { tk = await getToken(); }
  let res;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await post({ fields: c.fields, file: c.file, token: tk });
    if (res.status !== 429 || c.status === 429) break;
    console.log(`  (429: attendo 60 s) ${c.id}`); await sleep(60_000); // limite di richieste del sito
    if (c.fresh) tk = await getToken();
  }
  const ok = res.status === c.status && (!c.code || res.code === c.code);
  if (!ok) failures++;
  if (c.sends && res.status === 200) sentOrder.push(c);
  console.log(`${ok ? "OK      " : "FALLITO "} ${c.id.padEnd(18)} atteso ${c.status}${c.code ? " " + c.code : ""} | ottenuto ${res.status}${res.code ? " " + res.code : ""}`);
}

if (smtp) {
  await sleep(500);
  const expected = sentOrder.length;
  const countOk = smtp.received.length === expected;
  if (!countOk) failures++;
  console.log(`\nEmail ricevute dal server SMTP finto: ${smtp.received.length} (attese ${expected}) ${countOk ? "OK" : "FALLITO"}`);
  sentOrder.forEach((c, i) => {
    const m = smtp.received[i] ? parseMessage(smtp.received[i]) : null;
    const problems = [];
    if (!m) problems.push("messaggio mancante");
    else {
      if (c.file && (!m.attachment || sha(m.attachment) !== sha(c.file.bytes))) problems.push("allegato diverso dall'originale");
      if (!c.file && m.attachment) problems.push("allegato inatteso");
      if (c.flag && !/ATTENZIONE/.test(m.subject)) problems.push("avviso mancante nell'oggetto");
      if (!c.flag && /ATTENZIONE/.test(m.subject)) problems.push("avviso inatteso");
      if (c.id === "iniezione" && m.bcc) problems.push("intestazione Bcc creata dall'iniezione");
      if (!/Reply-To:/i.test(m.replyTo)) problems.push("Reply-To mancante");
    }
    if (problems.length) failures++;
    console.log(`  ${problems.length ? "FALLITO" : "OK     "} ${c.id.padEnd(18)} ${problems.join("; ")}${c.id === "nome_speciale" && m ? "  [" + m.disposition.slice(0, 110) + "]" : ""}`);
  });
  await smtp.close();
} else {
  mkdirSync(outDir, { recursive: true });
  console.log("\nCOLLAUDO REALE: controlla la casella di destinazione. Email attese e impronte degli allegati (SHA-256):");
  for (const c of sentOrder) console.log(`  ${c.id.padEnd(18)} ${c.file ? `${c.file.name} (${c.file.bytes.length} byte) sha256 ${sha(c.file.bytes)}` : "senza allegato"}${c.flag ? "  [oggetto con ATTENZIONE]" : ""}`);
  console.log("Verifica anche: posta in arrivo o spam su Gmail, apertura degli allegati, intestazioni (SPF/DKIM/DMARC).");
}

console.log(failures ? `\nESITO: ${failures} problema/i` : "\nESITO: tutto come atteso");
process.exit(failures ? 1 : 0);
