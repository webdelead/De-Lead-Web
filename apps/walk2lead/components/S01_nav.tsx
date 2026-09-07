"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollNav } from "@delead/ui/use-scroll-nav";

const LINKS: [string, string][] = [
  ["#story", "Story"],
  ["#impact", "Impact"],
  ["#reality", "How We Deliver"],
  ["#voices", "Voices"],
  ["#gallery", "Gallery"],
];

// soft ease-out for the slide + colour crossfades
const EASE = "ease-[cubic-bezier(0.33,1,0.68,1)]";

export function S01_nav() {
  const navRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    heroRef.current = document.querySelector(".hero");
  }, []);

  const { scrolled, hidden, pastHero } = useScrollNav({
    navRef,
    heroRef,
    heroMode: "height",
    heroHeightOffset: 80,
    scrolledAfter: 10,
  });

  const fixed = pastHero;

  // Apply the slide one frame after the scroll event that triggered it —
  // Chromium skips a transition when the style change lands in the same frame
  // as scroll handling, which made the hide (but not the show) snap.
  const [slideUp, setSlideUp] = useState(false);
  useEffect(() => {
    const target = fixed && hidden;
    const id = requestAnimationFrame(() => setSlideUp(target));
    return () => cancelAnimationFrame(id);
  }, [fixed, hidden]);

  return (
    <>
      <nav
        ref={navRef}
        id="nav"
        style={{
          transform: slideUp ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 420ms cubic-bezier(0.33,1,0.68,1), background-color 350ms ease, border-color 350ms ease",
        }}
        className={[
          "left-0 right-0 top-0 z-[100] [border-bottom:1px_solid_transparent]",
          fixed
            ? "fixed bg-[rgba(250,247,244,0.92)] [backdrop-filter:blur(14px)] [-webkit-backdrop-filter:blur(14px)]"
            : "absolute bg-w2l",
          fixed && scrolled ? "[border-bottom-color:var(--color-line)]" : "",
        ].join(" ")}
      >
        <div className="wrap flex h-[72px] items-center justify-between max-[480px]:h-16">
          <a className="relative block h-[26px] max-[480px]:h-5" href="#top">
            <img
              src="/assets/walk2lead-logo.svg"
              alt="Walk2Lead"
              className={`h-full transition-opacity duration-300 ${EASE} ${
                fixed ? "opacity-100" : "opacity-0"
              }`}
            />
            <img
              src="/assets/walk2lead-logo-white.svg"
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full [filter:brightness(0)_invert(1)] transition-opacity duration-300 ${EASE} ${
                fixed ? "opacity-0" : "opacity-100"
              }`}
            />
          </a>
          <ul className="flex list-none items-center gap-[30px]">
            {LINKS.map(([href, label]) => (
              <li key={href} className="max-[900px]:hidden">
                <a
                  href={href}
                  className={`text-[0.92rem] font-medium transition-colors duration-300 ${EASE} ${
                    fixed ? "text-ink-soft hover:text-w2l" : "text-white/85 hover:text-white"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                className={`btn btn-primary whitespace-nowrap !px-[22px] !py-2.5 !text-[0.88rem] transition-[color,background-color,transform] duration-300 ${EASE} max-[480px]:!px-3.5 max-[480px]:!py-2 max-[480px]:!text-[0.76rem] ${
                  fixed
                    ? "!bg-w2l !text-white hover:!bg-w2l-deep"
                    : "!bg-white !text-w2l hover:!bg-cream hover:!text-w2l-deep"
                }`}
                href="#partner"
              >
                Partner With Us
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO — bento */}
    </>
  );
}
