import { createDefaultDeps, handleGet, handlePost } from "@/lib/contact/handler";

// Runtime Node.js (SMTP non è supportato dal runtime Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
// Elaborazione in UE (Francoforte). Configurazione nel codice della funzione:
// le impostazioni globali del progetto Vercel non vengono modificate.
export const preferredRegion = "fra1";

// Istanza condivisa per i limiti in memoria.
const deps = createDefaultDeps();

export function GET(request: Request) {
  return handleGet(request, deps);
}

export function POST(request: Request) {
  return handlePost(request, deps);
}
