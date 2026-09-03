"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveSetting } from "@/lib/actions/settings";

export interface SettingSpec {
  key: string;
  label: string;
  help?: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "textarea" | "boolean";
    placeholder?: string;
  }[];
}

export function SiteSettingsForm({
  vertical,
  spec,
  value,
  canEdit,
}: {
  vertical: string;
  spec: SettingSpec;
  value: Record<string, unknown>;
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
        {spec.fields.map((f) => (
          <div key={f.name}>
            <Label className="mb-1.5 block">{f.label}</Label>
            {f.type === "text" && (
              <Input
                disabled={!canEdit}
                placeholder={f.placeholder}
                value={String(state[f.name] ?? "")}
                onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
              />
            )}
            {f.type === "textarea" && (
              <Textarea
                disabled={!canEdit}
                value={String(state[f.name] ?? "")}
                onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
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
