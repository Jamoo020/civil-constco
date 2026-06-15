/**
 * SEO Metadata and Schema Generation Utilities
 */

export interface MetaConfig {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  url?: string;
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
  keywords?: string[];
}

export function buildPageMeta({
  title,
  description,
  canonical,
  image,
  keywords,
}: MetaConfig) {
  return {
    title,
    description,
    keywords,
    canonical: canonical || `https://fineconebuilders.co.ke${new URL(canonical || "/", "http://temp.com").pathname}`,
    openGraph: {
      title,
      description,
      url: canonical || "https://fineconebuilders.co.ke",
      type: "website",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      siteName: "Finecone Builders Limited",
      locale: "en_KE",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@fineconebuilders",
    },
  };
}

export function organizationSchema({
  name,
  url,
  logo,
  email,
  phone,
}: {
  name: string;
  url: string;
  logo?: string;
  email?: string;
  phone?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    email,
    telephone: phone,
    sameAs: [
      "https://www.linkedin.com/company/finecone-builders-limited",
      "https://twitter.com/fineconebuilders",
    ],
  };
}

export function serviceSchema({
  name,
  description,
  provider,
  areaServed,
  priceRange,
}: {
  name: string;
  description: string;
  provider: string;
  areaServed: string | string[];
  priceRange?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://fineconebuilders.co.ke",
    },
    areaServed: Array.isArray(areaServed)
      ? areaServed.map((area) => ({ "@type": "City", name: area }))
      : { "@type": "Country", name: areaServed },
    priceRange,
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    url,
  };
}

export function projectSchema({
  name,
  description,
  image,
  location,
  dateCompleted,
  client,
}: {
  name: string;
  description: string;
  image?: string;
  location: string;
  dateCompleted?: string;
  client?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    image,
    location: {
      "@type": "Place",
      name: location,
    },
    dateCompleted,
    creator: {
      "@type": "Organization",
      name: "Finecone Builders Limited",
    },
    client: client
      ? {
          "@type": "Organization",
          name: client,
        }
      : undefined,
  };
}

export function localBusinessSchema({
  name,
  description,
  image,
  address,
  telephone,
  email,
  url,
  serviceArea,
  priceRange,
}: {
  name: string;
  description: string;
  image?: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  telephone: string;
  email: string;
  url: string;
  serviceArea: string[];
  priceRange?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name,
    description,
    image,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    telephone,
    email,
    url,
    serviceArea: serviceArea.map((area) => ({
      "@type": "City",
      name: area,
    })),
    priceRange,
  };
}
