import { registerVisualTests } from "@delead/config/visual-spec.mjs";

// Baseline: on redesign/makerchamps, before any change, run
//   pnpm --filter ./apps/makerchamps test:visual -u
// and commit apps/makerchamps/e2e/__screenshots__/. Then migrate; re-run to compare.
registerVisualTests();
