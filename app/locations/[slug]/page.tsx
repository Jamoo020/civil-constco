import React from "react";
import { notFound } from "next/navigation";
import { locations } from "../../../src/data/content";

export async function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const location = locations.find((item) => item.slug === resolved.slug);
  if (!location) {
    return { title: "Location not found" };
  }
  return {
    title: `${location.title} | Locations | Coast Infrastructure`,
    description: location.description,
  };
}

export const dynamic = "force-static";

export default async function LocationPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const location = locations.find((item) => item.slug === resolved.slug);
  if (!location) return notFound();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">{location.title}</h1>
      <p className="mt-4 text-gray-700">{location.content}</p>

      <div className="mt-8 rounded-3xl border border-gray-200 bg-slate-50 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Local delivery focus</h2>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700">
          {location.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
