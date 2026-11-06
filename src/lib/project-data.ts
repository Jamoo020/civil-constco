import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import { Project, ProjectDataError, validateProject } from "./project-validation";

type Environment = Record<string, string | undefined>;

type ProjectStoreOptions = {
  filePath?: string;
  env?: Environment;
  fetchImpl?: typeof fetch;
  fileOperations?: Pick<
    typeof fs,
    "readFile" | "writeFile" | "rename" | "unlink"
  >;
};

export type ProjectStore = {
  read: () => Promise<Project[]>;
  readSnapshot: () => Promise<ProjectSnapshot>;
  write: (projects: Project[], expectedRevision?: string) => Promise<void>;
};

type ProjectSnapshot = {
  projects: Project[];
  revision?: string;
};

const projectsFile = path.join(process.cwd(), "src/data/projects.json");
const githubProjectPath = "src/data/projects.json";
let mutationQueue = Promise.resolve();

function isProjectArray(value: unknown): value is Project[] {
  return Array.isArray(value);
}

function parseProjectArray(content: string, status: number): Project[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new ProjectDataError("Stored project data is not valid JSON.", status);
  }
  if (!isProjectArray(parsed)) {
    throw new ProjectDataError("Stored project data must be a JSON array.", status);
  }
  return parsed;
}

function githubError(response: Response, action: string) {
  if (response.status === 409) {
    return new ProjectDataError(
      "Project data changed in GitHub during this update. Reload the projects and try again.",
      409
    );
  }
  if (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get("x-ratelimit-remaining") === "0")
  ) {
    return new ProjectDataError(
      "GitHub rate limit reached. Please try again later.",
      429
    );
  }
  return new ProjectDataError(
    `GitHub ${action} failed (HTTP ${response.status}).`,
    502
  );
}

