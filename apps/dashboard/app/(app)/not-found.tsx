import Link from "next/link";
import { Button } from "@/components/ui/button";

/** 404 for any `notFound()` thrown by a page inside the authed app — renders
 *  inside the dashboard shell (sidebar + top bar stay). */
export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-semibold leading-none tracking-tight text-muted-foreground/30">
        404
      </p>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This page doesn&apos;t exist, moved, or isn&apos;t available for this vertical.
          Use the sidebar to get where you&apos;re going.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
