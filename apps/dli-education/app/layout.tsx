import type { Metadata } from "next";
import Script from "next/script";

const SITE = process.env.SITE_URL_DLI_EDUCATION || "https://edu.deleadint.com";
const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "https://admin.deleadint.com/api/lead";

const DESC =
  "DLI Education is the technology and future-skills learning arm of De' Lead International. Hands-on, mentor-led programmes for students and working professionals across India and the UAE.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "DLI Education: De' Lead International",
  description: DESC,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg?v=2" },
  openGraph: {
    type: "website",
    siteName: "DLI Education",
    title: "DLI Education: De' Lead International",
    description: DESC,
    url: SITE + "/",
    images: [{ url: "/assets/logo/logo-delead-dark.png" }],
  },
  twitter: {
    card: "summary",
    title: "DLI Education: De' Lead International",
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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
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
