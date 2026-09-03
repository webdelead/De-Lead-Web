/** The single source of truth for the six managed verticals (+ Goal Finder, link-only).
 *  Consumed by @delead/db (enum), the dashboard (RBAC, nav, filters) and every site
 *  (ecosystem menu, canonical URLs, CORS). */

export type VerticalSlug =
  | "deleadint"
  | "walk2lead"
  | "makerchamps"
  | "corporate"
  | "dli-education"
  | "tinkerchamps";

export interface Vertical {
  slug: VerticalSlug;
  /** db enum value (Postgres identifiers can't have hyphens) */
  key: string;
  name: string;
  shortName: string;
  /** primary marketing host */
  host: string;
  /** extra hosts that 301 to `host` */
  aliasHosts: string[];
  accent: string;
  accentInk: string;
  /** content types this vertical exposes in the dashboard */
  content: ContentType[];
  external?: boolean;
}

export type ContentType =
  | "leads"
  | "testimonials"
  | "gallery"
  | "whatsapp_reviews"
  | "press_clippings"
  | "blog_posts"
  | "site_stats"
  | "site_settings"
  | "tc_events"
  | "tc_bookings"
  | "courses"
  | "student_outcomes"
  | "w2l_projects"
  | "w2l_phases"
  | "track_record";

export const VERTICALS: Record<VerticalSlug, Vertical> = {
  deleadint: {
    slug: "deleadint",
    key: "deleadint",
    name: "De' Lead International",
    shortName: "Hub",
    host: "https://deleadint.com",
    aliasHosts: ["https://www.deleadint.com"],
    accent: "#750649",
    accentInk: "#ffffff",
    content: ["leads", "blog_posts", "press_clippings", "testimonials", "gallery", "site_stats"],
  },
  walk2lead: {
    slug: "walk2lead",
    key: "walk2lead",
    name: "Walk2Lead",
    shortName: "W2L",
    host: "https://w2l.deleadint.com",
    aliasHosts: ["https://walk2lead.deleadint.com"],
    accent: "#c81c1c",
    accentInk: "#ffffff",
    content: [
      "leads",
      "press_clippings",
      "w2l_projects",
      "w2l_phases",
      "testimonials",
      "site_stats",
      "gallery",
    ],
  },
  makerchamps: {
    slug: "makerchamps",
    key: "makerchamps",
    name: "MakerChamps",
    shortName: "MC",
    host: "https://mc.deleadint.com",
    aliasHosts: ["https://makerchamps.deleadint.com"],
    accent: "#fe5501",
    accentInk: "#04122e",
    content: ["leads", "testimonials", "gallery", "site_stats", "site_settings"],
  },
  corporate: {
    slug: "corporate",
    key: "corporate",
    name: "Corporate Training",
    shortName: "Corporate",
    host: "https://corporate.deleadint.com",
    aliasHosts: [],
    accent: "#750649",
    accentInk: "#ffffff",
    content: ["leads", "testimonials", "track_record", "gallery", "site_stats"],
  },
  "dli-education": {
    slug: "dli-education",
    key: "dli_education",
    name: "DLI Education",
    shortName: "DLI Edu",
    host: "https://edu.deleadint.com",
    aliasHosts: [],
    accent: "#29bac1",
    accentInk: "#06232b",
    content: ["leads", "courses", "student_outcomes", "testimonials", "site_stats"],
  },
  tinkerchamps: {
    slug: "tinkerchamps",
    key: "tinkerchamps",
    name: "TinkerChamps",
    shortName: "TC",
    host: "https://tc.deleadint.com",
    aliasHosts: ["https://tinkerchamps.deleadint.com"],
    accent: "#5021b0",
    accentInk: "#ffffff",
    content: [
      "leads",
      "tc_events",
      "tc_bookings",
      "gallery",
      "whatsapp_reviews",
      "testimonials",
      "site_settings",
    ],
  },
};

export const VERTICAL_LIST: Vertical[] = Object.values(VERTICALS);

/** Goal Finder is not managed here — external site, link only. */
export const GOAL_FINDER = {
  name: "Goal Finder",
  url: "https://goalfinder.org/",
} as const;

export const DB_VERTICAL_KEYS = VERTICAL_LIST.map((v) => v.key);

export function verticalByKey(key: string): Vertical | undefined {
  return VERTICAL_LIST.find((v) => v.key === key);
}
