"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProjectGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const galleryImages = images.slice(0, 8);
  const mainImage = galleryImages[selectedIndex] ?? galleryImages[0] ?? images[0];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Project images</h2>
          <p className="text-sm text-gray-600">Browse a gallery of site photos and project details.</p>
        </div>
        {images.length > 8 ? (
          <p className="text-sm text-gray-500">Showing the first 8 images of {images.length} uploaded.</p>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="relative h-96 overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-steel/50"
        >
          <Image
            src={mainImage}
            alt={`Project image ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </button>

        <div className="grid gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative h-28 w-full overflow-hidden rounded-3xl border transition focus:outline-none focus:ring-2 focus:ring-steel/50 ${
                index === selectedIndex ? "border-steel shadow-lg" : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setModalOpen(false)}>
          <div className="relative max-h-full w-full max-w-6xl overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/60 px-3 py-2 text-sm text-white transition hover:bg-black"
              aria-label="Close image viewer"
            >
              Close
            </button>
            <div className="relative h-[70vh] w-full">
              <Image
                src={mainImage}
                alt={`Enlarged project image ${selectedIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain bg-slate-900"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
