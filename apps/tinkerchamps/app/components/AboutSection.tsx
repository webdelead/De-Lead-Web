"use client";

import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import ImagePair from "./ImageItem";

const images = [
  "/assets/images/Gallery/1.jpg",
  "/assets/images/Gallery/5.JPG",
  "/assets/images/Gallery/7.jpg",
  "/assets/images/Gallery/8.jpg",
  "/assets/images/Gallery/9.jpg",
  // "/assets/images/Gallery/10.jpg",
  // "/assets/images/Gallery/11.jpg",
  "/assets/images/Gallery/13.jpg",
  // "/assets/images/Gallery/14.jpg",
  // "/assets/images/Gallery/18.jpg",
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  // Create pairs dynamically (works for any number of images)
  const pairs: string[][] = [];
  for (let i = 0; i < images.length; i += 2) {
    if (images[i + 1]) {
      pairs.push([images[i], images[i + 1]]);
    }
  }

  const totalPairs = pairs.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 400, 
    damping: 40, 
    mass: 0.5 
  });

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-transparent"
      style={{ height: `${totalPairs * 120}vh` }} // cleaner height
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Center Content */}
        <div className="absolute z-20 text-center items-center justify-center max-w-3xl px-6  text-secondary-white pointer-events-none ">
          <p className="text-4xl md:text-5xl mb-2 font-semibold ">About</p>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold font-covered text-secondary-yellow mb-6">
            Tinkerchamps
          </h2>

          <p className="text- sm:text-lg lg:text-lg leading-[1.9] opacity-90 max-w-2xl mx-auto">
            In a world where AI and automation redefine every career,
            memorisation is no longer enough. Students must learn to explore
            boldly, question deeply, and innovate confidently. TinkerChamps
            brings together experiential learning, behavioural science, and
            activity-based education to build exactly those skills.
          </p>
        </div>

        {pairs.map((pair, index) => (
          <ImagePair
            key={index}
            leftSrc={pair[0]}
            rightSrc={pair[1]}
            index={index}
            total={totalPairs}
            progress={smoothProgress}
          />
        ))}
      </div>
    </section>
  );
}
