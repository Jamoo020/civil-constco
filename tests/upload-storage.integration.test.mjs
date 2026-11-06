import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import {
  lstat,
  mkdtemp,
  mkdir,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";

const projectRoot = process.cwd();
const nextCli = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

function fetchTest(url, options = {}) {
  return fetch(url, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(30_000),
  });
}

async function getAvailablePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
  return address.port;
}

function startServer({ port, uploadDirectory, databasePath }) {
  const env = {
    ...process.env,
    ADMIN_PASSWORD: "isolated-upload-integration-password",
    ADMIN_ORIGIN: `http://127.0.0.1:${port}`,
    ADMIN_SECURITY_DB_PATH: databasePath,
    CLOUDINARY_CLOUD_NAME: "",
    CLOUDINARY_UPLOAD_PRESET: "",
    NODE_ENV: "production",
  };
  if (uploadDirectory === undefined) {
    env.FINECONE_UPLOAD_DIR = "";
  } else {
    env.FINECONE_UPLOAD_DIR = uploadDirectory;
  }

  const child = spawn(
    process.execPath,
    [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd: projectRoot, env, stdio: ["ignore", "pipe", "pipe"] }
  );
  let output = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => {
    output = `${output}${chunk}`.slice(-8000);
  });
  child.stderr.setEncoding("utf8").on("data", (chunk) => {
    output = `${output}${chunk}`.slice(-8000);
  });
  return { child, output: () => output };
}

async function waitForServer(server, baseUrl) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.child.exitCode !== null) {
      throw new Error(`Next.js test server exited early:\n${server.output()}`);
    }
    try {
      const response = await fetchTest(`${baseUrl}/`, {
        signal: AbortSignal.timeout(2_000),
      });
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error(`Next.js test server did not become ready:\n${server.output()}`);
}

async function stopServer(server) {
  if (server.child.exitCode !== null || server.child.signalCode !== null) return;
  await new Promise((resolve, reject) => {
    let forceTimer;
    const timer = setTimeout(() => {
      server.child.kill("SIGKILL");
      forceTimer = setTimeout(
        () =>
          reject(
            new Error(`Next.js test server did not stop:\n${server.output()}`)
          ),
        5_000
      );
    }, 5_000);
    server.child.once("exit", () => {
      clearTimeout(timer);
      clearTimeout(forceTimer);
      resolve();
    });
    server.child.kill("SIGTERM");
  });
}

async function startReadyServer(options) {
  const port = await getAvailablePort();
  const server = startServer({ ...options, port });
  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForServer(server, baseUrl);
  return { ...server, baseUrl };
}

async function login(baseUrl) {
  const response = await fetchTest(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: {
      Origin: baseUrl,
      "X-Real-IP": "198.51.100.40",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: "isolated-upload-integration-password" }),
  });
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  const body = await response.json();
  assert.ok(cookie);
  assert.equal(typeof body.csrfToken, "string");
  return { cookie, csrfToken: body.csrfToken };
}

function uploadForm(name, mime, bytes) {
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: mime }), name);
  return form;
}

async function upload(baseUrl, session, form, csrfToken = session.csrfToken) {
  const headers = { Origin: baseUrl, "X-Real-IP": "198.51.100.40" };
  if (session.cookie) headers.Cookie = session.cookie;
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  return fetchTest(`${baseUrl}/api/admin/upload`, {
    method: "POST",
    headers,
    body: form,
  });
}

