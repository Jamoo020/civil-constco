import React from "react";
import { processSteps } from "../data/content";

export default function ProcessJourney() {
  return (
    <section className="container py-16 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">How We Work With You</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our proven process ensures clarity, accountability, and measurable results at every phase of your project.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {processSteps.map((step, idx) => (
          <article
            key={step.step}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold text-steel/20">{step.step}</span>
              <div className="h-10 w-10 rounded-full bg-coast/10 flex items-center justify-center text-coast font-bold">
                {step.step}
              </div>
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>

            {idx < processSteps.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-gray-300 text-2xl">
                →
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
