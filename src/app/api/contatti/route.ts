import { createDefaultDeps, handleGet, handlePost } from "@/lib/contact/handler";

// Runtime Node.js (SMTP non è supportato dal runtime Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
// La regione (fra1) è impostata per questa sola funzione in vercel.json ("functions"):
// preferredRegion è deprecato e non ha effetto sul runtime Node.js.

// Istanza condivisa per i limiti in memoria.
const deps = createDefaultDeps();

export function GET(request: Request) {
  return handleGet(request, deps);
}

export function POST(request: Request) {
  return handlePost(request, deps);
}
