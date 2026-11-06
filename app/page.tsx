import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../src/components/Hero";
import ProcessJourney from "../src/components/ProcessJourney";
import ServiceOverview from "../src/components/ServiceOverview";

const primaryUrl = "https://civil-constco.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(primaryUrl),
  title: "Finecon Builders Limited | Building Design & Construction",
  description:
    "Explore Finecon Builders Limited's building design, construction, renovation, interior design, site supervision and structural design services.",
  keywords: [
    "architectural design",
    "building construction",
    "general construction",
    "interior design",
    "site supervision",
    "structural design",
  ],
  alternates: {
    canonical: primaryUrl,
  },
  openGraph: {
    title: "Finecon Builders Limited | Building Design & Construction",
    description:
      "Explore Finecon Builders Limited's building design, construction, renovation, interior design, site supervision and structural design services.",
    type: "website",
    url: primaryUrl,
    siteName: "Finecon Builders Limited",
    locale: "en_KE",
  },
  twitter: {
    card: "summary",
    title: "Finecon Builders Limited | Building Design & Construction",
    description:
      "Building design, construction, renovation, interior design, site supervision and structural design services.",
  },
};

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="bg-white py-20 md:py-28">
        <div className="container grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-steel">
              Company
            </p>
            <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight md:text-4xl">
              Finecon Builders Limited
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-slate-700">
              Explore building design and construction services, learn more
              about Finecon, or view the locations
              information available on this site.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-steel">
              <Link className="underline underline-offset-4" href="/company">
                About the company
              </Link>
              <Link className="underline underline-offset-4" href="/locations">
                Locations information
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ServiceOverview />

      <ProcessJourney />

      <section className="bg-brand-navy py-20 text-white md:py-24">
        <div className="container flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Enquiries
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
              Discuss your next project with Finecon.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
              Contact the team to discuss a building design, construction or
              renovation enquiry.
            </p>
          </div>
          <Link
            href="/contact"
            className="button-primary w-fit border-white bg-white text-brand-navy hover:border-slate-200 hover:bg-slate-200"
          >
            Contact Finecon
          </Link>
        </div>
      </section>
    </>
  );
}
