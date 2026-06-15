import React from "react";
import { trustFactors } from "../data/content";

export default function TrustBar() {
  return (
    <section className="bg-gradient-to-r from-steel to-coast/80 py-12">
      <div className="container space-y-6">
        <h2 className="text-3xl font-bold text-white">Why Engineers & Developers Trust Finecone Builders Limited</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustFactors.map((factor, idx) => (
            <div key={idx} className="flex items-start gap-3 text-white">
              <svg className="h-6 w-6 text-sand flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <p className="leading-relaxed">{factor}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/20">
          <p className="text-white/90 text-sm">
            <span className="font-semibold">Established 2010</span> • <span className="font-semibold">Nationwide Delivery</span> • <span className="font-semibold">Professional Standards</span>
          </p>
        </div>
      </div>
    </section>
  );
}
