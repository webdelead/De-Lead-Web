"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();

  const yText = useTransform(scrollY, [0, 600], [0, -180]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/assets/images/herobanner.webp"
        alt="Tinker Champs"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* HERO CONTENT */}
      <div className="relative z-10 flex items-end h-full pb-20">
        <div className="w-full px-6 sm:px-8 md:px-12">
          {/* LEFT TEXT */}
          <motion.div style={{ y: yText, opacity }} className="text-white">
            <h1 className="text-4xl  md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
              REWIRING YOUNG MINDS <br />
              <span className="block lg:inline">
                FOR A LIMITLESS{" "}
                <span className="font-covered text-secondary-yellow text-6xl md:text-6xl lg:text-7xl font-bold">
                  Future
                </span>
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-200 max-w-2xl">
              A 3-day premium experiential learning camp that helps students
              from 6th–12th grade think sharper, lead better, and design their
              own future.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
