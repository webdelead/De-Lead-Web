import type { Session } from "@/lib/authz";
import { VERTICAL_LIST, verticalByKey } from "@delead/brand/verticals";
import { RESOURCES } from "@/lib/resources";
import { isSuperAdmin, visibleVerticals } from "@/lib/authz";

export interface NavItem {
  label: string;
  href: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Build the sidebar from the user's grants + the resource registry. */
export function buildNav(session: Session): NavGroup[] {
  const groups: NavGroup[] = [];
  const canView = visibleVerticals(session, "view");

  groups.push({
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Leads", href: "/leads" },
    ],
  });

  for (const key of canView) {
    const v = verticalByKey(key);
    if (!v) continue;
    const items: NavItem[] = [];

    // resources this vertical exposes, in registry order
    for (const [rKey, def] of Object.entries(RESOURCES)) {
      const applies =
        def.verticals.includes(key) || def.fixedVertical === key;
      if (!applies) continue;
      items.push({ label: def.label, href: `/c/${v.slug}/${rKey}` });
    }
    if (v.content.includes("tc_bookings")) {
      items.push({ label: "Bookings", href: `/${v.slug}/bookings` });
    }
    if (v.content.includes("site_settings")) {
      items.push({ label: "Settings", href: `/${v.slug}/settings` });
    }
    if (items.length) groups.push({ label: v.name, items });
  }

  if (isSuperAdmin(session)) {
    groups.push({
      label: "Admin",
      items: [
        { label: "Users", href: "/users" },
        { label: "Audit log", href: "/audit" },
        { label: "System", href: "/settings" },
      ],
    });
  }
  return groups;
}

export { VERTICAL_LIST };
