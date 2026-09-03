import * as s from "@delead/db/schema";
import type { PgTable } from "drizzle-orm/pg-core";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "richtext" // TipTap block editor → jsonb
  | "boolean"
  | "select"
  | "image"
  | "number"
  | "stats"; // tc_events repeater

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  span?: 1 | 2;
  defaultValue?: unknown;
}

export interface ColumnDef {
  key: string;
  label: string;
  kind?: "text" | "bool" | "image" | "badge" | "date";
}

export interface ResourceDef {
  key: string;
  label: string;
  singular: string;
  table: PgTable;
  /** filtered by the [vertical] route param via a `vertical` column */
  verticalScoped: boolean;
  /** belongs to one vertical but has no `vertical` column (e.g. courses) */
  fixedVertical?: string;
  /** which verticals may see this resource (db keys); [] = derive from registry */
  verticals: string[];
  orderable: boolean;
  search: string[];
  columns: ColumnDef[];
  fields: FieldDef[];
  /** extra list filter over a column with a fixed option set */
  filterField?: { name: string; label: string; options: string[] };
}

const ICONS = ["calendar", "book", "star", "bird"];

export const RESOURCES: Record<string, ResourceDef> = {
  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    table: s.testimonials,
    verticalScoped: true,
    verticals: ["deleadint", "walk2lead", "makerchamps", "corporate", "dli_education", "tinkerchamps"],
    orderable: true,
    search: ["quote", "author_name"],
    columns: [
      { key: "quote", label: "Quote" },
      { key: "author_name", label: "Author" },
      { key: "author_role", label: "Role" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true, span: 2 },
      { name: "author_name", label: "Author name", type: "text", required: true },
      { name: "author_role", label: "Author role", type: "text" },
      { name: "source_note", label: "Source note", type: "text", help: "e.g. “on Walk2Lead”, or how it was collected" },
      { name: "avatar_asset_id", label: "Avatar (optional)", type: "image" },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  gallery_images: {
    key: "gallery_images",
    label: "Gallery",
    singular: "Image",
    table: s.galleryImages,
    verticalScoped: true,
    verticals: ["deleadint", "walk2lead", "makerchamps", "corporate", "tinkerchamps"],
    orderable: true,
    search: ["title"],
    columns: [
      { key: "asset_id", label: "Image", kind: "image" },
      { key: "title", label: "Caption" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "asset_id", label: "Image", type: "image", required: true },
      { name: "title", label: "Caption / alt", type: "text" },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  whatsapp_reviews: {
    key: "whatsapp_reviews",
    label: "WhatsApp reviews",
    singular: "Review",
    table: s.whatsappReviews,
    verticalScoped: true,
    verticals: ["tinkerchamps"],
    orderable: true,
    search: ["title"],
    columns: [
      { key: "asset_id", label: "Screenshot", kind: "image" },
      { key: "title", label: "Label" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "asset_id", label: "Screenshot", type: "image", required: true },
      { name: "title", label: "Label (internal)", type: "text" },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  press_clippings: {
    key: "press_clippings",
    label: "Press / newspaper cuttings",
    singular: "Clipping",
    table: s.pressClippings,
    verticalScoped: true,
    verticals: ["deleadint", "walk2lead"],
    orderable: true,
    search: ["title", "publication"],
    columns: [
      { key: "asset_id", label: "Scan", kind: "image" },
      { key: "title", label: "Title" },
      { key: "publication", label: "Publication" },
      { key: "date_str", label: "Date" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "asset_id", label: "Scan / photo", type: "image", required: true },
      { name: "title", label: "Headline / title", type: "text" },
      { name: "publication", label: "Publication", type: "text" },
      { name: "date_str", label: "Date (free text)", type: "text", help: "e.g. “Feb 2026”" },
      { name: "link_url", label: "Article link (optional)", type: "text" },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  blog_posts: {
    key: "blog_posts",
    label: "Journal",
    singular: "Post",
    table: s.blogPosts,
    verticalScoped: false,
    fixedVertical: "deleadint",
    verticals: ["deleadint"],
    orderable: false,
    search: ["title", "tag"],
    columns: [
      { key: "title", label: "Title" },
      { key: "tag", label: "Tag" },
      { key: "status", label: "Status", kind: "badge" },
      { key: "published_at", label: "Published", kind: "date" },
    ],
    filterField: { name: "status", label: "Status", options: ["draft", "published"] },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "slug", label: "Slug", type: "text", required: true, help: "URL path; auto-filled from title" },
      { name: "tag", label: "Tag", type: "text", help: "e.g. TinkerChamps, MakerChamps" },
      { name: "excerpt", label: "Excerpt", type: "textarea", span: 2 },
      { name: "cover_asset_id", label: "Cover image", type: "image" },
      { name: "body_json", label: "Body", type: "richtext", span: 2 },
      { name: "author_name", label: "Author", type: "text", defaultValue: "De' Lead International" },
      { name: "status", label: "Status", type: "select", options: ["draft", "published"], defaultValue: "draft" },
    ],
  },

  courses: {
    key: "courses",
    label: "Courses",
    singular: "Course",
    table: s.courses,
    verticalScoped: false,
    fixedVertical: "dli_education",
    verticals: ["dli_education"],
    orderable: true,
    search: ["title", "track"],
    columns: [
      { key: "title", label: "Title" },
      { key: "audience", label: "Audience", kind: "badge" },
      { key: "track", label: "Track" },
      { key: "level", label: "Level" },
      { key: "duration_label", label: "Duration" },
      { key: "is_featured", label: "Featured", kind: "bool" },
    ],
    filterField: { name: "audience", label: "Audience", options: ["students", "professionals"] },
    fields: [
      { name: "audience", label: "Audience", type: "select", options: ["students", "professionals"], required: true },
      { name: "track", label: "Track", type: "text", required: true, help: "e.g. AI & Data, Coding & Web" },
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "level", label: "Level", type: "select", options: ["Beginner", "Intermediate", "All levels"], defaultValue: "Beginner" },
      { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
      { name: "age_label", label: "Age label", type: "text", help: "e.g. “Ages 12+”" },
      { name: "format", label: "Format", type: "text", help: "e.g. “Group or 1-to-1”" },
      { name: "duration_label", label: "Duration label", type: "text", help: "e.g. “32 hrs”" },
      { name: "is_featured", label: "Feature on landing page", type: "boolean" },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  student_outcomes: {
    key: "student_outcomes",
    label: "Student stories",
    singular: "Story",
    table: s.studentOutcomes,
    verticalScoped: true,
    verticals: ["dli_education", "walk2lead"],
    orderable: true,
    search: ["name", "win"],
    columns: [
      { key: "name", label: "Name" },
      { key: "place", label: "School / place" },
      { key: "tag", label: "Tag" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "name", label: "Student name(s)", type: "text", required: true },
      { name: "place", label: "School / place", type: "text" },
      { name: "win", label: "What they did", type: "textarea", required: true, span: 2 },
      { name: "tag", label: "Tag", type: "text", help: "e.g. Python, Robotics" },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  w2l_projects: {
    key: "w2l_projects",
    label: "Student projects",
    singular: "Project",
    table: s.w2lProjects,
    verticalScoped: false,
    fixedVertical: "walk2lead",
    verticals: ["walk2lead"],
    orderable: true,
    search: ["title", "category"],
    columns: [
      { key: "asset_id", label: "Photo", kind: "image" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "asset_id", label: "Photo", type: "image" },
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "category", label: "Category chip", type: "text", help: "e.g. Healthcare, Home Safety" },
      { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  w2l_phases: {
    key: "w2l_phases",
    label: "Phase log",
    singular: "Phase",
    table: s.w2lPhases,
    verticalScoped: false,
    fixedVertical: "walk2lead",
    verticals: ["walk2lead"],
    orderable: true,
    search: ["label", "districts"],
    columns: [
      { key: "label", label: "Phase" },
      { key: "districts", label: "Districts" },
      { key: "schools", label: "Schools" },
      { key: "students", label: "Students" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "label", label: "Label", type: "text", required: true, help: "e.g. “Phase 4”" },
      { name: "districts", label: "Districts", type: "text", required: true },
      { name: "schools", label: "Schools", type: "number", defaultValue: 0 },
      { name: "students", label: "Students", type: "number", defaultValue: 0 },
      { name: "status", label: "Status", type: "text", help: "e.g. “currently running”" },
      { name: "note", label: "Note", type: "textarea", span: 2 },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  track_record: {
    key: "track_record",
    label: "Track record",
    singular: "Engagement",
    table: s.trackRecord,
    verticalScoped: false,
    fixedVertical: "corporate",
    verticals: ["corporate"],
    orderable: true,
    search: ["client", "blurb"],
    columns: [
      { key: "when_label", label: "When" },
      { key: "client", label: "Client" },
      { key: "badge", label: "Badge" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "when_label", label: "When", type: "text", required: true, help: "e.g. “Feb 2023”" },
      { name: "client", label: "Client", type: "text", required: true },
      { name: "blurb", label: "What happened", type: "textarea", required: true, span: 2 },
      { name: "badge", label: "Badge", type: "text", help: "e.g. “100 staff”, “2 days · 35 people”" },
      { name: "is_active", label: "Show on site", type: "boolean", defaultValue: true },
    ],
  },

  site_stats: {
    key: "site_stats",
    label: "Stat counters",
    singular: "Stat",
    table: s.siteStats,
    verticalScoped: true,
    verticals: ["deleadint", "walk2lead", "makerchamps", "corporate", "dli_education", "tinkerchamps"],
    orderable: true,
    search: ["label"],
    columns: [
      { key: "value", label: "Value" },
      { key: "suffix", label: "Suffix" },
      { key: "label", label: "Label" },
      { key: "group_key", label: "Group" },
    ],
    fields: [
      { name: "value", label: "Value", type: "text", required: true, help: "digits count up (e.g. 5000); text stays (e.g. “India & UAE”)" },
      { name: "suffix", label: "Suffix", type: "text", help: "e.g. “+”" },
      { name: "label", label: "Label", type: "text", required: true, span: 2 },
      { name: "group_key", label: "Group", type: "text", defaultValue: "default", help: "which band on the page" },
    ],
  },

  tc_events: {
    key: "tc_events",
    label: "Events",
    singular: "Event",
    table: s.tcEvents,
    verticalScoped: false,
    fixedVertical: "tinkerchamps",
    verticals: ["tinkerchamps"],
    orderable: true,
    search: ["title", "location"],
    columns: [
      { key: "logo_asset_id", label: "Logo", kind: "image" },
      { key: "title", label: "Title" },
      { key: "date_str", label: "Dates" },
      { key: "location", label: "Location" },
      { key: "is_featured", label: "Featured", kind: "bool" },
      { key: "is_active", label: "Active", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "logo_asset_id", label: "Event logo", type: "image" },
      { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
      { name: "date_str", label: "Dates (free text)", type: "text", required: true, help: "e.g. “May 18–20, 2026”" },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "audience", label: "Audience tag", type: "text", defaultValue: "Students" },
      { name: "duration", label: "Duration tag", type: "text", defaultValue: "3 Days Residential" },
      { name: "inclusion", label: "Inclusion tag", type: "text", defaultValue: "Food Included" },
      { name: "is_featured", label: "Featured", type: "boolean" },
      { name: "is_active", label: "Show in booking selector", type: "boolean", defaultValue: true },
      { name: "stats", label: "Highlight stats (max 4)", type: "stats", span: 2 },
    ],
  },
};

export const STAT_ICONS = ICONS;

export function resourceFor(key: string): ResourceDef {
  const r = RESOURCES[key];
  if (!r) throw new Error(`unknown resource: ${key}`);
  return r;
}
