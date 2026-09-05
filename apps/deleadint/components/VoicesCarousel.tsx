"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

export type VoiceRow = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  sourceNote: string;
};

// flat card colours, cycled by index — matches the old stacked-card palette
const palette: [string, string][] = [
  ["var(--cream2)", "var(--ink)"],
  ["var(--ink)", "#fff"],
  ["var(--magenta-deep)", "#fff"],
  ["#2a4d3a", "#fff"],
];

const STEP = 60; // % of card width each slot is offset from centre

function initials(name: string) {
  const parts = name
    .replace(/\b(Dr|Mr|Mrs|Ms|Prof)\.?\s+/gi, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0]![0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : "";
  return (first + last).toUpperCase();
}

/**
 * Coverflow testimonial carousel: three cards in view, the centre one large and
 * fully lit, the flanking ones smaller and dimmed. Auto-advances on a timer
 * (paused on hover / keyboard focus / hidden tab / reduced-motion), loops
 * infinitely, driven by dots. Fixed height, so more testimonials don't grow the
 * page. Below 1080px it shows just the active card as a plain block.
 */
export function VoicesCarousel({
  rows,
  interval = 5000,
}: {
  rows: VoiceRow[];
  interval?: number;
}) {
  const n = rows.length;
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false); // hovered / focused / tab hidden
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  // autoplay — held while the user is engaged with it or the tab is hidden
  useEffect(() => {
    if (n <= 1 || engaged || reduce.current) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), interval);
    return () => window.clearInterval(id);
  }, [n, engaged, interval]);

  // pause conditions via native listeners (reliable across pointer/focus/tab)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let hover = false;
    let focus = false;
    const sync = () => setEngaged(hover || focus || document.hidden);
    const onEnter = () => ((hover = true), sync());
    const onLeave = () => ((hover = false), sync());
    const onFocusIn = () => ((focus = true), sync());
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node)) focus = false;
      sync();
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", sync);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    }
  };

  if (!n) return null;

  return (
    <div
      ref={rootRef}
      className="voices-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onKeyDown={onKeyDown}
    >
      <div className="vcar-stage">
        {rows.map((t, i) => {
          // signed, wrapped distance from the active card
          let d = i - active;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const abs = Math.abs(d);
          const [bg, fg] = palette[i % palette.length]!;
          const role = t.sourceNote
            ? `${t.authorRole}, ${t.sourceNote}`
            : t.authorRole;
          const isCenter = d === 0;
          return (
            <article
              key={t.id}
              className="vcar-card"
              aria-hidden={!isCenter}
              style={
                {
                  // plain computed strings (no CSS var) so the CSS transition
                  // interpolates them cleanly
                  transform: `translateX(${d * STEP}%) scale(${(
                    1 -
                    abs * 0.16
                  ).toFixed(3)})`,
                  opacity: Math.max(0, 1 - abs * 0.55),
                  zIndex: 20 - abs,
                  pointerEvents: abs > 1 ? "none" : undefined,
                  "--vsc-bg": bg,
                  "--vsc-fg": fg,
                } as CSSProperties
              }
              onClick={!isCenter && abs <= 1 ? () => go(i) : undefined}
            >
              <span className="vsc-num">{String(i + 1).padStart(2, "0")}</span>
              <p className="vsc-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="vsc-who">
                <span className="vsc-avatar">{initials(t.authorName)}</span>
                <div>
                  <b>{t.authorName}</b>
                  <span>{role}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {n > 1 && (
        <div className="vcar-dots">
          {rows.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={"vcar-dot" + (i === active ? " is-active" : "")}
              aria-label={`Show testimonial ${i + 1} of ${n}`}
              aria-current={i === active}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
