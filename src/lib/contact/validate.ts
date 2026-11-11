import {
  ALLOWED_EXTENSIONS,
  FIELD_LIMITS,
  MAX_FILE_BYTES,
  type AllowedExtension,
} from "./limits";

/* ------------------------------------------------------------------ */
/* Campi di testo                                                      */
/* ------------------------------------------------------------------ */

// Caratteri di controllo (inclusi CR, LF, NUL) tranne \n e \t nei campi multilinea.
const CONTROL_SINGLE = /[\u0000-\u001F\u007F\u2028\u2029]/g;
const CONTROL_MULTI = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanSingleLine(value: unknown, max: number): string | null {
  if (typeof value !== "string") return value == null ? "" : null;
  const v = value.replace(CONTROL_SINGLE, " ").replace(/\s+/g, " ").trim();
  return v.length > max ? null : v;
}

export function cleanMultiLine(value: unknown, max: number): string | null {
  if (typeof value !== "string") return value == null ? "" : null;
  const v = value.replace(/\r\n?/g, "\n").replace(CONTROL_MULTI, "").trim();
  return v.length > max ? null : v;
}

const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  return email.length <= FIELD_LIMITS.email && EMAIL_RE.test(email) && !email.includes("..");
}

export type ContactFields = {
  name: string;
  email: string;
  title: string;
  genre: string;
  words: string;
  goal: string;
  message: string;
};

export type FieldsResult =
  | { ok: true; fields: ContactFields }
  | { ok: false; invalid: string[] };

type FormLike = { get(name: string): unknown };

export function validateFields(form: FormLike): FieldsResult {
  const invalid: string[] = [];

  const name = cleanSingleLine(form.get("name"), FIELD_LIMITS.name);
  if (!name) invalid.push("name");

  const emailRaw = cleanSingleLine(form.get("email"), FIELD_LIMITS.email);
  const email = emailRaw ?? "";
  if (!email || !isValidEmail(email)) invalid.push("email");

  const title = cleanSingleLine(form.get("title"), FIELD_LIMITS.title);
  if (title === null) invalid.push("title");
  const genre = cleanSingleLine(form.get("genre"), FIELD_LIMITS.genre);
  if (genre === null) invalid.push("genre");
  const goal = cleanSingleLine(form.get("goal"), FIELD_LIMITS.goal);
  if (goal === null) invalid.push("goal");

  const wordsRaw = cleanSingleLine(form.get("words"), 12);
  let words = "";
  if (wordsRaw === null) {
    invalid.push("words");
  } else if (wordsRaw !== "") {
    if (!/^\d+$/.test(wordsRaw) || Number(wordsRaw) > FIELD_LIMITS.wordsMax) invalid.push("words");
    else words = String(Number(wordsRaw));
  }

  const message = cleanMultiLine(form.get("message"), FIELD_LIMITS.message);
  if (message === null) invalid.push("message");

  if (invalid.length > 0) return { ok: false, invalid };

  return {
    ok: true,
    fields: {
      name: name as string,
      email,
      title: title as string,
      genre: genre as string,
      words,
      goal: goal as string,
      message: message as string,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Allegato                                                            */
/* ------------------------------------------------------------------ */

const DANGEROUS_INNER_EXTENSIONS = new Set([
  "exe", "com", "bat", "cmd", "scr", "pif", "msi", "dll", "js", "mjs", "vbs", "vbe", "wsf", "ps1",
  "sh", "jar", "lnk", "hta", "html", "htm", "svg", "php", "py", "docm", "dotm", "xlsm", "pptm",
]);

export type AttachmentRejection =
  | "empty"
  | "too_large"
  | "bad_name"
  | "bad_extension"
  | "bad_content"
  | "macro";

export type AttachmentResult =
  | {
      ok: true;
      kind: AllowedExtension;
      safeName: string;
      contentType: string;
      warnings: string[];
    }
  | { ok: false; reason: AttachmentRejection };

const CONTENT_TYPES: Record<AllowedExtension, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
};

export function sanitizeFilename(original: string, kind: AllowedExtension): string {
  // Solo il nome, senza percorso.
  const base = original.split(/[\\/]/).pop() ?? "";
  let stem = base.replace(/\.[^.]*$/, "");
  stem = stem
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} ._()-]/gu, "_")
    .replace(/[ _]{2,}/g, " ")
    .replace(/^[ .]+|[ .]+$/g, "");
  const max = FIELD_LIMITS.filenameMax - kind.length - 1;
  if (stem.length > max) stem = stem.slice(0, max).trimEnd();
  if (!stem) stem = "manoscritto";
  return `${stem}.${kind}`;
}

export function getExtension(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? "";
  const i = base.lastIndexOf(".");
  return i >= 0 ? base.slice(i + 1).toLowerCase() : "";
}

