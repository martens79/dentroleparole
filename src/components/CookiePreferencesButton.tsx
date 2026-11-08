"use client";

import { openCookiePreferences } from "@/lib/consent";

export default function CookiePreferencesButton({
  className = "text-left text-ivory/75 transition hover:text-gold",
  children = "Preferenze cookie",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      {children}
    </button>
  );
}
