import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import * as fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import ts from "typescript";

const projectRoot = process.cwd();
const temporaryRoot = await mkdtemp(
  path.join(os.tmpdir(), "finecon-project-data-tests-")
);
const compiledRoot = path.join(temporaryRoot, "compiled");
await mkdir(compiledRoot, { recursive: true });

for (const name of [
  "project-validation",
  "project-data",
  "project-presentation",
]) {
  const source = await readFile(
    path.join(projectRoot, "src", "lib", `${name}.ts`),
    "utf8"
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  await writeFile(path.join(compiledRoot, `${name}.js`), compiled, "utf8");
}

const require = createRequire(import.meta.url);
const { PROJECT_FIELD_LIMITS, ProjectDataError, validateProject } = require(
  path.join(compiledRoot, "project-validation.js")
);
const {
  filterProjects,
  findProjectBySlug,
  getProjectGalleryImages,
  getProjectTypeOptions,
  sortFeaturedProjects,
} = require(path.join(compiledRoot, "project-presentation.js"));
const {
  createProject,
  createProjectStore,
  deleteProject,
  updateProject,
} = require(path.join(compiledRoot, "project-data.js"));

function validProject(overrides = {}) {
  return {
    title: "Test Project",
    location: "Mombasa",
    year: "2025",
    overview: "A project overview.",
    type: "Building Construction",
    featured: false,
    client: "",
    impact: "",
    image: "",
    images: "",
    scope: "Site preparation",
    ...overrides,
  };
}

function response(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers });
}

function githubRead(projects, sha = "current-sha") {
  return response({
    content: Buffer.from(JSON.stringify(projects)).toString("base64"),
    encoding: "base64",
    sha,
  });
}

function fileStore(filePath, env = {}) {
  return createProjectStore({ filePath, env, fileOperations: fsPromises });
}

test.after(async () => {
  await rm(temporaryRoot, { recursive: true, force: true });
});

test("validates and trims required fields while generating canonical slugs", () => {
  const project = validateProject(
    validProject({
      title: "  Project title!!!  ",
      location: "  Kilifi  ",
      overview: "  Overview  ",
      type: "  Construction  ",
      scope: "  First item \n\n Second item  ",
    })
  );

  assert.equal(project.slug, "project-title");
  assert.equal(project.title, "Project title!!!");
  assert.equal(project.location, "Kilifi");
  assert.equal(project.overview, "Overview");
  assert.deepEqual(project.scope, ["First item", "Second item"]);
});

test("existing project records satisfy the stricter validation rules", async () => {
  const records = JSON.parse(
    await readFile(
      path.join(projectRoot, "src", "data", "projects.json"),
      "utf8"
    )
  );
  assert.ok(records.length > 0);
  for (const record of records) {
    assert.doesNotThrow(() => validateProject(record, { slug: record.slug }));
  }
});

test("rejects missing or blank required values", () => {
  for (const field of ["title", "location", "overview", "type", "scope"]) {
    assert.throws(
      () => validateProject(validProject({ [field]: "  " })),
      ProjectDataError,
      field
    );
  }
});

test("rejects invalid field types and unexpected payload properties", () => {
  for (const [field, value] of [
    ["title", 42],
    ["type", false],
    ["featured", "false"],
    ["client", null],
    ["impact", 12],
    ["image", []],
    ["images", ["/valid.webp", 10]],
    ["scope", [null]],
    ["year", true],
  ]) {
    assert.throws(
      () => validateProject(validProject({ [field]: value })),
      ProjectDataError,
      field
    );
  }
  assert.throws(
    () => validateProject(validProject({ unexpected: "value" })),
    /unsupported field/i
  );
  assert.throws(() => validateProject([]), /invalid request payload/i);
});

test("requires integer years within the supported range", () => {
  for (const year of ["2025.5", 2025.5, 1799, 2101, "abc", ""]) {
    assert.throws(
      () => validateProject(validProject({ year })),
      /year must be an integer/i,
      String(year)
    );
  }
  assert.equal(validateProject(validProject({ year: 1800 })).year, 1800);
  assert.equal(validateProject(validProject({ year: "2100" })).year, 2100);
});

