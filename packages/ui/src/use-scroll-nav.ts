"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * The hide-on-scroll-down / show-on-scroll-up + "compact past N" nav behaviour
 * shared by all five marketing sites' main.js. Markup and class names stay
 * per-site — this hook only returns the booleans to drive them.
 *
 *   deleadint    scrolledAfter 40, hideAfter = nav height
 *   walk2lead    scrolledAfter 10, pastHero gate (height - 80), then hide/show
 *   makerchamps  pastHero via hero bottom <= nav height (+ caller swaps logo)
 *   corporate    scrolledAfter 30, hideAfter 120
 *   dli-education scrolledAfter 20, hideAfter 140, needs 4px up-travel to show
 */
export interface UseScrollNavOptions {
  /** `scrolled` flips true past this Y. Default 20. */
  scrolledAfter?: number;
  /** `hidden` can only become true past this Y. Number, or "navHeight". Default "navHeight". */
  hideAfter?: number | "navHeight";
  /** Minimum upward travel (px) before `hidden` clears. dli-education uses 4. Default 0. */
  revealDelta?: number;
  /** Ref to the nav element (needed for hideAfter:"navHeight" and heroMode:"bottom"). */
  navRef?: RefObject<HTMLElement | null>;
  /** Ref to the hero element to compute `pastHero`. */
  heroRef?: RefObject<HTMLElement | null>;
  /** "bottom" = hero bottom rect <= nav height (makerchamps). "height" = scrollY >= hero.offsetHeight - offset (walk2lead). */
  heroMode?: "bottom" | "height";
  /** Offset for heroMode:"height". walk2lead uses 80. Default 0. */
  heroHeightOffset?: number;
  /** When true (menu open) `hidden` is forced false. */
  menuOpen?: boolean;
  /** Force `hidden` false whenever scrollY <= 0 (dli-education). Default true. */
  showAtTop?: boolean;
}

export interface ScrollNavState {
  scrolled: boolean;
  hidden: boolean;
  pastHero: boolean;
}

export function useScrollNav(options: UseScrollNavOptions = {}): ScrollNavState {
  const {
    scrolledAfter = 20,
    hideAfter = "navHeight",
    revealDelta = 0,
    navRef,
    heroRef,
    heroMode = "height",
    heroHeightOffset = 0,
    menuOpen = false,
    showAtTop = true,
  } = options;

  const [state, setState] = useState<ScrollNavState>({
    scrolled: false,
    hidden: false,
    pastHero: false,
  });
  const lastY = useRef(0);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const navH = navRef?.current?.offsetHeight ?? 72;
      const threshold = hideAfter === "navHeight" ? navH : hideAfter;

      let pastHero = false;
      if (heroRef?.current) {
        pastHero =
          heroMode === "bottom"
            ? heroRef.current.getBoundingClientRect().bottom <= navH
            : y >= heroRef.current.offsetHeight - heroHeightOffset;
      }

      setState((prev) => {
        let hidden = prev.hidden;
        if (menuOpenRef.current || (showAtTop && y <= 0)) {
          hidden = false;
        } else if (y > lastY.current && y > threshold) {
          hidden = true;
        } else if (y < lastY.current - revealDelta) {
          hidden = false;
        }
        const scrolled = y > scrolledAfter;
        if (
          scrolled === prev.scrolled &&
          hidden === prev.hidden &&
          pastHero === prev.pastHero
        ) {
          return prev;
        }
        return { scrolled, hidden, pastHero };
      });
      lastY.current = y;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [
    scrolledAfter,
    hideAfter,
    revealDelta,
    heroMode,
    heroHeightOffset,
    showAtTop,
    navRef,
    heroRef,
  ]);

  return state;
}
