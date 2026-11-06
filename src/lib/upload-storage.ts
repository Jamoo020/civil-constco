import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { chmod, lstat, mkdir, open, realpath } from "node:fs/promises";
import path from "node:path";
import type { FileHandle } from "node:fs/promises";

const UUID_WEBP_FILENAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/;

export class UploadStorageConfigurationError extends Error {
  constructor() {
    super("Persistent image storage is not configured correctly.");
    this.name = "UploadStorageConfigurationError";
  }
}

export function isUploadFilename(value: string) {
  return UUID_WEBP_FILENAME.test(value);
}

function isWithin(parent: string, candidate: string) {
  const relativePath = path.relative(parent, candidate);
  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
}

function assertOutsideApplicationAssets(
  directory: string,
  publicDirectory: string,
  buildDirectory: string
) {
  if (
    isWithin(publicDirectory, directory) ||
    isWithin(directory, publicDirectory) ||
    isWithin(buildDirectory, directory) ||
    isWithin(directory, buildDirectory)
  ) {
    throw new UploadStorageConfigurationError();
  }
}

async function resolveWithExistingSymlinks(directory: string) {
  let current = directory;
  const remainingParts: string[] = [];

  while (true) {
    try {
      const existingPath = await realpath(current);
      return path.resolve(existingPath, ...remainingParts.reverse());
    } catch (error) {
      if (
        !error ||
        typeof error !== "object" ||
        !("code" in error) ||
        error.code !== "ENOENT"
      ) {
        throw error;
      }

      const parent = path.dirname(current);
      if (parent === current) throw error;
      remainingParts.push(path.basename(current));
      current = parent;
    }
  }
}

export async function ensureUploadDirectory() {
  const configuredDirectory = process.env.FINECONE_UPLOAD_DIR;
  let directory: string;

  if (configuredDirectory) {
    if (!path.isAbsolute(configuredDirectory)) {
      throw new UploadStorageConfigurationError();
    }
    directory = path.resolve(configuredDirectory);
  } else if (process.env.NODE_ENV === "production") {
    throw new UploadStorageConfigurationError();
  } else {
    directory = path.join(process.cwd(), ".data", "uploads");
  }

  const applicationRoot = await realpath(process.cwd());
  const prospectiveDirectory = await resolveWithExistingSymlinks(directory);
  const [publicDirectory, buildDirectory] = await Promise.all([
    resolveWithExistingSymlinks(path.join(applicationRoot, "public")),
    resolveWithExistingSymlinks(path.join(applicationRoot, ".next")),
  ]);
  assertOutsideApplicationAssets(
    prospectiveDirectory,
    publicDirectory,
    buildDirectory
  );

  await mkdir(directory, { recursive: true, mode: 0o700 });
  const resolvedDirectory = await realpath(
    /* turbopackIgnore: true */ directory
  );
  assertOutsideApplicationAssets(
    resolvedDirectory,
    publicDirectory,
    buildDirectory
  );

  const directoryStats = await lstat(resolvedDirectory);
  if (!directoryStats.isDirectory() || directoryStats.isSymbolicLink()) {
    throw new UploadStorageConfigurationError();
  }
  if (process.platform !== "win32") {
    await chmod(resolvedDirectory, 0o700);
  }

  return resolvedDirectory;
}

export async function saveProcessedImage(buffer: Buffer) {
  const directory = await ensureUploadDirectory();
  const filename = `${randomUUID()}.webp`;
  const filePath = path.join(directory, filename);
  const fileHandle = await open(
    filePath,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
    0o600
  );

  try {
    await fileHandle.writeFile(buffer);
  } catch (error) {
    await fileHandle.close();
    throw error;
  }
  await fileHandle.close();

  return { filename, url: `/uploads/${filename}` };
}

export async function openStoredImage(filename: string): Promise<{
  fileHandle: FileHandle;
  size: number;
  lastModified: Date;
} | null> {
  if (!isUploadFilename(filename)) return null;

  const directory = await ensureUploadDirectory();
  const filePath = path.join(directory, filename);
  let pathStats;

  try {
    pathStats = await lstat(filePath, { bigint: true });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }

  if (!pathStats.isFile() || pathStats.isSymbolicLink()) return null;

  let fileHandle: FileHandle;
  try {
    fileHandle = await open(
      filePath,
      constants.O_RDONLY | (constants.O_NOFOLLOW || 0)
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error.code === "ENOENT" || error.code === "ELOOP")
    ) {
      return null;
    }
    throw error;
  }

  try {
    const fileStats = await fileHandle.stat({ bigint: true });
    if (
      !fileStats.isFile() ||
      fileStats.dev !== pathStats.dev ||
      fileStats.ino !== pathStats.ino ||
      fileStats.size < 12n
    ) {
      await fileHandle.close();
      return null;
    }

    const signature = Buffer.alloc(12);
    const { bytesRead } = await fileHandle.read(signature, 0, signature.length, 0);
    if (
      bytesRead !== signature.length ||
      signature.toString("ascii", 0, 4) !== "RIFF" ||
      signature.toString("ascii", 8, 12) !== "WEBP"
    ) {
      await fileHandle.close();
      return null;
    }

    return {
      fileHandle,
      size: Number(fileStats.size),
      lastModified: fileStats.mtime,
    };
  } catch (error) {
    await fileHandle.close();
    throw error;
  }
}
