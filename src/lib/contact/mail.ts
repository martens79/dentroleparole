import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { ContactConfig } from "./config";
import type { ContactFields } from "./validate";

/** Interfaccia minima del trasporto: permette di sostituirlo con uno simulato nei test. */
export type MailTransport = {
  sendMail(options: MailOptions): Promise<unknown>;
};

export type MailOptions = {
  from: { name: string; address: string };
  to: string;
  replyTo: { name: string; address: string };
  subject: string;
  text: string;
  headers: Record<string, string>;
  attachments?: { filename: string; content: Buffer; contentType: string; contentDisposition: "attachment" }[];
};

export type AttachmentInfo = {
  safeName: string;
  contentType: string;
  content: Buffer;
  warnings: string[];
};

/** Oggetto identico a quello usato finora con FormSubmit. */
export const SUBJECT = "Nuova richiesta dal sito Dentro le Parole";

export function buildMailOptions(
  config: Pick<ContactConfig, "from" | "to">,
  fields: ContactFields,
  attachment: AttachmentInfo | null,
): MailOptions {
  const flagged = attachment !== null && attachment.warnings.length > 0;

  const lines = [
    `Nome: ${fields.name}`,
    `Email: ${fields.email}`,
    `Titolo: ${fields.title || "-"}`,
    `Genere: ${fields.genre || "-"}`,
    `Numero parole: ${fields.words || "-"}`,
    `Obiettivo: ${fields.goal || "-"}`,
    "",
    "Messaggio:",
    fields.message || "-",
    "",
    attachment
      ? `Allegato: ${attachment.safeName} (${attachment.content.length} byte)`
      : "Allegato: nessuno",
  ];
  if (flagged && attachment) {
    lines.push("", "ATTENZIONE: il controllo automatico ha segnalato:");
    for (const w of attachment.warnings) lines.push(`- ${w}`);
    lines.push("Apri l'allegato solo se riconosci il mittente.");
  }
  lines.push("", "—", "Inviato dal modulo di dentroleparole.com");

  return {
    from: { name: "Dentro le Parole - modulo sito", address: config.from },
    to: config.to,
    replyTo: { name: fields.name, address: fields.email },
    subject: flagged ? `[ATTENZIONE: allegato da verificare] ${SUBJECT}` : SUBJECT,
    text: lines.join("\n"),
    headers: { "X-Contact-Form": "dentroleparole.com" },
    attachments: attachment
      ? [
          {
            filename: attachment.safeName,
            content: attachment.content,
            contentType: attachment.contentType,
            contentDisposition: "attachment",
          },
        ]
      : undefined,
  };
}

/**
 * Opzioni del trasporto SMTP. TLS sempre verificato: nessuna scorciatoia
 * (`rejectUnauthorized` resta true, protocollo minimo TLS 1.2).
 */
export function buildTransportOptions(config: ContactConfig): SMTPTransport.Options {
  return {
    host: config.host,
    port: config.port,
    secure: config.secure, // true per la 465 (TLS implicito)
    requireTLS: !config.secure, // sulle altre porte il passaggio a TLS è obbligatorio
    auth: { user: config.user, pass: config.pass },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true, servername: config.host },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 25_000,
    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false,
  };
}

export function createSmtpTransport(config: ContactConfig): MailTransport {
  return nodemailer.createTransport(buildTransportOptions(config)) as unknown as MailTransport;
}
