import "./globals.css";
import React from "react";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://coastinfrastructure.co.ke"),
  title: {
    default: "Coast Infrastructure | Civil Engineering & Construction Kenya",
    template: "%s | Coast Infrastructure"
  },
  description: "Professional civil engineering and construction services across Kenya. Based in Mombasa, delivering resilient infrastructure with technical excellence, transparent processes, and proven nationwide delivery.",
  keywords: [
    "civil engineering Kenya",
    "construction contractor Kenya",
    "infrastructure delivery",
    "coastal engineering Mombasa",
    "road construction Kenya",
    "drainage systems",
    "bridge construction",
    "water infrastructure",
    "site supervision",
    "engineering services nationwide",
    "structural works Kenya"
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
    url: "https://coastinfrastructure.co.ke",
    siteName: "Coast Infrastructure",
    title: "Coast Infrastructure | Civil Engineering & Construction Kenya",
    description: "Professional civil engineering and construction services across Kenya. Technical excellence, transparent processes, nationwide delivery.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Coast Infrastructure - Civil Engineering & Construction"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Coast Infrastructure | Civil Engineering & Construction Kenya",
    description: "Professional civil engineering and construction services across Kenya.",
    creator: "@coastinfra"
  },
  alternates: {
    canonical: "https://coastinfrastructure.co.ke"
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  authors: [{ name: "Coast Infrastructure Ltd" }],
  creator: "Coast Infrastructure Ltd",
  publisher: "Coast Infrastructure Ltd"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Coast Infrastructure Ltd",
              url: "https://coastinfrastructure.co.ke",
              logo: "https://coastinfrastructure.co.ke/logo.png",
              description: "Professional civil engineering and construction services across Kenya",
              sameAs: [
                "https://www.linkedin.com/company/coast-infrastructure",
                "https://twitter.com/coastinfra"
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Mombasa",
                addressLocality: "Mombasa",
                addressRegion: "Coastal",
                postalCode: "80100",
                addressCountry: "KE"
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254731300089",
                contactType: "Customer Service",
                email: "info@coastinfrastructure.com"
              }
            })
          }}
        />
      </head>
      <body>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
