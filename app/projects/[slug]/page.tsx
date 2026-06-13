import React from "react";
import { getProjectBySlug, getProjects } from "../../../src/data/projects";
import { notFound } from "next/navigation";
import ProjectGallery from "../../../src/components/ProjectGallery";

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const project = await getProjectBySlug(resolved.slug);
  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.title} | Projects | Coast Infrastructure`,
    description: project.overview,
  };
}

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const project = await getProjectBySlug(resolved.slug);
  if (!project) return notFound();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-sm text-gray-600 mb-4">{project.location} • Completed {project.year}</p>
      {project.images?.length ? <ProjectGallery images={project.images} /> : null}
      <div className="mt-10 space-y-6 text-gray-700">
        <p>{project.overview}</p>
        <div>
          <h2 className="text-xl font-semibold">Scope of work</h2>
          <ul className="mt-3 list-disc list-inside space-y-2">
            {project.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Impact</h2>
          <p className="mt-2">{project.impact}</p>
        </div>
      </div>
    </div>
  );
}
