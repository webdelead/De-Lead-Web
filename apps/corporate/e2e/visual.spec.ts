import { registerVisualTests } from "@delead/config/visual-spec.mjs";

// Baseline: on redesign/corporate, before any change, run
//   pnpm --filter ./apps/corporate test:visual -u
// and commit apps/corporate/e2e/__screenshots__/. Then migrate; re-run to compare.
registerVisualTests();
