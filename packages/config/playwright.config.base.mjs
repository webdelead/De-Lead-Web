import { defineConfig, devices } from "@playwright/test";

/**
 * Shared Playwright config for the marketing sites' visual-regression gate
 * (docs/MIGRATION-CSS-TO-TAILWIND.md, prep step 4). Each app's
 * playwright.config.ts calls this with its dev-server port.
 *
 * The gate: capture full-page + per-section screenshots of the FROZEN site at
 * mobile / tablet / desktop as the baseline (on the redesign/<site> branch,
 * before touching anything: `pnpm --filter <app> test:visual -u`), then after
 * the Tailwind rewrite assert the new build matches within maxDiffPixelRatio.
 *
 * Does NOT cover motion / interaction (carousels, scroll-stack, nav, lightbox)
 * — those need manual QA per breakpoint. DB-backed sections render their
 * buildSafe() fallback (empty) state in both baseline and comparison, so the
 * gate still catches chrome/layout regressions around them.
 */
export function makeVisualConfig({ port, command } = {}) {
  if (!port) throw new Error("makeVisualConfig: { port } is required");
  const baseURL = `http://127.0.0.1:${port}`;

  return defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
    snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",

    expect: {
      toHaveScreenshot: {
        // ~1% of pixels may differ (antialiasing, sub-pixel text). Tighten per
        // site if it proves too loose.
        maxDiffPixelRatio: 0.01,
        animations: "disabled",
        scale: "css",
      },
    },

    use: {
      baseURL,
      reducedMotion: "reduce",
      // deterministic clock so the footer year / any Date-derived copy is stable
      timezoneId: "Asia/Kolkata",
    },

    // All three are chromium (headless shell) — the gate wants one deterministic
    // engine, not cross-browser coverage; only the viewport + touch flags differ.
    projects: [
      {
        name: "mobile",
        use: {
          ...devices["Desktop Chrome"],
          viewport: { width: 390, height: 844 },
          isMobile: true,
          hasTouch: true,
        },
      },
      {
        name: "tablet",
        use: {
          ...devices["Desktop Chrome"],
          viewport: { width: 834, height: 1112 },
          hasTouch: true,
        },
      },
      {
        name: "desktop",
        use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      },
    ],

    webServer: {
      command: command ?? "pnpm build && pnpm start",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: {
        // visual gate runs without a DB — DB sections render their fallback
        BUILD_ALLOW_DB_FALLBACK: "1",
        NODE_ENV: "production",
      },
    },
  });
}
