import React from "react";

type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
};

export default function Section({
  id,
  title,
  subtitle,
  children,
  titleClassName = "",
  subtitleClassName = "",
}: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-center">
        <h2
          className={[
            "inline-flex items-center justify-center rounded-full border border-gold/20 bg-midnight/35 px-5 py-2.5 font-serif text-3xl text-gold backdrop-blur md:text-4xl",
            titleClassName,
          ].join(" ")}
        >
          {title}
        </h2>

        <div className="mx-auto mt-4 h-px w-24 bg-gold/35" />

        {subtitle ? (
          <p
            className={[
              "mx-auto mt-4 max-w-prose text-center text-ivory/80 md:text-lg",
              subtitleClassName,
            ].join(" ")}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="mt-8">{children}</div>
    </section>
  );
}