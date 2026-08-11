"use client";

import { useState } from "react";

export function ImageGallery({
  images,
  alt,
}: {
  images: { id: string }[];
  alt: string;
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl border border-navy-700 bg-navy-800 text-ink-500">
        No photo yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-navy-700 bg-navy-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/images/${images[selected].id}`}
          alt={alt}
          className="aspect-[3/4] w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === selected ? "border-gold-400" : "border-navy-700 hover:border-navy-500"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/images/${img.id}`}
                alt={`${alt} photo ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
