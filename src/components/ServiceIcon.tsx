import React from "react";

type Props = {
  slug: string;
  className?: string;
};

const iconPaths: Record<string, React.ReactNode> = {
  "architectural-design": (
    <>
      <path d="M3 10 12 3l9 7" />
      <path d="M5 9v12h14V9M9 21v-7h6v7" />
    </>
  ),
  "building-construction": (
    <>
      <path d="M4 21V8l8-5 8 5v13M2 21h20" />
      <path d="M8 11h2m4 0h2m-8 4h2m4 0h2" />
    </>
  ),
  "general-construction": (
    <>
      <path d="M4 21V9l8-6 8 6v12M2 21h20" />
      <path d="M9 21v-6h6v6M8 10h2m4 0h2" />
    </>
  ),
  "interior-design": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M12 4v16M3 12h9m2-4h3m-3 4h4m-4 4h3" />
    </>
  ),
  "site-supervision": (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  "structural-design": (
    <>
      <path d="M3 5h18M5 5v16m14-16v16M3 21h18M5 10h14m-14 6h14" />
    </>
  ),
};

export default function ServiceIcon({
  slug,
  className = "h-12 w-12 text-steel",
}: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconPaths[slug] ?? iconPaths["building-construction"]}
      </g>
    </svg>
  );
}
