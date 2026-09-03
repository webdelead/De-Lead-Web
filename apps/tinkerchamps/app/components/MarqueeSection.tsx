"use client";

import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  useAnimationFrame,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const x = useMotionValue(0);

  const direction = useRef(reverse ? -1 : 1);
  const targetDirection = useRef(reverse ? -1 : 1);

  const { scrollY } = useScroll();

  // detect scroll direction
  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = scrollY.getPrevious() ?? 0;

    if (current > prev) {
      targetDirection.current = reverse ? -1 : 1;
    } else {
      targetDirection.current = reverse ? 1 : -1;
    }
  });

  useAnimationFrame((_, delta) => {
    const speed = 80; // adjust speed here

    // smooth direction interpolation
    direction.current += (targetDirection.current - direction.current) * 0.08;

    const move = direction.current * speed * (delta / 1000);

    let next = x.get() + move;

    // seamless reset outside viewport
    if (next < -1500) next = 0;
    if (next > 0) next = -1500;

    x.set(next);
  });

  return (
    <div className="overflow-hidden">
      <motion.div style={{ x }} className="flex w-max items-center gap-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="text-white md:text-7xl text-4xl font-bold">
              Be Bold.
            </span>

            <div className="relative  md:w-50 md:h-30 w-25 h-15 rounded-xl overflow-hidden">
              <Image
                src="/assets/TCLogo.webp"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <span className="text-white md:text-7xl text-4xl font-bold">
              Be Curious.
            </span>

            <div className="relative md:w-50 md:h-30 w-25 h-15 rounded-xl overflow-hidden">
              <Image
                src="/assets/images/Gallery/5.JPG"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <span className="text-white md:text-7xl text-4xl font-bold">
              Be a Tinkerchampion.
            </span>
            <div className="relative  md:w-50 md:h-30 w-25 h-15 rounded-xl overflow-hidden">
              <Image
                src="/assets/images/Gallery/1.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function MarqueeSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="md:mb-12 mb-6">
        <MarqueeRow />
      </div>

      <MarqueeRow reverse />
    </section>
  );
}
