/* One IntersectionObserver for the whole page. Elements opt in with
 * `data-reveal` (optionally `data-reveal="stagger"` on a container).
 * Cheap: opacity + small translateY, cleared after transition. Honours
 * prefers-reduced-motion. Call initReveal() once from an inline module script. */

export function initReveal(root: ParentNode = document): void {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (els.length === 0) return;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" },
  );
  els.forEach((el) => io.observe(el));

  // safety net for restored scroll positions / very long pages
  window.addEventListener(
    "load",
    () => {
      els.forEach((el) => {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < innerHeight * 1.3) {
          el.classList.add("is-in");
        }
      });
    },
    { once: true },
  );
}
