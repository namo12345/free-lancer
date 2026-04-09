"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

const LOCALE_TO_LANG: Record<string, string> = {
  hi: "hi",
  ta: "ta",
  te: "te",
  bn: "bn",
};

/**
 * Reads the current locale from the URL and auto-triggers Google Translate.
 * Drop this into any layout that uses the [locale] segment.
 */
export function GoogleTranslateSync() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    const targetLang = LOCALE_TO_LANG[locale];

    // Set the googtrans cookie that Google Translate reads on load
    const domain = window.location.hostname;
    if (targetLang) {
      const val = `/en/${targetLang}`;
      document.cookie = `googtrans=${val};path=/;domain=${domain}`;
      document.cookie = `googtrans=${val};path=/;domain=.${domain}`;
    } else {
      // English – clear translation
      const past = "Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = `googtrans=;path=/;expires=${past};domain=${domain}`;
      document.cookie = `googtrans=;path=/;expires=${past};domain=.${domain}`;
    }

    // If the widget is already initialised, switch language programmatically
    function applyTranslation() {
      // eslint-disable-next-line
      const gtCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (gtCombo) {
        gtCombo.value = targetLang || "en";
        gtCombo.dispatchEvent(new Event("change"));
      }
    }

    // Widget may take a moment to inject itself into the DOM
    const timer = setTimeout(applyTranslation, 800);
    return () => clearTimeout(timer);
  }, [locale]);

  return null;
}
