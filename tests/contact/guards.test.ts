import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Verifiche statiche di sicurezza e di "modalità predefinita". Si eseguono dalla radice del repository
 * (npm run test:contact). Non toccano la rete.
 */

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");

function trackedFiles(): string[] {
  return execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);
}

const contactSources = readdirSync(join(root, "src/lib/contact"))
  .filter((f) => f.endsWith(".ts"))
  .map((f) => `src/lib/contact/${f}`)
  .concat(["src/app/api/contatti/route.ts"]);

test("modalità predefinita: il modulo usa FormSubmit finché l'interruttore non vale esattamente \"api\"", () => {
  const form = read("src/components/ContactForm.jsx");
  assert.match(form, /const USE_API = process\.env\.NEXT_PUBLIC_CONTACT_BACKEND === "api";/);
  assert.ok(form.includes('"https://formsubmit.co/contatti@dentroleparole.com"'), "azione FormSubmit assente");
  for (const legacy of ['name="_subject"', 'name="_captcha"', 'name="_template"', 'name="_next"', 'name="_honey"']) {
    assert.ok(form.includes(legacy), `campo FormSubmit mancante: ${legacy}`);
  }
  const example = read(".env.example");
  assert.match(example, /^NEXT_PUBLIC_CONTACT_BACKEND=formsubmit\s*$/m);
});

test("nessun file del repository imposta l'interruttore su api (né workflow, né vercel.json, né .env tracciati)", () => {
  for (const f of trackedFiles()) {
    if (f.startsWith("docs/") || f.startsWith("tests/") || f === "package-lock.json") continue;
    if (!/\.(json|ya?ml|js|mjs|cjs|ts|tsx|jsx|env|toml)$/.test(f) && !f.startsWith(".env")) continue;
    const text = readFileSync(join(root, f), "utf8");
    assert.equal(/NEXT_PUBLIC_CONTACT_BACKEND\s*[=:]\s*["']?api/.test(text), false, `interruttore su api in ${f}`);
  }
});

test("credenziali: nessun file .env o chiave privata tracciato; .env.example contiene solo valori vuoti", () => {
  const files = trackedFiles();
  const envFiles = files.filter((f) => /(^|\/)\.env(\..*)?$/.test(f) && !f.endsWith(".env.example"));
  assert.deepEqual(envFiles, [], "file .env tracciati");
  const keyFiles = files.filter((f) => /\.(pem|key|p12|pfx|jks|keystore)$/i.test(f));
  assert.deepEqual(keyFiles, [], "certificati o chiavi tracciati");

  for (const line of read(".env.example").split(/\r?\n/)) {
    const m = line.match(/^(SMTP_USER|SMTP_PASS|CONTACT_FORM_SECRET|BREVO_API_KEY)=(.*)$/);
    if (m) assert.equal(m[2].trim(), "", `valore presente in .env.example per ${m[1]}`);
  }
});

test("credenziali: nel codice non compaiono segreti, password o chiavi con valori letterali", () => {
  const suspicious =
    /(pass(word)?|secret|api[_-]?key|token|private[_-]?key)\s*[:=]\s*["'`][A-Za-z0-9+/_=-]{16,}["'`]/i;
  const privateKeyBlock = /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/;
  for (const f of trackedFiles()) {
    if (f.startsWith("tests/") || f.startsWith("docs/") || f === "package-lock.json" || f.startsWith("public/")) continue;
    if (!/\.(ts|tsx|js|jsx|mjs|cjs|json|ya?ml|md|example)$/.test(f)) continue;
    const text = readFileSync(join(root, f), "utf8");
    assert.equal(privateKeyBlock.test(text), false, `chiave privata in ${f}`);
    const hit = text.split(/\r?\n/).find((l) => suspicious.test(l));
    assert.equal(hit, undefined, `possibile segreto in ${f}: ${hit?.trim().slice(0, 60)}`);
  }
});

test("allegati: il codice dell'endpoint non scrive su disco né su archivi persistenti", () => {
  const forbidden =
    /node:fs|from "fs"|require\("fs"\)|writeFile|createWriteStream|appendFile|mkdtemp|tmpdir|["'`]\/tmp|@vercel\/blob|\bput\(|S3Client|PutObject/;
  for (const f of contactSources) {
    const text = read(f);
    assert.equal(forbidden.test(text), false, `uso di disco o archivio in ${f}`);
  }
  // nodemailer non deve poter leggere file locali o URL indicati dall'utente
  assert.match(read("src/lib/contact/mail.ts"), /disableFileAccess: true/);
  assert.match(read("src/lib/contact/mail.ts"), /disableUrlAccess: true/);
});

test("log: l'endpoint scrive solo oggetti con codici tecnici (event), mai console.log o dati liberi", () => {
  for (const f of contactSources) {
    const text = read(f);
    assert.equal(/console\.(log|info|warn|debug|trace)\s*\(/.test(text), false, `console non ammessa in ${f}`);
    for (const call of text.match(/console\.error\s*\([^;]*;/g) ?? []) {
      assert.match(call, /JSON\.stringify\(\{ event: "/, `console.error non conforme in ${f}: ${call.slice(0, 80)}`);
    }
  }
  // gli oggetti loggati non includono campi del messaggio
  const handler = read("src/lib/contact/handler.ts");
  for (const forbidden of ["fields.", "parsed.fields", "attachment.safeName", "file.name", "clientIp", "config.pass", "config.user"]) {
    const logs = handler.match(/console\.error\s*\([^;]*;/g) ?? [];
    for (const l of logs) assert.equal(l.includes(forbidden), false, `il log contiene ${forbidden}`);
  }
});

test("il file di esempio e la guida non contengono indirizzi o valori reali di credenziali", () => {
  assert.ok(existsSync(join(root, ".env.example")));
  const guide = join(root, "docs/contact-form");
  for (const f of readdirSync(guide)) {
    const text = readFileSync(join(guide, f), "utf8");
    assert.equal(/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text), false, `chiave in ${f}`);
  }
});
