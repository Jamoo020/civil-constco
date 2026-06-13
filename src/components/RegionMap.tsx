"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const regions = [
  {
    key: "mombasa",
    label: "Mombasa",
    summary: "Gateway city infrastructure, port access upgrades, seawall protection and coastal road renewal.",
    highlight: "Coastal roads & port zone resilience"
  },
  {
    key: "kilifi",
    label: "Kilifi",
    summary: "Regional civil engineering for residential, drainage and coastal support works along the northern coast.",
    highlight: "Drainage and coastal development"
  },
  {
    key: "malindi",
    label: "Malindi",
    summary: "Focused delivery for tourism infrastructure, public works and shoreline stability projects in Malindi district.",
    highlight: "Tourism corridor and shoreline protection"
  },
  {
    key: "kwale",
    label: "Kwale",
    summary: "Strategic regional projects shaped around community access, rural roads and sustainable coastal engineering.",
    highlight: "Rural access and coastal resilience"
  }
];

export default function RegionMap() {
  const [activeRegion, setActiveRegion] = useState(regions[0]);

  return (
    <section className="bg-white/95 py-12">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.32em] text-steel">Interactive Kenya presence</p>
            <h2 className="text-4xl font-bold">Regional reach from the Coast to national infrastructure corridors.</h2>
            <p className="max-w-xl text-gray-700 leading-relaxed">
              Explore our work across Mombasa, Kilifi, Malindi and Kwale, with delivery expertise that serves coastal conditions and nationwide civil engineering projects.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {regions.map((region) => (
                <button
                  key={region.key}
                  onClick={() => setActiveRegion(region)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                    activeRegion.key === region.key ? "border-coast bg-coast/10 shadow-md" : "border-gray-200 bg-slate-50"
                  }`}
                >
                  <span className="text-lg font-semibold">{region.label}</span>
                  <p className="mt-2 text-sm text-gray-600">{region.highlight}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl bg-steel p-8 text-white shadow-2xl overflow-hidden">
            <div className="absolute -right-16 -top-10 h-40 w-40 rounded-full bg-sand/40 blur-2xl" />
            <div className="absolute -left-14 bottom-10 h-32 w-32 rounded-full bg-coast/20 blur-2xl" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-sm uppercase tracking-[0.24em] text-sand">Kenya Coast hub</div>
              <div className="rounded-3xl bg-gradient-to-br from-[#0F4F61] to-[#163D50] p-6 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-sand/80">Active regions</p>
                    <p className="text-3xl font-semibold">4</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-sand/80">Local projects</p>
                    <p className="text-3xl font-semibold">18+</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold">{activeRegion.label}</h3>
                <p className="mt-3 text-gray-200 leading-relaxed">{activeRegion.summary}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                {regions.map((region) => (
                  <span
                    key={region.key}
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                      activeRegion.key === region.key ? "bg-sand text-steel" : "bg-white/10 text-white/80"
                    }`}
                  >
                    {region.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
