"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { Card, CardContent } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase sets a recovery session from the email link (hash fragment).
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setErr("This reset link is invalid or has expired. Request a new one.");
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setErr(null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pw.length < 8) return setErr("Use at least 8 characters.");
    if (pw !== pw2) return setErr("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(error.message);
    setDone(true);
    setTimeout(() => {
      router.replace("/");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-xl font-semibold tracking-tight">Set a new password</div>
        </div>
        <Card>
          <CardContent className="pt-6">
            {!ready ? (
              <p className="text-sm text-muted-foreground">Checking link…</p>
            ) : done ? (
              <p className="text-sm text-emerald-600">Password updated. Signing you in…</p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pw">New password</Label>
                  <PasswordInput id="pw" required value={pw} onChange={(e) => setPw(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw2">Confirm password</Label>
                  <PasswordInput
                    id="pw2"
                    required
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                  />
                </div>
                {err && <p className="text-sm text-destructive">{err}</p>}
                <Button type="submit" className="w-full" loading={busy}>
                  {busy ? "Saving…" : "Update password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
