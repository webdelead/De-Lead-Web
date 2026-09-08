import type { Metadata } from "next";
import Script from "next/script";
import { bricolageGrotesque } from "@delead/fonts/bricolage-grotesque";
import { anton } from "@delead/fonts/anton";
import { inter } from "@delead/fonts/inter";
import "./globals.css";
import { SiteScripts } from "@/components/SiteScripts";

const TITLE =
  "MakerChamps — Residential Innovation Bootcamp at NIT Calicut | De' Lead International";
const DESC =
  "A 2-day residential innovation bootcamp on the NIT Calicut campus for class 8–12 students. Only 60 seats per season. By De' Lead International × Nlightened ZenSolutions.";
const SITE = process.env.SITE_URL_MAKERCHAMPS || "https://mc.deleadint.com";
const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "https://admin.deleadint.com/api/lead";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg?v=2" },
  openGraph: {
    type: "website",
    siteName: "MakerChamps",
    title: TITLE,
    description: DESC,
    url: SITE + "/",
    images: [{ url: "/assets/brand/makerchamps-logo.png" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESC,
    images: ["/assets/brand/makerchamps-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-vertical="makerchamps"
      className={`${bricolageGrotesque.variable} ${anton.variable} ${inter.variable}`}
    >
      {/* browser extensions (ColorZilla, Grammarly, etc.) add attributes to
          <body> before React hydrates — ignore that specific mismatch */}
      <body suppressHydrationWarning>
        {children}
        <SiteScripts />
        <Script
          src="/js/lead-capture.js"
          strategy="afterInteractive"
          data-endpoint={LEAD_ENDPOINT}
        />
      </body>
    </html>
  );
}
