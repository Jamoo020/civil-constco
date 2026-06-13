import React from "react";
import { testimonials } from "../data/content";

export default function TestimonialSection() {
  return (
    <section className="container py-16 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Trusted By Engineers & Developers</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our reputation is built on disciplined execution, transparent processes, and consistent results across diverse projects and regions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <article
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col"
          >
            <div className="flex items-start gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-sand"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-700 leading-relaxed flex-1">
              "{testimonial.quote}"
            </blockquote>
            <footer className="border-t border-gray-200 pt-4 space-y-1">
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-sm text-gray-600">{testimonial.location}</p>
              {testimonial.verified && (
                <div className="flex items-center gap-1 text-xs text-coast font-medium">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
                  Verified Partner
                </div>
              )}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
