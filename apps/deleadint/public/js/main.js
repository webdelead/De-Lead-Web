// De' Lead International — hub landing page interactions
// Plain JS, no dependencies.

(function () {
  "use strict";

  // ---------- sticky nav on scroll + hide on scroll-down, show on scroll-up ----------
  var nav = document.querySelector(".nav");
  var lastY = window.scrollY;
  var onScroll = function () {
    var y = window.scrollY;
    if (y > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");

    if (y > lastY && y > nav.offsetHeight) {
      nav.classList.add("nav-hidden");
    } else if (y < lastY) {
      nav.classList.remove("nav-hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- mobile nav toggle ----------
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.classList.toggle("open");
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        links.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // ---------- ecosystem nav dropdown ----------
  var ecoDropdown = document.getElementById("ecoDropdown");
  if (ecoDropdown) {
    var ecoTrigger = ecoDropdown.querySelector(".nav-drop-trigger");
    var setEcoOpen = function (open) {
      ecoDropdown.classList.toggle("open", open);
      ecoTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    };
    ecoTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      setEcoOpen(!ecoDropdown.classList.contains("open"));
    });
    // desktop: open on hover too, for mouse users
    ecoDropdown.addEventListener("mouseenter", function () {
      if (window.innerWidth > 860) setEcoOpen(true);
    });
    ecoDropdown.addEventListener("mouseleave", function () {
      if (window.innerWidth > 860) setEcoOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (!ecoDropdown.contains(e.target)) setEcoOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setEcoOpen(false);
    });
  }

  // ---------- click-and-drag horizontal scroll (journal row) ----------
  var dragRow = document.querySelector(".blog-row");
  if (dragRow) {
    var DRAG_SLOP = 8; // px of travel before a press counts as a drag, not a click
    var isDown = false;
    var dragStartX = 0;
    var dragStartScroll = 0;
    var moved = false;
    dragRow.addEventListener("mousedown", function (e) {
      isDown = true;
      moved = false; // don't add .dragging yet — a plain click must stay a click
      dragStartX = e.pageX;
      dragStartScroll = dragRow.scrollLeft;
    });
    window.addEventListener("mouseup", function () {
      isDown = false;
      dragRow.classList.remove("dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var delta = e.pageX - dragStartX;
      if (!moved && Math.abs(delta) > DRAG_SLOP) {
        moved = true;
        dragRow.classList.add("dragging");
      }
      if (moved) {
        e.preventDefault();
        dragRow.scrollLeft = dragStartScroll - delta;
      }
    });
    // only when a real drag happened: swallow the trailing click so a card
    // link doesn't fire at the end of the gesture
    dragRow.addEventListener(
      "click",
      function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true
    );
  }

  // ---------- reveal on scroll ----------
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      // threshold 0: a section taller than the viewport can never reach a
      // 0.15 ratio, so it would stay hidden forever on mobile. Fire as soon
      // as any pixel crosses in; the -12% bottom margin reveals each block a
      // touch before its top edge scrolls into view.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
    // safety net: if anything is still hidden once everything has loaded and
    // it's at or near the viewport, show it (covers observer edge cases on
    // very long pages / restored scroll positions).
    window.addEventListener("load", function () {
      revealEls.forEach(function (el) {
        if (el.classList.contains("in")) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 1.25) {
          el.classList.add("in");
        }
      });
    });
  }

  // ---------- soft fade between the stacked vertical cards ----------
  // Each .v-card is sticky (all widths — see .v-card in styles.css) and the
  // next one scrolls up to cover it. Instead of a hard edge, ramp each
  // covering card's opacity + a small rise from 0 -> 1 as its top travels
  // from FADE_SPAN viewport-heights away up to the top of the screen — a
  // span a bit wider than one full viewport so the handoff between cards
  // reads as slow and continuous rather than snapping in at the last moment.
  // rAF-throttled so a fast scroll/trackpad fling can't fire this faster
  // than the browser can paint — that's what read as "stops"/stutter before,
  // not the animation itself.
  var vCards = Array.prototype.slice.call(
    document.querySelectorAll(".v-stack .v-card")
  );
  if (vCards.length) {
    var FADE_SPAN = 1.35;
    var ticking = false;
    var applyFade = function () {
      ticking = false;
      var vh = window.innerHeight || 1;
      vCards.forEach(function (card, i) {
        if (i === 0) {
          card.style.opacity = "";
          card.style.transform = "";
          return;
        }
        var top = card.getBoundingClientRect().top;
        var o = 1 - top / (vh * FADE_SPAN);
        o = o < 0 ? 0 : o > 1 ? 1 : o;
        card.style.opacity = o.toFixed(3);
        card.style.transform = reduceMotion ? "" : "translateY(" + ((1 - o) * 28).toFixed(1) + "px)";
      });
    };
    var fadeCards = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(applyFade);
    };
    window.addEventListener("scroll", fadeCards, { passive: true });
    window.addEventListener("resize", fadeCards);
    applyFade();
  }

  // (testimonials are now the React <VoicesCarousel> — no scroll handler here)

  // ---------- vertical card photo stacks (ecosystem section): click the
  // peeking back photo to bring it forward — same is-front/is-back swap as
  // the MakerChamps hero collage, just scoped to each .vc-media instead of
  // needing to guard against a <a> navigating underneath it. ----------
  document.querySelectorAll(".vc-media").forEach(function (media) {
    var imgs = media.querySelectorAll("img.is-front, img.is-back");
    if (imgs.length < 2) return; // single-photo card (Goal Finder) — nothing to wire
    media.addEventListener("click", function (e) {
      var back = media.querySelector("img.is-back");
      if (!back || e.target !== back) return;
      imgs.forEach(function (im) {
        im.classList.toggle("is-front");
        im.classList.toggle("is-back");
      });
    });
  });

  // ---------- gallery lightbox (same pattern as Walk2Lead) ----------
  var lb = document.getElementById("lightbox");
  var lbi = document.getElementById("lightbox-img");
  function wireLightboxImg(im) {
    im.addEventListener("click", function () {
      lbi.src = im.src;
      lbi.alt = im.alt || "";
      lb.classList.add("open");
    });
  }
  if (lb && lbi) {
    document.querySelectorAll(".gallery-grid img").forEach(wireLightboxImg);
    lb.addEventListener("click", function () {
      lb.classList.remove("open");
    });
  }

  // ---------- gallery "Load more" ----------
  // mirrors the wide/tall accent rhythm from components/Gallery.tsx —
  // keep the two in sync if that pattern ever changes.
  (function () {
    var btn = document.getElementById("gallery-load-more");
    var grid = document.getElementById("gallery-grid");
    if (!btn || !grid) return;
    var WIDE = [0, 7];
    var TALL = [1, 5];

    btn.addEventListener("click", function () {
      var offset = Number(btn.dataset.offset || "0");
      btn.disabled = true;
      btn.textContent = "Loading…";
      fetch("/api/gallery?offset=" + offset)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          (data.items || []).forEach(function (item, i) {
            var slot = (offset + i) % 10;
            var fig = document.createElement("figure");
            if (WIDE.indexOf(slot) !== -1) fig.className = "g-wide";
            else if (TALL.indexOf(slot) !== -1) fig.className = "g-tall";
            var img = document.createElement("img");
            img.src = item.url;
            img.alt = item.title || "";
            img.loading = "lazy";
            fig.appendChild(img);
            if (item.title) {
              var cap = document.createElement("figcaption");
              cap.textContent = item.title;
              fig.appendChild(cap);
            }
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
        .catch(function () {
          btn.disabled = false;
          btn.textContent = "Load more photos";
        });
    });
  })();

  // ---------- footer year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
