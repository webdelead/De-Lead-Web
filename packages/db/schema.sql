-- De' Lead Web — full schema DDL
-- Generated from src/schema.ts by: pnpm --filter @delead/db schema
-- Applied to Supabase via generated migrations: pnpm --filter @delead/db migrate
-- Do not hand-edit; edit src/schema.ts instead.

CREATE TYPE "public"."access_level" AS ENUM('view', 'edit');
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');
CREATE TYPE "public"."course_audience" AS ENUM('students', 'professionals');
CREATE TYPE "public"."outbox_status" AS ENUM('pending', 'sent', 'failed');
CREATE TYPE "public"."storage_provider" AS ENUM('supabase', 'r2');
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'staff');
CREATE TYPE "public"."vertical" AS ENUM('deleadint', 'walk2lead', 'makerchamps', 'corporate', 'dli_education', 'tinkerchamps');
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" "storage_provider" DEFAULT 'supabase' NOT NULL,
	"bucket" text NOT NULL,
	"path" text NOT NULL,
	"mime" text NOT NULL,
	"width" integer,
	"height" integer,
	"bytes" integer NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"vertical" "vertical",
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"user_email" text,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"vertical" "vertical",
	"diff" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical",
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"cover_asset_id" uuid,
	"body_md" text DEFAULT '' NOT NULL,
	"tag" text DEFAULT '' NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"author_name" text DEFAULT 'De'' Lead International' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audience" "course_audience" NOT NULL,
	"track" text NOT NULL,
	"title" text NOT NULL,
	"level" text DEFAULT 'Beginner' NOT NULL,
	"description" text NOT NULL,
	"age_label" text DEFAULT '' NOT NULL,
	"format" text DEFAULT '' NOT NULL,
	"duration_label" text DEFAULT '' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical" NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"asset_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "vertical" NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"interest" text,
	"message" text,
	"page_path" text,
	"user_agent" text,
	"ip_hash" text,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"target_url" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "outbox_status" DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone
);

CREATE TABLE "ping_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text DEFAULT 'cron' NOT NULL,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "press_clippings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical" NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"publication" text DEFAULT '' NOT NULL,
	"date_str" text DEFAULT '' NOT NULL,
	"asset_id" uuid NOT NULL,
	"link_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "publish_state" (
	"vertical" "vertical" PRIMARY KEY NOT NULL,
	"dirty_count" integer DEFAULT 0 NOT NULL,
	"last_published_at" timestamp with time zone,
	"last_published_by" uuid
);

CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical" NOT NULL,
	"key" text NOT NULL,
	"value" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "site_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical" NOT NULL,
	"group_key" text DEFAULT 'default' NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"suffix" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "student_outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical" DEFAULT 'dli_education' NOT NULL,
	"name" text NOT NULL,
	"place" text DEFAULT '' NOT NULL,
	"win" text NOT NULL,
	"tag" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "tc_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_name" text NOT NULL,
	"student_name" text NOT NULL,
	"class_grade" text NOT NULL,
	"phone" text NOT NULL,
	"place" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "tc_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"logo_asset_id" uuid,
	"description" text NOT NULL,
	"date_str" text NOT NULL,
	"location" text NOT NULL,
	"audience" text DEFAULT 'Students' NOT NULL,
	"duration" text DEFAULT '3 Days Residential' NOT NULL,
	"inclusion" text DEFAULT 'Food Included' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"stats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical" NOT NULL,
	"quote" text NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text DEFAULT '' NOT NULL,
	"avatar_asset_id" uuid,
	"source_note" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "track_record" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"when_label" text NOT NULL,
	"client" text NOT NULL,
	"blurb" text NOT NULL,
	"badge" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "user_vertical_access" (
	"user_id" uuid NOT NULL,
	"vertical" "vertical" NOT NULL,
	"level" "access_level" DEFAULT 'view' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_vertical_access_user_id_vertical_pk" PRIMARY KEY("user_id","vertical")
);

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "w2l_phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"districts" text NOT NULL,
	"schools" integer DEFAULT 0 NOT NULL,
	"students" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "w2l_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"description" text NOT NULL,
	"asset_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "whatsapp_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vertical" "vertical" DEFAULT 'tinkerchamps' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"asset_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_asset_id_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "press_clippings" ADD CONSTRAINT "press_clippings_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "publish_state" ADD CONSTRAINT "publish_state_last_published_by_users_id_fk" FOREIGN KEY ("last_published_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "tc_events" ADD CONSTRAINT "tc_events_logo_asset_id_assets_id_fk" FOREIGN KEY ("logo_asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_asset_id_assets_id_fk" FOREIGN KEY ("avatar_asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "user_vertical_access" ADD CONSTRAINT "user_vertical_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "w2l_projects" ADD CONSTRAINT "w2l_projects_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "whatsapp_reviews" ADD CONSTRAINT "whatsapp_reviews_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE restrict ON UPDATE no action;
CREATE UNIQUE INDEX "assets_provider_bucket_path_uk" ON "assets" USING btree ("provider","bucket","path");
CREATE INDEX "audit_log_created_idx" ON "audit_log" USING btree ("created_at");
CREATE INDEX "audit_log_user_idx" ON "audit_log" USING btree ("user_id");
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity","entity_id");
CREATE UNIQUE INDEX "blog_slug_uk" ON "blog_posts" USING btree ("slug");
CREATE INDEX "blog_status_idx" ON "blog_posts" USING btree ("status","published_at");
CREATE INDEX "courses_audience_idx" ON "courses" USING btree ("audience","sort_order");
CREATE INDEX "gallery_vertical_idx" ON "gallery_images" USING btree ("vertical","sort_order");
CREATE INDEX "leads_source_created_idx" ON "leads" USING btree ("source","created_at");
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");
CREATE INDEX "outbox_drain_idx" ON "outbox" USING btree ("status","next_attempt_at");
CREATE INDEX "press_vertical_idx" ON "press_clippings" USING btree ("vertical","sort_order");
CREATE UNIQUE INDEX "site_settings_vertical_key_uk" ON "site_settings" USING btree ("vertical","key");
CREATE INDEX "site_stats_vertical_idx" ON "site_stats" USING btree ("vertical","group_key","sort_order");
CREATE INDEX "outcomes_vertical_idx" ON "student_outcomes" USING btree ("vertical","sort_order");
CREATE INDEX "tc_bookings_created_idx" ON "tc_bookings" USING btree ("created_at");
CREATE UNIQUE INDEX "tc_events_slug_uk" ON "tc_events" USING btree ("slug");
CREATE INDEX "testimonials_vertical_idx" ON "testimonials" USING btree ("vertical","sort_order");
CREATE INDEX "track_record_order_idx" ON "track_record" USING btree ("sort_order");
CREATE UNIQUE INDEX "users_email_uk" ON "users" USING btree (lower("email"));
CREATE INDEX "w2l_phases_order_idx" ON "w2l_phases" USING btree ("sort_order");
CREATE INDEX "w2l_projects_order_idx" ON "w2l_projects" USING btree ("sort_order");
CREATE INDEX "wa_reviews_vertical_idx" ON "whatsapp_reviews" USING btree ("vertical","sort_order");
