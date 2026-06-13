import React from "react";

export const dynamic = "force-static";

export default function CareersPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Careers</h1>
      <p className="mb-6">Join a safety-first, professional engineering team. Graduate programs and experienced roles available.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded">Open Positions placeholder</div>
        <div className="p-6 border rounded">Graduate Opportunities placeholder</div>
      </div>
    </div>
  );
}
