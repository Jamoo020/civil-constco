import React from "react";
import Link from "next/link";
import { posts } from "../../src/data/content";

export const metadata = {
  title: "Insights | Coast Infrastructure",
  description: "Read the latest thinking on coastal infrastructure, road resilience and civil engineering delivery in Kenya.",
};

export const dynamic = "force-static";

export default function BlogPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <article key={p.slug} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl font-semibold">{p.title}</h3>
            <p className="mt-3 text-gray-700">{p.excerpt}</p>
            <Link href={`/blog/${p.slug}`} className="mt-6 inline-flex items-center text-steel font-semibold hover:underline">
              Read the full insight
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
