import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/** A placeholder table: header row + N body rows, C columns. */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-lg border bg-background">
      <div className="flex gap-4 border-b px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b px-4 py-3 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn("h-4 flex-1", c === 0 && "max-w-[40%]")} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Page heading placeholder. */
export function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
  );
}

/** A row of stat cards — shaped like the real `<Stat>` card (label · icon
 *  circle · big number · sub-label), not a table. Used on dashboard home and
 *  the per-vertical overview, which are card grids, not tables. */
export function StatGridSkeleton({
  count = 4,
  cols = "sm:grid-cols-2 lg:grid-cols-4",
}: {
  count?: number;
  /** grid-template classes — match the real page's <Stat> grid so the count
   *  of cards per row lines up (e.g. "sm:grid-cols-3" for the vertical
   *  overview's 3-stat row). */
  cols?: string;
}) {
  return (
    <div className={cn("grid gap-4", cols)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-background p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-8 w-14" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/** A grid of link-card placeholders — shaped like the vertical overview's
 *  "Manage" section. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[46px] w-full" />
      ))}
    </div>
  );
}

/** A card with a header bar and N simple divided rows — shaped like a
 *  "Latest …" list, not a multi-column table. */
export function ListCardSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border bg-background shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
