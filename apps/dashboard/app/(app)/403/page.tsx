import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="text-2xl font-semibold">No access</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        You don't have permission to view this. Ask a super admin to grant you access to this
        vertical.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
