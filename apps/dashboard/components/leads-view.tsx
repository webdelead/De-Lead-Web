"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<"search" | "prev" | "next" | "filter" | null>(null);
  const [q, setQ] = useState(props.q);
  const [open, setOpen] = useState<LeadRow | null>(null);

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
    start(() => router.push(`/leads?${sp.toString()}`));
  }

  const csvHref = `/api/export/leads?${new URLSearchParams({
    ...(props.q ? { q: props.q } : {}),
    ...(props.v ? { v: props.v } : {}),
  }).toString()}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Leads <span className="text-base font-normal text-muted-foreground">({props.total})</span>
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
              <TableHead>Site</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No leads match.
                </TableCell>
              </TableRow>
            ) : (
              props.rows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setOpen(r)}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <Badge variant="muted">{r.sourceName}</Badge>
                  </TableCell>
                  <TableCell>{r.interest || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.phone || "—"}</TableCell>
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
                  {open.sourceName} · {new Date(open.createdAt).toLocaleString()}
                </SheetDescription>
              </SheetHeader>
              <dl className="space-y-3 text-sm">
                <Field label="Email">
                  {open.email ? <a className="text-primary" href={`mailto:${open.email}`}>{open.email}</a> : "—"}
                </Field>
                <Field label="Phone">
                  {open.phone ? <a className="text-primary" href={`tel:${open.phone}`}>{open.phone}</a> : "—"}
                </Field>
                <Field label="Interest">{open.interest || "—"}</Field>
                <Field label="Message">
                  <p className="whitespace-pre-wrap">{open.message || "—"}</p>
                </Field>
                <Field label="Page">{open.pagePath || "—"}</Field>
                <Field label="User agent">
                  <span className="break-all text-xs text-muted-foreground">{open.userAgent || "—"}</span>
                </Field>
              </dl>
            </>
          )}
        </SheetContent>
      </Sheet>
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
