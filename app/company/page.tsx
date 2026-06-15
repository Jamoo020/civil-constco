import React from "react";
import { company } from "../../src/data/content";

export const metadata = {
  title: "Company | Finecone Builders Limited",
  description: "Learn about Finecone Builders Limited's vision, mission and milestones as a Kilifi-headquartered coastal construction and civil engineering company serving coastal Kenya and nationwide clients.",
};

export const dynamic = "force-static";

export default function CompanyPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-5xl font-bold">{company.name}</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Established in {company.founded}, we deliver civil engineering excellence from the Kenyan Coast to nationwide clients.
        </p>
      </section>

      {/* Vision & Mission Cards */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-coast/20 flex items-center justify-center text-coast font-bold text-lg">
              ◆
            </div>
            <h2 className="text-2xl font-semibold">Vision</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">{company.vision}</p>
        </div>

        {/* Mission Card */}
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-sand/10 to-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-sand/30 flex items-center justify-center text-steel font-bold text-lg">
              ★
            </div>
            <h2 className="text-2xl font-semibold">Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">{company.mission}</p>
        </div>
      </div>

      {/* Milestones Timeline */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Our Journey</h2>
        <div className="relative space-y-6">
          {company.milestones.map((milestone, index) => (
            <div key={milestone.year} className="flex gap-8 items-start">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center flex-shrink-0 pt-2">
                <div className="h-4 w-4 rounded-full bg-steel border-4 border-white shadow-md" />
                {index < company.milestones.length - 1 && (
                  <div className="w-1 h-16 bg-gradient-to-b from-steel/40 to-transparent mt-2" />
                )}
              </div>

              {/* Milestone content */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex-1 hover:shadow-md transition">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-steel">{milestone.year}</span>
                  <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-3xl font-bold text-steel">{new Date().getFullYear() - company.founded}+</p>
          <p className="text-gray-600">Years of experience</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-coast">47</p>
          <p className="text-gray-600">Counties served</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-sand">100%</p>
          <p className="text-gray-600">Locally rooted</p>
        </div>
      </div>
    </div>
  );
}
