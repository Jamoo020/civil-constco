import "./globals.css";
import React from "react";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://fineconebuilders.co.ke"),
  title: {
    default: "Finecone Builders Limited | Civil Engineering & Construction Kenya",
    template: "%s | Finecone Builders Limited"
  },
  description: "Professional civil engineering and construction services across Kenya. Headquartered in Kilifi, delivering resilient coastal infrastructure with technical excellence, transparent processes, and proven nationwide delivery.",
  keywords: [
    "civil engineering Kenya",
    "Kilifi construction company",
    "construction contractor Kenya",
    "infrastructure delivery",
    "coastal engineering Kenya",
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
    url: "https://fineconebuilders.co.ke",
    siteName: "Finecone Builders Limited",
    title: "Finecone Builders Limited | Civil Engineering & Construction Kenya",
    description: "Finecone Builders Limited is a Kilifi-headquartered coastal construction company delivering civil engineering and infrastructure across the Kenyan Coast and all 47 counties.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Finecone Builders Limited - Civil Engineering & Construction"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Finecone Builders Limited | Civil Engineering & Construction Kenya",
    description: "Professional civil engineering and construction services across Kenya.",
    creator: "@fineconebuilders"
  },
  alternates: {
    canonical: "https://fineconebuilders.co.ke"
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  authors: [{ name: "Finecone Builders Limited" }],
  creator: "Finecone Builders Limited",
  publisher: "Finecone Builders Limited"
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
              name: "Finecone Builders Limited",
              url: "https://fineconebuilders.co.ke",
              logo: "https://fineconebuilders.co.ke/logo.png",
              description: "Professional civil engineering and construction services across Kenya",
              sameAs: [
                "https://www.linkedin.com/company/finecone-builders-limited",
                "https://twitter.com/fineconebuilders"
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kilifi",
                addressLocality: "Kilifi",
                addressRegion: "Coastal",
                postalCode: "80100",
                addressCountry: "KE"
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254731300089",
                contactType: "Customer Service",
                email: "info@fineconebuilders.co.ke"
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
