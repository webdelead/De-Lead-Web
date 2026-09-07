import type { Metadata } from "next";
import Script from "next/script";
import { instrumentSans } from "@delead/fonts/instrument-sans";
import { inter } from "@delead/fonts/inter";
import "./globals.css";
import { SiteScripts } from "@/components/SiteScripts";

const TITLE = "Corporate Training: De' Lead International";
const DESC =
  "Leadership development, team building and outbound training for organisations across India and the UAE. Delivered for DP World, Kayzan Group, RAG Business Hub and Al Ahalia Group.";
const SITE = process.env.SITE_URL_CORPORATE || "https://corporate.deleadint.com";
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
    siteName: "Corporate Training — De' Lead International",
    title: TITLE,
    description: DESC,
    url: SITE + "/",
    images: [{ url: "/assets/logo/logo-delead-dark.png" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESC,
    images: ["/assets/logo/logo-delead-dark.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-vertical="corporate"
      className={`${instrumentSans.variable} ${inter.variable}`}
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
