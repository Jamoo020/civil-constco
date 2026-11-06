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

export const PROJECT_FIELD_LIMITS = {
  title: 160,
  slug: 160,
  location: 160,
  overview: 5000,
  type: 100,
  client: 160,
  impact: 3000,
  imageUrl: 2048,
  scopeItems: 30,
  scopeItem: 300,
  galleryImages: 20,
} as const;

export class ProjectDataError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ProjectDataError";
  }
}

export function normalizeProjectSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function requiredString(
  value: unknown,
  name: string,
  maxLength: number
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new ProjectDataError(`${name} is required.`, 400);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new ProjectDataError(`${name} must be ${maxLength} characters or fewer.`, 400);
  }
  return trimmed;
}

function optionalString(
  value: unknown,
  name: string,
  maxLength: number
): string {
  if (value === undefined) return "";
  if (typeof value !== "string") {
    throw new ProjectDataError(`${name} must be a string.`, 400);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new ProjectDataError(`${name} must be ${maxLength} characters or fewer.`, 400);
  }
  return trimmed;
}

function parseYear(value: unknown) {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new ProjectDataError("Year must be an integer between 1800 and 2100.", 400);
  }
  if (typeof value === "string" && !/^\d{1,4}$/.test(value.trim())) {
    throw new ProjectDataError("Year must be an integer between 1800 and 2100.", 400);
  }
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1800 || year > 2100) {
    throw new ProjectDataError("Year must be an integer between 1800 and 2100.", 400);
  }
  return year;
}

function parseLines(
  value: unknown,
  name: string,
  maxItems: number,
  maxItemLength: number
): string[] {
  if (typeof value === "string") {
    value = value.split(/\r?\n/);
  }
  if (!Array.isArray(value)) {
    throw new ProjectDataError(`${name} must be a list of strings.`, 400);
  }
  if (value.some((item) => typeof item !== "string")) {
    throw new ProjectDataError(`${name} must contain only strings.`, 400);
  }
  const items = (value as string[])
    .map((item) => item.trim())
    .filter(Boolean);
  if (items.length > maxItems) {
    throw new ProjectDataError(`${name} may contain at most ${maxItems} items.`, 400);
  }
  if (items.some((item) => item.length > maxItemLength)) {
    throw new ProjectDataError(
      `${name} items must be ${maxItemLength} characters or fewer.`,
      400
    );
  }
  return items;
}

function validateImageUrl(value: string, fieldName: string) {
  if (!value) return;
  if (value.length > PROJECT_FIELD_LIMITS.imageUrl) {
    throw new ProjectDataError(
      `${fieldName} must be ${PROJECT_FIELD_LIMITS.imageUrl} characters or fewer.`,
      400
    );
  }
  if (/^\/uploads\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/.test(value)) {
    return;
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ProjectDataError(`${fieldName} must be an HTTP, HTTPS, or stored upload URL.`, 400);
  }
  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    !url.hostname ||
    url.username ||
    url.password
  ) {
    throw new ProjectDataError(`${fieldName} must be an HTTP, HTTPS, or stored upload URL.`, 400);
  }
}

export function validateProject(
  value: unknown,
  options: { slug?: string } = {}
): Project {
  if (!isRecord(value)) {
    throw new ProjectDataError("Invalid request payload.", 400);
  }

  const allowedFields = new Set([
    "slug",
    "title",
    "location",
    "year",
    "overview",
    "type",
    "client",
    "featured",
    "impact",
    "image",
    "images",
    "scope",
  ]);
  if (Object.keys(value).some((key) => !allowedFields.has(key))) {
    throw new ProjectDataError("Request contains an unsupported field.", 400);
  }

  const title = requiredString(value.title, "Project title", PROJECT_FIELD_LIMITS.title);
  const location = requiredString(value.location, "Location", PROJECT_FIELD_LIMITS.location);
  const overview = requiredString(value.overview, "Overview", PROJECT_FIELD_LIMITS.overview);
  const type = requiredString(value.type, "Project type", PROJECT_FIELD_LIMITS.type);
  const year = parseYear(value.year);
  const client = optionalString(value.client, "Client", PROJECT_FIELD_LIMITS.client);
  const impact = optionalString(value.impact, "Impact", PROJECT_FIELD_LIMITS.impact);

  if (typeof value.featured !== "boolean") {
    throw new ProjectDataError("Featured must be a boolean.", 400);
  }

  const bodySlug =
    value.slug === undefined
      ? undefined
      : requiredString(value.slug, "Project slug", PROJECT_FIELD_LIMITS.slug);
  if (options.slug && bodySlug && bodySlug !== options.slug) {
    throw new ProjectDataError("Project slug cannot be changed while editing.", 400);
  }
  const slug =
    options.slug ??
    bodySlug ??
    normalizeProjectSlug(title);
  if (
    !slug ||
    slug.length > PROJECT_FIELD_LIMITS.slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    throw new ProjectDataError("Project title must produce a valid project slug.", 400);
  }

  const image = optionalString(value.image, "Primary image URL", PROJECT_FIELD_LIMITS.imageUrl);
  validateImageUrl(image, "Primary image URL");
  const images =
    value.images === undefined
      ? []
      : parseLines(
          value.images,
          "Gallery images",
          PROJECT_FIELD_LIMITS.galleryImages,
          PROJECT_FIELD_LIMITS.imageUrl
        );
  images.forEach((url) => validateImageUrl(url, "Gallery image URL"));
  const scope =
    value.scope === undefined
      ? []
      : parseLines(
          value.scope,
          "Scope",
          PROJECT_FIELD_LIMITS.scopeItems,
          PROJECT_FIELD_LIMITS.scopeItem
        );
  if (scope.length === 0) {
    throw new ProjectDataError("At least one scope item is required.", 400);
  }

  return {
    slug,
    title,
    location,
    year,
    overview,
    type,
    client,
    featured: value.featured,
    impact,
    image: image || undefined,
    images,
    scope,
  };
}
