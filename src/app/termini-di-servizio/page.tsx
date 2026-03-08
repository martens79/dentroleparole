export const metadata = {
  title: "Termini di Servizio | Dentro le Parole",
  description:
    "Termini di utilizzo del sito Dentro le Parole di Donatella Tamburini.",
};

export default function TerminiDiServizioPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b12] text-ivory">
      {/* SFONDI */}
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      {/* OVERLAY SCURO */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32">
        <div className="rounded-[28px] border border-gold/20 bg-black/55 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-10">
          <p className="text-sm uppercase tracking-[0.18em] text-gold/80">
            Info legali
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight text-ivory md:text-5xl">
            Termini di Servizio
          </h1>

          <p className="mt-4 text-sm text-ivory/70">
            Ultimo aggiornamento: 8 marzo 2026
          </p>

          <div className="mt-10 space-y-8 text-ivory/85">
            <p>
              L’accesso e l’utilizzo del presente sito implicano l’accettazione dei
              presenti Termini di Servizio.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Titolare del sito
              </h2>
              <p className="mt-2">
                Il sito è gestito da:
                <br />
                <strong className="text-ivory">Donatella Tamburini</strong>
                <br />
                [inserire email di contatto]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Oggetto del sito
              </h2>
              <p className="mt-2">
                Il sito ha finalità informative e promozionali e presenta servizi
                editoriali, di scrittura, revisione testi, coaching e realizzazione
                audiolibri.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Natura delle informazioni pubblicate
              </h2>
              <p className="mt-2">
                I contenuti presenti sul sito hanno carattere informativo e
                descrittivo. L’invio di una richiesta tramite form o email non
                comporta automaticamente la conclusione di un contratto né
                l’accettazione dell’incarico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Richieste di contatto e valutazione
              </h2>
              <p className="mt-2">
                Le richieste inviate dagli utenti tramite il sito sono considerate
                come semplici richieste di contatto, informazioni o preventivo.
                Eventuali collaborazioni professionali saranno definite
                separatamente tra le parti.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Proprietà intellettuale
              </h2>
              <p className="mt-2">
                Tutti i contenuti del sito, salvo ove diversamente indicato,
                inclusi testi, grafiche, elementi visivi, marchi, logo e struttura
                dei contenuti, sono protetti dalla normativa applicabile in
                materia di proprietà intellettuale e non possono essere copiati,
                riprodotti o utilizzati senza autorizzazione.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Obblighi dell’utente
              </h2>
              <p className="mt-2">
                L’utente si impegna a utilizzare il sito in modo lecito e corretto,
                evitando:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-ivory/85">
                <li>usi fraudolenti o lesivi dei diritti altrui;</li>
                <li>invio di contenuti illeciti, offensivi o dannosi;</li>
                <li>tentativi di compromettere sicurezza o funzionalità del sito.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Limitazione di responsabilità
              </h2>
              <p className="mt-2">
                Il titolare si impegna a mantenere le informazioni del sito
                aggiornate e corrette, ma non garantisce l’assenza di errori,
                interruzioni o indisponibilità temporanee. Salvo dolo o colpa
                grave, il titolare non potrà essere ritenuto responsabile per
                danni derivanti dall’uso del sito o dall’impossibilità temporanea
                di accedervi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Link esterni
              </h2>
              <p className="mt-2">
                Il sito può contenere collegamenti a siti terzi. Il titolare non è
                responsabile dei contenuti, delle policy o del funzionamento di
                siti esterni non direttamente controllati.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Modifiche ai termini
              </h2>
              <p className="mt-2">
                Il titolare si riserva il diritto di modificare in qualsiasi
                momento i presenti Termini di Servizio. Le modifiche avranno
                effetto dalla loro pubblicazione su questa pagina.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Legge applicabile
              </h2>
              <p className="mt-2">
                I presenti termini sono disciplinati dalla legge italiana, salvo
                diversa disposizione inderogabile di legge.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">Contatti</h2>
              <p className="mt-2">
                Per informazioni relative ai presenti termini è possibile scrivere a:
                <br />
                <strong className="text-ivory">[inserire email di contatto]</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}