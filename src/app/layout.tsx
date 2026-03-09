import type { ReactNode } from "react";
import { Cormorant_Garamond, Cinzel_Decorative } from "next/font/google";
import Header from "../components/Header";
import PromoBanner from "../components/PromoBanner";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

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

export const metadata = {
  title: "Donatella Tamburini – Editing e servizi editoriali",
  description: "Editing narrativo, correzione di bozze e consulenza per autori. Servizi editoriali professionali.",
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

      </body>
    </html>
  );
}