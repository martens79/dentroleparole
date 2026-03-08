import React from "react";

type CardProps = {
  title: string;
  desc: string;
  icon?: React.ElementType;
  full?: boolean;
  badge?: string;
  cta?: React.ReactNode;
  variant?: "default" | "compact";
};

export default function Card({
  title,
  desc,
  icon: Icon,
  full = false,
  badge,
  cta,
  variant = "default",
}: CardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={[
        "premium-card rounded-3xl border border-gold/25 bg-midnight/55 backdrop-blur transition hover:border-gold/45",
        isCompact ? "p-5" : "p-6",
        full ? "w-full" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {Icon ? (
          <div
            className={[
              "premium-icon mt-0.5 shrink-0 rounded-2xl border border-gold/20 bg-night/30 flex items-center justify-center",
              isCompact ? "h-11 w-11" : "h-12 w-12",
            ].join(" ")}
          >
            <Icon className={[isCompact ? "h-5 w-5" : "h-5 w-5", "text-gold"].join(" ")} />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <div
                className={[
                  "text-gold font-semibold leading-snug",
                  isCompact ? "text-base" : "text-lg",
                ].join(" ")}
              >
                {title}
              </div>

              {!isCompact ? (
                <div className="mt-2 h-px w-10 bg-gold/35" />
              ) : null}
            </div>

            {badge ? (
              <span className="rounded-full border border-gold/20 bg-night/30 px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ivory/75">
                {badge}
              </span>
            ) : null}
          </div>

          <p
            className={[
              "text-ivory/88 leading-relaxed",
              isCompact ? "mt-2 text-sm" : "mt-3 text-base",
            ].join(" ")}
          >
            {desc}
          </p>

          {cta ? <div className={isCompact ? "mt-4" : "mt-5"}>{cta}</div> : null}
        </div>
      </div>
    </div>
  );
}