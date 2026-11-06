import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { services } from "../../../src/data/content";
import ServiceImage from "../../../src/components/ServiceImage";
import { serviceImages } from "../../../src/data/service-images";
import { getRelatedServices } from "../../../src/data/service-taxonomy";

type ServiceParams = {
  slug: string;
};

const legacyServiceSlugs = new Set([
  "civil-engineering",
  "road-construction",
  "bridge-and-structural-works",
  "coastal-and-marine-works",
  "drainage-and-flood-management",
  "earthworks-and-site-preparation",
  "utilities-water-and-sewer",
  "geotechnical-and-foundations",
  "environmental-and-social-management",
  "survey-and-design-services",
  "contract-management-and-ppc",
  "asphalt-and-paving",
  "maintenance-and-asset-management",
]);

export async function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: ServiceParams | Promise<ServiceParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (legacyServiceSlugs.has(slug)) {
    return { title: "Services" };
  }

  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return { title: "Service not found" };
  }

  const url = `https://civil-constco.vercel.app/services/${service.slug}`;

  return {
    title: service.title,
    description: service.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title: `${service.title} | Finecon Builders Limited`,
      description: service.excerpt,
    },
  };
}

export const dynamic = "force-static";

export default async function ServicePage({
  params,
}: {
  params: ServiceParams | Promise<ServiceParams>;
}) {
  const { slug } = await params;
  if (legacyServiceSlugs.has(slug)) {
    permanentRedirect("/services");
  }

  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(service.slug);
  const serviceImage = serviceImages[service.slug];

  return (
    <>
      <header className="bg-brand-paper py-10 md:py-14">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-muted">
              <li>
                <Link
                  href="/"
                  className="underline-offset-4 hover:text-brand-navy hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/services"
                  className="underline-offset-4 hover:text-brand-navy hover:underline"
                >
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-brand-navy">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid items-center gap-8 md:mt-14 md:grid-cols-2 md:gap-10 lg:gap-14">
            <div className="min-w-0">
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-brand-navy sm:text-5xl md:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-muted md:text-xl">
                {service.excerpt}
              </p>
            </div>
            <ServiceImage
              src={serviceImage.src}
              alt={serviceImage.alt}
              priority
              fit={serviceImage.fit}
            />
          </div>
        </div>
      </header>

      <section
        aria-labelledby="service-overview-heading"
        className="container py-10 md:py-14"
      >
        <div className="max-w-3xl">
          <h2
            id="service-overview-heading"
            className="text-xl font-semibold md:text-2xl"
          >
            About this service
          </h2>
          <p className="mt-4 leading-relaxed text-slate-700">
            {service.content}
          </p>
        </div>
      </section>

      {service.benefits?.length ? (
        <section
          aria-labelledby="service-activities-heading"
          className="container pb-10 md:pb-14"
        >
          <div className="max-w-3xl border-t border-brand-line pt-5">
            <h2
              id="service-activities-heading"
              className="text-xl font-semibold md:text-2xl"
            >
              What the work may include
            </h2>
            <ul className="mt-4 divide-y divide-brand-line">
              {service.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="py-3 leading-relaxed text-slate-700"
                >
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {relatedServices.length ? (
        <section
          aria-labelledby="related-services-heading"
          className="bg-white py-12 md:py-16"
        >
          <div className="container">
            <h2
              id="related-services-heading"
              className="mt-3 text-2xl font-semibold md:text-3xl"
            >
              Related services
            </h2>
            <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
              {relatedServices.map((relatedService) => (
                <li
                  key={relatedService.slug}
                  className="border-t border-brand-line py-4"
                >
                  <Link
                    href={`/services/${relatedService.slug}`}
                    className="font-semibold text-brand-navy underline-offset-4 hover:text-steel hover:underline"
                  >
                    {relatedService.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="bg-brand-navy py-12 text-white md:py-16">
        <div className="container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Enquire about this service
            </h2>
            <p className="mt-2 text-slate-200">
              Contact Finecon Builders Limited.
            </p>
          </div>
          <Link href="/contact" className="button-secondary w-fit border-white text-white hover:bg-white/10">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
