import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  if (session?.user?.id) redirect(sp.next || "/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-xl font-semibold tracking-tight">De' Lead</div>
          <div className="text-sm text-muted-foreground">Content &amp; leads dashboard</div>
        </div>
        <LoginForm next={sp.next} error={sp.error} />
      </div>
    </main>
  );
}
