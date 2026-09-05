"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

export interface ScrollStackProps {
  /** Each direct child becomes one stacked card. */
  children: ReactNode;
  /** Viewport px from the top where cards pin. Default 140. */
  pinTop?: number;
  /** Px each successive card sits lower, building the visible fanned deck. Default 14. */
  step?: number;
  /** Stop increasing the per-card offset past this many cards (keeps a long list on-screen). Default 6. */
  stepCap?: number;
  /** Scroll distance between one card pinning and the next, in vh. Default 44. */
  gapVh?: number;
  /** Trailing scroll room after the last card, in vh — small = the deck leaves with the section. Default 8. */
  tailVh?: number;
  /** Alternating deck tilt in degrees; 0 disables. Default 2.3. */
  tilt?: number;
  /** Below this viewport width the stack collapses to a plain vertical list. Default 1080. */
  collapseBelow?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Scroll-driven card stack: every child pins at the SAME sticky offset and is
 * fanned into a visible deck with a transform (not a per-card `top`), so all
 * cards un-stick on the same frame and the whole deck scrolls out together —
 * no card sliding past another. As a card rises to the pin line it scales
 * 0.94 -> 1. Fully self-contained (no external CSS); honours
 * `prefers-reduced-motion` and collapses to a plain list on small screens.
 *
 * Extracted from the De' Lead International "Voices" section.
 */
export function ScrollStack({
  children,
  pinTop = 140,
  step = 14,
  stepCap = 6,
  gapVh = 44,
  tailVh = 8,
  tilt = 2.3,
  collapseBelow = 1080,
  className,
  style,
}: ScrollStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children).filter(isValidElement);
  const count = items.length;

  const restTilt = (i: number) => (tilt ? (i % 2 === 0 ? -tilt : tilt) : 0);
  const restOffset = (i: number) => Math.min(i, stepCap) * step;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-scrollstack-card]"),
    );
    if (!cards.length || reduce) return;

    const offsets = cards.map((_, i) => restOffset(i));
    const tilts = cards.map((_, i) => restTilt(i));
    let raf = 0;

    const syncHeights = () => {
      cards.forEach((c) => (c.style.height = ""));
      if (window.innerWidth <= collapseBelow) return;
      const tallest = Math.max(
        ...cards.map((c) => c.getBoundingClientRect().height),
      );
      cards.forEach((c) => (c.style.height = `${tallest}px`));
    };

    const paint = () => {
      raf = 0;
      const desktop = window.innerWidth > collapseBelow;
      const vh = window.innerHeight || 1;
      cards.forEach((card, i) => {
        if (!desktop) {
          card.style.transform = "";
          return;
        }
        const top = card.getBoundingClientRect().top;
        let p = 1 - (top - pinTop - offsets[i]!) / vh;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        p = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const s = (0.94 + p * 0.06).toFixed(4);
        card.style.transform = `translateY(${offsets[i]}px) rotate(${tilts[i]}deg) scale(${s})`;
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onResize = () => {
      syncHeights();
      paint();
    };

    syncHeights();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      cards.forEach((c) => {
        c.style.transform = "";
        c.style.height = "";
      });
    };
  }, [pinTop, step, stepCap, tilt, collapseBelow, count]);

  return (
    <div
      ref={rootRef}
      data-scrollstack-root=""
      className={className}
      style={{ position: "relative", ...style }}
    >
      <style>{`
        @media (max-width:${collapseBelow}px){
          [data-scrollstack-root] [data-scrollstack-card]{
            position:static!important;transform:none!important;height:auto!important;
            margin-bottom:20px;
          }
          [data-scrollstack-root] [data-scrollstack-gap]{display:none!important;}
        }
      `}</style>
      {items.map((child, i) => (
        <div key={i}>
          <div
            data-scrollstack-card=""
            style={{
              position: "sticky",
              top: pinTop,
              zIndex: i + 1,
              transformOrigin: "50% 0",
              willChange: "transform",
              transform: `translateY(${restOffset(i)}px) rotate(${restTilt(i)}deg)`,
            }}
          >
            {child}
          </div>
          {/* Every item, including the last, gets its own trailing spacer
              *inside* its own wrapper — that's what actually gives a sticky
              card room to stay stuck before it releases (a sticky element's
              "stuck" duration comes from its own containing block's height,
              not from anything after that block). The last item used to get
              none at all (only `i < count - 1` rendered one), so it had
              essentially zero room to stick and immediately scrolled away —
              this is what read as "the last card doesn't stack like the
              others". `tailVh` is deliberately smaller than `gapVh` by
              default (a full gap's worth of trailing empty page would be
              excessive once nothing needs to cover this card), but it must
              be > 0 for the last card to stick at all. */}
          <div
            data-scrollstack-gap=""
            aria-hidden
            style={{ height: `${i < count - 1 ? gapVh : tailVh}vh`, pointerEvents: "none" }}
          />
        </div>
      ))}
    </div>
  );
}
