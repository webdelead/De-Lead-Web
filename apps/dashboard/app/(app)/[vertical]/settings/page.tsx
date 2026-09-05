import { notFound } from "next/navigation";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { requireAccess } from "@/lib/authz";
import { getDb, siteSettings, assets, and, eq, inArray } from "@delead/db";
import { assetPublicUrl } from "@delead/shared/storage";
import { SiteSettingsForm, type SettingSpec } from "@/components/site-settings-form";
import { Alert } from "@/components/ui/alert";
import { PublishBar } from "@/components/publish-bar";

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
        { name: "logoAssetId", label: "Season logo", type: "image" },
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

  // resolve every "image" field's stored asset id -> public URL, so the
  // picker can show a preview instead of a blank box.
  const imageFieldIds = new Set<string>();
  for (const spec of specs) {
    for (const f of spec.fields) {
      if (f.type !== "image") continue;
      const id = values[spec.key]?.[f.name];
      if (typeof id === "string" && id) imageFieldIds.add(id);
    }
  }
  const assetUrlById: Record<string, string> = {};
  if (imageFieldIds.size) {
    for (const a of await db.select().from(assets).where(inArray(assets.id, [...imageFieldIds]))) {
      assetUrlById[a.id] = assetPublicUrl(a);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">{v.name}</p>
        </div>
        <PublishBar vertical={v.slug} canEdit={canEdit} />
      </div>
      <Alert variant="info">
        Saving stores the change immediately, but the live site won&apos;t reflect it until you{" "}
        <span className="font-medium text-foreground">Publish to site</span>.
      </Alert>
      {!canEdit && (
        <Alert variant="warning">
          You have view-only access to {v.name} — fields are read-only. Ask a super admin for an
          edit grant.
        </Alert>
      )}
      {specs.map((spec) => {
        const imageUrls: Record<string, string> = {};
        for (const f of spec.fields) {
          if (f.type !== "image") continue;
          const id = values[spec.key]?.[f.name];
          if (typeof id === "string" && assetUrlById[id]) imageUrls[f.name] = assetUrlById[id];
        }
        return (
          <SiteSettingsForm
            key={spec.key}
            vertical={v.slug}
            spec={spec}
            value={values[spec.key] ?? {}}
            imageUrls={imageUrls}
            canEdit={canEdit}
          />
        );
      })}
    </div>
  );
}
