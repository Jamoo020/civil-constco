import React from "react";
import { teamPillars } from "../data/content";

export default function TeamExpertise() {
  return (
    <section className="container py-16 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">The Team Behind Your Project</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A multidisciplinary team combining civil engineering expertise, project controls, and deep regional knowledge.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {teamPillars.map((pillar, idx) => (
          <article
            key={idx}
            className="rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="h-14 w-14 rounded-full bg-coast/10 flex items-center justify-center text-coast text-2xl font-bold">
              {String.fromCharCode(65 + idx)}
            </div>
            <h3 className="text-2xl font-semibold">{pillar.title}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
