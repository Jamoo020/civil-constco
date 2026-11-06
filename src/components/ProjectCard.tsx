"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Project } from "../data/projects";
import { getProjectGalleryImages } from "../lib/project-presentation";

export default function ProjectCard({ project }: { project: Project }) {
  const imageSources = useMemo(
    () => Array.from(new Set(getProjectGalleryImages(project))),
    [project.image, project.images]
  );
  const [imageIndex, setImageIndex] = useState(0);
  const excerpt = project.overview
    ? project.overview.length > 110
      ? `${project.overview.slice(0, 110).trim()}...`
      : project.overview
    : "";

  useEffect(() => {
    setImageIndex(0);
  }, [imageSources]);

  const imageSrc = imageSources[imageIndex];

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className={`relative overflow-hidden rounded-3xl border bg-white shadow-lg hover:shadow-2xl ${project.featured === true ? "border-amber-400 ring-1 ring-amber-300" : ""}`}>
      <Link href={`/projects/${project.slug}`} className="block">
        {imageSrc ? (
          <div className="relative h-44 overflow-hidden">
            <Image
              src={imageSrc}
              alt={project.title}
              unoptimized
              onError={() => setImageIndex((current) => current + 1)}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 px-6 text-center font-semibold text-steel">
            Project image unavailable
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{project.type}</p>
            {project.featured === true ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                Featured project
              </span>
            ) : null}
          </div>
          <h3 className="text-2xl font-semibold mt-3">{project.title}</h3>
          <p className="text-sm text-gray-600 mt-3">{project.location} • {project.year}</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">{excerpt}</p>
        </div>
      </Link>
    </motion.article>
  );
}
