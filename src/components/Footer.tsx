import React from "react";
import { company } from "../data/content";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="border-b border-white/15">
        <div className="container flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">
              Finecon Builders Limited
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Discuss your next project with our team.
            </h2>
          </div>
          <Link href="/contact" className="button-secondary border-white/50 text-white hover:bg-white/10">
            Make an enquiry
          </Link>
        </div>
      </div>

      <div className="container py-10 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex flex-col leading-tight text-white no-underline">
              <span className="text-lg font-bold tracking-[0.04em]">FINECON</span>
              <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
                Builders Limited
              </span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Civil engineering and construction. Explore our projects, services, and company information.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>
                <a href={`tel:${company.phone}`} className="underline underline-offset-4">
                  {company.phone}
                </a>
              </p>
              <p>{company.postalAddress}</p>
            </div>
          </div>

          <nav aria-label="Footer company navigation">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Company
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li><Link href="/company" className="hover:text-white">About Finecon</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
              <li><Link href="/locations" className="hover:text-white">Locations</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer resources navigation">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Resources
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li><Link href="/blog" className="hover:text-white">Insights</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-slate-300">
          <p>© {currentYear} {company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
