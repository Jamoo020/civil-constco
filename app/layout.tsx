import "./globals.css";
import React from "react";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://civil-constco.vercel.app"),
  title: {
    default: "Finecon Builders Limited | Building Design & Construction",
    template: "%s | Finecon Builders Limited"
  },
  description: "Explore Finecon Builders Limited's building design, construction, renovation, interior design, site supervision and structural design services.",
  keywords: [
    "architectural design",
    "building construction",
    "general construction",
    "interior design",
    "site supervision",
    "structural design"
  ],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://civil-constco.vercel.app",
    siteName: "Finecon Builders Limited",
    title: "Finecon Builders Limited | Building Design & Construction",
    description: "Explore Finecon Builders Limited's building design, construction, renovation, interior design, site supervision and structural design services."
  },
  twitter: {
    card: "summary",
    title: "Finecon Builders Limited | Building Design & Construction",
    description: "Building design, construction, renovation, interior design, site supervision and structural design services."
  },
  alternates: {
    canonical: "https://civil-constco.vercel.app"
  },
  
  authors: [{ name: "Finecon Builders Limited" }],
  creator: "Finecon Builders Limited",
  publisher: "Finecon Builders Limited"
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
