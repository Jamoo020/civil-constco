"use client";
import React from "react";

export default function MapInteractive() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-gray-200 shadow-sm">
      <iframe
        title="Kilifi head office location"
        src="https://www.google.com/maps?q=Kilifi+Kenya&output=embed"
        className="h-80 w-full"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
