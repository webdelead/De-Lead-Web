import type { Metadata } from "next";
import Script from "next/script";

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
  icons: { icon: "/favicon.png" },
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        {children}
        <Script src="/js/main.js" strategy="afterInteractive" />
        <Script
          src="/js/lead-capture.js"
          strategy="afterInteractive"
          data-endpoint={LEAD_ENDPOINT}
        />
      </body>
    </html>
  );
}
