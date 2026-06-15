import React from "react";
import ContactForm from "../../src/components/ContactForm";

export const metadata = {
  title: "Contact | Finecone Builders Limited",
  description: "Get in touch with Finecone Builders Limited for civil engineering, coastal construction and regional delivery across Kenya.",
};

export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Contact</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ContactForm />

        <aside className="rounded-3xl border border-gray-200 bg-slate-50 p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Service regions</h3>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li>
              <strong>Kilifi</strong> – Headquartered in Kilifi with coastal construction delivery, drainage, roads and site engineering.
            </li>
            <li>
              <strong>Mombasa</strong> – Local delivery capacity for port infrastructure, coastal roadworks and commercial development.
            </li>
            <li>
              <strong>Malindi</strong> – Regional support for shoreline protection, tourism corridor projects and community access.
            </li>
          </ul>
          <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-gray-700 shadow-sm">
            <p className="font-semibold">Phone</p>
            <p>+254 700 000 000</p>
            <p className="mt-4 font-semibold">Email</p>
            <p>hello@coast-infrastructure.co.ke</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
