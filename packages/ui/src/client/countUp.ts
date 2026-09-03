/* Count-up for elements with [data-count] (+ optional [data-suffix]).
 * Runs once when the element scrolls in. One rAF loop per element, ~900ms. */

export function initCountUp(root: ParentNode = document): void {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
  if (els.length === 0) return;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count ?? "0");
    const suffix = el.dataset.suffix ?? "";
    if (reduce || !Number.isFinite(target)) {
      el.textContent = target.toLocaleString("en-IN") + suffix;
      return;
    }
    const dur = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    els.forEach(run);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          run(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}
