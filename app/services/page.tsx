import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { serviceCatalog } from "../../src/data/service-taxonomy";

const description =
  "Explore Finecon Builders Limited's six building services, from architectural and structural design to construction, interior design and site supervision.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: {
    canonical: "https://civil-constco.vercel.app/services",
  },
  openGraph: {
    type: "website",
    url: "https://civil-constco.vercel.app/services",
    title: "Services | Finecon Builders Limited",
    description,
  },
};

export const dynamic = "force-static";

export default function ServicesPage() {
  return (
    <>
      <header className="bg-brand-navy py-16 text-white md:py-24">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Building services
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            Building design and construction
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            Explore six building-focused services, from planning and design
            through construction, renovation and site supervision.
          </p>
        </div>
      </header>

      <div className="container py-16 md:py-24">
        <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {serviceCatalog.map((service) => (
            <li key={service.slug} className="border-t border-brand-line pt-5">
              <h2 className="text-2xl font-semibold md:text-3xl">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-brand-navy underline-offset-4 hover:text-steel hover:underline"
                >
                  {service.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-prose leading-relaxed text-brand-muted">
                {service.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <section className="bg-white py-12 md:py-16">
        <div className="container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Have an enquiry?</h2>
            <p className="mt-2 text-brand-muted">
              Contact Finecon Builders Limited.
            </p>
          </div>
          <Link href="/contact" className="button-primary w-fit">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
