"use client";
import React, { useMemo, useState } from "react";
import { Project } from "../data/projects";
import ProjectCard from "./ProjectCard";
import { locations } from "../data/content";

const projectTypes = ["All types", "Roads", "Construction", "Buildings", "Industrial", "Urban Infrastructure"];

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Filters({ projects }: { projects: Project[] }) {
  const regions = useMemo(() => {
    const names = locations.map((l) => titleFromSlug(l.slug));
    return ["All regions", ...Array.from(new Set(names))];
  }, []);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(regions[0]);
  const [type, setType] = useState(projectTypes[0]);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchesSearch = [project.title, project.location, project.type, project.client]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesRegion = region === "All regions" || project.location.toLowerCase().includes(region.toLowerCase());
        const matchesType = type === "All types" || project.type.toLowerCase() === type.toLowerCase();
        return matchesSearch && matchesRegion && matchesType;
      }),
    [projects, search, region, type]
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects by name, location, or client"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20"
          />
        </div>

        <div className="grid w-full gap-4 md:w-auto md:grid-cols-2">
          <label className="block">
            <span className="sr-only">Project region</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20"
            >
              {regions.map((regionOption) => (
                <option key={regionOption} value={regionOption}>
                  {regionOption}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Project type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20"
            >
              {projectTypes.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-slate-50 p-10 text-center text-gray-600">
            <p className="text-lg font-semibold">No projects match your search.</p>
            <p className="mt-2 text-sm">Try a different region, type, or a broader keyword.</p>
          </div>
        )}
      </div>
    </section>
  );
}
