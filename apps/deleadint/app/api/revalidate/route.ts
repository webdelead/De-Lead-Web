import { makeRevalidateRoute } from "@delead/shared";

/** Called by the dashboard's "Publish to site" button (shared impl). */
export const { POST } = makeRevalidateRoute();
