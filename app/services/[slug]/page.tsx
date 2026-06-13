import React from "react";
import { notFound } from "next/navigation";
import { services } from "../../../src/data/content";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const service = services.find((s) => s.slug === resolved.slug);
  if (!service) {
    return { title: "Service not found" };
  }
  return {
    title: `${service.title} | Services | Coast Infrastructure`,
    description: service.excerpt,
  };
}

export const dynamic = "force-static";

export default async function ServicePage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const service = services.find((s) => s.slug === resolved.slug);
  if (!service) return notFound();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">{service.title}</h1>
      <div className="mt-6 space-y-10 text-gray-800">
        <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8">
          <p className="text-lg leading-relaxed">{service.content}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">How we deliver this service</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Our delivery process combines local construction expertise with disciplined project controls, technical design review and environmental safeguards.
                Every assignment is anchored by site-specific planning, quality inspections, and lifecycle resilience driven by our coastal and inland experience.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">What clients gain</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                We help clients reduce risk, improve durability and meet compliance requirements while maintaining clear communication during construction and handover. Our service approach is designed to improve operational readiness and asset longevity.
              </p>
            </div>
          </div>

          <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">What this service includes</h3>
            {service.benefits?.length ? (
              <ul className="mt-4 list-disc list-inside space-y-3 text-gray-700">
                {service.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-700">This service is designed to meet broad civil infrastructure needs with flexible delivery options.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
