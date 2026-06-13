"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "../data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const imageSrc = project.images?.[0] ?? project.image;
  const excerpt = project.overview
    ? project.overview.length > 110
      ? `${project.overview.slice(0, 110).trim()}...`
      : project.overview
    : "";

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl bg-white">
      <Link href={`/projects/${project.slug}`} className="block">
        {imageSrc ? (
          <div className="relative h-44 overflow-hidden">
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-steel font-semibold">
            Project illustration
          </div>
        )}
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{project.type}</p>
          <h3 className="text-2xl font-semibold mt-3">{project.title}</h3>
          <p className="text-sm text-gray-600 mt-3">{project.location} • {project.year}</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">{excerpt}</p>
        </div>
      </Link>
    </motion.article>
  );
}
