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
const projectsRepoPath = "src/data/projects.json";

async function readLocalProjects(): Promise<Project[]> {
  const file = await fs.readFile(projectsFile, "utf8");
  return JSON.parse(file) as Project[];
}

async function fetchProjectsFromGitHub(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error("GitHub not configured");
  }

  const apiBase = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(projectsRepoPath)}`;
  const res = await fetch(apiBase, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub read failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  const content = Buffer.from(json.content, json.encoding).toString("utf8");
  return JSON.parse(content) as Project[];
}

export async function getProjects(): Promise<Project[]> {
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    try {
      return await fetchProjectsFromGitHub();
    } catch (error) {
      console.error("GitHub fetch failed, falling back to local data:", error);
    }
  }

  return readLocalProjects();
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}
