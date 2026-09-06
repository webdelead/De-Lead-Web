"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";

/**
 * The `[data-count]` count-up in walk2lead / corporate / dli-education main.js.
 * All three use the same cubic ease-out (1 - (1-p)^3); they differ only in
 * duration, rounding, locale and whether the suffix is wrapped in <sup>.
 * Snaps to the exact target on the final frame (matches all three).
 */
export interface UseCountUpOptions {
  to: number;
  /** ms. walk2lead/dli = 1400, corporate = 1100. Default 1400. */
  duration?: number;
  decimals?: number;
  /** Start immediately instead of waiting for `start()`. */
  autoStart?: boolean;
}

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

export function useCountUp({
  to,
  duration = 1400,
  decimals = 0,
  autoStart = false,
}: UseCountUpOptions) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const raf = useRef<number | null>(null);

  const start = () => {
    if (started.current) return;
    started.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(p >= 1 ? to : to * easeOutCubic(p));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (autoStart) start();
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = started.current
    ? decimals
      ? value.toFixed(decimals)
      : Math.round(value)
    : 0;

  return { value, display, start, done: value === to && started.current };
}

export interface CounterProps
  extends Omit<UseCountUpOptions, "autoStart"> {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  prefix?: string;
  suffix?: string;
  /** Wrap the suffix in <sup> (walk2lead). */
  supSuffix?: boolean;
  /** toLocaleString locale for the integer form. walk2lead uses "en-IN". */
  locale?: string;
  /** "round" (corporate) or "floor" (dli-education). Default "round". */
  rounding?: "round" | "floor";
  /** Fire the count when scrolled into view. Default true. threshold 0.5 (w2l) / 0.4-0.6 (others). */
  startOnView?: boolean;
  viewThreshold?: number;
}

export function Counter({
  as,
  className,
  style,
  prefix = "",
  suffix = "",
  supSuffix = false,
  locale,
  rounding = "round",
  startOnView = true,
  viewThreshold = 0.5,
  ...countOpts
}: CounterProps) {
  const Tag = (as ?? "span") as ElementType;
  const { value, start } = useCountUp({ ...countOpts, autoStart: !startOnView });
  const ref = useRef<HTMLElement | null>(null);
  const decimals = countOpts.decimals ?? 0;

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.unobserve(e.target);
          }
        }
      },
      { threshold: viewThreshold },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOnView, viewThreshold]);

  const target = countOpts.to;
  const settled = value === target;
  let num: string;
  if (decimals) {
    num = (settled ? target : value).toFixed(decimals);
  } else {
    const n = settled
      ? target
      : rounding === "floor"
        ? Math.floor(value)
        : Math.round(value);
    num = locale ? n.toLocaleString(locale) : n.toLocaleString();
  }

  return (
    <Tag ref={ref} className={className} style={style}>
      {prefix}
      {num}
      {suffix ? supSuffix ? <sup>{suffix}</sup> : suffix : null}
    </Tag>
  );
}
