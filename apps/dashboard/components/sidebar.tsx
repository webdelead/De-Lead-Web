"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SidebarData, NavItem } from "@/lib/nav";

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };
}

function Row({
  href,
  label,
  active,
  strong,
}: {
  href: string;
  label: string;
  active: boolean;
  strong?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-md px-2.5 py-1.5 text-sm transition-colors",
        strong && "font-medium",
        active
          ? "sidebar-link-active"
          : "text-foreground/75 hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <ul className="mt-0.5 space-y-0.5">{children}</ul>
    </div>
  );
}

export function Sidebar({ overview, verticals, sections, admin }: SidebarData) {
  const pathname = usePathname();
  const isActive = useIsActive();

  const slugs = verticals.map((v) => v.slug);
  // which vertical are we inside? matches /slug/… and /c/slug/…
  const seg = pathname.match(/^\/(?:c\/)?([a-z0-9-]+)(?:\/|$)/)?.[1];
  const activeSlug = seg && slugs.includes(seg) ? seg : null;

  return (
    <nav className="flex h-full flex-col gap-4 overflow-y-auto p-3">
      <Section label="Overview">
        {overview.map((it) => (
          <li key={it.href}>
            <Row href={it.href} label={it.label} active={isActive(it.href)} />
          </li>
        ))}
      </Section>

      <Section label="Verticals">
        {verticals.map((v) => {
          const here = v.slug === activeSlug;
          const secs = (sections[v.slug] ?? []).filter((s) => s.href !== v.href);
          return (
            <li key={v.slug}>
              <Row
                href={v.href}
                label={v.name}
                strong
                active={pathname === v.href}
              />
              {here && secs.length > 0 && (
                <ul className="my-0.5 ml-2.5 space-y-0.5 border-l pl-3">
                  {secs.map((s: NavItem) => (
                    <li key={s.href}>
                      <Row href={s.href} label={s.label} active={isActive(s.href)} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </Section>

      {admin && (
        <Section label="Admin">
          {admin.map((it) => (
            <li key={it.href}>
              <Row href={it.href} label={it.label} active={isActive(it.href)} />
            </li>
          ))}
        </Section>
      )}
    </nav>
  );
}