test("enforces maximum project field lengths", () => {
  const fields = [
    ["title", PROJECT_FIELD_LIMITS.title],
    ["location", PROJECT_FIELD_LIMITS.location],
    ["overview", PROJECT_FIELD_LIMITS.overview],
    ["type", PROJECT_FIELD_LIMITS.type],
    ["client", PROJECT_FIELD_LIMITS.client],
    ["impact", PROJECT_FIELD_LIMITS.impact],
    ["image", PROJECT_FIELD_LIMITS.imageUrl],
  ];
  for (const [field, limit] of fields) {
    assert.throws(
      () =>
        validateProject(
          validProject({
            [field]: "x".repeat(limit + 1),
          })
        ),
      ProjectDataError,
      field
    );
  }
});

test("requires scope and enforces item count, item length, and gallery limits", () => {
  assert.throws(
    () => validateProject(validProject({ scope: [] })),
    /at least one scope item/i
  );
  assert.throws(
    () =>
      validateProject(
        validProject({
          scope: ["x".repeat(PROJECT_FIELD_LIMITS.scopeItem + 1)],
        })
      ),
    /scope items must be/i
  );
  assert.throws(
    () =>
      validateProject(
        validProject({
          scope: Array(PROJECT_FIELD_LIMITS.scopeItems + 1).fill("Work"),
        })
      ),
    /scope may contain at most/i
  );
  assert.throws(
    () =>
      validateProject(
        validProject({
          images: Array(PROJECT_FIELD_LIMITS.galleryImages + 1).fill(
            "https://example.com/image.webp"
          ),
        })
      ),
    /gallery images may contain at most/i
  );
});

test("accepts only safe HTTP(S) or UUID upload image URLs", () => {
  assert.throws(
    () => validateProject(validProject({ image: "javascript:alert(1)" })),
    /must be an HTTP/i
  );
  assert.throws(
    () =>
      validateProject(
        validProject({ images: "https://example.com/image.webp\n//example.com/x" })
      ),
    /must be an HTTP/i
  );
  assert.equal(
    validateProject(
      validProject({
        image:
          "/uploads/00000000-0000-4000-8000-000000000001.webp",
        images: "https://example.com/gallery.webp",
      })
    ).images.length,
    1
  );
});

test("rejects invalid slugs and normalizes titles ending in punctuation", () => {
  assert.equal(
    validateProject(validProject({ title: "End in punctuation!!!" })).slug,
    "end-in-punctuation"
  );
  for (const slug of ["", "bad slug", "-leading", "trailing-", "UPPER"]) {
    assert.throws(
      () => validateProject(validProject({ slug })),
      /required|valid project slug/i
    );
  }
  assert.throws(
    () => validateProject(validProject({ title: "!!!" })),
    /valid project slug/i
  );
});

test("rejects duplicate slugs and edits while retaining the existing slug", async () => {
  const directory = path.join(temporaryRoot, "duplicate");
  const filePath = path.join(directory, "projects.json");
  await fsPromises.mkdir(directory, { recursive: true });
  await writeFile(filePath, "[]", "utf8");
  const store = fileStore(filePath);

  await createProject(store, validProject());
  await assert.rejects(
    createProject(store, validProject({ title: "Test Project" })),
    (error) => error instanceof ProjectDataError && error.status === 409
  );

  const updated = await updateProject(
    store,
    "test-project",
    validProject({ slug: "test-project", title: "Renamed title" })
  );
  assert.equal(updated.slug, "test-project");
  assert.equal(updated.title, "Renamed title");
  assert.equal((await store.read())[0].slug, "test-project");
});

test("atomically replaces project data using a same-directory temporary file", async () => {
  const directory = path.join(temporaryRoot, "atomic");
  const filePath = path.join(directory, "projects.json");
  await fsPromises.mkdir(directory, { recursive: true });
  await writeFile(filePath, "old content", "utf8");
  let renameCalled = false;
  const fileOperations = {
    ...fsPromises,
    async rename(from, to) {
      renameCalled = true;
      assert.equal(path.dirname(from), directory);
      assert.equal(to, filePath);
      assert.equal(await readFile(filePath, "utf8"), "old content");
      return fsPromises.rename(from, to);
    },
  };
  const store = createProjectStore({ filePath, env: {}, fileOperations });
  const project = validateProject(validProject());

  await store.write([project]);
  assert.equal(renameCalled, true);
  assert.deepEqual(await store.read(), [JSON.parse(JSON.stringify(project))]);
  assert.deepEqual(await readdir(directory), ["projects.json"]);
});

