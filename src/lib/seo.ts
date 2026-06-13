export function buildMeta({ title, description, canonical, image }: { title: string; description: string; canonical?: string; image?: string }) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      images: image ? [image] : []
    },
    twitter: { card: "summary_large_image", title, description }
  };
}

export function organizationSchema({ name, url, logo }: { name: string; url: string; logo?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo
  };
}
