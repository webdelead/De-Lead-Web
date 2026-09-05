"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { interestLabel as interestLabelFor } from "@/lib/lead-fields";
import { deleteLead } from "@/lib/actions/leads";
import { formatDate, formatDateTime } from "@delead/shared/dates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

interface LeadRow {
  id: string;
  source: string;
  sourceName: string;
  name: string;
  email: string | null;
  phone: string | null;
  interest: string | null;
  message: string | null;
  pagePath: string | null;
  userAgent: string | null;
  createdAt: string;
}

export function LeadsView(props: {
  rows: LeadRow[];
  total: number;
  page: number;
  pageSize: number;
  q: string;
  v: string;
  verticalOptions: { key: string; name: string }[];
  showVerticalFilter: boolean;
  /** route the search / pagination pushes back to (default "/leads") */
  basePath?: string;
  /** heading text (default "Leads") */
  title?: string;
  /** label for the free-text `interest` column (default "Interest") */
  interestLabel?: string;
  /** hide the "Site" column — for a single-vertical view */
  hideSite?: boolean;
  /** vertical keys (matches `source`) the current user may delete leads from */
  editableVerticals?: string[];
}) {
  const basePath = props.basePath ?? "/leads";
  const heading = props.title ?? "Leads";
  const interestLabel = props.interestLabel ?? "Interest";
  const editable = props.editableVerticals ?? [];
  const router = useRouter();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<"search" | "prev" | "next" | "filter" | null>(null);
  const [q, setQ] = useState(props.q);
  const [open, setOpen] = useState<LeadRow | null>(null);
  const [confirm, setConfirm] = useState<LeadRow | null>(null);
  const [deleting, startDelete] = useTransition();

  function doDelete(row: LeadRow) {
    startDelete(async () => {
      try {
        await deleteLead(row.id);
        toast.success("Lead deleted");
        setConfirm(null);
        setOpen(null);
        router.refresh();
      } catch {
        toast.error("Delete failed");
      }
    });
  }

  const pages = Math.max(1, Math.ceil(props.total / props.pageSize));

  useEffect(() => {
    if (!pending) setBusy(null);
  }, [pending]);

  function push(next: Record<string, string | undefined>, which: typeof busy = null) {
    setBusy(which);
    const sp = new URLSearchParams(params.toString());
    for (const [k, val] of Object.entries(next)) {
      if (val) sp.set(k, val);
      else sp.delete(k);
    }
    start(() => router.push(`${basePath}?${sp.toString()}`));
  }

  const csvHref = `/api/export/leads?${new URLSearchParams({
    ...(props.q ? { q: props.q } : {}),
    ...(props.v ? { v: props.v } : {}),
  }).toString()}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {heading}{" "}
          <span className="text-base font-normal text-muted-foreground">({props.total})</span>
        </h1>
        <a href={csvHref}>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </a>
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: q || undefined, page: undefined }, "search");
        }}
      >
        <Input
          placeholder="Search name, email, phone, message…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        {props.showVerticalFilter && (
          <Select
            value={props.v || "all"}
            onValueChange={(val) => push({ v: val === "all" ? undefined : val, page: undefined }, "filter")}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sites</SelectItem>
              {props.verticalOptions.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button type="submit" variant="secondary" size="sm" loading={busy === "search"}>
          Search
        </Button>
      </form>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              {!props.hideSite && <TableHead>Site</TableHead>}
              <TableHead>{interestLabel}</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={props.hideSite ? 6 : 7}
                  className="py-10 text-center text-muted-foreground"
                >
                  No leads match.
                </TableCell>
              </TableRow>
            ) : (
              props.rows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setOpen(r)}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(r.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  {!props.hideSite && (
                    <TableCell>
                      <Badge variant="muted">{r.sourceName}</Badge>
                    </TableCell>
                  )}
                  <TableCell>{r.interest || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.phone || "—"}</TableCell>
                  <TableCell>
                    {editable.includes(r.source) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirm(r);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {props.page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={props.page <= 1}
              loading={busy === "prev"}
              onClick={() => push({ page: String(props.page - 1) }, "prev")}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={props.page >= pages}
              loading={busy === "next"}
              onClick={() => push({ page: String(props.page + 1) }, "next")}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent>
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.name}</SheetTitle>
                <SheetDescription>
                  {open.sourceName} · {formatDateTime(open.createdAt)}
                </SheetDescription>
              </SheetHeader>
              <dl className="space-y-3 text-sm">
                <Field label="Email">
                  {open.email ? <a className="text-primary" href={`mailto:${open.email}`}>{open.email}</a> : "—"}
                </Field>
                <Field label="Phone">
                  {open.phone ? <a className="text-primary" href={`tel:${open.phone}`}>{open.phone}</a> : "—"}
                </Field>
                <Field label={interestLabelFor(open.source)}>{open.interest || "—"}</Field>
                <Field label="Message">
                  <p className="whitespace-pre-wrap">{open.message || "—"}</p>
                </Field>
                <Field label="Page">{open.pagePath || "—"}</Field>
                <Field label="User agent">
                  <span className="break-all text-xs text-muted-foreground">{open.userAgent || "—"}</span>
                </Field>
              </dl>
              {editable.includes(open.source) && (
                <div className="flex justify-end border-t pt-4">
                  <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirm(open)}>
                    <Trash2 className="h-4 w-4" /> Delete lead
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this lead?</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive" title="This can't be undone">
            {confirm ? (
              <>
                <span className="font-medium text-foreground">{confirm.name}</span>
                {confirm.email ? ` (${confirm.email})` : ""} will be permanently removed.
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
              loading={deleting}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
