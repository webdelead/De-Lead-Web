import { notFound } from "next/navigation";
import { snakeToCamel as camel } from "@delead/shared/strings";
import { getDb, assets, eq, inArray, asc, desc, and, sql } from "@delead/db";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { requireAccess, dbKey } from "@/lib/authz";
import { RESOURCES } from "@/lib/resources";
import { assetPublicUrl as publicUrl } from "@delead/shared/storage";
import { ResourceList } from "@/components/resource-list";
import { PublishBar } from "@/components/publish-bar";

export default async function ResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ vertical: string; resource: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { vertical, resource } = await params;
  const sp = await searchParams;
  const def = RESOURCES[resource];
  const v = VERTICALS[vertical as VerticalSlug];
  if (!def || !v) notFound();
  const applies = def.verticals.includes(v.key) || def.fixedVertical === v.key;
  if (!applies) notFound();

  const session = await requireAccess(v.key, "view");
  const canEdit =
    session.user.role === "super_admin" ||
    session.user.grants.some((g) => g.vertical === v.key && g.level === "edit");

  const db = getDb();
  const table = def.table as never;
  const idCol = (def.table as never)["id"];
  const sortCol = def.orderable ? (def.table as never)["sortOrder"] : (def.table as never)["createdAt"];

  const conds = [];
  if (def.verticalScoped) conds.push(eq((def.table as never)["vertical"], v.key));
  if (def.filterField && sp[def.filterField.name]) {
    conds.push(eq((def.table as never)[camel(def.filterField.name)], sp[def.filterField.name]));
  }

  const rows = (await db
    .select()
    .from(table)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(def.orderable ? asc(sortCol) : desc(sortCol))
    .limit(500)) as unknown as (Record<string, unknown> & { id: string })[];

  // resolve image columns → urls
  const imageCols = def.columns.filter((c) => c.kind === "image").map((c) => c.key);
  const fieldImageCols = def.fields.filter((f) => f.type === "image").map((f) => camel(f.name));
  const wantedIds = new Set<string>();
  for (const r of rows) {
    for (const c of [...imageCols.map(camel), ...fieldImageCols]) {
      const id = r[c];
      if (typeof id === "string") wantedIds.add(id);
    }
  }
  const assetMap: Record<string, { url: string; alt: string }> = {};
  if (wantedIds.size) {
    const arr = await db
      .select()
      .from(assets)
      .where(inArray(assets.id, [...wantedIds]));
    for (const a of arr) assetMap[a.id] = { url: publicUrl(a), alt: a.alt };
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{def.label}</h1>
          <p className="text-sm text-muted-foreground">{v.name}</p>
        </div>
        <PublishBar vertical={v.slug} canEdit={canEdit} />
      </div>
      <ResourceList
        resource={resource}
        vertical={v.slug}
        def={serializeDef(def)}
        rows={rows.map((r) => ({
          ...r,
          createdAt: r.createdAt instanceof Date ? (r.createdAt as Date).toISOString() : r.createdAt,
          publishedAt:
            r.publishedAt instanceof Date ? (r.publishedAt as Date).toISOString() : r.publishedAt ?? null,
        }))}
        assetMap={assetMap}
        canEdit={canEdit}
        filterValue={def.filterField ? (sp[def.filterField.name] ?? "") : ""}
      />
    </div>
  );
}

/** strip the drizzle table (not serializable) before passing to the client */
function serializeDef(def: (typeof RESOURCES)[string]) {
  const { table, ...rest } = def;
  return rest;
}
