"use client";
import { useState } from "react";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";

export function ChangePasswordForm() {
  const supabase = supabaseBrowser();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Use at least 8 characters.");
    if (pw !== pw2) return toast.error("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    setPw("");
    setPw2("");
    toast.success("Password updated.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="np">New password</Label>
        <PasswordInput id="np" required value={pw} onChange={(e) => setPw(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="np2">Confirm</Label>
        <PasswordInput id="np2" required value={pw2} onChange={(e) => setPw2(e.target.value)} />
      </div>
      <Button type="submit" loading={busy}>
        {busy ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}
