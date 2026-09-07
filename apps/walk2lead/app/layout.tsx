import type { Metadata } from "next";
import { inter } from "@delead/fonts/inter";
import { lora } from "@delead/fonts/lora";
import "./globals.css";
import { SiteScripts } from "@/components/SiteScripts";
import { LeadCapture } from "@/components/LeadCapture";

const DESC =
  "44 government schools. 1,300+ children. Walk2Lead is funded by Walkaroo Foundation and implemented end-to-end by De' Lead International, a prominent CSR implementation team. See the numbers, the setbacks, and how we solved them.";
const SITE = process.env.SITE_URL_WALK2LEAD || "https://w2l.deleadint.com";
const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "https://admin.deleadint.com/api/lead";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Walk2Lead Robotics Tech Quest | Implemented by De' Lead International",
  description: DESC,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg?v=3" },
  openGraph: {
    type: "website",
    siteName: "Walk2Lead",
    title: "Walk2Lead Robotics Tech Quest | Implemented by De' Lead International",
    description: DESC,
    url: SITE + "/",
    images: [{ url: "/assets/walk2lead-logo.svg" }],
  },
  twitter: {
    card: "summary",
    title: "Walk2Lead Robotics Tech Quest | Implemented by De' Lead International",
    description: DESC,
    images: ["/assets/walk2lead-logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-vertical="walk2lead" className={`${inter.variable} ${lora.variable}`}>
      {/* browser extensions (ColorZilla, Grammarly, etc.) add attributes to
          <body> before React hydrates — ignore that specific mismatch */}
      <body suppressHydrationWarning>
        {children}
        <SiteScripts />
        <LeadCapture endpoint={LEAD_ENDPOINT} />
      </body>
    </html>
  );
}
