-- Portable RO / APP role split (audit Phase 2, "stay portable" stance).
-- Standard SQL — works on Supabase and any self-hosted Postgres.
--
-- Apply with:  pnpm --filter @delead/db roles
-- (runs this file with DIRECT_URL, then sets LOGIN + password from
--  DELEAD_WEB_RO_PASSWORD / DELEAD_WEB_APP_PASSWORD if those env vars are set)
--
-- After applying, build two connection strings and put them in .env:
--   DATABASE_URL_RO   -> connects as delead_web_ro  (marketing sites, SELECT only)
--   DATABASE_URL      -> connects as delead_web_app (dashboard + write APIs)
-- On Supabase the pooler username is  <role>.<project-ref>  e.g.
--   postgres://delead_web_ro.dslvxzcqcuqhfqqaohfb:<pwd>@<pooler-host>:6543/postgres

-- ---------------------------------------------------------------------------
-- roles (idempotent; NOLOGIN until a password is set)
-- ---------------------------------------------------------------------------
do $$ begin
  if not exists (select from pg_roles where rolname = 'delead_web_ro') then
    create role delead_web_ro nologin;
  end if;
  if not exists (select from pg_roles where rolname = 'delead_web_app') then
    create role delead_web_app nologin;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- delead_web_ro : read-only on content, nothing sensitive
-- ---------------------------------------------------------------------------
grant usage on schema public to delead_web_ro;

revoke all on all tables in schema public from delead_web_ro;
grant select on
  testimonials, gallery_images, whatsapp_reviews, press_clippings, blog_posts,
  courses, student_outcomes, w2l_projects, w2l_phases, track_record,
  site_stats, site_settings, tc_events, assets
to delead_web_ro;
-- explicitly NOT granted: leads, tc_bookings, users, user_vertical_access,
-- audit_log, outbox, ping_log, publish_state

-- future content tables inherit SELECT; sensitive tables must be granted by hand
alter default privileges in schema public grant select on tables to delead_web_ro;

-- ---------------------------------------------------------------------------
-- delead_web_app : full DML, no DDL
-- ---------------------------------------------------------------------------
grant usage on schema public to delead_web_app;
grant select, insert, update, delete on all tables in schema public to delead_web_app;
grant usage, select on all sequences in schema public to delead_web_app;
alter default privileges in schema public
  grant select, insert, update, delete on tables to delead_web_app;
alter default privileges in schema public
  grant usage, select on sequences to delead_web_app;
