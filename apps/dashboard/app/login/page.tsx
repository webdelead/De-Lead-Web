import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(sp.next || "/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-xl font-semibold tracking-tight">De' Lead</div>
          <div className="text-sm text-muted-foreground">Content &amp; leads dashboard</div>
        </div>
        <LoginForm
          next={sp.next}
          error={sp.error === "no-access" ? "Your account has no dashboard access." : undefined}
        />
      </div>
    </main>
  );
}
