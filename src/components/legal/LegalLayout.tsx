import type { ReactNode } from "react";
import Link from "next/link";

type Confirmable = string | null | false;

/** Evidenza per i dati ancora da confermare (visibile solo finché il campo è `null`). */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <span
      data-legal-todo
      className="rounded bg-amber-400/20 px-1.5 py-0.5 text-amber-200"
    >
      [DA CONFERMARE: {children}]
    </span>
  );
}

/** Mostra il valore confermato, l'evidenza "da confermare" se `null`, niente se `false`. */
export function Val({ v, todo }: { v: Confirmable; todo: string }) {
  if (v === false) return null;
  if (v === null) return <Todo>{todo}</Todo>;
  return <>{v}</>;
}

export const legalLink =
  "text-gold underline underline-offset-4 hover:opacity-90";

export function LegalPage({
  title,
  updated,
  solidBackground = false,
  children,
}: {
  title: string;
  updated: string;
  solidBackground?: boolean;
  children: ReactNode;
}) {
  return (
    <main
      className={`relative min-h-screen overflow-hidden ${
        solidBackground ? "bg-[#0b0b12] " : ""
      }text-ivory`}
    >
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32">
        <div className="rounded-[28px] border border-gold/20 bg-black/55 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-10">
          <p className="text-sm uppercase tracking-[0.18em] text-gold/80">
            Info legali
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-ivory md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-ivory/70">
            Ultimo aggiornamento: {updated}
          </p>

          <div className="mt-10 space-y-6 text-ivory/85">{children}</div>
        </div>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-ivory">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6">{children}</ul>;
}

const DOCS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/termini-di-servizio", label: "Termini di servizio" },
];

/** Collegamenti tra i tre documenti legali. */
export function RelatedLegalLinks({ current }: { current: string }) {
  const items = DOCS.filter((d) => d.href !== current);
  return (
    <p className="text-sm text-ivory/70">
      Vedi anche:{" "}
      {items.map((d, i) => (
        <span key={d.href}>
          {i > 0 ? " · " : null}
          <Link href={d.href} className={legalLink}>
            {d.label}
          </Link>
        </span>
      ))}
    </p>
  );
}
