"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, KeyRound, Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";

export function Topbar({ name, email, role }: { name: string; email: string; role: string }) {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="font-semibold tracking-tight">De' Lead Admin</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{name}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs font-normal text-muted-foreground">{email}</div>
            <div className="mt-1 text-xs font-normal capitalize text-muted-foreground">
              {role.replace("_", " ")}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex w-full items-center gap-2">
              <KeyRound className="h-4 w-4" /> Change password
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={signingOut}
            onSelect={(e) => (e.preventDefault(), signOut())}
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}{" "}
            {signingOut ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
