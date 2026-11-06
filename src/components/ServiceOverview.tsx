import Link from "next/link";
import { serviceCatalog } from "../data/service-taxonomy";

export default function ServiceOverview() {
  return (
    <section className="bg-brand-paper py-20 md:py-28">
      <div className="container">
        <div className="mb-12 grid gap-5 md:mb-16 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-steel">
              Services
            </p>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight md:text-5xl">
              Building design and construction services
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-slate-700">
              Explore building design, construction, renovation, interior
              planning, site supervision and structural design services.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex font-semibold text-steel underline underline-offset-4"
            >
              View all services
            </Link>
          </div>
        </div>

        <ul className="grid gap-x-10 gap-y-12 lg:grid-cols-3">
          {serviceCatalog.map((service) => (
            <li
              key={service.slug}
              className="border-t border-slate-300 pt-5"
            >
              <h3>
                <Link
                  href={`/services/${service.slug}`}
                  className="group font-semibold text-brand-navy underline-offset-4 hover:text-steel hover:underline"
                >
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {service.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
