import { test, expect } from "@playwright/test";

/**
 * Shared visual-regression suite for a marketing site's home page. Each app's
 * e2e/visual.spec.ts is just:
 *
 *   import { registerVisualTests } from "@delead/config/visual-spec.mjs";
 *   registerVisualTests();
 *
 * Playwright runs this once per viewport project (mobile / tablet / desktop).
 *
 *   1. `home` — one full-page screenshot. A global vertical shift fails it,
 *      which is intended: the Tailwind rewrite must not move anything.
 *   2. `sections` — one screenshot per top-level block (`body > *`), soft-
 *      asserted so every block is reported in a single run. Add `data-vr="…"`
 *      to a wrapper during migration if its index/box needs pinning.
 */
export function registerVisualTests({ path = "/", name = "home" } = {}) {
  test.describe(`${name} visual`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      // fonts settled (next/font swap) before any capture
      await page.evaluate(() => document.fonts && document.fonts.ready);
      // walk the page so IntersectionObserver reveals fire, then return to top;
      // `animations: "disabled"` freezes them at their end state for the shot
      await page.evaluate(async () => {
        const step = Math.round(window.innerHeight * 0.8);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 150));
      });
    });

    test(name, async ({ page }) => {
      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
    });

    test(`${name} sections`, async ({ page }) => {
      const blocks = page.locator("body > *:not(script):not(style):not(next-route-announcer)");
      const count = await blocks.count();
      expect(count, "no top-level blocks found").toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const block = blocks.nth(i);
        if (!(await block.isVisible())) continue;
        const box = await block.boundingBox();
        if (!box || box.height < 4) continue;
        await expect
          .soft(block)
          .toHaveScreenshot(`${name}-block-${String(i).padStart(2, "0")}.png`);
      }
    });
  });
}
