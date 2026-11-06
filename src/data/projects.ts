import { createProjectStore } from "../lib/project-data";
import type { Project } from "../lib/project-validation";
import { findProjectBySlug } from "../lib/project-presentation";

export type { Project } from "../lib/project-validation";

const projectStore = createProjectStore();

export async function getProjects(): Promise<Project[]> {
  return projectStore.read();
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return findProjectBySlug(projects, slug);
}
