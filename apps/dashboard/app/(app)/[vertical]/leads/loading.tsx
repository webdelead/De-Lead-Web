import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";

// this one really is a table (LeadsView) — but it still needs its own file:
// without it, /[vertical]/leads would inherit ../loading.tsx (the vertical
// overview's stat-grid shape), which doesn't match a leads table at all.
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-9 w-full max-w-xs" />
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
