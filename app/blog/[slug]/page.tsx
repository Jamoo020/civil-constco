import React from "react";
import { notFound } from "next/navigation";
import { posts } from "../../../src/data/content";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const post = posts.find((p) => p.slug === resolved.slug);
  if (!post) {
    return { title: "Insight not found" };
  }

  return {
    title: `${post.title} | Insights | Coast Infrastructure`,
    description: post.excerpt,
  };
}

export const dynamic = "force-static";

export default async function Post({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = await params;
  const post = posts.find((p) => p.slug === resolved.slug);
  if (!post) return notFound();
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-gray-500">Published {post.date}</p>
      <div className="mt-6 space-y-6 text-gray-800">
        <p>{post.content}</p>
      </div>
    </div>
  );
}
