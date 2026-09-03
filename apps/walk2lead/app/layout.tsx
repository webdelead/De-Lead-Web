import type { Metadata } from "next";
import Script from "next/script";

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
  icons: { icon: "/favicon.svg" },
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/styles.css" />
      </head>
      <body>
        {children}
        <Script src="/assets/js/main.js?v=4" strategy="afterInteractive" />
        <Script src="/js/lead-capture.js" strategy="afterInteractive" data-endpoint={LEAD_ENDPOINT} />
      </body>
    </html>
  );
}
