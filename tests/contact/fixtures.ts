// File sintetici per test e collaudo: contengono solo dati inventati, mai manoscritti reali.
import { crc32 } from "node:zlib";

export function makePdf(extraBytes = 0, body = ""): Uint8Array {
  const text = `%PDF-1.4\n1 0 obj<<>>endobj\n${body}\n%%EOF\n`;
  const b = Buffer.alloc(text.length + extraBytes, 0x20);
  b.write(text, 0, "latin1");
  return new Uint8Array(b);
}

export function makeZip(entries: { name: string; data?: string }[]): Uint8Array {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const data = Buffer.from(e.data ?? "x", "utf8");
    const crc = crc32(data);

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(data.length, 18);
    lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(name.length, 26);
    locals.push(lh, name, data);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(data.length, 20);
    ch.writeUInt32LE(data.length, 24);
    ch.writeUInt16LE(name.length, 28);
    ch.writeUInt32LE(offset, 42);
    centrals.push(ch, name);

    offset += lh.length + name.length + data.length;
  }

  const cd = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return new Uint8Array(Buffer.concat([...locals, cd, eocd]));
}

export function makeDocx(extraEntries: string[] = []): Uint8Array {
  return makeZip([
    { name: "[Content_Types].xml" },
    { name: "word/document.xml" },
    ...extraEntries.map((name) => ({ name })),
  ]);
}

export function makeDoc(withMacro = false): Uint8Array {
  const b = Buffer.alloc(2048, 0);
  Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]).copy(b, 0);
  if (withMacro) Buffer.from("_VBA_PROJECT", "utf16le").copy(b, 600);
  return new Uint8Array(b);
}

