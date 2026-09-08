"use client";

import { useEffect } from "react";

/**
 * 1:1 client port of the frozen public/js/main.js — same selectors, same DOM
 * writes, same thresholds. Shared behaviour for all three pages. Mounted once
 * in layout.tsx.
 *
 *   - mobile nav: #navToggle / #navLinks .open, backdrop + Esc close, body lock
 *   - nav: .scrolled past 20px, hide on scroll-down / show on scroll-up
 *   - .reveal -> .in on intersect (threshold 0.12, rootMargin 0 0 -40px 0)
 *   - [data-count] rAF roll to the final value (1400ms, ease-out cubic)
 *   - #enquiryForm: validate, inline #formSuccess, reset
 *
 * (#year is rendered server-side now, so main.js's year block is dropped.)
 */
export function SiteScripts() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const navEl = document.querySelector<HTMLElement>(".nav");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    // ---------- mobile nav ----------
    const setMenu = (open: boolean) => {
      links?.classList.toggle("open", open);
      toggle?.classList.toggle("open", open);
      toggle?.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (navEl) {
        navEl.classList.toggle("menu-open", open);
        if (open) navEl.classList.remove("nav-hidden");
      }
    };

    if (toggle && links) {
      const onToggle = (e: Event) => {
        e.stopPropagation();
        setMenu(!links.classList.contains("open"));
      };
      const onLinksClick = (e: Event) => {
        const t = e.target as HTMLElement;
        if (t.tagName === "A" && links.classList.contains("open")) setMenu(false);
      };
      const onDocClick = (e: Event) => {
        if (!links.classList.contains("open")) return;
        const t = e.target as HTMLElement;
        if (t.closest("#navLinks") || t.closest("#navToggle")) return;
        setMenu(false);
      };
      const onKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && links.classList.contains("open")) setMenu(false);
      };
      toggle.addEventListener("click", onToggle);
      links.addEventListener("click", onLinksClick);
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKeydown);
      cleanups.push(() => {
        toggle.removeEventListener("click", onToggle);
        links.removeEventListener("click", onLinksClick);
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKeydown);
      });
    }

    // ---------- nav: hide on scroll-down, show on scroll-up ----------
    if (navEl) {
      let lastY = window.pageYOffset || 0;
      const updateNav = () => {
        const cy = window.pageYOffset || 0;
        navEl.classList.toggle("scrolled", cy > 20);
        if (!(links && links.classList.contains("open"))) {
          if (cy <= 0) navEl.classList.remove("nav-hidden");
          else if (cy > lastY && cy > 140) navEl.classList.add("nav-hidden");
          else if (cy < lastY - 4) navEl.classList.remove("nav-hidden");
        }
        lastY = cy;
      };
      window.addEventListener("scroll", updateNav, { passive: true });
      updateNav();
      cleanups.push(() => window.removeEventListener("scroll", updateNav));
    }

    // ---------- reveal on scroll ----------
    const revs = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revs.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      revs.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      revs.forEach((el) => el.classList.add("in"));
    }

    // ---------- count-up ----------
    const nums = document.querySelectorAll<HTMLElement>("[data-count]");
    if ("IntersectionObserver" in window && nums.length) {
      const nio = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            const target = parseFloat(el.getAttribute("data-count") || "0");
            const suffix = el.getAttribute("data-suffix") || "";
            let start: number | null = null;
            const stepFn = (ts: number) => {
              if (!start) start = ts;
              const p = Math.min((ts - start) / 1400, 1);
              const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
              el.textContent = val.toLocaleString() + suffix;
              if (p < 1) requestAnimationFrame(stepFn);
              else el.textContent = target.toLocaleString() + suffix;
            };
            requestAnimationFrame(stepFn);
            nio.unobserve(el);
          });
        },
        { threshold: 0.4 },
      );
      nums.forEach((el) => nio.observe(el));
      cleanups.push(() => nio.disconnect());
    }

    // ---------- contact form: inline success, no backend yet ----------
    const form = document.getElementById("enquiryForm") as HTMLFormElement | null;
    if (form) {
      const onSubmit = (e: Event) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const ok = document.getElementById("formSuccess");
        if (ok) ok.hidden = false;
        form.reset();
      };
      form.addEventListener("submit", onSubmit);
      cleanups.push(() => form.removeEventListener("submit", onSubmit));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
