// TEMPORANEO: diagnostica di sola lettura, solo per i deployment di Preview.
// Verifica il TLS verso il server SMTP dalla vera infrastruttura Vercel e la regione effettiva.
// NESSUNA credenziale, NESSUN messaggio inviato. Da rimuovere dopo la misura (vedi docs).
import net from "node:net";
import tls from "node:tls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const HOST = "authsmtp.securemail.pro";

function describe(c: tls.PeerCertificate) {
  return {
    subject: c.subject?.CN,
    issuer: c.issuer?.CN ?? c.issuer?.O,
    validFrom: c.valid_from,
    validTo: c.valid_to,
    sha256: c.fingerprint256,
    altNames: (c.subjectaltname ?? "").slice(0, 120),
  };
}

function readUntil(sock: net.Socket, re: RegExp, ms = 25000): Promise<string> {
  return new Promise((resolve, reject) => {
    let buf = "";
    const t = setTimeout(() => {
      sock.off("data", on);
      reject(new Error("timeout"));
    }, ms);
    const on = (d: Buffer) => {
      buf += d.toString("latin1");
      if (re.test(buf)) {
        clearTimeout(t);
        sock.off("data", on);
        resolve(buf);
      }
    };
    sock.on("data", on);
  });
}

async function tlsProbe(port: number, starttls: boolean, strict: boolean, out: Record<string, unknown>) {
  const t0 = Date.now();
  Object.assign(out, { port, mode: starttls ? "STARTTLS" : "TLS implicito", strict });
  const raw = net.connect({ host: HOST, port });
  await new Promise<void>((res, rej) => {
    raw.once("connect", () => res());
    raw.once("error", rej);
  });
  out.tcpConnectMs = Date.now() - t0;
  out.remoteAddress = raw.remoteAddress;
  let socket: net.Socket | tls.TLSSocket = raw;
  if (starttls) {
    await readUntil(raw, /^220 .*\n/m);
    raw.write("EHLO probe.invalid\r\n");
    const ehlo = await readUntil(raw, /^250 .*\n/m);
    out.ehloBeforeTls = ehlo.trim().split(/\r?\n/);
    raw.write("STARTTLS\r\n");
    await readUntil(raw, /^220 .*\n/m);
    socket = tls.connect({ socket: raw, servername: HOST, rejectUnauthorized: strict, minVersion: "TLSv1.2" });
  } else {
    raw.destroy();
    socket = tls.connect({ host: HOST, port, servername: HOST, rejectUnauthorized: strict, minVersion: "TLSv1.2" });
  }
  const t = socket as tls.TLSSocket;
  await new Promise<void>((res, rej) => {
    t.once("secureConnect", () => res());
    t.once("error", rej);
  });
  out.tlsMs = Date.now() - t0;
  out.authorized = t.authorized;
  out.authorizationError = t.authorizationError || null;
  out.protocol = t.getProtocol();
  out.cipher = t.getCipher()?.name;
  const cert = t.getPeerCertificate(true);
  const chain: ReturnType<typeof describe>[] = [];
  const seen = new Set<string>();
  let c: tls.DetailedPeerCertificate | null = cert;
  while (c && !seen.has(c.fingerprint256)) {
    seen.add(c.fingerprint256);
    chain.push(describe(c));
    c = c.issuerCertificate && c.issuerCertificate !== c ? c.issuerCertificate : null;
  }
  out.chain = chain;
  if (!starttls) {
    out.banner = (await readUntil(t as unknown as net.Socket, /^220 .*\n/m)).trim();
    t.write("EHLO probe.invalid\r\n");
    out.ehlo = (await readUntil(t as unknown as net.Socket, /^250 .*\n/m)).trim().split(/\r?\n/);
  }
  t.write("QUIT\r\n");
  t.destroy();
  return out;
}

async function safe(fn: (out: Record<string, unknown>) => Promise<unknown>) {
  const out: Record<string, unknown> = {};
  try {
    await fn(out);
    return out;
  } catch (e) {
    return { ...out, error: String((e as Error).message ?? e).slice(0, 200), code: (e as { code?: string }).code };
  }
}

/** Attende a lungo il saluto SMTP registrando ogni byte con il suo tempo. Nessuna credenziale. */
async function longWait(port: number, implicitTls: boolean) {
  const t0 = Date.now();
  const log: { ms: number; text: string }[] = [];
  const raw = net.connect({ host: HOST, port });
  await new Promise<void>((res, rej) => {
    raw.once("connect", () => res());
    raw.once("error", rej);
  });
  const sock: net.Socket = implicitTls
    ? (tls.connect({ socket: raw, servername: HOST, minVersion: "TLSv1.2" }) as unknown as net.Socket)
    : raw;
  sock.on("data", (d: Buffer) => log.push({ ms: Date.now() - t0, text: d.toString("latin1").slice(0, 160) }));
  if (implicitTls) await new Promise<void>((r) => (sock as unknown as tls.TLSSocket).once("secureConnect", () => r()));
  const handshakeMs = Date.now() - t0;
  await new Promise((r) => setTimeout(r, 30_000));
  const silentAt30 = log.length === 0;
  if (silentAt30) sock.write("EHLO probe.invalid
"); // il server risponde se gli si parla per primi?
  await new Promise((r) => setTimeout(r, 25_000));
  sock.write("QUIT
");
  sock.destroy();
  return { port, implicitTls, handshakeMs, silentAt30, receivedAfterEhloAt30: silentAt30 ? log.length > 0 : null, log };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (process.env.VERCEL_ENV === "preview" && url.searchParams.get("probe") === "wait") {
    const r465 = await safe(async (o) => Object.assign(o, await longWait(465, true)));
    return new Response(JSON.stringify({ vercelRegion: process.env.VERCEL_REGION, r465 }, null, 1), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  if (process.env.VERCEL_ENV !== "preview") {
    return new Response("Not found", { status: 404 });
  }
  const result = {
    vercelEnv: process.env.VERCEL_ENV,
    vercelRegion: process.env.VERCEL_REGION ?? null,
    node: process.version,
    strict465: await safe((o) => tlsProbe(465, false, true, o)),
    insecure465: await safe((o) => tlsProbe(465, false, false, o)),
    strict587: await safe((o) => tlsProbe(587, true, true, o)),
  };
  return new Response(JSON.stringify(result, null, 1), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
