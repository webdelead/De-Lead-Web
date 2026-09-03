import { Skeleton, HeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <HeaderSkeleton />
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-32" />
      </div>
      <TableSkeleton rows={8} cols={5} />
    </div>
  );
}
