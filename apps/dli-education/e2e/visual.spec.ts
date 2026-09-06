import { registerVisualTests } from "@delead/config/visual-spec.mjs";

// Baseline: on redesign/dli-education, before any change, run
//   pnpm --filter ./apps/dli-education test:visual -u
// and commit apps/dli-education/e2e/__screenshots__/. Then migrate; re-run to compare.
registerVisualTests();