test("cleans up temporary data and preserves the original on write and rename failures", async () => {
  for (const failureStage of ["write", "rename"]) {
    const directory = path.join(temporaryRoot, `failure-${failureStage}`);
    const filePath = path.join(directory, "projects.json");
    await fsPromises.mkdir(directory, { recursive: true });
    await writeFile(filePath, "original", "utf8");
    const fileOperations = {
      ...fsPromises,
      async writeFile(target, ...args) {
        await fsPromises.writeFile(target, ...args);
        if (failureStage === "write") throw new Error("simulated write failure");
      },
      async rename() {
        throw new Error("simulated rename failure");
      },
    };
    const store = createProjectStore({ filePath, env: {}, fileOperations });

    await assert.rejects(
      store.write([validateProject(validProject())]),
      (error) => error instanceof ProjectDataError && error.status === 500
    );
    assert.equal(await readFile(filePath, "utf8"), "original");
    assert.deepEqual(await readdir(directory), ["projects.json"]);
  }
});

test("a failed filesystem mutation rejects instead of reporting a saved project", async () => {
  const directory = path.join(temporaryRoot, "failed-mutation");
  const filePath = path.join(directory, "projects.json");
  await fsPromises.mkdir(directory, { recursive: true });
  await writeFile(filePath, "[]", "utf8");
  const fileOperations = {
    ...fsPromises,
    async writeFile(target, ...args) {
      await fsPromises.writeFile(target, ...args);
      throw new Error("simulated persistence failure");
    },
  };
  const store = createProjectStore({ filePath, env: {}, fileOperations });

  await assert.rejects(
    createProject(store, validProject()),
    (error) => error instanceof ProjectDataError && error.status === 500
  );
  assert.deepEqual(JSON.parse(await readFile(filePath, "utf8")), []);
  assert.deepEqual(await readdir(directory), ["projects.json"]);
});

test("serializes concurrent create, edit, and delete operations in one process", async () => {
  const directory = path.join(temporaryRoot, "concurrent");
  const filePath = path.join(directory, "projects.json");
  await fsPromises.mkdir(directory, { recursive: true });
  await writeFile(filePath, "[]", "utf8");
  const store = fileStore(filePath);

  await Promise.all(
    Array.from({ length: 20 }, (_, index) =>
      createProject(
        store,
        validProject({
          title: `Concurrent project ${index}`,
          scope: `Work ${index}`,
        })
      )
    )
  );
  assert.equal((await store.read()).length, 20);
  await Promise.all([
    updateProject(
      store,
      "concurrent-project-0",
      validProject({ slug: "concurrent-project-0", title: "Edited project" })
    ),
    deleteProject(store, "concurrent-project-1"),
  ]);
  const projects = await store.read();
  assert.equal(projects.length, 19);
  assert.ok(projects.some((project) => project.slug === "concurrent-project-0"));
  assert.ok(!projects.some((project) => project.slug === "concurrent-project-1"));
});

test("uses the SHA from the project read for conditional writes and reports conflicts", async () => {
  const directory = path.join(temporaryRoot, "github-failure");
  await fsPromises.mkdir(directory, { recursive: true });
  const filePath = path.join(directory, "projects.json");
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return githubRead([], "read-snapshot-sha");
    return response({ message: "conflict" }, 409);
  };
  const store = createProjectStore({
    filePath,
    env: { GITHUB_TOKEN: "test-token", GITHUB_REPO: "owner/repo" },
    fetchImpl,
  });

  await assert.rejects(
    createProject(store, validProject()),
    (error) => error instanceof ProjectDataError && error.status === 409
  );
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.method, "PUT");
  assert.equal(JSON.parse(calls[1].options.body).sha, "read-snapshot-sha");
  await assert.rejects(readFile(filePath));
});

test("does not report success when GitHub rejects the conditional project write", async () => {
  const calls = [];
  const store = createProjectStore({
    env: { GITHUB_TOKEN: "test-token", GITHUB_REPO: "owner/repo" },
    fetchImpl: async (_url, options) => {
      calls.push(options);
      if (calls.length === 1) return githubRead([]);
      return response({ message: "server error" }, 500);
    },
  });

  await assert.rejects(
    createProject(store, validProject()),
    (error) =>
      error instanceof ProjectDataError &&
      error.status === 502 &&
      /GitHub project update failed \(HTTP 500\)/.test(error.message)
  );
  assert.equal(calls.length, 2);
  assert.equal(calls[1].method, "PUT");
});

