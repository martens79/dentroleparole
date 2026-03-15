"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";


type NavItem = {
  label: string;
  href: string;
  kind?: "page" | "anchor";
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", kind: "page" },
  { label: "Servizi", href: "/servizi", kind: "anchor" },
  { label: "Chi sono", href: "/chi-sono", kind: "page" },
  { label: "Pubblicazioni", href: "/pubblicazioni", kind: "page" },
  { label: "Portfolio", href: "/portfolio", kind: "page" },
  { label: "Blog", href: "/blog", kind: "page" },
  { label: "FAQ", href: "/#faq", kind: "anchor" },
  { label: "Contatti", href: "/#contatti", kind: "anchor" },
  { label: "Testimonianze", href: "/testimonianze", kind: "page" },
  
];

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -14, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
};

function normalizePath(p: string) {
  if (!p) return "/";
  return p === "" ? "/" : p;
}

function AnimatedBrandWord({
  text,
  className = "",
  baseDelay = 0,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="ink-letter"
          style={{ animationDelay: `${baseDelay + i * 0.07}s` }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const path = useMemo(() => normalizePath(pathname || "/"), [pathname]);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    const t = window.setTimeout(() => setLogoReady(true), 140);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setShowScrollTop(y > 500);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const isActive = (href: string) => {
    const [base] = href.split("#");
    if (href.startsWith("/#")) return path === "/";
    return base === path;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <header
  className="fixed inset-x-0 top-[34px] z-[100]"
  style={{ transform: "translateZ(0)" }}
>
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

        <div className="mx-auto max-w-6xl px-4 pt-0 md:px-6">
          <div
            className={[
              "relative flex items-center justify-between gap-4 rounded-2xl border transition-all duration-300",
              "border-white/10",
              scrolled
                ? "bg-black/72 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.42)] backdrop-blur-xl md:px-5"
                : "bg-black/38 px-4 py-4 backdrop-blur-md md:px-5",
            ].join(" ")}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D4AF37]/[0.05] via-transparent to-[#D4AF37]/[0.04]" />

            {/* LOGO */}
<Link
  href="/"
  className="group relative z-10 inline-flex items-center shrink-0 leading-none"
>
  <div className="relative flex flex-col">
    <span
      className={[
        "flex items-center whitespace-nowrap text-[#F3E9D2] transition-all duration-300",
        scrolled ? "text-[20px] md:text-[25px]" : "text-[24px] md:text-[30px]",
      ].join(" ")}
    >
      <span className="brand-dentro font-semibold uppercase tracking-[0.12em]">
        DENTRO
      </span>

      <span className="mx-1.5 md:mx-2" />

      <span
        className={[
          "brand-parole relative inline-block italic tracking-[0.035em]",
          logoReady ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {logoReady ? (
          <span className="relative inline-block">
            <AnimatedBrandWord text="le Parole" baseDelay={0.14} />
            <span className="ink-sheen" aria-hidden="true" />
          </span>
        ) : (
          "le Parole"
        )}
      </span>

      <span className="ml-1.5 md:ml-2 flex items-center">
        <Image
          src="/images/piuma.png"
          alt="Piuma"
          width={scrolled ? 16 : 18}
          height={scrolled ? 16 : 18}
          className="object-contain opacity-85 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
        />
      </span>
    </span>

    <span
      className={[
        "mt-2 h-px bg-[#F3E9D2]/20 transition-all duration-300 group-hover:bg-[#F3E9D2]/50",
        scrolled ? "w-[205px] md:w-[250px]" : "w-[235px] md:w-[290px]",
      ].join(" ")}
    />

    <span className="pointer-events-none absolute -left-2 top-1/2 h-8 w-20 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />
  </div>
</Link>

            {/* DESKTOP NAV */}
            <nav className="relative z-10 hidden items-center gap-8 text-sm md:flex">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "relative group nav-link transition-colors duration-300",
                      active ? "text-[#F3E9D2]" : "text-[#F3E9D2]/80 hover:text-[#F3E9D2]",
                    ].join(" ")}
                  >
                    <span className="relative z-10">{item.label}</span>

                    <span className="absolute left-0 -bottom-1 h-px w-full overflow-hidden">
                      <span
                        className={[
                          "absolute inset-y-0 left-0 w-full transform-gpu bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent transition duration-300",
                          active
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        ].join(" ")}
                      />
                    </span>

                    {active ? (
                      <span className="absolute -right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#D4AF37]/80 shadow-[0_0_18px_rgba(212,175,55,0.35)]" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            {/* MOBILE BUTTON */}
            <button
              type="button"
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              aria-expanded={open}
              onClick={toggle}
              className="relative z-10 inline-flex items-center justify-center rounded-2xl border border-gold/25 bg-midnight/40 px-3 py-2 text-ivory/90 backdrop-blur transition hover:border-gold/45 md:hidden"
            >
              <span className="text-xs uppercase tracking-[0.18em]">
                {open ? "Chiudi" : "Menu"}
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[110] md:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.button
                aria-label="Chiudi menu"
                onClick={close}
                className="absolute inset-0 bg-black/72"
                whileTap={{ opacity: 0.85 }}
              />

              <motion.div
                className="absolute left-3 right-3 top-3 rounded-3xl border border-gold/25 bg-midnight/90 p-4 shadow-[0_0_60px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                variants={panelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.18em] text-ivory/70">
                    Navigazione
                  </div>

                  <button
                    onClick={close}
                    className="rounded-2xl border border-gold/20 bg-night/20 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ivory/80 transition hover:border-gold/45 hover:text-ivory"
                  >
                    Esc
                  </button>
                </div>

                <motion.div
                  className="mt-4 grid gap-2"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  {navItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <motion.div key={item.href} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={close}
                          className={[
                            "block rounded-2xl border bg-night/15 px-4 py-3 transition",
                            active
                              ? "border-gold/45 bg-night/25"
                              : "border-gold/15 hover:border-gold/45 hover:bg-night/25",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between">
                            <span className={active ? "text-ivory" : "text-ivory/90"}>
                              {item.label}
                            </span>

                            <motion.span
                              className="text-gold/80"
                              initial={{ x: 0, opacity: 0.7 }}
                              whileHover={{ x: 4, opacity: 1 }}
                              transition={{ duration: 0.18 }}
                            >
                              →
                            </motion.span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div
                  className="relative mt-4 overflow-hidden rounded-2xl border border-gold/15 bg-night/10 p-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.22 }}
                >
                  <motion.div
                    className="absolute -inset-y-10 -left-40 w-40 rotate-12 bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent"
                    animate={{ x: [0, 520] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1.2,
                    }}
                  />

                  <div className="relative">
                    <div className="font-semibold text-gold">Richiedi una valutazione</div>

                    <p className="mt-2 text-sm text-ivory/80">
                      Invia un estratto (5–10 pagine). Risposta entro 24–48 ore.
                    </p>

                    <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}>
                      <Link
                        href="/#contatti"
                        onClick={close}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-gold px-4 py-3 text-sm font-semibold text-night transition hover:opacity-95"
                      >
                        Vai al form
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {showScrollTop && !open && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Torna in alto"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 right-5 z-[120] inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-black/60 text-[#F3E9D2] shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-gold/55 hover:bg-black/75"
          >
            <span className="text-lg leading-none">↑</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}