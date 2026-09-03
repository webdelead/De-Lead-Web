"use client";

import { useEffect, useState } from "react";
import CircularGallery from "./CircularGallery";
import { client, urlFor } from "../../sanity/lib/client";

export default function GallerySection() {
  const [items, setItems] = useState<{ image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(`*[_type == "gallery"] | order(order asc)`)
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            image: urlFor(item.image).url(),
          }));
          setItems(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch gallery images:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="w-full md:pb-24 flex justify-center items-center h-95 md:h-120">
        <div className="animate-spin h-8 w-8 border-4 border-[#FBC333] border-t-transparent rounded-full" />
      </section>
    );
  }

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
