import React from "react";
import { getProjects } from "../../src/data/projects";
import Filters from "../../src/components/Filters";

export const metadata = {
  title: "Projects | Coast Infrastructure",
  description: "Browse Civil and Construction projects completed across the Kenyan Coast, highways, ports, and coastal communities.",
};

export const dynamic = "force-static";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Projects</h1>
      <p className="text-gray-600 mb-8">Showcasing major civil infrastructure works across the Coast, regional corridors and nationwide projects.</p>
      <Filters projects={projects} />
    </div>
  );
}