function hasDangerousInnerExtension(filename: string): boolean {
  const base = filename.split(/[\\/]/).pop() ?? "";
  const parts = base.toLowerCase().split(".");
  // Tutti i segmenti dopo il primo, escluso l'ultimo (che è l'estensione vera).
  return parts.slice(1, -1).some((p) => DANGEROUS_INNER_EXTENSIONS.has(p.trim()));
}

/* ---- PDF ---- */

const PDF_ACTIVE = /\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia)\b/;

function inspectPdf(bytes: Uint8Array): { ok: boolean; warnings: string[] } {
  const head = Buffer.from(bytes.subarray(0, 1024)).toString("latin1");
  if (!head.includes("%PDF-")) return { ok: false, warnings: [] };
  const warnings: string[] = [];
  if (PDF_ACTIVE.test(Buffer.from(bytes).toString("latin1"))) {
    warnings.push("PDF con possibili elementi attivi (JavaScript, allegati incorporati o avvio di programmi)");
  }
  return { ok: true, warnings };
}

/* ---- OLE2 (.doc) ---- */

const OLE_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

function inspectDoc(bytes: Uint8Array): { ok: boolean; warnings: string[] } {
  if (bytes.length < 512) return { ok: false, warnings: [] };
  for (let i = 0; i < OLE_SIGNATURE.length; i++) if (bytes[i] !== OLE_SIGNATURE[i]) return { ok: false, warnings: [] };
  const warnings: string[] = [];
  if (Buffer.from(bytes).includes(Buffer.from("_VBA_PROJECT", "utf16le"))) {
    warnings.push("Documento .doc con possibili macro");
  }
  return { ok: true, warnings };
}

/* ---- DOCX (ZIP) ---- */

/**
 * Legge solo l'elenco dei file nella "central directory" dello ZIP.
 * Non decomprime nulla: nessun rischio di zip bomb.
 */
export function listZipEntries(bytes: Uint8Array): string[] | null {
  const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (buf.length < 22 || buf.readUInt32LE(0) !== 0x04034b50) return null;

  // End of central directory: ultimi 22 + 65535 byte.
  const min = Math.max(0, buf.length - 22 - 65_535);
  let eocd = -1;
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;

  const total = buf.readUInt16LE(eocd + 10);
  const cdSize = buf.readUInt32LE(eocd + 12);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  if (total === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) return null; // ZIP64: non atteso
  if (total > 10_000 || cdOffset + cdSize > eocd) return null;

  const names: string[] = [];
  let p = cdOffset;
  for (let n = 0; n < total; n++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50) return null;
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    if (p + 46 + nameLen > buf.length) return null;
    names.push(buf.toString("utf8", p + 46, p + 46 + nameLen));
    p += 46 + nameLen + extraLen + commentLen;
  }
  return names;
}

function inspectDocx(bytes: Uint8Array): { ok: boolean; macro: boolean; warnings: string[] } {
  const names = listZipEntries(bytes);
  if (!names) return { ok: false, macro: false, warnings: [] };
  const lower = names.map((n) => n.toLowerCase());
  const ok = lower.includes("[content_types].xml") && lower.includes("word/document.xml");
  if (!ok) return { ok: false, macro: false, warnings: [] };
  const macro = lower.some((n) => n.endsWith("vbaproject.bin"));
  const warnings: string[] = [];
  if (lower.some((n) => n.startsWith("word/embeddings/") || n.startsWith("word/activex/"))) {
    warnings.push("DOCX con oggetti incorporati o controlli ActiveX");
  }
  return { ok, macro, warnings };
}

/* ---- ingresso unico ---- */

export function inspectAttachment(input: {
  filename: string;
  size: number;
  bytes: Uint8Array;
}): AttachmentResult {
  const { filename, size, bytes } = input;

  if (size === 0 || bytes.length === 0) return { ok: false, reason: "empty" };
  if (size > MAX_FILE_BYTES || bytes.length > MAX_FILE_BYTES) return { ok: false, reason: "too_large" };

  if (filename.includes("\u0000") || filename.length > 255) return { ok: false, reason: "bad_name" };
  if (hasDangerousInnerExtension(filename)) return { ok: false, reason: "bad_name" };

  const ext = getExtension(filename);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) return { ok: false, reason: "bad_extension" };
  const kind = ext as AllowedExtension;

  let warnings: string[] = [];
  if (kind === "pdf") {
    const r = inspectPdf(bytes);
    if (!r.ok) return { ok: false, reason: "bad_content" };
    warnings = r.warnings;
  } else if (kind === "doc") {
    const r = inspectDoc(bytes);
    if (!r.ok) return { ok: false, reason: "bad_content" };
    warnings = r.warnings;
  } else {
    const r = inspectDocx(bytes);
    if (!r.ok) return { ok: false, reason: "bad_content" };
    if (r.macro) return { ok: false, reason: "macro" };
    warnings = r.warnings;
  }

  return {
    ok: true,
    kind,
    safeName: sanitizeFilename(filename, kind),
    contentType: CONTENT_TYPES[kind],
    warnings,
  };
}
