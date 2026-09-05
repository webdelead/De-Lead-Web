import { Skeleton, StatGridSkeleton, ListCardSkeleton } from "@/components/ui/skeleton";

// dashboard home is a stat-card grid + a "latest leads" list — not a table.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <StatGridSkeleton count={4} />
      <ListCardSkeleton rows={6} />
    </div>
  );
}
