"use client";

import { useEffect } from "react";

/**
 * 1:1 client port of the frozen public/js/main.js. Same selectors, same DOM
 * manipulation, same thresholds — only the delivery changed (inline effect
 * instead of a <script src>). Mounted once in layout.tsx.
 *
 *   - nav: .scrolled past 30, .nav-hidden on scroll-down past 120, clears on up
 *   - mobile nav: .nav-toggle / .nav-links .open + body scroll lock
 *   - .reveal -> .in on intersect (+ load-time near-viewport safety net)
 *   - [data-count] count-up (1100ms cubic ease-out, snaps to target)
 *   - #enquiryForm: preventDefault, validate, reset, reveal #formSuccess
 *   - gallery lightbox (#lightbox / #lightbox-img) + "Load more" (/api/gallery)
 *   - #year -> current year
 */
export function SiteScripts() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".nav");
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!nav) return;
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 30);
      if (y > lastY && y > 120) nav.classList.add("nav-hidden");
      else if (y < lastY) nav.classList.remove("nav-hidden");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---------- mobile nav ----------
    const toggle = document.querySelector<HTMLElement>(".nav-toggle");
    const links = document.querySelector<HTMLElement>(".nav-links");
    const onToggle = () => {
      if (!toggle || !links) return;
      const open = toggle.classList.toggle("open");
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    const linkClicks: HTMLAnchorElement[] = [];
    if (toggle && links) {
      toggle.addEventListener("click", onToggle);
      links.querySelectorAll("a").forEach((a) => {
        const h = () => {
          toggle.classList.remove("open");
          links.classList.remove("open");
          document.body.style.overflow = "";
        };
        a.addEventListener("click", h);
        (a as HTMLAnchorElement & { __h?: () => void }).__h = h;
        linkClicks.push(a as HTMLAnchorElement);
      });
    }

    // ---------- reveal on scroll ----------
    const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;
    const onLoad = () => {
      revealEls.forEach((el) => {
        if (
          !el.classList.contains("in") &&
          el.getBoundingClientRect().top < window.innerHeight * 1.3
        ) {
          el.classList.add("in");
        }
      });
    };
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting || e.intersectionRatio > 0) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" },
      );
      revealEls.forEach((el) => io?.observe(el));
      window.addEventListener("load", onLoad);
    }

    // ---------- count-up numbers ----------
    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const runCount = (el: HTMLElement) => {
      const target = parseFloat(el.getAttribute("data-count") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      let startTs: number | null = null;
      const dur = 1100;
      const step = (ts: number) => {
        if (startTs === null) startTs = ts;
        const p = Math.min((ts - startTs) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };
    let cio: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && !reduce) {
      cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              runCount(e.target as HTMLElement);
              cio?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.6 },
      );
      counters.forEach((el) => cio?.observe(el));
    }

    // ---------- enquiry form ----------
    const form = document.getElementById("enquiryForm") as HTMLFormElement | null;
    const success = document.getElementById("formSuccess") as HTMLElement | null;
    const onSubmit = (e: Event) => {
      e.preventDefault();
      if (!form) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.reset();
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    if (form) form.addEventListener("submit", onSubmit);

    // ---------- gallery lightbox ----------
    const lb = document.getElementById("lightbox");
    const lbi = document.getElementById("lightbox-img") as HTMLImageElement | null;
    const wireLightboxImg = (im: HTMLImageElement) => {
      im.addEventListener("click", () => {
        if (!lbi || !lb) return;
        lbi.src = im.src;
        lbi.alt = im.alt || "";
        lb.classList.add("open");
      });
    };
    const onLbClick = () => lb?.classList.remove("open");
    if (lb && lbi) {
      document
        .querySelectorAll<HTMLImageElement>(".gallery-grid img")
        .forEach(wireLightboxImg);
      lb.addEventListener("click", onLbClick);
    }

    // ---------- gallery "Load more" ----------
    const btn = document.getElementById("gallery-load-more") as HTMLButtonElement | null;
    const grid = document.getElementById("gallery-grid");
    const SLOTS = ["g-a", "g-b", "g-c", "g-d", "g-e"];
    const onLoadMore = () => {
      if (!btn || !grid) return;
      const offset = Number(btn.dataset.offset || "0");
      btn.disabled = true;
      btn.textContent = "Loading…";
      fetch("/api/gallery?offset=" + offset)
        .then((r) => r.json())
        .then((data: { items?: { url: string; alt?: string; title?: string }[]; hasMore?: boolean }) => {
          (data.items || []).forEach((item, i) => {
            const fig = document.createElement("figure");
            fig.className = SLOTS[(offset + i) % 5];
            const img = document.createElement("img");
            img.src = item.url;
            img.alt = item.alt || "";
            img.loading = "lazy";
            fig.appendChild(img);
            const cap = document.createElement("figcaption");
            cap.textContent = item.title || "";
            fig.appendChild(cap);
            grid.appendChild(fig);
            wireLightboxImg(img);
          });
          btn.dataset.offset = String(offset + (data.items ? data.items.length : 0));
          if (data.hasMore) {
            btn.disabled = false;
            btn.textContent = "Load more photos";
          } else {
            btn.remove();
          }
        })
        .catch(() => {
          btn.disabled = false;
          btn.textContent = "Load more photos";
        });
    };
    if (btn && grid) btn.addEventListener("click", onLoadMore);

    // ---------- footer year ----------
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", onLoad);
      toggle?.removeEventListener("click", onToggle);
      linkClicks.forEach((a) => {
        const h = (a as HTMLAnchorElement & { __h?: () => void }).__h;
        if (h) a.removeEventListener("click", h);
      });
      io?.disconnect();
      cio?.disconnect();
      form?.removeEventListener("submit", onSubmit);
      lb?.removeEventListener("click", onLbClick);
      btn?.removeEventListener("click", onLoadMore);
    };
  }, []);

  return null;
}
