"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollColorBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollYProgress } = useScroll();

  const background = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["#562190", "#4b0c9c", "#330066", "#4b0c9c", "#330066", "#562190"],
  );

  return (
    <motion.div style={{ background }} className="min-h-screen w-full">
      {children}
    </motion.div>
  );
}
