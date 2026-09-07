"use client";

import { useEffect, useRef } from "react";
import { useScrollNav } from "@delead/ui/use-scroll-nav";

const LINKS: [string, string][] = [
  ["#story", "Story"],
  ["#impact", "Impact"],
  ["#reality", "How We Deliver"],
  ["#voices", "Voices"],
  ["#gallery", "Gallery"],
];

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

  return (
    <>
      <nav
        ref={navRef}
        id="nav"
        className={[
          "left-0 right-0 top-0 z-[100] bg-w2l transition-[transform,background-color,border-color] duration-[350ms] [border-bottom:1px_solid_transparent]",
          fixed
            ? "fixed bg-[rgba(250,247,244,0.9)] [backdrop-filter:blur(14px)]"
            : "absolute",
          fixed && scrolled ? "[border-bottom-color:var(--color-line)]" : "",
          fixed && hidden ? "-translate-y-full" : "",
        ].join(" ")}
      >
        <div className="wrap flex h-[72px] items-center justify-between max-[480px]:h-16">
          <a className="relative block" href="#top">
            <img
              src="/assets/walk2lead-logo.svg"
              alt="Walk2Lead"
              className={`h-[26px] max-[480px]:h-5 ${fixed ? "block" : "hidden"}`}
            />
            <img
              src="/assets/walk2lead-logo-white.svg"
              alt="Walk2Lead"
              className={`h-[26px] [filter:brightness(0)_invert(1)] max-[480px]:h-5 ${
                fixed ? "hidden" : "block"
              }`}
            />
          </a>
          <ul className="flex list-none items-center gap-[30px]">
            {LINKS.map(([href, label]) => (
              <li key={href} className="max-[900px]:hidden">
                <a
                  href={href}
                  className={`text-[0.92rem] font-medium transition-colors ${
                    fixed ? "text-ink-soft hover:text-accent" : "text-white/85 hover:text-white"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                className={`btn btn-primary whitespace-nowrap !px-[22px] !py-2.5 !text-[0.88rem] max-[480px]:!px-3.5 max-[480px]:!py-2 max-[480px]:!text-[0.76rem] ${
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
