import test from "node:test";
import assert from "node:assert/strict";
import net from "node:net";
import nodemailer from "nodemailer";
import { buildMailOptions, createSmtpTransport } from "../../src/lib/contact/mail";
import { loadConfig } from "../../src/lib/contact/config";
import { handlePost } from "../../src/lib/contact/handler";
import { TEST_ENV, baseFields, makeHarness, makePdf, makeRequest } from "./helpers";

/**
 * Server SMTP finto, in ascolto solo su 127.0.0.1: nessun traffico verso Internet,
 * nessuna email reale. Registra ciò che riceve.
 */
type Received = { auth: string[]; mailFrom: string[]; rcptTo: string[]; data: string };

function startFakeSmtp(options: { rejectAuth?: boolean } = {}): Promise<{ port: number; received: Received[]; close(): Promise<void> }> {
  const received: Received[] = [];
  const server = net.createServer((socket) => {
    const rec: Received = { auth: [], mailFrom: [], rcptTo: [], data: "" };
    received.push(rec);
    let inData = false;
    let buf = "";
    socket.setEncoding("latin1");
    socket.write("220 fake.test ESMTP\r\n");

    socket.on("data", (chunk: string) => {
      buf += chunk;
      if (inData) {
        const end = buf.indexOf("\r\n.\r\n");
        if (end >= 0) {
          rec.data = buf.slice(0, end);
          buf = buf.slice(end + 5);
          inData = false;
          socket.write("250 2.0.0 queued\r\n");
        }
        return;
      }
      let nl: number;
      while ((nl = buf.indexOf("\r\n")) >= 0 && !inData) {
        const line = buf.slice(0, nl);
        buf = buf.slice(nl + 2);
        const cmd = line.toUpperCase();
        if (cmd.startsWith("EHLO") || cmd.startsWith("HELO")) {
          socket.write("250-fake.test\r\n250-AUTH PLAIN LOGIN\r\n250 8BITMIME\r\n");
        } else if (cmd.startsWith("AUTH")) {
          rec.auth.push(line.split(" ")[1] ?? "");
          socket.write(options.rejectAuth ? "535 5.7.8 authentication failed\r\n" : "235 2.7.0 ok\r\n");
        } else if (cmd.startsWith("MAIL FROM")) {
          rec.mailFrom.push(line);
          socket.write("250 ok\r\n");
        } else if (cmd.startsWith("RCPT TO")) {
          rec.rcptTo.push(line);
          socket.write("250 ok\r\n");
        } else if (cmd === "DATA") {
          socket.write("354 go\r\n");
          inData = true;
          if (buf.length > 0) socket.emit("data", "");
        } else if (cmd === "QUIT") {
          socket.write("221 bye\r\n");
          socket.end();
        } else {
          socket.write("250 ok\r\n");
        }
      }
    });
    socket.on("error", () => {});
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as net.AddressInfo).port;
      resolve({
        port,
        received,
        close: () => new Promise<void>((r) => server.close(() => r())),
      });
    });
  });
}

test("SMTP simulato: il messaggio arriva con mittente, destinatario, Reply-To e allegato intatti", async () => {
  const smtp = await startFakeSmtp();
  try {
    const transport = nodemailer.createTransport({
      host: "127.0.0.1",
      port: smtp.port,
      secure: false,
      ignoreTLS: true, // solo per il server finto locale
      auth: { user: "form@example.test", pass: "x" },
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const pdf = Buffer.from(makePdf(500, "contenuto di prova"));
    const options = buildMailOptions(
      { from: "form@example.test", to: "contatti@example.test" },
      { name: "Mario Rossi", email: "mario@example.org", title: "", genre: "", words: "", goal: "", message: "ciao" },
      { safeName: "libro.pdf", contentType: "application/pdf", content: pdf, warnings: [] },
    );
    await transport.sendMail(options);

    assert.equal(smtp.received.length, 1);
    const r = smtp.received[0];
    assert.equal(r.auth.length, 1);
    assert.match(r.mailFrom[0], /<form@example\.test>/);
    assert.match(r.rcptTo[0], /<contatti@example\.test>/);
    assert.match(r.data, /^Reply-To: .*mario@example\.org/im);
    assert.match(r.data, /^Subject: Nuova richiesta dal sito Dentro le Parole/im);
    assert.match(r.data, /Content-Disposition: attachment; filename=libro\.pdf/i);
    // l'allegato è in base64: decodificandolo si riottiene il file originale
    const b64 = r.data.split(/filename=libro\.pdf\r?\n\r?\n/i)[1]?.split(/\r?\n--/)[0].replace(/\s+/g, "") ?? "";
    assert.ok(Buffer.from(b64, "base64").equals(pdf), "allegato alterato");
  } finally {
    await smtp.close();
  }
});

test("SMTP simulato: autenticazione rifiutata → 502 generico, solo il codice tecnico nei log", async () => {
  const smtp = await startFakeSmtp({ rejectAuth: true });
  const h = makeHarness();
  try {
    const cfg = loadConfig({ ...TEST_ENV, SMTP_HOST: "127.0.0.1", SMTP_PORT: String(smtp.port) });
    assert.ok(cfg.ok);
    if (!cfg.ok) return;
    // Trasporto reale con le stesse opzioni, ma senza TLS obbligatorio perché il server finto non lo offre.
    h.deps.transportFor = () =>
      nodemailer.createTransport({
        host: "127.0.0.1",
        port: smtp.port,
        secure: false,
        ignoreTLS: true,
        auth: { user: cfg.config.user, pass: "password-sbagliata" },
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 5000,
      }) as never;
    const res = await handlePost(
      makeRequest({ fields: baseFields(h.token(), { name: "Nome Riservato" }), file: { name: "a.pdf", bytes: makePdf() } }),
      h.deps,
    );
    assert.equal(res.status, 502);
    const logged = h.logs.join("\n");
    assert.match(logged, /EAUTH/);
    assert.equal(logged.includes("Nome Riservato"), false);
    assert.equal(logged.includes("password-sbagliata"), false);
  } finally {
    h.restore();
    await smtp.close();
  }
});

test("SMTP simulato: server non raggiungibile → 502 e codice di connessione nei log", async () => {
  // Apro e chiudo un server per ottenere una porta locale sicuramente chiusa.
  const smtp = await startFakeSmtp();
  const port = smtp.port;
  await smtp.close();

  const h = makeHarness({ env: { ...TEST_ENV, SMTP_HOST: "127.0.0.1", SMTP_PORT: String(port) } });
  try {
    // Con le opzioni reali (TLS obbligatorio su porta diversa da 465) la connessione a una porta chiusa deve fallire.
    h.deps.transportFor = createSmtpTransport;
    const res = await handlePost(makeRequest({ fields: baseFields(h.token()) }), h.deps);
    assert.equal(res.status, 502);
    assert.match(h.logs.join("\n"), /contact_send_failed/);
  } finally {
    h.restore();
  }
});
