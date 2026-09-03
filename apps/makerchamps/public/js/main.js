// Nav goes transparent (light logo) while over the navy hero, solid once past it
const navEl = document.querySelector(".nav");
const navLogoImg = document.querySelector(".nav-logo img");
const heroEl = document.getElementById("top");
const LOGO_ON_LIGHT = "assets/brand/makerchamps-logo.png";
const LOGO_ON_DARK = "assets/brand/makerchamps-logo-on-dark.webp";

function updateNavState() {
  const overHero = heroEl.getBoundingClientRect().bottom > navEl.offsetHeight;
  navEl.classList.toggle("is-solid", !overHero);
  navLogoImg.src = overHero ? LOGO_ON_DARK : LOGO_ON_LIGHT;
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

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navMobilePanel = document.getElementById("navMobilePanel");

if (navToggle && navMobilePanel) {
  navToggle.addEventListener("click", () => {
    navMobilePanel.classList.toggle("is-open");
  });

  navMobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navMobilePanel.classList.remove("is-open"));
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
const galleryEl = document.getElementById("gallery");
const marqueeRows = document.querySelectorAll(".marquee-row");

if (galleryEl && marqueeRows.length) {
  const tracks = Array.from(marqueeRows).map((row) => ({
    row,
    track: row.querySelector(".marquee-track"),
  })).filter((t) => t.track);

  let ticking = false;

  function updateMarquee() {
    ticking = false;
    const rect = galleryEl.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the section's top has just entered the viewport bottom,
    // 1 when its bottom has just left the viewport top.
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));

    tracks.forEach(({ row, track }, i) => {
      const max = track.scrollWidth - row.clientWidth;
      if (max <= 0) return;
      // Rows alternate direction, echoing the old left/right marquee names.
      const offset = i % 2 === 0 ? -progress * max : -max + progress * max;
      track.style.transform = `translateX(${offset}px)`;
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateMarquee);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateMarquee();
}
