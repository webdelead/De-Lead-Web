"use client";

import { useEffect } from "react";

/**
 * The remaining behaviours from the old public/assets/js/main.js, ported 1:1
 * into a client effect (the nav already moved to @delead/ui useScrollNav in
 * S01). Same DOM the server rendered, same manipulation — just triggered from
 * React instead of a raw <script>. Individual behaviours (reveal, counters,
 * carousels, lightbox) can be swapped to @delead/ui primitives incrementally
 * from here.
 */
export function SiteScripts() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // ---- reveal on scroll ----
    {
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12 },
      );
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    // ---- counters ----
    {
      const cio = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            cio.unobserve(e.target);
            const el = e.target as HTMLElement;
            const end = Number(el.dataset.count);
            const suf = el.dataset.suffix || "";
            const dec = Number(el.dataset.decimals || 0);
            const t0 = performance.now();
            const dur = 1400;
            const stepFn = (t: number) => {
              const p = Math.min((t - t0) / dur, 1);
              const v = end * (1 - Math.pow(1 - p, 3));
              el.innerHTML =
                (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN")) +
                (suf ? "<sup>" + suf + "</sup>" : "");
              if (p < 1) requestAnimationFrame(stepFn);
            };
            requestAnimationFrame(stepFn);
          }),
        { threshold: 0.5 },
      );
      document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
      cleanups.push(() => cio.disconnect());
    }

    // ---- draggable scatter photos (decorative) ----
    document.querySelectorAll<HTMLElement>(".scatter-photo").forEach((el) => {
      let dragging = false;
      let offX = 0;
      let offY = 0;
      const parent = el.parentElement!;
      const down = (e: PointerEvent) => {
        dragging = true;
        el.classList.add("dragging");
        el.setPointerCapture(e.pointerId);
        const r = el.getBoundingClientRect();
        offX = e.clientX - r.left;
        offY = e.clientY - r.top;
        el.style.zIndex = "1000";
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const pr = parent.getBoundingClientRect();
        let nx = e.clientX - pr.left - offX;
        let ny = e.clientY - pr.top - offY;
        nx = Math.max(-40, Math.min(nx, pr.width - 60));
        ny = Math.max(-20, Math.min(ny, pr.height - 60));
        el.style.left = nx + "px";
        el.style.top = ny + "px";
      };
      const up = (e: PointerEvent) => {
        dragging = false;
        el.classList.remove("dragging");
        el.releasePointerCapture(e.pointerId);
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      cleanups.push(() => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
      });
    });

    // ---- infinite sliders (quotes, projects) ----
    const initSlider = (
      trackId: string,
      prevId: string,
      nextId: string,
      itemSel: string,
      autoMs: number,
    ) => {
      const track = document.getElementById(trackId);
      if (!track || !track.children.length) return;
      const baseItems = Array.from(track.children).map((ch) => {
        const c = ch.cloneNode(true) as HTMLElement;
        c.classList.remove("reveal");
        return c;
      });
      const appendSet = () =>
        baseItems.forEach((ch) => track.appendChild(ch.cloneNode(true)));
      appendSet();
      const ensureBuffer = () => {
        const card = track.querySelector<HTMLElement>(itemSel);
        if (!card) return;
        const gap = parseFloat(getComputedStyle(track).columnGap || "22");
        const remaining = track.scrollWidth - (track.scrollLeft + track.clientWidth);
        if (remaining < (card.offsetWidth + gap) * 3) appendSet();
      };
      const step = (dir: number) => {
        const card = track.querySelector<HTMLElement>(itemSel);
        if (!card) return;
        const gap = parseFloat(getComputedStyle(track).columnGap || "22");
        track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
        setTimeout(ensureBuffer, 450);
      };
      const prev = () => step(-1);
      const next = () => step(1);
      document.getElementById(prevId)?.addEventListener("click", prev);
      document.getElementById(nextId)?.addEventListener("click", next);
      let paused = false;
      const pause = () => (paused = true);
      const resume = () => (paused = false);
      track.addEventListener("mouseenter", pause);
      track.addEventListener("mouseleave", resume);
      track.addEventListener("touchstart", pause, { passive: true });
      const timer = window.setInterval(() => {
        if (!paused) step(1);
      }, autoMs);
      cleanups.push(() => {
        window.clearInterval(timer);
        document.getElementById(prevId)?.removeEventListener("click", prev);
        document.getElementById(nextId)?.removeEventListener("click", next);
      });
    };
    initSlider("quote-track", "quote-prev", "quote-next", ".quote", 4800);
    initSlider("proj-track", "proj-prev", "proj-next", ".pcard", 4200);

    // ---- lightbox ----
    const lb = document.getElementById("lightbox");
    const lbi = document.getElementById("lightbox-img") as HTMLImageElement | null;
    const wireLightboxImg = (im: HTMLImageElement) => {
      const open = () => {
        if (!lb || !lbi) return;
        lbi.src = im.src;
        lbi.alt = im.alt || "";
        lb.classList.add("open");
      };
      im.addEventListener("click", open);
    };
    if (lb && lbi) {
      document
        .querySelectorAll<HTMLImageElement>(".gallery-grid img")
        .forEach(wireLightboxImg);
      const close = () => lb.classList.remove("open");
      lb.addEventListener("click", close);
      cleanups.push(() => lb.removeEventListener("click", close));
    }

    // ---- gallery "Load more" ----
    {
      const btn = document.getElementById("gallery-load-more") as HTMLButtonElement | null;
      const grid = document.getElementById("gallery-grid");
      if (btn && grid) {
        const WIDE = [0, 7];
        const onClick = () => {
          const offset = Number(btn.dataset.offset || "0");
          btn.disabled = true;
          btn.textContent = "Loading…";
          fetch("/api/gallery?offset=" + offset)
            .then((r) => r.json())
            .then((data: { items?: { url: string; alt?: string }[]; hasMore?: boolean }) => {
              (data.items || []).forEach((item, i) => {
                const slot = (offset + i) % 8;
                const cell = document.createElement("div");
                if (WIDE.indexOf(slot) !== -1) cell.className = "wide";
                const img = document.createElement("img");
                img.src = item.url;
                img.alt = item.alt || "";
                img.loading = "lazy";
                cell.appendChild(img);
                grid.appendChild(cell);
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
        btn.addEventListener("click", onClick);
        cleanups.push(() => btn.removeEventListener("click", onClick));
      }
    }

    // ---- press strip: drag to scroll + click to lightbox ----
    {
      const wrap = document.querySelector<HTMLElement>(".press-scroll-wrap");
      const track = document.querySelector<HTMLElement>(".press-track");
      if (track && wrap) {
        const DUR = 216;
        let dragging = false;
        let hovering = false;
        let wasDrag = false;
        let startX = 0;
        let baseOffset = 0;
        let dragDist = 0;
        const hw = () => track.scrollWidth / 2;
        const getOffset = () =>
          new DOMMatrix(window.getComputedStyle(track).transform).m41;
        const resumeFrom = (px: number) => {
          const h = hw();
          let off = px % -h;
          if (off > 0) off -= h;
          const frac = Math.abs(off) / h;
          track.style.transform = "";
          track.style.animation = `press-scroll ${DUR}s ${-(frac * DUR).toFixed(1)}s linear infinite`;
        };
        const onStart = (e: MouseEvent | TouchEvent) => {
          dragging = true;
          dragDist = 0;
          startX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
          baseOffset = getOffset();
          track.style.animation = "none";
          track.style.transform = `translateX(${baseOffset}px)`;
        };
        const onMove = (e: MouseEvent | TouchEvent) => {
          if (!dragging) return;
          const x = "touches" in e ? e.touches[0]!.clientX : e.clientX;
          const dx = x - startX;
          dragDist = Math.abs(dx);
          if (dragDist > 4 && e.cancelable) e.preventDefault();
          track.style.transform = `translateX(${baseOffset + dx}px)`;
        };
        const onEnd = () => {
          if (!dragging) return;
          dragging = false;
          wasDrag = dragDist > 5;
          resumeFrom(getOffset());
          if (hovering) track.style.animationPlayState = "paused";
        };
        const noDrag = (e: Event) => e.preventDefault();
        track.addEventListener("dragstart", noDrag);
        track.querySelectorAll("img").forEach((img) => img.setAttribute("draggable", "false"));
        const enter = () => {
          hovering = true;
          if (!dragging) track.style.animationPlayState = "paused";
        };
        const leave = () => {
          hovering = false;
          track.style.animationPlayState = "running";
        };
        wrap.addEventListener("mouseenter", enter);
        wrap.addEventListener("mouseleave", leave);
        track.addEventListener("mousedown", onStart);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onEnd);
        track.addEventListener("touchstart", onStart, { passive: true });
        track.addEventListener("touchmove", onMove, { passive: false });
        track.addEventListener("touchend", onEnd);
        const onCardClick = (e: Event) => {
          if (wasDrag) {
            wasDrag = false;
            return;
          }
          const card = (e.target as HTMLElement).closest(".press-card:not([aria-hidden])");
          const img = card?.querySelector("img");
          if (img && lb && lbi) {
            lbi.src = (img as HTMLImageElement).src;
            lb.classList.add("open");
          }
        };
        track.addEventListener("click", onCardClick);
        cleanups.push(() => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onEnd);
        });
      }
    }

    // ---- CSR enquiry form -> Apps Script (mailto fallback) ----
    {
      const SHEET_URL =
        "https://script.google.com/macros/s/AKfycbwYma3uMa_PMnFGLypPPEMW3zbgITnFjeE2Ex_eF-Y02QtoFGDGpQvxXsSyOiFd1UkP/exec";
      const form = document.getElementById("csr-form") as HTMLFormElement | null;
      if (form) {
        const onSubmit = (e: SubmitEvent) => {
          e.preventDefault();
          const fd = new FormData(form);
          const d = {
            name: String(fd.get("name") || ""),
            company: String(fd.get("company") || ""),
            email: String(fd.get("email") || ""),
            phone: String(fd.get("phone") || ""),
            message: String(fd.get("message") || ""),
          };
          form.classList.add("is-loading");
          fetch(SHEET_URL, { method: "POST", body: JSON.stringify(d), mode: "no-cors" })
            .then(() => {
              form.classList.remove("is-loading");
              form.classList.add("is-success");
            })
            .catch(() => {
              const body = encodeURIComponent(
                `Name: ${d.name}\nCompany: ${d.company}\nEmail: ${d.email}\nPhone: ${d.phone || "-"}\n\n${d.message || ""}`,
              );
              location.href = `mailto:info@deleadint.com?subject=${encodeURIComponent(
                "CSR Partnership Enquiry from " + d.company,
              )}&body=${body}`;
            });
        };
        form.addEventListener("submit", onSubmit);
        cleanups.push(() => form.removeEventListener("submit", onSubmit));
      }
    }

    // ---- hero group-photo slideshow ----
    {
      const wrap = document.querySelector<HTMLElement>(".b-photo-group");
      const slides = wrap
        ? Array.from(wrap.querySelectorAll<HTMLElement>(".hero-slide"))
        : [];
      // (the old main.js slideshow didn't gate on reduced-motion; match it —
      // the initial z-index stack must run so slide 1 sits on top)
      if (wrap && slides.length >= 2) {
        const DUR = 1600;
        let cur = 0;
        let paused = false;
        slides.forEach((s, i) => (s.style.zIndex = i === 0 ? "1" : "0"));
        const go = () => {
          const prev = cur;
          cur = (cur + 1) % slides.length;
          const nextEl = slides[cur]!;
          nextEl.style.transition = "none";
          nextEl.style.transform = "translateX(100%)";
          nextEl.style.zIndex = "2";
          void nextEl.offsetHeight;
          nextEl.style.transition = `transform ${DUR}ms cubic-bezier(0.76,0,0.24,1)`;
          nextEl.style.transform = "translateX(0%)";
          slides[prev]!.style.zIndex = "1";
          setTimeout(() => {
            slides.forEach((s, i) => {
              s.style.transition = "none";
              s.style.zIndex = i === cur ? "1" : "0";
            });
          }, DUR + 50);
        };
        const timer = window.setInterval(() => {
          if (!paused) go();
        }, 5000);
        const pause = () => (paused = true);
        const resume = () => (paused = false);
        wrap.addEventListener("mouseenter", pause);
        wrap.addEventListener("mouseleave", resume);
        wrap.addEventListener("touchstart", pause, { passive: true });
        wrap.addEventListener("touchend", resume, { passive: true });
        cleanups.push(() => window.clearInterval(timer));
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
