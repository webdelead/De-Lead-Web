// De' Lead International - Corporate Training page interactions
// Plain JS, no dependencies.

(function () {
  "use strict";

  // ---------- nav: solid/compact on scroll, hide on scroll-down ----------
  var nav = document.querySelector(".nav");
  var lastY = window.scrollY;
  var onScroll = function () {
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 30);
    if (y > lastY && y > 120) nav.classList.add("nav-hidden");
    else if (y < lastY) nav.classList.remove("nav-hidden");
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- mobile nav ----------
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

  // ---------- reveal on scroll ----------
  var revealEls = document.querySelectorAll(".reveal");
  var reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting || e.intersectionRatio > 0) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
    window.addEventListener("load", function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains("in") &&
            el.getBoundingClientRect().top < window.innerHeight * 1.3) {
          el.classList.add("in");
        }
      });
    });
  }

  // ---------- count-up numbers ----------
  var counters = document.querySelectorAll("[data-count]");
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1100;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  // (fact + track rows are CSS marquees; no JS needed)

  // ---------- enquiry form ----------
  // TODO: POST to a Google Apps Script endpoint once the client provides one
  // (same pattern as Tinkerchamps / MakerChamps). No mailto redirect.
  var form = document.getElementById("enquiryForm");
  var success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.reset();
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

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
  // mirrors the 5-slot mosaic (g-a..g-e) from components/S12_gallery.tsx —
  // keep the two in sync if that layout ever changes.
  (function () {
    var btn = document.getElementById("gallery-load-more");
    var grid = document.getElementById("gallery-grid");
    if (!btn || !grid) return;
    var SLOTS = ["g-a", "g-b", "g-c", "g-d", "g-e"];

    btn.addEventListener("click", function () {
      var offset = Number(btn.dataset.offset || "0");
      btn.disabled = true;
      btn.textContent = "Loading…";
      fetch("/api/gallery?offset=" + offset)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          (data.items || []).forEach(function (item, i) {
            var fig = document.createElement("figure");
            fig.className = SLOTS[(offset + i) % 5];
            var img = document.createElement("img");
            img.src = item.url;
            img.alt = item.alt || "";
            img.loading = "lazy";
            fig.appendChild(img);
            var cap = document.createElement("figcaption");
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
