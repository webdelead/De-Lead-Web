"use client";

import { useEffect } from "react";

/**
 * 1:1 client port of the frozen public/js/main.js — same selectors, same DOM
 * writes, same thresholds. Only the delivery changed (inline effect instead
 * of a <script src>). Mounted once in layout.tsx.
 *
 *   - nav: .is-solid past the hero, logo src swap, .nav-hidden on scroll-down
 *   - hero photos: cursor ripple + click-to-bring-to-front (is-front/is-back)
 *   - mobile nav: #navToggle / #navMobilePanel .is-open
 *   - .reveal / .reveal-stagger -> .is-visible on intersect
 *   - #enquiryForm: preventDefault, reset, reveal #formSuccess
 *   - gallery marquee: scroll-linked eased translateX on .marquee-row tracks
 *   - lightbox (#lightbox / #lightbox-img) for .marquee-track img
 */
export function SiteScripts() {
  useEffect(() => {
    const LOGO_ON_LIGHT = "assets/brand/makerchamps-logo.png";
    const LOGO_ON_DARK = "assets/brand/makerchamps-logo-on-dark.webp";
    const cleanups: Array<() => void> = [];

    // ---------- nav ----------
    const navEl = document.querySelector<HTMLElement>(".nav");
    const navLogoImg = document.querySelector<HTMLImageElement>(".nav-logo img");
    const heroEl = document.getElementById("top");
    let navLastY = window.scrollY;
    let navMenuOpen = false;

    const updateNavState = () => {
      if (!navEl || !navLogoImg || !heroEl) return;
      const overHero = heroEl.getBoundingClientRect().bottom > navEl.offsetHeight;
      navEl.classList.toggle("is-solid", !overHero);
      navLogoImg.src = overHero ? LOGO_ON_DARK : LOGO_ON_LIGHT;

      const y = window.scrollY;
      if (navMenuOpen) {
        navEl.classList.remove("nav-hidden");
      } else if (y > navLastY && y > navEl.offsetHeight) {
        navEl.classList.add("nav-hidden");
      } else if (y < navLastY) {
        navEl.classList.remove("nav-hidden");
      }
      navLastY = y;
    };
    if (navEl && navLogoImg && heroEl) {
      updateNavState();
      window.addEventListener("scroll", updateNavState, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", updateNavState));
    }

    // ---------- hero photo ripple ----------
    function spawnRipple(this: HTMLElement, e: MouseEvent) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.1;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left + "px";
      ripple.style.top = e.clientY - rect.top + "px";
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    }
    const rippleEls = document.querySelectorAll<HTMLElement>(
      ".hero-photo-inner, .hero-photo-back",
    );
    rippleEls.forEach((el) => {
      el.addEventListener("mouseenter", spawnRipple);
      cleanups.push(() => el.removeEventListener("mouseenter", spawnRipple));
    });

    // ---------- hero photo click-to-front ----------
    const photoStack = document.getElementById("hero-photo-stack");
    if (photoStack) {
      const stackPhotos = photoStack.querySelectorAll<HTMLElement>(
        ".hero-photo-inner, .hero-photo-back",
      );
      stackPhotos.forEach((p) => {
        const h = () => {
          if (p.classList.contains("is-front")) return;
          stackPhotos.forEach((other) => {
            other.classList.toggle("is-front");
            other.classList.toggle("is-back");
          });
        };
        p.addEventListener("click", h);
        cleanups.push(() => p.removeEventListener("click", h));
      });
    }

    // ---------- mobile nav toggle ----------
    const navToggle = document.getElementById("navToggle");
    const navMobilePanel = document.getElementById("navMobilePanel");
    if (navToggle && navMobilePanel) {
      const onToggle = () => {
        navMobilePanel.classList.toggle("is-open");
        navMenuOpen = navMobilePanel.classList.contains("is-open");
        if (navMenuOpen && navEl) navEl.classList.remove("nav-hidden");
      };
      navToggle.addEventListener("click", onToggle);
      cleanups.push(() => navToggle.removeEventListener("click", onToggle));
      navMobilePanel.querySelectorAll("a").forEach((link) => {
        const h = () => {
          navMobilePanel.classList.remove("is-open");
          navMenuOpen = false;
        };
        link.addEventListener("click", h);
        cleanups.push(() => link.removeEventListener("click", h));
      });
    }

    // ---------- scroll reveal ----------
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".reveal, .reveal-stagger")
      .forEach((el) => revealObserver.observe(el));
    cleanups.push(() => revealObserver.disconnect());

    // ---------- enquiry form ----------
    const enquiryForm = document.getElementById("enquiryForm") as HTMLFormElement | null;
    const formSuccess = document.getElementById("formSuccess");
    if (enquiryForm) {
      const onSubmit = (e: Event) => {
        e.preventDefault();
        formSuccess?.classList.add("is-visible");
        enquiryForm.reset();
      };
      enquiryForm.addEventListener("submit", onSubmit);
      cleanups.push(() => enquiryForm.removeEventListener("submit", onSubmit));
    }

    // ---------- gallery scroll-linked marquee ----------
    const galleryEl = document.getElementById("gallery");
    const marqueeRows = document.querySelectorAll<HTMLElement>(".marquee-row");
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (galleryEl && marqueeRows.length) {
      const tracks = Array.from(marqueeRows)
        .map((row) => ({
          row,
          track: row.querySelector<HTMLElement>(".marquee-track"),
          current: 0,
          target: 0,
        }))
        .filter((t): t is { row: HTMLElement; track: HTMLElement; current: number; target: number } =>
          Boolean(t.track),
        );

      const EASE = 0.035;
      let rafId: number | null = null;

      const computeTargets = () => {
        const rect = galleryEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
        tracks.forEach((t, i) => {
          const max = t.track.scrollWidth - t.row.clientWidth;
          if (max <= 0) {
            t.target = 0;
            return;
          }
          t.target = i % 2 === 0 ? -progress * max : -max + progress * max;
        });
      };

      const tick = () => {
        let moving = false;
        tracks.forEach((t) => {
          const diff = t.target - t.current;
          if (Math.abs(diff) > 0.25) {
            t.current += diff * EASE;
            moving = true;
          } else {
            t.current = t.target;
          }
          t.track.style.transform = `translateX(${t.current}px)`;
        });
        rafId = moving ? requestAnimationFrame(tick) : null;
      };

      const onScrollOrResize = () => {
        computeTargets();
        if (reduceMotion) {
          tracks.forEach((t) => {
            t.current = t.target;
            t.track.style.transform = `translateX(${t.current}px)`;
          });
          return;
        }
        if (rafId == null) rafId = requestAnimationFrame(tick);
      };

      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize, { passive: true });
      computeTargets();
      tracks.forEach((t) => {
        t.current = t.target;
        t.track.style.transform = `translateX(${t.current}px)`;
      });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScrollOrResize);
        window.removeEventListener("resize", onScrollOrResize);
        if (rafId != null) cancelAnimationFrame(rafId);
      });
    }

    // ---------- lightbox ----------
    const lb = document.getElementById("lightbox");
    const lbi = document.getElementById("lightbox-img") as HTMLImageElement | null;
    if (lb && lbi) {
      const wire = (im: HTMLImageElement) => {
        const h = () => {
          lbi.src = im.src;
          lbi.alt = im.alt || "";
          lb.classList.add("open");
        };
        im.addEventListener("click", h);
        cleanups.push(() => im.removeEventListener("click", h));
      };
      document
        .querySelectorAll<HTMLImageElement>(".marquee-track img, .wa-card img")
        .forEach(wire);
      const onLbClick = () => lb.classList.remove("open");
      lb.addEventListener("click", onLbClick);
      cleanups.push(() => lb.removeEventListener("click", onLbClick));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
