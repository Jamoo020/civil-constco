import { services } from "./content";

const serviceSlugs = new Set(services.map(({ slug }) => slug));

if (services.length !== 6) {
  throw new Error(`The service catalogue must contain exactly six services; found ${services.length}.`);
}

if (serviceSlugs.size !== services.length) {
  throw new Error("The service catalogue contains duplicate service slugs.");
}

export const serviceCatalog = services;

export function getRelatedServices(slug: (typeof services)[number]["slug"]) {
  if (!serviceSlugs.has(slug)) {
    throw new Error(`Cannot find related services for unknown service "${slug}".`);
  }

  return services.filter((service) => service.slug !== slug);
}
