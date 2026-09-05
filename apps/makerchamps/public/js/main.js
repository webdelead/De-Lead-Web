// Nav goes transparent (light logo) while over the navy hero, solid once
// past it, and hides on scroll-down / reappears on scroll-up — same pattern
// as every other site (deleadint/walk2lead/corporate/dli-education
// public/js/main.js).
const navEl = document.querySelector(".nav");
const navLogoImg = document.querySelector(".nav-logo img");
const heroEl = document.getElementById("top");
const LOGO_ON_LIGHT = "assets/brand/makerchamps-logo.png";
const LOGO_ON_DARK = "assets/brand/makerchamps-logo-on-dark.webp";
let navLastY = window.scrollY;
let navMenuOpen = false;

function updateNavState() {
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
}

if (navEl && navLogoImg && heroEl) {
  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });
}

// Ripple that expands from the cursor when hovering the hero photos
function spawnRipple(e) {
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

document.querySelectorAll(".hero-photo-inner, .hero-photo-back").forEach((el) => {
  el.addEventListener("mouseenter", spawnRipple);
});

// Click the peeking back photo to bring it to the front — swap is-front/
// is-back between the two so it's a soft transform+filter transition
// (see .hero-photo-inner.is-front / .is-back in styles.css) not a hard cut.
const photoStack = document.getElementById("hero-photo-stack");
if (photoStack) {
  const stackPhotos = photoStack.querySelectorAll(".hero-photo-inner, .hero-photo-back");
  stackPhotos.forEach((p) => {
    p.addEventListener("click", () => {
      if (p.classList.contains("is-front")) return;
      stackPhotos.forEach((other) => {
        other.classList.toggle("is-front");
        other.classList.toggle("is-back");
      });
    });
  });
}

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navMobilePanel = document.getElementById("navMobilePanel");

if (navToggle && navMobilePanel) {
  navToggle.addEventListener("click", () => {
    navMobilePanel.classList.toggle("is-open");
    navMenuOpen = navMobilePanel.classList.contains("is-open");
    if (navMenuOpen && navEl) navEl.classList.remove("nav-hidden");
  });

  navMobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMobilePanel.classList.remove("is-open");
      navMenuOpen = false;
    });
  });
}

// Scroll-reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => revealObserver.observe(el));

// Enquiry form — not wired to a backend yet.
// TODO: once the Apps Script endpoint is connected to the Google Sheet
// (matching the APPS_SCRIPT_URL pattern used in Tinkerchamps/), replace the
// block below with a fetch() POST of the FormData to that endpoint.
const enquiryForm = document.getElementById("enquiryForm");
const formSuccess = document.getElementById("formSuccess");

if (enquiryForm) {
  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.classList.add("is-visible");
    enquiryForm.reset();
  });
}

// Gallery marquee — scroll-linked horizontal gallery. The photo rows don't
// autoplay and don't need their own hover/wheel interaction; they simply
// translate horizontally as the visitor scrolls the page vertically past
// this section (down = left, up = right), and hold still outside it.
//
// The rows don't snap straight to the scroll-computed position — each
// frame, `current` eases toward `target` by a fraction (EASE) of the
// remaining distance. That's what gives the soft start/soft stop: right as
// scrolling begins the gap is tiny so motion ramps in gently, and once
// scrolling stops the row keeps gliding the last bit of the way and settles
// instead of snapping to a halt.
const galleryEl = document.getElementById("gallery");
const marqueeRows = document.querySelectorAll(".marquee-row");
const reduceMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (galleryEl && marqueeRows.length) {
  const tracks = Array.from(marqueeRows)
    .map((row) => ({ row, track: row.querySelector(".marquee-track"), current: 0, target: 0 }))
    .filter((t) => t.track);

  const EASE = 0.035; // lower = slower / softer catch-up
  let rafId = null;

  function computeTargets() {
    const rect = galleryEl.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the section's top has just entered the viewport bottom,
    // 1 when its bottom has just left the viewport top.
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));

    tracks.forEach((t, i) => {
      const max = t.track.scrollWidth - t.row.clientWidth;
      if (max <= 0) {
        t.target = 0;
        return;
      }
      // Rows alternate direction, echoing the old left/right marquee names.
      t.target = i % 2 === 0 ? -progress * max : -max + progress * max;
    });
  }

  function tick() {
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
  }

  function onScrollOrResize() {
    computeTargets();
    if (reduceMotion) {
      tracks.forEach((t) => {
        t.current = t.target;
        t.track.style.transform = `translateX(${t.current}px)`;
      });
      return;
    }
    if (rafId == null) rafId = requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  computeTargets();
  tracks.forEach((t) => {
    t.current = t.target;
    t.track.style.transform = `translateX(${t.current}px)`;
  });
}

// ---------- gallery lightbox (same pattern as Walk2Lead) ----------
const lb = document.getElementById("lightbox");
const lbi = document.getElementById("lightbox-img");
if (lb && lbi) {
  document.querySelectorAll(".marquee-track img").forEach((im) => {
    im.addEventListener("click", () => {
      lbi.src = im.src;
      lbi.alt = im.alt || "";
      lb.classList.add("open");
    });
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));
}
