"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AssetPicker } from "@/components/asset-picker";
import { saveSetting } from "@/lib/actions/settings";

export interface SettingSpec {
  key: string;
  label: string;
  help?: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "textarea" | "boolean" | "image";
    placeholder?: string;
  }[];
}

export function SiteSettingsForm({
  vertical,
  spec,
  value,
  imageUrls,
  canEdit,
}: {
  vertical: string;
  spec: SettingSpec;
  value: Record<string, unknown>;
  /** resolved public URLs for any "image" field, keyed by field name — the
   *  stored value is just an asset id, this is what the picker previews. */
  imageUrls?: Record<string, string>;
  canEdit: boolean;
}) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<Record<string, unknown>>(() => {
    const s: Record<string, unknown> = { ...value };
    for (const f of spec.fields) if (!(f.name in s)) s[f.name] = f.type === "boolean" ? false : "";
    return s;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{spec.label}</CardTitle>
        {spec.help && <p className="text-sm text-muted-foreground">{spec.help}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image fields go first, shown at full size — they're the visual
            point of the setting (e.g. a season logo), not a small thumbnail. */}
        {spec.fields
          .filter((f) => f.type === "image")
          .map((f) => (
            <div key={f.name}>
              <Label className="mb-1 block text-xs">{f.label}</Label>
              {canEdit ? (
                <AssetPicker
                  vertical={vertical}
                  value={String(state[f.name] ?? "")}
                  initialUrl={imageUrls?.[f.name]}
                  onChange={(id) => setState((s) => ({ ...s, [f.name]: id }))}
                  size="lg"
                />
              ) : imageUrls?.[f.name] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrls[f.name]}
                  alt=""
                  className="max-w-xs rounded-lg border object-cover"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No image set</p>
              )}
            </div>
          ))}

        {/* Everything else — compact, side by side. */}
        <div className="flex flex-wrap items-end gap-4">
          {spec.fields
            .filter((f) => f.type !== "image")
            .map((f) => (
              <div key={f.name} className={f.type === "boolean" ? "flex items-center gap-2.5" : ""}>
                <Label className={f.type === "boolean" ? "" : "mb-1 block text-xs"}>
                  {f.label}
                </Label>
                {f.type === "text" && (
                  <Input
                    disabled={!canEdit}
                    placeholder={f.placeholder}
                    value={String(state[f.name] ?? "")}
                    onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
                    className="h-8 w-48"
                  />
                )}
                {f.type === "textarea" && (
                  <Textarea
                    disabled={!canEdit}
                    value={String(state[f.name] ?? "")}
                    onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
                    className="w-64"
                    rows={2}
                  />
                )}
                {f.type === "boolean" && (
                  <Switch
                    disabled={!canEdit}
                    checked={!!state[f.name]}
                    onCheckedChange={(v) => setState((s) => ({ ...s, [f.name]: v }))}
                  />
                )}
              </div>
            ))}
        </div>
        {canEdit && (
          <Button
            loading={pending}
            onClick={() =>
              start(async () => {
                try {
                  await saveSetting({ vertical: vertical as never, key: spec.key, value: state });
                  toast.success("Saved — publish the site to push it live");
                } catch {
                  toast.error("Save failed");
                }
              })
            }
          >
            {pending ? "Saving…" : "Save"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
