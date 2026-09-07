import { test, expect } from "@playwright/test";

/**
 * Shared visual-regression suite for a marketing site's home page. Each app's
 * e2e/visual.spec.ts is just:
 *
 *   import { registerVisualTests } from "@delead/config/visual-spec.mjs";
 *   registerVisualTests();
 *
 * Playwright runs it once per viewport project (mobile / tablet / desktop) and
 * takes one screenshot per top-level section that has an `id` — keyed by that
 * id (`home--impact.png`), so the baseline survives the migration re-wrapping
 * markup. Sections without an id (nav bar, bare marquee, lightbox host) are
 * skipped; the ids come from the in-page nav anchors and are preserved.
 * Assertions are soft, so one run reports every section.
 *
 * Determinism — a flaky baseline makes the gate worthless:
 *   - reduced-motion (config) + a runtime "kill all animation/transition" sheet
 *   - every pending timer/interval cleared after first paint, freezing the hero
 *     slideshow / autoplay carousels on frame 0
 *   - wait for every <img> to finish (lazy images changing section height was
 *     the main source of drift) and for the rAF [data-count] roll to settle
 */
const KILL_MOTION = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
`;

async function settle(page) {
  await page.addStyleTag({ content: KILL_MOTION });
  // the sticky bar toggles position:fixed on scroll (main.js), and a fixed
  // element is composited into every viewport tile of a tall element
  // screenshot — pin it to absolute-at-top so it only appears in home--nav.
  await page.addStyleTag({
    content: "nav, .nav { position: absolute !important; }",
  });

  // force every image eager so heights are settled before any capture, then
  // walk the page so the reveal IntersectionObservers fire, then hard-force
  // every scroll-reveal to its end state (IO callback timing was a flake source)
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll("img")) img.loading = "eager";
    await (document.fonts && document.fonts.ready);
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    for (const el of document.querySelectorAll(
      ".reveal, .reveal-stagger, .stagger-item, [data-revealed]",
    )) {
      el.classList.add("in", "is-visible");
      el.setAttribute("data-revealed", "");
    }
  });

  // freeze timer-driven loops (slideshow, autoplay carousels) on their frame
  await page.evaluate(() => {
    const maxId = Number(setTimeout(() => {}, 0));
    for (let i = 0; i <= maxId; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  });

  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      // pin position:fixed -> absolute: a fixed element is composited into
      // EVERY viewport tile of a tall element screenshot (stamps repeatedly)
      if (getComputedStyle(el).position === "fixed") {
        el.style.setProperty("position", "absolute", "important");
      }
      // reset scroll containers — a main.js carousel's setInterval may have
      // nudged scrollLeft once before it was cleared above
      if (el.scrollLeft) el.scrollLeft = 0;
      if (el.scrollTop) el.scrollTop = 0;
    }
  });

  // every image decoded — lazy images arriving late shift section heights.
  // Capped so a permanently-pending <img src=""> (DB fallback) can't hang it.
  await page.evaluate(() => {
    const pending = Array.from(document.images)
      .filter((img) => !img.complete && img.getAttribute("src"))
      .map(
        (img) =>
          new Promise((res) => {
            img.onload = img.onerror = res;
          }),
      );
    return Promise.race([
      Promise.all(pending),
      new Promise((r) => setTimeout(r, 10_000)),
    ]);
  });

  // CSS background-image photos (full-bleed card / hero / band backgrounds)
  // are NOT <img>, so the wait above misses them — they can pop in a frame
  // after the screenshot and read as a big same-size pixel diff over the
  // whole card. Force each url() to decode, capped like the <img> wait.
  await page.evaluate(() => {
    const urls = new Set();
    for (const el of document.querySelectorAll("*")) {
      for (const pseudo of [null, "::before", "::after"]) {
        const bg = getComputedStyle(el, pseudo).backgroundImage;
        if (!bg || bg === "none") continue;
        for (const m of bg.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
          if (!m[2].startsWith("data:")) urls.add(m[2]);
        }
      }
    }
    const load = (src) =>
      new Promise((res) => {
        const im = new Image();
        im.onload = im.onerror = res;
        im.src = src;
      });
    return Promise.race([
      Promise.all([...urls].map(load)),
      new Promise((r) => setTimeout(r, 10_000)),
    ]);
  });

  // let the 1400ms count-ups reach their fixed final value
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

export function registerVisualTests({ path = "/", name = "home" } = {}) {
  test.describe(`${name} visual`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      await settle(page);
    });

    test(`${name} sections`, async ({ page }) => {
      const sections = page.locator("body > [id]");
      const count = await sections.count();
      expect(count, "no id'd top-level sections found").toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const el = sections.nth(i);
        if (!(await el.isVisible())) continue;
        const box = await el.boundingBox();
        if (!box || box.height < 4) continue;
        const id = (await el.getAttribute("id"))?.trim() || `i${i}`;
        await expect.soft(el).toHaveScreenshot(`${name}--${id}.png`);
      }
    });
  });
}
