"use client";

import { useEffect } from "react";
import { useConsentState } from "@/lib/consent";

const GA_ID = "G-Z8PEVWKQVB";
const GA_SCRIPT_ATTR = "data-dlp-ga";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function clearGoogleAnalyticsCookies() {
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains: Array<string | null> = [null, host, `.${host}`];
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join(".")}`);

  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => /^_ga(_|$)/.test(name) || name === "_gid" || name.startsWith("_gat"));

  for (const name of names) {
    for (const domain of domains) {
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax` +
        (domain ? `; domain=${domain}` : "");
    }
  }
}

function enableGoogleAnalytics() {
  window[`ga-disable-${GA_ID}`] = false;
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = function () {
      // gtag richiede l'oggetto `arguments`, non un array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }

  const alreadyLoaded = document.querySelector(`script[${GA_SCRIPT_ATTR}]`);
  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.setAttribute(GA_SCRIPT_ATTR, "true");
    document.head.appendChild(script);
    window.gtag("js", new Date());
  }

  window.gtag("config", GA_ID);
}

function disableGoogleAnalytics() {
  // Interrompe l'invio di dati anche se lo script fosse già stato caricato in questa pagina.
  window[`ga-disable-${GA_ID}`] = true;
  clearGoogleAnalyticsCookies();
}

/**
 * Carica Google Analytics soltanto dopo un consenso esplicito.
 * Prima del consenso (o dopo un rifiuto / una revoca) non viene caricato alcuno script
 * di tracciamento e i cookie analitici eventualmente presenti vengono rimossi.
 */
export default function Analytics() {
  const consent = useConsentState();

  useEffect(() => {
    if (consent === "granted") {
      enableGoogleAnalytics();
    } else if (consent === "denied" || consent === "unset") {
      disableGoogleAnalytics();
    }
  }, [consent]);

  return null;
}
