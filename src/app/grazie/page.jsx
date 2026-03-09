import Link from "next/link";

export const metadata = {
  title: "Grazie | Dentro le Parole",
  description: "La tua richiesta è stata inviata correttamente.",
};

export default function GraziePage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center px-6 py-20">
        <div className="w-full rounded-[32px] border border-gold/20 bg-[#161311]/92 p-10 text-center shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur md:p-14">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-2xl text-gold">
            ✨
          </div>

          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gold/75">
            Messaggio inviato
          </p>

          <h1 className="mb-6 text-3xl font-semibold text-[#F4E7CF] md:text-5xl">
            Grazie per aver scritto
          </h1>

          <div className="mx-auto max-w-2xl space-y-4 text-base leading-relaxed text-[#E7D8BF] md:text-lg">
            <p>Il tuo messaggio è stato ricevuto correttamente.</p>

            <p>
             Leggerò con attenzione la tua richiesta e ti risponderò
              appena possibile.
            </p>

            <p>
              Se hai inviato un estratto del manoscritto, verrà valutato con
              cura insieme alle informazioni che hai inserito nel modulo.
            </p>

            <p className="italic text-[#CDBA97]">Grazie per la fiducia.</p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-2xl bg-gold px-6 py-3 text-sm font-semibold text-night transition hover:opacity-95"
            >
              Torna alla home
            </Link>

            <Link
              href="/servizi"
              className="rounded-2xl border border-gold/25 bg-[#221c18] px-6 py-3 text-sm font-medium text-[#F4E7CF] transition hover:border-gold/45"
            >
              Scopri i servizi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}