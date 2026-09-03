import { HeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <HeaderSkeleton />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
