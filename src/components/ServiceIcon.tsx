import React from "react";

type Props = {
  slug: string;
  className?: string;
};

export default function ServiceIcon({ slug, className = "h-12 w-12 text-steel" }: Props) {
  // Simple, original SVG icons for common service categories
  switch (slug) {
    case "civil-engineering":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 7V5a1 1 0 011-1h2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "road-construction":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 7l-2 2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "bridge-and-structural-works":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 17h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 17V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 17V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2 9c4-3 8-3 10 0s6 3 10 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "coastal-and-marine-works":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 16c3-2 6-2 9 0s6 2 9 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "drainage-and-flood-management":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 12c1.5-1 3-1 6 0s4.5 1 6 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "earthworks-and-site-preparation":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 13l2-6h6l2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "utilities-water-and-sewer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 14c1 2 3 3 5 3s4-1 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "geotechnical-and-foundations":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="16" height="12" stroke="currentColor" strokeWidth="1.5" rx="2" />
          <path d="M4 18h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case "environmental-and-social-management":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l3 6-3 6-3-6 3-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "survey-and-design-services":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "contract-management-and-ppc":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 9h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case "asphalt-and-paving":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="4" y="6" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case "maintenance-and-asset-management":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
