export const metadata = {
  title: "Privacy Policy | Dentro le Parole",
  description:
    "Informativa privacy del sito Dentro le Parole di Donatella Tamburini.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-ivory">
      {/* SFONDI */}
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      {/* velo scuro generale */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32">
        <div className="rounded-[28px] border border-gold/20 bg-black/55 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-10">
          <p className="text-sm uppercase tracking-[0.18em] text-gold/80">
            Info legali
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight text-ivory md:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-ivory/70">
            Ultimo aggiornamento: 8 marzo 2026
          </p>

          <div className="mt-10 space-y-6 text-ivory/85">
            <p>
              La presente informativa descrive le modalità di trattamento dei dati
              personali degli utenti che visitano il sito “Dentro le Parole” e che
              contattano Donatella Tamburini tramite i moduli presenti sul sito o
              mediante i recapiti indicati.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-ivory">
                Titolare del trattamento
              </h2>
              <p className="mt-2">
                Titolare del trattamento è:
                <br />
                <strong className="text-ivory">Donatella Tamburini</strong>
                <br />
                [inserire indirizzo o sede professionale]
                <br />
                [inserire email di contatto]
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-ivory">
                Tipologie di dati trattati
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>dati identificativi, come nome e cognome;</li>
                <li>dati di contatto, come indirizzo email e numero di telefono;</li>
                <li>dati contenuti nei messaggi inviati tramite form o email;</li>
                <li>eventuali allegati inviati per richieste di valutazione;</li>
                <li>dati tecnici di navigazione raccolti automaticamente.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-ivory">
                Finalità del trattamento
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>rispondere alle richieste inviate tramite il sito;</li>
                <li>fornire informazioni sui servizi offerti;</li>
                <li>gestire richieste editoriali e valutazioni;</li>
                <li>adempiere a eventuali obblighi di legge;</li>
                <li>garantire sicurezza e corretto funzionamento del sito.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}