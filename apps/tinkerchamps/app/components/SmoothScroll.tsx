"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Expose lenis to window for the booking modal to pause/resume it.
    // lenis's own `declare global Window.lenis` type is a partial options bag,
    // not the instance — assigning the real instance is the intended use.
    // @ts-expect-error — lenis package ships an incorrect Window.lenis type
    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Global click listener for same-page anchors
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link) {
        const href = link.getAttribute("href");
        
        // Handle links that start with # or are same-page hash links (e.g. /#events)
        if (href && (href.startsWith("#") || (href.startsWith("/") && href.includes("#")))) {
          const parts = href.split("#");
          const path = parts[0];
          const hash = parts[1];

          // Check if it's the current page
          const isSamePage = !path || path === window.location.pathname || path === "/";

          if (isSamePage && hash) {
            const element = document.getElementById(hash);
            if (element) {
              e.preventDefault();
              
              // Scroll with offset for fixed navbar
              lenis.scrollTo(element, { 
                offset: -100,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });

              // Update URL hash without browser jump
              if (window.location.hash !== `#${hash}`) {
                window.history.pushState(null, "", `#${hash}`);
              }
            }
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      // @ts-expect-error — lenis package ships an incorrect Window.lenis type
      delete window.lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
