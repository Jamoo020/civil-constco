import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-brand-paper">
      <div className="container grid gap-10 py-12 md:py-16 lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:py-20">
        <div className="relative z-10 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-steel">
            Finecon Builders Limited
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
            Building design &amp; construction
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-700 sm:text-xl">
            Explore Finecon&apos;s building design, construction, renovation,
            interior design, site supervision and structural design services.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="button-primary">
              Request a proposal
            </Link>
            <Link href="/projects" className="button-secondary">
              Explore projects
            </Link>
          </div>
        </div>

        <figure className="relative min-h-[320px] overflow-hidden bg-brand-navy sm:min-h-[440px] lg:min-h-[540px]">
          <div
            role="img"
            aria-label="Illustrative engineering drawing; not a Finecon project photograph"
            className="absolute inset-0 overflow-hidden bg-[linear-gradient(145deg,#203f52,#142b3a_65%)]"
          >
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:48px_48px]" />
            <svg
              viewBox="0 0 900 640"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full text-sand/70"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <path d="M75 492H820M95 520H790M138 549H746" stroke="currentColor" strokeWidth="2" />
              <path d="M176 490V283L252 226L330 283V490M206 490V310H300V490M376 490V192L460 121L546 192V490M410 490V222H512V490M596 490V303L667 244L738 303V490M624 490V326H710V490" stroke="currentColor" strokeWidth="3" />
              <path d="M135 275L252 190L369 275M337 185L460 82L583 185M564 294L667 207L769 294" stroke="currentColor" strokeWidth="2" />
              <path d="M74 470C250 438 362 450 472 469C590 490 698 488 824 456" stroke="currentColor" strokeWidth="4" />
              <path d="M105 580L260 520L415 580L570 520L725 580L845 536" stroke="currentColor" strokeWidth="2" strokeDasharray="8 12" />
            </svg>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />
          <figcaption className="absolute bottom-0 left-0 p-4 text-xs font-medium uppercase tracking-[0.14em] text-white sm:p-6">
            Illustrative infrastructure — not a Finecon project
          </figcaption>
        </figure>
        </div>
    </section>
  );
}