async function buildProductionRelease(uploadDirectory) {
  const child = spawn(
    process.execPath,
    [nextCli, "build"],
    {
      cwd: projectRoot,
      env: { ...process.env, FINECONE_UPLOAD_DIR: uploadDirectory },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  let output = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => {
    output = `${output}${chunk}`.slice(-16000);
  });
  child.stderr.setEncoding("utf8").on("data", (chunk) => {
    output = `${output}${chunk}`.slice(-16000);
  });
  const [code] = await once(child, "exit");
  assert.equal(code, 0, `Production build failed:\n${output}`);
}

test(
  "persistent uploads are served safely across restart and production rebuild",
  { timeout: 600_000 },
  async (t) => {
    const temporaryRoot = await mkdtemp(
      path.join(os.tmpdir(), "finecone-upload-integration-")
    );
    const uploadDirectory = path.join(temporaryRoot, "persistent-images");
    const databasePath = path.join(temporaryRoot, "admin-security.sqlite");
    const outsideImage = path.join(temporaryRoot, "outside.webp");
    let server;

    try {
      server = await startReadyServer({ uploadDirectory, databasePath });
      const session = await login(server.baseUrl);
      t.diagnostic("Started isolated production server and authenticated admin session.");

      const unauthenticated = await upload(
        server.baseUrl,
        { cookie: undefined },
        uploadForm("valid.png", "image/png", Buffer.from("ignored"))
      );
      assert.equal(unauthenticated.status, 401);

      const csrfRejected = await upload(
        server.baseUrl,
        session,
        uploadForm("valid.png", "image/png", Buffer.from("ignored")),
        null
      );
      assert.equal(csrfRejected.status, 403);

      const invalidType = await upload(
        server.baseUrl,
        session,
        uploadForm("not-image.txt", "text/plain", Buffer.from("not an image"))
      );
      assert.equal(invalidType.status, 400);

      const invalidContent = await upload(
        server.baseUrl,
        session,
        uploadForm("invalid.jpg", "image/jpeg", Buffer.from("not a JPEG"))
      );
      assert.equal(invalidContent.status, 400);

      const oversized = await upload(
        server.baseUrl,
        session,
        uploadForm(
          "oversized.jpg",
          "image/jpeg",
          Buffer.alloc(10 * 1024 * 1024 + 1)
        )
      );
      assert.equal(oversized.status, 413);

      const png = await sharp({
        create: {
          width: 96,
          height: 64,
          channels: 3,
          background: "#386ca8",
        },
      })
        .png()
        .toBuffer();
      const validUpload = await upload(
        server.baseUrl,
        session,
        uploadForm("valid.png", "image/png", png)
      );
      assert.equal(validUpload.status, 200);
      t.diagnostic("Validated and stored an authenticated image upload.");
      const { urls } = await validUpload.json();
      assert.equal(urls.length, 1);
      assert.match(
        urls[0],
        /^\/uploads\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/
      );

      const filename = path.posix.basename(urls[0]);
      const storedImagePath = path.join(uploadDirectory, filename);
      const storedImage = await readFile(storedImagePath);
      const metadata = await sharp(storedImage).metadata();
      assert.equal(metadata.format, "webp");
      assert.equal(metadata.width, 96);
      assert.equal(metadata.height, 64);

      const directResponse = await fetchTest(`${server.baseUrl}${urls[0]}`);
      assert.equal(directResponse.status, 200);
      assert.equal(directResponse.headers.get("content-type"), "image/webp");
      assert.equal(
        directResponse.headers.get("x-content-type-options"),
        "nosniff"
      );
      assert.match(
        directResponse.headers.get("cache-control") ?? "",
        /public.*max-age=31536000.*immutable/
      );
      assert.deepEqual(Buffer.from(await directResponse.arrayBuffer()), storedImage);

      const optimizerResponse = await fetchTest(
        `${server.baseUrl}/_next/image?url=${encodeURIComponent(urls[0])}&w=640&q=75`,
        { headers: { Accept: "image/avif,image/webp,*/*" } }
      );
      assert.equal(optimizerResponse.status, 200);
      assert.match(
        optimizerResponse.headers.get("content-type") ?? "",
        /^image\/(avif|webp)$/
      );

      const missingResponse = await fetchTest(
        `${server.baseUrl}/uploads/00000000-0000-4000-8000-000000000000.webp`
      );
      assert.equal(missingResponse.status, 404);
      const invalidFilenameResponse = await fetchTest(
        `${server.baseUrl}/uploads/not-a-uuid.webp`
      );
      assert.equal(invalidFilenameResponse.status, 404);
      const traversalResponse = await fetchTest(
        `${server.baseUrl}/uploads/%2e%2e%2f${encodeURIComponent(
          path.basename(outsideImage)
        )}`
      );
      assert.equal(traversalResponse.status, 404);

      await writeFile(
        outsideImage,
        await sharp({
          create: {
            width: 12,
            height: 12,
            channels: 3,
            background: "#b83c3c",
          },
        })
          .webp()
          .toBuffer()
      );
      await mkdir(uploadDirectory, { recursive: true });
      const symlinkName = "00000000-0000-4000-8000-000000000001.webp";
      const symlinkPath = path.join(uploadDirectory, symlinkName);
      await t.test("symbolic links cannot serve files outside storage", async (st) => {
        try {
          await symlink(outsideImage, symlinkPath, "file");
        } catch (error) {
          if (
            process.platform === "win32" &&
            error &&
            typeof error === "object" &&
            "code" in error &&
            ["EPERM", "EACCES", "ENOTSUP"].includes(error.code)
          ) {
            st.skip("This Windows environment does not permit creating file symlinks.");
            return;
          }
          throw error;
        }

        assert.ok((await lstat(symlinkPath)).isSymbolicLink());
        const symlinkResponse = await fetchTest(
          `${server.baseUrl}/uploads/${symlinkName}`
        );
        assert.equal(symlinkResponse.status, 404);
      });

      const adminProjectRead = await fetchTest(
        `${server.baseUrl}/api/admin/projects`,
        { headers: { Cookie: session.cookie } }
      );
      assert.equal(adminProjectRead.status, 200);
      const adminSession = await fetchTest(`${server.baseUrl}/api/admin/session`, {
        headers: { Cookie: session.cookie },
      });
      assert.equal(adminSession.status, 200);

      const savedImage = await fetchTest(`${server.baseUrl}${urls[0]}`);
      assert.equal(savedImage.status, 200);
      await stopServer(server);
      server = await startReadyServer({ uploadDirectory, databasePath });
      const afterRestart = await fetchTest(`${server.baseUrl}${urls[0]}`);
      assert.equal(afterRestart.status, 200);
      assert.deepEqual(
        Buffer.from(await afterRestart.arrayBuffer()),
        storedImage
      );
      await stopServer(server);
      t.diagnostic("Verified retrieval after an application process restart.");

      await buildProductionRelease(uploadDirectory);
      t.diagnostic("Built a new production release with the persistent test directory unchanged.");
      server = await startReadyServer({ uploadDirectory, databasePath });
      const afterBuild = await fetchTest(`${server.baseUrl}${urls[0]}`);
      assert.equal(afterBuild.status, 200);
      assert.deepEqual(Buffer.from(await afterBuild.arrayBuffer()), storedImage);
      const afterBuildOptimization = await fetchTest(
        `${server.baseUrl}/_next/image?url=${encodeURIComponent(urls[0])}&w=640&q=75`,
        { headers: { Accept: "image/avif,image/webp,*/*" } }
      );
      assert.equal(afterBuildOptimization.status, 200);
      assert.match(
        afterBuildOptimization.headers.get("content-type") ?? "",
        /^image\/(avif|webp)$/
      );

      const logout = await fetchTest(`${server.baseUrl}/api/admin/logout`, {
        method: "POST",
        headers: {
          Cookie: session.cookie,
          Origin: server.baseUrl,
          "X-CSRF-Token": session.csrfToken,
        },
      });
      assert.equal(logout.status, 200);
      const revokedSession = await fetchTest(
        `${server.baseUrl}/api/admin/session`,
        { headers: { Cookie: session.cookie } }
      );
      assert.equal(revokedSession.status, 401);

      await stopServer(server);
      server = await startReadyServer({
        databasePath: path.join(temporaryRoot, "missing-config.sqlite"),
      });
      t.diagnostic("Started production server without FINECONE_UPLOAD_DIR.");
      const missingConfig = await fetchTest(`${server.baseUrl}${urls[0]}`);
      assert.equal(missingConfig.status, 503);
      await missingConfig.arrayBuffer();
      const unconfiguredSession = await login(server.baseUrl);
      t.diagnostic("Authenticated on the server with missing storage configuration.");
      const unavailableUpload = await upload(
        server.baseUrl,
        unconfiguredSession,
        uploadForm("valid.png", "image/png", png)
      );
      assert.equal(unavailableUpload.status, 503);
      await unavailableUpload.arrayBuffer();
      t.diagnostic("Confirmed uploads fail clearly without persistent storage configuration.");

      await stopServer(server);
      server = await startReadyServer({
        uploadDirectory: path.join(projectRoot, "public", "invalid-storage"),
        databasePath: path.join(temporaryRoot, "invalid-config.sqlite"),
      });
      const invalidConfig = await fetchTest(`${server.baseUrl}${urls[0]}`);
      assert.equal(invalidConfig.status, 503);
      await invalidConfig.arrayBuffer();
      await stopServer(server);

      const invalidStorageDirectory = path.join(
        projectRoot,
        "public",
        "invalid-storage"
      );
      await assert.rejects(realpath(invalidStorageDirectory), {
        code: "ENOENT",
      });
    } finally {
      if (server && server.child.exitCode === null) await stopServer(server);
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  }
);
