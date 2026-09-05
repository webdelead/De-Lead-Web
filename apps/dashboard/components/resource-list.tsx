"use client";
import { snakeToCamel as camel } from "@delead/shared/strings";
import { formatDate } from "@delead/shared/dates";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
import { GripVertical, ImageOff, LayoutGrid, List, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
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

  // grid vs list — only relevant for image-forward resources; grid by default,
  // remembered per resource in localStorage
  const [view, setView] = useState<"list" | "grid">(def.imageForward ? "grid" : "list");
  useEffect(() => {
    if (!def.imageForward) return;
    try {
      const saved = localStorage.getItem(`dlead-view:${resource}`);
      if (saved === "list" || saved === "grid") setView(saved);
    } catch {
      // ignore — storage may be unavailable (private mode, etc.)
    }
  }, [resource, def.imageForward]);
  function setViewPersist(v: "list" | "grid") {
    setView(v);
    try {
      localStorage.setItem(`dlead-view:${resource}`, v);
    } catch {
      // ignore
    }
  }

  // drag-to-reorder — dragging only updates local state instantly (no server
  // call, no disabling overlay); a Save button persists it when the user is
  // ready, and a beforeunload guard warns if they try to leave with an
  // unsaved order.
  const dragFrom = useRef<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [order, setOrder] = useState<Row[]>(rows);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, startSavingOrder] = useTransition();

  // resync from the server-provided rows whenever they change (edits,
  // deletes, a completed save) — but never while an unsaved reorder is
  // pending, or a drag-drop would get silently discarded.
  useEffect(() => {
    if (!orderDirty) setOrder(rows);
  }, [rows, orderDirty]);

  useEffect(() => {
    if (!orderDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [orderDirty]);

  const filtered = useMemo(() => {
    if (!q) return order;
    const needle = q.toLowerCase();
    return order.filter((r) =>
      def.search.some((k) => String(r[camel(k)] ?? "").toLowerCase().includes(needle)),
    );
  }, [q, order, def.search]);

  const canReorder = def.orderable && canEdit && !q && !savingOrder;

  function commitReorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    setOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });
    setOrderDirty(true);
  }

  function saveOrder() {
    startSavingOrder(async () => {
      try {
        await reorderRows({ resource, vertical: vertical as never, ids: order.map((r) => r.id) });
        setOrderDirty(false);
        router.refresh();
        toast.success("Order saved");
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
        {def.orderable && canEdit && orderDirty && (
          <Button size="sm" onClick={saveOrder} loading={savingOrder}>
            <Save className="h-4 w-4" /> Save order
          </Button>
        )}
        {def.imageForward && (
          <div className="flex items-center rounded-md border p-0.5">
            <button
              type="button"
              aria-pressed={view === "grid"}
              title="Grid view"
              onClick={() => setViewPersist("grid")}
              className={`rounded px-2 py-1 transition-colors ${
                view === "grid"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              title="List view"
              onClick={() => setViewPersist("list")}
              className={`rounded px-2 py-1 transition-colors ${
                view === "list"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
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

      {def.orderable && canEdit && orderDirty && !q && (
        <Alert variant="info">
          You&apos;ve changed the order but haven&apos;t saved it yet — click{" "}
          <span className="font-medium text-foreground">Save order</span> above, or your changes
          will be lost if you reload or leave this page.
        </Alert>
      )}

      {def.imageForward && view === "grid" ? (
        <div className="relative">
          {pending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="rounded-lg border bg-background py-14 text-center text-muted-foreground">
              Nothing here yet.{" "}
              {canEdit && (
                <button className="text-primary underline" onClick={() => setEditing(null)}>
                  Add the first one
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((r, idx) => {
                const imgCol = def.columns.find((c) => c.kind === "image");
                const textCols = def.columns.filter((c) => c.kind !== "image" && c.kind !== "bool");
                const boolCol = def.columns.find((c) => c.kind === "bool");
                const asset = imgCol
                  ? assetMap[String(r[camel(imgCol.key)] ?? "")]
                  : undefined;
                return (
                  <div
                    key={r.id}
                    draggable={canReorder}
                    data-dragging={canReorder && dragIdx === idx ? "true" : undefined}
                    data-drop-target={
                      canReorder && overIdx === idx && dragIdx !== null && dragIdx !== idx
                        ? "true"
                        : undefined
                    }
                    onDragStart={
                      canReorder
                        ? (e) => {
                            dragFrom.current = idx;
                            setDragIdx(idx);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", String(idx));
                          }
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
                    onDragEnd={canReorder ? endDrag : undefined}
                    className="group flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow data-[dragging=true]:opacity-40 data-[drop-target=true]:ring-2 data-[drop-target=true]:ring-primary"
                  >
                    <div
                      style={{ position: "relative", height: 180, width: "100%", overflow: "hidden" }}
                      className={`bg-muted ${canReorder ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      {asset ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.url}
                          alt={asset.alt}
                          draggable={false}
                          // draggable=false above stops the browser's native image-drag — without
                          // it, a click that moves a couple px (trackpads do this constantly) reads
                          // as a native image drag, and dropping it anywhere without a drop handler
                          // makes the browser navigate the tab to the raw image URL — which looks
                          // exactly like "clicking the image opens it". Row reordering still works
                          // via the card's own `draggable` on the wrapping div, unaffected by this.
                          // inline styles here on purpose, not just `h-full w-full object-cover` —
                          // a fixed pixel height (not just aspect-ratio) is what actually keeps
                          // every card's photo the same size regardless of the source image's own
                          // dimensions (some uploads are tall portrait scans, some are wide), and
                          // doing it inline sidesteps any chance of Tailwind's own `img{height:auto}`
                          // preflight reset winning the cascade.
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImageOff className="h-6 w-6" />
                        </div>
                      )}
                      {canReorder && (
                        <span className="absolute left-1.5 top-1.5 rounded bg-background/80 p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      )}
                      {boolCol && (
                        <span className="absolute right-1.5 top-1.5">
                          {renderCell(boolCol, r, assetMap)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 p-3">
                      {textCols[0] && (
                        <div className="text-sm font-medium leading-snug">
                          {renderCell(textCols[0], r, assetMap)}
                        </div>
                      )}
                      {textCols[1] && (
                        <div className="text-xs text-muted-foreground">
                          {renderCell(textCols[1], r, assetMap)}
                        </div>
                      )}
                    </div>
                    {canEdit && (
                      <div className="flex justify-end gap-1 border-t px-2 py-1.5">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setConfirm(r)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
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
      )}

      <Sheet open={editing !== undefined} onOpenChange={(o) => !o && setEditing(undefined)}>
        <SheetContent className={def.imageForward ? "sm:max-w-2xl" : undefined}>
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
      <img src={a.url} alt={a.alt} draggable={false} className="h-10 w-10 rounded object-cover" />
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  }
  if (c.kind === "bool") return <Badge variant={val ? "success" : "muted"}>{val ? "Yes" : "No"}</Badge>;
  if (c.kind === "badge") return <Badge variant="secondary">{String(val ?? "—")}</Badge>;
  if (c.kind === "date")
    return <span className="text-muted-foreground">{val ? formatDate(String(val)) : "—"}</span>;
  const s = String(val ?? "");
  return <span className="line-clamp-1 max-w-xs">{s || "—"}</span>;
}
