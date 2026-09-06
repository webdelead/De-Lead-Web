"use client";

import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * The CSS auto-marquee used for logo/press/review strips (corporate `.facts-track`
 * 46s + `.track-row` 64s, walk2lead `.marquee-track` 34s + `.press-track` 216s,
 * makerchamps `.wa-marquee-track` 34s). Children are duplicated once so a
 * translateX(0 -> -50%) loop is seamless; pauses on hover; no motion under
 * `prefers-reduced-motion`.
 *
 * NOT for the scroll-linked gallery marquee (makerchamps `.marquee-row`) or the
 * drag-to-scrub press strip — those stay with their site.
 */
export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Higher = slower. Default 40. */
  durationS?: number;
  /** Visual travel direction. Default "left". */
  direction?: "left" | "right";
  /** Pause the animation while hovered. Default true. */
  pauseOnHover?: boolean;
  /** Gap between items (and between the two copies). Default "1.25rem". */
  gap?: string;
  className?: string;
  style?: CSSProperties;
  /** Fade the track edges with a mask (corporate `.facts-row`). Default false. */
  edgeFade?: boolean;
}

export function Marquee({
  children,
  durationS = 40,
  direction = "left",
  pauseOnHover = true,
  gap = "1.25rem",
  className,
  style,
  edgeFade = false,
}: MarqueeProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const anim = `dl-marquee-${id}`;
  const to = direction === "left" ? "-50%" : "50%";

  const maskStyle: CSSProperties = edgeFade
    ? {
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent)",
        maskImage:
          "linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent)",
      }
    : {};

  return (
    <div
      className={className}
      style={{ overflow: "hidden", ...maskStyle, ...style }}
    >
      <style>{`
        @keyframes ${anim} { from { transform: translateX(0); } to { transform: translateX(${to}); } }
        .${anim}-track { display: flex; width: max-content; gap: ${gap}; will-change: transform; animation: ${anim} ${durationS}s linear infinite; }
        ${pauseOnHover ? `.${anim}-track:hover { animation-play-state: paused; }` : ""}
        @media (prefers-reduced-motion: reduce) { .${anim}-track { animation: none; } }
      `}</style>
      <div className={`${anim}-track`}>
        <div style={{ display: "flex", gap, flex: "0 0 auto" }}>{children}</div>
        <div style={{ display: "flex", gap, flex: "0 0 auto" }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
