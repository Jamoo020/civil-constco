import type { Project } from "./project-validation";

export type ProjectFilters = {
  search?: string;
  region?: string;
  type?: string;
};

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getProjectTypeOptions(projects: Project[]) {
  const options = new Map<string, string>();
  for (const project of projects) {
    const label = typeof project.type === "string"
      ? project.type.trim().replace(/\s+/g, " ")
      : "";
    const key = normalizeText(label);
    if (key && !options.has(key)) options.set(key, label);
  }
  return Array.from(options, ([value, label]) => ({ value, label })).sort(
    (left, right) => left.label.localeCompare(right.label)
  );
}

export function sortFeaturedProjects(projects: Project[]) {
  return [
    ...projects.filter((project) => project.featured === true),
    ...projects.filter((project) => project.featured !== true),
  ];
}

export function filterProjects(
  projects: Project[],
  filters: ProjectFilters
) {
  const search = normalizeText(filters.search ?? "");
  const region = normalizeText(filters.region ?? "");
  const type = normalizeText(filters.type ?? "");

  return projects.filter((project) => {
    const matchesSearch =
      !search ||
      [project.title, project.location, project.type, project.client]
        .filter((value): value is string => typeof value === "string")
        .some((value) => normalizeText(value).includes(search));
    const matchesRegion =
      !region || normalizeText(project.location ?? "").includes(region);
    const matchesType = !type || normalizeText(project.type ?? "") === type;
    return matchesSearch && matchesRegion && matchesType;
  });
}

export function findProjectBySlug(projects: Project[], slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectGalleryImages(project: Partial<Project>) {
  const images = Array.isArray(project.images)
    ? project.images.filter((image): image is string => typeof image === "string" && Boolean(image.trim()))
    : [];
  if (images.length > 0) return images;
  return typeof project.image === "string" && project.image.trim()
    ? [project.image]
    : [];
}
