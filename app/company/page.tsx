import Link from "next/link";

export const metadata = {
  title: "Company",
  description:
    "Company profile for Finecon Builders Limited, a civil engineering and construction company.",
};

export const dynamic = "force-static";

export default function CompanyPage() {
  return (
    <>
      <section className="bg-brand-paper">
        <div className="container grid min-h-[440px] gap-10 py-16 md:min-h-[520px] md:grid-cols-[1fr_0.8fr] md:items-end md:gap-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-steel">
              Company
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl md:text-6xl">
              Finecon Builders Limited
            </h1>
          </div>
          <div className="max-w-lg pb-1 md:pb-2">
            <p className="text-xl leading-relaxed text-slate-700">
              Civil engineering and construction.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Explore the services currently listed or contact the team with
              an enquiry.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="company-next-steps"
        className="bg-white py-16 md:py-20"
      >
        <div className="container grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-steel">
              Explore
            </p>
            <h2
              id="company-next-steps"
              className="mt-4 text-2xl font-semibold leading-tight md:text-3xl"
            >
              Find out more
            </h2>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            <Link
              href="/services"
              className="group flex min-h-20 items-center justify-between gap-6 py-5 text-lg font-semibold text-brand-navy hover:text-steel"
            >
              <span>Explore services</span>
              <span aria-hidden="true" className="text-2xl font-normal">
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="group flex min-h-20 items-center justify-between gap-6 py-5 text-lg font-semibold text-brand-navy hover:text-steel"
            >
              <span>Contact Finecon</span>
              <span aria-hidden="true" className="text-2xl font-normal">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
