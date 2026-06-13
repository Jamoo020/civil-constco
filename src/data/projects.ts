import fs from "fs/promises";
import path from "path";

export type Project = {
  slug: string;
  title: string;
  location: string;
  year: number;
  type: string;
  featured: boolean;
  client: string;
  overview: string;
  image?: string;
  images: string[];
  scope: string[];
  impact: string;
};

const projectsFile = path.join(process.cwd(), "src/data/projects.json");

export async function getProjects(): Promise<Project[]> {
  const file = await fs.readFile(projectsFile, "utf8");
  return JSON.parse(file) as Project[];
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}
