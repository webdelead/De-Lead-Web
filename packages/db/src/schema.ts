/* ============================================================
   De' Lead Web — Postgres schema (Drizzle)
   One database, one admin dashboard, six marketing sites.
   Sites read this at build time; the dashboard reads+writes it.
   ============================================================ */

import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

/* ---------- enums ---------- */
export const userRole = pgEnum("user_role", ["super_admin", "staff"]);
export const accessLevel = pgEnum("access_level", ["view", "edit"]);
export const vertical = pgEnum("vertical", [
  "deleadint",
  "walk2lead",
  "makerchamps",
  "corporate",
  "dli_education",
  "tinkerchamps",
]);
export const contentStatus = pgEnum("content_status", ["draft", "published"]);
export const storageProvider = pgEnum("storage_provider", ["supabase", "r2"]);
export const courseAudience = pgEnum("course_audience", ["students", "professionals"]);

/* ---------- shared column bundles ---------- */
const id = () => uuid("id").defaultRandom().primaryKey();
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};
const ordered = {
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
};

/* ============================================================
   AUTH & ACCESS
   ============================================================ */

/* Profile row, one per Supabase Auth user. `id` = auth.users.uid (not random).
   Passwords, email verification and reset are handled entirely by Supabase Auth. */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    role: userRole("role").default("staff").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_uk").on(sql`lower(${t.email})`)],
);

export const userVerticalAccess = pgTable(
  "user_vertical_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    vertical: vertical("vertical").notNull(),
    level: accessLevel("level").default("view").notNull(),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.userId, t.vertical] })],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    userEmail: text("user_email"),
    action: text("action").notNull(), // create | update | delete | publish | login | invite | access_change
    entity: text("entity").notNull(), // table name
    entityId: text("entity_id"),
    vertical: vertical("vertical"),
    diff: jsonb("diff").$type<Record<string, unknown>>(),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index("audit_log_created_idx").on(t.createdAt),
    index("audit_log_user_idx").on(t.userId),
    index("audit_log_entity_idx").on(t.entity, t.entityId),
  ],
);

/* ============================================================
   LEADS  (every site's enquiry form → here)
   ============================================================ */

