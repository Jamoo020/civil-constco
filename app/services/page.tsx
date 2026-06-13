import React from "react";
import Link from "next/link";
import { services } from "../../src/data/content";
import ServiceIcon from "../../src/components/ServiceIcon";

export const metadata = {
  title: "Services | Coast Infrastructure",
  description: "Explore our civil engineering and road construction services, delivered with coastal resilience and national capacity.",
};

export const dynamic = "force-static";

export default function ServicesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <article key={s.slug} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg flex gap-4 items-start">
            <div className="flex-shrink-0 rounded-3xl bg-slate-100 p-4 text-steel">
              <ServiceIcon slug={s.slug} className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">{s.excerpt}</p>

              {s.benefits?.length ? (
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {s.benefits.slice(0, 3).map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-steel" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              <Link href={`/services/${s.slug}`} className="mt-6 inline-flex items-center text-steel font-semibold hover:underline">
                Read service details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
