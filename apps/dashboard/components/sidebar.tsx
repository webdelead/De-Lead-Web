"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/nav";

const ALWAYS_OPEN = new Set(["Overview", "Admin"]);
const LS_KEY = "delead.sidebar.open";

export function Sidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();

  const groupHasActive = (g: NavGroup) =>
    g.items.some((it) => pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href)));

  const [open, setOpen] = useState<Record<string, boolean>>({});

  // initialise: remembered state, plus force-open the group holding the current page
  useEffect(() => {
    let saved: Record<string, boolean> = {};
    try {
      saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {}
    const next: Record<string, boolean> = {};
    for (const g of groups) {
      next[g.label] = ALWAYS_OPEN.has(g.label) || groupHasActive(g) || !!saved[g.label];
    }
    setOpen(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggle = (label: string) => {
    setOpen((o) => {
      const next = { ...o, [label]: !o[label] };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3">
      {groups.map((g) => {
        const collapsible = !ALWAYS_OPEN.has(g.label);
        const isOpen = open[g.label] ?? true;
        return (
          <div key={g.label} className="mb-1">
            {collapsible ? (
              <button
                onClick={() => toggle(g.label)}
                className="flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                <ChevronRight
                  className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")}
                />
                {g.label}
                {groupHasActive(g) && !isOpen && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ) : (
              <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {g.label}
              </div>
            )}

            {isOpen && (
              <ul className="mt-0.5 space-y-0.5 pl-2">
                {g.items.map((it) => {
                  const active =
                    pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
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
            )}
          </div>
        );
      })}
    </nav>
  );
}
