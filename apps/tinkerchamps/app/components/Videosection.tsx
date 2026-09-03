"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

import { useInView } from "react-intersection-observer";

/* Vimeo Player (clean embed) */
function VimeoPlayer() {
  return (
    <div className="relative w-full h-full bg-black">
      <iframe
        src="https://player.vimeo.com/video/1177626363?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&controls=1"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Tinkerchamps Video"
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}

/* Video Section */
export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
    triggerOnce: true,
  });

  /**
   * Scroll animation (desktop)
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smoother progress handling
  const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.5, 0.8, 1]);
  const borderRadius = useTransform(scrollYProgress, [0.3, 0.6, 0.7], [28, 16, 0]);

  // Use raw values if performance is an issue, or keep soft springs
  const springScale = useSpring(scale, { stiffness: 60, damping: 20, mass: 0.8 });
  const springRadius = useSpring(borderRadius, { stiffness: 60, damping: 20, mass: 0.8 });

  return (
    <div ref={inViewRef}>
      {/* ================= MOBILE + TABLET ================= */}
      <section className="px-4 py-16 lg:hidden">
        <div className="w-full">
          <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg bg-amber-50">
            {inView && <VimeoPlayer />}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ================= DESKTOP (ZOOM ANIMATION) ================= */}
      <section ref={sectionRef} className="relative hidden lg:block h-[200vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{
              scale: springScale,
              borderRadius: springRadius,
              willChange: "transform, border-radius",
            }}
            className="
              relative
              w-[90%]
              max-w-7xl
              aspect-video
              overflow-hidden
              shadow-2xl
              bg-amber-50
              transform-gpu
            "
          >
            {inView && <VimeoPlayer />}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
