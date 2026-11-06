import { createHash, randomBytes, timingSafeEqual } from "crypto";
import Database from "better-sqlite3";
import { chmodSync, mkdirSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const SESSION_TTL_SECONDS = 8 * 60 * 60;
const sessionCookieName =
  process.env.NODE_ENV === "production" ? "__Host-admin_session" : "admin_session";

export type AdminSession = {
  tokenHash: string;
  csrfToken: string;
  expiresAt: number;
};

type AuthorizationResult =
  | { session: AdminSession }
  | { response: NextResponse };

let database: Database.Database | undefined;

function getDatabase() {
  if (database) return database;

  const databasePath =
    process.env.ADMIN_SECURITY_DB_PATH ||
    path.join(process.cwd(), ".data", "admin-security.sqlite");
  mkdirSync(path.dirname(databasePath), { recursive: true });

  database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      csrf_token TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_rate_limits (
      bucket_hash TEXT PRIMARY KEY,
      window_started_at INTEGER NOT NULL,
      attempts INTEGER NOT NULL
    );
  `);
  if (process.platform !== "win32") chmodSync(databasePath, 0o600);

  return database;
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isAdminConfigured() {
  const password = process.env.ADMIN_PASSWORD;
  return typeof password === "string" && password.length >= 16;
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword || configuredPassword.length < 16) return false;

  const submittedHash = createHash("sha256").update(password).digest();
  const configuredHash = createHash("sha256").update(configuredPassword).digest();
  return timingSafeEqual(submittedHash, configuredHash);
}

export function isAllowedAdminOrigin(request: NextRequest) {
  const configuredOrigin = process.env.ADMIN_ORIGIN;
  if (process.env.NODE_ENV === "production" && !configuredOrigin) return false;

  try {
    const expectedOrigin = new URL(
      configuredOrigin || request.nextUrl.origin
    ).origin;
    const requestOrigin = request.headers.get("origin");
    return requestOrigin !== null && new URL(requestOrigin).origin === expectedOrigin;
  } catch {
    return false;
  }
}

export function getClientRateLimitKey(request: NextRequest) {
  const clientAddress =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown";
  return hash(clientAddress);
}

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
) {
  const db = getDatabase();
  const bucketHash = hash(key);
  const now = Date.now();
  const select = db.prepare(
    "SELECT window_started_at, attempts FROM admin_rate_limits WHERE bucket_hash = ?"
  );
  const insertOrReplace = db.prepare(
    `INSERT INTO admin_rate_limits (bucket_hash, window_started_at, attempts)
     VALUES (?, ?, 1)
     ON CONFLICT(bucket_hash) DO UPDATE SET window_started_at = excluded.window_started_at, attempts = 1`
  );
  const increment = db.prepare(
    "UPDATE admin_rate_limits SET attempts = attempts + 1 WHERE bucket_hash = ?"
  );

  const result = db.transaction(() => {
    const current = select.get(bucketHash) as
      | { window_started_at: number; attempts: number }
      | undefined;

    if (!current || now - current.window_started_at >= windowMs) {
      insertOrReplace.run(bucketHash, now);
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.attempts >= limit) {
      const retryAfterSeconds = Math.ceil(
        (current.window_started_at + windowMs - now) / 1000
      );
      return { allowed: false, retryAfterSeconds };
    }

    increment.run(bucketHash);
    return { allowed: true, retryAfterSeconds: 0 };
  })();

  db.prepare("DELETE FROM admin_rate_limits WHERE window_started_at < ?").run(
    now - 24 * 60 * 60 * 1000
  );
  return result;
}

export function clearRateLimit(key: string) {
  getDatabase()
    .prepare("DELETE FROM admin_rate_limits WHERE bucket_hash = ?")
    .run(hash(key));
}

export function createAdminSession() {
  const db = getDatabase();
  const token = randomBytes(32).toString("base64url");
  const csrfToken = randomBytes(32).toString("base64url");
  const tokenHash = hash(token);
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;

  db.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(Date.now());
  db.prepare(
    "INSERT INTO admin_sessions (token_hash, csrf_token, created_at, expires_at) VALUES (?, ?, ?, ?)"
  ).run(tokenHash, csrfToken, Date.now(), expiresAt);

  return { token, tokenHash, csrfToken, expiresAt };
}

function readSession(request: NextRequest): AdminSession | null {
  const token = request.cookies.get(sessionCookieName)?.value;
  if (!token) return null;

  const tokenHash = hash(token);
  const row = getDatabase()
    .prepare(
      "SELECT token_hash, csrf_token, expires_at FROM admin_sessions WHERE token_hash = ?"
    )
    .get(tokenHash) as
    | { token_hash: string; csrf_token: string; expires_at: number }
    | undefined;

  if (!row) return null;
  if (row.expires_at <= Date.now()) {
    getDatabase()
      .prepare("DELETE FROM admin_sessions WHERE token_hash = ?")
      .run(tokenHash);
    return null;
  }

  return {
    tokenHash: row.token_hash,
    csrfToken: row.csrf_token,
    expiresAt: row.expires_at,
  };
}

function csrfMatches(expectedToken: string, received: string | null) {
  if (!received) return false;
  const expectedBuffer = Buffer.from(hash(expectedToken), "hex");
  const receivedBuffer = Buffer.from(hash(received), "hex");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function authorizeAdminRequest(
  request: NextRequest,
  requireCsrf = false
): AuthorizationResult {
  try {
    const session = readSession(request);
    if (!session) {
      return {
        response: NextResponse.json(
          { error: "Authentication required." },
          { status: 401 }
        ),
      };
    }

    if (
      requireCsrf &&
      (!isAllowedAdminOrigin(request) ||
        !csrfMatches(session.csrfToken, request.headers.get("x-csrf-token")))
    ) {
      return {
        response: NextResponse.json(
          { error: "Request could not be verified." },
          { status: 403 }
        ),
      };
    }

    return { session };
  } catch {
    console.error("Admin security storage is unavailable.");
    return {
      response: NextResponse.json(
        { error: "Admin service is temporarily unavailable." },
        { status: 503 }
      ),
    };
  }
}

export function invalidateAdminSession(session: AdminSession) {
  getDatabase()
    .prepare("DELETE FROM admin_sessions WHERE token_hash = ?")
    .run(session.tokenHash);
}

export function setAdminSessionCookie(
  response: NextResponse,
  token: string
) {
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
