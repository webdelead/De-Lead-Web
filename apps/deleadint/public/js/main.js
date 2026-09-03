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
    var isDown = false;
    var dragStartX = 0;
    var dragStartScroll = 0;
    var moved = false;
    dragRow.addEventListener("mousedown", function (e) {
      isDown = true;
      moved = false;
      dragRow.classList.add("dragging");
      dragStartX = e.pageX;
      dragStartScroll = dragRow.scrollLeft;
    });
    window.addEventListener("mouseup", function () {
      isDown = false;
      dragRow.classList.remove("dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var delta = e.pageX - dragStartX;
      if (Math.abs(delta) > 4) moved = true;
      dragRow.scrollLeft = dragStartScroll - delta;
    });
    // suppress the click on a card right after a drag, so links/cards don't
    // register an accidental click at the end of a drag gesture
    dragRow.addEventListener(
      "click",
      function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
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
  // On desktop each .v-card is sticky and the next one scrolls up to cover it.
  // Instead of a hard edge, ramp each covering card's opacity from 0 -> 1 as
  // its top travels from one viewport-height away up to the top of the screen.
  var vCards = Array.prototype.slice.call(
    document.querySelectorAll(".v-stack .v-card")
  );
  if (vCards.length) {
    var fadeCards = function () {
      var desktop = window.innerWidth >= 901;
      var vh = window.innerHeight || 1;
      vCards.forEach(function (card, i) {
        if (!desktop || i === 0) {
          card.style.opacity = "";
          return;
        }
        var top = card.getBoundingClientRect().top;
        var o = 1 - top / vh;
        o = o < 0 ? 0 : o > 1 ? 1 : o;
        card.style.opacity = o.toFixed(3);
      });
    };
    window.addEventListener("scroll", fadeCards, { passive: true });
    window.addEventListener("resize", fadeCards);
    fadeCards();
  }

  // ---------- footer year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
