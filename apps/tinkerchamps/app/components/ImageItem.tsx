"use client";

import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";

interface Props {
  leftSrc: string;
  rightSrc: string;
  leftAlt?: string;
  rightAlt?: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

export default function ImagePair({
  leftSrc,
  rightSrc,
  leftAlt = "Tinkerchamps experiential learning",
  rightAlt = "Tinkerchamps student innovation",
  index,
  total,
  progress,
}: Props) {
  const overlapFactor = 0.5;
  const segment = 1 / total;

  const rawStart = index * segment * overlapFactor;
  const rawEnd = rawStart + segment;

  const fullRawLength = (total - 1) * segment * overlapFactor + segment;

  const start = rawStart / fullRawLength;
  const end = rawEnd / fullRawLength;
  const mid = (start + end) / 2;

  // Vertical motion
  const y = useTransform(progress, [start, end], [650, -750]);

  // Opacity
  const opacity = useTransform(
    progress,
    [start, start + 0.07, end - 0.07, end],
    [0, 1, 1, 0],
  );

  // Scale effect
  const scale = useTransform(progress, [start, mid, end], [0.85, 1, 0.9]);

  // Blur value
  const blurValue = useTransform(progress, [start, mid, end], [2, 0, 6]);

  // Convert blur number → CSS string safely
  const blur = useTransform(blurValue, (value) => `blur(${value}px)`);

  // Inward drift
  const driftLeft = useTransform(progress, [start, end], [30, -20]);
  const driftRight = useTransform(progress, [start, end], [-30, 20]);

  return (
    <>
      {/* Left */}
      <motion.div
        style={{
          y,
          opacity,
          scale,
          x: driftLeft,
          filter: blur,
        }}
        className="absolute left-[10%] w-64 md:w-80 aspect-4/3 rounded-2xl overflow-hidden shadow-2xl will-change-transform top-10"
      >
        <Image src={leftSrc} alt={leftAlt} fill className="object-cover" />
      </motion.div>

      {/* Right */}
      <motion.div
        style={{
          y,
          opacity,
          scale,
          x: driftRight,
          filter: blur,
        }}
        className="absolute right-[10%] w-64 md:w-80 aspect-4/3 rounded-2xl overflow-hidden shadow-2xl will-change-transform"
      >
        <Image src={rightSrc} alt={rightAlt} fill className="object-cover" />
      </motion.div>
    </>
  );
}
