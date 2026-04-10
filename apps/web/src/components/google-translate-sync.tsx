"use client";

import { useEffect, useRef } from "react";
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
  const prevLocaleRef = useRef<string>(locale);

  useEffect(() => {
    const targetLang = LOCALE_TO_LANG[locale];
    const prevLang = LOCALE_TO_LANG[prevLocaleRef.current];
    const domain = window.location.hostname;

    // Update ref before any early returns
    prevLocaleRef.current = locale;

    if (targetLang) {
      // Non-English: set cookie and apply translation
      const val = `/en/${targetLang}`;
      document.cookie = `googtrans=${val};path=/;domain=${domain}`;
      document.cookie = `googtrans=${val};path=/;domain=.${domain}`;

      const timer = setTimeout(() => {
        // eslint-disable-next-line
        const gtCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (gtCombo) {
          gtCombo.value = targetLang;
          gtCombo.dispatchEvent(new Event("change"));
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // English: clear cookie
      const past = "Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = `googtrans=;path=/;expires=${past};domain=${domain}`;
      document.cookie = `googtrans=;path=/;expires=${past};domain=.${domain}`;

      // If we were on a translated page, reload to restore English content
      if (prevLang) {
        window.location.reload();
        return;
      }

      // Otherwise try to reset the combo box if it exists
      const timer = setTimeout(() => {
        // eslint-disable-next-line
        const gtCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (gtCombo && gtCombo.value !== "" && gtCombo.value !== "en") {
          gtCombo.value = "en";
          gtCombo.dispatchEvent(new Event("change"));
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [locale]);

  return null;
}
