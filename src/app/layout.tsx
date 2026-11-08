import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel_Decorative } from "next/font/google";
import Header from "../components/Header";
import PromoBanner from "../components/PromoBanner";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "it_IT",
  },
  verification: {
    google: "EelBok8f350XKkVaRbUlFrd4QyC5ne9Vkn7EY3n8XQg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className={`${cormorant.variable} ${cinzelDecorative.variable}`}>
        
        <PromoBanner />

        <Header />

        <main className="pt-24">
          {children}
        </main>

        <CookieBanner />

        {/* Google Analytics: caricato solo dopo consenso esplicito (vedi Analytics.tsx) */}
        <Analytics />

      </body>
    </html>
  );
}