export const leads = pgTable(
  "leads",
  {
    id: id(),
    source: vertical("source").notNull(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    interest: text("interest"),
    message: text("message"),
    pagePath: text("page_path"),
    userAgent: text("user_agent"),
    ipHash: text("ip_hash"),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index("leads_source_created_idx").on(t.source, t.createdAt),
    index("leads_created_idx").on(t.createdAt),
  ],
);

/* ============================================================
   ASSETS  (every Storage upload; content refers to asset_id)
   ============================================================ */

export const assets = pgTable(
  "assets",
  {
    id: id(),
    provider: storageProvider("provider").default("supabase").notNull(),
    bucket: text("bucket").notNull(),
    path: text("path").notNull(),
    mime: text("mime").notNull(),
    width: integer("width"),
    height: integer("height"),
    bytes: integer("bytes").notNull(),
    alt: text("alt").default("").notNull(),
    vertical: vertical("vertical"),
    uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [uniqueIndex("assets_provider_bucket_path_uk").on(t.provider, t.bucket, t.path)],
);

/* ============================================================
   TINKERCHAMPS  (replaces Sanity)
   ============================================================ */

export const tcEvents = pgTable(
  "tc_events",
  {
    id: id(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    logoAssetId: uuid("logo_asset_id").references(() => assets.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    dateStr: text("date_str").notNull(), // "May 18–20, 2026"
    location: text("location").notNull(),
    audience: text("audience").default("Students").notNull(),
    duration: text("duration").default("3 Days Residential").notNull(),
    inclusion: text("inclusion").default("Food Included").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    // stats: [{ icon: 'calendar'|'book'|'star'|'bird', title, text }] max 4
    stats: jsonb("stats").$type<{ icon: string; title: string; text: string }[]>().default([]).notNull(),
    ...ordered,
    ...timestamps,
  },
  (t) => [uniqueIndex("tc_events_slug_uk").on(t.slug)],
);

/* Single-form booking: 5 fields. The wider Sanity-era set (age, gender, school,
   district, email, program) was dropped 2026-09 — re-addable later. */
export const tcBookings = pgTable(
  "tc_bookings",
  {
    id: id(),
    parentName: text("parent_name").notNull(),
    studentName: text("student_name").notNull(),
    classGrade: text("class_grade").notNull(),
    phone: text("phone").notNull(),
    place: text("place").notNull(), // "Location"
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("tc_bookings_created_idx").on(t.createdAt)],
);

/* ============================================================
   SHARED CONTENT  (vertical-scoped)
   ============================================================ */

export const galleryImages = pgTable(
  "gallery_images",
  {
    id: id(),
    vertical: vertical("vertical").notNull(),
    title: text("title").default("").notNull(),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "restrict" }),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("gallery_vertical_idx").on(t.vertical, t.sortOrder)],
);

export const whatsappReviews = pgTable(
  "whatsapp_reviews",
  {
    id: id(),
    vertical: vertical("vertical").default("tinkerchamps").notNull(),
    title: text("title").default("").notNull(),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "restrict" }),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("wa_reviews_vertical_idx").on(t.vertical, t.sortOrder)],
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: id(),
    vertical: vertical("vertical").notNull(),
    quote: text("quote").notNull(),
    authorName: text("author_name").notNull(),
    authorRole: text("author_role").default("").notNull(),
    avatarAssetId: uuid("avatar_asset_id").references(() => assets.id, { onDelete: "set null" }),
    sourceNote: text("source_note").default("").notNull(),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("testimonials_vertical_idx").on(t.vertical, t.sortOrder)],
);

export const pressClippings = pgTable(
  "press_clippings",
  {
    id: id(),
    vertical: vertical("vertical").notNull(),
    title: text("title").default("").notNull(),
    publication: text("publication").default("").notNull(),
    dateStr: text("date_str").default("").notNull(),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "restrict" }),
    linkUrl: text("link_url"),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("press_vertical_idx").on(t.vertical, t.sortOrder)],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: id(),
    vertical: vertical("vertical"), // null = hub Journal
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").default("").notNull(),
    coverAssetId: uuid("cover_asset_id").references(() => assets.id, { onDelete: "set null" }),
    bodyMd: text("body_md").default("").notNull(),
    tag: text("tag").default("").notNull(),
    status: contentStatus("status").default("draft").notNull(),
    authorName: text("author_name").default("De' Lead International").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("blog_slug_uk").on(t.slug),
    index("blog_status_idx").on(t.status, t.publishedAt),
  ],
);

export const courses = pgTable(
  "courses",
  {
    id: id(),
    audience: courseAudience("audience").notNull(),
    track: text("track").notNull(), // "AI & Data", "Coding & Web", ...
    title: text("title").notNull(),
    level: text("level").default("Beginner").notNull(),
    description: text("description").notNull(),
    ageLabel: text("age_label").default("").notNull(), // "Ages 12+"
    format: text("format").default("").notNull(), // "Group or 1-to-1"
    durationLabel: text("duration_label").default("").notNull(), // "32 hrs"
    isFeatured: boolean("is_featured").default(false).notNull(),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("courses_audience_idx").on(t.audience, t.sortOrder)],
);

export const studentOutcomes = pgTable(
  "student_outcomes",
  {
    id: id(),
    vertical: vertical("vertical").default("dli_education").notNull(),
    name: text("name").notNull(),
    place: text("place").default("").notNull(),
    win: text("win").notNull(),
    tag: text("tag").default("").notNull(),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("outcomes_vertical_idx").on(t.vertical, t.sortOrder)],
);

