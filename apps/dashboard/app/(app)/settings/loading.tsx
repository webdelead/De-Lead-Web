import { Skeleton } from "@/components/ui/skeleton";

// super-admin System page: title + 3 plain stat cards + a "Publishing" card
// with a small status table — not the icon-badge <Stat> grid used elsewhere.
export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-24" />

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-background p-6 space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-background p-6 space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-16 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
