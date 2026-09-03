import type { Metadata } from "next";
import { Covered_By_Your_Grace, Host_Grotesk } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import SmoothScroll from "../components/SmoothScroll";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Analytics } from "@vercel/analytics/next";

const coveredByYourGrace = Covered_By_Your_Grace({
  weight: "400",
  variable: "--font-covered",
  subsets: ["latin"],
});

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tc.deleadint.com"),
  title: {
    default: "Tinkerchamps | Rewiring Young Minds for a Limitless Future",
    template: "%s | Tinkerchamps",
  },
  description:
    "Tinkerchamps is a premium 3-day experiential learning camp for students (6th–12th grade). Boost critical thinking, leadership, and design your future through hands-on innovation.",
  keywords: [
    "Tinkerchamps",
    "Experiential Learning",
    "Student Leadership",
    "Critical Thinking",
    "Innovation Camp",
    "India Education",
    "Skill Development",
    "Young Minds",
    "Future Design",
  ],
  authors: [{ name: "Tinkerchamps Team" }],
  creator: "Tinkerchamps",
  publisher: "Tinkerchamps",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tinkerchamps | Rewiring Young Minds for a Limitless Future",
    description:
      "A premium 3-day experiential learning camp helping 6th–12th graders think sharper and lead better.",
    url: "https://tc.deleadint.com",
    siteName: "Tinkerchamps",
    images: [
      {
        url: "/assets/images/herobanner.webp",
        width: 1200,
        height: 630,
        alt: "Tinkerchamps Learning Camp",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tinkerchamps | Rewiring Young Minds for a Limitless Future",
    description:
      "Empowering students through premium experiential learning. Join the future of education.",
    images: ["/assets/images/herobanner.webp"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/assets/TCLogo.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "avqVDuL-OB82RcY4lAmXI2cnYh-zfFeq76IntVaNFEM",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://tc.deleadint.com/",
      "name": "Tinkerchamps",
      "url": "https://tc.deleadint.com",
      "logo": "https://tc.deleadint.com/assets/TCLogo.webp",
      "description":
        "A 3-day premium experiential learning camp that helps students from 6th–12th grade think sharper, lead better, and design their own future.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
      },
      "sameAs": [
        "https://www.instagram.com/tinker_champs",
        "https://www.linkedin.com/company/deleadint/",
        "https://youtube.com/@deleadinternational"
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://tc.deleadint.com/",
      "url": "https://tc.deleadint.com",
      "name": "Tinkerchamps",
      "publisher": { "@id": "https://tc.deleadint.com/" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who can participate in TinkerChamps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Students who are curious about technology, creativity, and innovation can participate in TinkerChamps. Typically students from 6th–12th grade.",
          },
        },
        {
          "@type": "Question",
          "name": "What will students learn at TinkerChamps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Students develop problem-solving, creativity, teamwork, and hands-on technology skills through experiential learning.",
          },
        },
        {
          "@type": "Question",
          "name": "What makes TinkerChamps different from other camps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Students learn through building, experimenting, and solving real-world challenges using behavioural science and activity-based education.",
          },
        },
      ],
    },
  ],
};

import { ModalProvider } from "../context/ModalContext";
import BookingModalWrapper from "../components/BookingModalWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${coveredByYourGrace.variable} ${hostGrotesk.variable} font-host antialiased bg-primary-purple text-secondary-white`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6GJZLGEXHK"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6GJZLGEXHK');
          `}
        </Script>

        <ModalProvider>
          <SmoothScroll />
          <Navbar />
          {children}
          <Footer />
          <BookingModalWrapper />
          <Analytics />
        </ModalProvider>
      </body>
    </html>
  );
}
