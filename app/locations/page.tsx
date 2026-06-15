import React from "react";
import Link from "next/link";
import { locations } from "../../src/data/content";
import MapInteractive from "../../src/components/MapInteractive";

export const metadata = {
  title: "Locations | Finecone Builders Limited",
  description: "Finecone Builders Limited is a coastal construction company based in Kilifi, serving the Kenyan Coast and all 47 counties with civil engineering, roadworks and coastal infrastructure.",
  keywords: [
    "Kilifi construction company",
    "Mombasa construction contractor",
    "Kenya coastal construction",
    "Kenya infrastructure contractor",
    "civil engineering offices Kenya",
    "regional delivery hubs",
    "coastal infrastructure"
  ],
  openGraph: {
    title: "Locations | Finecone Builders Limited",
    description: "Finecone Builders Limited is a coastal construction company based in Kilifi, delivering civil engineering, roadworks and coastal infrastructure across Mombasa, Kilifi, Malindi, Kwale and all 47 counties.",
    siteName: "Finecone Builders Limited",
    type: "website"
  }
};
export const dynamic = "force-static";

export default function LocationsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Locations</h1>
      <p className="text-gray-600 mb-8">
        Finecone Builders Limited is headquartered in Kilifi and delivers civil engineering and construction across all 47 counties in Kenya.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] mb-10">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Head office and nationwide delivery</h2>
          <p className="text-gray-600 mb-4">
            Our Kilifi headquarters coordinates regional and national infrastructure delivery with local teams across the Coast and inland counties.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Head office: Kilifi County, Kenya</li>
            <li>Regional hubs supporting offices and site teams across the Coast</li>
            <li>Project delivery in all 47 counties of Kenya</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <MapInteractive />
        </div>
      </div>

      <div className="prose text-gray-600">
        <p>
          For region-specific information please visit the individual location pages or contact our head office in Kilifi for enquiries and site coordination.
        </p>
      </div>
    </div>
  );
}
