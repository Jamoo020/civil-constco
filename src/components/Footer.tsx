import React from "react";
import { company } from "../data/content";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-slate-900 text-slate-200">
      {/* CTA Section */}
      <div className="border-b border-slate-700 py-12 px-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">READY TO START YOUR PROJECT?</h3>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition">
              LET'S TALK
            </Link>
            <a href="tel:+254731300089" className="text-lg font-semibold text-amber-400 hover:text-amber-300">
              +254 731 300 089
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12 px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-white">{company.name}</h4>
            <p className="text-sm leading-relaxed text-slate-300">
              Design-build contractor in Mombasa — engineered residential and commercial construction with disciplined site control.
            </p>
          </div>

          {/* Navigate */}
          <div className="space-y-4">
            <h5 className="font-bold text-white text-sm tracking-widest">NAVIGATE</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/company" className="hover:text-amber-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/company" className="hover:text-amber-400 transition">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-amber-400 transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h5 className="font-bold text-white text-sm tracking-widest">CONTACT</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+254731300089" className="hover:text-amber-400 transition">
                  +254 731 300 089
                </a>
              </li>
              <li className="text-slate-300">
                Mombasa, Kenya
              </li>
              <li>
                <a href="mailto:info@coastinfrastructure.com" className="hover:text-amber-400 transition">
                  info@coastinfrastructure.com
                </a>
              </li>
              <li className="text-slate-300">
                Mon – Fri, 8:00 AM – 5:00 PM EAT
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {currentYear} {company.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-200 transition">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-200 transition">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