test("does not fall back to local data or report success after GitHub failures", async () => {
  const directory = path.join(temporaryRoot, "github-no-fallback");
  await fsPromises.mkdir(directory, { recursive: true });
  const filePath = path.join(directory, "projects.json");
  await writeFile(filePath, "[]", "utf8");
  let callCount = 0;
  const store = createProjectStore({
    filePath,
    env: { GITHUB_TOKEN: "test-token", GITHUB_REPO: "owner/repo" },
    fetchImpl: async () => {
      callCount++;
      return response({ error: "unavailable" }, 500);
    },
  });

  await assert.rejects(
    store.read(),
    (error) => error instanceof ProjectDataError && error.status === 502
  );
  await assert.rejects(
    createProject(store, validProject()),
    (error) => error instanceof ProjectDataError && error.status === 502
  );
  assert.equal(callCount, 2);
  assert.equal(await readFile(filePath, "utf8"), "[]");
});

test("reports GitHub rate limits without attempting a project write", async () => {
  let callCount = 0;
  const store = createProjectStore({
    env: { GITHUB_TOKEN: "test-token", GITHUB_REPO: "owner/repo" },
    fetchImpl: async () => {
      callCount++;
      return response({}, 403, { "x-ratelimit-remaining": "0" });
    },
  });

  await assert.rejects(
    store.read(),
    (error) => error instanceof ProjectDataError && error.status === 429
  );
  assert.equal(callCount, 1);
});

test("derives project type options from records and normalizes duplicates", async () => {
  const records = JSON.parse(
    await readFile(
      path.join(projectRoot, "src", "data", "projects.json"),
      "utf8"
    )
  );
  const options = getProjectTypeOptions([
    ...records,
    { ...records[0], type: " roads  " },
    { ...records[1], type: "ROAD CONSTRUCTION" },
  ]);
  assert.equal(options.length, 8);
  assert.ok(options.some((option) => option.label === "Roads"));
  assert.ok(options.some((option) => option.label === "Road Construction"));
  assert.equal(options.filter((option) => option.value === "roads").length, 1);
  assert.equal(
    filterProjects(records, { type: "  rOaDs " }).length,
    2
  );
  assert.equal(
    filterProjects(records, { type: "road construction" }).length,
    1
  );
});

test("featured records are prominent without excluding any public listing records", async () => {
  const records = JSON.parse(
    await readFile(
      path.join(projectRoot, "src", "data", "projects.json"),
      "utf8"
    )
  );
  const ordered = sortFeaturedProjects(records);
  assert.equal(ordered.length, records.length);
  assert.deepEqual(
    ordered.filter((project) => project.featured).map((project) => project.slug),
    records.filter((project) => project.featured).map((project) => project.slug)
  );
  assert.deepEqual(
    ordered.filter((project) => !project.featured).map((project) => project.slug),
    records.filter((project) => !project.featured).map((project) => project.slug)
  );
  assert.deepEqual(
    new Set(ordered.map((project) => project.slug)),
    new Set(records.map((project) => project.slug))
  );
});

test("project lookup returns the matching public detail record", async () => {
  const records = JSON.parse(
    await readFile(
      path.join(projectRoot, "src", "data", "projects.json"),
      "utf8"
    )
  );
  const project = findProjectBySlug(records, "mombasa-coastal-road");
  assert.equal(project?.title, "Mombasa Coastal Road Upgrade");
  assert.equal(findProjectBySlug(records, "unknown-project"), undefined);
});

test("missing optional fields remain safe for public cards and detail pages", () => {
  const project = validateProject({
    title: "No optional fields",
    location: "Kilifi",
    year: 2025,
    overview: "A project with no optional content.",
    type: "Construction",
    featured: false,
    scope: ["Building work"],
  });
  assert.equal(project.client, "");
  assert.equal(project.impact, "");
  assert.equal(project.image, undefined);
  assert.deepEqual(project.images, []);
  assert.deepEqual(getProjectGalleryImages(project), []);
});

test("admin featured edits persist in the same project data read by public pages", async () => {
  const directory = path.join(temporaryRoot, "public-consistency");
  const filePath = path.join(directory, "projects.json");
  await fsPromises.mkdir(directory, { recursive: true });
  await writeFile(filePath, "[]", "utf8");
  const store = fileStore(filePath);

  await createProject(store, validProject({ featured: false }));
  const updated = await updateProject(
    store,
    "test-project",
    validProject({ slug: "test-project", featured: true })
  );
  assert.equal(updated.featured, true);

  const publicRecords = sortFeaturedProjects(await store.read());
  assert.equal(publicRecords[0].slug, "test-project");
  assert.equal(publicRecords[0].featured, true);
});
