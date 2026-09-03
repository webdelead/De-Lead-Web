"use client";

import CircularGallery from "./CircularGallery";

export default function GallerySection({ items = [] }: { items?: { image: string }[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="w-full md:pb-24">
      <div className="h-95 md:h-120 w-full bg-transparent">
        <CircularGallery items={items} bend={2} />
      </div>
    </section>
  );
}
