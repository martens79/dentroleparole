
import NewsletterBox from "@/components/NewsletterMini";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-midnight/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr_1.35fr] md:items-start">
          {/* Brand */}
          <div>
            <div className="font-semibold tracking-wide text-ivory/95">
              Donatella Tamburini
            </div>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory/65">
              Editing narrativo, correzione di bozze e supporto alla scrittura.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1 text-xs text-ivory/75">
                Narrativa
              </span>
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1 text-xs text-ivory/75">
                Fantasy
              </span>
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1 text-xs text-ivory/75">
                Self publishing
              </span>
            </div>
          </div>

          {/* Contatti */}
          <div>
            <div className="font-semibold text-gold">Contatti</div>

            <div className="mt-3 space-y-2 text-sm text-ivory/75">
              <div>
                Email:{" "}
                <a
                  href="mailto:contatti@dentroleparole.com"
                  className="text-ivory/90 transition hover:text-gold"
                >
                  contatti@dentroleparole.com
                </a>
              </div>

              <div>
                Instagram:{" "}
                <a
                  href="https://instagram.com/donatellatamburini82.editor"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ivory/90 transition hover:text-gold"
                >
                  @donatellatamburini82.editor
                </a>
              </div>

              <div className="pt-3">
                <a
                  href="#contatti"
                  className="inline-flex items-center gap-2 rounded-2xl border border-gold/25 bg-night/35 px-4 py-2 text-sm text-ivory/90 transition hover:border-gold/45"
                >
                  Richiedi un preventivo <span className="text-gold">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Info + Newsletter */}
          <div>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.4fr] lg:items-start">
              {/* Info */}
              <div>
                <div className="font-semibold text-gold">Info</div>

                <div className="mt-3 grid gap-2 text-sm">
                  <a
                    href="/privacy-policy"
                    className="text-ivory/75 transition hover:text-gold"
                  >
                    Privacy Policy
                  </a>

                  <a
                    href="/termini-di-servizio"
                    className="text-ivory/75 transition hover:text-gold"
                  >
                    Termini di servizio
                  </a>

                  <a
                    href="/cookie-policy"
                    className="text-ivory/75 transition hover:text-gold"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>

             {/* Newsletter */}
<div className="rounded-2xl border border-gold/20 bg-night/30 p-5 backdrop-blur-sm">
  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/85">
    Newsletter
  </div>

  <p className="mt-2 text-sm leading-relaxed text-ivory/75">
    Ricevi articoli, consigli editoriali e spunti utili per lavorare
    meglio sul tuo manoscritto.
  </p>

  <div className="mt-4">
    <NewsletterBox />
  </div>

  <p className="mt-2 text-xs leading-relaxed text-ivory/45">
    Niente spam. Solo contenuti utili e aggiornamenti occasionali.
  </p>
</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
       <div className="mt-10 border-t border-gold/10 pt-6 text-center">
  <div className="text-xs text-ivory/50">
    © {new Date().getFullYear()} Donatella Tamburini
  </div>

  <div className="mt-3 text-sm tracking-wide text-ivory/60">
    Architettura digitale
    <span className="mx-2 text-gold/50">—</span>
  <a
  href="https://martenslab.com"
  target="_blank"
  rel="noreferrer"
  className="group relative font-semibold text-gold transition hover:text-gold/90"
>
  <span className="relative z-10 transition group-hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]">
    MartensLab
  </span>

  <span className="absolute inset-x-0 -bottom-1 h-[1px] bg-gold/40 transition-all duration-300 group-hover:h-[2px] group-hover:bg-gold"></span>
</a>
  </div>
</div>
      </div>
    </footer>
  );
}