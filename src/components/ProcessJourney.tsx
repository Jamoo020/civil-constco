import React from "react";
import { processSteps } from "../data/content";

export default function ProcessJourney() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        <div className="mb-12 grid gap-5 md:mb-16 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-steel">
              Project delivery
            </p>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight md:text-5xl">
              A clear sequence from planning to handover
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-700">
            The stages below are drawn from the delivery approach currently
            described by Finecon.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step) => (
            <li
              key={step.step}
              className="border-t border-slate-300 pt-5"
            >
              <p className="text-sm font-semibold tracking-[0.15em] text-steel">
                0{step.step}
              </p>
              <h3 className="mt-5 text-xl font-semibold text-brand-navy">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {step.description.split(".")[0]}.
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
