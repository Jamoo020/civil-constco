import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

type Project = {
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

async function readProjects(): Promise<Project[]> {
  const file = await fs.readFile(projectsFile, "utf8");
  return JSON.parse(file) as Project[];
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "-");
}

function validateProject(body: any): { project?: Project; error?: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request payload." };
  }

  const title = String(body.title || "").trim();
  const location = String(body.location || "").trim();
  const year = Number(body.year);
  const overview = String(body.overview || "").trim();
  const type = String(body.type || "General").trim();
  const client = String(body.client || "").trim();
  const featured = Boolean(body.featured);
  const impact = String(body.impact || "").trim();
  const image = String(body.image || "").trim();
  const images = Array.isArray(body.images)
    ? (body.images as unknown[]).map((item) => String(item).trim()).filter(Boolean)
    : String(body.images || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
  const scope = Array.isArray(body.scope)
    ? (body.scope as unknown[]).map((item) => String(item).trim()).filter(Boolean)
    : String(body.scope || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

  if (!title) {
    return { error: "Project title is required." };
  }
  if (!location) {
    return { error: "Location is required." };
  }
  if (!overview) {
    return { error: "Overview is required." };
  }
  if (!scope.length) {
    return { error: "At least one scope item is required." };
  }
  if (!year || Number.isNaN(year) || year < 1800 || year > 2100) {
    return { error: "Year must be a valid number." };
  }

  const slug = body.slug ? String(body.slug).trim() : createSlug(title);

  return {
    project: {
      slug,
      title,
      location,
      year,
      type,
      featured,
      client,
      overview,
      image: image || undefined,
      images,
      scope,
      impact,
    },
  };
}

export async function GET() {
  const projects = await readProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const validation = validateProject(body);
  if (validation.error) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const projects = await readProjects();
  const existing = projects.find((project) => project.slug === validation.project!.slug);
  if (existing) {
    return NextResponse.json({ error: "A project with the same slug already exists. Use edit instead." }, { status: 409 });
  }

  projects.unshift(validation.project!);
  await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2), "utf8");

  return NextResponse.json({ success: true, project: validation.project });
}

export async function PUT(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const slug = params.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Project slug is required for update." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const validation = validateProject({ ...body, slug });
  if (validation.error) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const projects = await readProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  projects[index] = validation.project!;
  await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2), "utf8");

  return NextResponse.json({ success: true, project: validation.project });
}

export async function DELETE(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const slug = params.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Project slug is required for deletion." }, { status: 400 });
  }

  const projects = await readProjects();
  const updated = projects.filter((project) => project.slug !== slug);
  if (updated.length === projects.length) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  await fs.writeFile(projectsFile, JSON.stringify(updated, null, 2), "utf8");
  return NextResponse.json({ success: true });
}
