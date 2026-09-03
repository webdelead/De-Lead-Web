"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/nav";

export function Sidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-1 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {g.label}
          </div>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active =
                pathname === it.href ||
                (it.href !== "/" && pathname.startsWith(it.href));
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
