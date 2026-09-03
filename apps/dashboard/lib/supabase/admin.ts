import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Service-role client — user management only. Never import into client code. */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
