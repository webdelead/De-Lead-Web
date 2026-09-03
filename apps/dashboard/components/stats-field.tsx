"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAT_ICONS } from "@/lib/resources";
import { Plus, Trash2 } from "lucide-react";

interface StatItem {
  icon: string;
  title: string;
  text: string;
}

export function StatsField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let items: StatItem[] = [];
  try {
    items = JSON.parse(value || "[]");
  } catch {
    items = [];
  }
  const set = (next: StatItem[]) => onChange(JSON.stringify(next));

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <Select
            value={it.icon || STAT_ICONS[0]}
            onValueChange={(v) => set(items.map((x, j) => (j === i ? { ...x, icon: v } : x)))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAT_ICONS.map((ic) => (
                <SelectItem key={ic} value={ic}>
                  {ic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Value (e.g. 3)"
            value={it.title}
            onChange={(e) => set(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
          />
          <Input
            placeholder="Caption"
            value={it.text}
            onChange={(e) => set(items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => set(items.filter((_, j) => j !== i))}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      {items.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => set([...items, { icon: STAT_ICONS[0]!, title: "", text: "" }])}
        >
          <Plus className="h-4 w-4" /> Add stat
        </Button>
      )}
    </div>
  );
}