export function createProjectStore(options: ProjectStoreOptions = {}): ProjectStore {
  const filePath = options.filePath ?? projectsFile;
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const token = env.GITHUB_TOKEN;
  const repo = env.GITHUB_REPO;
  const usesGitHub = Boolean(token && repo);
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(githubProjectPath)}`;
  const githubHeaders = {
    Authorization: `token ${token ?? ""}`,
    Accept: "application/vnd.github+json",
  };

  async function readFromGitHub(): Promise<ProjectSnapshot> {
    let response: Response;
    try {
      response = await fetchImpl(apiUrl, {
        headers: githubHeaders,
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new ProjectDataError("Unable to reach GitHub project storage.", 502);
    }
    if (!response.ok) throw githubError(response, "project read");

    try {
      const file = (await response.json()) as {
        content?: unknown;
        encoding?: unknown;
        sha?: unknown;
      };
      if (
        typeof file.content !== "string" ||
        file.encoding !== "base64" ||
        typeof file.sha !== "string" ||
        !file.sha
      ) {
        throw new Error("Invalid GitHub file response.");
      }
      return {
        projects: parseProjectArray(
          Buffer.from(file.content, "base64").toString("utf8"),
          502
        ),
        revision: file.sha,
      };
    } catch (error) {
      if (error instanceof ProjectDataError) throw error;
      throw new ProjectDataError("GitHub returned invalid project data.", 502);
    }
  }

  async function writeToFilesystem(projects: Project[]) {
    const directory = path.dirname(filePath);
    const temporaryPath = path.join(
      directory,
      `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`
    );
    const serialized = `${JSON.stringify(projects, null, 2)}\n`;

    try {
      if (options.fileOperations) {
        await options.fileOperations.writeFile(temporaryPath, serialized, {
          encoding: "utf8",
          flag: "wx",
          mode: 0o600,
        });
        await options.fileOperations.rename(temporaryPath, filePath);
      } else {
        await fs.writeFile(temporaryPath, serialized, {
          encoding: "utf8",
          flag: "wx",
          mode: 0o600,
        });
        await fs.rename(temporaryPath, filePath);
      }
    } catch {
      try {
        if (options.fileOperations) {
          await options.fileOperations.unlink(temporaryPath);
        } else {
          await fs.unlink(temporaryPath);
        }
      } catch (cleanupError) {
        if (
          !cleanupError ||
          typeof cleanupError !== "object" ||
          !("code" in cleanupError) ||
          cleanupError.code !== "ENOENT"
        ) {
          throw new ProjectDataError(
            "Project data could not be saved and its temporary file could not be cleaned up.",
            500
          );
        }
      }
      throw new ProjectDataError("Project data could not be saved.", 500);
    }
  }

  async function writeToGitHub(projects: Project[], expectedRevision?: string) {
    if (!expectedRevision) {
      throw new ProjectDataError(
        "A GitHub project version is required to save project changes.",
        500
      );
    }

    let response: Response;
    try {
      response = await fetchImpl(apiUrl, {
        method: "PUT",
        headers: {
          ...githubHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update projects via admin interface",
          content: Buffer.from(JSON.stringify(projects, null, 2)).toString("base64"),
          sha: expectedRevision,
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new ProjectDataError("Unable to reach GitHub project storage.", 502);
    }
    if (!response.ok) throw githubError(response, "project update");
  }

  async function readSnapshot(): Promise<ProjectSnapshot> {
    if (usesGitHub) return readFromGitHub();
    try {
      const content = options.fileOperations
        ? await options.fileOperations.readFile(filePath, "utf8")
        : await fs.readFile(
            path.join(process.cwd(), "src/data/projects.json"),
            "utf8"
          );
      return { projects: parseProjectArray(content, 500) };
    } catch (error) {
      if (error instanceof ProjectDataError) throw error;
      throw new ProjectDataError("Unable to read project data.", 500);
    }
  }

  return {
    async read() {
      const snapshot = await readSnapshot();
      return snapshot.projects;
    },
    readSnapshot,
    async write(projects, expectedRevision) {
      if (usesGitHub) return writeToGitHub(projects, expectedRevision);
      if (env.VERCEL) {
        throw new ProjectDataError(
          "Project persistence on Vercel requires GITHUB_TOKEN and GITHUB_REPO.",
          503
        );
      }
      return writeToFilesystem(projects);
    },
  };
}

function withMutationLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

export async function createProject(store: ProjectStore, value: unknown) {
  const project = validateProject(value);
  return withMutationLock(async () => {
    const snapshot = await store.readSnapshot();
    const projects = snapshot.projects;
    if (projects.some((item) => item.slug === project.slug)) {
      throw new ProjectDataError(
        "A project with the same slug already exists. Use edit instead.",
        409
      );
    }
    const updated = [project, ...projects];
    await store.write(updated, snapshot.revision);
    return project;
  });
}

export async function updateProject(
  store: ProjectStore,
  slug: string,
  value: unknown
) {
  const project = validateProject(value, { slug });
  return withMutationLock(async () => {
    const snapshot = await store.readSnapshot();
    const projects = snapshot.projects;
    const index = projects.findIndex((item) => item.slug === slug);
    if (index < 0) {
      throw new ProjectDataError("Project not found.", 404);
    }
    if (projects.some((item, itemIndex) => itemIndex !== index && item.slug === slug)) {
      throw new ProjectDataError("A project with the same slug already exists.", 409);
    }
    const updated = projects.slice();
    updated[index] = project;
    await store.write(updated, snapshot.revision);
    return project;
  });
}

export async function deleteProject(store: ProjectStore, slug: string) {
  return withMutationLock(async () => {
    const snapshot = await store.readSnapshot();
    const projects = snapshot.projects;
    const updated = projects.filter((project) => project.slug !== slug);
    if (updated.length === projects.length) {
      throw new ProjectDataError("Project not found.", 404);
    }
    await store.write(updated, snapshot.revision);
  });
}
