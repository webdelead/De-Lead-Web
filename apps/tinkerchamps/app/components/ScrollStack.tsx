"use client";

import React, { useEffect, useRef } from "react";

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollStack({
  children,
  className = "",
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll(".scroll-stack-card")
    ) as HTMLElement[];

    if (!cards.length) return;

    let ticking = false;

    // HEIGHT SYNC FUNCTION
    const syncHeights = () => {
      // Reset heights first
      cards.forEach((card) => {
        card.style.height = "auto";
      });

      // Measure tallest
      const maxHeight = Math.max(
        ...cards.map((card) => card.getBoundingClientRect().height)
      );

      // Apply equal height
      cards.forEach((card) => {
        card.style.height = `${maxHeight}px`;
      });
    };

    // SCROLL ANIMATION
    const updateCards = () => {
      const viewportHeight = window.innerHeight;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();

        let progress = Math.min(
          Math.max((viewportHeight - rect.top) / viewportHeight, 0),
          1
        );

        // smooth easing
        progress = 1 - Math.pow(1 - progress, 3);

        const translateY = (1 - progress) * 18;
        const scale = 0.94 + progress * 0.06;

        card.style.transform = `translateY(${translateY}px) scale(${scale})`;
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateCards);
        ticking = true;
      }
    };

    // RESIZE HANDLER
    const handleResize = () => {
      syncHeights();
      updateCards();
    };

    // INIT
    syncHeights();
    updateCards();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center ${className}`}
    >
      {children}
    </div>
  );
}

// ITEM COMPONENT
interface ScrollStackItemProps {
  children: React.ReactNode;
  index: number;
}

export function ScrollStackItem({
  children,
  index,
}: ScrollStackItemProps) {
  return (
    <div
      className="
        scroll-stack-card
        sticky
        w-full
        max-w-6xl
        mx-auto
        mb-[60vh]
        transition-transform
        duration-300
        ease-out
        will-change-transform
      "
      style={{
        top: `${100 + index * 10}px`,
        zIndex: index + 1,
      }}
    >
      {children}
    </div>
  );
}
