"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetPicker } from "@/components/asset-picker";
import { StatsField } from "@/components/stats-field";
import { saveRow } from "@/lib/actions/content";
import type { ResourceDef } from "@/lib/resources";

type Row = Record<string, unknown> & { id: string };
type SerDef = Omit<ResourceDef, "table">;

function camel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function ResourceForm({
  resource,
  vertical,
  def,
  row,
  assetMap,
  onDone,
}: {
  resource: string;
  vertical: string;
  def: SerDef;
  row?: Row;
  assetMap: Record<string, { url: string; alt: string }>;
  onDone: () => void;
}) {
  const [pending, start] = useTransition();
  const initial: Record<string, string> = {};
  for (const f of def.fields) {
    const v = row ? row[camel(f.name)] : (f.defaultValue ?? "");
    initial[f.name] =
      f.type === "stats"
        ? JSON.stringify(v ?? [])
        : f.type === "boolean"
          ? String(v ?? false)
          : v == null
            ? ""
            : String(v);
  }
  const [values, setValues] = useState(initial);
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    for (const f of def.fields) {
      if (f.required && !values[f.name]) {
        toast.error(`${f.label} is required`);
        return;
      }
    }
    start(async () => {
      try {
        await saveRow({ resource, vertical: vertical as never, id: row?.id, values });
        toast.success(row ? "Saved" : `${def.singular} created`);
        onDone();
      } catch {
        toast.error("Save failed");
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {def.fields.map((f) => (
          <div key={f.name} className={f.span === 2 ? "sm:col-span-2" : ""}>
            <Label htmlFor={f.name} className="mb-1.5 block">
              {f.label}
              {f.required && <span className="text-destructive"> *</span>}
            </Label>

            {f.type === "text" && (
              <Input
                id={f.name}
                value={values[f.name] ?? ""}
                onChange={(e) => {
                  set(f.name, e.target.value);
                  if (f.name === "title" && def.fields.some((x) => x.name === "slug") && !row) {
                    set("slug", slugify(e.target.value));
                  }
                }}
              />
            )}
            {f.type === "number" && (
              <Input
                id={f.name}
                type="number"
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
            {(f.type === "textarea" || f.type === "markdown") && (
              <Textarea
                id={f.name}
                rows={f.type === "markdown" ? 12 : 3}
                className={f.type === "markdown" ? "font-mono text-xs" : ""}
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
            {f.type === "select" && (
              <Select value={values[f.name] || ""} onValueChange={(v) => set(f.name, v)}>
                <SelectTrigger id={f.name}>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {(f.options ?? []).map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {f.type === "boolean" && (
              <div className="flex h-9 items-center">
                <Switch
                  checked={values[f.name] === "true"}
                  onCheckedChange={(v) => set(f.name, String(v))}
                />
              </div>
            )}
            {f.type === "image" && (
              <AssetPicker
                vertical={vertical}
                value={values[f.name] ?? ""}
                initialUrl={row ? assetMap[String(row[camel(f.name)] ?? "")]?.url : undefined}
                onChange={(id) => set(f.name, id)}
              />
            )}
            {f.type === "stats" && (
              <StatsField value={values[f.name] ?? "[]"} onChange={(v) => set(f.name, v)} />
            )}

            {f.help && <p className="mt-1 text-xs text-muted-foreground">{f.help}</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
