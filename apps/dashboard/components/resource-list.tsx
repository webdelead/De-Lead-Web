"use client";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { ResourceForm } from "@/components/resource-form";
import { deleteRow, reorderRows } from "@/lib/actions/content";
import type { ResourceDef } from "@/lib/resources";

type Row = Record<string, unknown> & { id: string };
type SerDef = Omit<ResourceDef, "table">;

export function ResourceList({
  resource,
  vertical,
  def,
  rows,
  assetMap,
  canEdit,
  filterValue,
}: {
  resource: string;
  vertical: string;
  def: SerDef;
  rows: Row[];
  assetMap: Record<string, { url: string; alt: string }>;
  canEdit: boolean;
  filterValue: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null | undefined>(undefined); // undefined=closed, null=new
  const [confirm, setConfirm] = useState<Row | null>(null);

  // drag-to-reorder
  const dragFrom = useRef<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) =>
      def.search.some((k) => String(r[camel(k)] ?? "").toLowerCase().includes(needle)),
    );
  }, [q, rows, def.search]);

  const canReorder = def.orderable && canEdit && !q;

  function commitReorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    start(async () => {
      try {
        await reorderRows({ resource, vertical: vertical as never, ids: next.map((r) => r.id) });
        router.refresh();
      } catch {
        toast.error("Couldn't save the new order");
      }
    });
  }

  function endDrag() {
    dragFrom.current = null;
    setDragIdx(null);
    setOverIdx(null);
  }

  function doDelete(row: Row) {
    start(async () => {
      try {
        await deleteRow({ resource, vertical: vertical as never, id: row.id });
        toast.success(`${def.singular} deleted`);
        setConfirm(null);
        router.refresh();
      } catch {
        toast.error("Delete failed");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder={`Search ${def.label.toLowerCase()}…`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        {def.filterField && (
          <Select
            value={filterValue || "all"}
            onValueChange={(v) => {
              const sp = new URLSearchParams(window.location.search);
              if (v === "all") sp.delete(def.filterField!.name);
              else sp.set(def.filterField!.name, v);
              start(() => router.push(`?${sp.toString()}`));
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={def.filterField.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {def.filterField.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex-1" />
        {canEdit && (
          <Button size="sm" onClick={() => setEditing(null)}>
            <Plus className="h-4 w-4" /> New {def.singular.toLowerCase()}
          </Button>
        )}
      </div>

      {def.orderable && canEdit && q && (
        <Alert variant="info">
          Ordering is disabled while a search is active — clear the search box to drag rows into a
          new order.
        </Alert>
      )}

      <div className="relative rounded-lg border bg-background">
        {pending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {def.orderable && <TableHead className="w-10" />}
              {def.columns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={def.columns.length + (def.orderable ? 2 : 1)}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nothing here yet.{" "}
                  {canEdit && (
                    <button className="text-primary underline" onClick={() => setEditing(null)}>
                      Add the first one
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r, idx) => (
                <TableRow
                  key={r.id}
                  data-dragging={canReorder && dragIdx === idx ? "true" : undefined}
                  data-drop-target={
                    canReorder && overIdx === idx && dragIdx !== null && dragIdx !== idx
                      ? "true"
                      : undefined
                  }
                  onDragOver={
                    canReorder
                      ? (e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          if (overIdx !== idx) setOverIdx(idx);
                        }
                      : undefined
                  }
                  onDrop={
                    canReorder
                      ? (e) => {
                          e.preventDefault();
                          if (dragFrom.current !== null) commitReorder(dragFrom.current, idx);
                          endDrag();
                        }
                      : undefined
                  }
                >
                  {def.orderable && (
                    <TableCell className="text-muted-foreground">
                      {canReorder ? (
                        <span
                          className="row-drag-handle inline-flex items-center justify-center"
                          title="Drag to reorder"
                          aria-label="Drag to reorder"
                          role="button"
                          tabIndex={0}
                          draggable
                          onDragStart={(e) => {
                            dragFrom.current = idx;
                            setDragIdx(idx);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", String(idx));
                          }}
                          onDragEnd={endDrag}
                        >
                          <GripVertical className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="text-xs tabular-nums">{idx + 1}</span>
                      )}
                    </TableCell>
                  )}
                  {def.columns.map((c) => (
                    <TableCell key={c.key}>{renderCell(c, r, assetMap)}</TableCell>
                  ))}
                  <TableCell>
                    {canEdit && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setConfirm(r)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={editing !== undefined} onOpenChange={(o) => !o && setEditing(undefined)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editing ? `Edit ${def.singular.toLowerCase()}` : `New ${def.singular.toLowerCase()}`}
            </SheetTitle>
          </SheetHeader>
          {editing !== undefined && (
            <ResourceForm
              resource={resource}
              vertical={vertical}
              def={def}
              row={editing ?? undefined}
              assetMap={assetMap}
              onDone={() => {
                setEditing(undefined);
                router.refresh();
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this {def.singular.toLowerCase()}?</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive" title="This can't be undone">
            {confirm ? (
              <>
                <span className="font-medium text-foreground">
                  {String(confirm[camel(def.columns[0]!.key)] ?? "this record")}
                </span>{" "}
                will be permanently removed. If it&apos;s on a live site, publish that site
                afterwards to push the change out.
              </>
            ) : (
              "This record will be permanently removed."
            )}
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={pending}
              onClick={() => confirm && doDelete(confirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function camel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function renderCell(
  c: { key: string; label: string; kind?: string },
  r: Row,
  assetMap: Record<string, { url: string; alt: string }>,
) {
  const val = r[camel(c.key)];
  if (c.kind === "image") {
    const a = typeof val === "string" ? assetMap[val] : undefined;
    return a ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={a.url} alt={a.alt} className="h-10 w-10 rounded object-cover" />
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  }
  if (c.kind === "bool") return <Badge variant={val ? "success" : "muted"}>{val ? "Yes" : "No"}</Badge>;
  if (c.kind === "badge") return <Badge variant="secondary">{String(val ?? "—")}</Badge>;
  if (c.kind === "date")
    return <span className="text-muted-foreground">{val ? new Date(String(val)).toLocaleDateString() : "—"}</span>;
  const s = String(val ?? "");
  return <span className="line-clamp-1 max-w-xs">{s || "—"}</span>;
}
