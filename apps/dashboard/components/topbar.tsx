"use client";
import { logoutAction } from "@/app/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, User } from "lucide-react";

export function Topbar({ name, email, role }: { name: string; email: string; role: string }) {
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
          <form action={logoutAction}>
            <button type="submit" className="w-full">
              <DropdownMenuItem asChild>
                <span className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" /> Sign out
                </span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
