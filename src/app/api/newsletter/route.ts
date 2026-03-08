import { NextResponse } from "next/server";

type BrevoError = {
  message?: string;
  code?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email mancante." },
        { status: 400 }
      );
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      return NextResponse.json(
        { ok: false, message: "Inserisci un indirizzo email valido." },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_LIST_ID);

    if (!apiKey || !listId) {
      return NextResponse.json(
        { ok: false, message: "Configurazione Brevo mancante." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as BrevoError;

      return NextResponse.json(
        {
          ok: false,
          message:
            errorData?.message || "Impossibile completare l'iscrizione.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Iscrizione completata. Controlla la tua email.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Errore interno del server." },
      { status: 500 }
    );
  }
}