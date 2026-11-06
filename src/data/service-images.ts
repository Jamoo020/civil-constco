import type { services } from "./content";

type ServiceSlug = (typeof services)[number]["slug"];

export const serviceImages: Record<
  ServiceSlug,
  { src: string; alt: string; fit?: "cover" | "contain" }
> = {
  "architectural-design": {
    src: "/images/services/architectural-design.jpg",
    alt: "Close-up photograph of an architectural blueprint with a building floor plan",
  },
  "building-construction": {
    src: "/images/services/building-construction.jpg",
    alt: "Low-angle photograph of a multi-storey building under construction",
    fit: "contain",
  },
  "general-construction": {
    src: "/images/services/general-construction.jpg",
    alt: "Photograph of an unfinished building interior during construction",
  },
  "interior-design": {
    src: "/images/services/interior-design.jpg",
    alt: "Photograph of a finished contemporary living room interior",
  },
  "site-supervision": {
    src: "/images/services/site-supervision.jpg",
    alt: "Photograph of a construction professional working at an active building site",
  },
  "structural-design": {
    src: "/images/services/structural-design.jpg",
    alt: "Black-and-white photograph of concrete foundations at a construction site",
  },
};
