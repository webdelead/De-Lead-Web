"use client";

import { useEffect } from "react";

/**
 * 1:1 client port of the frozen public/js/main.js — same selectors, thresholds
 * and DOM writes, only the delivery changed. Mounted once in layout.tsx.
 *
 *   - nav: .scrolled past 40px, hide on scroll-down / show on scroll-up
 *   - mobile nav toggle (.nav-toggle / .nav-links .open, body scroll lock)
 *   - ecosystem dropdown (#ecoDropdown: click, hover >860px, click-outside, Esc)
 *   - journal .blog-row click-and-drag horizontal scroll (8px slop, click swallow)
 *   - .reveal / .reveal-stagger -> .in on intersect (threshold 0, -12% bottom)
 *   - .v-stack .v-card scroll-linked crossfade (rAF, opacity + translateY)
 *   - .vc-media: click the dimmed back photo to swap is-front / is-back
 *   - gallery lightbox (#lightbox / #lightbox-img)
 *   - gallery "Load more" -> /api/gallery?offset=
 *
 * (#year is rendered server-side now, so main.js's year line is dropped.)
 */
export function SiteScripts() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- sticky nav: scrolled + hide on scroll-down, show on scroll-up ----------
    const nav = document.querySelector<HTMLElement>(".nav");
    if (nav) {
      let lastY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        if (y > 40) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");

        if (y > lastY && y > nav.offsetHeight) nav.classList.add("nav-hidden");
        else if (y < lastY) nav.classList.remove("nav-hidden");
        lastY = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    // ---------- mobile nav toggle ----------
    const toggle = document.querySelector<HTMLElement>(".nav-toggle");
    const links = document.querySelector<HTMLElement>(".nav-links");
    if (toggle && links) {
      const onToggle = () => {
        const open = toggle.classList.toggle("open");
        links.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      };
      toggle.addEventListener("click", onToggle);
      cleanups.push(() => toggle.removeEventListener("click", onToggle));
      links.querySelectorAll("a").forEach((a) => {
        const h = () => {
          toggle.classList.remove("open");
          links.classList.remove("open");
          document.body.style.overflow = "";
        };
        a.addEventListener("click", h);
        cleanups.push(() => a.removeEventListener("click", h));
      });
    }

    // ---------- ecosystem nav dropdown ----------
    const ecoDropdown = document.getElementById("ecoDropdown");
    if (ecoDropdown) {
      const ecoTrigger = ecoDropdown.querySelector<HTMLElement>(".nav-drop-trigger");
      const setEcoOpen = (open: boolean) => {
        ecoDropdown.classList.toggle("open", open);
        ecoTrigger?.setAttribute("aria-expanded", open ? "true" : "false");
      };
      const onTriggerClick = (e: Event) => {
        e.stopPropagation();
        setEcoOpen(!ecoDropdown.classList.contains("open"));
      };
      const onEnter = () => {
        if (window.innerWidth > 860) setEcoOpen(true);
      };
      const onLeave = () => {
        if (window.innerWidth > 860) setEcoOpen(false);
      };
      const onDocClick = (e: Event) => {
        if (!ecoDropdown.contains(e.target as Node)) setEcoOpen(false);
      };
      const onKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setEcoOpen(false);
      };
      ecoTrigger?.addEventListener("click", onTriggerClick);
      ecoDropdown.addEventListener("mouseenter", onEnter);
      ecoDropdown.addEventListener("mouseleave", onLeave);
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKeydown);
      cleanups.push(() => {
        ecoTrigger?.removeEventListener("click", onTriggerClick);
        ecoDropdown.removeEventListener("mouseenter", onEnter);
        ecoDropdown.removeEventListener("mouseleave", onLeave);
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKeydown);
      });
    }

    // ---------- click-and-drag horizontal scroll (journal row) ----------
    const dragRow = document.querySelector<HTMLElement>(".blog-row");
    if (dragRow) {
      const DRAG_SLOP = 8;
      let isDown = false;
      let dragStartX = 0;
      let dragStartScroll = 0;
      let moved = false;
      const onDown = (e: MouseEvent) => {
        isDown = true;
        moved = false;
        dragStartX = e.pageX;
        dragStartScroll = dragRow.scrollLeft;
      };
      const onUp = () => {
        isDown = false;
        dragRow.classList.remove("dragging");
      };
      const onMove = (e: MouseEvent) => {
        if (!isDown) return;
        const delta = e.pageX - dragStartX;
        if (!moved && Math.abs(delta) > DRAG_SLOP) {
          moved = true;
          dragRow.classList.add("dragging");
        }
        if (moved) {
          e.preventDefault();
          dragRow.scrollLeft = dragStartScroll - delta;
        }
      };
      const onClickCapture = (e: Event) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      };
      dragRow.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("mousemove", onMove);
      dragRow.addEventListener("click", onClickCapture, true);
      cleanups.push(() => {
        dragRow.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("mousemove", onMove);
        dragRow.removeEventListener("click", onClickCapture, true);
      });
    }

    // ---------- reveal on scroll ----------
    const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -12% 0px" },
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
      const onLoad = () => {
        revealEls.forEach((el) => {
          if (el.classList.contains("in")) return;
          if (el.getBoundingClientRect().top < window.innerHeight * 1.25) {
            el.classList.add("in");
          }
        });
      };
      window.addEventListener("load", onLoad);
      cleanups.push(() => window.removeEventListener("load", onLoad));
    }

    // ---------- soft fade between the stacked vertical cards ----------
    const vCards = Array.from(document.querySelectorAll<HTMLElement>(".v-stack .v-card"));
    if (vCards.length) {
      const FADE_SPAN = 1.35;
      let ticking = false;
      const applyFade = () => {
        ticking = false;
        const vh = window.innerHeight || 1;
        vCards.forEach((card, i) => {
          if (i === 0) {
            card.style.opacity = "";
            card.style.transform = "";
            return;
          }
          const top = card.getBoundingClientRect().top;
          let o = 1 - top / (vh * FADE_SPAN);
          o = o < 0 ? 0 : o > 1 ? 1 : o;
          card.style.opacity = o.toFixed(3);
          card.style.transform = reduceMotion
            ? ""
            : `translateY(${((1 - o) * 28).toFixed(1)}px)`;
        });
      };
      const fadeCards = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(applyFade);
      };
      window.addEventListener("scroll", fadeCards, { passive: true });
      window.addEventListener("resize", fadeCards);
      applyFade();
      cleanups.push(() => {
        window.removeEventListener("scroll", fadeCards);
        window.removeEventListener("resize", fadeCards);
      });
    }

    // ---------- vertical card photo stacks (ecosystem): click the peeking
    // back photo to bring it forward ----------
    document.querySelectorAll<HTMLElement>(".vc-media").forEach((media) => {
      const imgs = media.querySelectorAll<HTMLImageElement>("img.is-front, img.is-back");
      if (imgs.length < 2) return;
      const h = (e: Event) => {
        const back = media.querySelector("img.is-back");
        if (!back || e.target !== back) return;
        imgs.forEach((im) => {
          im.classList.toggle("is-front");
          im.classList.toggle("is-back");
        });
      };
      media.addEventListener("click", h);
      cleanups.push(() => media.removeEventListener("click", h));
    });

    // ---------- gallery lightbox ----------
    const lb = document.getElementById("lightbox");
    const lbi = document.getElementById("lightbox-img") as HTMLImageElement | null;
    const wireLightboxImg = (im: HTMLImageElement) => {
      const h = () => {
        if (!lbi || !lb) return;
        lbi.src = im.src;
        lbi.alt = im.alt || "";
        lb.classList.add("open");
      };
      im.addEventListener("click", h);
      cleanups.push(() => im.removeEventListener("click", h));
    };
    if (lb && lbi) {
      document
        .querySelectorAll<HTMLImageElement>(".gallery-grid img")
        .forEach(wireLightboxImg);
      const onLbClick = () => lb.classList.remove("open");
      lb.addEventListener("click", onLbClick);
      cleanups.push(() => lb.removeEventListener("click", onLbClick));
    }

    // ---------- gallery "Load more" ----------
    const moreBtn = document.getElementById("gallery-load-more") as HTMLButtonElement | null;
    const grid = document.getElementById("gallery-grid");
    if (moreBtn && grid) {
      const WIDE = [0, 7];
      const TALL = [1, 5];
      const onMore = () => {
        const offset = Number(moreBtn.dataset.offset || "0");
        moreBtn.disabled = true;
        moreBtn.textContent = "Loading…";
        fetch("/api/gallery?offset=" + offset)
          .then((r) => r.json())
          .then((data: { items?: Array<{ url: string; title?: string }>; hasMore?: boolean }) => {
            (data.items || []).forEach((item, i) => {
              const slot = (offset + i) % 10;
              const fig = document.createElement("figure");
              if (WIDE.indexOf(slot) !== -1) fig.className = "g-wide";
              else if (TALL.indexOf(slot) !== -1) fig.className = "g-tall";
              const img = document.createElement("img");
              img.src = item.url;
              img.alt = item.title || "";
              img.loading = "lazy";
              fig.appendChild(img);
              if (item.title) {
                const cap = document.createElement("figcaption");
                cap.textContent = item.title;
                fig.appendChild(cap);
              }
              grid.appendChild(fig);
              wireLightboxImg(img);
            });
            moreBtn.dataset.offset = String(
              offset + (data.items ? data.items.length : 0),
            );
            if (data.hasMore) {
              moreBtn.disabled = false;
              moreBtn.textContent = "Load more photos";
            } else {
              moreBtn.remove();
            }
          })
          .catch(() => {
            moreBtn.disabled = false;
            moreBtn.textContent = "Load more photos";
          });
      };
      moreBtn.addEventListener("click", onMore);
      cleanups.push(() => moreBtn.removeEventListener("click", onMore));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
