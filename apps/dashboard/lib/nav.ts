import type { Session } from "@/lib/authz";
import { VERTICAL_LIST, verticalByKey } from "@delead/brand/verticals";
import { RESOURCES } from "@/lib/resources";
import { isSuperAdmin, visibleVerticals } from "@/lib/authz";

export interface NavItem {
  label: string;
  href: string;
}

export interface VerticalEntry {
  slug: string;
  name: string;
  href: string;
}

export interface SidebarData {
  /** global items, always shown at the top */
  overview: NavItem[];
  /** flat list of verticals the user can see — click one to go to its overview */
  verticals: VerticalEntry[];
  /** each vertical's section links (keyed by slug), shown under the active one */
  sections: Record<string, NavItem[]>;
  /** super-admin-only items, or null */
  admin: NavItem[] | null;
}

/** Section links for one vertical: Overview + Leads + its content resources
 *  + Bookings / Settings where applicable. */
export function verticalSections(dbKey: string): NavItem[] {
  const v = verticalByKey(dbKey);
  if (!v) return [];
  const items: NavItem[] = [{ label: "Overview", href: `/${v.slug}` }];

  // TinkerChamps takes bookings, not enquiries — no Leads screen for it
  if (!v.content.includes("tc_bookings")) {
    items.push({ label: "Leads", href: `/${v.slug}/leads` });
  }

  for (const [rKey, def] of Object.entries(RESOURCES)) {
    if (def.verticals.includes(dbKey) || def.fixedVertical === dbKey) {
      items.push({ label: def.label, href: `/c/${v.slug}/${rKey}` });
    }
  }

  if (v.content.includes("tc_bookings")) {
    items.push({ label: "Bookings", href: `/${v.slug}/bookings` });
  }
  if (v.content.includes("site_settings")) {
    items.push({ label: "Settings", href: `/${v.slug}/settings` });
  }
  return items;
}

/** Build the flat, hub-and-spoke sidebar from the user's grants. */
export function buildSidebar(session: Session): SidebarData {
  const canView = visibleVerticals(session, "view");
  const verticals: VerticalEntry[] = [];
  const sections: Record<string, NavItem[]> = {};

  for (const key of canView) {
    const v = verticalByKey(key);
    if (!v) continue;
    verticals.push({ slug: v.slug, name: v.name, href: `/${v.slug}` });
    sections[v.slug] = verticalSections(key);
  }

  return {
    overview: [
      { label: "Dashboard", href: "/" },
      { label: "Leads", href: "/leads" },
    ],
    verticals,
    sections,
    admin: isSuperAdmin(session)
      ? [
          { label: "Users", href: "/users" },
          { label: "Audit log", href: "/audit" },
          { label: "System", href: "/settings" },
        ]
      : null,
  };
}

export { VERTICAL_LIST };
