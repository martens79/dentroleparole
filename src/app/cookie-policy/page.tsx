export const metadata = {
  title: "Cookie Policy | Dentro le Parole",
  description:
    "Informativa cookie del sito Dentro le Parole di Donatella Tamburini.",
};

export default function CookiePolicyPage() {
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
            Cookie Policy
          </h1>

          <p className="mt-4 text-sm text-ivory/70">
            Ultimo aggiornamento: 8 marzo 2026
          </p>

          <div className="mt-10 space-y-8 text-ivory/85">
            <p>
              La presente Cookie Policy descrive l’uso dei cookie e di strumenti
              analoghi sul sito “Dentro le Parole”.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Cosa sono i cookie
              </h2>
              <p className="mt-2">
                I cookie sono piccoli file di testo che i siti web inviano al
                dispositivo dell’utente durante la navigazione, per essere poi
                ritrasmessi agli stessi siti alla visita successiva.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Tipologie di cookie utilizzate
              </h2>
              <p className="mt-2">
                Il sito può utilizzare le seguenti categorie di cookie:
              </p>

              <div className="mt-4 space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-ivory">
                    1. Cookie tecnici
                  </h3>
                  <p className="mt-2">
                    Sono necessari al corretto funzionamento del sito e non
                    richiedono il consenso dell’utente. Comprendono, ad esempio,
                    cookie di navigazione, sicurezza, gestione sessione o
                    preferenze tecniche.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ivory">
                    2. Cookie analitici
                  </h3>
                  <p className="mt-2">
                    Il sito potrebbe utilizzare strumenti analitici per
                    raccogliere dati aggregati o statistiche sull’utilizzo delle
                    pagine. Se tali strumenti consentono identificazione o
                    tracciamento non strettamente tecnico, saranno attivati solo
                    previo consenso, ove richiesto.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ivory">
                    3. Cookie di profilazione o marketing
                  </h3>
                  <p className="mt-2">
                    Al momento, il sito{" "}
                    <strong className="text-ivory">
                      [indicare se non utilizza / utilizza]
                    </strong>{" "}
                    cookie di profilazione o marketing. Qualora venissero
                    utilizzati in futuro, essi saranno installati solo previa
                    acquisizione del consenso dell’utente, secondo la normativa
                    applicabile.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Cookie di terze parti
              </h2>
              <p className="mt-2">
                Il sito potrebbe incorporare contenuti o servizi forniti da terze
                parti, come mappe, video, font, plugin social o strumenti
                statistici. Tali soggetti potrebbero installare propri cookie
                secondo le rispettive policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Gestione del consenso
              </h2>
              <p className="mt-2">
                Quando richiesto dalla normativa, il sito raccoglie il consenso
                dell’utente prima dell’installazione di cookie o strumenti di
                tracciamento non tecnici.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Come gestire o disabilitare i cookie
              </h2>
              <p className="mt-2">
                L’utente può gestire le preferenze relative ai cookie tramite il
                banner presente sul sito, se disponibile, oppure attraverso le
                impostazioni del proprio browser, che consentono di bloccare o
                cancellare i cookie già installati.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Base normativa
              </h2>
              <p className="mt-2">
                L’uso dei cookie avviene nel rispetto della normativa europea e
                italiana applicabile in materia di protezione dei dati personali e
                comunicazioni elettroniche.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">Aggiornamenti</h2>
              <p className="mt-2">
                La presente Cookie Policy può essere aggiornata in qualsiasi
                momento, anche in seguito a modifiche tecniche del sito o dei
                servizi di terze parti utilizzati.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">Contatti</h2>
              <p className="mt-2">
                Per informazioni sui cookie e sul trattamento dei dati è possibile
                contattare:
                <br />
                <strong className="text-ivory">
                  [inserire email di contatto]
                </strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}