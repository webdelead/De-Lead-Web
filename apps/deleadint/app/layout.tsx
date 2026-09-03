import type { Metadata } from "next";
import Script from "next/script";

const DESC =
  "De' Lead International is an education innovation ecosystem running Corporate Training, TinkerChamps, MakerChamps, DLI Education, Goal Finder and DLI Foundation (Walk2Lead CSR) across India and the UAE.";
const SITE = process.env.SITE_URL_DELEADINT || "https://deleadint.com";
const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "https://admin.deleadint.com/api/lead";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "De' Lead International | Learn, Develop & Lead",
  description: DESC,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.png" },
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@400;500;600;700;800&family=Host+Grotesk:wght@500;700;800&family=Lora:ital,wght@0,600;0,700;1,600&family=Baloo+2:wght@600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@600;700;800&family=Caveat:wght@400;600;700&family=Covered+By+Your+Grace&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        {children}
        <Script src="/js/main.js" strategy="afterInteractive" />
        <Script src="/js/lead-capture.js" strategy="afterInteractive" data-endpoint={LEAD_ENDPOINT} />
      </body>
    </html>
  );
}