export const w2lProjects = pgTable(
  "w2l_projects",
  {
    id: id(),
    title: text("title").notNull(),
    category: text("category").default("").notNull(),
    description: text("description").notNull(),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("w2l_projects_order_idx").on(t.sortOrder)],
);

export const w2lPhases = pgTable(
  "w2l_phases",
  {
    id: id(),
    label: text("label").notNull(), // "Phase 4"
    districts: text("districts").notNull(),
    schools: integer("schools").default(0).notNull(),
    students: integer("students").default(0).notNull(),
    status: text("status").default("").notNull(), // "currently running"
    note: text("note").default("").notNull(),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("w2l_phases_order_idx").on(t.sortOrder)],
);

export const trackRecord = pgTable(
  "track_record",
  {
    id: id(),
    whenLabel: text("when_label").notNull(), // "Feb 2023"
    client: text("client").notNull(),
    blurb: text("blurb").notNull(),
    badge: text("badge").default("").notNull(),
    ...ordered,
    ...timestamps,
  },
  (t) => [index("track_record_order_idx").on(t.sortOrder)],
);

export const siteStats = pgTable(
  "site_stats",
  {
    id: id(),
    vertical: vertical("vertical").notNull(),
    groupKey: text("group_key").default("default").notNull(), // "hero", "big-numbers"
    label: text("label").notNull(),
    value: text("value").notNull(), // "5000" | "India & UAE"
    suffix: text("suffix").default("").notNull(), // "+"
    ...ordered,
    ...timestamps,
  },
  (t) => [index("site_stats_vertical_idx").on(t.vertical, t.groupKey, t.sortOrder)],
);

export const siteSettings = pgTable(
  "site_settings",
  {
    id: id(),
    vertical: vertical("vertical").notNull(),
    key: text("key").notNull(), // "next_season", "hero"
    value: jsonb("value").$type<Record<string, unknown>>().default({}).notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("site_settings_vertical_key_uk").on(t.vertical, t.key)],
);

/* ============================================================
   OPS
   ============================================================ */

export const pingLog = pgTable("ping_log", {
  id: id(),
  source: text("source").default("cron").notNull(),
  checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
});

/* Transactional outbox for outbound webhooks (Google Apps Script mirror of
   leads / bookings). The row is written in the same tx as the lead/booking, so
   it survives a dropped request; a drain (opportunistic on the next write +
   a periodic GitHub Action) POSTs it with retry + backoff. */
export const outboxStatus = pgEnum("outbox_status", ["pending", "sent", "failed"]);

export const outbox = pgTable(
  "outbox",
  {
    id: id(),
    kind: text("kind").notNull(), // "lead" | "booking"
    targetUrl: text("target_url").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    status: outboxStatus("status").default("pending").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    lastError: text("last_error"),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (t) => [index("outbox_drain_idx").on(t.status, t.nextAttemptAt)],
);

/* per-vertical "unpublished changes" tracking + last deploy trigger */
export const publishState = pgTable(
  "publish_state",
  {
    vertical: vertical("vertical").primaryKey(),
    dirtyCount: integer("dirty_count").default(0).notNull(),
    lastPublishedAt: timestamp("last_published_at", { withTimezone: true }),
    lastPublishedBy: uuid("last_published_by").references(() => users.id, { onDelete: "set null" }),
  },
);

/* ---------- type exports ---------- */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type TcEvent = typeof tcEvents.$inferSelect;
export type TcBooking = typeof tcBookings.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type PressClipping = typeof pressClippings.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type OutboxRow = typeof outbox.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type WhatsappReview = typeof whatsappReviews.$inferSelect;
export type StudentOutcome = typeof studentOutcomes.$inferSelect;
export type W2lProject = typeof w2lProjects.$inferSelect;
export type W2lPhase = typeof w2lPhases.$inferSelect;
export type TrackRecordItem = typeof trackRecord.$inferSelect;
export type SiteStat = typeof siteStats.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type UserVerticalAccess = typeof userVerticalAccess.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
