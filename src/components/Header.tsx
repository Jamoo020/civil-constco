"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/company", label: "Company" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Insights" },
  { href: "/careers", label: "Careers" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isCurrentPage(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <header
      className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="container flex min-h-20 items-center justify-between gap-6 py-3">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="flex shrink-0 flex-col leading-tight text-navy no-underline"
        >
          <span className="text-lg font-bold tracking-[0.04em] sm:text-xl">
            FINECON
          </span>
          <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Builders Limited
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white text-navy transition-colors hover:bg-paper xl:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" className="text-xl leading-none">
            {open ? "×" : "☰"}
          </span>
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 xl:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrentPage(item.href) ? "page" : undefined}
              className="site-nav-link"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="button-primary">
            Request a proposal
          </Link>
        </nav>

        <nav
          id="mobile-primary-navigation"
          aria-label="Mobile primary navigation"
          aria-hidden={!open}
          className={`absolute inset-x-0 top-full border-b border-line bg-white shadow-lg xl:hidden ${
            open ? "block" : "hidden"
          }`}
        >
          <div className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrentPage(item.href) ? "page" : undefined}
                tabIndex={open ? undefined : -1}
                className={`site-nav-link rounded px-3 py-3 ${
                  isCurrentPage(item.href) ? "bg-paper" : "hover:bg-paper"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              tabIndex={open ? undefined : -1}
              className="button-primary mt-3"
              onClick={() => setOpen(false)}
            >
              Request a proposal
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
