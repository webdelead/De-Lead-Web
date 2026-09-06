import { registerVisualTests } from "@delead/config/visual-spec.mjs";

// Baseline: on redesign/deleadint, before any change, run
//   pnpm --filter ./apps/deleadint test:visual -u
// and commit apps/deleadint/e2e/__screenshots__/. Then migrate; re-run to compare.
registerVisualTests();
