import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { safeNext } from "@/lib/utils";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[var(--brand-deep)] p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(600px circle at 20% 20%, rgba(156,46,115,0.45), transparent 60%), radial-gradient(700px circle at 90% 90%, rgba(117,6,73,0.5), transparent 55%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/delead-mark.svg" alt="" className="h-10 w-10" />
          <span className="text-lg font-semibold tracking-tight">De&apos; Lead International</span>
        </div>
        <div className="relative max-w-md space-y-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            One place for every site, lead and story.
          </h1>
          <p className="text-white/70">
            Manage content, testimonials, galleries, press and enquiries across the whole De&apos;
            Lead ecosystem — then publish to any site in seconds.
          </p>
        </div>
        <div className="relative text-xs text-white/50">
          Corporate Training · TinkerChamps · MakerChamps · DLI Education · Walk2Lead
        </div>
      </div>

      {/* form panel */}
      <div className="app-canvas flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/delead-mark.svg" alt="" className="h-7 w-7" />
              <span className="text-lg font-semibold tracking-tight">De&apos; Lead Admin</span>
            </div>
          </div>
          <div className="mb-6 hidden lg:block">
            <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">Use your De&apos; Lead admin account.</p>
          </div>
          <LoginForm
            next={next}
            error={sp.error === "no-access" ? "Your account has no dashboard access." : undefined}
          />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Trouble signing in? Contact your workspace admin.
          </p>
        </div>
      </div>
    </main>
  );
}
