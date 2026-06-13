"use client";
import React, { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/company", label: "Company" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Insights" }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white sticky top-0 z-30 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-xl font-bold transition hover:text-steel hover:underline hover:underline-offset-4"
        >
          Coast Infrastructure
        </Link>

        <button
          type="button"
          className="md:hidden rounded-md border border-gray-200 p-3 text-gray-700"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>

        <nav className={`absolute inset-x-0 top-full bg-white border-b md:static md:border-none md:bg-transparent ${open ? "block" : "hidden"} md:block`}>
          <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-end md:py-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-base text-gray-700 hover:text-steel md:inline md:px-2"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-steel px-4 py-2 text-white transition hover:bg-slate-900"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
