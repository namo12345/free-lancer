import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireSense - India's AI-Powered Freelancing Platform",
  description:
    "Find the perfect freelancer or gig with AI-powered matchmaking. HireSense connects India's top talent with employers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Translate – hides the toolbar, exposes the JS API for auto-translate */}
        <style dangerouslySetInnerHTML={{ __html: `
          .goog-te-banner-frame, .goog-te-balloon-frame { display: none !important; }
          .skiptranslate { display: none !important; }
          #google_translate_element { display: none !important; }
          body { top: 0 !important; }
          .goog-te-gadget { display: none !important; }
        `}} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>

        {/* Google Translate init */}
        <div id="google_translate_element" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'hi,ta,te,bn',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" />
      </body>
    </html>
  );
}
