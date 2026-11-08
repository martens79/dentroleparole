import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const metadata = pageMetadata({
  title: "Cookie Policy | Dentro le Parole",
  description:
    "Informativa cookie del sito Dentro le Parole di Donatella Tamburini.",
  path: "/cookie-policy",
});

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
            Ultimo aggiornamento: 8 novembre 2026
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
                    Sono necessari al corretto funzionamento del sito e non richiedono il consenso dell’utente. Il sito memorizza nel browser, per finalità tecniche, la scelta espressa sui cookie (conservata per 180 giorni, poi viene richiesta di nuovo) e un’indicazione di sessione per non ripetere un avviso promozionale già mostrato.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ivory">
                    2. Cookie analitici
                  </h3>
                  <p className="mt-2">
                    Il sito utilizza Google Analytics 4, servizio di analisi di Google, per raccogliere statistiche sull’utilizzo delle pagine. Questo strumento imposta cookie (tra cui “_ga” e “_ga_Z8PEVWKQVB”) e viene caricato solo dopo il consenso espresso dall’utente tramite il banner. Se l’utente rifiuta o revoca il consenso, lo strumento non viene caricato e i cookie analitici vengono rimossi.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ivory">
                    3. Cookie di profilazione o marketing
                  </h3>
                  <p className="mt-2">
                    Al momento il sito non utilizza propri cookie di profilazione o marketing. Qualora venissero
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
                Il sito non incorpora mappe, video o plugin social e i font sono serviti dal sito stesso. L’unico servizio di terze parti che installa cookie è Google Analytics, solo previo consenso (vedi sopra). Il sito contiene inoltre collegamenti verso siti esterni (ad esempio negozi online, editori e social network): l’accesso a tali siti è regolato dalle rispettive policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Gestione del consenso
              </h2>
              <p className="mt-2">
                Alla prima visita il sito mostra un banner con due pulsanti di pari evidenza, “Accetta” e “Rifiuta”. Finché l’utente non sceglie, non viene caricato alcuno strumento di tracciamento non tecnico: la semplice navigazione non costituisce consenso. La scelta può essere modificata o revocata in qualsiasi momento con il pulsante qui sotto o con il pulsante “Preferenze cookie” sempre disponibile in basso a sinistra su ogni pagina.
              </p>
              <div className="mt-4">
                <CookiePreferencesButton className="rounded-xl border border-gold/50 bg-gold/15 px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-gold/25">
                  Modifica preferenze cookie
                </CookiePreferencesButton>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ivory">
                Come gestire o disabilitare i cookie
              </h2>
              <p className="mt-2">
                L’utente può gestire le preferenze relative ai cookie tramite il pulsante “Preferenze cookie” sempre disponibile in basso a sinistra su ogni pagina, oppure attraverso le impostazioni del proprio browser, che consentono di bloccare o cancellare i cookie già installati. Cancellando i dati del browser viene eliminata anche la scelta memorizzata e il banner verrà mostrato di nuovo.
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
                  <a href="mailto:contatti@dentroleparole.com" className="text-gold underline underline-offset-4 hover:opacity-90">contatti@dentroleparole.com</a>
                </strong>
              </p>
            </section>

            <p className="text-sm text-ivory/70">
              Vedi anche: <Link href="/privacy-policy" className="text-gold underline underline-offset-4 hover:opacity-90">Privacy Policy</Link>
              {" · "}
              <Link href="/termini-di-servizio" className="text-gold underline underline-offset-4 hover:opacity-90">Termini di servizio</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}