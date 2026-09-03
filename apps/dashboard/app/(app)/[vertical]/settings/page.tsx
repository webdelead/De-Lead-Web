import { notFound } from "next/navigation";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { requireAccess } from "@/lib/authz";
import { getDb, siteSettings, and, eq } from "@delead/db";
import { SiteSettingsForm, type SettingSpec } from "@/components/site-settings-form";
import { Alert } from "@/components/ui/alert";

const SPECS: Record<string, SettingSpec[]> = {
  tinkerchamps: [
    {
      key: "hero",
      label: "Hero",
      fields: [
        { name: "headline", label: "Headline", type: "text" },
        { name: "sub", label: "Sub-headline", type: "textarea" },
        { name: "ctaLabel", label: "CTA button label", type: "text" },
      ],
    },
  ],
  makerchamps: [
    {
      key: "next_season",
      label: "Next season",
      help: "Turn OFF between seasons to hide the hero ribbon and invite card on the site.",
      fields: [
        { name: "active", label: "Season is scheduled", type: "boolean" },
        { name: "label", label: "Season label", type: "text", placeholder: "Season 3" },
        { name: "dates", label: "Dates", type: "text", placeholder: "Aug 28–29" },
        { name: "campus", label: "Campus line", type: "text", placeholder: "NIT Calicut Campus" },
      ],
    },
  ],
};

export default async function VerticalSettings({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const v = VERTICALS[vertical as VerticalSlug];
  const specs = v ? SPECS[v.key] : undefined;
  if (!v || !specs) notFound();
  const session = await requireAccess(v.key, "view");
  const canEdit =
    session.user.role === "super_admin" ||
    session.user.grants.some((g) => g.vertical === v.key && g.level === "edit");

  const db = getDb();
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.vertical, v.key as never));
  const values: Record<string, Record<string, unknown>> = {};
  for (const row of existing) values[row.key] = row.value;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">{v.name}</p>
      </div>
      <Alert variant="info">
        Saving stores the change immediately, but the live site won&apos;t reflect it until you
        <span className="font-medium text-foreground"> Publish</span> from one of {v.name}&apos;s
        content pages.
      </Alert>
      {!canEdit && (
        <Alert variant="warning">
          You have view-only access to {v.name} — fields are read-only. Ask a super admin for an
          edit grant.
        </Alert>
      )}
      {specs.map((spec) => (
        <SiteSettingsForm
          key={spec.key}
          vertical={v.slug}
          spec={spec}
          value={values[spec.key] ?? {}}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}
