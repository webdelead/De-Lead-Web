"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Stronger parallax for background
  const imageY = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  // Slower movement for content (floating feel)
  const contentY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section
      id="stats"
      ref={ref}
      className="relative overflow-hidden md:min-h-[60vh] min-h-[70vh] flex items-center"
    >
      {/* Parallax Background */}
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <Image
          src="/assets/images/statsbg.webp"
          alt="Stats background"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-150"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center text-white"
      >
        <div>
          <h3 className="text-7xl font-bold">20+</h3>
          <p className="mt-3 text-base opacity-90">Seasons Completed</p>
        </div>

        <div>
          <h3 className="text-7xl font-bold">500+</h3>
          <p className="mt-3 text-base opacity-90">Students Attended</p>
        </div>

        <div>
          <h3 className="text-7xl font-bold">50+</h3>
          <p className="mt-3 text-base opacity-90">Activities</p>
        </div>
      </motion.div>
    </section>
  );
}
