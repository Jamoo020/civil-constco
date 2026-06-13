import React from "react";
import Hero from "../src/components/Hero";
import StatsPanel from "../src/components/StatsPanel";
import RegionMap from "../src/components/RegionMap";
import ProcessJourney from "../src/components/ProcessJourney";
import TeamExpertise from "../src/components/TeamExpertise";
import TestimonialSection from "../src/components/TestimonialSection";
import TrustBar from "../src/components/TrustBar";
import { getProjects } from "../src/data/projects";
import ProjectCard from "../src/components/ProjectCard";

export const metadata = {
  title: "Coast Infrastructure | Civil Engineering & Construction Kenya",
  description: "Professional civil engineering and construction services across all 47 Kenyan counties. Based in Kilifi, delivering resilient infrastructure with technical excellence and transparency.",
  keywords: [
    "civil engineering Kenya",
    "construction contractor Kenya",
    "infrastructure delivery",
    "coastal engineering Mombasa",
    "road construction Kenya",
    "drainage systems Kenya",
    "bridge construction",
    "water infrastructure",
    "site supervision",
    "engineering services nationwide"
  ],
  openGraph: {
    title: "Coast Infrastructure | Civil Engineering & Construction Kenya",
    description: "Professional civil engineering and construction services across Kenya. Technical excellence, transparent processes, nationwide delivery.",
    type: "website",
    url: "https://coastinfrastructure.co.ke",
    siteName: "Coast Infrastructure",
  },
};

export const dynamic = "force-static";

export default async function Home() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="space-y-0">
      <Hero />
      <StatsPanel />

      {/* Featured Projects Section */}
      <div className="relative bg-gradient-to-b from-slate-50/50 to-transparent py-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_24%,rgba(14,116,144,.02)_25%,rgba(14,116,144,.02)_26%,transparent_27%,transparent_74%,rgba(14,116,144,.02)_75%,rgba(14,116,144,.02)_76%,transparent_77%,transparent)] bg-[length:100px_100px] pointer-events-none" />
        <div className="container space-y-8 relative z-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-widest text-gray-500">Our Work</p>
          <h2 className="text-4xl font-bold">Flagship Infrastructure Projects</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Selected civil engineering and construction works demonstrating our technical capability and execution discipline across coastal and inland Kenya.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        </div>
      </div>

      {/* Process Journey */}
      <ProcessJourney />

      {/* Team Expertise */}
      <TeamExpertise />

      {/* Regional Coverage */}
      <RegionMap />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Trust Bar */}
      <TrustBar />

      {/* CTA Section */}
      <section className="container py-16 text-center space-y-6">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold">Ready to Discuss Your Project?</h2>
          <p className="text-lg text-gray-600">
            Contact our team to explore how Coast Infrastructure can deliver your infrastructure with discipline, transparency, and technical excellence.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <a href="/contact" className="inline-flex items-center px-8 py-3 rounded-full bg-steel text-white font-semibold hover:bg-steel/90 transition">
            Get In Touch
          </a>
          <a href="/services" className="inline-flex items-center px-8 py-3 rounded-full border-2 border-steel text-steel font-semibold hover:bg-slate-50 transition">
            View Services
          </a>
        </div>
      </section>
    </section>
  );
}
