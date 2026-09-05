import { Skeleton, StatGridSkeleton, CardGridSkeleton, ListCardSkeleton } from "@/components/ui/skeleton";

// the vertical overview is a stat-card row + a "Manage" link grid + a
// "latest leads/bookings" list — not a table. Without this, it fell back to
// the root loading.tsx's TableSkeleton, which doesn't match this page at all.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <StatGridSkeleton count={3} cols="sm:grid-cols-3" />
      <div>
        <Skeleton className="mb-3 h-3 w-16" />
        <CardGridSkeleton count={6} />
      </div>
      <ListCardSkeleton rows={6} />
    </div>
  );
}
