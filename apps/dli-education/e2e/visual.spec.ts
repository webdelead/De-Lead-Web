import { registerVisualTests } from "@delead/config/visual-spec.mjs";

// dli-education is a 3-page site — gate all three routes.
// Baseline: on redesign/dli-education, before any change, run
//   pnpm --filter ./apps/dli-education test:visual -u
// and commit apps/dli-education/e2e/__screenshots__/. Then migrate; re-run to compare.
registerVisualTests();
registerVisualTests({ path: "/students", name: "students" });
registerVisualTests({ path: "/professionals", name: "professionals" });
