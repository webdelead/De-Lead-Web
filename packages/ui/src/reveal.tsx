"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Replaces the `.reveal` / `.reveal-stagger` IntersectionObserver block that
 * every marketing site's main.js carries (deleadint, walk2lead, makerchamps,
 * corporate, dli-education). The frozen behaviour, reproduced:
 *   - observe once; on first intersection, mark revealed and unobserve
 *   - `prefers-reduced-motion` or no IntersectionObserver -> revealed immediately
 *   - load-time safety net: anything already at/near the viewport reveals now,
 *     without waiting for a scroll (covers long pages / restored scroll pos)
 *
 * This primitive only toggles a `data-revealed` attribute + (optionally) a
 * class. The actual fade/rise is the consumer's Tailwind — e.g.
 *   className="opacity-0 translate-y-6 transition-[opacity,transform] duration-700
 *              data-[revealed]:opacity-100 data-[revealed]:translate-y-0"
 * or pass `withDefaultTransition` for the common opacity+translateY case.
 */
export interface UseRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  /** Reveal only once (default true — matches every site's `unobserve`). */
  once?: boolean;
  /** Multiplier on viewport height for the mount-time "already near view" net. Default 1.25. */
  eagerViewportFactor?: number;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const {
    threshold = 0,
    rootMargin = "0px 0px -10% 0px",
    once = true,
    eagerViewportFactor = 1.25,
  } = options;
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }

    // mount-time safety net (deleadint / corporate `window.load` handler)
    if (el.getBoundingClientRect().top < window.innerHeight * eagerViewportFactor) {
      setRevealed(true);
      if (once) return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setRevealed(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootMargin, once, eagerViewportFactor, JSON.stringify(threshold)]);

  return { ref, revealed };
}

const DEFAULT_TRANSITION: CSSProperties = {
  opacity: 0,
  transform: "translateY(26px)",
  transition: "opacity 0.7s ease, transform 0.7s ease",
  willChange: "opacity, transform",
};
const DEFAULT_TRANSITION_IN: CSSProperties = { opacity: 1, transform: "none" };

export interface RevealProps extends UseRevealOptions {
  children: ReactNode;
  /** Element to render. Default "div". */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Class added when revealed (e.g. "in" / "is-visible") if you keep legacy CSS. */
  revealedClassName?: string;
  /** Apply a built-in opacity + 26px rise transition via inline styles. */
  withDefaultTransition?: boolean;
  /** Stagger direct children by this many ms each (the `.reveal-stagger` case). */
  staggerMs?: number;
}

export function Reveal({
  children,
  as,
  className,
  style,
  revealedClassName,
  withDefaultTransition = false,
  staggerMs,
  ...opts
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, revealed } = useReveal<HTMLElement>(opts);

  const base: CSSProperties = withDefaultTransition
    ? { ...DEFAULT_TRANSITION, ...(revealed ? DEFAULT_TRANSITION_IN : null) }
    : {};

  const cls =
    revealed && revealedClassName
      ? className
        ? `${className} ${revealedClassName}`
        : revealedClassName
      : className;

  return (
    <Tag
      ref={ref}
      className={cls}
      style={{ ...base, ...style }}
      data-revealed={revealed ? "" : undefined}
    >
      {staggerMs != null
        ? wrapStagger(children, staggerMs, revealed, withDefaultTransition)
        : children}
    </Tag>
  );
}

function wrapStagger(
  children: ReactNode,
  staggerMs: number,
  revealed: boolean,
  withDefaultTransition: boolean,
) {
  const arr = Array.isArray(children) ? children : [children];
  return arr.map((child, i) => {
    const delay = `${i * staggerMs}ms`;
    const s: CSSProperties = withDefaultTransition
      ? {
          ...DEFAULT_TRANSITION,
          transitionDelay: delay,
          ...(revealed ? { ...DEFAULT_TRANSITION_IN, transitionDelay: delay } : null),
        }
      : { transitionDelay: delay };
    return (
      <div key={i} style={s} data-revealed={revealed ? "" : undefined}>
        {child}
      </div>
    );
  });
}
