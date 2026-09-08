import type { Metadata } from "next";
import Script from "next/script";
import { instrumentSans } from "@delead/fonts/instrument-sans";
import { inter } from "@delead/fonts/inter";
import { lora } from "@delead/fonts/lora";
import { bricolageGrotesque } from "@delead/fonts/bricolage-grotesque";
import { spaceGrotesk } from "@delead/fonts/space-grotesk";
import { manrope } from "@delead/fonts/manrope";
import { caveat } from "@delead/fonts/caveat";
import { coveredByYourGrace } from "@delead/fonts/covered-by-your-grace";
import "./globals.css";
import { SiteScripts } from "@/components/SiteScripts";

const DESC =
  "De' Lead International is an education innovation ecosystem running Corporate Training, TinkerChamps, MakerChamps, DLI Education, Goal Finder and DLI Foundation (Walk2Lead CSR) across India and the UAE.";
const SITE = process.env.SITE_URL_DELEADINT || "https://deleadint.com";
const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "https://admin.deleadint.com/api/lead";

const fontVars = [
  instrumentSans.variable,
  inter.variable,
  lora.variable,
  bricolageGrotesque.variable,
  spaceGrotesk.variable,
  manrope.variable,
  caveat.variable,
  coveredByYourGrace.variable,
].join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "De' Lead International | Learn, Develop & Lead",
  description: DESC,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg?v=2" },
  openGraph: {
    type: "website",
    siteName: "De' Lead International",
    title: "De' Lead International | Learn, Develop & Lead",
    description: DESC,
    url: SITE + "/",
    images: [{ url: "/assets/logo/logo-delead-dark.png" }],
  },
  twitter: {
    card: "summary",
    title: "De' Lead International | Learn, Develop & Lead",
    description: DESC,
    images: ["/assets/logo/logo-delead-dark.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-vertical="deleadint" className={fontVars}>
      {/* browser extensions (ColorZilla, Grammarly, etc.) add attributes to
          <body> before React hydrates — ignore that specific mismatch */}
      <body suppressHydrationWarning>
        {children}
        <SiteScripts />
        <Script src="/js/lead-capture.js" strategy="afterInteractive" data-endpoint={LEAD_ENDPOINT} />
      </body>
    </html>
  );
}
