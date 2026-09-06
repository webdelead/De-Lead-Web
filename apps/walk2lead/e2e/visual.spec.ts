import { registerVisualTests } from "@delead/config/visual-spec.mjs";

// Baseline: on redesign/walk2lead, before any change, run
//   pnpm --filter ./apps/walk2lead test:visual -u
// and commit apps/walk2lead/e2e/__screenshots__/. Then migrate; re-run to compare.
registerVisualTests();
